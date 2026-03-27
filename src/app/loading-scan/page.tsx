"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/loading/LoadingScreen";

export default function LoadingScanPage() {
  const router = useRouter();

  useEffect(() => {
    const inputType = sessionStorage.getItem("scanInputType") as "image" | "url" | "text" | null;
    const imageData = sessionStorage.getItem("scanImage");
    const textData = sessionStorage.getItem("scanText");

    // Determine the input and type
    let input: string | null = null;
    let type: "image" | "url" | "text" = "image";

    if (inputType === "text" && textData) {
      input = textData;
      type = "text";
    } else if (inputType === "url" && imageData) {
      input = imageData;
      type = "url";
    } else if (imageData) {
      input = imageData;
      type = "image";
    }

    if (!input) {
      sessionStorage.setItem("scanError", "No image or text provided. Please try again.");
      router.push("/results");
      return;
    }

    // Clear stored input data
    sessionStorage.removeItem("scanImage");
    sessionStorage.removeItem("scanText");
    sessionStorage.removeItem("scanInputType");

    const analyze = async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, inputType: type }),
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(errBody || `Server error: ${res.status}`);
        }

        const result = await res.json();
        sessionStorage.setItem("scanResult", JSON.stringify(result));
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        sessionStorage.setItem("scanError", message);
      }

      router.push("/results");
    };

    analyze();
  }, [router]);

  return <LoadingScreen />;
}
