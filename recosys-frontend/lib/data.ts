// Define the structure for a Customer
export type Customer = {
  id: string;
  fname: string;
  lname: string;
  mobile: string;
  email: string;
  channel: string;
  created_at: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
};

// Define the structure for an Order, with the missing fields re-added
export type Order = {
  id: string;
  customerId: string;
  orderDate: string;
  shippedDate: string | null;
  status: 'New' | 'Ready to Ship' | 'Shipped' | 'Delivered' | 'Pending';
  amount: number;   // <-- Re-added this field
  payment: 'Prepaid' | 'COD'; // <-- Re-added this field
};

// Sample Customer Data
export const customers: Customer[] = [
  {
    id: 'cust_001',
    fname: 'Nitesh',
    lname: 'jairam',
    mobile: 'xxxx-xxxxxx',
    email: '5xj0ivkkegth0zz@marketplace.amazon.in',
    channel: 'Amazon',
    created_at: '28 Oct 2019',
    address: 'No 31, 9th Cross, 1st Main, Amba Bhavani layout, Yeshanka Doddabettahalli',
    pincode: '560097',
    city: 'Bengaluru',
    state: 'Karnataka',
  },
  {
    id: 'cust_002',
    fname: 'Rajendra',
    lname: 'Prasad',
    mobile: 'xxxx-xxxxxx',
    email: 'zftcst3b6h0716p@marketplace.amazon.in',
    channel: 'Amazon',
    created_at: '25 Jul 2025',
    address: 'Soni Home, Anand Colony, Parvati Path, New Chitragupta Nagar',
    pincode: '800020',
    city: 'Patna',
    state: 'Bihar',
  },
];

// Sample Order Data, now with amount and payment details
export const orders: Order[] = [
    {
        id: '404-8312720-4888338',
        customerId: 'cust_001',
        orderDate: '28 Oct 2019',
        shippedDate: null,
        status: 'Pending',
        amount: 1250.00, // <-- Added value
        payment: 'COD',    // <-- Added value
    },
    {
        id: '406-3472330-6603557',
        customerId: 'cust_002',
        orderDate: '25 Jul 2025',
        shippedDate: '25 Jul 2025',
        status: 'Shipped',
        amount: 1493.00, // <-- Added value
        payment: 'Prepaid',// <-- Added value
    },
];