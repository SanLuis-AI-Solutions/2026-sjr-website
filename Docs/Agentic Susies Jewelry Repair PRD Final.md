This document integrates the **Agent-First** technical architecture (Google Antigravity/Next.js), the **AEO** (Answer Engine Optimization) content strategy, and the pivotal **"In-House Authority" Rebrand** we established to differentiate Susie's from all competitors.

Status: Active
Last updated: 2026-02-02
Source of truth for execution plan: Docs/PLAN-sjr-website.md
Document index: DECISIONS.md

# Product Requirements Document (PRD)

**Project:** Susie’s Jewelry Repair Redesign & Agentic Automation System  
**Codename:** The Pasadena Dominator  
**Role:** Lead AI Solutions Architect & Digital Strategist  
**Architecture:** Agent-First (Google Antigravity, Next.js, Vercel, Supabase)  
**Version:** 4.0 (Final Optimized Build)

## 1\. Executive Summary

**Objective:** Transform susiesjewelryrepair.com from a passive brochure site into a high-performance lead-generation engine. We will capitalize on the "Golden Gap" in the market—offering the speed of **FastFix**, the expertise of **Frank’s**, and the safety that **KAY/Zales** cannot match (no shipping).  
**Core KPIs:**

* **Performance:** 100/100 Core Web Vitals score (LCP \< 1.2s) 1\.  
* **Visibility:** 30% increase in local search visibility for "Pasadena," "Deer Park," and "La Porte" 1\.  
* **Conversion:** 2:1 conversion ratio on the new "Fast Quote" AI tool 1\.  
* **Reputation:** Increase Google Review rating from 4.5 to 5.0 to outrank Frank’s 1\.

## 2\. Brand Identity: "The In-House Authority"

*Context: We are pivoting from generic "Expert Repair" to a specific, security-focused value proposition 2\.*

### 2.1 Value Proposition

* **The Hook:** **"Your Jewelry Never Leaves Our Hands."** 3  
* **The Promise:** Unlike big chains (KAY/Zales) that ship repairs to off-site warehouses, or mall kiosks (FastFix) that lack master expertise, Susie’s offers **Master Jeweler craftsmanship done entirely on-premises**.  
* **The Voice:** Direct, Transparent, and Family-Driven. We answer questions immediately and list prices openly 4\.

### 2.2 Competitive Positioning

* **Vs. KAY/Zales:** We are **Safer** (No shipping risk).  
* **Vs. FastFix:** We are **Better** (Master Jeweler vs. Technician).  
* **Vs. Frank’s:** We are **Transparent** (Listed Prices vs. Hidden Costs) 3\.

## 3\. Technical Architecture (The Agentic Stack)

* **Frontend:** **Next.js** deployed on **Vercel**.  
* **Backend:** **Supabase**.  
* *Database:* Stores dynamic pricing tables, repair logs, and lead capture data.  
* *Storage:* High-res "Before & After" imagery.  
* **Agentic Layer:** **Google Antigravity**.  
* *Model:* **Gemini** for multi-modal image analysis (identifying jewelry damage).  
* *Automation:* Manages the "Social-to-Web" content pipeline.  
* **Repository:** **GitHub** for CI/CD pipelines.

## 4\. Site Architecture & User Experience (UX)

### 4.1 Navigation Strategy

* **Global Navigation:** Home, Services, About, FAQ, Blog, Contact  
* **Primary CTAs:** Get Fast Quote, Book a Repair  
* **Footer:** List every individual service page link to create a site-wide crawl map for Google.

### 4.2 Trust Signals

* **The "Anti-Outsource" Badge:** A prominent graphic on the homepage stating: **"100% In-House Repairs. No Shipping."** 2\.  
* **Pricing Transparency:** Every service page features a "Starting At" price table powered by Supabase 10\.

## 5\. Comprehensive Page Requirements & Content Strategy

We will restructure the site into **Topic Clusters** to signal authority 11\.

### Cluster A: Core Services (Phase 1)

* **Services Hub:** All services listed with short summaries.  
* **Service Pages:**  
  * Watch Repair & Battery Replacement  
  * Ring Sizing & Repair  
  * Stone Replacement & Settings  
  * Jewelry Cleaning & Polishing  
  * Necklace & Bracelet Repair  
  * Pearl Restringing  
  * Jewelry Appraisals  
  * Custom Design  
  * Engraving  
  * Restorations & Heirloom Repair

### Cluster B: Transactional & Local (Phase 1)

* **Page: Get a Fast Quote** (Full-page upload tool)  
* **Page: Book a Repair** (calendar-backed scheduling)  
* **Local Landing Pages:** "Jewelry Repair Deer Park," "Watch Repair La Porte" (Programmatic SEO)

### Cluster C: Expansion (Phase 2 Backlog)

* **We Buy Gold & Trade-Ins**  
* **Mail-In Repair (Direct-to-Bench)**  
* **Eyeglass Frame Repair (Laser Weld)**

## 6\. The Agentic Layer (Automation Systems)

### 6.1 The "Fast Quote" Agent (Google Antigravity)

* **Trigger:** Customer uploads a photo to the "Get a Quote" page.  
* **Agent Logic (Gemini 1.5 Pro):**  
* Analyzes image to detect damage (e.g., "Missing Side Stone").  
* Queries Supabase services table for pricing.  
* **Output:** Returns an instant "Estimated Range" to the user, managing expectations (e.g., "This looks like a simple prong repair. Starts at $45.") 17\.

