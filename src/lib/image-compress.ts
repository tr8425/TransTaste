/**
 * Compress and resize an image blob/base64 before sending to the API.
 * Target: max 1600px on longest side, JPEG quality 0.75 → typically < 300KB
 */

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.75;

/**
 * Compress a Blob (from camera/gallery) into a smaller base64 data URI.
 * `rotation` (0/90/180/270, clockwise) turns a sideways menu photo upright in
 * the same pass.
 */
export async function compressBlob(blob: Blob, rotation = 0): Promise<string> {
  return drawToDataUrl(blob, MAX_DIMENSION, JPEG_QUALITY, rotation);
}

/** Small JPEG for the orientation check (/api/analyze/orient). */
export async function makeThumbnail(blob: Blob, maxDimension = 512): Promise<string> {
  return drawToDataUrl(blob, maxDimension, 0.7, 0);
}

async function drawToDataUrl(blob: Blob, maxDimension: number, quality: number, rotation: number): Promise<string> {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = getScaledDimensions(bitmap.width, bitmap.height, maxDimension);
  const turn = ((rotation % 360) + 360) % 360;
  const sideways = turn === 90 || turn === 270;

  const canvas = new OffscreenCanvas(sideways ? height : width, sideways ? width : height);
  const ctx = canvas.getContext('2d')!;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((turn * Math.PI) / 180);
  ctx.drawImage(bitmap, -width / 2, -height / 2, width, height);
  bitmap.close();

  const compressed = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  return blobToBase64(compressed);
}

/**
 * Compress an existing base64 data URI string into a smaller one.
 */
export async function compressBase64(dataUri: string): Promise<string> {
  const blob = await (await fetch(dataUri)).blob();
  return compressBlob(blob);
}

function getScaledDimensions(w: number, h: number, max = MAX_DIMENSION): { width: number; height: number } {
  if (w <= max && h <= max) return { width: w, height: h };
  const ratio = Math.min(max / w, max / h);
  return {
    width: Math.round(w * ratio),
    height: Math.round(h * ratio),
  };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
