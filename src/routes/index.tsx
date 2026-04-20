import { createFileRoute } from '@tanstack/react-router'
import { useState, Suspense } from "react";
import { useSuspenseQuery, useMutation, queryOptions, useQueryClient } from "@tanstack/react-query";
import { getBookingsByDate, createBooking } from "../server/bookings";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Facilities } from "../components/Facilities";
import { Gallery } from "../components/Gallery";
import { Pricing } from "../components/Pricing";
import { Testimonials } from "../components/Testimonials";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";
import { BookingModal } from "../components/BookingModal";
import { MessageCircle, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Dribblex Turf | Premium Football Experience' },
      { name: 'description', content: 'Experience football like never before at Dribblex Turf. Elite FIFA-grade arena now activated in Dhaka.' }
    ]
  }),
  component: HomeWrapper,
})

function HomeWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
      </div>
    }>
      <Home />
    </Suspense>
  )
}

const daySlots = [
  "07:00 - 08:30", "08:35 - 10:05", "10:10 - 11:40", "11:45 - 01:15", 
  "01:20 - 02:50", "02:55 - 04:25", "04:30 - 06:00"
];

const nightSlots = [
  "06:05 - 07:35", "07:40 - 09:10", "09:15 - 10:45", "10:50 - 12:20"
];

function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const queryClient = useQueryClient();

  const bookingsQuery = queryOptions({
    queryKey: ['bookings', selectedDate],
    queryFn: () => getBookingsByDate({ data: selectedDate }),
  })

  const { data: existingBookings = [] } = useSuspenseQuery(bookingsQuery);

  const bookingMutation = useMutation({
    mutationFn: (data: Parameters<typeof createBooking>[0]['data']) => createBooking({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', selectedDate] });
    }
  });

  const isSlotPast = (slot: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (selectedDate > todayStr) return false;
    if (selectedDate < todayStr) return true;

    // Standardize time comparison
    // Slot format: "HH:mm - HH:mm"
    const [startTimeStr] = slot.split(' - ');
    const [hoursStr, minutesStr] = startTimeStr.split(':');
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    // Determine if it's PM based on the slot context or hour
    const isPM = hours < 7 || (hours >= 1 && hours <= 6) || (slot.includes('06:05') || slot.includes('07:40') || slot.includes('09:15') || slot.includes('10:50'));
    
    if (isPM && hours !== 12) {
      hours += 12;
    } else if (!isPM && hours === 12) {
      hours = 0;
    }

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (hours < currentHours) return true;
    if (hours === currentHours && minutes < currentMinutes) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-lime-400 selection:text-black">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
      
      <main>
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <Pricing 
          onOpenBooking={() => setIsBookingOpen(true)} 
          daySlots={daySlots}
          nightSlots={nightSlots}
        />
        <Facilities />
        <Gallery />
        <Testimonials />
        <FAQ />
      </main>

      <Footer onOpenBooking={() => setIsBookingOpen(true)} />

      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        daySlots={daySlots}
        nightSlots={nightSlots}
        existingBookings={existingBookings}
        isSlotPast={isSlotPast}
        onBookingSubmit={(data) => bookingMutation.mutate(data)}
        isSubmitting={bookingMutation.isPending}
      />

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/8801402973626" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:-rotate-12 transition-all group"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none">
          Chat with us!
        </span>
      </a>
    </div>
  );
}
