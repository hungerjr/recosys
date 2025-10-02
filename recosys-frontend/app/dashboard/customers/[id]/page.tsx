'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Package, IndianRupee, Truck, CornerDownLeft, Loader2 } from 'lucide-react';
import { customers as mockCustomers, orders as mockOrders, Customer, Order } from '@/lib/data';
// import API from '@/lib/axios'; // Import for your real API calls

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
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return;
      
      setIsLoading(true);
      const useDummyApi = process.env.NEXT_PUBLIC_USE_DUMMY_API === 'true';

      if (!useDummyApi) {
        // --- DUMMY DATA LOGIC ---
        setTimeout(() => {
          const foundCustomer = mockCustomers.find(c => c.id === customerId);
          const foundOrders = mockOrders.filter(o => o.customerId === customerId);
          
          setCustomer(foundCustomer || null);
          setCustomerOrders(foundOrders);
          setIsLoading(false);
        }, 500); // Simulate network delay
      } else {
        /*
        // --- REAL API CALL (Commented Out) ---
        // When you're ready, set USE_DUMMY_API to false and use this block.
        try {
          // You would typically make parallel requests for customer and their orders
          // const customerPromise = API.get(`/customers/${customerId}`);
          // const ordersPromise = API.get(`/orders?customerId=${customerId}`);
          // const [customerResponse, ordersResponse] = await Promise.all([customerPromise, ordersPromise]);
          
          // setCustomer(customerResponse.data);
          // setCustomerOrders(ordersResponse.data);
        } catch (error) {
          console.error("Failed to fetch customer details:", error);
          // Optionally set an error state here to show an error message
        } finally {
          setIsLoading(false);
        }
        */
      }
    };

    fetchData();
  }, [customerId]);

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
  
  const totalOrders = customerOrders.length;
  const totalRevenue = customerOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <Link href="/dashboard/customers" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>
        <div className="mt-2 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              {customer.fname} {customer.lname}
            </h1>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Orders" value={totalOrders} icon={Package} />
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon={IndianRupee} />
        <StatCard title="Delivered Orders" value={customerOrders.filter(o => o.status === 'Delivered').length} icon={Truck} />
        <StatCard title="RTO Orders" value={0} icon={CornerDownLeft} />
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InfoCard title="Customer Contact Details">
                    <p><strong>Name:</strong> {customer.fname} {customer.lname}</p>
                    <p><strong>Phone:</strong> {customer.mobile}</p>
                    <p><strong>Email:</strong> {customer.email}</p>
                </InfoCard>
                <InfoCard title="Delivery Address (default)">
                    <p>{customer.address}</p>
                    <p>{customer.city}, {customer.state}</p>
                    <p><strong>Pincode:</strong> {customer.pincode}</p>
                </InfoCard>
            </div>
        </div>
        <InfoCard title="Other Details">
            <p><strong>Source:</strong> {customer.channel}</p>
            <p><strong>Created Date:</strong> {customer.created_at}</p>
        </InfoCard>
      </div>

      {/* Recent Shipments Table */}
       <div className="rounded-xl border bg-light-card shadow-sm dark:border-slate-800 dark:bg-dark-card">
        <div className="border-b p-4 dark:border-slate-800">
          <h3 className="font-semibold">Recent Shipments</h3>
        </div>
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
                    <tr>
                        <td colSpan={3} className="p-4 text-center text-slate-500">No orders found for this customer.</td>
                    </tr>
                )}
            </tbody>
        </table>
       </div>
    </div>
  );
}