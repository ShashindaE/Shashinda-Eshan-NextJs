# Blog Feature Updates

This document summarizes the recent changes and enhancements made to the blog section of the Shashinda Eshan portfolio and CMS.

## 1. Homepage Blog List Redesign
- **Rich Cards:** Transformed the basic text list into visually engaging cards.
- **Thumbnails:** Added 88x60px cover image thumbnails (with a fallback gradient placeholder).
- **Clickable Titles:** Blog post titles are now fully clickable and link directly to the post.
- **Card Elements:** Added formatted dates, excerpts, and an animated "read" arrow CTA.
- **Data Fetching:** Updated the Payload fetch call in `app/(site)/page.jsx` to use `depth: 1` so that cover image data is available for the thumbnails.

## 2. Single Blog Post Page Improvements
- **White Theme:** Removed the original "cream" background color in favor of a clean, crisp white layout to maximize readability.
- **Typography & Layout:** Reorganized the header so the Title and Metadata (date, reading time, excerpt) appear at the very top, before the cover image, providing immediate context to readers.
- **Rich Text Rendering:** Patched the `RichTextRenderer` in `page.jsx` to properly handle and display inline images inserted from the Payload Lexical editor, as well as combined text formatting (e.g., bold + italic).

## 3. Full Site Header on Blog Pages
- **Unified Navigation:** Replaced the minimal "← All Posts" bar with a full site header mirroring the main portfolio.
- **Features:** Includes the brand logo, full navigation links (Home, About, Projects, Work, Blog, Contact), and the phone number CTA.
- **Responsive:** The header is fully responsive; on mobile screens, it intelligently hides the navigation links to keep the view uncluttered while retaining the brand logo.

## 4. Per-Post Cover Image Control
- **New Admin Feature:** Added a `showCoverInArticle` checkbox field to the `Posts` collection in Payload CMS.
- **Functionality:** 
  - **Checked:** The cover image renders visibly at the top of the blog post body.
  - **Unchecked (Default):** The cover image is hidden from the article body itself, but remains active in the `<head>` metadata (OG image) for social sharing previews (e.g., Facebook, LinkedIn, WhatsApp).

## 5. CSS & Build Optimization
- **Font Loading:** Fixed a Turbopack `@import` build error by removing `@import` from `globals.css` and properly loading Google Fonts (`DM Mono` and `Manrope`) via `<link>` tags in `layout.jsx`.
- **Responsive Overhaul:** Added comprehensive media queries across `globals.css` to ensure blog padding, fonts, and the footer layout adapt gracefully to mobile devices.

## 6. Advanced Blog Infrastructure & Taxonomy
- **Categories & Tags:** Added `Categories` and `Tags` collections in Payload. Linked them to the `Posts` collection to allow comprehensive content organization.
- **Featured Posts:** Added a `featured` boolean flag to the `Posts` collection to highlight specific posts.
- **Database Schema Sync:** Manually synchronized the Supabase PostgreSQL database tables (`categories`, `tags`, `posts_rels`, and `posts.featured`) to bypass automatic push errors. Fixed relational mapping in `payload_locked_documents_rels` to ensure a stable admin panel.

## 7. Infrastructure Stability & Slugs
- **Connection Limits:** Transitioned the Supabase connection to transaction pooling mode (port `6543`) in `.env.local` to resolve serverless `EMAXCONNSESSION` limits on Vercel.
- **Slug Normalization:** Wrote and executed scripts to clean up URL-friendly slugs for existing posts, resolving persistent 404 errors and ensuring Vercel ISR cache validity.

## Future To-Do: E-Commerce Integration
To introduce e-commerce capabilities while remaining 100% on the Vercel + Supabase stack, we will use the official Payload E-Commerce template as a structural blueprint:
- **Collections Porting:** Manually port the `Products`, `Orders`, `Carts`, `Transactions`, and `Addresses` collections from the template into our existing repository.
- **Database Adapter:** Adapt the schemas to use the existing `@payloadcms/db-postgres` (Supabase) instead of the template's default MongoDB adapter.
- **Payments:** Integrate `@payloadcms/plugin-stripe` for processing payments.
- **Frontend Integration:** Build the storefront pages natively within the existing Next.js application, keeping the entire platform within a single Vercel project and a single Supabase database.
