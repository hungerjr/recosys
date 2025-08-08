"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { ModernInput } from "@/app/components/ui/modern-input";
import { ModernButton } from "@/app/components/ui/modern-button";
import { GoogleButton } from "@/app/components/ui/google-button";
import API from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }

    const useDummyApi = process.env.NEXT_PUBLIC_USE_DUMMY_API === "true";

    if (useDummyApi) {
      const MOCK_CORRECT_EMAIL = "vaidikjaiswal@gmail.com";
      const MOCK_CORRECT_PASSWORD = "123";

      setTimeout(() => {
        if (
          formData.email === MOCK_CORRECT_EMAIL &&
          formData.password === MOCK_CORRECT_PASSWORD
        ) {
          toast.success("Login Successful!");
          const fakeToken = "12345abcdef-dummy-token";
          const dummyUser = {
            id: "user-123",
            name: "Vaidik Jaiswal",
            email: formData.email,
          };
          login(fakeToken, dummyUser);
          router.push("/dashboard");
          return;
        } else {
          // Now using toast for the error message
          toast.error("Invalid email or password.");
        }
        setLoading(false);
      }, 1500);
    } else {
      try {
        // 1. Call your backend's login endpoint to get the token
        const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
        const loginResponse = await API.post(base_url + "/User/login", formData);
        const { token } = loginResponse.data;

        if (!token) {
          throw new Error("Token not received from backend");
        }
        
        // 2. Temporarily set the token in localStorage so our axios interceptor can use it
        localStorage.setItem('authToken', token);
        
        // 3. Call the /me endpoint to get the user's details
        //    NOTE: Ensure your backend has a GET endpoint like '/api/User/me'
        const userResponse = await API.get(base_url + '/User/me');
        const user = userResponse.data;

        // 4. Now that we have the token AND user data, complete the login
        toast.success('Login Successful!');
        login(token, user);

      } catch (err: any) {
        // Clear any token that might have been set
        localStorage.removeItem('authToken');
        toast.error(err.response?.data?.message || "Login failed. Please try again.");
        setLoading(false);
      }

    }
  };

  const handleGoogleSignIn = () => {
    /* ... */
  };

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
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-light-foreground dark:text-dark-foreground mb-2">
            Welcome Back
          </h1>
        </div>

        <div className="rounded-2xl border border-black/5 bg-light-card/60 p-8 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-dark-card/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* The old {errors.api} div is no longer needed here */}
            <ModernInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />
            <ModernInput
              label="Password"
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
      </div>
    </main>
  );
}
