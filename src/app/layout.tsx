import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 100% Sans-Serif
import "./globals.css";
import ContentLayout from '@/components/layout/ContentLayout';
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
          <ContentLayout>
            {children}
          </ContentLayout>
        </GlobalFilterProvider>
      </body>
    </html>
  );
}

