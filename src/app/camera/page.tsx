"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CameraView from "@/components/camera/CameraView";
import { useTranslation } from "@/lib/i18n";
import { compressBlob } from "@/lib/image-compress";
import { detectRotation, type Rotation } from "@/lib/image-orient";

const MAX_IMAGES = 10;

interface SelectedImage {
  id: number;
  blob: Blob;
  url: string;
  /** Clockwise degrees applied before upload. */
  rotation: Rotation;
  /** The user turned it by hand; the automatic check no longer overrides it. */
  manual: boolean;
  /** Preview angle; keeps counting up so a manual turn always animates clockwise. */
  displayDeg: number;
  detecting: boolean;
}

let nextImageId = 0;

export default function CameraPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const [images, setImagesState] = useState<SelectedImage[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [prepareFailed, setPrepareFailed] = useState(false);
  // Latest list, updated synchronously: "analyze" reads it right after the
  // orientation checks resolve, before React re-renders.
  const imagesRef = useRef<SelectedImage[]>([]);
  const setImages = (update: (prev: SelectedImage[]) => SelectedImage[]) => {
    imagesRef.current = update(imagesRef.current);
    setImagesState(imagesRef.current);
  };
  // Orientation checks in flight, so "analyze" can wait for them briefly.
  const detections = useRef(new Map<number, Promise<void>>());
  // Bumped by cancel; a preparation started under an older value is dropped.
  const generation = useRef(0);

  // Each new photo gets an automatic orientation check; the preview shows the
  // result and the user can still turn it by hand.
  const startDetection = (image: SelectedImage) => {
    const job = detectRotation(image.blob).then((rotation) => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? img.manual
              ? { ...img, detecting: false }
              : { ...img, detecting: false, rotation, displayDeg: rotation }
            : img,
        ),
      );
      detections.current.delete(image.id);
    });
    detections.current.set(image.id, job);
  };

  const addImages = (blobs: Blob[], replace: boolean) => {
    if (preparing) return;
    const current = imagesRef.current;
    const keep = replace ? [] : current;
    if (replace) current.forEach((img) => URL.revokeObjectURL(img.url));
    const room = Math.max(0, MAX_IMAGES - keep.length);
    const added: SelectedImage[] = blobs.slice(0, room).map((blob) => ({
      id: nextImageId++,
      blob,
      url: URL.createObjectURL(blob),
      rotation: 0,
      manual: false,
      displayDeg: 0,
      detecting: true,
    }));
    const next = [...keep, ...added];
    setImages(() => next);
    setShowPreview(next.length > 0);
    added.forEach(startDetection);
  };

  const handleCapture = (blob?: Blob | null) => {
    if (!blob) return;
    addImages([blob], true);
  };

  const handleQrDetected = (url: string) => {
    sessionStorage.setItem("scanImage", url);
    sessionStorage.setItem("scanInputType", "url");
    router.push("/scan-setup");
  };

  const handleGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    addImages(files, false);

    // Reset input so the same files can be re-selected
    e.target.value = "";
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeAll = async () => {
    if (imagesRef.current.length === 0 || preparing) return;
    const run = generation.current;
    setPreparing(true);
    setPrepareFailed(false);
    try {
      // Checks time out on their own (detectRotation), so this wait is bounded.
      // Edits are blocked while preparing, so no new check can start meanwhile.
      await Promise.all(Array.from(detections.current.values()));
      if (run !== generation.current) return;
      const ready = imagesRef.current;
      if (ready.length === 0) return;
      const base64Array = await Promise.all(ready.map((img) => compressBlob(img.blob, img.rotation)));
      if (run !== generation.current) return;
      sessionStorage.setItem("scanImage", base64Array.join("|||"));
      sessionStorage.setItem("scanInputType", "image");
      ready.forEach((img) => URL.revokeObjectURL(img.url));
      router.push("/scan-setup");
    } catch {
      // Undecodable photo or full sessionStorage: let the user fix it and retry.
      if (run === generation.current) setPrepareFailed(true);
    } finally {
      if (run === generation.current) setPreparing(false);
    }
  };

  const handleCancel = () => {
    generation.current += 1;
    setPreparing(false);
    setPrepareFailed(false);
    // Revoke object URLs to free memory
    imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    setImages(() => []);
    setShowPreview(false);
  };

  const handleRemoveImage = (id: number) => {
    if (preparing) return;
    const target = imagesRef.current.find((img) => img.id === id);
    if (target) URL.revokeObjectURL(target.url);
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (imagesRef.current.length === 0) setShowPreview(false);
  };

  const handleRotate = (id: number) => {
    if (preparing) return;
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, rotation: ((img.rotation + 90) % 360) as Rotation, displayDeg: img.displayDeg + 90, manual: true }
          : img,
      ),
    );
  };

  return (
    <>
      <CameraView onCapture={handleCapture} onGallery={handleGallery} onBack={() => router.push("/")} onQrDetected={handleQrDetected} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Multi-image preview overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <div className="w-full rounded-t-2xl bg-cream px-5 pb-8 pt-6 animate-in slide-in-from-bottom">
            {/* Header */}
            <p className="mb-4 text-center text-lg font-semibold text-charcoal">
              {t("camera.imagesSelected", { count: images.length })}
            </p>

            {/* Thumbnail grid */}
            <div className="mb-4 grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {images.map((img, i) => (
                <div key={img.id} className="relative">
                  <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-charcoal/10">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob URL preview, next/image not applicable */}
                    <img
                      src={img.url}
                      alt={`Menu image ${i + 1}`}
                      className="max-h-full max-w-full object-contain transition-transform duration-200"
                      style={{
                        transform: `rotate(${img.displayDeg}deg)${img.rotation % 180 ? " scale(0.75)" : ""}`,
                      }}
                    />
                  </div>
                  {img.detecting && !img.manual && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-charcoal/70 px-2 py-0.5 text-micro text-white">
                      {t("camera.orientChecking")}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={preparing}
                    onClick={() => handleRotate(img.id)}
                    aria-label={`${t("camera.rotateImage")} ${i + 1}`}
                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-base text-charcoal shadow"
                  >
                    ↻
                  </button>
                  <button
                    type="button"
                    disabled={preparing}
                    onClick={() => handleRemoveImage(img.id)}
                    aria-label={`${t("common.aria.removeItem")} ${i + 1}`}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-xs text-white shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add more button */}
            <p className="mb-3 text-center text-xs text-charcoal/60">{t("camera.rotateHint")}</p>

            {images.length < MAX_IMAGES && (
              <button
                onClick={handleAddMore}
                disabled={preparing}
                className="mb-3 w-full rounded-xl border-2 border-dashed border-coral/40 py-3 text-sm font-medium text-coral transition-colors hover:border-coral"
              >
                {t("camera.addMore", { max: MAX_IMAGES })}
              </button>
            )}

            {prepareFailed && (
              <p className="mb-2 text-center text-xs text-danger" role="alert">
                {t("camera.prepareFailed")}
              </p>
            )}

            {/* Analyze All button */}
            <button
              onClick={handleAnalyzeAll}
              disabled={preparing}
              className="mb-3 w-full rounded-xl bg-coral py-4 text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              {preparing ? t("camera.preparing") : t("camera.analyzeAll")}
            </button>

            {/* Cancel button */}
            <button
              onClick={handleCancel}
              className="w-full py-2 text-sm font-medium text-charcoal/60 transition-colors hover:text-charcoal"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
