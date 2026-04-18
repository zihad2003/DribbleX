import * as React from 'react';
import { Quote, Star } from 'lucide-react';

const reviews = [
  {
    name: "Rahat Ahmed",
    role: "Regular Player",
    content: "The best turf in Dhaka, hands down. The surface quality is incredible and the lighting is perfect for night matches.",
    rating: 5
  },
  {
    name: "Samiul Haque",
    role: "League Organizer",
    content: "Highly professional management. The facilities are clean and the atmosphere is always electric. My team loves playing here.",
    rating: 5
  },
  {
    name: "Tanvir Islam",
    role: "Weekend Warrior",
    content: "Booking process is seamless. The location is convenient and the staff is very helpful. Great value for money!",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-lime-400/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-lime-400">Player Stories</h2>
          <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
            WHAT THE <span className="text-transparent stroke-text-white">COMMUNITY</span> SAYS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((rev, idx) => (
            <div 
              key={idx} 
              className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 border border-white/5 hover:border-lime-400/20 transition-all group shadow-2xl relative"
            >
              <Quote className="absolute top-6 right-8 md:top-8 md:right-10 w-8 h-8 md:w-12 md:h-12 text-white/5 group-hover:text-lime-400/10 transition-colors" />
              
              <div className="flex gap-1 mb-4 md:mb-6">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-lime-400 text-lime-400" />
                ))}
              </div>

              <p className="text-slate-300 text-base md:text-lg font-medium italic mb-6 md:mb-8 leading-relaxed">
                "{rev.content}"
              </p>

              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-black text-lime-400 italic text-lg md:text-xl border border-white/10">
                  {rev.name[0]}
                </div>
                <div>
                  <h4 className="text-white text-sm md:text-base font-bold">{rev.name}</h4>
                  <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
