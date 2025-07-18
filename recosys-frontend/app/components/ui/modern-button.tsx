import React from 'react'
     import { Loader2 } from 'lucide-react'

     interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
       loading?: boolean
       variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
       size?: 'sm' | 'md' | 'lg'
       children: React.ReactNode
     }

     export const ModernButton: React.FC<ModernButtonProps> = ({
       loading = false,
       variant = 'primary',
       size = 'md',
       children,
       className = '',
       ...props
     }) => {
       const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed morph-button'
       
       const variants = {
         primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
         secondary: 'bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 text-gray-900 dark:text-white',
         outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400',
         ghost: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
       }

       const sizes = {
         sm: 'px-4 py-2 text-sm rounded-lg',
         md: 'px-6 py-3 text-base rounded-xl',
         lg: 'px-8 py-4 text-lg rounded-xl'
       }

       return (
         <button
           className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
           disabled={loading}
           {...props}
         >
           {loading && (
             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
           )}
           {children}
         </button>
       )
     }