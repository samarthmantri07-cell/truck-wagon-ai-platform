import '@/styles/globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vantage AI — Industrial Vehicle Detection Platform',
    template: '%s · Vantage AI',
  },
  description:
    'Next Generation AI-powered Truck & Wagon Detection Platform for logistics, railways, and manufacturing facilities.',
  keywords: [
    'AI detection',
    'truck detection',
    'wagon detection',
    'industrial vision',
    'computer vision',
    'logistics AI',
  ],
  authors: [{ name: 'Vantage AI' }],
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
