import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Clock, MapPin, Phone, MessageSquare, Shield, Zap, Coffee, Users, CheckCircle2, Sun, Moon, Instagram, Facebook } from 'lucide-react'
import { useState } from "react";

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Dribblex Turf | Premium Football Experience' },
      { name: 'description', content: 'Experience football like never before at Dribblex Turf. Now Activated!' }
    ]
  }),
  component: Home,
})

function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  
  // Dummy data for now - will be replaced with D1 queries
  const [existingBookings] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    startTime: '',
    duration: 1.5
  });

  const daySlots = [
    "07:00 - 08:30", "08:35 - 10:05", "10:10 - 11:40", "11:45 - 01:15", 
    "01:20 - 02:50", "02:55 - 04:25", "04:30 - 06:00"
  ];

  const nightSlots = [
    "06:05 - 07:35", "07:40 - 09:10", "09:15 - 10:45", "10:50 - 12:20"
  ];

  const isSlotPast = (slot: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (selectedDate > todayStr) return false;
    if (selectedDate < todayStr) return true;

    const [start] = slot.split(' - ');
    const [hours, minutes] = start.split(':').map(Number);
    
    let slotHours = hours;
    if (hours >= 1 && hours <= 6) slotHours += 12; 
    if (hours >= 7 && hours <= 11 && (slot.includes('07:40') || slot.includes('09:15') || slot.includes('10:50'))) {
      slotHours += 12;
    }

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (slotHours < currentHours) return true;
    if (slotHours === currentHours && minutes < currentMinutes) return true;
    return false;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.startTime) return;
    
    // Will implement D1 booking creation here
    console.log("Booking requested for D1:", formData);
    setBookingStep(3);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-lime-400 selection:text-black">
      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsBookingOpen(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black italic tracking-tighter">
                  RESERVE <span className="text-lime-400">ARENA</span>
                </h2>
                <button onClick={() => setIsBookingOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Select Date</label>
                    <input 
                      type="date" 
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-400" /> Day Slots (1.5 HR)
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {daySlots.map(slot => {
                        const isBooked = existingBookings.some(b => b.startTime === slot && b.status !== 'cancelled');
                        const isPast = isSlotPast(slot);
                        const isDisabled = isBooked || isPast;
                        return (
                          <button
                            key={slot}
                            disabled={isDisabled}
                            onClick={() => {
                              setFormData({...formData, startTime: slot});
                              setBookingStep(2);
                            }}
                            className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                              isDisabled 
                                ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed line-through border-transparent' 
                                : 'bg-slate-800 hover:bg-lime-400 hover:text-black border border-white/5'
                            }`}
                          >
                            {slot}
                            {isPast && !isBooked && <span className="ml-1 text-[8px] opacity-50 block font-normal">Passed</span>}
                          </button>
                        );
                      })}
                    </div>

                    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-400" /> Night Slots (1.5 HR)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {nightSlots.map(slot => {
                        const isBooked = existingBookings.some(b => b.startTime === slot && b.status !== 'cancelled');
                        const isPast = isSlotPast(slot);
                        const isDisabled = isBooked || isPast;
                        return (
                          <button
                            key={slot}
                            disabled={isDisabled}
                            onClick={() => {
                              setFormData({...formData, startTime: slot});
                              setBookingStep(2);
                            }}
                            className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                              isDisabled 
                                ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed line-through border-transparent' 
                                : 'bg-slate-800 hover:bg-lime-400 hover:text-black border border-white/5'
                            }`}
                          >
                            {slot}
                            {isPast && !isBooked && <span className="ml-1 text-[8px] opacity-50 block font-normal">Passed</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="flex items-center gap-4 bg-lime-400/10 p-4 rounded-2xl border border-lime-400/20 mb-6">
                    <Calendar className="text-lime-400" />
                    <div>
                      <p className="text-xs font-bold text-lime-400 uppercase tracking-widest">Selected Slot</p>
                      <p className="font-bold">{selectedDate} @ {formData.startTime}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-400 transition-colors"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="flex-1 py-4 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="flex-2 py-4 bg-lime-400 text-black rounded-2xl font-black italic tracking-tighter uppercase hover:bg-lime-300 transition-all"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              )}

              {bookingStep === 3 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-lime-400" />
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tighter mb-2">REQUESTED!</h3>
                  <p className="text-slate-400 mb-8">We will contact you shortly at <span className="text-white font-bold">{formData.phone}</span>.</p>
                  <button 
                    onClick={() => {
                      setIsBookingOpen(false);
                      setBookingStep(1);
                      setFormData({name: '', phone: '', startTime: '', duration: 1.5});
                    }}
                    className="w-full py-4 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Dribblex Logo" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-emerald-600 rounded-lg hidden items-center justify-center font-black text-black text-xl italic group">
              D
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-white">
              DRIBBLEX <span className="text-lime-400">TURF</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm uppercase tracking-widest text-slate-300">
            <a href="#" className="hover:text-lime-400 transition-colors">Home</a>
            <a href="#gallery" className="hover:text-lime-400 transition-colors">Arena</a>
            <a href="#facilities" className="hover:text-lime-400 transition-colors">Facilities</a>
            <a href="#pricing" className="hover:text-lime-400 transition-colors">Pricing</a>
            <button onClick={() => setIsBookingOpen(true)} className="hover:text-lime-400 transition-colors">Booking</button>
          </div>

          <button 
            onClick={() => setIsBookingOpen(true)}
            className="bg-lime-400 text-black px-6 py-2.5 rounded-full font-bold hover:bg-lime-300 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-lime-400/20"
          >
            BOOK NOW
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2076&auto=format&fit=crop" 
            alt="Drone view of football turf"
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 opacity-40"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-20">
          <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-lime-400 bg-lime-400/20 backdrop-blur-md text-white font-black tracking-[0.2em] text-lg uppercase animate-pulse">
            WE ARE ACTIVATED
          </div>
          
          <h2 className="text-2xl md:text-3xl font-medium mb-4 text-slate-300 drop-shadow-lg">
            Welcome to the Ultimate Arena
          </h2>

          <div className="relative inline-block mb-8 group">
            <div className="absolute -inset-4 bg-lime-400 opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity"></div>
            <h1 className="relative text-6xl md:text-9xl font-black italic tracking-tighter leading-none drop-shadow-2xl">
              DRIBBLEX
              <br />
              <span className="text-lime-400">TURF</span>
            </h1>
          </div>

          <p className="text-2xl md:text-4xl font-bold text-yellow-400 mb-12 italic tracking-wide uppercase drop-shadow-lg">
            Experience Premium Football
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 group hover:border-lime-400/50 transition-all shadow-lg shadow-black/50">
              <Calendar className="w-8 h-8 text-lime-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Opening Status</p>
                <p className="text-xl font-bold">Now Open</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 group hover:border-lime-400/50 transition-all shadow-lg shadow-black/50">
              <Clock className="w-8 h-8 text-lime-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Operating Hours</p>
                <p className="text-xl font-bold">7:00 AM - 12:20 AM</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 group hover:border-lime-400/50 transition-all shadow-lg shadow-black/50">
              <MapPin className="w-8 h-8 text-lime-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Location</p>
                <p className="text-xl font-bold text-sm">Manikdia Club, Konapara</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 uppercase">
              WORLD CLASS <span className="text-lime-400">FACILITIES</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We provide the best environment for your football matches, ensuring safety, comfort, and a professional feel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'FIFA Grade Turf', desc: 'Premium artificial grass for professional play and injury prevention.' },
              { icon: Zap, title: 'Night Lighting', desc: 'High-intensity LED floodlights for perfect visibility during night matches.' },
              { icon: Coffee, title: 'Changing Rooms', desc: 'Clean and spacious changing rooms with shower facilities.' },
              { icon: Users, title: 'Spectator Area', desc: 'Comfortable seating for friends and family to cheer you on.' },
            ].map((facility, index) => (
              <div key={index} className="p-8 bg-slate-800/50 rounded-3xl border border-white/5 hover:border-lime-400/30 transition-all hover:-translate-y-2 group">
                <div className="w-12 h-12 bg-lime-400/10 rounded-2xl flex items-center justify-center text-lime-400 mb-6 group-hover:bg-lime-400 group-hover:text-black transition-colors">
                  <facility.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{facility.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 uppercase">
                THE <span className="text-lime-400">ARENA</span>
              </h2>
              <p className="text-slate-400 max-w-xl">
                Take a look at our premium facility from every angle. Built for the beautiful game.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[500px] lg:h-[600px]">
            <div className="md:col-span-8 relative rounded-3xl overflow-hidden group min-h-[300px] md:min-h-0">
              <img src="https://images.unsplash.com/photo-1517747614396-d21a78b850e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Artificial Turf Field" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-left">
                <p className="text-lime-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Ground Level</p>
                <h3 className="text-3xl font-black italic text-white tracking-tighter">PREMIUM ARTIFICIAL TURF</h3>
              </div>
            </div>
            <div className="md:col-span-4 grid grid-rows-2 gap-4 min-h-[400px] md:min-h-0">
              <div className="relative rounded-3xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1570498839593-e565b39455fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Match ready ball on turf" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-left">
                  <p className="text-lime-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Equipment</p>
                  <h3 className="text-xl font-black italic text-white tracking-tighter uppercase">Match Ready</h3>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1647118868186-70d38e10b0dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Floodlit arena" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-left">
                  <p className="text-lime-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Lights On</p>
                  <h3 className="text-xl font-black italic text-white tracking-tighter uppercase">Night Sessions</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 uppercase">
              CHOOSE YOUR <span className="text-lime-400">SLOT</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-4">
              Book your 1.5-hour session now. Offer prices available for a limited time!
            </p>
            <div className="inline-block bg-yellow-400/10 border border-yellow-400/30 px-6 py-2 rounded-full text-yellow-400 font-black italic tracking-tighter uppercase text-sm">
              Off Day (Fri & Sat): Day 2000 Tk | Night 3000 Tk
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Day Light */}
            <div className="bg-gradient-to-br from-yellow-400/20 to-orange-600/20 border border-yellow-400/30 rounded-3xl p-8 relative overflow-hidden group flex flex-col h-full">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sun className="w-24 h-24 text-yellow-400" />
              </div>
              <h3 className="text-3xl font-black italic mb-2 tracking-tighter">DAY LIGHT <Sun className="inline w-6 h-6 mb-1" /></h3>
              <div className="mb-8">
                <p className="text-slate-400 text-sm font-bold line-through">Regular Price: 2000 Tk</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black italic tracking-tighter text-lime-400">1500 Tk</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Offer Price</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-white/10 pb-2">Available Slots (1.5 HR)</p>
                <div className="grid grid-cols-2 gap-2">
                  {daySlots.map(s => (
                    <div key={s} className="text-xs font-bold bg-white/5 py-2.5 px-3 rounded-lg border border-white/5 text-center flex items-center justify-center min-h-[40px] whitespace-nowrap">{s}</div>
                  ))}
                </div>
              </div>

              <button onClick={() => setIsBookingOpen(true)} className="w-full py-4 mt-auto rounded-2xl bg-yellow-400 text-black font-black italic tracking-tighter uppercase hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20 transform hover:scale-[1.02] active:scale-95">
                BOOK DAY SLOT
              </button>
            </div>

            {/* Night Light */}
            <div className="bg-gradient-to-br from-blue-400/20 to-indigo-600/20 border border-blue-400/30 rounded-3xl p-8 relative overflow-hidden group flex flex-col h-full">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Moon className="w-24 h-24 text-blue-400" />
              </div>
              <h3 className="text-3xl font-black italic mb-2 tracking-tighter">NIGHT LIGHT <Moon className="inline w-6 h-6 mb-1" /></h3>
              <div className="mb-8">
                <p className="text-slate-400 text-sm font-bold line-through">Regular Price: 3000 Tk</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black italic tracking-tighter text-lime-400">2500 Tk</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Offer Price</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-white/10 pb-2">Available Slots (1.5 HR)</p>
                <div className="grid grid-cols-2 gap-2">
                  {nightSlots.map(s => (
                    <div key={s} className="text-xs font-bold bg-white/5 py-2.5 px-3 rounded-lg border border-white/5 text-center flex items-center justify-center min-h-[40px] whitespace-nowrap">{s}</div>
                  ))}
                </div>
              </div>

              <button onClick={() => setIsBookingOpen(true)} className="w-full py-4 mt-auto rounded-2xl bg-blue-500 text-white font-black italic tracking-tighter uppercase hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20 transform hover:scale-[1.02] active:scale-95">
                BOOK NIGHT SLOT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-tier Structured Footer */}
      <footer className="bg-slate-950 pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tier 1: Primary CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
            <div className="flex flex-col items-start text-left group">
              <MapPin className="w-5 h-5 text-slate-500 mb-4 group-hover:text-white transition-colors" />
              <h4 className="text-sm font-black tracking-[0.2em] text-white mb-2 uppercase">Location</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">Manikdia Club, Konapara, Dhaka.</p>
            </div>

            <div className="flex flex-col items-start text-left group">
              <Phone className="w-5 h-5 text-slate-500 mb-4 group-hover:text-white transition-colors" />
              <h4 className="text-sm font-black tracking-[0.2em] text-white mb-2 uppercase">Inquiries</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">01402973626</p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center justify-between w-full bg-lime-400 px-6 py-4 rounded-xl group hover:bg-lime-300 transition-all shadow-lg shadow-lime-400/10"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-black/40">Ready to play</span>
                  <span className="text-sm font-black italic tracking-tighter text-black uppercase">Book Now</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-black/30 group-hover:text-black transition-colors" />
              </button>
            </div>

            <div className="flex flex-col items-start text-left group">
              <MessageSquare className="w-5 h-5 text-slate-500 mb-4 group-hover:text-white transition-colors" />
              <h4 className="text-sm font-black tracking-[0.2em] text-white mb-2 uppercase">Support</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">Join our Facebook group for match updates.</p>
            </div>
          </div>

          {/* Tier 2: Separator */}
          <div className="w-full h-px bg-white/10 mb-8"></div>

          {/* Tier 3: Identity & Nav */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Dribblex" className="h-6 w-auto grayscale opacity-50" />
              <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">&copy; 2026 DRIBBLEX TURF</span>
            </div>

            {/* Middle: Address */}
            <p className="text-[10px] font-medium tracking-widest text-slate-700 uppercase hidden lg:block">
              KONAPARA, DHAKA, BANGLADESH.
            </p>

            {/* Navigation & Social */}
            <div className="flex items-center gap-8">
              <a href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-slate-800 hover:text-lime-400 transition-colors">Portal Access</a>
              <div className="flex items-center gap-4">
                <a href="https://www.facebook.com/profile.php?id=61579866805359" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="text-slate-700 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