### 6.2 The Omni-Channel Social Agent

* **Trigger:** Technician uploads a photo of a finished repair to the internal dashboard.  
* **Agent Logic:**  
* **Instagram/FB:** Posts image with caption: *"Another Heirloom Saved by our Master Jeweler in Pasadena."*  
* **Pinterest:** Creates a Pin with keywords: *"Vintage Jewelry Restoration DIY."*  
* **Website:** Auto-updates the "Live Gallery" on the Restoration page.  
* **Blog:** Generates a short "Restoration Story" post for AEO 18\.

### 6.3 The Reputation Loop

* **Trigger:** Repair status marked "Picked Up" in Supabase.  
* **Action:** 24-hour delay \-\> SMS sent via Twilio.  
* **Script:** *"Loving your repair? Help our family business beat the big chains by leaving a review here: Link."*  
* **Goal:** Drive rating to 5.0 18\.

## 7\. SEO & AEO Strategy

* **"Answer-First" Formatting:** Every page must begin with a short direct answer to the search query to win AI citations.  
* **Schema Markup:**  
* LocalBusiness (with priceRange).  
* Service (for each individual page).  
* FAQPage (for the Educational Hub) 19\.

## 8\. Data Schema (Supabase)

Table Name,Key Fields,Purpose  
services,"id, name, slug, starting_price, time_estimate",Powers dynamic pricing tables & AI Quote Agent.  
repairs\_log,"id, client\_phone, status, before\_img, after\_img",Internal tracking & Social Automation trigger.  
leads,"id, user\_img, ai\_diagnosis, estimated\_range","Captures ""Get a Quote"" user data."  
reviews,"id, platform, rating, text",Monitors reputation growth.

## 9\. Extras \- Be sure to add these:  Key Principles for Beautiful UI

* 60-30-10 Color Rule: 60% primary color, 30% secondary, 10% accent for balance.  
* Minimalism & Space: Avoiding clutter, using whitespace for focus.  
* Hierarchy & Contrast: Guiding the eye using size, color, and positioning.  
* Consistency: Maintaining uniform typography, buttons, and spacing. 

Emerging Trends

* [Generative/Adaptive UI](https://www.google.com/search?q=Generative%2FAdaptive+UI&oq=beautiful+websites+and+ui&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yCAgCEAAYFhgeMggIAxAAGBYYHjIICAQQABgWGB4yCAgFEAAYFhgeMggIBhAAGBYYHjIICAcQABgWGB4yCAgIEAAYFhgeMg0ICRAAGIYDGIAEGIoF0gEINjI5NmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8&mstk=AUtExfCyDp8qtx-f6T_1XMVdMLPqoNKKB75NMTyO6VorL_E1vfcn2wg6RizcfY53CvaZiQy9IXzxJQpls-QxfXsZgCG8chXBOZOBnaBIWq1v7xjEhkEa9HOLgCQV89zWf4TkLdM-Q2YuxZ5phrfj-PK-gitvGEM_QoTVPdFb7laFPWorUjY&csui=3&ved=2ahUKEwimtbukq6-SAxUEw8kDHW01Hf8QgK4QegQIBxAB): AI-driven layouts that adjust to user expertise.  
* [Immersive 3D/WebGPU](https://www.google.com/search?q=Immersive+3D%2FWebGPU&oq=beautiful+websites+and+ui&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yCAgCEAAYFhgeMggIAxAAGBYYHjIICAQQABgWGB4yCAgFEAAYFhgeMggIBhAAGBYYHjIICAcQABgWGB4yCAgIEAAYFhgeMg0ICRAAGIYDGIAEGIoF0gEINjI5NmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8&mstk=AUtExfCyDp8qtx-f6T_1XMVdMLPqoNKKB75NMTyO6VorL_E1vfcn2wg6RizcfY53CvaZiQy9IXzxJQpls-QxfXsZgCG8chXBOZOBnaBIWq1v7xjEhkEa9HOLgCQV89zWf4TkLdM-Q2YuxZ5phrfj-PK-gitvGEM_QoTVPdFb7laFPWorUjY&csui=3&ved=2ahUKEwimtbukq6-SAxUEw8kDHW01Hf8QgK4QegQIBxAD): High-performance, interactive 3D elements (e.g., *Anderson Mancini*).  
* [Functional Minimalism](https://www.google.com/search?q=Functional+Minimalism&oq=beautiful+websites+and+ui&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yCAgCEAAYFhgeMggIAxAAGBYYHjIICAQQABgWGB4yCAgFEAAYFhgeMggIBhAAGBYYHjIICAcQABgWGB4yCAgIEAAYFhgeMg0ICRAAGIYDGIAEGIoF0gEINjI5NmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8&mstk=AUtExfCyDp8qtx-f6T_1XMVdMLPqoNKKB75NMTyO6VorL_E1vfcn2wg6RizcfY53CvaZiQy9IXzxJQpls-QxfXsZgCG8chXBOZOBnaBIWq1v7xjEhkEa9HOLgCQV89zWf4TkLdM-Q2YuxZ5phrfj-PK-gitvGEM_QoTVPdFb7laFPWorUjY&csui=3&ved=2ahUKEwimtbukq6-SAxUEw8kDHW01Hf8QgK4QegQIBxAF): Clean design focusing on performance and usability. 
