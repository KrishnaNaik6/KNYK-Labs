import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { KnykPublicPortfolioProject } from "@/lib/types/knyk";

interface FeaturedWorkProps {
  projects?: KnykPublicPortfolioProject[];
}

const STATIC_HIGHLIGHTS = [
  {
    title: "Next.js High-Performance Web Applications",
    category: "Software & Development",
    summary:
      "Full-stack web architectures utilizing modern App Router paradigms, optimized Core Web Vitals, and seamless API orchestrations.",
    deliverables: ["Next.js / TypeScript", "Tailwind CSS", "REST / GraphQL APIs"],
  },
  {
    title: "Custom AI Workflows & Business Automation",
    category: "AI & Automation",
    summary:
      "Automated lead intake pipelines, document extraction, and custom AI agents connected to centralized operational backends.",
    deliverables: ["LLM Integrations", "Webhook Pipelines", "Task Orchestration"],
  },
  {
    title: "Comprehensive Brand Identity Systems",
    category: "Graphic Design & Media",
    summary:
      "Distinctive vector marks, design guidelines, typography palettes, and consistent digital asset packages ready for production.",
    deliverables: ["Logo Systems", "Color & Typography Specs", "Digital Collateral"],
  },
];

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ projects = [] }) => {
  const featured = projects.filter((p) => p.isFeatured);
  const displayItems = featured.length > 0 ? featured.slice(0, 3) : projects.slice(0, 3);
  const hasDynamicProjects = displayItems.length > 0;

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Capabilities in Action"
          title={
            <>
              Selected portfolio &amp;{" "}
              <span className="text-gradient-cyan">case studies</span>
            </>
          }
          description="A glimpse into how we translate complex technical requirements and creative concepts into polished, production-grade solutions."
        />

        {hasDynamicProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800/80 hover:border-cyan-500/30 flex flex-col justify-between group"
              >
                {/* Optional cover image */}
                {item.coverImageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <Image
                      src={item.coverImageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090e1b] via-transparent to-transparent opacity-80" />
                  </div>
                )}

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="cyan" className="text-[11px]">
                        {item.category}
                      </Badge>
                      <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>

                    <Link href={`/portfolio/${item.slug}`}>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors tracking-tight">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {item.summary}
                    </p>
                  </div>

                  <div>
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5 mb-4">
                        {item.technologies.slice(0, 4).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-400 text-xs font-mono border border-slate-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Link
                        href={`/portfolio/${item.slug}`}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {item.projectUrl && (
                        <a
                          href={item.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          aria-label="External Project Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {STATIC_HIGHLIGHTS.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-2xl p-7 border border-slate-800/80 hover:border-cyan-500/30 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="cyan" className="text-[11px]">
                      {item.category}
                    </Badge>
                    <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {item.summary}
                  </p>
                </div>

                <div>
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {item.deliverables.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-400 text-xs font-mono border border-slate-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button variant="secondary" size="lg" href="/portfolio">
            <span>Explore All Portfolio Projects</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
