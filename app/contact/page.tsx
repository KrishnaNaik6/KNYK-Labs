import { Metadata } from "next";
import { Suspense } from "react";
import { getPublicServices } from "@/lib/api/services";
import { getPublicContact } from "@/lib/api/contact";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { DirectContactCard } from "@/components/contact/DirectContactCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com";

export const metadata: Metadata = {
  title: {
    absolute: "Contact KNYK Labs | Start Your Project",
  },
  description:
    "Contact KNYK Labs for custom software development, web and mobile applications, AI solutions, automation, design, and digital services.",
  keywords: [
    "Contact KNYK Labs",
    "hire software developers",
    "software company contact Bengaluru",
    "custom software quote",
    "AI development consultation",
    "start digital project",
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact KNYK Labs | Start Your Project",
    description:
      "Contact KNYK Labs for custom software development, web and mobile applications, AI solutions, automation, design, and digital services.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact KNYK Labs | Start Your Project",
    description:
      "Contact KNYK Labs for custom software development, web and mobile applications, AI solutions, automation, design, and digital services.",
  },
};

export default async function ContactPage() {
  const [{ services }, { contact, isAvailable }] = await Promise.all([
    getPublicServices(),
    getPublicContact(),
  ]);

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Contact", url: `${siteUrl}/contact` },
  ]);

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28">
      <JsonLd schema={breadcrumbJsonLd} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          as="h1"
          eyebrow="Initiate Engagement"
          title={
            <>
              Let&apos;s Build{" "}
              <span className="text-gradient-cyan">Something Together</span>
            </>
          }
          description="Submit your project details below for a structured quotation, or connect immediately over WhatsApp for real-time consultation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 max-w-6xl mx-auto items-start">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="glass-panel rounded-3xl p-12 border border-slate-800 animate-pulse text-center text-slate-400">
                  Loading enquiry gateway...
                </div>
              }
            >
              <ContactForm services={services} contact={contact} />
            </Suspense>
          </div>

          {/* Direct Contact Card Column */}
          <div className="lg:col-span-5">
            <DirectContactCard contact={contact} isAvailable={isAvailable} />
          </div>
        </div>
      </div>
    </div>
  );
}
