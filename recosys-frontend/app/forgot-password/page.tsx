"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { FloatingElements } from "../components/ui/floating-elements";
import { ModernInput } from "../components/ui/modern-input";
import { ModernButton } from "../components/ui/modern-button";
import API from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    // Simulate API call

    try {
      var base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await API.post(
        base_url + "/auth/forgot-password",
        email
      );
      console.log("Password reset email sent:", response.data);
      setSent(true);
    } catch (err: any) {
      console.error("Error sending password reset email:", err);
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
    // setTimeout(() => {
    //   setLoading(false);
    //   setSent(true);
    //   console.log("Password reset email sent to:", email);
    // }, 2000);
  };

  if (sent) {
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
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Check Your Email
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                We've sent a password reset link to your email
              </p>
            </div>

            {/* Success card */}
            <div className="glass rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-white/10">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Email Sent Successfully
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and follow the instructions to reset
                  your password.
                </p>
                <div className="pt-4">
                  <Link href="/login">
                    <ModernButton size="lg" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </ModernButton>
                  </Link>
                </div>
              </div>
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 animate-pulse-glow">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Enter your email to reset your password
            </p>
          </div>

          {/* Auth card */}
          <div className="glass rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-white/20 dark:border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email input */}
              <ModernInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />

              {/* Reset button */}
              <ModernButton
                type="submit"
                loading={loading}
                size="lg"
                className="w-full"
              >
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </ModernButton>

              {/* Back to sign in */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
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
