import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import { getAllBookings, updateBookingStatus, deleteBooking } from "../server/bookings";
import { CheckCircle, XCircle, Clock, Phone, User, Calendar as CalendarIcon, Loader2, Trash2 } from 'lucide-react';
import { useState, Suspense, type FormEvent } from 'react';

export const Route = createFileRoute('/admin')({
  component: AdminWrapper,
})

function AdminWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
      </div>
    }>
      <AdminPage />
    </Suspense>
  )
}

function AdminPage() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const adminBookingsQuery = queryOptions({
    queryKey: ['admin', 'bookings'],
    queryFn: () => getAllBookings(),
  })

  const { data: bookings = [] } = useSuspenseQuery(adminBookingsQuery);

  const statusMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateBookingStatus>[0]['data']) => updateBookingStatus({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBooking({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
    }
  });

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginData.email === 'dribblex.turf' && loginData.password === '@dribblex2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: any) => b.status === 'pending').length,
    confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center font-black text-black text-3xl italic mx-auto mb-6">D</div>
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Admin Access</h2>
            <p className="text-slate-500 text-sm font-medium mt-2 uppercase tracking-widest">Restricted Area</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">User Identifier</label>
              <input 
                required
                type="text" 
                placeholder="EMAIL OR USERNAME"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-lime-400 transition-colors font-bold placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Secure Key</label>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full bg-slate-800 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-lime-400 transition-colors font-bold placeholder:text-slate-600"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-3 px-4 rounded-xl text-center uppercase tracking-wider">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-lime-400 text-black rounded-2xl font-black italic tracking-tighter uppercase hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/20 active:scale-95"
            >
              Unlock Portal
            </button>
          </form>
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter mb-2">
              BOOKING <span className="text-lime-400">ADMIN</span>
            </h1>
            <p className="text-slate-400">Manage your turf reservations and schedules.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total</p>
              <p className="text-2xl font-black italic text-white">{stats.total}</p>
            </div>
            <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 mb-1">Pending</p>
              <p className="text-2xl font-black italic text-yellow-400">{stats.pending}</p>
            </div>
            <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-lime-500 mb-1">Confirmed</p>
              <p className="text-2xl font-black italic text-lime-400">{stats.confirmed}</p>
            </div>
          </div>
        </header>

        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Schedule</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{booking.name}</p>
                          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                            <Phone className="w-3 h-3" />
                            {booking.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-300">
                          <CalendarIcon className="w-4 h-4 text-lime-400" />
                          <span className="font-medium">{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Clock className="w-4 h-4" />
                          {booking.startTime} ({booking.duration} hr)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-lime-400/10 text-lime-400' :
                        booking.status === 'cancelled' ? 'bg-red-400/10 text-red-400' :
                        'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                        {booking.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status !== 'confirmed' && (
                          <button 
                            onClick={() => statusMutation.mutate({ id: booking.id, status: 'confirmed' })}
                            className="p-2 bg-lime-400/10 text-lime-400 rounded-lg hover:bg-lime-400 hover:text-black transition-all"
                            title="Confirm Booking"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button 
                            onClick={() => statusMutation.mutate({ id: booking.id, status: 'cancelled' })}
                            className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (confirm('Permanently delete this booking?')) {
                              deleteMutation.mutate(booking.id);
                            }
                          }}
                          className="p-2 bg-red-400/10 text-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                      <p className="text-xl font-medium italic">No bookings found yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
