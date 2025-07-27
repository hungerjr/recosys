"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { ModernInput } from "@/app/components/ui/modern-input";
import { ModernButton } from "@/app/components/ui/modern-button";
import { GoogleButton } from "@/app/components/ui/google-button";
import API from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // --- 1. Email Validation ---
    // A simple regex to check for a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setErrors({ email: "Email is required" });
      setLoading(false);
      return;
    } else if (!emailRegex.test(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setErrors({ password: "Password is required" });
      setLoading(false);
      return;
    }

    // --- 2. Dummy API Call ---
    // This simulates a network request for frontend development
    // console.log("Simulating login with:", formData);
    // setTimeout(() => {
    //   console.log('Dummy login successful!');
    //   setLoading(false);
    //   router.push('/dashboard');
    // }, 1500);

    // --- 3. Real API Call (Commented Out) ---
    // When you're ready to connect to your backend, you can use this block.
    // Don't forget to make the handleSubmit function 'async'.
    try {
      var base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await API.post(base_url + "/user/login", formData);
      console.log("Login successful:", response.data);
      // TODO: Redirect to dashboard or set auth state
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setErrors({
        api: err.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      {/* Background and Theme Toggle */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-light-background dark:bg-dark-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[20%] translate-y-[20%] rounded-full bg-[rgba(85,81,255,0.4)] opacity-50 blur-[80px]"></div>
      </div>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-light-foreground dark:text-dark-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-light-muted-foreground dark:text-dark-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-black/5 bg-light-card/60 p-8 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-dark-card/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ModernInput
              label="Email Address"
              type="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />

            <ModernInput
              label="Password"
              id="password"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-light-muted-foreground dark:text-dark-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-light-primary focus:ring-light-primary dark:border-slate-700 dark:text-dark-background dark:focus:ring-dark-primary"
                />
                <span className="text-sm text-light-muted-foreground dark:text-dark-muted-foreground">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-light-primary hover:text-light-primary/80 dark:text-dark-muted-foreground dark:hover:text-dark-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <ModernButton
              type="submit"
              loading={loading}
              size="lg"
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign in"}
            </ModernButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-light-card px-2 text-light-muted-foreground dark:bg-dark-card dark:text-dark-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <GoogleButton>Continue with Google</GoogleButton>
          </form>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-light-muted-foreground dark:text-dark-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-light-primary hover:text-light-primary/80 dark:text-dark-primary dark:hover:text-dark-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </main>
  );
}
