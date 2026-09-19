"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { useWebsite } from "@/lib/context/WebsiteContext";

export const AnnouncementBanner: React.FC = () => {
  const { website } = useWebsite();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !website?.announcementBanner) {
    return null;
  }

  const content = (
    <div className="flex items-center justify-center gap-2 text-xs font-medium text-cyan-200">
      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
      <span>{website.announcementBanner}</span>
      {website.announcementLink && (
        <span className="inline-flex items-center gap-0.5 text-cyan-300 font-semibold underline underline-offset-2 ml-1">
          Explore <ArrowRight className="w-3 h-3" />
        </span>
      )}
    </div>
  );

  return (
    <div className="relative z-50 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-cyan-950/90 border-b border-cyan-500/20 px-4 py-2 text-center shadow-sm">
      {website.announcementLink ? (
        <Link
          href={website.announcementLink}
          className="block hover:opacity-90 transition-opacity"
        >
          {content}
        </Link>
      ) : (
        content
      )}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
