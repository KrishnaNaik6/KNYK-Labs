import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background glowing gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel rounded-3xl p-8 md:p-14 lg:p-16 border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl shadow-cyan-950/30">
          {/* Subtle geometric lines */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-cyan-500/10 to-transparent blur-2xl pointer-events-none" />

          <span className="inline-block text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
            Ready to Take the Next Step?
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
            Let&apos;s build something that sets your brand apart.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you need a full-scale web application, brand identity overhaul, high-impact media production, or custom automation, we are ready to execute.
          </p>

          {/* Action row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/contact" className="w-full sm:w-auto">
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <WhatsAppButton size="lg" className="w-full sm:w-auto" label="Chat on WhatsApp" />

            <CallButton size="lg" className="w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};
