import { makeThumbnail } from "./image-compress";

// Menu photos are often shot sideways with no EXIF orientation to fix them
// (the phone was held sideways, or a messenger app re-encoded the photo).
// Upright photos read noticeably better: on a 70-item Hong Kong menu, 72 dishes
// were found instead of 66, and 9 of 12 sampled prices were right instead of 5.

export type Rotation = 0 | 90 | 180 | 270;

const TIMEOUT_MS = 5000;

/**
 * Asks the server how far (clockwise) the photo must turn to be upright.
 * Any failure or timeout returns 0, so scanning never waits on this check.
 */
export async function detectRotation(blob: Blob): Promise<Rotation> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  // The deadline covers thumbnail creation as well as the request.
  const deadline = new Promise<Rotation>((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve(0);
    }, TIMEOUT_MS);
  });
  return Promise.race([check(blob, controller.signal), deadline]).finally(() => clearTimeout(timer));
}

async function check(blob: Blob, signal: AbortSignal): Promise<Rotation> {
  try {
    const image = await makeThumbnail(blob);
    const res = await fetch("/api/analyze/orient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
      signal,
    });
    if (!res.ok) return 0;
    const body = await res.json().catch(() => ({}));
    return [0, 90, 180, 270].includes(body.rotation) ? (body.rotation as Rotation) : 0;
  } catch {
    return 0;
  }
}
