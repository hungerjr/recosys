/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // YOUR CUSTOM THEME
        // Light Mode (White with Blue/Purple Accents)
        'light-background': 'hsl(240 60% 99%)',
        'light-foreground': 'hsl(240 10% 3.9%)',
        'light-card': 'hsl(0 0% 100%)',
        'light-card-foreground': 'hsl(240 10% 3.9%)',
        'light-primary': 'hsl(245 80% 58%)',
        'light-primary-foreground': 'hsl(0 0% 100%)',
        'light-muted-foreground': 'hsl(240 4% 46%)',

        // Dark Mode (Dark Bluish)
        'dark-background': 'hsl(222.2 84% 4.9%)',
        'dark-foreground': 'hsl(210 40% 98%)',
        'dark-card': 'hsl(224 71% 4%)',
        'dark-card-foreground': 'hsl(210 40% 98%)',
        'dark-primary': 'hsl(210 40% 98%)',
        'dark-primary-foreground': 'hsl(222.2 47.4% 11.2%)',
        'dark-muted-foreground': 'hsl(215 20.2% 65.1%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}