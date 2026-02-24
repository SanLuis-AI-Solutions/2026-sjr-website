export const BOOKING_OPEN_TIME = "10:00";
export const BOOKING_WEEKDAY_LAST_START = "17:00";
export const BOOKING_SATURDAY_LAST_START = "15:00";
export const BOOKING_SLOT_STEP_MINUTES = 15;

export type BookingClosedReason = "sunday" | "holiday" | null;

export type BookingHoursWindow = {
  closed: boolean;
  min: string;
  max: string;
  reason: BookingClosedReason;
};

export type BookingTimeSlot = {
  value: string;
  label: string;
};

function parseBlackoutDates(raw: string | undefined) {
  if (!raw) return new Set<string>();
  return new Set(
    raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item))
  );
}

const configuredHolidayBlackouts = parseBlackoutDates(
  process.env.NEXT_PUBLIC_BOOKING_BLACKOUT_DATES
);

export function getConfiguredBookingBlackouts() {
  return new Set(configuredHolidayBlackouts);
}

export function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isValidTimeString(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

export function dayOfWeekFromDate(date: string) {
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun .. 6=Sat
}

export function minutesFromTime(time: string) {
  const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
  return hh * 60 + mm;
}

export function timeFromMinutes(totalMinutes: number) {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function labelFromMinutes(totalMinutes: number) {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function isBookingHoliday(date: string) {
  return configuredHolidayBlackouts.has(date);
}

export function getBookingHoursWindow(date: string): BookingHoursWindow {
  if (!isValidDateString(date)) {
    return {
      closed: false,
      min: BOOKING_OPEN_TIME,
      max: BOOKING_WEEKDAY_LAST_START,
      reason: null,
    };
  }

  if (isBookingHoliday(date)) {
    return {
      closed: true,
      min: BOOKING_OPEN_TIME,
      max: BOOKING_WEEKDAY_LAST_START,
      reason: "holiday",
    };
  }

  const dow = dayOfWeekFromDate(date);
  if (dow === 0) {
    return {
      closed: true,
      min: BOOKING_OPEN_TIME,
      max: BOOKING_WEEKDAY_LAST_START,
      reason: "sunday",
    };
  }
  if (dow === 6) {
    return {
      closed: false,
      min: BOOKING_OPEN_TIME,
      max: BOOKING_SATURDAY_LAST_START,
      reason: null,
    };
  }

  return {
    closed: false,
    min: BOOKING_OPEN_TIME,
    max: BOOKING_WEEKDAY_LAST_START,
    reason: null,
  };
}

export function getBookingTimeSlots(date: string): BookingTimeSlot[] {
  if (!isValidDateString(date)) return [];
  const window = getBookingHoursWindow(date);
  if (window.closed) return [];

  const slots: BookingTimeSlot[] = [];
  const startMinutes = minutesFromTime(window.min);
  const endMinutes = minutesFromTime(window.max);

  for (let t = startMinutes; t <= endMinutes; t += BOOKING_SLOT_STEP_MINUTES) {
    slots.push({
      value: timeFromMinutes(t),
      label: labelFromMinutes(t),
    });
  }
  return slots;
}

export function isWithinBookingHours(date: string, time: string) {
  if (!isValidDateString(date) || !isValidTimeString(time)) return false;
  const window = getBookingHoursWindow(date);
  if (window.closed) return false;

  const start = minutesFromTime(time);
  if (!Number.isFinite(start)) return false;
  if (start % BOOKING_SLOT_STEP_MINUTES !== 0) return false;

  return start >= minutesFromTime(window.min) && start <= minutesFromTime(window.max);
}

