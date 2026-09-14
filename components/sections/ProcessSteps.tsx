import React from "react";
import { MessageSquare, FileText, CreditCard, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    step: "01",
    title: "Browse & Choose Service",
    description:
      "Explore our dynamic service catalog with clear starting pricing, turnaround estimates, and feature scopes.",
    icon: <FileText className="w-5 h-5 text-cyan-400" />,
  },
  {
    step: "02",
    title: "Direct Consultation",
    description:
      "Connect instantly via WhatsApp, phone call, or enquiry form to discuss your specific goals and finalize requirements.",
    icon: <MessageSquare className="w-5 h-5 text-teal-400" />,
  },
  {
    step: "03",
    title: "Transparent Quote & Advance",
    description:
      "Receive a structured written quote with clearly stated deliverables. Project kicks off with an agreed milestone advance.",
    icon: <CreditCard className="w-5 h-5 text-cyan-300" />,
  },
  {
    step: "04",
    title: "Execution & Final Delivery",
    description:
      "We build, test, and iterate with regular sprint updates, handing over source code, assets, and complete documentation.",
    icon: <Rocket className="w-5 h-5 text-teal-300" />,
  },
];

export const ProcessSteps: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#070b15]/40 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Frictionless Engagement"
          title={
            <>
              How we work together,{" "}
              <span className="text-gradient-cyan">step by step</span>
            </>
          }
          description="A direct, transparent collaboration process designed to get from initial scope to live deployment without unnecessary friction."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between relative group hover:border-cyan-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-mono text-xl font-black text-cyan-400/40 group-hover:text-cyan-400 transition-colors">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Phase {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
