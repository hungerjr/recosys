'use client'

import React from 'react';

type ModernInputProps = {
  label: string;
  error?: string;
  icon?: React.ReactNode; // Prop for the icon
  iconPosition?: 'left' | 'right';
} & React.InputHTMLAttributes<HTMLInputElement>;

export function ModernInput({ label, error, icon, iconPosition = 'right', ...props }: ModernInputProps) {
  const iconPadding = icon ? (iconPosition === 'right' ? 'pr-10' : 'pl-10') : '';

  return (
    <div className="space-y-2">
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-light-muted-foreground dark:text-dark-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          className={`block w-full rounded-md border-0 bg-light-background/50 py-2.5 text-light-foreground shadow-sm ring-1 ring-inset ring-black/10 transition placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-light-primary dark:bg-dark-card/50 dark:text-dark-foreground dark:ring-white/10 dark:focus:ring-dark-primary sm:text-sm ${iconPadding}`}
        />
        {icon && (
          <div className={`absolute inset-y-0 flex items-center ${iconPosition === 'right' ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}