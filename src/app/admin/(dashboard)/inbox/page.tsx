import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import {
  BOOKING_STATUSES,
  CONTACT_STATUSES,
  QUOTE_STATUSES,
  type BookingRequestRow,
  type ContactRequestRow,
  type QuoteAttachment,
  type QuoteRequestRow,
  getRecentBookings,
  getRecentContacts,
  getRecentQuotes,
} from "@/lib/admin/inbox-queries";
import {
  supabaseCreateSignedObjectUrl,
  supabaseUpdateById,
} from "@/lib/supabase/admin";
import {
  resolveStoredServicesFinderLeadContext,
  type StoredServicesFinderLeadContext,
} from "@/lib/service-lead-context";

export const dynamic = "force-dynamic";

type InboxPageProps = {
  searchParams?: Promise<{ tab?: string; status?: string; q?: string }>;
};

type InboxTab = "quotes" | "bookings" | "contacts";

const TAB_OPTIONS: InboxTab[] = ["quotes", "bookings", "contacts"];

function clampText(value: string, max = 180) {
  const trimmed = (value || "").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}...`;
}

function normalizeTab(value: string | undefined): InboxTab {
  return TAB_OPTIONS.includes(value as InboxTab) ? (value as InboxTab) : "quotes";
}

function normalizeStatus<T extends readonly string[]>(
  candidate: string | undefined,
  allowed: T
) {
  return candidate && allowed.includes(candidate) ? candidate : "all";
}

function buildInboxHref(tab: InboxTab, status: string, query: string) {
  const params = new URLSearchParams();
  params.set("tab", tab);
  if (status !== "all") params.set("status", status);
  if (query.trim()) params.set("q", query.trim());
  return `/admin/inbox?${params.toString()}`;
}

function matchesQuery(parts: Array<string | null | undefined>, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return parts.some((part) => (part || "").toLowerCase().includes(normalized));
}

function FinderLeadContextStrip({
  context,
}: {
  context: StoredServicesFinderLeadContext;
}) {
  if (!context.isServicesFinderLead) return null;

  return (
    <div className="mb-3 rounded-[1.1rem] border border-brand-gold/35 bg-[#f6efe3] px-3 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex min-h-8 items-center justify-center rounded-full bg-brand-burgundy px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          {context.sourceLabel}
        </span>
        {context.serviceName ? (
          <span className="text-xs font-medium text-stone-700">
            Suggested service:{" "}
            <span className="font-semibold text-stone-900">{context.serviceName}</span>
          </span>
        ) : null}
      </div>
      {(context.intentLabel || context.query) ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {context.intentLabel ? (
            <span className="inline-flex min-h-8 items-center rounded-full border border-stone-200 bg-white px-3 text-[11px] font-medium text-stone-700">
              Intent: {context.intentLabel}
            </span>
          ) : null}
          {context.query ? (
            <span className="inline-flex min-h-8 items-center rounded-full border border-stone-200 bg-white px-3 text-[11px] font-medium text-stone-700">
              Search phrase: {context.query}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

async function signAttachment(att: QuoteAttachment) {
  const bucket = att.bucket || process.env.SUPABASE_QUOTES_BUCKET || "quote-uploads";
  const path = att.path;
  if (!path) return null;
  try {
    return await supabaseCreateSignedObjectUrl({
      bucket,
      objectPath: path,
      expiresInSeconds: 60 * 30,
    });
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

function getTabSummary(
  quotes: QuoteRequestRow[],
  bookings: BookingRequestRow[],
  contacts: ContactRequestRow[]
) {
  return {
    quotes: {
      label: "Quotes",
      total: quotes.length,
      newCount: quotes.filter((item) => item.status === "new").length,
      spamCount: quotes.filter((item) => item.status === "spam").length,
    },
    bookings: {
      label: "Bookings",
      total: bookings.length,
      newCount: bookings.filter((item) => item.status === "new").length,
      spamCount: bookings.filter((item) => item.status === "spam").length,
    },
    contacts: {
      label: "Contacts",
      total: contacts.length,
      newCount: contacts.filter((item) => item.status === "new").length,
      spamCount: contacts.filter((item) => item.status === "spam").length,
    },
  };
}

type StatusFilterProps = {
  currentTab: InboxTab;
  currentStatus: string;
  query: string;
};

function StatusFilters({ currentTab, currentStatus, query }: StatusFilterProps) {
  const statuses =
    currentTab === "quotes"
      ? QUOTE_STATUSES
      : currentTab === "bookings"
        ? BOOKING_STATUSES
        : CONTACT_STATUSES;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildInboxHref(currentTab, "all", query)}
        className={[
          "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
          currentStatus === "all"
            ? "border-brand-gold/55 bg-brand-burgundy text-white"
            : "border-stone-200 bg-white text-stone-600 hover:border-brand-gold hover:text-brand-burgundy",
        ].join(" ")}
      >
        All
      </Link>
      {statuses.map((status) => (
        <Link
          key={status}
          href={buildInboxHref(currentTab, status, query)}
          className={[
            "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
            currentStatus === status
              ? "border-brand-gold/55 bg-brand-burgundy text-white"
              : "border-stone-200 bg-white text-stone-600 hover:border-brand-gold hover:text-brand-burgundy",
          ].join(" ")}
        >
          {status}
        </Link>
      ))}
    </div>
  );
}

async function QuoteRows({ rows }: { rows: QuoteRequestRow[] }) {
  const signedById = await Promise.all(
    rows.map(async (quote) => {
      const attachments = Array.isArray(quote.attachments) ? quote.attachments : [];
      const signed = await Promise.all(attachments.slice(0, 4).map(signAttachment));
      return [quote.id, signed.filter(Boolean) as string[]] as const;
    })
  );

  const signedLookup = new Map(signedById);

  return (
    <div className="space-y-3">
      {rows.map((quote) => {
        const attachments = Array.isArray(quote.attachments) ? quote.attachments : [];
        const signed = signedLookup.get(quote.id) || [];
        const finderContext = resolveStoredServicesFinderLeadContext({
          source: quote.source,
          details: quote.details,
        });
        const requestDetails =
          finderContext.cleanCustomerNotes || "No additional customer notes.";

        return (
          <article
            key={quote.id}
            className="rounded-[1.4rem] border border-stone-200 bg-white px-4 py-4 shadow-[0_12px_28px_rgba(58,25,16,0.05)]"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div>
                  <p className="text-sm font-semibold text-stone-900">{quote.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    {new Date(quote.created_at).toLocaleString()}
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-stone-600">
                    <p className="break-all">{quote.email}</p>
                    {quote.phone ? <p>{quote.phone}</p> : null}
                  </div>
                </div>
                <div>
                  <FinderLeadContextStrip context={finderContext} />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
                    Request details
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {clampText(requestDetails, 260)}
                  </p>
                  {signed.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {signed.map((url, idx) => (
                        <a
                          key={`${quote.id}-attachment-${idx}`}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-stone-200 bg-[#faf7f2] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                        >
                          Photo {idx + 1}
                        </a>
                      ))}
                      {attachments.length > 4 ? (
                        <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-dashed border-stone-200 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                          +{attachments.length - 4} more
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <form action={updateQuoteStatus} className="flex w-full shrink-0 items-center gap-2 xl:w-[250px]">
                <input type="hidden" name="id" value={quote.id} />
                <select
                  name="status"
                  defaultValue={quote.status || "new"}
                  className="min-h-12 flex-1 rounded-full border border-stone-200 bg-[#faf7f2] px-4 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {QUOTE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  Save
                </button>
              </form>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function BookingRows({ rows }: { rows: BookingRequestRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((booking) => {
        const finderContext = resolveStoredServicesFinderLeadContext({
          source: booking.source,
          details: booking.details,
        });
        const bookingDetails =
          finderContext.cleanCustomerNotes || "No additional customer notes.";

        return (
          <article
            key={booking.id}
            className="rounded-[1.4rem] border border-stone-200 bg-white px-4 py-4 shadow-[0_12px_28px_rgba(58,25,16,0.05)]"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <p className="text-sm font-semibold text-stone-900">{booking.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    {new Date(booking.created_at).toLocaleString()}
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-stone-600">
                    <p className="break-all">{booking.email}</p>
                    {booking.phone ? <p>{booking.phone}</p> : null}
                  </div>
                </div>
                <div>
                  <FinderLeadContextStrip context={finderContext} />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
                    Schedule
                  </p>
                  <p className="mt-2 text-sm text-stone-700">
                    {booking.date} at {booking.time}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {clampText(bookingDetails, 240)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {booking.calendar_event?.htmlLink ? (
                      <a
                        href={booking.calendar_event.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 items-center justify-center rounded-full border border-stone-200 bg-[#faf7f2] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-brand-gold hover:text-brand-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                      >
                        Open event
                      </a>
                    ) : null}
                    {booking.error ? (
                      <span className="inline-flex min-h-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
                        {clampText(booking.error, 64)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <form action={updateBookingStatus} className="flex w-full shrink-0 items-center gap-2 xl:w-[250px]">
                <input type="hidden" name="id" value={booking.id} />
                <select
                  name="status"
                  defaultValue={booking.status || "new"}
                  className="min-h-12 flex-1 rounded-full border border-stone-200 bg-[#faf7f2] px-4 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {BOOKING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  Save
                </button>
              </form>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ContactRows({ rows }: { rows: ContactRequestRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((contact) => (
        <article
          key={contact.id}
          className="rounded-[1.4rem] border border-stone-200 bg-white px-4 py-4 shadow-[0_12px_28px_rgba(58,25,16,0.05)]"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div>
                <p className="text-sm font-semibold text-stone-900">{contact.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  {new Date(contact.created_at).toLocaleString()}
                </p>
                <div className="mt-3 space-y-1 text-sm text-stone-600">
                  <p className="break-all">{contact.email}</p>
                  {contact.phone ? <p>{contact.phone}</p> : null}
                  {contact.preferred_contact ? (
                    <p className="text-[11px] uppercase tracking-[0.18em] text-brand-burgundy">
                      Prefers {contact.preferred_contact}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-burgundy">
                  Message
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {clampText(contact.message, 280)}
                </p>
              </div>
            </div>

            <form action={updateContactStatus} className="flex w-full shrink-0 items-center gap-2 xl:w-[250px]">
              <input type="hidden" name="id" value={contact.id} />
              <select
                name="status"
                defaultValue={contact.status || "new"}
                className="min-h-12 flex-1 rounded-full border border-stone-200 bg-[#faf7f2] px-4 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {CONTACT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-burgundy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Save
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function InboxPage({ searchParams }: InboxPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q || "";
  const currentTab = normalizeTab(resolvedSearchParams?.tab);
  const currentStatus = normalizeStatus(
    resolvedSearchParams?.status,
    currentTab === "quotes"
      ? QUOTE_STATUSES
      : currentTab === "bookings"
        ? BOOKING_STATUSES
        : CONTACT_STATUSES
  );

  const [quotes, bookings, contacts] = await Promise.all([
    getRecentQuotes(),
    getRecentBookings(),
    getRecentContacts(),
  ]);

  const filteredQuotes = quotes.filter((quote) => {
    const statusMatch = currentTab !== "quotes" || currentStatus === "all" || quote.status === currentStatus;
    const finderContext = resolveStoredServicesFinderLeadContext({
      source: quote.source,
      details: quote.details,
    });
    return (
      statusMatch &&
      matchesQuery(
        [
          quote.name,
          quote.email,
          quote.phone,
          quote.details,
          quote.status,
          quote.source,
          finderContext.sourceLabel,
          finderContext.serviceName,
          finderContext.serviceSlug,
          finderContext.intentLabel,
          finderContext.query,
        ],
        query
      )
    );
  });

  const filteredBookings = bookings.filter((booking) => {
    const statusMatch =
      currentTab !== "bookings" || currentStatus === "all" || booking.status === currentStatus;
    const finderContext = resolveStoredServicesFinderLeadContext({
      source: booking.source,
      details: booking.details,
    });
    return (
      statusMatch &&
      matchesQuery(
        [
          booking.name,
          booking.email,
          booking.phone,
          booking.date,
          booking.time,
          booking.details,
          booking.status,
          booking.source,
          finderContext.sourceLabel,
          finderContext.serviceName,
          finderContext.serviceSlug,
          finderContext.intentLabel,
          finderContext.query,
        ],
        query
      )
    );
  });

  const filteredContacts = contacts.filter((contact) => {
    const statusMatch =
      currentTab !== "contacts" || currentStatus === "all" || contact.status === currentStatus;
    return (
      statusMatch &&
      matchesQuery(
        [
          contact.name,
          contact.email,
          contact.phone,
          contact.preferred_contact,
          contact.message,
          contact.status,
        ],
        query
      )
    );
  });

  const summary = getTabSummary(quotes, bookings, contacts);

  const currentSummary = summary[currentTab];

  return (
    <div className="lg:h-full lg:min-h-0">
      <AdminSectionCard
          title={
            currentTab === "quotes"
              ? "Quote requests"
              : currentTab === "bookings"
                ? "Booking requests"
                : "Contact messages"
          }
          eyebrow="Lead operations"
          description={
            currentTab === "quotes"
              ? "Photo attachments and status updates stay inline so quote review does not require extra screens."
              : currentTab === "bookings"
                ? "Booking requests retain their calendar links and error visibility while staying denser and easier to scan."
                : "Contact messages stay in the same triage model with status updates preserved."
          }
          action={
            <div className="space-y-3 sm:max-w-[360px]">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                <span>{currentSummary.total} total</span>
                <span>•</span>
                <span>{currentSummary.newCount} new</span>
                <span>•</span>
                <span>{currentSummary.spamCount} spam</span>
              </div>
              <StatusFilters currentTab={currentTab} currentStatus={currentStatus} query={query} />
            </div>
          }
          className="flex h-full min-h-0 flex-col"
          contentClassName="flex-1 min-h-0"
        >
          <div className="admin-scroll-panel h-full min-h-0 overflow-auto pr-1">
            {currentTab === "quotes" ? (
              filteredQuotes.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-stone-200 bg-[#faf7f2] px-5 py-10 text-center text-sm text-stone-500">
                  No quote requests matched this filter.
                </div>
              ) : (
                <QuoteRows rows={filteredQuotes} />
              )
            ) : null}

            {currentTab === "bookings" ? (
              filteredBookings.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-stone-200 bg-[#faf7f2] px-5 py-10 text-center text-sm text-stone-500">
                  No booking requests matched this filter.
                </div>
              ) : (
                <BookingRows rows={filteredBookings} />
              )
            ) : null}

            {currentTab === "contacts" ? (
              filteredContacts.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-stone-200 bg-[#faf7f2] px-5 py-10 text-center text-sm text-stone-500">
                  No contact messages matched this filter.
                </div>
              ) : (
                <ContactRows rows={filteredContacts} />
              )
            ) : null}
          </div>
      </AdminSectionCard>
    </div>
  );
}
