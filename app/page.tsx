import { getPublicServices } from "@/lib/api/services";
import { getPublicPortfolio } from "@/lib/api/portfolio";
import { getPublicTestimonials } from "@/lib/api/testimonials";
import { Hero } from "@/components/sections/Hero";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyKnyk } from "@/components/sections/WhyKnyk";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ClientCommitments } from "@/components/sections/ClientCommitments";
import { CTASection } from "@/components/sections/CTASection";

export const revalidate = 60;

export default async function HomePage() {
  const [
    { services, categories, isAvailable: isServicesAvailable },
    { projects },
    { testimonials },
  ] = await Promise.all([
    getPublicServices(),
    getPublicPortfolio(),
    getPublicTestimonials(),
  ]);

  const featuredServices = services.filter((s) => s.isFeatured);

  return (
    <>
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
