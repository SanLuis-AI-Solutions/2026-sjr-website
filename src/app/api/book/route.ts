import { NextResponse } from "next/server";
import { createBookingEvent } from "@/lib/google-calendar";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());

  const event = await createBookingEvent({
    name: String(payload.name || ""),
    email: String(payload.email || ""),
    phone: payload.phone ? String(payload.phone) : undefined,
    date: String(payload.date || ""),
    time: String(payload.time || ""),
    details: payload.details ? String(payload.details) : undefined,
  });

  return NextResponse.json({ ok: true, event });
}
