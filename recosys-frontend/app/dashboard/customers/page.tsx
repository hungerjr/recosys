"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, RefreshCw, Loader2 } from "lucide-react";
import { Customer } from "@/lib/data";
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
  const [showOverlay, setShowOverlay] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "asc",
  });
  const { searchQuery, searchBy } = useSearch();
  const [isSyncing, setIsSyncing] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // 👌 Smooth fade-out for overlay
  useEffect(() => {
    if (isLoading) {
      setShowOverlay(true);
    } else {
      const timeout = setTimeout(() => setShowOverlay(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("pageNumber", String(currentPage));
        params.append("pageSize", String(itemsPerPage));
        params.append("sortBy", sortConfig.key);
        params.append("sortOrder", sortConfig.direction);

        if (searchQuery) {
          if (searchBy.value === "name")
            params.append("nameFilter", searchQuery);
          if (searchBy.value === "phone")
            params.append("phoneFilter", searchQuery);
          if (searchBy.value === "email")
            params.append("emailFilter", searchQuery);
        }

        const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await API.get(`${base_url}/customers/get-all`, {
          params,
        });

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
  }, [
    searchQuery,
    searchBy,
    currentPage,
    sortConfig,
    refetchTrigger,
    itemsPerPage,
  ]);

  const handleSort = (key: SortConfig["key"]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  function formatAddress(
    address: string,
    city?: string,
    state?: string,
    country?: string,
    pincode?: string
  ): string {
    if (!address) return "";
    address = address.split(/<br\s*\/?>/i)[0];
    const extraParts = [city, state, country].filter(Boolean).join(", ");
    const pin = pincode ? ` - ${pincode}` : "";
    return [address, extraParts].filter(Boolean).join(", ") + pin;
  }

  const handleSync = async () => {
    setIsSyncing(true);
    toast.info("Syncing with ShipRocket has started...");
    try {
      const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await API.post(
        `${base_url}/customers/sync-shiprocket-customers`
      );
      const newCount = response.data?.inserted || 0;

      if (newCount > 0) {
        toast.success(
          `${newCount} new customer${
            newCount > 1 ? "s" : ""
          } added from ShipRocket.`
        );
      } else {
        toast.info("No new customers to add from ShipRocket.");
      }

      setCurrentPage(1);
    } catch {
      toast.error("Failed to sync customers with ShipRocket.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <div className="flex items-center gap-2">
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
          <button className="flex items-center gap-2 rounded-md bg-light-primary px-3 py-2 text-sm font-semibold text-white hover:bg-light-primary/90">
            <PlusCircle className="h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <div className="relative rounded-xl border bg-light-card shadow-sm dark:border-slate-800 dark:bg-dark-card">
        {/* Loading Overlay */}
        {showOverlay && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300 ${
              isLoading
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300" />
          </div>
        )}

        <div className="relative h-[calc(100vh-220px)] overflow-auto">
          <table className="w-full text-sm border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-10 border-b bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Address</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td
                    className="p-4 align-top max-w-[180px] truncate whitespace-nowrap"
                    title={c.fullName}
                  >
                    {c.fullName}
                  </td>
                  <td
                    className="p-4 align-top max-w-[140px] truncate whitespace-nowrap"
                    title={c.phone}
                  >
                    {c.phone}
                  </td>
                  <td
                    className="p-4 align-top max-w-[220px] truncate whitespace-nowrap"
                    title={c.email}
                  >
                    {c.email}
                  </td>
                  <td
                    className="p-4 align-top max-w-[300px] whitespace-pre-line overflow-hidden text-ellipsis"
                    title={
                      c.defaultAddress
                        ? formatAddress(
                            c.defaultAddress.address,
                            c.defaultAddress.city,
                            c.defaultAddress.state,
                            c.defaultAddress.country,
                            c.defaultAddress.pincode
                          )
                        : "N/A"
                    }
                  >
                    {c.defaultAddress
                      ? formatAddress(
                          c.defaultAddress.address,
                          c.defaultAddress.city,
                          c.defaultAddress.state,
                          c.defaultAddress.country,
                          c.defaultAddress.pincode
                        )
                      : "N/A"}
                  </td>

                  <td className="p-4 align-top">
                    <Link
                      href={`/dashboard/customers/${c.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ---------- Pagination ---------- */}
        {!isLoading && pagination && pagination.totalPages > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t p-4 dark:border-slate-800">
            <div className="flex items-center gap-4 text-sm">
              <span>Rows per page:</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="appearance-none rounded-md border border-gray-300 bg-white px-2 py-1 pr-8 text-sm leading-tight focus:border-gray-400 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={60}>60</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
          </div>
        )}
      </div>
    </div>
  );
}
