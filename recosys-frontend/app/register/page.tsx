'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react'
import { ThemeToggle } from '@/app/components/ui/theme-toggle'
import { ModernInput } from '@/app/components/ui/modern-input'
import { ModernButton } from '@/app/components/ui/modern-button'
// We assume an API instance is configured, e.g., using axios
import API from '@/lib/axios'; 

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // --- UPDATED: Phone number validation now checks for exactly 10 digits ---
    if (!formData.phone) {
        newErrors.phone = 'Phone number is required'
    } else if (formData.phone.length !== 10) {
        newErrors.phone = 'Phone number must be a valid 10-digit number'
    }

    if (!formData.name) newErrors.name = 'Full name is required'
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- UPDATED: This now allows typing more than 10 digits, validation happens on submit ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // This regex ensures only digits can be typed
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, phone: value });
    }
  };

  // --- UPDATED: Function is now 'async' to support a real API call ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    // --- Dummy API Call (for frontend development) ---
    console.log("Simulating registration with:", formData);
    setTimeout(() => {
      console.log('Dummy registration successful!');
      setLoading(false);
      router.push('/login');
    }, 1500);

    // --- Real API Call (Commented Out) ---
    // When you are ready to connect your backend, you can remove the
    // setTimeout block above and uncomment this try...catch block.
    try {
      var base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await API.post(base_url+'/user/register', formData);
      console.log('Registration successful:', response.data);
      setLoading(false);
      router.push('/login');
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      setErrors({ api: "Registration failed. Please try again." });
    }

  }

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
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-light-foreground dark:text-dark-foreground mb-2">
            Create an Account
          </h1>
        </div>

        <div className="rounded-2xl border border-black/5 bg-light-card/60 p-8 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-dark-card/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <ModernInput
              label="Full Name" type="text" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} error={errors.name}
            />
            <ModernInput
              label="Email Address" type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email}
            />
            <ModernInput
              label="Phone Number" type="tel" value={formData.phone}
              onChange={handlePhoneChange} error={errors.phone}
            />
            <ModernInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              icon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-light-muted-foreground dark:text-dark-muted-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <ModernInput
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              icon={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-light-muted-foreground dark:text-dark-muted-foreground">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            
            <div className="pt-2">
              <ModernButton type="submit" loading={loading} size="lg" className="w-full">
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </ModernButton>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-light-muted-foreground dark:text-dark-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-light-primary hover:text-light-primary/80 dark:text-dark-primary dark:hover:text-dark-primary/80 transition-colors">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </main>
  )
}