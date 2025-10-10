import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/ApiContext";

export const metadata = {
  title: {
    default: "Gaprio",
    template: "%s | Gaprio",
  },
  description:
    "Gaprio harnesses advanced AI to understand, interpret, and bridge communication gaps, fostering clarity, empathy, and genuine human connection.",
  icons: {
    icon: "https://gaprio.vercel.app/logo.png",
  },
};

// This prevents extension-added attributes from causing hydration issues
const suppressHydrationWarning = true;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-gray-900" suppressHydrationWarning>
        <AuthProvider>
            {/* Sticky Responsive Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="" suppressHydrationWarning>
              {children}
            </main>

            {/* Responsive Footer */}
            <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}