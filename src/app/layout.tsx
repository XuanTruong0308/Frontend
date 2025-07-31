"use client";

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Set metadata programmatically
    document.title = "Beauty Studio - Dịch vụ làm đẹp chuyên nghiệp";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Khám phá các dịch vụ làm đẹp chuyên nghiệp tại Beauty Studio",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Khám phá các dịch vụ làm đẹp chuyên nghiệp tại Beauty Studio";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <html lang="vi">
      <body className="antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
