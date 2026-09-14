import React from "react";
import { MessageSquare, Phone, Mail, Clock, MapPin, Globe, AlertCircle } from "lucide-react";
import { buildWhatsAppLink, buildPhoneLink, buildEmailLink, formatAddress } from "@/lib/utils/contact";
import type { KnykPublicContact } from "@/lib/nexis/types";

interface DirectContactCardProps {
  contact?: KnykPublicContact | null;
  isAvailable?: boolean;
}

export const DirectContactCard: React.FC<DirectContactCardProps> = ({
  contact,
  isAvailable = true,
}) => {
  const whatsappUrl = buildWhatsAppLink(contact?.whatsappNumber);
  const phoneUrl = buildPhoneLink(contact?.phone);
  const emailUrl = buildEmailLink(contact?.email || contact?.salesEmail || contact?.supportEmail, "New Project Consultation");
  const formattedAddress = formatAddress(contact?.address);

  const hasAnyContactMethod = Boolean(
    isAvailable && contact && (whatsappUrl || phoneUrl || emailUrl || formattedAddress || contact?.businessHours)
  );

  return (
    <div className="space-y-6">
      {/* Channels box */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Immediate Channels
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            Reach {contact?.businessName || "our team"} directly
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Prefer talking to a real human without filling forms? Use any of our direct communication lines below.
          </p>
        </div>

        {/* If NEXIS unavailable or no contact methods configured */}
        {!hasAnyContactMethod ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-300">Contact information temporarily unavailable</div>
              <p className="text-xs text-amber-200/80 mt-1">
                Please submit the enquiry form or check back shortly. Our team is actively monitoring requests.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* WhatsApp */}
            {whatsappUrl && contact?.whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm group-hover:text-emerald-300 transition-colors">
                      WhatsApp Direct
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {contact.whatsappNumber}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-400">Chat &rarr;</span>
              </a>
            )}

            {/* Phone */}
            {phoneUrl && contact?.phone && (
              <a
                href={phoneUrl}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors">
                      Telephone Call
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {contact.phone}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-cyan-400">Call &rarr;</span>
              </a>
            )}

            {/* Email */}
            {emailUrl && (contact?.email || contact?.salesEmail || contact?.supportEmail) && (
              <a
                href={emailUrl}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm group-hover:text-teal-300 transition-colors">
                      Official Email
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {contact?.email || contact?.salesEmail || contact?.supportEmail}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-teal-400">Write &rarr;</span>
              </a>
            )}

            {/* Physical Address */}
            {formattedAddress && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="text-white font-semibold text-sm">Office Location</div>
                  <div className="text-slate-400 leading-relaxed">{formattedAddress}</div>
                  {contact?.googleMapsUrl && (
                    <a
                      href={contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>View on Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Response time & Hours banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-slate-300 text-xs space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
          <Clock className="w-4 h-4" />
          <span>{contact?.businessHours ? "Business Hours & Response" : "Rapid Response Promise"}</span>
        </div>
        {contact?.businessHours && (
          <p className="text-slate-200 font-medium">
            Operating Schedule: <span className="text-white">{contact.businessHours}</span>
          </p>
        )}
        <p className="leading-relaxed text-slate-400">
          Enquiries received on WhatsApp or telephone typically receive an initial technical scoping response within 2–4 business hours.
        </p>
      </div>
    </div>
  );
};
