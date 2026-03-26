"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import CameraView from "@/components/camera/CameraView";

export default function CameraPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const handleCapture = () => {
    // In production: upload blob to API
    // For now: navigate to loading screen
    router.push("/loading-scan");
  };

  const handleGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production: upload file to API
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
