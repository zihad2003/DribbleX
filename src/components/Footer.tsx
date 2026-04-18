import * as React from 'react';
import { Facebook, Map, Phone, MapPin, MessageSquare, ArrowUpRight } from 'lucide-react';

export const Footer = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const [activeModal, setActiveModal] = React.useState<'privacy' | 'terms' | null>(null);

  const LegalModal = ({ type, onClose }: { type: 'privacy' | 'terms'; onClose: () => void }) => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">
            {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
            <ArrowUpRight className="w-6 h-6 rotate-45" />
          </button>
        </div>
        <div className="space-y-6 text-slate-400 font-medium text-sm leading-relaxed uppercase tracking-tight italic">
          {type === 'privacy' ? (
            <>
              <p>1. Data Collection: We collect minimal data (name and phone) solely for booking purposes.</p>
              <p>2. Usage: Your information is used only to confirm your turf reservation.</p>
              <p>3. Protection: We do not share your contact details with third-party advertisers.</p>
              <p>4. Cookies: We use essential cookies to maintain your session during the booking process.</p>
            </>
          ) : (
            <>
              <p>1. Booking: Slots are subject to availability. Confirmation is required via phone.</p>
              <p>2. Cancellation: Please notify us at least 6 hours in advance for cancellations.</p>
              <p>3. Conduct: Players must follow arena rules and maintain sportsmanship.</p>
              <p>4. Liability: Dribblex Turf is not responsible for personal injuries during play.</p>
            </>
          )}
        </div>
        <button 
          onClick={onClose}
          className="mt-10 w-full py-4 bg-lime-400 text-black font-black italic tracking-tighter uppercase rounded-xl hover:bg-lime-300 transition-all"
        >
          Understood
        </button>
      </div>
    </div>
  );

  return (
    <footer className="bg-slate-950 pt-32 pb-12 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="grid grid-cols-12 h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-white/10 h-full"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center font-black text-black text-2xl italic">D</div>
              <span className="text-3xl font-black italic tracking-tighter text-white uppercase">
                DRIBBLEX <span className="text-lime-400">TURF</span>
              </span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed italic">
              "Redefining the beautiful game with elite facilities and a passionate community."
            </p>
            <div className="flex items-center gap-4">
              <SocialBtn href="https://www.facebook.com/profile.php?id=61579866805359" icon={<Facebook className="w-5 h-5" />} />
              <SocialBtn href="https://www.google.com/maps/dir/?api=1&destination=Manikdia+Club+Konapara+Dhaka" icon={<Map className="w-5 h-5" />} />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white">Contact Us</h4>
            <div className="space-y-6">
              <ContactItem icon={<Phone className="text-lime-400" />} label="Call Support" value="01402973626" />
              <ContactItem icon={<MapPin className="text-lime-400" />} label="Location" value="Manikdia Club, Konapara" />
              <ContactItem icon={<MessageSquare className="text-lime-400" />} label="Messenger" value="Dribblex Turf" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white">Quick Access</h4>
            <div className="grid grid-cols-1 gap-4 font-bold text-xs uppercase tracking-widest text-slate-500">
              {['Home', 'Arena', 'Facilities', 'Pricing'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-lime-400 transition-colors flex items-center gap-2 group">
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  {link}
                </a>
              ))}
              <a href="/admin" className="hover:text-lime-400 transition-colors flex items-center gap-2 group">
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Admin Portal
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white">Join the Squad</h4>
            <p className="text-slate-500 text-xs font-medium leading-relaxed uppercase tracking-wider">Ready for your next match? Secure your preferred slot instantly.</p>
            <button 
              onClick={onOpenBooking}
              className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black italic tracking-tighter uppercase hover:bg-lime-400 hover:text-black hover:border-lime-400 transition-all shadow-xl group"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">&copy; 2026 DRIBBLEX TURF. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors uppercase tracking-widest">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors uppercase tracking-widest">Terms of Service</button>
          </div>
        </div>
      </div>

      {activeModal && (
        <LegalModal type={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </footer>
  );
};

const SocialBtn = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-lime-400 hover:text-black hover:border-lime-400 hover:rotate-12 transition-all duration-300"
  >
    {icon}
  </a>
);

const ContactItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-white uppercase tracking-tight">{value}</p>
    </div>
  </div>
);
