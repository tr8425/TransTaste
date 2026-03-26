"use client";

import { useState, useEffect } from "react";
import { FUN_FACTS_LOADING } from "@/lib/constants";
import FunFactCard from "@/components/common/FunFactCard";

const FOOD_EMOJIS = ["🍜", "🍣", "🥘", "🍛", "🍲", "🥟", "🍝", "🌮"];

export default function LoadingScreen() {
  const [factIndex, setFactIndex] = useState(0);
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    setFactIndex(Math.floor(Math.random() * FUN_FACTS_LOADING.length));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % FOOD_EMOJIS.length);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center px-6">
      {/* Animated emoji */}
      <div className="text-6xl mb-8 animate-bounce">
        {FOOD_EMOJIS[emojiIndex]}
      </div>

      {/* Status text */}
      <h2 className="text-lg font-semibold text-brown-dark mb-2">
        Analyzing your menu...
      </h2>
      <p className="text-sm text-brown-medium mb-8">
        Identifying dishes, flavors & allergens
      </p>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-cream-dark rounded-full overflow-hidden mb-10">
        <div className="h-full bg-coral rounded-full animate-progress" />
      </div>

      {/* Fun fact */}
      <div className="w-full max-w-sm">
        <FunFactCard fact={FUN_FACTS_LOADING[factIndex]} />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 95%;
          }
        }
        .animate-progress {
          animation: progress 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
