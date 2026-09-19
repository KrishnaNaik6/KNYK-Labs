import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Tag,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { getPublicPortfolioProjectBySlug } from "@/lib/api/portfolio";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CTASection } from "@/components/sections/CTASection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120; // 2 minutes

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getPublicPortfolioProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return {
    title: `${project.title} | KNYK Labs Portfolio`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — KNYK Labs Case Study`,
      description: project.summary,
      images: project.coverImageUrl ? [{ url: project.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — KNYK Labs`,
      description: project.summary,
      images: project.coverImageUrl ? [project.coverImageUrl] : undefined,
    },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { project, isAvailable, error } = await getPublicPortfolioProjectBySlug(slug);

  if (!isAvailable && !project) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-4 text-center">
        <div className="glass-panel p-10 rounded-3xl border border-cyan-500/20">
          <h1 className="text-2xl font-bold text-white mb-4">
            Project Overview Temporarily Offline
          </h1>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Unable to reach the NEXIS portfolio service for &ldquo;{slug}&rdquo;. {error || "Please check back shortly."}
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" href="/portfolio">
              Back to Portfolio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all projects</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-slate-800 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <Badge variant="cyan">{project.category}</Badge>
              {project.isFeatured && (
                <span className="text-xs uppercase font-mono tracking-wider text-teal-400 bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                  Featured Case Study
                </span>
              )}
            </div>

            {project.projectUrl && (
              <Button
                variant="outline"
                size="sm"
                href={project.projectUrl}
                isExternal
              >
                <span>Live Project Demo</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            {project.title}
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mb-8">
            {project.summary}
          </p>

          {/* Quick tech stack tags */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Technologies &amp; Architecture</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-900 text-xs font-mono text-cyan-300 border border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cover Image */}
        {project.coverImageUrl && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-12 bg-slate-900">
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Full Project Description / Narrative */}
        {project.description && (
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-slate-800 mb-12 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              <Layers className="w-4 h-4" />
              <span>Project Scope &amp; Breakdown</span>
            </div>
            <div className="prose prose-invert prose-cyan max-w-none text-slate-300 text-base leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </div>
        )}

        {/* Gallery Images */}
        {project.galleryUrls && project.galleryUrls.length > 0 && (
          <div className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Gallery &amp; Interface Highlights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.galleryUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900"
                >
                  <Image
                    src={url}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 mb-12 flex items-center flex-wrap gap-2 text-xs">
            <Tag className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded bg-slate-900 text-slate-400 font-mono border border-slate-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Project Call to Action */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border border-cyan-500/30 text-center space-y-6 mb-12 shadow-xl shadow-cyan-950/20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Have a project with similar requirements?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            We can architect and execute a custom solution tailored to your timeline, business constraints, and technical roadmap.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="/contact">
              Start Your Project
            </Button>
            <WhatsAppButton
              serviceName={project.title}
              label="Discuss via WhatsApp"
              size="lg"
            />
          </div>
        </div>

        <CTASection />
      </div>
    </div>
  );
}
