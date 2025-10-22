import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/ApiContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
      <body 
        className="bg-white dark:bg-gray-900 transition-colors duration-300" 
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
              {/* Sticky Responsive Navbar */}
              <Navbar />

              {/* Main Content Area */}
              <main className="transition-colors duration-300" suppressHydrationWarning>
                {children}
              </main>

              {/* Responsive Footer */}
              <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}