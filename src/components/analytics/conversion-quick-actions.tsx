"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "./ga-tracker";
import {
  getCtaVariantStorageKey,
  readCurrentCtaVariant,
  resolveCtaVariant,
  type CtaVariant,
} from "./cta-variant";

/*
 * Date: 2026-02-27
 * Time: 17:20:37 -06:00 (CST)
 * Context/Notes: Increased quick-action tap target minimum size to avoid sub-pixel CI failures on mobile smoke checks.
 * Agent Name: Codex
 */

type QuickAction = {
  href: string;
  label: string;
  tone?: "default" | "muted";
};

type ConversionQuickActionsProps = {
  page: "quote" | "book" | "contact";
  primary: QuickAction;
  secondary: QuickAction[];
  tone?: "light" | "dark";
  className?: string;
};

function pickVariant(): CtaVariant {
  return Math.random() < 0.5 ? "control" : "primary_focus";
}

export function ConversionQuickActions({
  page,
  primary,
  secondary,
  tone = "light",
  className,
}: ConversionQuickActionsProps) {
  const pathname = usePathname();
  const variant = useMemo<CtaVariant>(() => {
    if (typeof window === "undefined") return "control";
    const existing = resolveCtaVariant(window.sessionStorage.getItem(getCtaVariantStorageKey()));
    if (existing) return existing;

    const selected = pickVariant();
    window.sessionStorage.setItem(getCtaVariantStorageKey(), selected);
    return selected;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.sjrCtaVariant = variant;
  }, [variant]);

  const containerClass = useMemo(
    () => className ?? "mt-6 flex flex-wrap gap-3",
    [className]
  );

  const baseFocus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";

  const primaryClass = (() => {
    if (tone === "dark") {
      return variant === "primary_focus"
        ? `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy shadow-lg hover:bg-stone-100 ${baseFocus} focus-visible:ring-offset-brand-burgundy-deep`
        : `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-stone-100 ${baseFocus} focus-visible:ring-offset-brand-burgundy-deep`;
    }

    return variant === "primary_focus"
      ? `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg hover:bg-brand-burgundy-deep ${baseFocus}`
      : `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full bg-brand-burgundy px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-brand-burgundy-deep ${baseFocus}`;
  })();

  const secondaryClass = (secondaryTone: "default" | "muted" = "default") => {
    if (tone === "dark") {
      if (variant === "primary_focus") {
        return secondaryTone === "default"
          ? `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-brand-gold/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold hover:bg-brand-gold/10 ${baseFocus} focus-visible:ring-offset-brand-burgundy-deep`
          : `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-white/10 ${baseFocus} focus-visible:ring-offset-brand-burgundy-deep`;
      }

      return secondaryTone === "default"
        ? `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold hover:bg-brand-gold/10 ${baseFocus} focus-visible:ring-offset-brand-burgundy-deep`
        : `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-white/10 ${baseFocus} focus-visible:ring-offset-brand-burgundy-deep`;
    }

    if (variant === "primary_focus") {
      return secondaryTone === "default"
        ? `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-600 hover:bg-stone-100 ${baseFocus}`
        : `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-600 hover:bg-stone-100 ${baseFocus}`;
    }

    return secondaryTone === "default"
      ? `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-burgundy hover:bg-brand-gold/10 ${baseFocus}`
      : `micro-interaction inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-700 hover:bg-stone-100 ${baseFocus}`;
  };

  const onTrack = (target: string) => {
    const activeVariant = readCurrentCtaVariant() || variant;
    const params = {
      page_path: pathname || "/",
      page_id: page,
      cta_target: target,
      cta_variant: activeVariant,
    };
    trackGaEvent("conversion_quick_action_click", params);
    trackGaEvent(`conversion_quick_action_click_${activeVariant}`, params);
  };

  return (
    <div className={containerClass} role="region" aria-label="Quick actions">
      <Link
        href={primary.href}
        onClickCapture={() => onTrack(primary.href)}
        className={primaryClass}
      >
        {primary.label}
      </Link>
      {secondary.map((action) => (
        <Link
          key={`${action.href}-${action.label}`}
          href={action.href}
          onClickCapture={() => onTrack(action.href)}
          className={secondaryClass(action.tone)}
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}
