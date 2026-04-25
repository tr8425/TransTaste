#!/usr/bin/env node
/**
 * i18n parity guard.
 * Compares src/lib/i18n/ko.json and en.json key trees.
 * Exits non-zero on mismatch so CI/builds fail loudly.
 *
 * Run: node scripts/check-i18n.mjs
 * Run via npm: npm run check:i18n
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const KO_PATH = resolve(ROOT, "src/lib/i18n/ko.json");
const EN_PATH = resolve(ROOT, "src/lib/i18n/en.json");

function loadJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    console.error(`[i18n] Failed to read ${path}: ${err.message}`);
    process.exit(2);
  }
}

function walkKeys(obj, prefix = "") {
  const out = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const path = prefix + key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out.push(...walkKeys(value, path + "."));
    } else {
      out.push(path);
    }
  }
  return out;
}

function findEmptyValues(obj, prefix = "") {
  const out = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const path = prefix + key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out.push(...findEmptyValues(value, path + "."));
    } else if (typeof value === "string" && value.trim() === "") {
      out.push(path);
    }
  }
  return out;
}

const ko = loadJson(KO_PATH);
const en = loadJson(EN_PATH);

const koKeys = new Set(walkKeys(ko));
const enKeys = new Set(walkKeys(en));

const koOnly = [...koKeys].filter((k) => !enKeys.has(k));
const enOnly = [...enKeys].filter((k) => !koKeys.has(k));
const koEmpty = findEmptyValues(ko);
const enEmpty = findEmptyValues(en);

const issues = [];
if (koOnly.length) issues.push(["ko-only keys (missing in en)", koOnly]);
if (enOnly.length) issues.push(["en-only keys (missing in ko)", enOnly]);
if (koEmpty.length) issues.push(["empty values in ko", koEmpty]);
if (enEmpty.length) issues.push(["empty values in en", enEmpty]);

if (issues.length === 0) {
  console.log(`[i18n] OK — ko=${koKeys.size}, en=${enKeys.size}, fully synchronized.`);
  process.exit(0);
}

console.error(`[i18n] Mismatch detected — ko=${koKeys.size}, en=${enKeys.size}`);
for (const [label, items] of issues) {
  console.error(`\n  ${label} (${items.length}):`);
  for (const k of items.slice(0, 30)) console.error(`    - ${k}`);
  if (items.length > 30) console.error(`    ... and ${items.length - 30} more`);
}
console.error("\n[i18n] Fix the JSON files or update both languages together.");
process.exit(1);
