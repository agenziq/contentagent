import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgenzIQ Content Studio',
  description: 'AI content agent for social media posts and static image generation.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
