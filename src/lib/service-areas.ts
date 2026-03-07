export type ServiceAreaPage = {
  slug: string;
  city: string;
  title: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  trustPoints: string[];
  whyHeading: string;
  whyBody: string[];
  commonRepairsHeading: string;
  commonRepairsBody: string[];
  visitHeading: string;
  visitBody: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const SERVICE_AREA_PAGES: ServiceAreaPage[] = [
  {
    slug: "deer-park",
    city: "Deer Park",
    title: "Jewelry Repair Near Deer Park, TX | In-House Pasadena Workshop",
    description:
      "Need jewelry, watch, or heirloom repair near Deer Park? Work with our in-house Pasadena workshop for ring sizing, stone security, watch batteries, cleanings, and clear quote-first service.",
    heroImage: "/images/about/storefront.jpg",
    heroAlt: "Susie's Jewelry Repair storefront near Deer Park and Pasadena clients",
    intro:
      "Customers from Deer Park often need a fast, trustworthy repair option close to home without handing a meaningful piece to a mail-in chain or mall kiosk. Our Pasadena workshop is a short drive away on Fairmont Pkwy, and every repair stays in-house from intake to pickup.",
    trustPoints: [
      "Short drive from Deer Park to Fairmont Pkwy",
      "Same Day/Next Day service on many repairs",
      "Clear approvals before work begins",
    ],
    whyHeading: "Why Deer Park customers choose a Pasadena in-house jeweler",
    whyBody: [
      "The biggest advantage is control. Your ring, necklace, watch, or heirloom does not disappear into a shipping queue or third-party bench. You can speak directly with the local team handling the work, ask questions about timing, and get a realistic sense of what is worth repairing before committing.",
      "That matters for common Deer Park requests like ring sizing before an event, watch battery replacement on a workday, prong tightening before a trip, or heirloom cleanup before a family gathering. The job is not treated like anonymous intake. It is assessed by a shop that sees these repair patterns every day.",
      "If a repair needs more than a quick fix, we explain that up front. If it can be handled fast, we say that too. That quote-first approach helps customers avoid unnecessary trips and keeps expectations clear.",
    ],
    commonRepairsHeading: "Common jewelry and watch repairs from the Deer Park area",
    commonRepairsBody: [
      "The most common jobs from Deer Park customers are ring sizing, prong repair, chain repair, watch battery service, jewelry cleaning, and heirloom restoration. Those are high-need, high-trust repairs because they affect whether a piece is wearable, secure, and worth preserving.",
      "A ring that suddenly feels loose, a diamond that snags, a bracelet clasp that opens too easily, or a watch that stopped before work all fit the kind of problem where a nearby in-house shop is the better answer than a vague drop-off counter. In many of those cases, the fastest path is to request a quote online first, then bring the item in with a clear plan.",
      "If the piece is sentimental or structurally worn, the right next step may be restoration or redesign rather than a tiny spot repair. We help make that distinction before the work starts.",
    ],
    visitHeading: "What to expect if you are visiting from Deer Park",
    visitBody: [
      "If you are coming from Deer Park, the simplest workflow is to start with a fast quote, especially if you have a photo of the damage. That helps us guide you toward the right service before you leave home.",
      "Once you arrive, we inspect the piece, confirm whether the issue is straightforward or structural, and walk through timing and pricing before any repair begins. That is useful for busy customers fitting a repair into lunch breaks, school pickup windows, or weekend errands.",
      "Because the workshop is local and on-site, follow-up is simpler too. If you have a question after pickup, you are talking to the same business that handled the work, not a disconnected support line.",
    ],
    faqs: [
      {
        question: "Do you repair jewelry for Deer Park customers even though the shop is in Pasadena?",
        answer:
          "Yes. Deer Park is one of the nearby service areas we already support from our Pasadena storefront and in-house workshop.",
      },
      {
        question: "What is the fastest repair option if I am coming from Deer Park?",
        answer:
          "Start with a fast quote online for ring sizing, prong repair, watch batteries, or chain issues. That helps us guide you to the right next step before you drive over.",
      },
      {
        question: "Can I get same-day jewelry repair near Deer Park?",
        answer:
          "Many standard repairs follow our Same Day/Next Day pattern, depending on the piece, the damage, and current bench load.",
      },
    ],
  },
  {
    slug: "la-porte",
    city: "La Porte",
    title: "Jewelry Repair Near La Porte, TX | Quote-First In-House Service",
    description:
      "Looking for jewelry or watch repair near La Porte? Visit our Pasadena in-house workshop for ring sizing, watch batteries, heirloom restoration, cleanings, and custom guidance with clear approvals.",
    heroImage: "/images/services/watch-repair-hero.jpg",
    heroAlt: "In-house watch and jewelry repair service for La Porte clients",
    intro:
      "La Porte customers usually need one of two things: a repair that can be handled quickly, or a trustworthy opinion on whether a sentimental piece is worth fixing at all. Our Pasadena shop is close enough for both, and the work stays with one local team instead of getting routed through a chain workflow.",
    trustPoints: [
      "Local Pasadena workshop for La Porte clients",
      "Watch, jewelry, and heirloom service in one shop",
      "Quote-first guidance before repair begins",
    ],
    whyHeading: "Why La Porte customers use our Pasadena repair shop",
    whyBody: [
      "The appeal is not just distance. It is having a nearby bench jeweler and watch repair team that can inspect a piece, explain the tradeoffs, and tell you whether you need a quick repair, a safer rebuild, or a full redesign path.",
      "That is especially helpful for engagement rings with worn prongs, watches that need a battery and seal review, necklaces or bracelets with repeated break points, and older heirlooms that may not tolerate aggressive repair shortcuts.",
      "For La Porte families bringing in inherited jewelry, the value is often in preserving trust while making the piece wearable again. That is where an in-house workshop offers a better experience than generic intake and off-site handling.",
    ],
    commonRepairsHeading: "Common repairs we see from La Porte customers",
    commonRepairsBody: [
      "Watch battery replacement, ring sizing, stone tightening, cleaning and polishing, chain repair, and heirloom restoration are some of the most common needs from La Porte customers. These are practical repairs tied to daily wear, gift timing, and sentimental preservation.",
      "A stopped watch may only need a battery, but it can also signal gasket wear or deeper movement issues. A bent prong may look cosmetic, but it can mean the stone is one snag away from falling out. A quick local inspection helps separate minor fixes from urgent repairs.",
      "For custom or heirloom work, La Porte customers also come in when they want to reuse stones or gold in a stronger design instead of repeatedly repairing a fragile setting.",
    ],
    visitHeading: "Planning a visit from La Porte",
    visitBody: [
      "If you are coming from La Porte, start with the service page that matches the problem or send a quote request with one or two photos. That is the fastest way to get pointed toward ring sizing, watch repair, heirloom restoration, or custom work without guessing.",
      "When you arrive, we inspect the item, explain the safest path forward, and confirm the starting price and likely timeline before work begins. That makes the trip more efficient and keeps the decision grounded in the actual condition of the piece.",
      "If the repair is simple, it may follow the Same Day/Next Day pattern. If it is more complex, you will still leave with a clearer plan and a real recommendation rather than a vague estimate.",
    ],
    faqs: [
      {
        question: "Do you offer watch battery replacement for La Porte customers?",
        answer:
          "Yes. Watch battery service is one of the most common nearby requests and many standard quartz battery replacements can be handled quickly.",
      },
      {
        question: "Can I bring heirloom jewelry from La Porte for restoration or redesign?",
        answer:
          "Yes. We regularly inspect sentimental and inherited pieces to help customers decide between restoration, structural repair, and redesign.",
      },
      {
        question: "Should I request a quote before driving from La Porte?",
        answer:
          "Yes, especially if you have photos. A quote request helps us direct you to the right service and sets expectations before you make the trip.",
      },
    ],
  },
];

export function getServiceAreaPage(slug: string) {
  return SERVICE_AREA_PAGES.find((entry) => entry.slug === slug);
}
