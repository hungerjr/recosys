'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { SearchProvider } from '@/app/contexts/SearchContext'; // 1. Import the SearchProvider
import Header from "@/app/components/layout/header";
import Sidebar from "@/app/components/layout/sidebar";
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-light-background dark:bg-dark-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return (
      // 2. Wrap the entire layout with the SearchProvider
      <SearchProvider>
        <div className="min-h-screen w-full">
          <Sidebar 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <div className="flex flex-col md:pl-16">
            <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50 dark:bg-slate-900">
              {children}
            </main>
          </div>
        </div>
      </SearchProvider>
    );
  }

  return null;
}