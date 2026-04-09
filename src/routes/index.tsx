import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Clock, MapPin, Phone, MessageSquare, Shield, Zap, Coffee, Users, CheckCircle2 } from 'lucide-react'
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Dribblex Turf | Premium Football Experience' },
      { name: 'description', content: 'Experience football like never before at Dribblex Turf. Opening 10th April 2026.' }
    ]
  }),
  component: Home,
})

function Countdown() {
  const targetDate = new Date('2026-04-10T17:00:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 md:gap-8 justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-2 shadow-xl shadow-black/20">
            <span className="text-2xl md:text-5xl font-black text-lime-400 tracking-tighter tabular-nums leading-none">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1: Select Slot, 2: Details, 3: Success

  const { data: existingBookings } = useSuspenseQuery(
    convexQuery(api.bookings.getBookingsByDate, { date: selectedDate })
  );

  const createBooking = useMutation(api.bookings.createBooking);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    startTime: '',
    duration: 1
  });

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBooking({
      name: formData.name,
      phone: formData.phone,
      date: selectedDate,
      startTime: formData.startTime,
      duration: formData.duration
    });
    setBookingStep(3);
  };

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
                  BOOK <span className="text-lime-400">SLOT</span>
                </h2>
                <button onClick={() => setIsBookingOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Select Date</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-lime-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Available Slots (1 Hour)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(slot => {
                        const isBooked = existingBookings.some(b => b.startTime === slot && b.status !== 'cancelled');
                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => {
                              setFormData({...formData, startTime: slot});
                              setBookingStep(2);
                            }}
                            className={`py-3 rounded-xl font-bold transition-all ${
                              isBooked 
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed line-through' 
                                : 'bg-slate-800 hover:bg-lime-400 hover:text-black border border-white/5'
                            }`}
                          >
                            {slot}
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
                      placeholder="John Doe"
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
                      Confirm Booking
                    </button>
                  </div>
                </form>
              )}

              {bookingStep === 3 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-lime-400" />
                  </div>
                  <h3 className="text-2xl font-black italic tracking-tighter mb-2">BOOKING REQUEST SENT!</h3>
                  <p className="text-slate-400 mb-8">We will contact you shortly at <span className="text-white font-bold">{formData.phone}</span> to confirm your slot.</p>
                  <button 
                    onClick={() => {
                      setIsBookingOpen(false);
                      setBookingStep(1);
                      setFormData({name: '', phone: '', startTime: '', duration: 1});
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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-emerald-600 rounded-lg flex items-center justify-center font-black text-black text-xl italic">
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
            className="bg-lime-400 text-black px-6 py-2.5 rounded-full font-bold hover:bg-lime-300 transition-all transform hover:scale-105 active:scale-95"
          >
            BOOK NOW
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
        {/* Background Video/Image (Drone Shot Placeholder) */}
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
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 backdrop-blur-sm text-lime-400 font-bold tracking-widest text-sm uppercase">
            Official Invitation
          </div>
          
          <h2 className="text-2xl md:text-3xl font-medium mb-4 text-slate-300 drop-shadow-lg">
            You Are Cordially Invited To
          </h2>

          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-lime-400 opacity-20 blur-3xl rounded-full"></div>
            <h1 className="relative text-6xl md:text-9xl font-black italic tracking-tighter leading-none drop-shadow-2xl">
              DRIBBLEX
              <br />
              <span className="text-lime-400">TURF</span>
            </h1>
          </div>

          <p className="text-2xl md:text-4xl font-bold text-yellow-400 mb-12 italic tracking-wide uppercase drop-shadow-lg">
            Opening and Special Match Day
          </p>

          <Countdown />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 group hover:border-lime-400/50 transition-all shadow-lg shadow-black/50">
              <Calendar className="w-8 h-8 text-lime-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Opening Day</p>
                <p className="text-xl font-bold">10 April 2026, Friday</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 group hover:border-lime-400/50 transition-all shadow-lg shadow-black/50">
              <Clock className="w-8 h-8 text-lime-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Time</p>
                <p className="text-xl font-bold">5:00 PM</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 group hover:border-lime-400/50 transition-all shadow-lg shadow-black/50">
              <MapPin className="w-8 h-8 text-lime-400 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Location</p>
                <p className="text-xl font-bold">Manikdia Club, Konapara</p>
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[600px]">
            <div className="md:col-span-8 relative rounded-3xl overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Artificial turf field" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <p className="text-lime-400 font-bold uppercase tracking-widest text-xs mb-1">Premium Quality</p>
                <h3 className="text-2xl font-black italic text-white tracking-tighter">FIFA GRADE TURF</h3>
              </div>
            </div>
            <div className="md:col-span-4 grid grid-rows-2 gap-4">
              <div className="relative rounded-3xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Football under lights" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-lime-400 font-bold uppercase tracking-widest text-xs mb-1">Night Play</p>
                  <h3 className="text-xl font-black italic text-white tracking-tighter">HD LIGHTING</h3>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Turf close up" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-lime-400 font-bold uppercase tracking-widest text-xs mb-1">Professional</p>
                  <h3 className="text-xl font-black italic text-white tracking-tighter">PRO EXPERIENCE</h3>
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
            <p className="text-slate-400 max-w-2xl mx-auto">
              Simple and transparent pricing for everyone. Book by the hour.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-lime-400/30 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-black italic mb-2 tracking-tighter">OFF-PEAK</h3>
              <p className="text-slate-400 mb-6 font-medium uppercase tracking-widest text-xs">6:00 AM - 4:00 PM</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black italic tracking-tighter text-lime-400">1500</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">BDT / HR</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                  Full Field Access
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                  Mineral Water Provided
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                  Parking Included
                </li>
              </ul>
              <button onClick={() => setIsBookingOpen(true)} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-lime-400 hover:text-black hover:border-lime-400 transition-all">
                BOOK OFF-PEAK
              </button>
            </div>

            <div className="bg-gradient-to-br from-lime-400/10 to-emerald-600/10 border border-lime-400/30 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-lime-400 text-black px-4 py-1.5 rounded-bl-2xl font-black italic tracking-tighter text-xs uppercase">
                Most Popular
              </div>
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap className="w-24 h-24 text-lime-400" />
              </div>
              <h3 className="text-2xl font-black italic mb-2 tracking-tighter">PEAK HOURS</h3>
              <p className="text-lime-400/70 mb-6 font-medium uppercase tracking-widest text-xs">4:00 PM - 12:00 AM</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black italic tracking-tighter text-lime-400">2000</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">BDT / HR</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                  Floodlight Access Included
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                  HD Action Recording (Optional)
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                  Tournament Support
                </li>
              </ul>
              <button onClick={() => setIsBookingOpen(true)} className="w-full py-4 rounded-2xl bg-lime-400 text-black font-black italic tracking-tighter uppercase hover:bg-lime-300 transition-all shadow-lg shadow-lime-400/20">
                BOOK PEAK SLOT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer & Contact Banner */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-lime-600 to-emerald-600 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-black/20 backdrop-blur-sm p-2 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </span>
                <span className="font-bold uppercase tracking-widest text-white/80">Limited Time Offer</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Special Discount Available <br /> 
                <span className="text-black/50 tracking-tighter">in Opening Month</span>
              </h3>
            </div>

            <div className="relative z-10 flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/20">
                <Phone className="w-8 h-8 text-white fill-white" />
                <div className="text-left">
                  <p className="text-white/70 font-bold text-xs uppercase tracking-widest">Contact Now</p>
                  <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">01402973626</p>
                </div>
              </div>
            </div>

            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p className="mb-4 text-lg font-black italic tracking-tighter text-white/50 uppercase">DRIBBLEX TURF</p>
          <p className="mb-4">&copy; 2026 Dribblex Turf. All rights reserved.</p>
          <p className="text-sm mb-6">Manikdia Club, Konapara, Dhaka.</p>
          <a href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-slate-800 hover:text-lime-400 transition-colors">Admin Access</a>
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
