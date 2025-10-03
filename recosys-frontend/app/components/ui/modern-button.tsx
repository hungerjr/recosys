'use client'

import React from 'react';
import { Loader2 } from 'lucide-react';

type ModernButtonProps = {
  loading?: boolean;
  size?: 'default' | 'lg';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ModernButton({ children, loading, size = 'default', className, type = "button", ...props }: ModernButtonProps) {
  const sizeClasses = size === 'lg' ? 'py-2.5' : 'py-2';
  
  return (
    <button
      type={type} // Explicitly setting the type prop here
      {...props}
      disabled={loading}
      className={`flex w-full items-center justify-center rounded-md bg-light-primary px-3 text-sm font-semibold text-light-primary-foreground shadow-sm transition-all hover:bg-light-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary disabled:opacity-50 dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary/90 ${sizeClasses} ${className}`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}