"use client";

import { useState } from "react";

interface FunFactCardProps {
  fact: string | null;
  dishName?: string;
  detail?: { label: string; content: string } | null;
  warning?: { level: string | null; message: string } | null;
}

export default function FunFactCard({ fact, dishName, detail, warning }: FunFactCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Nothing to render if no fact and no warning
  if (!fact && !warning) return null;

  return (
    <div className="space-y-2">
      {/* Main fun fact — only render if non-null */}
      {fact && (
        <div className="rounded-xl border border-brown-light/20 border-l-4 border-l-amber-brand bg-cream-dark p-4">
          {dishName && (
            <p className="mb-1 text-xs font-medium text-brown-medium">
              About {dishName}
            </p>
          )}
          <p className="text-sm leading-relaxed text-brown-dark">
            <span className="mr-1.5" aria-hidden="true">
              💡
            </span>
            {fact}
          </p>

          {/* Collapsible detail */}
          {detail && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsDetailOpen(!isDetailOpen)}
                className="text-sm text-brown-medium hover:text-brown-dark transition-colors"
              >
                {isDetailOpen ? "▼" : "▶"} {detail.label}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isDetailOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm text-brown-dark leading-relaxed pl-4">
                  {detail.content}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warning banner */}
      {warning && (
        <div className="rounded-xl px-4 py-2.5 flex items-start gap-2" style={{ backgroundColor: "#FEF3C7" }}>
          <span className="text-amber-600 text-xs mt-0.5" aria-hidden="true">⚠</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            {warning.message}
          </p>
        </div>
      )}
    </div>
  );
}
