"use client";

import React from "react";

interface LockedBlockProps {
  children: React.ReactNode;
  showIcon?: boolean;
}

export default function LockedBlock({
  children,
  showIcon = true,
}: LockedBlockProps) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Blurred content */}
      <div className="blur-[6px] select-none pointer-events-none">
        {children}
      </div>

      {/* Lock icon overlay */}
      {showIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-brown-dark/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-brown-medium"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
