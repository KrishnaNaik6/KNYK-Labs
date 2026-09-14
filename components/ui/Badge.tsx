import React from "react";

export interface BadgeProps {
  variant?: "cyan" | "teal" | "neutral" | "featured";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "cyan",
  children,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors";

  const variantStyles = {
    cyan: "bg-cyan-950/60 text-cyan-300 border border-cyan-500/30",
    teal: "bg-teal-950/60 text-teal-300 border border-teal-500/30",
    neutral: "bg-slate-800/80 text-slate-300 border border-slate-700/60",
    featured:
      "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
