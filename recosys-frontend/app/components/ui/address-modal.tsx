'use client'

import React from 'react';
import { X } from 'lucide-react';
import { Customer } from '@/lib/data';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function AddressModal({ isOpen, onClose, customer }: AddressModalProps) {
  if (!isOpen || !customer) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-lg rounded-xl border bg-light-card p-6 shadow-lg dark:border-slate-800 dark:bg-dark-card"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        
        <h2 className="text-xl font-semibold">Addresses for {customer.fname} {customer.lname}</h2>
        <div className="mt-4 space-y-4">
          {customer.addresses.map((address, index) => (
            <div key={index} className="rounded-md border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {address.tag}
              </span>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                {address.fullAddress}, {address.city}, {address.state} - {address.pincode}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}