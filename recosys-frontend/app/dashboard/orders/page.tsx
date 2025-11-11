"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, RefreshCw, Loader2 } from "lucide-react";
import { useSearch } from "@/app/contexts/SearchContext";
import { toast } from "sonner";
import API from "@/lib/axios";
import { formatDateTime } from "@/lib/formatDate";
import PackageDetailsPopover from "@/app/components/PackageDetailsPopover";
import { Order } from "@/types/Order";
import { OrderProduct } from "@/types/Order";

type PaginationInfo = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

type SortConfig = {
  key: "id" | "createdAt" | "status";
  direction: "asc" | "desc";
};

function ParcelImageUploader({ order }: { order: Order }) {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        console.log(`Uploading ${file.name} for order ${order.id}`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt={`Parcel for ${order.id}`}
          width={50}
          height={50}
          className="h-12 w-12 rounded-md object-cover"
        />
      ) : (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Upload className="h-3 w-3" />
            Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "desc",
  });
  const { searchQuery, searchBy } = useSearch();
  const [isSyncing, setIsSyncing] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Smooth overlay fade
  useEffect(() => {
    if (isLoading) {
      setShowOverlay(true);
    } else {
      const timeout = setTimeout(() => setShowOverlay(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("pageNumber", String(currentPage));
        params.append("pageSize", String(itemsPerPage));
        params.append("sortBy", sortConfig.key);
        params.append("sortOrder", sortConfig.direction);

        if (searchQuery) {
          if (searchBy.value === "orderId")
            params.append("channelOrderId", searchQuery);
          if (searchBy.value === "awb") params.append("AWB", searchQuery);
          if (searchBy.value === "statusDescription")
            params.append("statusDescription", searchQuery);
        }

        const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await API.get(`${base_url}/order/get-all`, { params });

        const { items, ...paginationData } = response.data;
        setOrders(items || []);
        setPagination(paginationData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch orders from the server.");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [
    searchQuery,
    searchBy,
    currentPage,
    sortConfig,
    refetchTrigger,
    itemsPerPage,
  ]);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    toast.info("Syncing with ShipRocket has started...");
    try {
      const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await API.post(
        `${base_url}/order/sync-shiprocket-orders`
      );
      const newCount = response.data?.inserted || 0;

      if (newCount > 0) {
        toast.success(
          `${newCount} new order${
            newCount > 1 ? "s" : ""
          } added from ShipRocket.`
        );
      } else {
        toast.info("No new orders to add from ShipRocket.");
      }

      setCurrentPage(1);
    } catch {
      toast.error("Failed to sync orders with ShipRocket.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <div className="flex gap-2">
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Sort by:
            </label>

            <div className="relative inline-block">
              <select
                value={sortConfig.key + "_" + sortConfig.direction}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split("_");
                  setSortConfig({
                    key: key as any,
                    direction: direction as any,
                  });
                  setCurrentPage(1);
                }}
                className="rounded-md border border-gray-300 bg-white pl-3 pr-8 py-1.5 text-sm font-medium text-slate-700 hover:border-gray-400 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white [&::-ms-expand]:hidden"
                style={{
                  WebkitAppearance: "none", // Safari + Chrome
                  MozAppearance: "none", // Firefox
                }}
              >
                <option value="createdAt_asc">Date: Oldest First</option>
                <option value="createdAt_desc">Date: Newest First</option>
                <option value="status_asc">Status: A → Z</option>
                <option value="status_desc">Status: Z → A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Table Section ---------- */}
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

        {/* Scrollable container */}
        <div className="relative h-[calc(100vh-220px)] overflow-auto">
          {/* Fixed min width to allow horizontal scroll */}
          <div className="w-full min-w-[1000px]">
            {/* Header Row */}
            <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr_1.5fr] border-b bg-slate-50 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 rounded-t-xl">
              <div className="px-4 py-3">Order Details</div>
              <div className="px-4 py-3">Customer</div>
              <div className="py-3">Payment</div>
              <div className="py-3">Shipping Details</div>
              <div className="py-3">Status</div>
              <div className="py-3">Action / Parcel Image</div>
            </div>

            {/* Orders List */}
            <div className="flex flex-col gap-2 p-4">
              {orders.map((order, index) => (
                <div
                  key={`${order.id}-${index}`}
                  className="rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 p-4"
                >
                  <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr_1.5fr] items-start gap-4 border-b pb-3 mb-3 text-sm">
                    <div>
                      <div className="font-semibold text-blue-600 hover:underline cursor-pointer">
                        {order.channelOrderId}
                      </div>
                      <div className="text-slate-500">
                        {formatDateTime(order.createdAt)}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-slate-500">
                        {order.customerPhone}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium">
                        ₹{order.total?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.paymentMethod === "cod" ? "COD" : "Prepaid"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm">
                        {order.shipments?.[0]?.courier || "-"}
                      </div>
                      <div className="text-xs text-slate-500">
                        AWB: {order.shipments?.[0]?.awb || "Not Assigned"}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          order.statusCode === 7
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.statusMessage}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <ParcelImageUploader order={order} />
                      <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
                        Ship Now
                      </button>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="items-center">
                    {order.products?.length > 0 && (
                      <PackageDetailsPopover
                        packageNumber={1}
                        deadWeight={order.shipments?.[0]?.weight || 0}
                        volWeight={0.36}
                        dimensions={order.shipments?.[0]?.dimensions || "N/A"}
                        products={order.products.map((p: OrderProduct) => ({
                          name: p.name,
                          sku: p.channelSku,
                          qty: p.quantity,
                        }))}
                      />
                    )}
                  </div>
                </div>
              ))}
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
      </div>
    </div>
  );
}
