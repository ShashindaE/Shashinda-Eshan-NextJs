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
