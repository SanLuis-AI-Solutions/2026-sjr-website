const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SPAM_PHRASES = [
  "seo",
  "search engine optimization",
  "google rankings",
  "backlink",
  "backlinks",
  "guest post",
  "domain authority",
  "digital marketing",
  "lead generation",
  "web design",
  "website development",
  "telegram",
  "whatsapp",
  "forex",
  "crypto",
  "casino",
  "betting",
  "adult dating",
];

const LEGITIMATE_INTENT_PHRASES = [
  "repair",
  "jewelry",
  "jewellery",
  "watch",
  "ring",
  "resize",
  "resizing",
  "battery",
  "bracelet",
  "necklace",
  "chain",
  "clasp",
  "diamond",
  "stone",
  "pearl",
  "restoration",
  "heirloom",
  "booking",
  "appointment",
  "quote",
];

export type LeadSpamInput = {
  leadType: "quote" | "booking" | "contact";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  details?: string;
};

export type LeadSpamCheck = {
  isSpam: boolean;
  reason: string | null;
};

function countMatches(haystack: string, phrases: string[]) {
  return phrases.reduce((count, phrase) => count + (haystack.includes(phrase) ? 1 : 0), 0);
}

function countUrlLikePatterns(value: string) {
  const matches = value.match(
    /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|biz|info|xyz|ru|cn))(?:\/\S*)?/gi
  );
  return matches?.length ?? 0;
}

export function evaluateLeadSpam(input: LeadSpamInput): LeadSpamCheck {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const body = [input.message, input.details, input.phone]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const combined = `${name.toLowerCase()} ${email} ${body}`.trim();

  if (!EMAIL_PATTERN.test(email)) {
    return { isSpam: true, reason: "invalid_email" };
  }

  if (!/[a-z]/i.test(name) || name.length > 80) {
    return { isSpam: true, reason: "invalid_name" };
  }

  const spamHits = countMatches(combined, SPAM_PHRASES);
  const intentHits = countMatches(combined, LEGITIMATE_INTENT_PHRASES);
  const urlHits = countUrlLikePatterns(combined);

  if (urlHits >= 2) {
    return { isSpam: true, reason: "multiple_links" };
  }

  if (spamHits >= 2) {
    return { isSpam: true, reason: "spam_phrase_cluster" };
  }

  if (spamHits >= 1 && intentHits === 0) {
    return { isSpam: true, reason: "spam_phrase_without_service_intent" };
  }

  return { isSpam: false, reason: null };
}
