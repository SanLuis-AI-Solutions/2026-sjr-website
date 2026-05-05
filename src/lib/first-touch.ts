export type FirstTouch = {
  landing_path: string;
  landing_search: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  utm_id: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  msclkid: string | null;
  first_touch_at: string | null;
};

export const FIRST_TOUCH_KEY = "sjr_first_touch";

export function readFirstTouch(): FirstTouch | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(FIRST_TOUCH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FirstTouch;
  } catch {
    return null;
  }
}

export function writeFirstTouch(firstTouch: FirstTouch) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
}
