import { Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function NotFound() {
  return (
    <div className="pt-36 pb-24 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="glass-panel rounded-3xl p-10 md:p-14 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-8 h-8" />
          </div>

          <span className="inline-block text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold">
            Error 404 // Page Not Found
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Lost in the digital space
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The page or service you are looking for does not exist, has moved, or is temporarily unavailable.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" size="md" href="/">
              <span>Return Home</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <Button variant="secondary" size="md" href="/services">
              Browse Services
            </Button>

            <WhatsAppButton size="md" label="Help on WhatsApp" />
          </div>
        </div>
      </div>
    </div>
  );
}
