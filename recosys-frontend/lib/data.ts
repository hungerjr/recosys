// This defines the structure for a single Address object from your backend
export type Address = {
  id: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

// This is the definitive Customer type, matching your API
export type Customer = {
  id: number;
  fullName: string;
  defaultAddress: Address | null;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

// This is the Order type, updated for consistency
export type Order = {
  id: string;
  customerId: number; // Use number to match Customer.id
  orderDate: string;
  shippedDate: string | null;
  status: 'New' | 'Ready to Ship' | 'Shipped' | 'Delivered' | 'Pending';
  amount: number;
  payment: 'Prepaid' | 'COD';
};

// Sample Customer Data that matches the new structure
export const customers: Customer[] = [
  {
    id: 1,
    fullName: "Nitesh Kumar",
    defaultAddress: {
      id: 1,
      address: "No 31, 9th Cross, 1st Main",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560097",
      country: "India",
      isDefault: true,
    },
    phone: "9876543210",
    email: "nitesh@example.com",
    createdAt: "2023-10-28T10:00:00Z",
    updatedAt: "2023-10-28T10:00:00Z"
  },
  {
    id: 2,
    fullName: "Rajendra Prasad",
    defaultAddress: {
      id: 2,
      address: "Soni Home, Anand Colony, Parvati Path",
      city: "Patna",
      state: "Bihar",
      pincode: "800020",
      country: "India",
      isDefault: true,
    },
    phone: "9876543211",
    email: "rajendra@example.com",
    createdAt: "2024-07-25T11:00:00Z",
    updatedAt: "2024-07-25T11:00:00Z"
  },
];

// Sample Order Data
export const orders: Order[] = [
    {
        id: '404-8312720-4888338',
        customerId: 1,
        orderDate: '28 Oct 2023',
        shippedDate: '29 Oct 2023',
        status: 'Delivered',
        amount: 1250.00,
        payment: 'COD',
    },
    {
        id: '406-3472330-6603557',
        customerId: 2,
        orderDate: '25 Jul 2025',
        shippedDate: '25 Jul 2025',
        status: 'Shipped',
        amount: 1493.00,
        payment: 'Prepaid',
    },
     {
        id: '409-1234567-7890123',
        customerId: 1,
        orderDate: '15 Jan 2024',
        shippedDate: null,
        status: 'Pending',
        amount: 899.00,
        payment: 'Prepaid',
    },
];