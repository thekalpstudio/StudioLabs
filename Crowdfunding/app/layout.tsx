import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CrowdFund - Support Innovative Projects',
  description: 'A platform for crowdfunding innovative projects and creative ideas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}