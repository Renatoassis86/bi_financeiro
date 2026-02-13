import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Import Outfit
import "./globals.css";
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cidade Viva Finance",
  description: "Sistema de Gestão Financeira Integrada (ERP + BI)",
};

import { GlobalFilterProvider } from '@/contexts/GlobalFilterContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={outfit.className}>
        <GlobalFilterProvider>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar Area */}
            <div style={{ width: 'var(--sidebar-width)', flexShrink: 0 }}>
              <Sidebar />
            </div>

            {/* Main Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Topbar />
              {/* Content Scrollable */}
              <main style={{
                flex: 1,
                padding: '32px',
                backgroundColor: 'var(--bg-main)',
                overflowY: 'auto',
                marginTop: 'var(--topbar-height)' // Adjusted for fixed topbar
              }}>
                {children}
              </main>
            </div>
          </div>
        </GlobalFilterProvider>
      </body>
    </html>
  );
}
