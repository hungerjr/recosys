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
              toastOptions={{
                classNames: {
                  toast:
                    "border border-black/10 bg-light-card text-light-foreground dark:border-white/10 dark:bg-dark-card dark:text-dark-foreground",
                  title: "font-semibold",
                  description:
                    "text-light-muted-foreground dark:text-dark-muted-foreground",
                  // Styling for each toast type to match your reference
                  success: "border-l-4 border-green-500",
                  error: "border-l-4 border-red-500",
                  warning: "border-l-4 border-yellow-500",
                  info: "border-l-4 border-blue-500",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
