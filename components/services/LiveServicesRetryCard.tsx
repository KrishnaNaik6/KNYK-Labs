"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, RefreshCw, Radio } from "lucide-react";
import { Service, Category } from "@/lib/nexis/types";
import { ContactButtons } from "@/components/ui/ContactButtons";

export interface LiveServicesRetryCardProps {
  onLoaded: (catalog: { services: Service[]; categories: Category[] }) => void;
  className?: string;
}

export const LiveServicesRetryCard: React.FC<LiveServicesRetryCardProps> = ({
  onLoaded,
  className = "",
}) => {
  const [countdown, setCountdown] = useState<number>(10);
  const [attempts, setAttempts] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const isFetchingRef = useRef<boolean>(false);

  const fetchCatalog = useCallback(async () => {
    if (isFetchingRef.current) return false;
    isFetchingRef.current = true;
    setIsFetching(true);

    try {
      const response = await fetch("/api/services", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.services) && data.services.length > 0) {
          onLoaded({
            services: data.services as Service[],
            categories: (data.categories as Category[]) || [],
          });
          return true;
        }
      }
    } catch (err) {
      console.warn("[LiveServicesRetryCard] Auto-sync attempt failed:", err);
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
    return false;
  }, [onLoaded]);

  const handleManualRetry = () => {
    setCountdown(10);
    setAttempts((prev) => prev + 1);
    fetchCatalog();
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchCatalog();

    // 1-second interval countdown for 10s auto-retry loop
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setAttempts((a) => a + 1);
          fetchCatalog();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchCatalog]);

  const isWakingUp = attempts > 5;

  return (
    <div
      className={`w-full max-w-lg mx-auto p-7 sm:p-9 rounded-3xl glass-panel border border-cyan-500/30 shadow-[0_20px_50px_rgba(6,182,212,0.12)] text-center relative overflow-hidden ${className}`}
    >
      {/* Ambient background glow effects */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Cybernetic Animated Centerpiece Icon */}
      <div className="relative mb-5 inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center relative shadow-lg shadow-cyan-950/50">
          <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
          <span className="absolute -inset-1 rounded-2xl border border-cyan-400/40 animate-spin [animation-duration:4s]" />
        </div>
      </div>

      {/* Status Badges */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
            {isWakingUp ? "Waking Up Cloud Control Center" : "Connecting to Live Services"}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {isWakingUp ? "Cloud Instance Starting Up" : "Connecting to Service Catalog"}
        </h3>

        <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
          {isWakingUp
            ? "Render server is booting from cold standby. Services will appear automatically once connected."
            : "Directly syncing with the NEXIS control center. Auto-refreshing every 10 seconds."}
        </p>
      </div>

      {/* Attempt counter pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 mb-6">
        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>Attempt #{attempts}</span>
        <span className="text-slate-600">•</span>
        <span>Auto-retrying in {countdown}s</span>
      </div>

      {/* Action / Retry Button */}
      <div className="mb-7">
        <button
          type="button"
          onClick={handleManualRetry}
          disabled={isFetching}
          aria-label="Retry loading services"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-cyan-500/40 active:scale-95 cursor-pointer"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform"}`}
          />
          <span>{isFetching ? "Connecting to Server..." : `Retry Now (${countdown}s)`}</span>
        </button>
      </div>

      {/* Direct Fallback Channels */}
      <div className="pt-6 border-t border-slate-800/80">
        <p className="text-xs text-slate-400 mb-3.5">
          Need an immediate quote or consultation? Connect directly:
        </p>
        <div className="flex justify-center">
          <ContactButtons size="sm" className="justify-center" />
        </div>
      </div>
    </div>
  );
};
