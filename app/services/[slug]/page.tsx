import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, Sparkles, MessageSquare, Phone } from "lucide-react";
import { getKnykServiceBySlug } from "@/lib/nexis/client";
import { formatCurrency, formatDelivery, formatAdvance } from "@/lib/utils/currency";
import { buildWhatsAppLink, buildPhoneLink, getContactConfig } from "@/lib/utils/contact";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CTASection } from "@/components/sections/CTASection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getKnykServiceBySlug(slug);

  if (!result.service) {
    return {
      title: "Service Not Found",
      description: "The requested KNYK Labs service could not be found.",
    };
  }

  const { service } = result;

  return {
    title: service.name,
    description: service.shortDescription,
    openGraph: {
      title: `${service.name} — KNYK Labs`,
      description: service.shortDescription,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} — KNYK Labs`,
      description: service.shortDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getKnykServiceBySlug(slug);

  if (!result.isAvailable && !result.service) {
    return (
      <div className="pt-36 pb-24 max-w-4xl mx-auto px-4 text-center">
        <div className="glass-panel p-10 rounded-3xl border border-cyan-500/20">
          <h1 className="text-2xl font-bold text-white mb-4">
            Service Catalog Temporarily Offline
          </h1>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            We are currently unable to reach the NEXIS catalog for &ldquo;{slug}&rdquo;. Please contact us directly for immediate details.
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
  const contact = getContactConfig();
  const formattedPrice = formatCurrency(service.startingPrice, service.currency);
  const formattedDelivery = formatDelivery(service.estimatedDelivery);
  const formattedAdvance = formatAdvance(service.advancePercentage);
  const whatsappUrl = buildWhatsAppLink(service.name);
  const phoneUrl = buildPhoneLink();

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all services</span>
          </Link>
        </div>

        {/* Main Service Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 items-start">
          {/* Left: Service Overview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="cyan">
                {service.category?.name || "Digital Service"}
              </Badge>
              {service.isFeatured && (
                <Badge variant="featured" className="gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>Featured Solution</span>
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {service.name}
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed">
              {service.shortDescription}
            </p>

            {/* Scope / Description details */}
            <div className="pt-6 border-t border-slate-800/80 space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Service Scope & Execution
              </h2>

              {service.description ? (
                <div className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {service.description}
                </div>
              ) : (
                <p className="text-slate-400 text-sm leading-relaxed">
                  Every engagement is tailored to your specific technical and business requirements. Contact us to review deliverables, tech stacks, and implementation milestones.
                </p>
              )}
            </div>

            {/* Engagement Standards */}
            <div className="pt-6 border-t border-slate-800/80">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
                Included with this engagement
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Direct builder communication</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Staged milestone reviews</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Full IP and source handover</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Post-delivery support buffer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Investment & Action Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-3xl p-7 md:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 sticky top-28 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Project Investment
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {formattedPrice}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Final scope confirmed upon initial consultation.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-400" />
                    Turnaround:
                  </span>
                  <span className="font-semibold text-white">
                    {formattedDelivery}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Payment Terms:
                  </span>
                  <span className="font-semibold text-white">
                    {formattedAdvance}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <Button
                  variant="primary"
                  size="lg"
                  href={`/contact?service=${encodeURIComponent(service.name)}`}
                  className="w-full justify-center"
                >
                  Start This Project
                </Button>

                <Button
                  variant="whatsapp"
                  size="lg"
                  href={whatsappUrl}
                  isExternal
                  className="w-full justify-center"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Discuss on WhatsApp</span>
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  href={phoneUrl}
                  className="w-full justify-center"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>Call {contact.phone}</span>
                </Button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                No upfront commitment required until scope and milestones are confirmed.
              </p>
            </div>
          </div>
        </div>

        <CTASection />
      </div>
    </div>
  );
}
