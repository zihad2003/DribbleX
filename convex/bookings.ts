import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBookingsByDate = query({
  args: { date: v.string() },
  returns: v.array(v.object({
    _id: v.id("bookings"),
    _creationTime: v.number(),
    name: v.string(),
    phone: v.string(),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
  })),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

export const getAllBookings = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("bookings"),
    _creationTime: v.number(),
    name: v.string(),
    phone: v.string(),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

export const createBooking = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    date: v.string(),
    startTime: v.string(),
    duration: v.number(),
  },
  returns: v.id("bookings"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
    });
  },
});

export const updateBookingStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return null;
  },
});
