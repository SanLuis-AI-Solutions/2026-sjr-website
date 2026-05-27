'use client';

import { useState } from 'react';
import { BookingDateTimeFields } from '@/components/booking-date-time-fields';
import { LeadAttributionFields } from '@/components/analytics/lead-attribution-fields';

type HiddenFields = {
  lead_source_context: string;
  area_slug: string;
  service_slug: string;
  intent_label: string;
  intent_query: string;
};

type FinderContext = {
  serviceName?: string | null;
  serviceSlug?: string | null;
  areaLabel?: string | null;
  intentLabel?: string | null;
  query?: string | null;
  detailsSeed?: string | null;
};

type BookingFormStepsProps = {
  finderContext: FinderContext | null;
  hiddenFields: HiddenFields | null;
};

const REPAIR_TYPES = [
  { value: 'ring_repair', label: 'Ring repair', hint: 'e.g. broken prong, loose stone, rhodium plating' },
  { value: 'watch_repair', label: 'Watch repair', hint: 'e.g. battery, crystal replacement, band repair' },
  { value: 'ring_sizing', label: 'Ring sizing', hint: 'e.g. size up or down, comfort fit adjustment' },
  { value: 'necklace_chain_repair', label: 'Necklace / chain repair', hint: 'e.g. broken clasp, soldered link, restringing' },
  { value: 'other', label: 'Not sure yet', hint: 'Describe what you\'d like us to look at' },
];

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const INPUT_BASE =
  'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-stone-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2';
const INPUT_VALID = 'border-stone-200';
const INPUT_ERROR = 'border-rose-400 bg-rose-50/60';

