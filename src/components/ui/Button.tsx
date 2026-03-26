"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: "bg-coral hover:bg-coral-dark text-white shadow-sm",
  secondary: "bg-transparent border-2 border-coral text-coral hover:bg-coral/5",
  ghost: "bg-transparent text-brown-medium hover:bg-cream-dark",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
