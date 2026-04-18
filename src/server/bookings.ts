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

// Fallback type for D1
interface D1Database {
  prepare: (query: string) => any;
}

// Helper to get DB from context
function getDB() {
  const event = getEvent()
  const env = (event.context.cloudflare?.env || {}) as any
  return env.DB as D1Database
}

// Fetch bookings for a specific date
export const getBookingsByDate = createServerFn({ method: 'GET' })
  .validator((date: string) => date)
  .handler(async ({ data: date }) => {
    const db = getDB()

    if (!db) {
      console.warn("DB binding not found. Returning empty results.");
      return [];
    }

    const { results } = await (db
      .prepare('SELECT * FROM bookings WHERE date = ? AND status != "cancelled"')
      .bind(date) as any).all<Booking>()

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
    const db = getDB()

    if (!db) {
      console.warn("DB binding not found.");
      return { success: false };
    }

    await (db
      .prepare(
        'INSERT INTO bookings (name, phone, date, startTime, duration) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(data.name, data.phone, data.date, data.startTime, data.duration) as any).run()

    return { success: true }
  })

// Fetch all bookings (for Admin)
export const getAllBookings = createServerFn({ method: 'GET' })
  .handler(async () => {
    const db = getDB()

    if (!db) {
      console.warn("DB binding not found.");
      return [];
    }

    const { results } = await (db
      .prepare('SELECT * FROM bookings ORDER BY created_at DESC') as any).all<Booking>()

    return results || []
  })

// Update booking status
export const updateBookingStatus = createServerFn({ method: 'POST' })
  .validator((data: { id: number; status: string }) => data)
  .handler(async ({ data }) => {
    const db = getDB()

    if (!db) {
      console.warn("DB binding not found.");
      return { success: false };
    }

    await (db
      .prepare('UPDATE bookings SET status = ? WHERE id = ?')
      .bind(data.status, data.id) as any).run()

    return { success: true }
  })

// Delete a booking
export const deleteBooking = createServerFn({ method: 'POST' })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    const db = getDB()

    if (!db) {
      console.warn("DB binding not found.");
      return { success: false };
    }

    await (db
      .prepare('DELETE FROM bookings WHERE id = ?')
      .bind(id) as any).run()

    return { success: true }
  })
