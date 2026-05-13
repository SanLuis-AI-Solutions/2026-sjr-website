"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getBookingHoursWindow,
  getBookingTimeSlots,
} from "@/lib/booking-schedule";

/*
 * Date: 2026-02-26
 * Time: 18:14:40 -06:00 (CST)
 * Context/Notes: Replaced native date input with a branded styled calendar for consistent cross-browser readability.
 * Agent Name: Codex
 */

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getTodayYmdLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toYmdLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromYmdLocal(ymd: string) {
  const [year, month, day] = ymd.split("-").map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function monthIndex(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function formatHumanDate(ymd: string) {
  const date = fromYmdLocal(ymd);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCalendarCells(monthDate: Date, todayYmd: string) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, index - startOffset + 1);
    const ymd = toYmdLocal(date);
    const inCurrentMonth = date.getMonth() === month;
    const inPast = ymd < todayYmd;

    if (!inCurrentMonth) {
      return {
        day: date.getDate(),
        ymd,
        inCurrentMonth,
        disabled: true,
        reason: "outside_month",
      };
    }

    const hours = getBookingHoursWindow(ymd);
    const disabled = inPast || hours.closed;

    return {
      day: date.getDate(),
      ymd,
      inCurrentMonth,
      disabled,
      reason: inPast ? "past" : hours.reason,
    };
  });
}

export function BookingDateTimeFields() {
  const todayYmd = useMemo(() => getTodayYmdLocal(), []);
  const todayDate = useMemo(() => fromYmdLocal(todayYmd), [todayYmd]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(todayDate);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const hours = useMemo(() => getBookingHoursWindow(date), [date]);
  const timeSlots = useMemo(() => getBookingTimeSlots(date), [date]);
  const calendarCells = useMemo(
    () => getCalendarCells(calendarMonth, todayYmd),
    [calendarMonth, todayYmd]
  );

  const canGoPreviousMonth = monthIndex(calendarMonth) > monthIndex(todayDate);
  const monthLabel = calendarMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const dateDisplay = date ? formatHumanDate(date) : "";

  const selectedTime = useMemo(() => {
    if (!date || hours.closed) return "";
    return timeSlots.some((slot) => slot.value === time) ? time : "";
  }, [date, hours.closed, time, timeSlots]);

  useEffect(() => {
    const input = dateRef.current;
    if (!input) return;

    if (!date) {
      input.setCustomValidity("");
      return;
    }

    input.setCustomValidity(
      hours.reason === "sunday"
        ? "We are closed on Sundays. Please choose Monday through Saturday."
        : hours.reason === "holiday"
          ? "Appointments are unavailable on this holiday. Please choose another date."
          : ""
    );
  }, [date, hours.reason]);

  useEffect(() => {
    if (!calendarOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [calendarOpen]);

  const pickDate = (ymd: string) => {
    setDate(ymd);
    setCalendarMonth(fromYmdLocal(ymd));
    setCalendarOpen(false);
  };

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
        Preferred date <span className="text-brand-burgundy">*</span>
        <div ref={wrapperRef} className="relative mt-2">
          <input type="hidden" name="date" value={date} />
          <input
            ref={dateRef}
            type="text"
            name="date_display"
            value={dateDisplay}
            readOnly
            required
            onFocus={() => setCalendarOpen(true)}
            onInvalid={(event) => {
              event.currentTarget.setCustomValidity("Please choose a booking date.");
            }}
            onInput={(event) => event.currentTarget.setCustomValidity("")}
            aria-describedby="booking-hours-note booking-date-format-note"
            placeholder="Choose a preferred date"
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 pr-12 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          />
          <button
            type="button"
            onClick={() => setCalendarOpen((open) => !open)}
            aria-label="Toggle calendar"
            className="absolute inset-y-1 right-1 rounded-lg px-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-burgundy hover:bg-brand-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1"
          >
            Pick
          </button>

          {calendarOpen ? (
            <div className="absolute z-30 mt-2 w-full min-w-[19rem] rounded-2xl border border-stone-200 bg-[#fffaf4] p-4 shadow-[0_20px_48px_rgba(58,25,16,0.22)] sm:w-[21rem]">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    canGoPreviousMonth &&
                    setCalendarMonth(
                      (prevMonth) =>
                        new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1)
                    )
                  }
                  disabled={!canGoPreviousMonth}
                  className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-brand-burgundy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-burgundy">
                  {monthLabel}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      (prevMonth) =>
                        new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1)
                    )
                  }
                  className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-brand-burgundy"
                >
                  Next
                </button>
              </div>

              <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
                {calendarCells.map((cell) => {
                  const selected = cell.ymd === date;
                  const today = cell.ymd === todayYmd;
                  const disabled = cell.disabled;

                  return (
                    <button
                      key={cell.ymd}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && pickDate(cell.ymd)}
                      title={
                        cell.reason === "holiday"
                          ? "Closed on holiday"
                          : cell.reason === "sunday"
                            ? "Closed on Sunday"
                            : cell.reason === "past"
                              ? "Past date"
                              : undefined
                      }
                      className={[
                        "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium transition-all duration-200",
                        cell.inCurrentMonth ? "text-stone-900" : "text-stone-300",
                        disabled ? "cursor-not-allowed text-stone-300 bg-stone-50/50" : "hover:bg-brand-gold/20 hover:scale-105",
                        today && !selected ? "border-2 border-brand-gold ring-1 ring-brand-gold/20" : "",
                        selected ? "bg-brand-burgundy text-white shadow-lg scale-105" : "",
                      ].join(" ")}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[10px] text-stone-600">
                Sundays and configured holidays are unavailable.
              </p>
            </div>
          ) : null}
        </div>
      </label>
      <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
        Preferred time <span className="text-brand-burgundy">*</span>
        <select
          name="time"
          value={selectedTime}
          onChange={(event) => setTime(event.target.value)}
          aria-describedby="booking-hours-note"
          disabled={hours.closed || !date}
          className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-100"
          required
        >
          <option value="">
            {hours.closed
              ? hours.reason === "holiday"
                ? "Closed on selected holiday"
                : "Closed on Sunday"
              : date
                ? "Choose a preferred time"
                : "Choose a date first"}
          </option>
          {timeSlots.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>
      </label>
      <p id="booking-hours-note" className="sm:col-span-2 text-xs text-stone-600">
        These are preferred intake times, not guaranteed appointments. Last request start:
        Monday-Friday 10:00 AM-5:00 PM, Saturday 10:00 AM-3:00 PM, Sunday closed.
      </p>
      <p id="booking-date-format-note" className="sr-only">
        Selected date is submitted in year-month-day format.
      </p>
    </div>
  );
}
