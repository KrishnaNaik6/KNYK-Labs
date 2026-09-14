import React from "react";
import { AlertCircle } from "lucide-react";
import { ContactButtons } from "./ContactButtons";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  showContact?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Services are temporarily unavailable",
  message = "We are currently syncing with our catalog service. Please contact us directly and our team will immediately help you explore the right solution for your project.",
  showContact = true,
  className = "",
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-cyan-500/20 shadow-xl shadow-cyan-950/20 ${className}`}
    >
      <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h3>

      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
        {message}
      </p>

      {showContact && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
            Connect with our team directly
          </p>
          <ContactButtons />
        </div>
      )}
    </div>
  );
};
