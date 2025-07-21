'use client'

import * as React from 'react';
import Image from 'next/image';
import { PlusCircle, ListFilter, Upload } from 'lucide-react';
import { orders, Order } from '@/lib/data'; // Using the alias to import our mock data

// A small component to handle the image upload state within each table row
function ParcelImageUploader({ order }: { order: Order }) {
  const [imagePreview, setImagePreview] = React.useState<string | null>(order.parcelImageUrl || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // In a real app, you would upload the file here
        console.log(`Uploading ${file.name} for order ${order.id}`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt={`Parcel for ${order.id}`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-md object-cover"
        />
      ) : (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Orders</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-800">
            <ListFilter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
            <PlusCircle className="h-4 w-4" />
            Add Order
          </button>
        </div>
      </div>

      {/* Main Content: Orders Table */}
      <div className="rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Order Details</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">AWB Number</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-center font-medium text-slate-600 dark:text-slate-400">Parcel Image</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-4 align-top">
                    <div className="font-medium text-blue-600 hover:underline cursor-pointer">{order.id}</div>
                    <div className="text-slate-500">{order.orderDate}</div>
                  </td>
                  <td className="p-4 align-top font-medium">{order.customerName}</td>
                  <td className="p-4 align-top">
                    <div>₹{order.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">{order.payment}</div>
                  </td>
                  <td className="p-4 align-top text-slate-500">{order.awb || 'Not Assigned'}</td>
                  <td className="p-4 align-top">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <ParcelImageUploader order={order} />
                  </td>
                  <td className="p-4 align-top text-right">
                    <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
                      Ship Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}