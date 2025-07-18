'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { ThemeToggle } from '../components/ui/theme-toggle'
import { FloatingElements } from '../components/ui/floating-elements'
import { ModernInput } from '../components/ui/modern-input'
import { ModernButton } from '../components/ui/modern-button'
import { GoogleButton } from '../components/ui/google-button'
import API from '@/lib/axios'


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const newErrors: { [key: string]: string } = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }
    // Simulate API call

    try {
      var base_url = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await API.post(base_url+'/auth/login', formData)
      console.log('Login successful:', response.data)
      // TODO: Redirect to dashboard or set auth state
    } catch (err: any) {
      console.error("Login error:", err)
      setErrors({
        api: err.response?.data?.message || 'Login failed. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked')
    // TODO: integrate OAuth flow
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 animated-gradient opacity-20"></div>

      {/* Floating elements */}
      <FloatingElements />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Sign in to your account
            </p>
          </div>

          {/* Auth card */}
          <div className="glass rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error alert */}
              {errors.api && (
                <div className="text-red-500 text-sm text-center">
                  {errors.api}
                </div>
              )}

              {/* Email input */}
              <ModernInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />

              {/* Password input */}
              <ModernInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
              />

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign in button */}
              <ModernButton type="submit" loading={loading} size="lg" className="w-full">
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </ModernButton>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 dark:bg-black/10 text-gray-500 dark:text-gray-400 rounded-full">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google sign in */}
              <GoogleButton onClick={handleGoogleSignIn}>
                Continue with Google
              </GoogleButton>

              {/* Sign up link */}
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>© ReCoSys. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}