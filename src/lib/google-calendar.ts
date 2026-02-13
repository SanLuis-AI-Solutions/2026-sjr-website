import { google } from "googleapis";
import { normalizeTimeZone } from "@/lib/timezone";

type BookingInput = {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  details?: string;
};

const TIMEZONE = normalizeTimeZone(process.env.GOOGLE_CALENDAR_TIMEZONE);
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

function normalizePrivateKey(value?: string) {
  if (!value) return null;
  let key = value.trim();
  if (
    (key.startsWith("\"") && key.endsWith("\"")) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  return key;
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google service account credentials.");
  }

  if (!privateKey.includes("BEGIN") || !privateKey.includes("PRIVATE KEY")) {
    throw new Error(
      "Google service account private key is not a PEM key. Expected a value like '-----BEGIN PRIVATE KEY-----...'."
    );
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export async function createBookingEvent(input: BookingInput) {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const start = new Date(`${input.date}T${input.time}:00`);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  const summary = `Free Assessment - ${input.name}`;
  const description = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    input.details ? `Details: ${input.details}` : null,
    "Duration: 15 minutes + 15 minute buffer",
  ]
    .filter(Boolean)
    .join("\n");

  const event = {
    summary,
    description,
    start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
    end: { dateTime: end.toISOString(), timeZone: TIMEZONE },
  };

  const response = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: event,
  });

  return response.data;
}
