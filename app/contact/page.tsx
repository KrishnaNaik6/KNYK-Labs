import { Metadata } from "next";
import { Suspense } from "react";
import { getKnykServices } from "@/lib/nexis/services";
import { getKnykContact } from "@/lib/nexis/contact";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { DirectContactCard } from "@/components/contact/DirectContactCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact & Project Enquiries | KNYK Labs",
  description:
    "Get in touch with KNYK Labs. Request a custom quote, scope your next digital project, or connect directly via WhatsApp and phone.",
};

export default async function ContactPage() {
  const [{ services }, { contact, isAvailable }] = await Promise.all([
    getKnykServices(),
    getKnykContact(),
  ]);

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Initiate Engagement"
          title={
            <>
              Let&apos;s talk about your{" "}
              <span className="text-gradient-cyan">next milestone</span>
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
