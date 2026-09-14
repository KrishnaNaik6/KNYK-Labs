import { ShieldCheck, Code2, KeyRound, Clock, CheckCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const COMMITMENTS = [
  {
    icon: <KeyRound className="w-5 h-5 text-cyan-400" />,
    title: "Full IP & Asset Handover",
    description:
      "All source repositories, vector files, deployment configurations, and documentation become 100% your property upon project completion.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
    title: "Milestone-Guaranteed Terms",
    description:
      "Advance payments are tied directly to clearly scoped deliverables. You review demonstrable progress before final milestone releases.",
  },
  {
    icon: <Code2 className="w-5 h-5 text-cyan-300" />,
    title: "Production-Grade Codebase",
    description:
      "We avoid fragile shortcuts. Every line of code is structured with TypeScript, modern component conventions, and clean maintainability.",
  },
  {
    icon: <Clock className="w-5 h-5 text-teal-300" />,
    title: "Direct Engineering Access",
    description:
      "No account managers or administrative telephone games. You communicate directly with the creators and engineers executing your project.",
  },
];

export const ClientCommitments: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Standard of Engagement"
          title={
            <>
              Client commitments,{" "}
              <span className="text-gradient-cyan">zero compromises</span>
            </>
          }
          description="Our factual operating commitments for every project, ensuring clarity, security, and exceptional delivery standards."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMITMENTS.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5">
                  {item.icon}
                </div>

                <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Standard Policy</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
