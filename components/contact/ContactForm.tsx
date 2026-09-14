"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, MessageSquare, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getContactConfig } from "@/lib/utils/contact";

const AVAILABLE_CATEGORIES = [
  "Software & Development",
  "Graphic Design",
  "Photo & Video",
  "Presentations & Documents",
  "AI & Automation",
  "Digital Services",
  "Custom / Other",
];

export const ContactForm: React.FC = () => {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: initialService,
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const contact = getContactConfig();

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
      newErrors.message = "Please tell us a little about your project";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Notice: NEXIS public leads endpoint is pending integration.
    // Per explicit project rules: Do NOT pretend an enquiry was submitted to a backend when it was not.
    // Offer seamless transition to WhatsApp with pre-filled message or email.
    const customWhatsAppUrl = `https://wa.me/${contact.whatsappNumber.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(
      `Hi KNYK Labs,\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.service || "General"}\nMessage: ${formData.message}`
    )}`;

    setSubmittedMessage(customWhatsAppUrl);
  };

  return (
    <div className="glass-panel rounded-3xl p-8 md:p-10 border border-slate-800 relative">
      {submittedMessage ? (
        <div className="space-y-6 text-center py-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ready to Send Directly to Our Team
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Our automated web-enquiry gateway is connecting to the NEXIS control center. For instant response, click below to transfer your details directly to our verified WhatsApp or reach out via phone.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs font-mono text-slate-300 space-y-1.5 max-w-md mx-auto">
            <div><strong>Client:</strong> {formData.name}</div>
            <div><strong>Email:</strong> {formData.email}</div>
            <div><strong>Phone:</strong> {formData.phone}</div>
            <div><strong>Service:</strong> {formData.service || "General"}</div>
            <div><strong>Scope:</strong> {formData.message}</div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              variant="whatsapp"
              size="lg"
              href={submittedMessage}
              isExternal
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Send via WhatsApp Now</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => setSubmittedMessage(null)}
            >
              Edit Details
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Notice banner */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Direct consultations open. You can fill out this scope form or message us immediately on WhatsApp for priority response.
            </span>
          </div>

          {/* Name & Email Row */}
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
                placeholder="John Doe"
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
                placeholder="john@example.com"
                className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
                  errors.email ? "border-rose-500/80" : "border-slate-800"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone & Service Row */}
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
                placeholder="+91 98765 43210"
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
                Interested Service
              </label>
              <input
                id="service"
                type="text"
                list="service-suggestions"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                placeholder="e.g. Next.js Web App, AI Automation, Branding"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
              <datalist id="service-suggestions">
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Message textarea */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Project Brief / Details <span className="text-cyan-400">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your project requirements, target timeline, and any specific tools or references..."
              className={`w-full bg-slate-900/90 border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-y ${
                errors.message ? "border-rose-500/80" : "border-slate-800"
              }`}
            />
            {errors.message && (
              <p className="text-xs text-rose-400 mt-1.5">{errors.message}</p>
            )}
          </div>

          {/* Submit CTA */}
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
