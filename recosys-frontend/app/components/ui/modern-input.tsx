import React, { useState } from 'react'
     import { Eye, EyeOff } from 'lucide-react'

     interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
       label: string
       error?: string
       icon?: React.ReactNode
     }

     export const ModernInput: React.FC<ModernInputProps> = ({
       label,
       error,
       icon,
       type = 'text',
       className = '',
       ...props
     }) => {
       const [showPassword, setShowPassword] = useState(false)
       const [isFocused, setIsFocused] = useState(false)
       const [hasValue, setHasValue] = useState(false)

       const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         setHasValue(e.target.value.length > 0)
         if (props.onChange) {
           props.onChange(e)
         }
       }

       const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

       return (
         <div className="relative group">
           <div className="relative">
             <input
               type={inputType}
               className={`
                 peer w-full px-4 py-4 pt-6 text-base bg-white/10 dark:bg-black/10 backdrop-blur-md 
                 border border-white/20 dark:border-white/10 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                 placeholder-transparent transition-all duration-300
                 modern-input
                 ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
                 ${className}
               `}
               placeholder={label}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               onChange={handleInputChange}
               {...props}
             />
             
             {/* Floating label */}
             <label
               className={`
                 absolute left-4 transition-all duration-300 pointer-events-none
                 ${isFocused || hasValue || props.value
                   ? 'top-2 text-xs text-blue-600 dark:text-blue-400'
                   : 'top-4 text-base text-gray-500 dark:text-gray-400'
                 }
               `}
             >
               {label}
             </label>

             {/* Left icon */}
             {icon && (
               <div className="absolute left-4 top-4 text-gray-400 dark:text-gray-500">
                 {icon}
               </div>
             )}

             {/* Password toggle */}
             {type === 'password' && (
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
               >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             )}
           </div>

           {/* Error message */}
           {error && (
             <div className="mt-2 text-sm text-red-500 animate-in slide-in-from-top-1 duration-300">
               {error}
             </div>
           )}

           {/* Animated border */}
           <div className={`
             absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600
             transition-opacity duration-300 -z-10
             ${isFocused ? 'opacity-20' : 'opacity-0'}
           `} />
         </div>
       )
     }