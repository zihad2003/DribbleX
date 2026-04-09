import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CheckCircle, XCircle, Clock, Phone, User, Calendar as CalendarIcon } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const { data: bookings } = useSuspenseQuery(convexQuery(api.bookings.getAllBookings, {}));
  const updateStatus = useMutation(api.bookings.updateBookingStatus);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
  };

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
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/[0.02] transition-colors group">
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
                            onClick={() => updateStatus({ id: booking._id, status: 'confirmed' })}
                            className="p-2 bg-lime-400/10 text-lime-400 rounded-lg hover:bg-lime-400 hover:text-black transition-all"
                            title="Confirm Booking"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button 
                            onClick={() => updateStatus({ id: booking._id, status: 'cancelled' })}
                            className="p-2 bg-red-400/10 text-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-all"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
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
