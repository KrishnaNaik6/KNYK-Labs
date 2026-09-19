import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { getPublicServiceBySlug } from "@/lib/api/services";
import { formatCurrency, formatDelivery, formatAdvance } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CallButton } from "@/components/ui/CallButton";

import { JsonLd } from "@/components/seo/JsonLd";
import { getServiceJsonLd, getBreadcrumbJsonLd } from "@/lib/seo/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

const defaultSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com").replace(/\/+$/, "");

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicServiceBySlug(slug);

  if (!result.service) {
    notFound();
  }

  const { service } = result;
  const siteUrl = defaultSiteUrl;
  const deliveryInfo = service.estimatedDelivery ? ` Estimated delivery: ${service.estimatedDelivery}.` : "";
  const categoryInfo = service.categoryName ? ` [${service.categoryName}]` : "";
  const description =
    service.shortDescription
      ? `${service.shortDescription}${categoryInfo}${deliveryInfo}`
      : service.description
      ? service.description.slice(0, 160)
      : `Explore ${service.name} services by KNYK Labs. Custom engineering, transparent milestones, and structured execution.`;

  return {
    title: {
      absolute: `${service.name} | KNYK Labs`,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} | KNYK Labs`,
      description,
      url: `${siteUrl}/services/${service.slug}`,
      type: "article",
      images: service.imageUrl
        ? [{ url: service.imageUrl, alt: `${service.name} service preview` }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} | KNYK Labs`,
      description,
      images: service.imageUrl ? [service.imageUrl] : undefined,
    },
  };
}

const PROCESS_STEPS = [
  { step: "01", title: "Discuss requirements", desc: "Initial technical consult & scoping" },
  { step: "02", title: "Receive quote", desc: "Itemized deliverables & milestones" },
  { step: "03", title: "Approve project", desc: "Confirm sprint roadmap & timeline" },
  { step: "04", title: "Pay advance", desc: "Secure kick-off payment" },
  { step: "05", title: "Project development", desc: "Iterative builds & updates" },
  { step: "06", title: "Review", desc: "Collaborative feedback & staging tests" },
  { step: "07", title: "Final payment", desc: "Milestone completion sign-off" },
  { step: "08", title: "Delivery", desc: "Full IP, source & asset handover" },
];

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPublicServiceBySlug(slug);

  if (!result.isAvailable && !result.service) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-4 text-center">
        <div className="glass-panel p-10 rounded-3xl border border-cyan-500/20">
          <h1 className="text-2xl font-bold text-white mb-4">
            Service Catalog Temporarily Offline
          </h1>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Unable to reach the NEXIS catalog for &ldquo;{slug}&rdquo;. Please contact us directly for immediate details.
          </p>
          <div className="flex justify-center gap-4">
            <WhatsAppButton serviceName={slug} label="Enquire on WhatsApp" />
            <Button variant="secondary" href="/services">
              Browse All Services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!result.service) {
    notFound();
  }

  const { service } = result;
  const siteUrl = defaultSiteUrl;
  const formattedPrice = formatCurrency(service.startingPrice, service.currency);
  const formattedDelivery = formatDelivery(service.estimatedDelivery);
  const formattedAdvance = formatAdvance(service.advancePercentage);
  const startProjectUrl = `/contact?service=${encodeURIComponent(service.slug)}`;

  const serviceJsonLd = getServiceJsonLd(service, siteUrl);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Services", url: `${siteUrl}/services` },
    { name: service.name, url: `${siteUrl}/services/${service.slug}` },
  ]);

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <JsonLd schema={[serviceJsonLd, breadcrumbJsonLd]} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all services</span>
          </Link>
        </div>

        {/* Header Hero Box */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-cyan-500/25 shadow-2xl shadow-cyan-950/20 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="cyan">
                {service.categoryName || "Digital Service"}
              </Badge>
              {service.isFeatured && (
                <Badge variant="featured" className="gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>Featured Service</span>
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {service.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {service.shortDescription}
            </p>
          </div>

          {/* Pricing & Delivery Metas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800">
            <div>
              <span className="block text-xs uppercase font-semibold tracking-wider text-slate-400">
                Investment
              </span>
              <span className="text-2xl font-black text-white mt-0.5 block">
                {formattedPrice}
              </span>
            </div>

            <div>
              <span className="block text-xs uppercase font-semibold tracking-wider text-slate-400">
                Estimated Delivery
              </span>
              <span className="text-lg font-bold text-slate-200 mt-1 inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                {formattedDelivery}
              </span>
            </div>

            <div>
              <span className="block text-xs uppercase font-semibold tracking-wider text-slate-400">
                Advance Terms
              </span>
              <span className="text-lg font-bold text-slate-200 mt-1 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                {formattedAdvance}
              </span>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800/80">
            <Button variant="primary" size="lg" href={startProjectUrl}>
              <span>Start This Project</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <WhatsAppButton
              serviceName={service.name}
              size="lg"
              label="Discuss on WhatsApp"
            />

            <CallButton size="lg" />
          </div>
        </div>

        {/* Section 1: About This Service */}
        <div className="space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              About this service
            </h2>
          </div>

          <div className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-base">
            {service.description ||
              "Every engagement at KNYK Labs is custom-architected for your business domain. We collaborate directly with your team to deliver high-performance software, creative design systems, and robust automation."}
          </div>
        </div>

        {/* Section 2: What's Included */}
        <div className="space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              What&apos;s included
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  100% Intellectual Property Handover
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full repository rights, source code, production assets, and vector deliverables belong exclusively to you.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Staged Sprint Milestone Updates
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Regular demonstration deployments and direct review access throughout the implementation timeline.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Production Testing & Verification
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cross-browser compatibility, responsive viewports, performance audits, and error boundary protections.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Post-Handover Support Buffer
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dedicated bug-fix buffer and configuration assistance after project handover.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Project Process */}
        <div className="space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Project process
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Our transparent, 8-phase execution roadmap from initial scope to live deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-cyan-400 text-xs font-bold block mb-2">
                    {item.step}.
                  </span>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Bottom Conversion CTA */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-cyan-500/30 text-center space-y-6 shadow-2xl shadow-cyan-950/20">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to start?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Begin with a clear consultation and tailored proposal for {service.name}. No commitments until milestones and scope are confirmed.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Button variant="primary" size="lg" href={startProjectUrl}>
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <WhatsAppButton
              serviceName={service.name}
              size="lg"
              label="WhatsApp Us"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
