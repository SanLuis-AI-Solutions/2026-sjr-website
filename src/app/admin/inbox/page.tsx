import { SiteShell } from "@/components/site-shell";
import { supabaseGet } from "@/lib/supabase/server";
import { supabaseCreateSignedObjectUrl, supabaseUpdateById } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type QuoteAttachment = {
  bucket?: string;
  path?: string;
  original_name?: string | null;
  mime?: string | null;
  size?: number | null;
};

type QuoteRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  details: string;
  attachments: QuoteAttachment[] | null;
  status: string;
};

type BookingRequestRow = {
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

type ContactRequestRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  preferred_contact: string | null;
  message: string;
  status: string;
};

const QUOTE_STATUSES = ["new", "contacted", "closed", "spam"] as const;
const BOOKING_STATUSES = ["new", "booked", "pending", "contacted", "closed", "canceled", "spam"] as const;
const CONTACT_STATUSES = ["new", "contacted", "closed", "spam"] as const;

function clampText(value: string, max = 180) {
  const v = (value || "").trim();
  if (v.length <= max) return v;
  return `${v.slice(0, max)}...`;
}

async function getRecentQuotes(limit = 50): Promise<QuoteRequestRow[]> {
  const rows = (await supabaseGet(
    "quote_requests",
    `?select=id,created_at,name,email,phone,details,attachments,status&order=created_at.desc&limit=${limit}`
  )) as QuoteRequestRow[];
  return Array.isArray(rows) ? rows : [];
}

async function getRecentBookings(limit = 50): Promise<BookingRequestRow[]> {
  const rows = (await supabaseGet(
    "booking_requests",
    `?select=id,created_at,name,email,phone,date,time,details,status,calendar_event,error&order=created_at.desc&limit=${limit}`
  )) as BookingRequestRow[];
  return Array.isArray(rows) ? rows : [];
}

async function getRecentContacts(limit = 50): Promise<ContactRequestRow[]> {
  try {
    const rows = (await supabaseGet(
      "contact_requests",
      `?select=id,created_at,name,email,phone,preferred_contact,message,status&order=created_at.desc&limit=${limit}`
    )) as ContactRequestRow[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    // Keep inbox usable while contact table rollout completes.
    return [];
  }
}

async function signAttachment(att: QuoteAttachment) {
  const bucket = att.bucket || process.env.SUPABASE_QUOTES_BUCKET || "quote-uploads";
  const path = att.path;
  if (!path) return null;
  try {
    return await supabaseCreateSignedObjectUrl({ bucket, objectPath: path, expiresInSeconds: 60 * 30 });
  } catch {
    return null;
  }
}

async function updateQuoteStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id) return;
  if (!QUOTE_STATUSES.includes(status as (typeof QUOTE_STATUSES)[number])) return;
  await supabaseUpdateById("quote_requests", id, { status });
  revalidatePath("/admin/inbox");
}

async function updateBookingStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id) return;
  if (!BOOKING_STATUSES.includes(status as (typeof BOOKING_STATUSES)[number])) return;
  await supabaseUpdateById("booking_requests", id, { status });
  revalidatePath("/admin/inbox");
}

async function updateContactStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id) return;
  if (!CONTACT_STATUSES.includes(status as (typeof CONTACT_STATUSES)[number])) return;
  await supabaseUpdateById("contact_requests", id, { status });
  revalidatePath("/admin/inbox");
}

