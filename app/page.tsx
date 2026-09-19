import { Metadata } from "next";
import { getPublicServices } from "@/lib/api/services";
import { getPublicPortfolio } from "@/lib/api/portfolio";
import { getPublicTestimonials } from "@/lib/api/testimonials";
import { getPublicContact } from "@/lib/api/contact";
import { getPublicBranding } from "@/lib/api/branding";
import { getPublicWebsiteSettings } from "@/lib/api/website";
import { Hero } from "@/components/sections/Hero";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyKnyk } from "@/components/sections/WhyKnyk";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ClientCommitments } from "@/components/sections/ClientCommitments";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 60;

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://knyklabs.com").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "KNYK Labs | Software, AI & Digital Solutions Company",
  description:
    "KNYK Labs builds custom software, modern websites, mobile applications, AI solutions, automation systems, and digital experiences for businesses.",
  keywords: [
    "KNYK Labs",
    "software development",
    "AI development",
    "web development",
    "mobile app development",
    "AI automation",
    "custom software",
    "digital solutions",
    "Bengaluru",
    "India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KNYK Labs | Software, AI & Digital Solutions Company",
    description:
      "KNYK Labs builds custom software, modern websites, mobile applications, AI solutions, automation systems, and digital experiences for businesses.",
    url: siteUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KNYK Labs | Software, AI & Digital Solutions Company",
    description:
      "KNYK Labs builds custom software, modern websites, mobile applications, AI solutions, automation systems, and digital experiences for businesses.",
  },
};

export default async function HomePage() {
  const [
    { services, categories, isAvailable: isServicesAvailable },
    { projects },
    { testimonials },
    { contact },
    { branding },
    { website },
  ] = await Promise.all([
    getPublicServices(),
    getPublicPortfolio(),
    getPublicTestimonials(),
    getPublicContact(),
    getPublicBranding(),
    getPublicWebsiteSettings(),
  ]);

  const featuredServices = services.filter((s) => s.isFeatured);
  const organizationJsonLd = getOrganizationJsonLd(contact, branding, siteUrl);
  const websiteJsonLd = getWebSiteJsonLd(siteUrl, website);

  return (
    <>
      <JsonLd schema={[organizationJsonLd, websiteJsonLd]} />
      <Hero />
      <FeaturedServices featuredServices={featuredServices} />
      <ServicesSection catalog={{ services, categories, isAvailable: isServicesAvailable }} />
      <WhyKnyk />
      <FeaturedWork projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <ProcessSteps />
      <ClientCommitments />
      <CTASection />
    </>
  );
}
