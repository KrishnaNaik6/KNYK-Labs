import { getKnykServiceCatalog } from "@/lib/nexis/client";
import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyKnyk } from "@/components/sections/WhyKnyk";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";

export const revalidate = 60;

export default async function HomePage() {
  const catalog = await getKnykServiceCatalog();

  return (
    <>
      <Hero />
      <ServicesSection catalog={catalog} />
      <WhyKnyk />
      <FeaturedWork />
      <ProcessSteps />
      <Testimonials />
      <CTASection />
    </>
  );
}
