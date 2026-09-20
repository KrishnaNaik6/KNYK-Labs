import { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { getSiteUrl } from "@/lib/seo/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: "About KNYK Labs | Software & AI Solutions",
  },
  description:
    "Learn about KNYK Labs, our engineering approach, software development capabilities, AI solutions, automation, and digital product work.",
  keywords: [
    "About KNYK Labs",
    "software engineering studio",
    "digital solutions company",
    "AI development Bengaluru",
    "software developers India",
    "multidisciplinary digital studio",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About KNYK Labs | Software & AI Solutions",
    description:
      "Learn about KNYK Labs, our engineering approach, software development capabilities, AI solutions, automation, and digital product work.",
    url: `${siteUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About KNYK Labs | Software & AI Solutions",
    description:
      "Learn about KNYK Labs, our engineering approach, software development capabilities, AI solutions, automation, and digital product work.",
  },
};

export default function AboutPage() {
  const principles = [
    {
      title: "Pragmatism Over Vanity",
      description:
        "We prioritize systems that solve real operational challenges and generate measurable value, avoiding buzzwords and unnecessary complexity.",
    },
    {
      title: "Design & Code in Synergy",
      description:
        "Engineered software without thoughtful aesthetics gets ignored; beautiful interfaces without robust architecture break. We hold both to the highest standard.",
    },
    {
      title: "Transparent, Milestone-Driven Delivery",
      description:
        "No opaque retainers or vague estimates. Every project has a defined scope, clear advance terms, and staged deliverables.",
    },
    {
      title: "Autonomous & Automated Workflows",
      description:
        "We build intelligence and automation into everything we deliver, empowering your team to operate efficiently with minimal repetitive labor.",
    },
  ];

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "About", url: `${siteUrl}/about` },
  ]);

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28">
      <JsonLd schema={breadcrumbJsonLd} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          eyebrow="Our Story & Philosophy"
          title={
            <>
              Building Digital Solutions with{" "}
              <span className="text-gradient-cyan">Engineering at the Core</span>
            </>
          }
          description="KNYK Labs is an independent digital studio focused on high-craft software engineering, purposeful brand design, and modern workflow automation based in Bengaluru, India."
        />

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-20 space-y-8 text-slate-300 text-base md:text-lg leading-relaxed">
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-slate-800/80 space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Why KNYK Labs Exists
            </h2>

            <p>
              In a digital landscape filled with bloated agencies, fragmented freelancers, and generic cookie-cutter templates, ambitious businesses struggle to find reliable partners who can seamlessly execute across both code and creative direction.
            </p>

            <p>
              KNYK Labs was founded to bridge this gap. We operate as a high-velocity digital solutions studio where full-stack software development, brand identity, multimedia production, and intelligent automation live under one roof.
            </p>

            <p>
              By combining technical rigor with design precision, we deliver solutions that don&apos;t just look impressive on launch day—they perform under real-world conditions, convert visitors into customers, and scale reliably.
            </p>
          </div>
        </div>

        {/* Guiding Principles */}
        <div className="mb-20">
          <SectionHeading
            as="h2"
            eyebrow="Core Values"
            title="What guides our work"
            description="Our foundational operating principles for every client engagement and internal system."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {principles.map((p, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-7 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                    0{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {p.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pl-11">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology & Tooling */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-cyan-500/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Modern Tooling &amp; Architecture
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-8">
              We leverage modern technology stacks—Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, AI APIs, and cloud services—orchestrated through our centralized NEXIS control infrastructure.
            </p>

            <div className="flex flex-wrap justify-center gap-2 text-xs font-mono text-slate-300">
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                Next.js / React
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                TypeScript
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                Tailwind CSS
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                Node.js APIs
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                PostgreSQL
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                LLM &amp; Automation APIs
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                NEXIS Control
              </span>
            </div>
          </div>
        </div>

        <CTASection />
      </div>
    </div>
  );
}
