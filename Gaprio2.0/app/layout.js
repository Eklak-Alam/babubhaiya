import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import { ApiProvider, AuthProvider } from "@/context/ApiContext";
import DemoNotification from "@/components/Notification";
import SmoothScroll from "@/components/useSmoothScroll";

// Comprehensive SEO Metadata
export const metadata = {
  title: {
    default: "Gaprio | AI-Powered Mediator for Human Gaps",
    template: "%s | Gaprio",
  },
  description:
    "Gaprio harnesses advanced AI to understand, interpret, and bridge communication gaps, fostering clarity, empathy, and genuine human connection.",
  metadataBase: new URL("https://www.gaprio.com"), // Replace with your actual domain
  openGraph: {
    title: "Gaprio | AI-Powered Mediator for Human Gaps",
    description:
      "Fostering clarity, empathy, and genuine human connection with advanced AI.",
    url: "https://www.gaprio.com", // Replace with your actual domain
    siteName: "Gaprio",
    images: [
      {
        url: "/og-image.png", // Create and place an Open Graph image in your /public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaprio | AI-Powered Mediator for Human Gaps",
    description:
      "Fostering clarity, empathy, and genuine human connection with advanced AI.",
    images: ["/og-image.png"], // Must be an absolute URL in production
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
  alternates: {
    canonical: "https://www.gaprio.com", // Replace with your actual domain
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900">
        {" "}
        {/* Set bg here to avoid flashes */}
        <AuthProvider>
          <SmoothScroll>
            {" "}
            {/* Wrap children with the smooth scroll component */}
            <Navbar />
            {children}
            <Footer />
            {/* <DemoNotification /> */}
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
