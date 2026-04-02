"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CameraView from "@/components/camera/CameraView";
import { useTranslation } from "@/lib/i18n";

const MAX_IMAGES = 10;

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function CameraPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleCapture = async (blob?: Blob | null) => {
    if (!blob) return;
    const base64 = await blobToBase64(blob);
    sessionStorage.setItem("scanImage", base64);
    sessionStorage.setItem("scanInputType", "image");
    router.push("/loading-scan");
  };

  const handleQrDetected = (url: string) => {
    sessionStorage.setItem("scanImage", url);
    sessionStorage.setItem("scanInputType", "url");
    router.push("/loading-scan");
  };

  const handleGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Single file: existing immediate behavior
    if (files.length === 1 && selectedFiles.length === 0) {
      const base64 = await blobToBase64(files[0]);
      sessionStorage.setItem("scanImage", base64);
      sessionStorage.setItem("scanInputType", "image");
      router.push("/loading-scan");
      return;
    }

    // Multiple files: show preview overlay
    const combined = [...selectedFiles, ...files].slice(0, MAX_IMAGES);
    setSelectedFiles(combined);

    const previewUrls = combined.map((f) => URL.createObjectURL(f));
    setPreviews(previewUrls);
    setShowPreview(true);

    // Reset input so the same files can be re-selected
    e.target.value = "";
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeAll = async () => {
    const base64Array = await Promise.all(
      selectedFiles.map((f) => blobToBase64(f))
    );
    const joined = base64Array.join("|||");
    sessionStorage.setItem("scanImage", joined);
    sessionStorage.setItem("scanInputType", "image");
    router.push("/loading-scan");
  };

  const handleCancel = () => {
    // Revoke object URLs to free memory
    previews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
    setShowPreview(false);
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    if (newFiles.length === 0) {
      setShowPreview(false);
    }
  };

  return (
    <>
      <CameraView onCapture={handleCapture} onGallery={handleGallery} onBack={() => router.back()} onQrDetected={handleQrDetected} />
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
              {t("camera.imagesSelected", { count: selectedFiles.length })}
            </p>

            {/* Thumbnail grid */}
            <div className="mb-4 grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt={`Menu image ${i + 1}`}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(i)}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-xs text-white shadow"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add more button */}
            {selectedFiles.length < MAX_IMAGES && (
              <button
                onClick={handleAddMore}
                className="mb-3 w-full rounded-xl border-2 border-dashed border-coral/40 py-3 text-sm font-medium text-coral transition-colors hover:border-coral"
              >
                {t("camera.addMore", { max: MAX_IMAGES })}
              </button>
            )}

            {/* Analyze All button */}
            <button
              onClick={handleAnalyzeAll}
              className="mb-3 w-full rounded-xl bg-coral py-4 text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
            >
              {t("camera.analyzeAll")}
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
