import { readFileSync, existsSync } from 'fs';
import path from 'path';
import type Anthropic from '@anthropic-ai/sdk';

// Local QA without API calls. ANALYSIS_FIXTURE_DIR points at model responses
// written by a test agent from the same prompts:
//   list.json    list-step response (streamed to the client in small chunks)
//   enrich.json  {"dishes":[...]} for every dish; each request gets its chunk
//   detail.json  optional single-dish detail response
// Never active on Vercel, so a stray env var cannot fake production results.

export function fixtureDir(): string | null {
  const dir = process.env.ANALYSIS_FIXTURE_DIR;
  return dir && !process.env.VERCEL ? dir : null;
}

function readFixture(dir: string, name: string): string {
  const file = path.join(dir, name);
  if (!existsSync(file)) throw new Error(`Fixture missing: ${name}`);
  return readFileSync(file, 'utf8').trim();
}

function message(text: string): Anthropic.Message {
  return {
    id: 'msg_fixture',
    type: 'message',
    role: 'assistant',
    model: 'fixture',
    content: [{ type: 'text', text, citations: null }],
    stop_reason: 'end_turn',
    stop_sequence: null,
    usage: { input_tokens: 0, output_tokens: 0 },
  } as unknown as Anthropic.Message;
}

/** Minimal stand-in for client.messages.stream(): emits text in chunks with a short delay. */
export function fixtureStream(dir: string, name: string, chunkChars = 120, delayMs = 15) {
  const text = readFixture(dir, name);
  const listeners: ((t: string) => void)[] = [];
  const done = (async () => {
    await new Promise((r) => setTimeout(r, 0)); // let the caller attach listeners
    for (let i = 0; i < text.length; i += chunkChars) {
      for (const cb of listeners) cb(text.slice(i, i + chunkChars));
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return message(text);
  })();
  return {
    on(_event: 'text', cb: (t: string) => void) {
      listeners.push(cb);
      return this;
    },
    finalMessage: () => done,
  };
}

/**
 * Enrich response for the requested dishes, in request order, from enrich.json.
 * ANALYSIS_FIXTURE_DELAY_MS simulates model latency so pending UI can be checked.
 */
export async function fixtureEnrich(dir: string, requested: { id: string; original: string }[]): Promise<Anthropic.Message> {
  const delay = Number(process.env.ANALYSIS_FIXTURE_DELAY_MS) || 0;
  if (delay > 0) await new Promise((r) => setTimeout(r, delay));
  const all = JSON.parse(readFixture(dir, 'enrich.json')) as { dishes: { original: string }[] };
  const byName = new Map(all.dishes.map((d) => [d.original.trim(), d]));
  // The model echoes ids; fixture files are keyed by name, so attach the id here.
  const dishes = requested
    .map((r) => {
      const d = byName.get(r.original.trim());
      return d ? { id: r.id, ...d } : null;
    })
    .filter(Boolean);
  return message(JSON.stringify({ dishes }));
}

/**
 * Orientation answer as the model's text, from orient.json: {"text": "right"}
 * (which edge the tops of the letters face). "top" when the file is absent.
 */
export function fixtureOrient(dir: string): Anthropic.Message {
  const file = path.join(dir, 'orient.json');
  if (!existsSync(file)) return message('top');
  const j = JSON.parse(readFileSync(file, 'utf8')) as { text?: string };
  return message(j.text ?? 'top');
}

export function fixtureDetail(dir: string): Anthropic.Message {
  return message(readFixture(dir, 'detail.json'));
}
