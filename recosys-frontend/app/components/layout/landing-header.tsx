'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { ThemeToggle } from '@/app/components/ui/theme-toggle' 

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-light-card/30 backdrop-blur-lg dark:border-white/10 dark:bg-dark-card/30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-7 w-7" />
          <span className="text-xl font-bold">Recosys</span>
        </Link>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden text-sm font-medium text-light-muted-foreground hover:text-light-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground transition-colors sm:block">
            Sign In
          </Link>
          <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-md bg-light-primary px-4 text-sm font-medium text-light-primary-foreground shadow transition-colors hover:bg-light-primary/90 dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary/90">
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  )
}