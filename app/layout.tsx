import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cherrapunjistays.com"),
  title: {
    default: "Hotels in Cherrapunji | Peaceful Nature Resorts & Stays in Sohra",
    template: "%s | CherraStays",
  },
  description:
    "Explore and book verified tranquil resorts, boutique stays, and cozy homestays in Cherrapunji (Sohra), Meghalaya. Direct rates, verified cliff views, and instant WhatsApp support.",
  keywords: [
    "hotels in cherrapunji",
    "cherrapunji hotels",
    "stays in sohra",
    "3 star hotels in cherrapunji",
    "polo orchid resort cherrapunji",
    "peaceful resorts in cherrapunji",
    "hotels near seven sisters falls",
    "hotels near nohkalikai falls",
    "cherrapunji homestays",
  ],
  authors: [{ name: "CherraStays Tourism Desk" }],
  creator: "CherraStays",
  publisher: "CherraStays",
  openGraph: {
    title: "Hotels in Cherrapunji | Peaceful Nature Resorts & Verified Stays",
    description:
      "Find your tranquil stay amidst the misty green hills of Cherrapunji (Sohra). Verified amenities, transparent rates, and direct booking.",
    url: "https://cherrapunjistays.com",
    siteName: "CherraStays",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Cherrapunji Peaceful Hills and Mist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotels in Cherrapunji | Verified Stays & Direct Booking",
    description:
      "Explore peaceful nature resorts and homestays in Cherrapunji (Sohra). Direct booking and instant quotes.",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8faf9] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
