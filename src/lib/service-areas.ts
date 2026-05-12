export type ServiceAreaPage = {
  slug: string;
  city: string;
  areaSchemaType?: "City" | "Place";
  title: string;
  description: string;
  cardDescription: string;
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
  localScenarios: Array<{
    title: string;
    body: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  helpfulReads?: Array<{
    label: string;
    href: string;
  }>;
  helpfulReadServiceSlugs?: string[];
};

export const SERVICE_AREA_PAGES: ServiceAreaPage[] = [
  {
    slug: "pasadena",
    city: "Pasadena",
    title: "Jewelry Repair in Pasadena, TX | In-House Jewelry & Watch Repair",
    description:
      "Looking for jewelry repair in Pasadena, TX? Work directly with our in-house workshop for ring sizing, watch batteries, prong repair, chain repair, heirloom restoration, and clear quote-first service.",
    cardDescription:
      "Start here for Pasadena jewelry repair, watch service, heirloom work, and quote-first guidance from the local in-house workshop.",
    heroImage: "/images/about/storefront.jpg",
    heroAlt: "Susie's Jewelry Repair storefront in Pasadena, Texas",
    intro:
      "Pasadena customers usually want a repair shop they can reach quickly, trust with sentimental pieces, and talk to directly before work begins. Our Fairmont Parkway workshop gives you that local path for jewelry repair, watch service, heirloom restoration, and custom guidance without sending the piece off-site.",
    trustPoints: [
      "Pasadena storefront and in-house workshop on Fairmont Pkwy",
      "Same Day/Next Day service on many standard repairs",
      "Clear approvals before repair work begins",
    ],
    whyHeading: "Why Pasadena customers use our in-house workshop",
    whyBody: [
      "The biggest advantage is direct local access. You are not dropping your ring, watch, or necklace at a counter that ships it somewhere else. You can ask questions, get a realistic assessment, and work with the same Pasadena shop from intake to pickup.",
      "That matters for common Pasadena requests like ring sizing before an event, a watch battery that died during the workweek, a chain that snapped unexpectedly, or a diamond that feels loose and needs to be checked before it is worn again.",
      "If the repair is simple, we say so. If the piece needs structural work, restoration, or redesign, we explain that early so the next step is clear before you commit.",
    ],
    commonRepairsHeading: "Common jewelry and watch repairs in Pasadena",
    commonRepairsBody: [
      "The most common Pasadena repair requests are watch battery replacement, ring sizing, prong tightening, chain repair, jewelry cleaning, bracelet repair, and heirloom restoration. These are the repairs where timing and trust matter because the piece is already failing or at risk.",
      "A loose stone, worn clasp, bent shank, or stopped watch can look minor until it leads to a lost stone, a broken chain, or a missed event. That is why a nearby in-house jeweler is often the better answer than waiting or mailing the piece away.",
      "For older or sentimental pieces, Pasadena customers also come in when they need help deciding whether to restore the original design, reinforce the existing structure, or repurpose materials into something stronger for regular wear.",
    ],
    visitHeading: "What to expect when you visit our Pasadena shop",
    visitBody: [
      "If you are already in Pasadena, the fastest path is to request a quote online with a photo or come in with the piece so we can inspect it in person. We will confirm whether the issue is routine, urgent, or better treated as restoration before repair begins.",
      "Once we review the item, we walk through the likely timing, the starting price, and whether Same Day/Next Day service is realistic for that specific job. That keeps the decision grounded in the actual condition of the piece, not guesswork.",
      "Because the work stays in-house, follow-up is easier too. If you have questions after pickup or need another adjustment, you are still working with the same local team.",
    ],
    localScenarios: [
      {
        title: "Quick in-town repair stop",
        body:
          "Best fit when you are already nearby and need a watch battery, ring fit check, or loose-stone assessment handled without turning the visit into a full-day errand.",
      },
      {
        title: "Event-driven repair",
        body:
          "Useful when the piece needs to be wearable before a wedding, anniversary, or family gathering and you need a realistic same-day versus next-day answer.",
      },
      {
        title: "Sentimental-piece review",
        body:
          "The right path when an heirloom needs a direct conversation about repair, reinforcement, or redesign before anyone starts altering it.",
      },
    ],
    faqs: [
      {
        question: "Do you do jewelry repair in Pasadena or send it somewhere else?",
        answer:
          "Our jewelry and watch repair work is handled through the Pasadena storefront and in-house workshop, so you can work directly with the local team.",
      },
      {
        question: "What repairs are most common for Pasadena customers?",
        answer:
          "Watch batteries, ring sizing, prong repair, chain repair, jewelry cleaning, and heirloom inspection are some of the most common Pasadena requests.",
      },
      {
        question: "Should I request a quote before visiting the Pasadena shop?",
        answer:
          "Yes, especially if you have photos. A quote request helps us guide you toward the right service and set expectations before you arrive.",
      },
    ],
    helpfulReads: [
      {
        label: "Does my watch need a battery or deeper repair?",
        href: "/blog/does-my-watch-need-battery-or-repair-pasadena",
      },
      {
        label: "How much does pearl restringing cost in Pasadena?",
        href: "/blog/how-much-does-pearl-restringing-cost-pasadena",
      },
      {
        label: "Where weak chains usually fail first",
        href: "/blog/chain-repair-weak-points",
      },
    ],
    helpfulReadServiceSlugs: ["watch-repair", "ring-sizing", "heirloom-restoration"],
  },
  {
    slug: "deer-park",
    city: "Deer Park",
    title: "Jewelry Repair Near Deer Park, TX | In-House Pasadena Workshop",
    description:
      "Need jewelry, watch, or heirloom repair near Deer Park? Work with our in-house Pasadena workshop for ring sizing, stone security, watch batteries, cleanings, and clear quote-first service.",
    cardDescription:
      "Start with local guidance for ring sizing, watch batteries, prong repair, and quote-first service from our Pasadena workshop.",
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
    localScenarios: [
      {
        title: "Fast weekday repair",
        body:
          "A good match for Deer Park customers fitting in ring sizing, battery service, or a prong check around work and family schedules.",
      },
      {
        title: "Quote before the drive",
        body:
          "Helpful when photos can clarify whether the visit is likely to be a routine repair, a structural issue, or something that can wait.",
      },
      {
        title: "Heirloom before a gathering",
        body:
          "Best when older jewelry needs to look right and wear safely before a family event rather than just receive a quick cosmetic touch-up.",
      },
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
    helpfulReadServiceSlugs: ["watch-repair", "stone-setting", "heirloom-restoration"],
  },
  {
    slug: "la-porte",
    city: "La Porte",
    title: "Jewelry Repair Near La Porte, TX | Quote-First In-House Service",
    description:
      "Looking for jewelry or watch repair near La Porte? Visit our Pasadena in-house workshop for ring sizing, watch batteries, heirloom restoration, cleanings, and custom guidance with clear approvals.",
    cardDescription:
      "Get the fastest path for watch service, heirloom restoration, and quote-first repair planning before making the trip.",
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
    localScenarios: [
      {
        title: "Battery plus seal concern",
        body:
          "Especially relevant for La Porte watch owners when a stopped watch may also need gasket or moisture-related attention, not only a quick battery swap.",
      },
      {
        title: "Repair versus redesign",
        body:
          "Useful when inherited jewelry is sentimental but structurally tired and the better answer may be strengthening or redesigning the piece.",
      },
      {
        title: "Trip-efficient visit",
        body:
          "Best when you want the service category narrowed before leaving La Porte so the Pasadena visit starts with the right bench conversation.",
      },
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
    helpfulReads: [
      {
        label: "Where to get a watch battery replaced near Pasadena",
        href: "/blog/where-to-get-watch-battery-replaced-pasadena",
      },
      {
        label: "Heirloom restoration planning guide",
        href: "/blog/heirloom-restoration-planning-guide",
      },
      {
        label: "Pearl restringing timing guide",
        href: "/blog/pearl-restringing-timing-guide",
      },
    ],
    helpfulReadServiceSlugs: ["watch-repair", "heirloom-restoration", "custom-design"],
  },
  {
    slug: "webster",
    city: "Webster",
    title: "Jewelry Repair Near Webster, TX | Fast Quote-First Pasadena Service",
    description:
      "Need jewelry or watch repair near Webster? Work with our Pasadena in-house workshop for ring sizing, watch batteries, prong repair, cleanings, and heirloom restoration with clear approvals.",
    cardDescription:
      "Use this route if you are coming from Webster for watch service, ring sizing, or quote-first repair planning.",
    heroImage: "/images/services/watch-repair-hero.jpg",
    heroAlt: "Watch and jewelry repair guidance for Webster clients",
    intro:
      "Webster customers often need a repair plan that fits around work, school pickup, Bay Area errands, or a quick stop before heading back across town. Our Pasadena workshop gives you a nearby in-house option without relying on a mall counter or mail-in chain.",
    trustPoints: [
      "Quote-first planning before you drive over",
      "In-house Pasadena workshop, not outsourced handling",
      "Same Day/Next Day service on many standard repairs",
    ],
    whyHeading: "Why Webster customers choose a nearby in-house repair shop",
    whyBody: [
      "The main advantage is clarity before the drive. If your ring is loose, your watch stopped, or a sentimental piece needs inspection, you can start with a quote request and arrive with a more realistic next step instead of guessing whether the repair is simple or structural.",
      "That matters for Webster customers balancing Bay Area schedules around work, school pickup, medical appointments, Baybrook errands, or the NASA/Clear Lake corridor. A quick battery swap, ring sizing assessment, or prong inspection is easier when the shop can explain what is urgent, what is routine, and what can wait until a more convenient visit.",
      "Because the work stays in-house, you do not lose visibility once the piece leaves the counter. You are dealing with one local team from intake to pickup.",
    ],
    commonRepairsHeading: "Common jewelry and watch repairs from the Webster area",
    commonRepairsBody: [
      "The most common Webster requests are watch battery service, ring sizing, prong repair, chain repair, and jewelry cleaning. These are practical repairs tied to daily wear and the need to get a piece safely wearable again.",
      "Many Webster customers come in because a watch stopped before work, an engagement ring suddenly feels loose, or a chain failed before a weekend event. These are the kinds of repairs where a nearby in-house workshop is more useful than a generic intake counter because the first question is whether the item is safe to keep wearing.",
      "For watch requests, the useful intake detail is whether the watch simply stopped, started jumping seconds, fogged under the crystal, or has a crown that feels loose. For ring requests, the useful detail is whether the fit changed, a stone moves, or a prong catches fabric. Those details help separate a routine visit from a repair that should be inspected before normal wear continues.",
      "If the issue turns out to be more structural, the quote-first process helps you understand whether the better answer is a spot repair, a rebuild, or a redesign path.",
    ],
    visitHeading: "Planning a visit from Webster",
    visitBody: [
      "If you are coming from Webster, the most efficient path is to start with photos and a fast quote request. That helps us tell you whether you are likely dealing with a quick battery replacement, a ring sizing appointment, or a more detailed repair assessment.",
      "Include one close photo of the problem area and one wider photo of the full piece. For watches, add the brand and whether the watch stopped after water, impact, or sitting unused. For rings, add whether the piece is worn daily and whether any stone movement is visible. That makes the Webster-to-Pasadena trip more focused.",
      "When you arrive, we inspect the item, confirm the likely timeline, and explain the starting price before work begins. That keeps the trip focused and avoids unnecessary back-and-forth.",
      "If the repair is straightforward, it may fit the Same Day/Next Day pattern. If it is more complex, you still leave with a clear plan from the same shop that will handle the work.",
    ],
    localScenarios: [
      {
        title: "Bay Area workday watch issue",
        body:
          "A practical fit when a watch stops before work, Baybrook errands, or a NASA/Clear Lake-area appointment and you need to know whether it is a simple battery path or a deeper repair issue.",
      },
      {
        title: "Before-you-drive triage",
        body:
          "Useful when Webster customers want a photo-based first answer before deciding whether the trip should be for a quote, a booking, or a later visit with more time set aside.",
      },
      {
        title: "Loose ring or stone",
        body:
          "The better path when something suddenly feels wrong and the safest move is to inspect it before normal daily wear continues.",
      },
    ],
    faqs: [
      {
        question: "Do you help Webster customers even though the storefront is in Pasadena?",
        answer:
          "Yes. Webster is one of the nearby areas that can use our Pasadena in-house workshop for jewelry, watch, and heirloom repair.",
      },
      {
        question: "What should I do before driving from Webster for a repair?",
        answer:
          "Start with a fast quote and photos if possible. That helps us guide you toward the right service before you make the trip.",
      },
      {
        question: "Can standard repairs still be same-day for Webster customers?",
        answer:
          "Many standard repairs still follow our Same Day/Next Day pattern, depending on the item, the damage, and current bench load.",
      },
    ],
    helpfulReads: [
      {
        label: "Does my watch need a battery or deeper repair?",
        href: "/blog/does-my-watch-need-battery-or-repair-pasadena",
      },
      {
        label: "Watch intake details before you make the drive",
        href: "/blog/where-to-get-watch-battery-replaced-pasadena",
      },
      {
        label: "Gold ring resizing cost and timing guide",
        href: "/blog/cost-to-resize-gold-ring-pasadena",
      },
      {
        label: "Stone security checklist before you keep wearing a ring",
        href: "/blog/stone-security-checklist",
      },
    ],
    helpfulReadServiceSlugs: ["watch-repair", "ring-sizing", "stone-setting"],
  },
  {
    slug: "friendswood",
    city: "Friendswood",
    title: "Jewelry Repair Near Friendswood, TX | In-House Heirloom and Ring Service",
    description:
      "Looking for jewelry repair near Friendswood? Visit our Pasadena in-house workshop for ring sizing, prong repair, heirloom restoration, jewelry cleaning, and custom guidance with clear approvals.",
    cardDescription:
      "Friendswood customers can start here for heirloom repair, ring work, and safer quote-first guidance before visiting the shop.",
    heroImage: "/images/about/storefront.jpg",
    heroAlt: "In-house jewelry repair guidance for Friendswood clients",
    intro:
      "Friendswood customers often bring in pieces that matter: engagement rings that need sizing, family jewelry that needs restoration, or daily-wear pieces that are no longer safe to keep wearing. Our Pasadena workshop gives you a nearby in-house path with more clarity than a drop-off chain model.",
    trustPoints: [
      "Family-heirloom and engagement-ring friendly workflow",
      "Clear approvals before repair begins",
      "One local team handling intake through pickup",
    ],
    whyHeading: "Why Friendswood customers use our Pasadena workshop",
    whyBody: [
      "The biggest reason is trust. Meaningful pieces are easier to hand over when you know the work stays local and the person inspecting the issue can explain whether the item needs a quick repair, a structural rebuild, or a redesign conversation.",
      "That matters for Friendswood customers bringing in inherited jewelry, delicate side-stone rings, worn prongs, or sentimental chains that have already been repaired once before. The goal is not just to patch the issue. It is to return the piece in a safer, longer-lasting condition.",
      "A quote-first workflow also reduces guesswork. You can start with photos, understand the likely path, and decide whether the trip is for a same-day fix or a deeper bench assessment.",
    ],
    commonRepairsHeading: "Common repairs we see from Friendswood customers",
    commonRepairsBody: [
      "Friendswood customers most often come in for ring sizing, stone security work, chain repair, jewelry cleaning, and heirloom restoration. These are high-trust repairs because they affect how safely the piece can be worn and whether the original look can be preserved.",
      "A loose diamond, worn prong, thin shank, or inherited ring with accumulated wear is exactly the kind of problem that benefits from an in-house inspection before anyone promises a quick fix.",
      "For pieces with sentimental value, the right answer is sometimes restoration and sometimes redesign. We help make that distinction before work begins.",
    ],
    visitHeading: "What to expect if you are visiting from Friendswood",
    visitBody: [
      "If you are coming from Friendswood, the easiest workflow is to start with a photo and quote request, especially for ring or heirloom work. That helps us point you toward the right service before you arrive.",
      "Once you are in the shop, we inspect the piece, confirm whether the issue is cosmetic or structural, and walk through starting price and timing before any repair begins.",
      "That keeps the visit useful whether you need a quick ring fix or a more thoughtful heirloom restoration plan.",
    ],
    localScenarios: [
      {
        title: "Engagement ring confidence check",
        body:
          "A strong fit when a ring needs sizing, prong work, or stone security reviewed before it is worn daily again.",
      },
      {
        title: "Inherited jewelry decision",
        body:
          "Useful when a family piece needs a careful recommendation on preservation, reinforcement, or redesign rather than a generic repair answer.",
      },
      {
        title: "Quote-first heirloom visit",
        body:
          "Best when photos can help establish whether the trip is likely to be a straightforward fix or a deeper restoration conversation.",
      },
    ],
    faqs: [
      {
        question: "Can Friendswood customers bring in heirloom jewelry for restoration?",
        answer:
          "Yes. Heirloom restoration and structural inspection are common needs for nearby Friendswood customers.",
      },
      {
        question: "Is a quote request worth doing before I drive from Friendswood?",
        answer:
          "Yes. A quote request with photos often helps us tell you whether the piece likely needs basic repair, structural work, or redesign planning.",
      },
      {
        question: "Do you handle engagement-ring style repairs for Friendswood customers?",
        answer:
          "Yes. Ring sizing, prong repair, stone tightening, and related engagement-ring work are common requests.",
      },
    ],
    helpfulReads: [
      {
        label: "Heirloom restoration planning guide",
        href: "/blog/heirloom-restoration-planning-guide",
      },
      {
        label: "How to choose a jeweler for repair work",
        href: "/blog/how-to-choose-a-jeweler",
      },
      {
        label: "Stone security checklist before a loose stone becomes a loss",
        href: "/blog/stone-security-checklist",
      },
    ],
    helpfulReadServiceSlugs: ["ring-sizing", "stone-setting", "heirloom-restoration"],
  },
  {
    slug: "clear-lake",
    city: "Clear Lake",
    areaSchemaType: "Place",
    title: "Jewelry Repair Near Clear Lake, TX | Nearby Pasadena In-House Workshop",
    description:
      "Need jewelry or watch repair near Clear Lake? Our Pasadena in-house workshop handles ring sizing, watch batteries, prong repair, jewelry cleaning, and heirloom restoration with clear quote-first guidance.",
    cardDescription:
      "Clear Lake customers can start here for nearby watch repair, ring work, and quote-first service from the Pasadena workshop.",
    heroImage: "/images/services/watch-repair-hero.jpg",
    heroAlt: "Jewelry and watch repair guidance for Clear Lake clients",
    intro:
      "Clear Lake customers usually want a nearby repair shop that feels more reliable than a kiosk and easier than shipping a meaningful piece away. Our Pasadena workshop serves that need with in-house work, clear approvals, and a straightforward quote-first process.",
    trustPoints: [
      "Nearby in-house Pasadena workshop for Clear Lake clients",
      "Good fit for watch, ring, and heirloom questions",
      "Fast quote-first path before you visit",
    ],
    whyHeading: "Why Clear Lake customers use a Pasadena in-house jeweler",
    whyBody: [
      "The value is not just proximity. It is being able to get a real recommendation on whether the piece needs a battery, a simple repair, structural reinforcement, or a redesign conversation before you build the trip around it.",
      "That is especially useful for Clear Lake customers working around NASA-area schedules, Bay Area Boulevard errands, school pickup, or a weekend event near the water. A stopped watch, a ring that no longer fits, or a stone that feels exposed should be sorted by repair risk before the piece goes back into normal wear.",
      "Because the repair stays with one local team, the handoff is cleaner and the advice is easier to trust than a chain intake model.",
    ],
    commonRepairsHeading: "Common repairs from Clear Lake customers",
    commonRepairsBody: [
      "The most common requests from the Clear Lake area are watch battery replacement, ring sizing, prong repair, jewelry cleaning, and heirloom inspection. These are repairs where early action matters because small issues can become expensive losses.",
      "A loose stone, tired clasp, bent prong, or dead watch may look minor at first. For Clear Lake watch requests, water exposure, humidity, fog under the crystal, and a weak crown matter because those symptoms can turn a battery request into a seal or movement concern.",
      "For rings and daily-wear jewelry, the useful intake detail is whether the piece is catching on clothing, spinning more than usual, or showing one prong that looks flatter than the others. In many cases, a quick local inspection is what prevents a lost diamond, a broken chain, or a more expensive repair later.",
      "For sentimental pieces, Clear Lake customers also use the shop when they need help deciding between cleaning, structural repair, restoration, or redesign.",
    ],
    visitHeading: "Planning a repair visit from Clear Lake",
    visitBody: [
      "If you are coming from Clear Lake, start with a fast quote if you can share photos. That helps us tell you whether the issue is likely straightforward or whether the piece needs a deeper in-house assessment.",
      "For watches, include whether the watch stopped after water, sweat, heat, or sitting unused. For rings, include a close photo of the prongs, side stones, or shank plus one wider photo of the full piece. Those details make the Pasadena visit more focused.",
      "When you arrive, we inspect the item, explain the safest next step, and confirm the likely timing and starting price before any work begins.",
      "That makes the trip more worthwhile, especially when you are trying to solve the repair without guessing which service category applies.",
    ],
    localScenarios: [
      {
        title: "Water or humidity watch decision",
        body:
          "Helpful when you need to separate a routine battery issue from a Clear Lake-area watch problem that may involve moisture, seals, or deeper diagnosis before more time passes.",
      },
      {
        title: "Daily-wear stone check",
        body:
          "Useful when a prong, clasp, or setting feels questionable and the priority is avoiding a more expensive loss before the ring goes back into daily wear.",
      },
      {
        title: "Category clarification",
        body:
          "Best when the issue is real but not obvious yet and you want the Pasadena visit to start with the right service path.",
      },
    ],
    faqs: [
      {
        question: "Do you serve Clear Lake customers even though the shop is in Pasadena?",
        answer:
          "Yes. Clear Lake is part of the nearby area that can use our Pasadena in-house workshop for jewelry, watch, and heirloom repairs.",
      },
      {
        question: "What are the most common repairs for Clear Lake customers?",
        answer:
          "Watch batteries, ring sizing, prong repair, jewelry cleaning, and heirloom inspection are some of the most common nearby requests.",
      },
      {
        question: "Should I request a quote before visiting from Clear Lake?",
        answer:
          "Yes. A quote request with photos gives you the fastest path into the right repair conversation before you drive over.",
      },
    ],
    helpfulReads: [
      {
        label: "Where to get a watch battery replaced near Pasadena",
        href: "/blog/where-to-get-watch-battery-replaced-pasadena",
      },
      {
        label: "Does my watch need a battery or deeper repair?",
        href: "/blog/does-my-watch-need-battery-or-repair-pasadena",
      },
      {
        label: "Gold ring resizing cost and timing guide",
        href: "/blog/cost-to-resize-gold-ring-pasadena",
      },
      {
        label: "Where weak chains usually fail first",
        href: "/blog/chain-repair-weak-points",
      },
    ],
    helpfulReadServiceSlugs: ["watch-repair", "ring-sizing", "heirloom-restoration"],
  },
];

export function getServiceAreaPage(slug: string) {
  return SERVICE_AREA_PAGES.find((entry) => entry.slug === slug);
}
