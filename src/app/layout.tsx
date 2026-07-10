import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// This loads the Google Font natively through Next.js without third-party bugs
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ABYSS Development Systems | Unbundled Micro-SaaS Operations",
  description: "Access a continuous catalogue of single-feature utility engines and workflows for $5/mo. Build your custom tech stack, piece by piece.",
  keywords: ["Micro-SaaS", "Business Utilities", "Workflow Automation", "Abyss Systems", "Modular Software"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#4B5563] text-[#F9FAFB] min-h-screen relative overflow-x-hidden`}
      >
        {/* Global Ambient Background Glow adjusted to cut beautifully through the mid-grey base */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#00F2FE]/20 to-transparent blur-3xl pointer-events-none z-0" />
        
        {/* Main Content Render */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}