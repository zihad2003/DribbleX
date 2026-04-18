import * as React from 'react';
import { Sun, Moon, CheckCircle2 } from 'lucide-react';

interface PricingProps {
  onOpenBooking: () => void;
  daySlots: string[];
  nightSlots: string[];
}

export const Pricing = ({ onOpenBooking, daySlots, nightSlots }: PricingProps) => {
  return (
    <section id="pricing" className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Aggressive Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-lime-400 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 blur-[180px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-4">
          <div className="inline-block px-4 py-1 bg-lime-400 text-black text-[10px] font-black uppercase tracking-[0.5em] mb-4 -rotate-2">
            Pricing
          </div>
          <h3 className="text-6xl md:text-9xl font-black italic tracking-[ -0.05em] text-white uppercase leading-[0.8] mb-8">
            CHOOSE <br /> <span className="text-lime-400">YOUR</span> <br /> <span className="text-transparent stroke-text-white">ENERGY</span>
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto font-bold text-lg uppercase tracking-tight pt-8 opacity-60">
            Elite level facilities. Zero compromises. Pick your slot.
          </p>
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-3 rounded-full mt-12 backdrop-blur-xl group hover:border-yellow-400/50 transition-all cursor-default">
            <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.5)]"></span>
            <span className="text-sm font-black italic tracking-tighter text-white uppercase group-hover:text-yellow-400 transition-colors">Weekend Hype: Day 2000 | Night 3000 (Fri-Sat)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto items-stretch">
          {/* Day Card */}
          <PricingCard 
            title="Day Burn"
            icon={<Sun className="w-12 h-12 text-yellow-400" />}
            price="1500"
            regularPrice="2000"
            slots={daySlots}
            color="yellow"
            onBook={onOpenBooking}
          />
          
          {/* Night Card */}
          <PricingCard 
            title="Night Mode"
            icon={<Moon className="w-12 h-12 text-blue-400" />}
            price="2500"
            regularPrice="3000"
            slots={nightSlots}
            color="blue"
            onBook={onOpenBooking}
            isPremium
          />
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ title, icon, price, regularPrice, slots, color, onBook, isPremium }: any) => {
  const colorGlow = color === 'yellow' ? 'group-hover:shadow-yellow-400/20' : 'group-hover:shadow-blue-500/20';
  const accentText = color === 'yellow' ? 'text-yellow-400' : 'text-blue-400';

  return (
    <div className={`relative group transition-all duration-700 hover:-translate-y-4 hover:z-10`}>
      {isPremium && (
        <div className="absolute -top-6 left-10 bg-lime-400 text-black px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest z-20 -rotate-3 shadow-[0_10px_30px_rgba(163,230,53,0.3)]">
          Hottest Pick
        </div>
      )}
      
      <div className={`h-full bg-slate-900 border-2 border-white/5 group-hover:border-white/20 rounded-[3.5rem] p-10 flex flex-col transition-all duration-500 ${colorGlow} shadow-2xl`}>
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h4 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                {title.split(' ')[0]} <br /> <span className={accentText}>{title.split(' ')[1]}</span>
              </h4>
              <div className="opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500">
                {icon}
              </div>
            </div>
            <div className="flex items-baseline gap-4 pt-4">
              <span className="text-7xl font-black italic tracking-tighter text-white">{price}</span>
              <div className="flex flex-col">
                <span className="text-xl font-black text-lime-400 italic -mb-1">TK</span>
                <span className="text-xs text-slate-500 line-through font-black opacity-50 uppercase tracking-widest">{regularPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 mb-16 flex-grow">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 border-b-2 border-white/5 pb-4">
            Available Sessions / 90 Mins
          </p>
          <div className="grid grid-cols-2 gap-4">
            {slots.map((s: string) => (
              <div key={s} className="flex items-center gap-3 text-[10px] font-black text-slate-400 bg-white/[0.02] py-4 px-5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all hover:bg-white/[0.05] hover:text-white uppercase tracking-tighter">
                <div className={`w-1.5 h-1.5 rounded-full ${color === 'yellow' ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                {s}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onBook}
          className={`w-full py-6 rounded-3xl font-black italic tracking-[0.1em] uppercase transition-all shadow-2xl transform active:scale-95 text-lg
            ${color === 'yellow' 
              ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-yellow-400/40' 
              : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-600/40'}
          `}
        >
          Book {title.split(' ')[0]} Now
        </button>
      </div>
    </div>
  );
};
