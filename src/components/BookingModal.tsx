import * as React from 'react';
import { Calendar, CheckCircle2, X, Sun, Moon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  daySlots: string[];
  nightSlots: string[];
  existingBookings: any[];
  isSlotPast: (slot: string) => boolean;
  onBookingSubmit: (data: { name: string; phone: string; startTime: string; date: string; duration: number }) => void;
  isSubmitting?: boolean;
}

export const BookingModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onDateChange, 
  daySlots, 
  nightSlots, 
  existingBookings, 
  isSlotPast,
  onBookingSubmit,
  isSubmitting = false
}: BookingModalProps) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    startTime: '',
    duration: 1.5
  });

  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle successful submission external signal
  React.useEffect(() => {
    if (!isSubmitting && step === 2 && formData.name && formData.phone) {
      // We don't automatically go to step 3 here because we need to know if the mutation was actually successful
    }
  }, [isSubmitting]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.startTime) return;
    
    onBookingSubmit({
      ...formData,
      date: selectedDate
    });
    setStep(3); // Go to success view
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData({ name: '', phone: '', startTime: '', duration: 1.5 });
    }, 300);
  };

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const newDateStr = current.toISOString().split('T')[0];
    if (newDateStr >= today) {
      onDateChange(newDateStr);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-fade-in" 
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-white/10 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-modal-in">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">
              RESERVE <span className="text-lime-400">ARENA</span>
            </h2>
            <button onClick={handleClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Select Date</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => changeDate(-1)}
                    disabled={selectedDate <= today}
                    className="p-4 bg-slate-800 border border-white/10 rounded-2xl text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <input 
                    type="date" 
                    min={today}
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="flex-1 bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-lime-400 transition-colors font-bold"
                  />
                  <button 
                    onClick={() => changeDate(1)}
                    className="p-4 bg-slate-800 border border-white/10 rounded-2xl text-white hover:bg-white/5 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-400" /> Day Slots (90 Mins)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {daySlots.map(slot => {
                      const isBooked = existingBookings.some((b: any) => b.startTime === slot && b.date === selectedDate && b.status !== 'cancelled');
                      const isPast = isSlotPast(slot);
                      const isDisabled = isBooked || isPast;
                      return (
                        <button
                          key={slot}
                          disabled={isDisabled}
                          onClick={() => {
                            setFormData({...formData, startTime: slot});
                            setStep(2);
                          }}
                          className={`py-3.5 rounded-2xl font-black italic tracking-tighter text-xs uppercase transition-all ${
                            isDisabled 
                              ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed line-through border-transparent' 
                              : 'bg-slate-800 text-white hover:bg-lime-400 hover:text-black border border-white/5 hover:scale-[1.02]'
                          }`}
                        >
                          {isBooked ? 'Occupied' : slot}
                          {isPast && !isBooked && <span className="ml-1 text-[8px] opacity-50 block font-normal">Passed</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-400" /> Night Slots (90 Mins)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {nightSlots.map(slot => {
                      const isBooked = existingBookings.some((b: any) => b.startTime === slot && b.date === selectedDate && b.status !== 'cancelled');
                      const isPast = isSlotPast(slot);
                      const isDisabled = isBooked || isPast;
                      return (
                        <button
                          key={slot}
                          disabled={isDisabled}
                          onClick={() => {
                            setFormData({...formData, startTime: slot});
                            setStep(2);
                          }}
                          className={`py-3.5 rounded-2xl font-black italic tracking-tighter text-xs uppercase transition-all ${
                            isDisabled 
                              ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed line-through border-transparent' 
                              : 'bg-slate-800 text-white hover:bg-lime-400 hover:text-black border border-white/5 hover:scale-[1.02]'
                          }`}
                        >
                          {isBooked ? 'Occupied' : slot}
                          {isPast && !isBooked && <span className="ml-1 text-[8px] opacity-50 block font-normal">Passed</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="space-y-8 animate-fade-in">
              <div className="flex items-center gap-6 bg-lime-400/10 p-6 rounded-3xl border border-lime-400/20">
                <div className="w-12 h-12 rounded-2xl bg-lime-400 flex items-center justify-center text-black">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-lime-400 uppercase tracking-[0.2em] mb-1">Selected Session</p>
                  <p className="text-xl font-black italic text-white uppercase tracking-tight">{selectedDate} @ {formData.startTime}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="ENTER YOUR NAME"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-lime-400 transition-colors font-bold placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-lime-400 transition-colors font-bold placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 bg-slate-800 text-white rounded-2xl font-black italic tracking-tighter uppercase hover:bg-slate-700 transition-all active:scale-95"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-5 bg-lime-400 text-black rounded-2xl font-black italic tracking-tighter uppercase hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/20 active:scale-95"
                >
                  Confirm Request
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-fade-in">
              <div className="w-24 h-24 bg-lime-400/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                <CheckCircle2 className="w-12 h-12 text-lime-400" />
              </div>
              <h3 className="text-4xl font-black italic tracking-tighter mb-4 uppercase text-white">REQUESTED!</h3>
              <p className="text-slate-400 font-medium italic mb-10 px-6">
                Great move! We've received your request. Our team will contact you at <span className="text-white font-bold">{formData.phone}</span> within 15 minutes to confirm.
              </p>
              <button 
                onClick={handleClose}
                className="w-full py-5 bg-slate-800 text-white rounded-2xl font-black italic tracking-tighter uppercase hover:bg-slate-700 transition-all active:scale-95"
              >
                Close Portal
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-modal-in { animation: modal-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
