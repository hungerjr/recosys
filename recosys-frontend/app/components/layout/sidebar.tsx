'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingCart, Users, Settings } from 'lucide-react'

// A reusable component for our navigation links
function NavLink({ href, icon: Icon, title }: { href: string; icon: React.ElementType; title: string; }) {
  const pathname = usePathname();
  // Check if the current path starts with the link's href
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={title}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors
        ${isActive
          ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900' // Active state style
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50' // Inactive state style
        }`}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-white sm:flex dark:bg-slate-950 dark:border-slate-800">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="group flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 text-lg font-semibold text-white dark:bg-slate-50 dark:text-slate-900"
        >
          <Package className="h-6 w-6 transition-all group-hover:scale-110" />
          <span className="sr-only">Recosys</span>
        </Link>
        
        {/* Navigation Links */}
        <NavLink href="/dashboard/orders" icon={ShoppingCart} title="Orders" />
        <NavLink href="/dashboard/customers" icon={Users} title="Customers" />
      </nav>

      {/* Settings Link at the bottom */}
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <NavLink href="/dashboard/settings" icon={Settings} title="Settings" />
      </nav>
    </aside>
  );
}