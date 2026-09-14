import { getKnykCatalog, getKnykFeaturedServices } from "@/lib/nexis/services";
import { Hero } from "@/components/sections/Hero";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyKnyk } from "@/components/sections/WhyKnyk";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ClientCommitments } from "@/components/sections/ClientCommitments";
import { CTASection } from "@/components/sections/CTASection";

export const revalidate = 60;

export default async function HomePage() {
  const [catalog, { featuredServices }] = await Promise.all([
    getKnykCatalog(),
    getKnykFeaturedServices(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedServices featuredServices={featuredServices} />
      <ServicesSection catalog={catalog} />
      <WhyKnyk />
      <FeaturedWork />
      <ProcessSteps />
      <ClientCommitments />
      <CTASection />
    </>
  );
}
