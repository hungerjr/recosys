'use client'

     import { Moon, Sun } from 'lucide-react'
     import { useTheme } from 'next-themes'
     import { useEffect, useState } from 'react'

     export function ThemeToggle() {
       const [mounted, setMounted] = useState(false)
       const { theme, setTheme } = useTheme()

       useEffect(() => {
         setMounted(true)
       }, [])

       if (!mounted) {
         return null
       }

       return (
         <button
           onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
           className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 group"
         >
           {theme === 'dark' ? (
             <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-45 transition-transform duration-300" />
           ) : (
             <Moon className="w-5 h-5 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
           )}
         </button>
       )
     }