import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No items found",
  message = "No matching items are available at the moment. Please check back shortly or reach out directly.",
  actionLabel,
  actionHref,
  className = "",
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-8 md:p-12 text-center max-w-xl mx-auto border border-slate-800 ${className}`}
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
        <FolderOpen className="w-6 h-6" />
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        {message}
      </p>

      {actionLabel && actionHref && (
        <Button variant="secondary" size="sm" href={actionHref}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
