'use client'

// React and Next.js imports
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Icon imports
import { Search, UserCircle, PanelLeft } from 'lucide-react'

// Custom component and hook imports
import { ThemeToggle } from '@/app/components/ui/theme-toggle'
import { useAuth } from '@/app/contexts/AuthContext'

// Define the props the component will accept from its parent layout
interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { logout } = useAuth(); // Get logout function from auth context

  // State to manage the profile dropdown visibility
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to detect clicks outside the dropdown

  // Function to generate a clean page title from the URL
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    const title = pathname.split('/').pop()?.replace('-', ' ');
    return title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Dashboard';
  };

  // Effect to handle closing the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6 dark:bg-slate-950 dark:border-slate-800">
      
      {/* Hamburger Menu Button - visible only on smaller screens */}
      <button 
        onClick={onMenuClick}
        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 md:hidden"
      >
        <PanelLeft className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </button>

      {/* Dynamic Page Title - hidden on smaller screens for more space */}
      <h1 className="hidden text-xl font-semibold text-slate-900 dark:text-slate-50 md:block">
        {getPageTitle()}
      </h1>
      
      {/* Right-aligned section with Search, Theme Toggle, and Profile */}
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg border border-slate-200 bg-slate-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:focus:ring-blue-400"
          />
        </div>

        <ThemeToggle />
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 ring-2 ring-transparent ring-offset-2 ring-offset-white transition-all dark:bg-slate-800 dark:ring-offset-slate-950 ui-open:ring-blue-500"
          >
            <UserCircle className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          </button>
          
          <div
            className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-white p-1 shadow-lg transition-all duration-200 ease-out dark:border-slate-800 dark:bg-slate-900
              ${isProfileOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`
            }
          >
            <div className="px-3 py-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Vaidik Jaiswal</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">vaidik@recosys.com</p>
            </div>
            <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
            <Link href="#" className="block w-full rounded-sm px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                My Profile
            </Link>
            <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={logout}
              className="block w-full rounded-sm px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50"
            >
                Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}