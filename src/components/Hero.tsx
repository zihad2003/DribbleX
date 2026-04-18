import * as React from 'react';
import { Calendar, Clock, MapPin, Play } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero = ({ onOpenBooking }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2076&auto=format&fit=crop" 
          alt="Arena Background"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 z-20"></div>
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-6 py-12 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left space-y-6 md:space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-lime-400/30 bg-lime-400/10 backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-400"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Now Accepting Reservations</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter leading-[0.85] text-white uppercase">
            UNLEASH <br />
            <span className="text-transparent stroke-text">THE</span> <span className="text-lime-400">BEAST</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
            Experience the next generation of football at Dribblex Turf. Premium FIFA-grade surface, professional floodlights, and a world-class atmosphere.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onOpenBooking}
              className="px-10 py-5 bg-lime-400 text-black font-black italic tracking-tighter uppercase rounded-2xl hover:bg-lime-300 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-lime-400/30 flex items-center gap-3"
            >
              Secure Your Slot <Play className="w-4 h-4 fill-current" />
            </button>
            <a 
              href="#arena"
              className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black italic tracking-tighter uppercase rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3"
            >
              Explore Arena
            </a>
          </div>
        </div>

        {/* Floating Info Cards */}
        <div className="hidden lg:grid grid-cols-2 gap-6 animate-fade-in-right delay-300">
          <div className="space-y-6 mt-12">
            <InfoCard 
              icon={<Clock className="text-lime-400" />} 
              title="24/7 Access" 
              desc="Book your match anytime, day or night."
            />
            <InfoCard 
              icon={<MapPin className="text-lime-400" />} 
              title="Elite Location" 
              desc="Manikdia Club, Konapara, Dhaka."
            />
          </div>
          <div className="space-y-6">
            <InfoCard 
              icon={<Calendar className="text-lime-400" />} 
              title="Instant Booking" 
              desc="Check availability and book in 60 seconds."
            />
            <div className="p-8 rounded-3xl bg-lime-400 text-black space-y-4 transform hover:-translate-y-2 transition-transform shadow-2xl shadow-lime-400/20">
              <h3 className="text-2xl font-black italic tracking-tighter leading-none uppercase">Off Day Special</h3>
              <p className="font-bold text-sm">Fri & Sat slots available at special rates. Limited availability!</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
        @media (max-width: 640px) {
          .stroke-text {
            -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.3);
          }
        }
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fade-in-right 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
};

const InfoCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-lime-400/50 transition-all transform hover:-translate-y-2 group shadow-2xl">
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);
