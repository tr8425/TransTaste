"use client";

interface FunFactCardProps {
  fact: string;
  dishName?: string;
}

export default function FunFactCard({ fact, dishName }: FunFactCardProps) {
  return (
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
    </div>
  );
}
