import { supabaseGet } from "@/lib/supabase/server";

export type QuoteAttachment = {
  bucket?: string;
  path?: string;
  original_name?: string | null;
  mime?: string | null;
  size?: number | null;
};

export type QuoteRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  details: string;
  attachments: QuoteAttachment[] | null;
  status: string;
};

export type BookingRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  details: string | null;
  status: string;
  calendar_event: { id?: string; htmlLink?: string } | null;
  error: string | null;
};

export type ContactRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  preferred_contact: string | null;
  message: string;
  status: string;
};

export const QUOTE_STATUSES = ["new", "contacted", "closed", "spam"] as const;
export const BOOKING_STATUSES = [
  "new",
  "booked",
  "pending",
  "contacted",
  "closed",
  "canceled",
  "spam",
] as const;
export const CONTACT_STATUSES = ["new", "contacted", "closed", "spam"] as const;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function getRecentQuotes(limit = 50): Promise<QuoteRequestRow[]> {
  try {
    const rows = await supabaseGet(
      "quote_requests",
      `?select=id,created_at,name,email,phone,details,attachments,status&order=created_at.desc&limit=${limit}`
    );
    return asArray<QuoteRequestRow>(rows);
  } catch {
    return [];
  }
}

export async function getRecentBookings(limit = 50): Promise<BookingRequestRow[]> {
  try {
    const rows = await supabaseGet(
      "booking_requests",
      `?select=id,created_at,name,email,phone,date,time,details,status,calendar_event,error&order=created_at.desc&limit=${limit}`
    );
    return asArray<BookingRequestRow>(rows);
  } catch {
    return [];
  }
}

export async function getRecentContacts(limit = 50): Promise<ContactRequestRow[]> {
  try {
    const rows = await supabaseGet(
      "contact_requests",
      `?select=id,created_at,name,email,phone,preferred_contact,message,status&order=created_at.desc&limit=${limit}`
    );
    return asArray<ContactRequestRow>(rows);
  } catch {
    return [];
  }
}
