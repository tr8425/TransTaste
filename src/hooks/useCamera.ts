"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import jsQR from "jsqr";

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isReady: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  capture: () => Promise<Blob | null>;
  toggleFlash: () => Promise<void>;
  isFlashOn: boolean;
  qrData: string | null;
  clearQr: () => void;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearQr = useCallback(() => setQrData(null), []);

  const start = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStream(mediaStream);
      setIsReady(true);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Camera access denied"
      );
      setIsReady(false);
    }
  }, []);

  const stop = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsReady(false);
    setIsFlashOn(false);
  }, [stream]);

  const capture = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      if (!video || !isReady) {
        resolve(null);
        return;
      }

      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;

      // Compress: max 768px dimension, JPEG 80% (768px is sufficient for menu text OCR)
      const scale = Math.min(768 / video.videoWidth, 768 / video.videoHeight, 1);
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.8
      );
    });
  }, [isReady]);

  const toggleFlash = useCallback(async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;

    try {
      const newState = !isFlashOn;
      await track.applyConstraints({
        // @ts-expect-error - torch is not in standard types but supported on mobile
        advanced: [{ torch: newState }],
      });
      setIsFlashOn(newState);
    } catch {
      // Flash not supported on this device
    }
  }, [stream, isFlashOn]);

  // QR code scanning every 500ms while camera is active
  useEffect(() => {
    if (!isReady || !stream) return;

    if (!qrCanvasRef.current) {
      qrCanvasRef.current = document.createElement("canvas");
    }

    qrIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) return;

      const canvas = qrCanvasRef.current!;
      const scale = Math.min(480 / video.videoWidth, 480 / video.videoHeight, 1);
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code?.data) {
        setQrData(code.data);
      }
    }, 500);

    return () => {
      if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
    };
  }, [isReady, stream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      if (qrIntervalRef.current) clearInterval(qrIntervalRef.current);
    };
  }, [stream]);

  return { videoRef, stream, isReady, error, start, stop, capture, toggleFlash, isFlashOn, qrData, clearQr };
}
