import * as React from 'react';
import { Shield, Zap, Coffee, Users, Wind, Trophy, HeartPulse, Camera } from 'lucide-react';

const facilities = [
  { icon: Shield, title: 'FIFA Grade Turf', desc: 'Premium artificial grass for professional play and injury prevention.' },
  { icon: Zap, title: 'Night Lighting', desc: 'High-intensity LED floodlights for perfect visibility during night matches.' },
  { icon: Coffee, title: 'Cafe & Lounge', desc: 'Refresh yourself at our snack bar with comfortable viewing area.' },
  { icon: Users, title: 'Changing Rooms', desc: 'Clean and spacious changing rooms with private shower facilities.' },
  { icon: Wind, title: 'Ventilation', desc: 'Designed for optimal airflow to keep you cool during intense play.' },
  { icon: Trophy, title: 'Tournaments', desc: 'Regular leagues and community cups to showcase your skills.' },
  { icon: HeartPulse, title: 'First Aid', desc: 'Professional medical kit and emergency response protocols on site.' },
  { icon: Camera, title: 'Match Recording', desc: 'Get HD recordings of your matches to review and share.' },
];

export const Facilities = () => {
  return (
    <section id="facilities" className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-lime-400">Our Amenities</h2>
            <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
              WORLD CLASS <br /> <span className="text-transparent stroke-text-white">FACILITIES</span>
            </h3>
          </div>
          <p className="text-slate-400 max-w-md font-medium text-lg italic">
            "Everything we do is designed to give you the ultimate professional football experience."
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {facilities.map((item, index) => (
            <div 
              key={index} 
              className="group p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-lime-400/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-2xl hover:z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-lime-400 mb-4 md:mb-8 group-hover:bg-lime-400 group-hover:text-black transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <item.icon className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <h4 className="text-xs md:text-xl font-bold text-white mb-2 md:mb-4 uppercase tracking-tight leading-tight">{item.title}</h4>
                <p className="text-slate-400 text-[10px] md:text-sm leading-relaxed font-medium line-clamp-3 md:line-clamp-none">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stroke-text-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};
