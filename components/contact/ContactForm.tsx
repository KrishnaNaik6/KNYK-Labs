"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, MessageSquare, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Service } from "@/lib/nexis/types";
import { createWhatsAppUrl, buildEmailLink } from "@/lib/utils/contact";
import type { KnykPublicContact } from "@/lib/nexis/types";
import { useContact } from "@/lib/context/ContactContext";

const BUDGET_OPTIONS = [
  "Under ₹5,000",
  "₹5,000 – ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000+",
  "Not sure yet",
];

const FALLBACK_CATEGORIES = [
  "Software & Development",
  "Graphic Design",
  "Photo & Video",
  "Presentations & Documents",
  "AI & Automation",
  "Digital Services",
  "Custom Project",
];

interface ContactFormProps {
  services?: Service[];
  contact?: KnykPublicContact | null;
}

export const ContactForm: React.FC<ContactFormProps> = ({ services = [], contact: propContact }) => {
  const context = useContact();
  const contact = propContact !== undefined ? propContact : context.contact;
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || "";

  const [formData, setFormData] = useState(() => {
    const matchedService = services.find(
      (s) => s.slug.toLowerCase() === serviceParam.toLowerCase() || s.name.toLowerCase() === serviceParam.toLowerCase()
    );
    return {
      name: "",
      email: "",
      phone: "",
      service: matchedService ? matchedService.name : serviceParam,
      budget: "₹5,000 – ₹10,000",
      message: "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preparedWhatsAppUrl, setPreparedWhatsAppUrl] = useState<string | null>(null);

  const targetEmail = contact?.email || contact?.salesEmail || contact?.supportEmail;
  const emailUrl = buildEmailLink(targetEmail, formData.service ? `Project Enquiry: ${formData.service}` : "Project Enquiry");

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your contact phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please provide brief details about your project";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Build custom prefilled WhatsApp link with all form attributes
    const url = createWhatsAppUrl({
      whatsappNumber: contact?.whatsappNumber,
      serviceName: formData.service || "General Inquiry",
      budget: formData.budget,
      clientName: `${formData.name} (${formData.phone}, ${formData.email})`,
    });

    setPreparedWhatsAppUrl(url);
  };

  return (
    <div className="glass-panel rounded-3xl p-8 md:p-10 border border-slate-800 relative">
      {preparedWhatsAppUrl ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ready to Connect Directly
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Direct form endpoint integration with NEXIS is in progress. For immediate consultation with no delay, your enquiry has been formatted for one-click dispatch to our verified channels:
            </p>
          </div>

          {/* Form Recap */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs font-mono text-slate-300 space-y-2 max-w-md mx-auto">
            <div><span className="text-slate-500">Name:</span> <strong className="text-white">{formData.name}</strong></div>
            <div><span className="text-slate-500">Contact:</span> {formData.phone} • {formData.email}</div>
            <div><span className="text-slate-500">Selected Service:</span> <span className="text-cyan-400">{formData.service || "General Scoping"}</span></div>
            <div><span className="text-slate-500">Budget Range:</span> <span className="text-teal-400">{formData.budget}</span></div>
            <div><span className="text-slate-500">Project Brief:</span> {formData.message}</div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              variant="whatsapp"
              size="lg"
              href={preparedWhatsAppUrl}
              isExternal
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Send via WhatsApp Now</span>
            </Button>

            {emailUrl && (
              <Button
                variant="secondary"
                size="lg"
                href={emailUrl}
              >
                <span>Send via Email</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="md"
              onClick={() => setPreparedWhatsAppUrl(null)}
            >
              Edit Details
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Transparent Notice */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Direct consultation scoping form. Submit your project requirements below or connect directly via WhatsApp for rapid technical review.
            </span>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Your Name <span className="text-cyan-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Morgan"
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                  errors.name ? "border-rose-500/80" : "border-slate-800"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address <span className="text-cyan-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@example.com"
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                  errors.email ? "border-rose-500/80" : "border-slate-800"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone & Service Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone / WhatsApp <span className="text-cyan-400">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1 555 123 4567 or +91 98765 43210"
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                  errors.phone ? "border-rose-500/80" : "border-slate-800"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="service" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Service
              </label>
              {services.length > 0 ? (
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all cursor-pointer"
                >
                  <option value="">General Project / Consultation</option>
                  {services.map((s) => (
                    <option key={s.id || s.slug} value={s.name}>
                      {s.name} ({s.category?.name || "Service"})
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all cursor-pointer"
                >
                  <option value="">Select a capability domain</option>
                  {FALLBACK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Budget Options */}
          <div>
            <label htmlFor="budget" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Estimated Budget Tier
            </label>
            <select
              id="budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all cursor-pointer"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Project Details */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Project Scope & Requirements <span className="text-cyan-400">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your objectives, timeline, required features, or existing systems..."
              className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-y ${
                errors.message ? "border-rose-500/80" : "border-slate-800"
              }`}
            />
            {errors.message && (
              <p className="text-xs text-rose-400 mt-1.5">{errors.message}</p>
            )}
          </div>

          {/* Action button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center"
          >
            <span>Send Enquiry</span>
            <Send className="w-4 h-4 ml-1.5" />
          </Button>
        </form>
      )}
    </div>
  );
};
