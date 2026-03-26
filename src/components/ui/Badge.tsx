"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  className?: string;
}

export default function Badge({
  children,
  color,
  bgColor,
  className = "",
}: BadgeProps) {
  const hasCustomColors = color || bgColor;

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center ${!hasCustomColors ? "bg-cream-dark text-brown-medium" : ""} ${className}`}
      style={{
        ...(color ? { color } : {}),
        ...(bgColor ? { backgroundColor: bgColor } : {}),
      }}
    >
      {children}
    </span>
  );
}
