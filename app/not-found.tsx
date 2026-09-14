import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="pt-36 pb-24 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="glass-panel rounded-3xl p-10 md:p-14 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-8 h-8" />
          </div>

          <span className="inline-block text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold">
            Error 404
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Service not found
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The service you&apos;re looking for may have been moved or is no longer available.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="md" href="/services">
              <span>Back to Services</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <Button variant="secondary" size="md" href="/contact">
              Start a Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
