import * as React from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export const Navbar = ({ onOpenBooking }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-emerald-600 rounded-xl flex items-center justify-center font-black text-black text-xl italic transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-lime-400/20">
            D
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-white">
            DRIBBLEX <span className="text-lime-400">TURF</span>
          </span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400">
          {['Home', 'Arena', 'Facilities', 'Pricing'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="hover:text-lime-400 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 transition-all group-hover:w-full"></span>
            </a>
          ))}
          <button 
            onClick={onOpenBooking}
            className="bg-lime-400 text-black px-8 py-3 rounded-full font-black italic tracking-tighter hover:bg-lime-300 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-lime-400/20"
          >
            BOOK NOW
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 ${
        isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
      }`}>
        <div className="p-8 flex flex-col gap-6 font-bold text-sm uppercase tracking-widest">
          {['Home', 'Arena', 'Facilities', 'Pricing'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-300 hover:text-lime-400"
            >
              {item}
            </a>
          ))}
          <button 
            onClick={() => {
              onOpenBooking();
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-lime-400 text-black py-4 rounded-xl font-black italic tracking-tighter uppercase shadow-lg shadow-lime-400/20"
          >
            BOOK NOW
          </button>
        </div>
      </div>
    </nav>
  );
};
