"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/loading/LoadingScreen";

export default function LoadingScanPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/results");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return <LoadingScreen />;
}
