"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import CameraView from "@/components/camera/CameraView";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function CameraPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const handleCapture = async (blob?: Blob | null) => {
    if (!blob) return;
    const base64 = await blobToBase64(blob);
    sessionStorage.setItem("scanImage", base64);
    sessionStorage.setItem("scanInputType", "image");
    router.push("/loading-scan");
  };

  const handleGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await blobToBase64(file);
      sessionStorage.setItem("scanImage", base64);
      sessionStorage.setItem("scanInputType", "image");
      router.push("/loading-scan");
    }
  };

  return (
    <>
      <CameraView onCapture={handleCapture} onGallery={handleGallery} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
}
