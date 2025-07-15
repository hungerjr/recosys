import React from 'react'

     export const FloatingElements = () => {
       return (
         <div className="fixed inset-0 pointer-events-none overflow-hidden">
           {/* Floating geometric shapes */}
           <div className="floating-element">
             <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-pulse"></div>
           </div>
           <div className="floating-element">
             <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-600 rounded-lg rotate-45 animate-pulse"></div>
           </div>
           <div className="floating-element">
             <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse"></div>
           </div>
           <div className="floating-element">
             <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg rotate-12 animate-pulse"></div>
           </div>
           
           {/* Animated particles */}
           {Array.from({ length: 20 }).map((_, i) => (
             <div
               key={i}
               className="particle"
               style={{
                 left: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 4}s`,
                 animationDuration: `${4 + Math.random() * 4}s`,
               }}
             />
           ))}
         </div>
       )
     }