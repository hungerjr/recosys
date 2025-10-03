'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Package, IndianRupee, Truck, CornerDownLeft, Loader2 } from 'lucide-react';
import { customers as mockCustomers, orders as mockOrders, Customer, Order } from '@/lib/data';
import API from '@/lib/axios';
import { toast } from 'sonner';

function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
    return (
        <div className="rounded-xl border bg-light-card p-4 shadow-sm dark:border-slate-800 dark:bg-dark-card">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="rounded-xl border bg-light-card shadow-sm dark:border-slate-800 dark:bg-dark-card">
            <div className="flex items-center justify-between border-b p-4 dark:border-slate-800">
                <h3 className="font-semibold">{title}</h3>
                <button className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                    <Edit className="h-4 w-4" />
                </button>
            </div>
            <div className="p-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {children}
            </div>
        </div>
    );
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerIdParam = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  // We still keep the state for orders, it will just be an empty array for now
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerIdParam) return;
      
      setIsLoading(true);
      const customerId = parseInt(customerIdParam);
      const useDummyApi = process.env.NEXT_PUBLIC_USE_DUMMY_API === 'true';

      if (useDummyApi) {
        // --- DUMMY DATA LOGIC ---
        setTimeout(() => {
          const foundCustomer = mockCustomers.find(c => c.id === customerId);
          // We'll still find dummy orders to show something in the UI
          const foundOrders = mockOrders.filter(o => o.customerId === customerId);
          
          setCustomer(foundCustomer || null);
          setCustomerOrders(foundOrders);
          setIsLoading(false);
        }, 500);
      } else {
        // --- REAL API CALL ---
        try {
          const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
          
          // We are now ONLY fetching the customer details
          const customerResponse = await API.get(`${base_url}/customers/details/${customerId}`);
          setCustomer(customerResponse.data);

          // --- ORDERS FETCHING (Commented Out) ---
          // const ordersResponse = await API.get(`${base_url}/api/orders?customerId=${customerId}`);
          // setCustomerOrders(ordersResponse.data.items || []);
          
        } catch (error) {
          console.error("Failed to fetch customer details:", error);
          toast.error("Failed to load customer data.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [customerIdParam]);

  if (isLoading) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!customer) {
    return <div className="p-4">Customer not found.</div>;
  }
  
  // These will be 0 until the orders API is connected
  const totalOrders = customerOrders.length;
  const totalRevenue = customerOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard/customers" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>
        <div className="mt-2 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              {customer.fullName}
            </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* These cards will show 0 until the orders API is ready */}
        <StatCard title="Total Orders" value={totalOrders} icon={Package} />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon={IndianRupee} />
        <StatCard title="Delivered Orders" value={customerOrders.filter(o => o.status === 'Delivered').length} icon={Truck} />
        <StatCard title="RTO Orders" value={0} icon={CornerDownLeft} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InfoCard title="Customer Contact Details">
                    <p><strong>Name:</strong> {customer.fullName}</p>
                    <p><strong>Phone:</strong> {customer.phone}</p>
                    <p><strong>Email:</strong> {customer.email}</p>
                </InfoCard>
                <InfoCard title="Delivery Address (default)">
                  {customer.defaultAddress ? (
                    <>
                      <p>{customer.defaultAddress.address}</p>
                      <p>{customer.defaultAddress.city}, {customer.defaultAddress.state}</p>
                      <p><strong>Pincode:</strong> {customer.defaultAddress.pincode}</p>
                      <p><strong>Country:</strong> {customer.defaultAddress.country}</p>
                    </>
                  ) : (
                    <p>No default address on file.</p>
                  )}
                </InfoCard>
            </div>
        </div>
        <InfoCard title="Other Details">
            <p><strong>Created Date:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
        </InfoCard>
      </div>

       {/* --- RECENT SHIPMENTS TABLE (Commented Out) --- */}
       {/* When your orders API is ready, you can uncomment this whole section */}
       {/*
       <div className="rounded-xl border bg-light-card shadow-sm dark:border-slate-800 dark:bg-dark-card">
        <div className="border-b p-4 dark:border-slate-800"><h3 className="font-semibold">Recent Shipments</h3></div>
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b dark:border-slate-800">
                    <th className="p-4 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Order ID</th>
                    <th className="p-4 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Shipped Date</th>
                    <th className="p-4 text-left font-medium text-light-muted-foreground dark:text-dark-muted-foreground">Status</th>
                </tr>
            </thead>
            <tbody>
                {customerOrders.length > 0 ? (
                    customerOrders.map(order => (
                        <tr key={order.id}>
                            <td className="p-4 font-medium text-blue-600 dark:text-blue-400">{order.id}</td>
                            <td className="p-4">{order.shippedDate || 'Not Shipped'}</td>
                            <td className="p-4">{order.status}</td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={3} className="p-4 text-center text-slate-500">No orders found.</td></tr>
                )}
            </tbody>
        </table>
       </div>
       */}
    </div>
  );
}