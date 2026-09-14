import { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getPortfolioProjects } from "@/lib/nexis/client";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CTASection } from "@/components/sections/CTASection";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Selected Portfolio & Work",
  description:
    "Explore selected projects, case studies, and engineering achievements across software, design, and automation by KNYK Labs.",
};

export default async function PortfolioPage() {
  const { projects, isAvailable } = await getPortfolioProjects();

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Proof of Work"
          title={
            <>
              Selected projects &{" "}
              <span className="text-gradient-cyan">case studies</span>
            </>
          }
          description="A curated overview of software architectures, visual branding packages, and automation workflows engineered by KNYK Labs."
        />

        {/* Dynamic or Empty State */}
        {isAvailable && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {projects.map((proj) => (
              <div
                key={proj.id || proj.slug}
                className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      {proj.category || "Case Study"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {proj.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {proj.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {proj.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-[11px] text-slate-400 font-mono border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Elegant Coming Soon State */
          <div className="max-w-3xl mx-auto my-12 text-center">
            <div className="glass-panel rounded-3xl p-10 md:p-16 border border-cyan-500/20 shadow-2xl shadow-cyan-950/30 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-8 h-8" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Selected Work is Coming Soon
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                We are currently curating in-depth case studies, live demos, and design breakdowns from our latest client engagements for public release.
              </p>

              <div className="pt-2 text-xs text-slate-400 bg-slate-900/60 rounded-xl p-4 border border-slate-800 max-w-md mx-auto">
                Interested in evaluating recent work for a specific technical stack or design requirement? We are happy to share private demonstrations on request.
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppButton label="Request Private Case Studies" />
                <Button variant="secondary" href="/services">
                  Browse Active Services
                </Button>
              </div>
            </div>
          </div>
        )}

        <CTASection />
      </div>
    </div>
  );
}
