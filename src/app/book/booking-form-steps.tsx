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
  { value: 'ring_repair', label: 'Ring repair' },
  { value: 'watch_repair', label: 'Watch repair' },
  { value: 'ring_sizing', label: 'Ring sizing' },
  { value: 'necklace_chain_repair', label: 'Necklace / chain repair' },
  { value: 'other', label: 'Not sure yet' },
];

export function BookingFormSteps({ finderContext, hiddenFields }: BookingFormStepsProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [repairType, setRepairType] = useState('');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canProceed = name.trim().length > 0 && emailValid && repairType !== '';

  return (
    <form
      id="booking-form"
      action="/api/book"
      method="post"
      className="reveal-on-scroll scroll-mt-24 rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-[0_18px_45px_rgba(58,25,16,0.14)] backdrop-blur-sm md:p-6"
    >
      {/* Progress indicator */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300 ${step >= 1 ? 'bg-brand-burgundy text-white' : 'bg-stone-200 text-stone-500'}`}
          >
            {step > 1 ? '✓' : '1'}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Your info
          </span>
        </div>
        <div className="h-px flex-1 bg-stone-200" />
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300 ${step >= 2 ? 'bg-brand-burgundy text-white' : 'bg-stone-200 text-stone-500'}`}
          >
            2
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Pick a time
          </span>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-brand-gold/35 bg-brand-gold/10 px-4 py-3 text-sm text-stone-700">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-burgundy">
          No payment required
        </p>
        <p className="mt-2 leading-6">
          Pick the time you prefer. We confirm by email or send the closest available option.
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
                  className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 hover:border-brand-gold/50 has-[:checked]:border-brand-gold/70 has-[:checked]:bg-brand-gold/5"
                >
                  <input
                    type="radio"
                    name="repair_type_s1"
                    value={value}
                    checked={repairType === value}
                    onChange={() => setRepairType(value)}
                    className="h-4 w-4 flex-none border-stone-300 text-brand-burgundy focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 block text-sm font-medium text-stone-700">
            Your name <span className="text-brand-burgundy">*</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              placeholder="Your name"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-stone-700">
            Your email <span className="text-brand-burgundy">*</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              placeholder="you@email.com"
            />
          </label>

          <button
            type="button"
            onClick={() => { if (canProceed) setStep(2); }}
            disabled={!canProceed}
            className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-sm font-semibold text-white hover:bg-brand-burgundy-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to pick a time →
          </button>
          <p className="mt-3 text-center text-[11px] text-stone-500">
            Step 1 of 2 — no payment to book
          </p>
        </>
      ) : (
        <>
          {/* Carry step 1 values as hidden fields for form submission */}
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="repair_type" value={repairType} />

          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 hover:text-brand-burgundy"
          >
            ← Back
          </button>

          <div className="mb-5 rounded-xl border border-brand-gold/30 bg-brand-gold/8 px-4 py-3 text-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-burgundy">
              Repair summary
            </p>
            <p className="mt-1 text-stone-700">
              <span className="font-semibold">{name}</span>
              {' · '}
              {REPAIR_TYPES.find((r) => r.value === repairType)?.label}
            </p>
          </div>

          <BookingDateTimeFields />

          <label className="mt-4 block text-sm font-medium text-stone-700">
            Phone — optional
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              placeholder="(281) 555-1234"
            />
          </label>

          <label className="mt-5 block text-sm font-medium text-stone-700">
            Details — optional
            <textarea
              name="details"
              className="mt-2 min-h-[100px] w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 md:min-h-[120px]"
              defaultValue={finderContext?.detailsSeed ?? undefined}
              aria-describedby="booking-details-help"
              placeholder="Example: Ring sizing, watch battery, loose stone, or not sure yet."
            />
          </label>
          <p id="booking-details-help" className="mt-2 text-xs leading-5 text-stone-600">
            A short note helps us prepare, but you can leave this blank if you only need an assessment.
          </p>

          <button
            type="submit"
            className="micro-interaction mt-6 w-full rounded-full bg-brand-burgundy px-6 py-4 text-sm font-semibold text-white hover:bg-brand-burgundy-deep disabled:cursor-not-allowed disabled:opacity-60"
            id="booking-submit"
          >
            <span id="booking-submit-text">Book My Repair</span>
          </button>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-2.5">
              <div className="text-brand-burgundy">4.5 ★</div>
              <div className="mt-0.5">Google</div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-2.5">
              <div className="text-brand-burgundy">90 Days</div>
              <div className="mt-0.5">Warranty</div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-2.5">
              <div className="text-brand-burgundy">No Pay</div>
              <div className="mt-0.5">To Book</div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-stone-500">
            We confirm by email within 1 business day.
          </p>
        </>
      )}
    </form>
  );
}
