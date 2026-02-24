# Stuller Showcase Implementation Notes

## Technical Solution
1. **Lazy-Loading Gate**: Implemented a "Start Your Journey" gateway to prevent the massive Stuller iframe from loading until user intent is confirmed.
2. **White-Label Iframe**: Used the `-frame-categoryembed` subdomain variation of the Stuller Showcase URL to automatically strip out third-party branding/headers.
3. **iFrame Resizer**: Integrated the `iframe-resizer-parent` script with Next.js `Script` component to handle cross-origin height synchronization.
4. **Luxury Skeleton UI**: Built a custom shimmer/skeleton state that displays while the catalog initializes, maintaining the premium feel.

## Files Modified
- `src/app/showroom/page.tsx`: Core logic and UI for the showroom.
- `src/components/home-sections.tsx`: New `ShowroomBand` component.
- `src/app/page.tsx`: Integrated showroom invitation band.
- `src/components/site-header.tsx`: Added global navigation link.
- `.env.local` / `.env.example`: Configuration variables.

## Verification
- Verified on Desktop and Mobile (375px).
- Confirmed "No Header" mode is active.
- Confirmed double scrollbars are minimized through resizer injection.
