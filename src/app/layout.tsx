import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 100% Sans-Serif
import "./globals.css";
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { GlobalFilterProvider } from '@/contexts/GlobalFilterContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Cidade Viva Finance",
  description: "ERP + BI Inteligente para Gestão Educacional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        <GlobalFilterProvider>
          <div className="app-wrapper">

            {/* 1. Sidebar (Fixed Left) */}
            <div className="sidebar-container">
              <Sidebar />
            </div>

            {/* 2. Main Viewport (Right Column) */}
            <div className="main-viewport">

              {/* 3. Topbar (Header Integration) */}
              <Topbar />

              {/* 4. Scrollable Data Area */}
              <main className="scroll-area custom-scrollbar">
                {children}
              </main>

            </div>

          </div>
        </GlobalFilterProvider>
      </body>
    </html>
  );
}
