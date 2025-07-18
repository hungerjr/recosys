"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { ThemeToggle } from "./components/ui/theme-toggle";
import { FloatingElements } from "./components/ui/floating-elements";
import { ModernButton } from "./components/ui/modern-button";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 animated-gradient opacity-20"></div>

      {/* Floating elements */}
      <FloatingElements />

      {/* Theme toggle */}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Hero section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8 animate-pulse-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6">
             ReCoSys
              <br />
              Technologies
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience the future of living spaces with our cutting-edge
              control system. Beautiful, secure, and built for the modern lifestyle.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <ModernButton size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </ModernButton>
              </Link>
              <Link href="/register">
                <ModernButton
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Create Account
                </ModernButton>
              </Link>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-8 text-center backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Optimized for speed and performance with modern living spaces.
                
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-8 text-center backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Robust by design
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-8 text-center backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Beautiful Design
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stunning features.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© ReCoSys. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
