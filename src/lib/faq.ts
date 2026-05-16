export type FaqCategory =
  | "before-you-visit"
  | "pricing-and-timing"
  | "repairs-by-type"
  | "after-service";

export type FaqLink = {
  href: string;
  label: string;
};

export type FaqItem = {
  id: string;
  category: FaqCategory;
  q: string;
  a: string;
  pinned?: boolean;
  links?: FaqLink[];
};

export const FAQ_CATEGORY_LABELS: { id: FaqCategory; label: string }[] = [
  { id: "before-you-visit", label: "Before You Visit" },
  { id: "pricing-and-timing", label: "Pricing & Timing" },
  { id: "repairs-by-type", label: "Repairs by Type" },
  { id: "after-service", label: "After Service" },
];

export const FAQS: FaqItem[] = [
  {
    id: "in-house",
    category: "before-you-visit",
    q: "Do you repair jewelry and watches in-house?",
    a: "Yes. All service is performed in-house, so your piece stays under our care from drop-off through final checks.",
    pinned: true,
  },
  {
    id: "timing",
    category: "pricing-and-timing",
    q: "How long does a typical repair take?",
    a: "Most services follow Same Day/Next Day service. If parts or structural work are needed, we confirm timing before work begins.",
    pinned: true,
  },
  {
    id: "pricing",
    category: "pricing-and-timing",
    q: "Can I get pricing before I visit?",
    a: "Yes. Use Fast Quote to get a transparent starting range, then we confirm final scope and pricing after inspection.",
    pinned: true,
    links: [{ href: "/book", label: "Book a Repair" }],
  },
  {
    id: "appointment",
    category: "before-you-visit",
    q: "Do I need an appointment?",
    a: "Walk-ins are welcome. You can also reserve a free 15-minute assessment if you prefer a scheduled time.",
    links: [{ href: "/book", label: "Book Assessment" }],
  },
  {
    id: "approval",
    category: "pricing-and-timing",
    q: "Will you contact me before additional work?",
    a: "Yes. If the repair scope changes after inspection, we pause and get approval first.",
  },
  {
    id: "heirloom",
    category: "repairs-by-type",
    q: "Do you work on heirloom or sentimental pieces?",
    a: "Yes. We frequently service heirloom items and explain handling, risk points, and finishing steps before we proceed.",
    links: [{ href: "/services/heirloom-restoration", label: "Heirloom Restorations" }],
  },
  {
    id: "ring-sizing",
    category: "repairs-by-type",
    q: "Can you size rings with stones?",
    a: "Often, yes. We inspect settings before and after sizing and recommend reinforcement if needed.",
    links: [
      { href: "/services/ring-sizing", label: "Ring Sizing & Repair" },
      { href: "/services/stone-setting", label: "Stone Replacement & Settings" },
    ],
  },
  {
    id: "response-time",
    category: "after-service",
    q: "How quickly do you respond to online forms?",
    a: "We typically reply within 1 business day for quote, booking, and contact submissions.",
    links: [{ href: "/contact", label: "Contact Team" }],
  },
];
