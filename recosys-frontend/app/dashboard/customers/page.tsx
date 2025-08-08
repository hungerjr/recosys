'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { customers as mockCustomers, Customer } from '@/lib/data';

export default function CustomersPage() {
  // State to hold the list of customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- This is where you will fetch data from your backend ---
    const fetchData = async () => {
      setIsLoading(true);
      const useDummyApi = process.env.NEXT_PUBLIC_USE_DUMMY_API === 'true';

      if (!useDummyApi) {
        // --- DUMMY DATA LOGIC ---
        // Simulate a network delay
        setTimeout(() => {
          setCustomers(mockCustomers);
          setIsLoading(false);
        }, 1000);
      } else {
        /*
        // --- REAL API CALL (Commented Out) ---
        try {
          // const response = await API.get('/customers');
          // setCustomers(response.data);
        } catch (error) {
          console.error("Failed to fetch customers:", error);
          // Handle error state here
        } finally {
          setIsLoading(false);
        }
        */
      }
    };

    fetchData();
  }, []); // The empty dependency array means this effect runs once on page load

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <button className="flex items-center gap-2 rounded-md bg-light-primary px-3 py-2 text-sm font-semibold text-light-primary-foreground hover:bg-light-primary/90 dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary/90">
          <PlusCircle className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {/* Main Content: Customers Table */}
      <div className="rounded-xl border bg-light-card shadow-sm dark:border-slate-800 dark:bg-dark-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Phone Number</th>
                <th className="px-4 py-3 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Address</th>
                <th className="px-4 py-3 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Channel</th>
                <th className="px-4 py-3 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Additional Addresses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500">Loading customers...</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="p-4 align-top">
                      {/* Name is now a link to the detail page */}
                      <Link href={`/dashboard/customers/${customer.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        {customer.fname} {customer.lname}
                      </Link>
                    </td>
                    <td className="p-4 align-top">{customer.mobile}</td>
                    <td className="p-4 align-top">{customer.email}</td>
                    <td className="p-4 align-top max-w-xs">{customer.address}, {customer.city}, {customer.state} {customer.pincode}</td>
                    <td className="p-4 align-top">{customer.channel}</td>
                    <td className="p-4 align-top text-slate-500">
                      {/* Placeholder for additional addresses */}
                      N/A
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}