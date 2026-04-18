import * as React from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "How do I book a slot?",
    a: "You can book directly through our website by clicking the 'BOOK NOW' button, selecting your preferred date and time, and filling in your details. You'll receive a confirmation shortly."
  },
  {
    q: "What is the duration of each slot?",
    a: "Our standard slot duration is 1.5 hours (90 minutes). This gives you enough time for a proper match and a warm-up."
  },
  {
    q: "Are there changing rooms and showers?",
    a: "Yes, we have clean, well-maintained changing rooms and private shower facilities available for all players."
  },
  {
    q: "Do you provide bibs and footballs?",
    a: "We provide high-quality match balls. Bibs are also available upon request for team identification."
  },
  {
    q: "What happens if it rains?",
    a: "Our FIFA-grade turf is designed with an advanced drainage system, making it playable even during heavy rain without becoming slippery or muddy."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="py-32 bg-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-lime-400">Common Queries</h2>
          <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
            FREQUENTLY ASKED <span className="text-lime-400">QUESTIONS</span>
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl border transition-all duration-300 ${
                openIndex === idx 
                  ? 'bg-white/5 border-lime-400/30' 
                  : 'bg-transparent border-white/5 hover:border-white/10'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-8 flex items-center justify-between text-left"
              >
                <span className="text-lg font-bold text-white uppercase tracking-tight">{faq.q}</span>
                <ChevronDown className={`w-6 h-6 text-lime-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-8 pt-0 text-slate-400 font-medium leading-relaxed italic">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
