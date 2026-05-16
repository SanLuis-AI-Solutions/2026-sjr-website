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

function getTodayYmdLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingDateTimeFields() {
  const todayYmd = useMemo(() => getTodayYmdLocal(), []);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const dateRef = useRef<HTMLInputElement>(null);

  const hours = useMemo(() => getBookingHoursWindow(date), [date]);
  const timeSlots = useMemo(() => getBookingTimeSlots(date), [date]);

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

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium text-stone-700">
        Preferred date <span className="text-brand-burgundy">*</span>
        <input
          ref={dateRef}
          type="date"
          name="date"
          value={date}
          min={todayYmd}
          required
          onChange={(event) => {
            setDate(event.target.value);
            setTime("");
            event.currentTarget.setCustomValidity("");
          }}
          onInvalid={(event) => {
            event.currentTarget.setCustomValidity("Please choose a valid booking date.");
          }}
          aria-describedby="booking-hours-note"
          className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        />
      </label>
      <label className="block text-sm font-medium text-stone-700">
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
    </div>
  );
}
