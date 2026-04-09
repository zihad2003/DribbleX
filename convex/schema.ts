import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bookings: defineTable({
    name: v.string(),
    phone: v.string(),
    date: v.string(), // YYYY-MM-DD
    startTime: v.string(), // HH:mm
    duration: v.number(), // in hours
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
  }).index("by_date", ["date"]),
});
