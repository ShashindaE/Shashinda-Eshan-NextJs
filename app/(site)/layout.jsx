import '../globals.css';
import '../shop.css';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

export const metadata = {
  title: 'Shashinda - Creative Visionary',
  description: 'Designer, innovator and digital creative building bold ideas into reality.'
};

export default function SiteLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        {/* Google Tag Manager — loads only when GTM_ID is set */}
        {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
      </head>
      <body>
        {children}

        {/* Vercel Analytics — privacy-friendly, zero-config */}
        <Analytics />

        {/* Google Analytics 4 — loads only when GA_ID is set */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}