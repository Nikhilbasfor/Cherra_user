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
  themeColor: "#090b0e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://resortsincherrapunji.com"),
  title: {
    default: "Resorts in Cherrapunji | Best Hotels & Homestays in Sohra (2026 Direct Rates)",
    template: "%s | CherraStays",
  },
  description:
    "Book verified resorts, cliffside luxury suites, and cozy homestays in Cherrapunji (Sohra), Meghalaya. Direct front-desk tariffs, verified canyon views, and instant WhatsApp booking.",
  keywords: [
    "resorts in cherrapunji",
    "hotels in cherrapunji",
    "best resorts in cherrapunji",
    "cherrapunji hotels",
    "stays in sohra",
    "cherrapunji homestays",
    "luxury resorts in cherrapunji",
    "5 star resorts in cherrapunji",
    "4 star resorts cherrapunji",
    "3 star hotels in cherrapunji",
    "hotels in sohra meghalaya",
    "polo orchid resort cherrapunji",
    "jiva resort cherrapunji",
    "cherrapunjee holiday resort",
    "kutmadan resort cherrapunji",
    "hotels near seven sisters falls",
    "hotels near nohkalikai falls",
    "hotels near double decker living root bridge",
    "resorts in cherrapunji with swimming pool",
    "cherrapunji hotels with waterfall view",
    "budget homestays cherrapunji",
    "cliff view resorts sohra",
    "meghalaya tourism hotels",
  ],
  authors: [{ name: "CherraStays Tourism Desk" }],
  creator: "CherraStays",
  publisher: "CherraStays",
  openGraph: {
    title: "Resorts in Cherrapunji | Best Hotels & Nature Stays in Sohra",
    description:
      "Find verified resorts, cliffside sanctuaries, and cozy homestays across Cherrapunji (Sohra). Direct front-desk rates and instant WhatsApp support.",
    url: "https://resortsincherrapunji.com",
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
    title: "Resorts in Cherrapunji | Verified Stays & Direct Booking",
    description:
      "Explore peaceful nature resorts and homestays in Cherrapunji (Sohra). Direct booking and instant quotes.",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
  alternates: {
    canonical: "https://resortsincherrapunji.com",
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
      <body className="min-h-full flex flex-col bg-[#edf7f2] text-slate-900 selection:bg-amber-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
