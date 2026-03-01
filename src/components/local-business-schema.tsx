import { BUSINESS } from "@/lib/constants";

export function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": BUSINESS.name,
        "image": "https://susiesjewelryrepair.com/images/services/heirloom-restoration-hero.jpg",
        "@id": "https://susiesjewelryrepair.com",
        "url": "https://susiesjewelryrepair.com",
        "telephone": BUSINESS.phone,
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": BUSINESS.address.street,
            "addressLocality": BUSINESS.address.city,
            "addressRegion": BUSINESS.address.state,
            "postalCode": BUSINESS.address.zip,
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 29.6631,
            "longitude": -95.1436
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "51"
        },
        "review": [
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Lydia R." },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": "My engagement ring looks brand new. The team explained every step and kept it on-site."
            },
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Carlos M." },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": "Fast turnaround and honest pricing. I appreciated the in-house guarantee."
            },
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Jasmine K." },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": "They restored my grandmother’s necklace flawlessly. The craftsmanship is unreal."
            }
        ],
        "openingHoursSpecification": BUSINESS.hours.map((h) => {
            const [day] = h.day.split(" ");
            const match = h.hours.match(/(.*) – (.*)/);
            return {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": day,
                "opens": match ? match[1] : "10:00",
                "closes": match ? match[2] : "18:00"
            };
        }),
        "sameAs": [
            // Add social links here if available
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
