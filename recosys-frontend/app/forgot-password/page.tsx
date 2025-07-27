'use client'

import { useState } from 'react'
import Link from 'next/link'
import { KeyRound, Mail, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/app/components/ui/theme-toggle'
import { ModernInput } from '@/app/components/ui/modern-input'
import { ModernButton } from '@/app/components/ui/modern-button'
import API from '@/lib/axios'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      setError('Email is required')
      return
    } else if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    // // --- Dummy API Call ---
    // console.log("Simulating password reset for:", email);
    // setTimeout(() => {
    //   setLoading(false)
    //   setSent(true)
    // }, 1500)

    // --- Real API Call ---
    try {
      var base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await API.post(base_url+'/user/forgot-password',  email );
      console.log('Password reset link sent:', response.data);
      setLoading(false);
      setSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setLoading(false);
      setError('Failed to send password reset link. Please try again.');
    }
  }

  // This is the view shown after the user successfully submits their email
  if (sent) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
        <div className="absolute top-0 left-0 -z-10 h-full w-full bg-light-background dark:bg-dark-background">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[20%] translate-y-[20%] rounded-full bg-[rgba(85,81,255,0.4)] opacity-50 blur-[80px]"></div>
        </div>
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-light-foreground dark:text-dark-foreground mb-2">
            Check your email
          </h1>
          <p className="text-lg text-light-muted-foreground dark:text-dark-muted-foreground">
            We've sent a password reset link to <br />
            <span className="font-semibold text-light-foreground dark:text-dark-foreground">{email}</span>.
          </p>
          <div className="mt-8">
            <Link href="/login" className="inline-flex items-center font-medium text-light-primary hover:text-light-primary/80 dark:text-dark-primary dark:hover:text-dark-primary/80 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // This is the initial form view
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-light-background dark:bg-dark-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[20%] translate-y-[20%] rounded-full bg-[rgba(85,81,255,0.4)] opacity-50 blur-[80px]"></div>
      </div>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-light-foreground dark:text-dark-foreground mb-2">
            Forgot Password?
          </h1>
          <p className="text-lg text-light-muted-foreground dark:text-dark-muted-foreground">
            Enter your email to get a reset link.
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-light-card/60 p-8 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-dark-card/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ModernInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
            <ModernButton type="submit" loading={loading} size="lg" className="w-full">
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </ModernButton>
          </form>
        </div>

        <div className="mt-8 text-center text-sm">
          <Link
            href="/login"
            className="font-medium text-light-muted-foreground hover:text-light-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}