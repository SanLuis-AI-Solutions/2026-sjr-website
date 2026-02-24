"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const OPEN_TIME = "10:00";
const WEEKDAY_LAST_START = "17:00";
const SATURDAY_LAST_START = "15:00";
const SLOT_STEP_MINUTES = 15;

type HoursWindow = {
  closed: boolean;
  min: string;
  max: string;
};

type TimeSlot = {
  value: string;
  label: string;
};

function getTodayYmdLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayOfWeekFromDate(date: string) {
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun ... 6=Sat
}

function minutesFromTime(time: string) {
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  return hh * 60 + mm;
}

function timeFromMinutes(totalMinutes: number) {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function labelFromMinutes(totalMinutes: number) {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function getHoursWindow(date: string): HoursWindow {
  if (!date) {
    return { closed: false, min: OPEN_TIME, max: WEEKDAY_LAST_START };
  }

  const dow = dayOfWeekFromDate(date);
  if (dow === 0) {
    return { closed: true, min: OPEN_TIME, max: WEEKDAY_LAST_START };
  }
  if (dow === 6) {
    return { closed: false, min: OPEN_TIME, max: SATURDAY_LAST_START };
  }
  return { closed: false, min: OPEN_TIME, max: WEEKDAY_LAST_START };
}

export function BookingDateTimeFields() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);
  const hours = useMemo(() => getHoursWindow(date), [date]);
  const timeSlots = useMemo<TimeSlot[]>(() => {
    if (!date || hours.closed) return [];
    const slots: TimeSlot[] = [];
    const startMinutes = minutesFromTime(hours.min);
    const endMinutes = minutesFromTime(hours.max);
    for (let t = startMinutes; t <= endMinutes; t += SLOT_STEP_MINUTES) {
      slots.push({
        value: timeFromMinutes(t),
        label: labelFromMinutes(t),
      });
    }
    return slots;
  }, [date, hours.closed, hours.max, hours.min]);

  useEffect(() => {
    const input = dateRef.current;
    if (!input) return;
    input.setCustomValidity(
      hours.closed
        ? "We are closed on Sundays. Please choose Monday through Saturday."
        : ""
    );
  }, [hours.closed]);

  useEffect(() => {
    if (!time) return;
    if (hours.closed) {
      setTime("");
      return;
    }
    const exists = timeSlots.some((slot) => slot.value === time);
    if (!exists) {
      setTime("");
    }
  }, [hours.closed, time, timeSlots]);

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
        Date
        <input
          ref={dateRef}
          type="date"
          name="date"
          min={getTodayYmdLocal()}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          aria-describedby="booking-hours-note"
          className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          required
        />
      </label>
      <label className="block text-xs uppercase tracking-[0.2em] text-stone-600">
        Time
        <select
          name="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          aria-describedby="booking-hours-note"
          disabled={hours.closed || !date}
          className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-100"
          required
        >
          <option value="">
            {hours.closed
              ? "Closed on Sunday"
              : date
                ? "Select a time"
                : "Select a date first"}
          </option>
          {timeSlots.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>
      </label>
      <p id="booking-hours-note" className="sm:col-span-2 text-xs text-stone-600">
        Booking hours: Monday-Friday 10:00 AM-5:00 PM, Saturday 10:00 AM-3:00 PM, Sunday closed.
      </p>
    </div>
  );
}
