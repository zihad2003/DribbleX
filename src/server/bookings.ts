import { createServerFn } from '@tanstack/react-start'
import { getEvent } from 'vinxi/http'

// Define the shape of a booking
export interface Booking {
  id: number;
  name: string;
  phone: string;
  date: string;
  startTime: string;
  duration: number;
  status: string;
  created_at: string;
}

// Fallback type for D1 in case global types haven't synced
interface D1Database {
  prepare: (query: string) => any;
}

// Fetch bookings for a specific date
export const getBookingsByDate = createServerFn({ method: 'GET' })
  .validator((date: string) => date)
  .handler(async ({ data: date }) => {
    const event = getEvent()
    const env = (event.context.cloudflare?.env || {}) as any
    const db = env.DB as D1Database

    if (!db) {
      console.warn("DB binding not found. Returning empty results.");
      return [];
    }

    const { results } = await db
      .prepare('SELECT * FROM bookings WHERE date = ? AND status != "cancelled"')
      .bind(date)
      .all<Booking>()

    return results || []
  })

// Create a new booking
export const createBooking = createServerFn({ method: 'POST' })
  .validator((data: {
    name: string;
    phone: string;
    date: string;
    startTime: string;
    duration: number;
  }) => data)
  .handler(async ({ data }) => {
    const event = getEvent()
    const env = (event.context.cloudflare?.env || {}) as any
    const db = env.DB as D1Database

    if (!db) {
      console.warn("DB binding not found.");
      return { success: false };
    }

    await db
      .prepare(
        'INSERT INTO bookings (name, phone, date, startTime, duration) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(data.name, data.phone, data.date, data.startTime, data.duration)
      .run()

    return { success: true }
  })

// Fetch all bookings (for Admin)
export const getAllBookings = createServerFn({ method: 'GET' })
  .handler(async () => {
    const event = getEvent()
    const env = (event.context.cloudflare?.env || {}) as any
    const db = env.DB as D1Database

    if (!db) {
      console.warn("DB binding not found.");
      return [];
    }

    const { results } = await db
      .prepare('SELECT * FROM bookings ORDER BY created_at DESC')
      .all<Booking>()

    return results || []
  })

// Update booking status
export const updateBookingStatus = createServerFn({ method: 'POST' })
  .validator((data: { id: number; status: string }) => data)
  .handler(async ({ data }) => {
    const event = getEvent()
    const env = (event.context.cloudflare?.env || {}) as any
    const db = env.DB as D1Database

    if (!db) {
      console.warn("DB binding not found.");
      return { success: false };
    }

    await db
      .prepare('UPDATE bookings SET status = ? WHERE id = ?')
      .bind(data.status, data.id)
      .run()

    return { success: true }
  })
