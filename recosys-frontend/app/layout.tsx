import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Recosys",
  description: "Modern Control Systems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              richColors // 1. Add this prop to enable automatic styling
              toastOptions={{
                // 2. We only style the main card to match our theme.
                //    `richColors` will handle the success/error colors.
                classNames: {
                  toast:
                    "border border-black/10 bg-light-card text-light-foreground dark:border-slate-800 dark:bg-dark-card dark:text-dark-foreground",
                  closeButton: "border-l border-black/10 dark:border-white/10",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
