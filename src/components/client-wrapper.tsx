'use client';

import { ThemeProvider } from 'next-themes';
import Navbar from './navbar';
import Footer from './footer';
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Toaster } from "@/components/ui/sonner";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DotPattern className="h-full w-full" />
      <Navbar />
      {children}
      <Toaster />
      <Footer />
    </ThemeProvider>
  );
}
