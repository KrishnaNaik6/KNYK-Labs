import { ServiceGridSkeleton } from "@/components/ui/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto mb-12 text-center space-y-3">
        <div className="h-6 w-32 bg-slate-800 rounded-full mx-auto animate-pulse" />
        <div className="h-10 w-3/4 bg-slate-800 rounded-xl mx-auto animate-pulse" />
        <div className="h-5 w-1/2 bg-slate-800/60 rounded-lg mx-auto animate-pulse" />
      </div>

      <ServiceGridSkeleton count={6} />
    </div>
  );
}
