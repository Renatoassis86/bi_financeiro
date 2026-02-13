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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={outfit.className}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar Area */}
          <div style={{ width: 'var(--sidebar-width)', flexShrink: 0 }}>
            <Sidebar />
          </div>

          {/* Main Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Topbar Placeholder */}
            <div style={{ height: 'var(--topbar-height)' }}>
              {/* Topbar is fixed, so this spacer prevents content overlap if we didn't use padding-top on main. 
                   But Topbar is fixed in its component style. 
               */}
              <Topbar />
            </div>

            {/* Content Scrollable */}
            <main style={{
              flex: 1,
              padding: '32px',
              backgroundColor: 'var(--bg-main)',
              overflowY: 'auto'
            }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
