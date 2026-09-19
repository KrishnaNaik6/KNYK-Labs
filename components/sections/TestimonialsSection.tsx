import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { KnykPublicTestimonial } from "@/lib/types/knyk";

interface TestimonialsSectionProps {
  testimonials?: KnykPublicTestimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = [],
}) => {
  // Only display if testimonials exist
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="Client Endorsements"
          title={
            <>
              Trusted by leaders &amp;{" "}
              <span className="text-gradient-cyan">visionary teams</span>
            </>
          }
          description="Authentic feedback from founders, product teams, and partners who relied on KNYK Labs for digital execution."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass-panel glass-panel-hover rounded-2xl p-7 border border-slate-800/80 flex flex-col justify-between group transition-all"
            >
              <div>
                {/* Rating stars & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-cyan-500/30 group-hover:text-cyan-400 transition-colors" />
                </div>

                {/* Content */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                {t.avatarUrl ? (
                  <Image
                    src={t.avatarUrl}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-teal-400/20 text-cyan-300 font-bold flex items-center justify-center text-sm border border-cyan-500/30 shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-white tracking-tight">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {t.role}
                    {t.company ? ` • ${t.company}` : ""}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
