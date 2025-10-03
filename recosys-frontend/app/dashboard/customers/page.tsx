"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, ArrowUp, ArrowDown, RefreshCw } from "lucide-react"; // Import RefreshCw icon
import { Customer, customers as mockCustomers } from "@/lib/data";
import { useSearch } from "@/app/contexts/SearchContext";
import API from "@/lib/axios";
import { toast } from "sonner";

type SortConfig = {
  key: "id" | "name" | "phone" | "email";
  direction: "asc" | "desc";
};

type PaginationInfo = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "id", direction: "asc" });
  const { searchQuery, searchBy } = useSearch();

  // --- State for Sync Feature ---
  const [isSyncing, setIsSyncing] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const params = new URLSearchParams();
        params.append("pageNumber", String(currentPage));
        params.append("pageSize", String(pageSize));
        params.append("sortBy", sortConfig.key);
        params.append("sortOrder", sortConfig.direction);

        if (searchQuery) {
          if (searchBy.value === "name") params.append("nameFilter", searchQuery);
          if (searchBy.value === "phone") params.append("phoneFilter", searchQuery);
          if (searchBy.value === "email") params.append("emailFilter", searchQuery);
        }

        const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await API.get(`${base_url}/customers/get-all`, { params });

        const { items, ...paginationData } = response.data;
        setCustomers(items || []);
        setPagination(paginationData);
      } catch (error) {
        toast.error("Failed to fetch customers from the server.");
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // --- Updated: useEffect now also depends on refetchTrigger ---
  }, [searchQuery, searchBy, currentPage, sortConfig, refetchTrigger]);

  const handleSort = (key: SortConfig["key"]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  // --- Handler function for the Sync with ShipRocket button ---
  const handleSync = async () => {
    setIsSyncing(true);
    toast.info("Syncing with ShipRocket has started...");
    
    try {
        const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await API.post(`${base_url}/customers/sync-shiprocket-customers`);
        
        const newCount = response.data?.inserted || 0;
        console.log("New customers added from ShipRocket:", response.data);
        console.log("New customers added from ShipRocket:", response.data.inserted);


        if (newCount > 0) {
            toast.success(`${newCount} new customer${newCount > 1 ? 's' : ''} added from ShipRocket.`);
        } else {
            toast.info("No new customers to add from ShipRocket.");
        }
        
        // Trigger a refetch of the customer list by updating the state
        setCurrentPage(1);

    } catch (error) {
        toast.error("Failed to sync customers with ShipRocket.");
    } finally {
        setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <div className="flex items-center gap-2">
            {/* --- "Sync with ShipRocket" Button --- */}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-70 dark:bg-dark-card dark:border-slate-800 dark:hover:bg-slate-800"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync with ShipRocket
            </button>
            <button className="flex items-center gap-2 rounded-md bg-light-primary px-3 py-2 text-sm font-semibold text-light-primary-foreground hover:bg-light-primary/90 dark:bg-dark-primary dark:text-dark-primary-foreground dark:hover:bg-dark-primary/90">
                <PlusCircle className="h-4 w-4" />
                Add Customer
            </button>
        </div>
      </div>

      <div className="rounded-xl border bg-light-card shadow-sm dark:border-slate-800 dark:bg-dark-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort("name")} className="flex items-center gap-2 font-medium">
                    Name{" "}
                    {sortConfig.key === "name" && (sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort("phone")} className="flex items-center gap-2 font-medium">
                    Phone{" "}
                    {sortConfig.key === "phone" && (sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => handleSort("email")} className="flex items-center gap-2 font-medium">
                    Email{" "}
                    {sortConfig.key === "email" && (sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium">Address</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">Loading customers...</td>
</tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="p-4 align-top font-medium">{customer.fullName}</td>
                    <td className="p-4 align-top">{customer.phone}</td>
                    <td className="p-4 align-top">{customer.email}</td>
                    <td className="p-4 align-top max-w-xs">{customer.defaultAddress ? `${customer.defaultAddress.address}, ${customer.defaultAddress.city}, ${customer.defaultAddress.state}` : "N/A"}</td>
                    <td className="p-4 align-top">
                      <Link href={`/dashboard/customers/${customer.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && pagination && pagination.totalPages > 0  && (
          <div className="flex items-center justify-end gap-4 border-t p-4 dark:border-slate-800">
            <span className="text-sm text-slate-600">
              Page {pagination.pageNumber} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={!pagination.hasPrevious}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!pagination.hasNext}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}