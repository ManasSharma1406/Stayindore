import { useState } from 'react';
import { FAQS, LOCALITIES } from '../data';
import { ChevronDown, ShieldCheck, Mail, MapPin, Phone, HelpCircle } from 'lucide-react';

export default function FAQs() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="bg-gray-50 border-t border-gray-100 py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative z-10" id="faqs-section">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 bg-brand-medium/10 text-brand-dark px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frictionless Stays Info</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-brand-bg tracking-tight">
            Hourly Bookings in Indore: FAQs
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Everything you need to know about booking flexible short-term hotel slots within the city limits.
          </p>
        </div>

        {/* FAQs list accordion */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-gray-200/60 shadow-3xs overflow-hidden transition-all"
                id={`faq-item-${idx}`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-gray-800 hover:text-brand-medium transition-colors cursor-pointer"
                >
                  <span className="font-display tracking-tight leading-snug">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-brand-medium' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50 bg-gray-50/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Popular Indore Localities Quick-links strip */}
        <div className="border-t border-gray-200 pt-8 space-y-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
            Popular Hourly Hubs in Indore City Limits
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {LOCALITIES.filter(l => l !== 'All Localities').map((loc) => (
              <span 
                key={loc} 
                className="bg-white hover:bg-brand-light/5 border border-gray-100 hover:border-brand-light/20 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-600 shadow-3xs cursor-default transition-all flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-medium" />
                <span>{loc}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer info box */}
        <div className="bg-brand-bg text-white rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs border border-white/5 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-brand-light/20 rounded-md flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-brand-light" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-white">revistay Indore</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed font-normal">
              Proudly serving local Indore travelers, student layovers, transit rest seekers, and couples within Madhya Pradesh. Strictly secure and compliant.
            </p>
          </div>

          <div className="space-y-2 font-medium">
            <h5 className="font-bold text-brand-light uppercase text-[10px] tracking-wider">Contact Desk</h5>
            <div className="space-y-1.5 text-gray-300 text-[11px]">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-light" />
                <span>+91 731-4000888 (Indore Desk)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-light" />
                <span>helpdesk@revistay-indore.com</span>
              </p>
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-gray-400">
            <h5 className="font-bold text-brand-light uppercase text-[10px] tracking-wider">Legal & Compliance</h5>
            <p className="leading-relaxed font-normal">
              All transactions are processed securely. Under section 21 of the constitution of India, stay privacy of consenting adults is a fundamental right. Local Aadhaar verification applies at reception desk.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
