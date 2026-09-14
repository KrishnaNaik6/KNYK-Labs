import React from "react";
import { Layers, ShieldCheck, Zap, Workflow, Compass, Gauge } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PILLARS = [
  {
    icon: <Layers className="w-6 h-6 text-cyan-400" />,
    title: "Multi-Disciplinary Studio",
    description:
      "Seamless integration between software engineering, brand identity, motion media, and process automation under one unified standard.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
    title: "Transparent Milestones",
    description:
      "Predictable starting pricing, structured advance terms, and clearly agreed delivery milestones with zero hidden fees.",
  },
  {
    icon: <Workflow className="w-6 h-6 text-cyan-300" />,
    title: "Intelligent Automation",
    description:
      "We design automated workflows and modern AI pipelines directly into your operations to eliminate repetitive manual overhead.",
  },
  {
    icon: <Compass className="w-6 h-6 text-teal-300" />,
    title: "Direct Builder Collaboration",
    description:
      "Work directly with skilled engineers and designers who craft your project. Fast feedback loops without agency bureaucracy.",
  },
  {
    icon: <Gauge className="w-6 h-6 text-cyan-400" />,
    title: "Performance by Default",
    description:
      "From ultra-fast web interfaces to crisp vector branding, we optimize every deliverable for speed, responsiveness, and scale.",
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "NEXIS-Powered Operations",
    description:
      "Streamlined project tracking, real-time catalog syncing, and consistent execution powered by our centralized control infrastructure.",
  },
];

export const WhyKnyk: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#070b15]/60 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The KNYK Advantage"
          title={
            <>
              Engineered for velocity,{" "}
              <span className="text-gradient-cyan">built for impact</span>
            </>
          }
          description="We combine engineering discipline with creative design to deliver tangible business outcomes rather than generic templates."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-2xl p-7 border border-slate-800/80 hover:border-cyan-500/30 flex flex-col justify-start"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 shadow-inner">
                {pillar.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">
                {pillar.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
