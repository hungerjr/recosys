export type Order = {
  id: string;
  orderDate: string;
  channel: string;
  customerName: string;
  amount: number;
  payment: 'Prepaid' | 'COD';
  status: 'New' | 'Ready to Ship' | 'Shipped' | 'Delivered';
  awb: string | null;
  parcelImageUrl?: string | null;
};

export const orders: Order[] = [
  {
    id: '406-3472330-6603557',
    orderDate: '14 Jul 2025 | 09:03 AM',
    channel: 'AMAZON_IN',
    customerName: 'Rajendra Prasad',
    amount: 1493.00,
    payment: 'Prepaid',
    status: 'New',
    awb: null,
  },
  {
    id: '406-9328761-5648917',
    orderDate: '14 Jul 2025 | 08:01 AM',
    channel: 'AMAZON_IN',
    customerName: 'Manish K Mishra',
    amount: 969.00,
    payment: 'Prepaid',
    status: 'Ready to Ship',
    awb: '123456789012',
  },
  {
    id: '408-9175143-8187983',
    orderDate: '14 Jul 2025 | 06:03 AM',
    channel: 'AMAZON_IN',
    customerName: 'Rajkumar Pilli',
    amount: 639.00,
    payment: 'Prepaid',
    status: 'Shipped',
    awb: '987654321098',
  },
];