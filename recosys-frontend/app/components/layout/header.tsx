"use client";

import { useState, useEffect, useRef } from "react";
import { Search, UserCircle, PanelLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/app/components/ui/theme-toggle";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSearch, SearchOption } from "@/app/contexts/SearchContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { searchQuery, setSearchQuery, searchBy, setSearchBy } = useSearch();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

   const showSearchBar = pathname.startsWith('/dashboard/orders') || pathname.startsWith('/dashboard/customers');

  const searchOptions: SearchOption[] = pathname.startsWith("/dashboard/customers")
    ? [ { value: "name", label: "Name" }, { value: "phone", label: "Phone" }, { value: "email", label: "Email" } ]
    : [ { value: "orderId", label: "Order ID" }, { value: "awb", label: "AWB" } ];

  useEffect(() => {
    // Reset search when the page changes to avoid irrelevant filters
    setSearchBy(searchOptions[0]);
    setSearchQuery("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, searchRef]);

  // This function now correctly returns a string
  const getPageTitle = (): string => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname.startsWith('/dashboard/orders')) return 'Orders';
    if (pathname.startsWith('/dashboard/customers')) return 'Customers';
    if (pathname.startsWith('/dashboard/settings')) return 'Settings';
    
    const title = pathname.split('/').pop()?.replace('-', ' ');
    return title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Dashboard';
  };

  return (
    // The border color is now more subtle
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 dark:bg-slate-950 dark:border-slate-800">
      <button onClick={onMenuClick} className="md:hidden"> <PanelLeft className="h-6 w-6" /> </button>
      <h1 className="hidden text-xl font-semibold md:block">{getPageTitle()}</h1>
      
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        {showSearchBar && (
          <div className="relative" ref={searchRef}>
            <div className="group flex h-10 items-center rounded-lg border bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:border-slate-800 dark:bg-slate-900">
              <div className="relative h-full">
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="flex h-full items-center gap-1 rounded-l-md border-r px-3 text-sm text-slate-600 transition-colors group-hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:group-hover:bg-slate-800">
                  {searchBy.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isSearchOpen && (
                  <div className="absolute top-11 left-0 z-10 w-40 rounded-md border bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    {searchOptions.map((option) => (
                      <button key={option.value} onClick={() => { setSearchBy(option); setIsSearchOpen(false); }} className="block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="search"
                  placeholder={`Search by ${searchBy.label}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2 pl-9 pr-4 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
        <ThemeToggle />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 ring-2 ring-transparent ring-offset-2 ring-offset-white transition-all dark:bg-slate-800 dark:ring-offset-slate-950 ui-open:ring-blue-500"
          >
            <UserCircle className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          </button>
          <div
            className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md border bg-white p-1 shadow-lg transition-all duration-200 ease-out dark:border-slate-800 dark:bg-slate-900 ${
                isProfileOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
          >
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Vaidik Jaiswal
              </p>
            </div>
            <div className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
            <Link
              href="#"
              className="block w-full rounded-sm px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
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