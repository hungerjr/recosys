'use client'

import { PlusCircle, DollarSign, Users, ShoppingCart, Package } from 'lucide-react'

// A small, reusable component for our statistic cards
function StatCard({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
      </div>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
    </div>
  );
}

// A simple SVG illustration for a modern feel
function DashboardIllustration() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: 'rgb(59, 130, 246)', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: 'rgb(139, 92, 246)', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <rect x="10" y="10" width="380" height="280" rx="20" ry="20" fill="url(#grad1)" fillOpacity="0.1" stroke="url(#grad1)" strokeOpacity="0.3" strokeWidth="2"/>
            <rect x="40" y="50" width="120" height="20" rx="5" ry="5" fill="url(#grad1)" fillOpacity="0.4"/>
            <rect x="40" y="90" width="320" height="10" rx="5" ry="5" fill="url(#grad1)" fillOpacity="0.2"/>
            <rect x="40" y="110" width="280" height="10" rx="5" ry="5" fill="url(#grad1)" fillOpacity="0.2"/>
            <circle cx="200" cy="180" r="40" fill="url(#grad1)" fillOpacity="0.3"/>
            <circle cx="280" cy="180" r="30" fill="url(#grad1)" fillOpacity="0.5"/>
            <rect x="40" y="240" width="80" height="30" rx="15" ry="15" fill="url(#grad1)" fillOpacity="0.6"/>
        </svg>
    )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header section with Welcome message and a Call to Action */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Welcome Back!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's a summary of your business at a glance.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Order
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        
        {/* Column 1: Statistic Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-3">
          <StatCard title="Total Revenue" value="₹1,45,231" icon={DollarSign} />
          <StatCard title="New Orders" value="+1,234" icon={ShoppingCart} />
          <StatCard title="New Customers" value="+34" icon={Users} />
          <StatCard title="Pending Shipments" value="56" icon={Package} />
        </div>
        
        {/* Column 2: Illustration */}
        <div className="hidden items-center justify-center rounded-xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2 lg:flex">
          <DashboardIllustration />
        </div>

      </div>
    </div>
  )
}