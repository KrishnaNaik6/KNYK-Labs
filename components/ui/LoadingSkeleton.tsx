import React from "react";

export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 animate-pulse flex flex-col justify-between h-72">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 w-24 bg-slate-800 rounded-full" />
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
        </div>
        <div className="h-7 w-3/4 bg-slate-800 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-800/60 rounded" />
          <div className="h-4 w-5/6 bg-slate-800/60 rounded" />
        </div>
      </div>
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div>
          <div className="h-3 w-16 bg-slate-800/50 rounded mb-1" />
          <div className="h-5 w-24 bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-28 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
};

export const ServiceGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
};
