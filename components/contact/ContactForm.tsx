"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateEnquiryInput } from "@/lib/api/enquiries";
import { createWhatsAppUrl } from "@/lib/utils/contact";
import type { KnykPublicService, KnykPublicContact } from "@/lib/types/knyk";
import { useContact } from "@/lib/context/ContactContext";

const BUDGET_OPTIONS = [
  "Under ₹5,000",
  "₹5,000 – ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000+",
  "Not sure yet",
];

interface ContactFormProps {
  services?: KnykPublicService[];
  contact?: KnykPublicContact | null;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  services = [],
  contact: propContact,
}) => {
  const context = useContact();
  const contact = propContact !== undefined ? propContact : context.contact;
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || "";

  const [formData, setFormData] = useState(() => {
    const matchedService = services.find(
      (s) =>
        s.slug.toLowerCase() === serviceParam.toLowerCase() ||
        s.name.toLowerCase() === serviceParam.toLowerCase()
    );
    return {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      serviceId: matchedService ? matchedService.id : "",
      serviceName: matchedService ? matchedService.name : serviceParam,
      budget: "₹5,000 – ₹10,000",
      message: "",
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side validation
    const validation = validateEnquiryInput({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          whatsapp: formData.whatsapp.trim() || formData.phone.trim() || undefined,
          serviceId: formData.serviceId || undefined,
          budget: formData.budget,
          message: formData.message.trim(),
          source: "knyk_website_contact_form",
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setStatus("error");
        if (response.status === 429) {
          setStatusMessage(
            "Rate limit exceeded. You've sent several enquiries recently. Please wait a moment before trying again."
          );
        } else if (response.status === 503) {
          setStatusMessage(
            "Our enquiry gateway is temporarily offline for maintenance. Please message us directly via WhatsApp."
          );
        } else {
          setStatusMessage(
            json.error || "Unable to submit your enquiry at this time. Please try again or reach out directly."
          );
        }
        return;
      }

      setStatus("success");
      setStatusMessage(
        json.message || "Thank you! We have received your enquiry and will respond within 2–4 business hours."
      );
    } catch {
      setStatus("error");
      setStatusMessage("Network error communicating with the server. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      serviceId: "",
      serviceName: "",
      budget: "₹5,000 – ₹10,000",
      message: "",
    });
    setErrors({});
    setStatus("idle");
    setStatusMessage(null);
  };

  // Direct WhatsApp helper for immediate alternative
  const whatsappUrl = createWhatsAppUrl({
    whatsappNumber: contact?.whatsappNumber,
    serviceName: formData.serviceName || "Digital Consultation",
    budget: formData.budget,
    clientName: formData.name ? `${formData.name} (${formData.email})` : undefined,
  });

  return (
    <div className="glass-panel rounded-3xl p-8 md:p-10 border border-slate-800 relative">
      {status === "success" ? (
        <div className="space-y-6 text-center py-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Enquiry Dispatched Successfully
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {statusMessage}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs font-mono text-slate-300 space-y-2 max-w-md mx-auto">
            <div>
              <span className="text-slate-500">Contact:</span>{" "}
              <strong className="text-white">{formData.name}</strong> ({formData.email})
            </div>
            {formData.serviceName && (
              <div>
                <span className="text-slate-500">Target Area:</span>{" "}
                <span className="text-cyan-400">{formData.serviceName}</span>
              </div>
            )}
            <div>
              <span className="text-slate-500">Estimated Budget:</span>{" "}
              <span className="text-teal-400">{formData.budget}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            {whatsappUrl && (
              <Button variant="whatsapp" size="md" href={whatsappUrl} isExternal>
                <MessageSquare className="w-4 h-4" />
                <span>Follow up on WhatsApp</span>
              </Button>
            )}
            <Button variant="secondary" size="md" onClick={resetForm}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              <span>Submit Another Request</span>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Project Brief
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Start with a structured quotation
            </h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Fill in your requirements below for an itemized estimate and sprint timeline.
            </p>
          </div>

          {status === "error" && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <strong className="block font-semibold">Transmission Alert</strong>
                <p className="mt-0.5 leading-relaxed">{statusMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name <span className="text-cyan-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maya Lin"
                disabled={isSubmitting}
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                  errors.name ? "border-rose-500/80" : "border-slate-800"
                }`}
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Work Email <span className="text-cyan-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. maya@acme.com"
                disabled={isSubmitting}
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                  errors.email ? "border-rose-500/80" : "border-slate-800"
                }`}
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1.5">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1 555 123 4567 or +91 98765 43210"
                disabled={isSubmitting}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Target Service Selection */}
            <div>
              <label htmlFor="service" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Capability
              </label>
              <select
                id="service"
                value={formData.serviceId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const found = services.find((s) => s.id === selectedId);
                  setFormData({
                    ...formData,
                    serviceId: selectedId,
                    serviceName: found ? found.name : "",
                  });
                }}
                disabled={isSubmitting}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              >
                <option value="">General Project Consultation</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.startingPrice ? `(from ${s.currency} ${s.startingPrice.toLocaleString()})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget tier */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Anticipated Budget Bracket
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {BUDGET_OPTIONS.map((tier) => {
                const isSelected = formData.budget === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: tier })}
                    disabled={isSubmitting}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-center ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm"
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Details */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Project Specifications <span className="text-cyan-400">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what you're looking to build: core goals, deliverables, specific integrations, and any deadline constraints..."
              disabled={isSubmitting}
              className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                errors.message ? "border-rose-500/80" : "border-slate-800"
              }`}
            />
            {errors.message && <p className="text-xs text-rose-400 mt-1.5">{errors.message}</p>}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <Send className={`w-4 h-4 mr-2 ${isSubmitting ? "animate-spin" : ""}`} />
              <span>{isSubmitting ? "Transmitting enquiry..." : "Submit Project Enquiry"}</span>
            </Button>

            <span className="text-xs text-slate-400 text-center sm:text-right">
              Direct engineering access • Non-binding estimate
            </span>
          </div>
        </form>
      )}
    </div>
  );
};
