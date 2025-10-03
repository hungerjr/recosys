'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingCart, Users, Settings } from 'lucide-react'

function NavLink({ href, icon: Icon, title }: { href: string; icon: React.ElementType; title: string; }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={title}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors
        ${isActive
          ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
        }`}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: { isMobileMenuOpen: boolean, setIsMobileMenuOpen: (isOpen: boolean) => void }) {
  return (
    <>
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" 
        />
      )}
      {/* The border-r class has been removed for a cleaner look */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex w-16 flex-col bg-white transition-transform duration-300 ease-in-out dark:bg-slate-950
        md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="/dashboard"
            className="group flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 text-lg font-semibold text-white dark:bg-slate-50 dark:text-slate-900"
          >
            <Package className="h-6 w-6 transition-all group-hover:scale-110" />
            <span className="sr-only">Recosys</span>
          </Link>
          <NavLink href="/dashboard/orders" icon={ShoppingCart} title="Orders" />
          <NavLink href="/dashboard/customers" icon={Users} title="Customers" />
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <NavLink href="/dashboard/settings" icon={Settings} title="Settings" />
        </nav>
      </aside>
    </>
  );
}