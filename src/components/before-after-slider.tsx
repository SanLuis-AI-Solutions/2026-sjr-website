"use client";

import { useState } from "react";

const BEFORE_IMAGE =
  "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/before-after/before-ring.jpg";
const AFTER_IMAGE =
  "https://lrzrltjlfvvrdvxqqklm.supabase.co/storage/v1/object/public/site-assets/before-after/after-ring.png";
const IMAGE_SCALE = "50% auto";

export function BeforeAfterSlider() {
  const [value, setValue] = useState(50);

  return (
    <section className="bg-stone-100 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between reveal-on-scroll">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-burgundy">
              Repair impact
            </p>
            <h2 className="mt-3 font-serif text-3xl text-stone-900 md:text-4xl">
              Before & after craftsmanship.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-stone-600">
              Slide to reveal how we restore brilliance, structure, and finish.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="reveal-on-scroll relative h-[360px] overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg md:h-[440px]">
            <div
              className="absolute inset-0 bg-center"
              style={{
                backgroundImage: `url('${BEFORE_IMAGE}')`,
                backgroundSize: IMAGE_SCALE,
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-center"
              style={{
                backgroundImage: `url('${AFTER_IMAGE}')`,
                backgroundSize: IMAGE_SCALE,
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                clipPath: `inset(0 ${100 - value}% 0 0)`,
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-y-0"
              style={{ left: `${value}%` }}
            >
              <div className="h-full w-0.5 bg-white/80 shadow" />
              <div className="-ml-3 mt-4 flex h-6 w-6 items-center justify-center rounded-full border border-stone-200 bg-white shadow">
                <span className="text-[10px] text-stone-500">⇆</span>
              </div>
            </div>
            <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-stone-600">
              Before
            </div>
            <div className="absolute right-4 top-4 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-stone-600">
              After
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 reveal-on-scroll">
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400">
              Restore
            </span>
            <input
              aria-label="Before and after slider"
              type="range"
              min="10"
              max="90"
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              className="w-full"
            />
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400">
              Renew
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
