'use client'

import Link from 'next/link'
import { Package, ArrowRight } from 'lucide-react'
import { ThemeToggle } from './components/ui/theme-toggle'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background aurora effect */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-light-background dark:bg-dark-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[20%] translate-y-[20%] rounded-full bg-[rgba(85,81,255,0.4)] opacity-50 blur-[80px]"></div>
      </div>

      {/* Header */}
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
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 py-24 text-center md:py-32">
          <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl">
            The Future of  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Easy Control</span>
          </h1>
          <p className="max-w-2xl text-lg text-light-muted-foreground dark:text-dark-muted-foreground md:text-xl">
            Recosys provides unparalleled security and intuitive control for your electronics, all from a single, powerful dashboard.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/register" className="group inline-flex h-12 items-center justify-center rounded-full bg-light-primary px-8 text-base font-semibold text-light-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-dark-primary dark:text-dark-primary-foreground">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}