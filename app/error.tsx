"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactButtons } from "@/components/ui/ContactButtons";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors safely
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="pt-36 pb-24 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="glass-panel rounded-3xl p-10 md:p-14 border border-rose-500/30 shadow-2xl shadow-rose-950/20 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Unexpected System Disruption
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We encountered a temporary issue while rendering this view. You can retry loading the page or contact our team directly.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => reset()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>

            <Button variant="secondary" size="md" href="/">
              Return to Home
            </Button>
          </div>

          <div className="pt-6 border-t border-slate-800/80">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Need immediate assistance?
            </p>
            <div className="flex justify-center">
              <ContactButtons size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
