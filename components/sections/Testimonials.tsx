import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FeedbackItem {
  feedback: string;
  author: string;
  role: string;
  tag: string;
}

const FEEDBACK: FeedbackItem[] = [
  {
    feedback:
      "KNYK Labs delivered our web platform with exceptional attention to modern design and API performance. The turnaround was prompt, and the milestones were clear from day one.",
    author: "Founder & Product Lead",
    role: "Digital Services & SaaS Startup",
    tag: "Software Engineering",
  },
  {
    feedback:
      "The automation pipeline they implemented cut down hours of manual data intake each week. Pragmatic solutions, clean code, and great communication throughout.",
    author: "Operations Director",
    role: "E-commerce & Brand Collective",
    tag: "Workflow Automation",
  },
  {
    feedback:
      "From identity assets to high-definition presentation decks, the creative quality stood out. They understood our technical domain immediately without handholding.",
    author: "Technology Executive",
    role: "B2B Solutions Firm",
    tag: "Brand & Media",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client Trust"
          title={
            <>
              Built on reliability,{" "}
              <span className="text-gradient-cyan">proven in delivery</span>
            </>
          }
          description="What collaborators and partners value most about working with KNYK Labs."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEEDBACK.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-7 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-cyan-400 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>

                <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-6 italic">
                  &ldquo;{item.feedback}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-sm">
                    {item.author}
                  </div>
                  <div className="text-xs text-slate-400">
                    {item.role}
                  </div>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
