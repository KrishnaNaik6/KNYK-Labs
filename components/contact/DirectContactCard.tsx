import React from "react";
import { MessageSquare, Phone, Mail, Clock } from "lucide-react";
import { getContactConfig, buildWhatsAppLink, buildPhoneLink, buildEmailLink } from "@/lib/utils/contact";

export const DirectContactCard: React.FC = () => {
  const contact = getContactConfig();
  const whatsappUrl = buildWhatsAppLink();
  const phoneUrl = buildPhoneLink();
  const emailUrl = buildEmailLink("New Project Consultation");

  return (
    <div className="space-y-6">
      {/* Channels box */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Immediate Channels
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            Reach our team directly
          </h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Prefer talking to a real human without filling forms? Use any of our direct communication lines below.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {/* WhatsApp */}
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

          {/* Phone */}
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

          {/* Email */}
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
                  {contact.email}
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-teal-400">Write &rarr;</span>
          </a>
        </div>
      </div>

      {/* Response time banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-slate-300 text-xs space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
          <Clock className="w-4 h-4" />
          <span>Rapid Response Promise</span>
        </div>
        <p className="leading-relaxed">
          Enquiries received on WhatsApp or telephone typically receive an initial technical scoping response within 2–4 business hours.
        </p>
      </div>
    </div>
  );
};
