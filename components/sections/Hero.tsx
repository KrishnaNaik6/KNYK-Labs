import React from "react";
import { ArrowRight, Code2, Cpu, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background ambient glow spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-medium text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>KNYK Labs Digital Studio</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">Accepting New Projects</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Software, AI &amp; Digital Solutions for{" "}
              <span className="text-gradient-cyan">Modern Businesses</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Freelance and custom software engineering, modern web applications, visual branding, and intelligent AI automation systems built for ambitious businesses and creators.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button variant="primary" size="lg" href="/contact" className="w-full sm:w-auto">
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <Button variant="secondary" size="lg" href="/services" className="w-full sm:w-auto">
                <span>Explore Services</span>
              </Button>

              <WhatsAppButton size="lg" className="w-full sm:w-auto" label="WhatsApp" />
            </div>

            {/* Capability Badges */}
            <div className="pt-6 border-t border-slate-800/80">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
                Core Domains of Execution
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge variant="neutral">Software & Web</Badge>
                <Badge variant="neutral">Graphic Design</Badge>
                <Badge variant="neutral">Photo & Video</Badge>
                <Badge variant="neutral">Presentations & Docs</Badge>
                <Badge variant="neutral">AI & Automation</Badge>
                <Badge variant="neutral">Digital Solutions</Badge>
              </div>
            </div>
          </div>

          {/* Abstract Technology Visual Element */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="relative rounded-2xl glass-panel p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
                {/* Console header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-slate-400 ml-2">
                      knyk-core // runtime
                    </span>
                  </div>
                  <Badge variant="cyan" className="text-[10px] py-0">
                    LIVE
                  </Badge>
                </div>

                {/* Simulated interactive modules */}
                <div className="space-y-4 font-mono text-xs">
                  {/* Module 1: Software */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Web & App Platforms</div>
                        <div className="text-[10px] text-slate-400">Next.js • Cloud • Clean APIs</div>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-[11px] font-semibold">99.9%</span>
                  </div>

                  {/* Module 2: AI & Automation */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">AI & Automation Hub</div>
                        <div className="text-[10px] text-slate-400">Custom Workflows • Intelligent Bots</div>
                      </div>
                    </div>
                    <span className="text-cyan-400 text-[11px] font-semibold">SYNCED</span>
                  </div>

                  {/* Module 3: Visual & Media */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Visual Identity & Media</div>
                        <div className="text-[10px] text-slate-400">UI/UX • Branding • Motion</div>
                      </div>
                    </div>
                    <span className="text-teal-400 text-[11px] font-semibold">4K ULTRA</span>
                  </div>
                </div>

                {/* Bottom stats banner */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>NEXIS Controlled</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Transparent Milestones
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
