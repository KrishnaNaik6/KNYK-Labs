import React from "react";
import { Badge } from "./Badge";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) => {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"} mb-12 md:mb-16 ${className}`}
    >
      {eyebrow && (
        <div className="mb-4">
          <Badge variant="cyan" className="uppercase tracking-widest text-[11px] font-semibold">
            {eyebrow}
          </Badge>
        </div>
      )}

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
        {title}
      </h2>

      {description && (
        <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};