export default async function InboxPage() {
  const [quotes, bookings, contacts] = await Promise.all([
    getRecentQuotes(),
    getRecentBookings(),
    getRecentContacts(),
  ]);
  const quoteRows = await Promise.all(
    quotes.map(async (q) => {
      const attachments = Array.isArray(q.attachments) ? q.attachments : [];
      const signed = await Promise.all(attachments.slice(0, 4).map(signAttachment));

      return (
        <div key={q.id} className="grid grid-cols-12 gap-3 px-4 py-4 text-sm">
          <div className="col-span-3">
            <div className="font-medium text-stone-900">{q.name}</div>
            <div className="mt-1 text-xs text-stone-500">
              {new Date(q.created_at).toLocaleString()}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {signed
                .filter(Boolean)
                .map((url, idx) => (
                  <a
                    key={`${q.id}-att-${idx}`}
                    href={url as string}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-xs text-stone-700 hover:bg-stone-100"
                  >
                    photo {idx + 1}
                  </a>
                ))}
              {attachments.length > 4 ? (
                <span className="text-xs text-stone-500">
                  +{attachments.length - 4} more
                </span>
              ) : null}
            </div>
          </div>
          <div className="col-span-3 text-stone-700">
            <div className="break-all">{q.email}</div>
            {q.phone ? <div className="mt-1">{q.phone}</div> : null}
          </div>
          <div className="col-span-4 text-stone-700">
            {clampText(q.details, 240)}
          </div>
          <div className="col-span-2">
            <form action={updateQuoteStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={q.id} />
              <select
                name="status"
                defaultValue={q.status || "new"}
                className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-sm"
              >
                {QUOTE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-lg bg-brand-burgundy px-3 py-2 text-xs font-semibold text-white hover:bg-brand-burgundy-deep"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      );
    })
  );

  return (
    <SiteShell>
      <section className="bg-stone-100 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
                Admin
              </p>
              <h1 className="mt-2 font-serif text-3xl text-stone-900">
                Inbox
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                Recent Fast Quotes, Booking Requests, and Contact Messages (most recent first).
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-xs text-stone-700">
              Protected by Basic Auth via `ADMIN_USER` / `ADMIN_PASS`.
            </div>
          </div>

          <div className="mt-8 grid gap-8">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Fast Quotes
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white">
                <div className="grid grid-cols-12 gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs font-semibold text-stone-600">
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-3">Contact</div>
                  <div className="col-span-4">Details</div>
                  <div className="col-span-2">Status</div>
                </div>
                <div className="divide-y divide-stone-100">
                  {quotes.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-stone-600">
                      No quote requests found.
                    </div>
                  ) : (
                    quoteRows
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Booking Requests
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white">
                <div className="grid grid-cols-12 gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs font-semibold text-stone-600">
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-3">Schedule</div>
                  <div className="col-span-4">Details</div>
                  <div className="col-span-2">Status</div>
                </div>
                <div className="divide-y divide-stone-100">
                  {bookings.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-stone-600">
                      No booking requests found.
                    </div>
                  ) : (
                    bookings.map((b) => (
                      <div key={b.id} className="grid grid-cols-12 gap-3 px-4 py-4 text-sm">
                        <div className="col-span-3">
                          <div className="font-medium text-stone-900">{b.name}</div>
                          <div className="mt-1 text-xs text-stone-500">
                            {new Date(b.created_at).toLocaleString()}
                          </div>
                          <div className="mt-2 text-xs text-stone-600 break-all">{b.email}</div>
                          {b.phone ? <div className="mt-1 text-xs text-stone-600">{b.phone}</div> : null}
                        </div>
                        <div className="col-span-3 text-stone-700">
                          <div className="font-medium">{b.date} @ {b.time}</div>
                          {b.calendar_event?.htmlLink ? (
                            <a
                              href={b.calendar_event.htmlLink}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-block rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-xs text-stone-700 hover:bg-stone-100"
                            >
                              open event
                            </a>
                          ) : null}
                          {b.error ? (
                            <div className="mt-2 text-xs text-rose-700">
                              {clampText(b.error, 140)}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-span-4 text-stone-700">
                          {b.details ? clampText(b.details, 240) : <span className="text-stone-500">No details</span>}
                        </div>
                        <div className="col-span-2">
                          <form action={updateBookingStatus} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={b.id} />
                            <select
                              name="status"
                              defaultValue={b.status || "new"}
                              className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-sm"
                            >
                              {BOOKING_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="rounded-lg bg-brand-burgundy px-3 py-2 text-xs font-semibold text-white hover:bg-brand-burgundy-deep"
                            >
                              Save
                            </button>
                          </form>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                Contact Messages
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white">
                <div className="grid grid-cols-12 gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs font-semibold text-stone-600">
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-3">Contact</div>
                  <div className="col-span-4">Message</div>
                  <div className="col-span-2">Status</div>
                </div>
                <div className="divide-y divide-stone-100">
                  {contacts.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-stone-600">
                      No contact messages found.
                    </div>
                  ) : (
                    contacts.map((c) => (
                      <div key={c.id} className="grid grid-cols-12 gap-3 px-4 py-4 text-sm">
                        <div className="col-span-3">
                          <div className="font-medium text-stone-900">{c.name}</div>
                          <div className="mt-1 text-xs text-stone-500">
                            {new Date(c.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="col-span-3 text-stone-700">
                          <div className="break-all">{c.email}</div>
                          {c.phone ? <div className="mt-1">{c.phone}</div> : null}
                          {c.preferred_contact ? (
                            <div className="mt-1 text-xs uppercase tracking-[0.12em] text-stone-500">
                              Prefers {c.preferred_contact}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-span-4 text-stone-700">
                          {clampText(c.message, 260)}
                        </div>
                        <div className="col-span-2">
                          <form action={updateContactStatus} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={c.id} />
                            <select
                              name="status"
                              defaultValue={c.status || "new"}
                              className="w-full rounded-lg border border-stone-200 bg-white px-2 py-2 text-sm"
                            >
                              {CONTACT_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="rounded-lg bg-brand-burgundy px-3 py-2 text-xs font-semibold text-white hover:bg-brand-burgundy-deep"
                            >
                              Save
                            </button>
                          </form>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
