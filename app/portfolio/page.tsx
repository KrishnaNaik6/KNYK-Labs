import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { getPublicPortfolio } from "@/lib/api/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 120; // 2 minutes

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: {
    absolute: "Portfolio | Software, AI & Digital Projects | KNYK Labs",
  },
  description:
    "Explore software, AI, web, mobile, automation, and digital projects developed by KNYK Labs.",
  keywords: [
    "KNYK Labs portfolio",
    "software case studies",
    "web development projects",
    "AI solutions portfolio",
    "mobile application case studies",
    "digital studio work",
  ],
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Portfolio | Software, AI & Digital Projects | KNYK Labs",
    description:
      "Explore software, AI, web, mobile, automation, and digital projects developed by KNYK Labs.",
    url: `${siteUrl}/portfolio`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Software, AI & Digital Projects | KNYK Labs",
    description:
      "Explore software, AI, web, mobile, automation, and digital projects developed by KNYK Labs.",
  },
};

export default async function PortfolioPage() {
  const { projects, isAvailable } = await getPublicPortfolio();

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Portfolio", url: `${siteUrl}/portfolio` },
  ]);

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-screen">
      <JsonLd schema={breadcrumbJsonLd} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          eyebrow="Proof of Work"
          title={
            <>
              Selected Work |{" "}
              <span className="text-gradient-cyan">Software &amp; AI Projects</span>
            </>
          }
          description="A curated overview of software architectures, visual branding packages, and automation workflows engineered by KNYK Labs."
        />

        {/* Dynamic Project Grid or Empty State */}
        {isAvailable && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between group"
              >
                {/* Cover image if available */}
                {proj.coverImageUrl && (
                  <Link href={`/portfolio/${proj.slug}`} className="block relative aspect-video w-full overflow-hidden bg-slate-900">
                    <Image
                      src={proj.coverImageUrl}
                      alt={`${proj.title} project preview`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090e1b] via-transparent to-transparent opacity-80" />
                  </Link>
                )}

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="cyan" className="text-[11px]">
                        {proj.category}
                      </Badge>
                      {proj.isFeatured && (
                        <span className="text-[10px] uppercase font-mono tracking-widest text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                          Featured
                        </span>
                      )}
                    </div>

                    <Link href={`/portfolio/${proj.slug}`}>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {proj.summary}
                    </p>
                  </div>

                  <div>
                    {/* Technology tags */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5 mb-4">
                        {proj.technologies.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-900 text-[11px] text-slate-400 font-mono border border-slate-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Link
                        href={`/portfolio/${proj.slug}`}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 group-hover:underline"
                      >
                        <span>View Project Breakdown</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                          aria-label={`Visit live demo for ${proj.title}`}
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
          /* Controlled Empty State */
          <div className="max-w-3xl mx-auto my-12 text-center">
            <div className="glass-panel rounded-3xl p-10 md:p-16 border border-cyan-500/20 shadow-2xl shadow-cyan-950/30 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-8 h-8" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Selected Work is Coming Soon
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                We are currently curating in-depth case studies, live demos, and technical breakdowns from our latest client engagements for public release.
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
