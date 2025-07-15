"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { FloatingElements } from "../components/ui/floating-elements";
import { ModernInput } from "../components/ui/modern-input";
import { ModernButton } from "../components/ui/modern-button";
import { GoogleButton } from "../components/ui/google-button";
import API from '@/lib/axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "Vaidik",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "7489238311",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "You must accept the terms and conditions";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Simulate API call

    // setTimeout(() => {
    //   setLoading(false);
    //   console.log("Register attempt:", formData);
    // }, 2000);

    try {
      var base_url = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await API.post(base_url+"/auth/register", formData);
      setLoading(false);
      console.log("Registration successful:", response.data);
      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
      setErrors({ api: "Registration failed. Please try again." });
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign up clicked");
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4 animate-pulse-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Join us and start your journey
            </p>
          </div>

          {/* Auth card */}
          <div className="glass rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name input */}
              <ModernInput
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
              />

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
              <div className="space-y-2">
                <ModernInput
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={errors.password}
                />

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength
                              ? passwordStrength <= 2
                                ? "bg-red-500"
                                : passwordStrength <= 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Password strength:{" "}
                      {passwordStrength <= 2
                        ? "Weak"
                        : passwordStrength <= 3
                        ? "Medium"
                        : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password input */}
              <ModernInput
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
              />

              {/* Terms and conditions */}
              <div className="space-y-2">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptTerms: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                )}
              </div>

              {/* Sign up button */}
              <ModernButton
                type="submit"
                loading={loading}
                size="lg"
                className="w-full"
              >
                {loading ? "Creating Account..." : "Create Account"}
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

              {/* Google sign up */}
              <GoogleButton onClick={handleGoogleSignUp}>
                Sign up with Google
              </GoogleButton>

              {/* Sign in link */}
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign in
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
  );
}