export function BookingFormSteps({ finderContext, hiddenFields }: BookingFormStepsProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [repairType, setRepairType] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });

  const nameValid = name.trim().length > 0;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = phone.trim().length === 0 || phone.replace(/\D/g, '').length >= 10;
  const canProceed = nameValid && emailValid && phoneValid && repairType !== '';

  const touch = (field: keyof typeof touched) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const selectedRepair = REPAIR_TYPES.find((r) => r.value === repairType);

  function handleContinue() {
    setTouched({ name: true, email: true, phone: true });
    if (canProceed) setStep(2);
  }

  return (
    <form
      id="booking-form"
      action="/api/book"
      method="post"
      className="reveal-on-scroll scroll-mt-24 rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,25,16,0.14)] backdrop-blur-sm [border-top:3px_solid_rgba(209,184,130,0.50)] md:p-6"
    >
      {/* Progress indicator */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300 ${
              step >= 1 ? 'bg-brand-burgundy text-white' : 'bg-stone-200 text-stone-500'
            }`}
          >
            {step > 1 ? '✓' : '1'}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Your info
          </span>
        </div>
        <div className="relative h-px flex-1 bg-stone-200 overflow-hidden rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-brand-burgundy transition-all duration-500"
            style={{ width: step > 1 ? '100%' : '0%' }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300 ${
              step >= 2 ? 'bg-brand-burgundy text-white' : 'bg-stone-200 text-stone-500'
            }`}
          >
            2
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Pick a time
          </span>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-brand-gold/35 bg-brand-gold/10 px-4 py-3 text-sm text-stone-700">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-burgundy">
          No payment required
        </p>
        <p className="mt-1.5 leading-6">
          We confirm by email, or by text if you add a phone number — usually within a few hours.
        </p>
      </div>

      {/* Honeypot + attribution — always in DOM */}
      <input
        type="text"
        name="company"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <LeadAttributionFields />
      {hiddenFields ? (
        <>
          <input type="hidden" name="lead_source_context" value={hiddenFields.lead_source_context} />
          <input type="hidden" name="area_slug" value={hiddenFields.area_slug} />
          <input type="hidden" name="service_slug" value={hiddenFields.service_slug} />
          <input type="hidden" name="intent_label" value={hiddenFields.intent_label} />
          <input type="hidden" name="intent_query" value={hiddenFields.intent_query} />
        </>
      ) : null}

      <div key={step} className="animate-fade-up">
      {/* ── STEP 1 ── */}
      {step === 1 ? (
        <>
          <fieldset className="border-t border-stone-200 pt-5">
            <legend className="text-sm font-semibold text-stone-700">
              What repair do you need? <span className="text-brand-burgundy">*</span>
            </legend>
            <div className="mt-3 flex flex-col gap-2">
              {REPAIR_TYPES.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 transition-colors hover:border-brand-gold/50 has-[:checked]:border-brand-gold/70 has-[:checked]:bg-brand-gold/5"
                >
                  <input
                    type="radio"
                    name="repair_type_s1"
                    value={value}
                    checked={repairType === value}
                    onChange={() => setRepairType(value)}
                    className="h-4 w-4 flex-none accent-[#7a2e3a]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Name */}
          <div className="mt-5">
            <label htmlFor="field-name" className="block text-sm font-medium text-stone-700">
              Your name <span className="text-brand-burgundy">*</span>
            </label>
            <input
              id="field-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => touch('name')}
              autoComplete="name"
              className={`${INPUT_BASE} ${touched.name && !nameValid ? INPUT_ERROR : INPUT_VALID}`}
              placeholder="First and last name"
            />
            {touched.name && !nameValid ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">Please enter your name.</p>
            ) : null}
          </div>

          {/* Phone */}
          <div className="mt-4">
            <label htmlFor="field-phone" className="block text-sm font-medium text-stone-700">
              Phone number <span className="text-stone-500">(optional)</span>
            </label>
            <input
              id="field-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              onBlur={() => touch('phone')}
              autoComplete="tel"
              inputMode="tel"
              className={`${INPUT_BASE} ${touched.phone && !phoneValid ? INPUT_ERROR : INPUT_VALID}`}
              placeholder="(281) 555-1234"
            />
            {touched.phone && !phoneValid ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">Please enter a valid 10-digit phone number.</p>
            ) : null}
            {!touched.phone || phoneValid ? (
              <p className="mt-1 text-xs text-stone-500">Add a phone number if you want same-day text updates.</p>
            ) : null}
          </div>

          {/* Email */}
          <div className="mt-4">
            <label htmlFor="field-email" className="block text-sm font-medium text-stone-700">
              Email address <span className="text-brand-burgundy">*</span>
            </label>
            <input
              id="field-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => touch('email')}
              autoComplete="email"
              className={`${INPUT_BASE} ${touched.email && !emailValid ? INPUT_ERROR : INPUT_VALID}`}
              placeholder="you@email.com"
            />
            {touched.email && !emailValid ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">Please enter a valid email address.</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-sm font-semibold text-white hover:bg-brand-burgundy-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {canProceed ? 'Continue — pick a time →' : 'Continue →'}
          </button>

          {!canProceed && (touched.name || touched.email || touched.phone) ? (
            <p className="mt-2 text-center text-xs text-stone-500">
              {[
                !repairType && 'repair type',
                touched.name && !nameValid && 'name',
                touched.phone && !phoneValid && 'valid phone',
                touched.email && !emailValid && 'email',
              ]
                .filter(Boolean)
                .join(', ')
                .replace(/,([^,]*)$/, ' and$1')
                .replace(/^./, (c) => c.toUpperCase()) + ' required'}
            </p>
          ) : (
            <p className="mt-3 text-center text-[11px] text-stone-500">
              No payment to book · Step 1 of 2
            </p>
          )}
        </>
      ) : (
        /* ── STEP 2 ── */
        <>
          {/* Carry step 1 values as hidden fields */}
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="repair_type" value={repairType} />

          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-brand-burgundy"
          >
            ← Back
          </button>

          {/* Booking summary */}
          <div className="mb-5 rounded-xl border border-brand-gold/30 bg-[rgba(209,184,130,0.08)] px-4 py-3 text-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-burgundy">
              Booking for
            </p>
            <div className="mt-2 space-y-0.5">
              <p className="font-semibold text-stone-900">{name}</p>
              <p className="text-stone-600">{phone}</p>
              <p className="text-stone-500 text-xs">{selectedRepair?.label ?? repairType}</p>
            </div>
          </div>

          <BookingDateTimeFields />

          {/* Details — hints adapt to repair type */}
          <div className="mt-5">
            <label htmlFor="field-details" className="block text-sm font-medium text-stone-700">
              Details — optional
            </label>
            <textarea
              id="field-details"
              name="details"
              className={`${INPUT_BASE} min-h-[96px] md:min-h-[112px]`}
              defaultValue={finderContext?.detailsSeed ?? undefined}
              aria-describedby="booking-details-help"
              placeholder={selectedRepair?.hint ?? 'Describe your repair or leave blank for an in-person assessment.'}
            />
            <p id="booking-details-help" className="mt-1.5 text-xs leading-5 text-stone-500">
              Optional — but a quick note helps us prepare your bench time.
            </p>
          </div>

          <button
            type="submit"
            className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-sm font-semibold text-white hover:bg-brand-burgundy-deep disabled:cursor-not-allowed disabled:opacity-60"
            id="booking-submit"
          >
            <span id="booking-submit-text">Confirm My Repair Visit</span>
          </button>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-2.5">
              <div className="text-brand-gold">4.5 ★</div>
              <div className="mt-0.5">Google</div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-2.5">
              <div className="text-brand-gold">90 Days</div>
              <div className="mt-0.5">Warranty</div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-2.5">
              <div className="text-brand-gold">No Pay</div>
              <div className="mt-0.5">To Book</div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-stone-500">
            We confirm by email, or by text if you added a phone number.
          </p>
        </>
      )}
      </div>
    </form>
  );
}
