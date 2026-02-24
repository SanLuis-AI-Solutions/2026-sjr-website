# Implementation Notes: SJR Content Nexus

## Nexus Spec (Refined Option 1)

### Layout Configuration
- **Shell**: Sidebar-collapsed default (same as Dashboard v2 pattern).
- **Core Content**: 12-column Grid.
    - **Header**: Sticky glass header with global "Sync Status" badge and "Last Update" timestamp.
    - **Top Row (Metrics)**: Three cards (API Health, Sync Score, Active In-Funnel Reviews).
    - **Middle Row (The Nexus)**: The multi-platform synchronization table. Each row represents a Blog Post. Columns: Date, Title, Status (Draft/Syncing/Live), Platform Icons (GBP, FB, IG, Pinterest, LinkedIn).
    - **Bottom Row (Review Stream)**: A scrollable feed of recent review invitations sent, including delivery status (Sent/Delivered/Opened/Reviewed).

### Design Tokens (Strict Adherence)
- **Background**: `var(--background)` (#faf7f2) or a deep dark variant if the user prefers dark mode for admin. Default: Light Mode/Luxury Cream.
- **Accents**: `var(--brand-gold)` (#d1b882) for active toggles and success states.
- **Typography**: Playfair Display (Headers) & Inter (UI/Data).
- **Cards**: `.glass-card` utility for all container elements.

### Interactive Components
- **Sync Toggles**: Custom switch buttons in `var(--brand-gold)` for per-platform enabling.
- **Action Buttons**: `micro-interaction` class for all buttons.
- **Status Indicators**: Pulse animations for "Syncing" state; Static gold dot for "Live."

---

## Stitch-Ready Prompts

### 1. The Nexus Dashboard Shell
> Generate a premium Next.js dashboard shell for "SJR Content Nexus." Use a light cream background (#faf7f2). Include a sticky header with a blurred glass effect. Sidebar should contain links for "Overview," "Social Engine," "Review Loop," and "API Vault." Use Playfair Display for headers and Inter for interface text. Apply a gold accent (#d1b882) to the active navigation item.

### 2. The Multi-Platform Sync Table
> Build a sophisticated React table component for "Social Sync Status." Columns: [Post Thumbnail, Title, Date, Status Badge, Social Icons]. Each social icon (Google Business, Facebook, Instagram, Pinterest) should have an "active" gold state and an "inactive" muted state. Include a "Manual Sync All" button with a glass effect and gold border. Ensure high-contrast typography using Inter.

### 3. The Review Loop Pipeline
> Create a vertical "Review Pipeline" component. Visualize the flow: [Job Done] -> [24h Delay] -> [SMS Sent] -> [Link Clicked] -> [Review Posted]. Use connecting gold lines between nodes. Each node should display a timestamp and customer initial. Add a subtle 'animate-fade-up' to each stage.

---

## Critique Checklist (UX/a11y)
- [ ] **Contrast**: Ensure status labels (Success/Error) have enough contrast against the cream background.
- [ ] **State Feedback**: Does the "Sync" button provide immediate visual feedback (e.g., loading spinner) when clicked?
- [ ] **Touch Targets**: Ensure sync toggles in the table are at least 44px for tablet use (SJR often uses tablets in the workshop).
- [ ] **Language**: Use plain English (e.g., "Ready to Share" instead of "Draft Phase 2").
