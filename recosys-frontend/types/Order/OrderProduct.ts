export interface OrderProduct {
  productLineId: number;
  channelOrderProductId: string;
  name: string;
  channelSku: string;
  quantity: number;
  productId: number;
  available: number;
  price: number;
  productCost: number;
  hsn: string;
  discount: number;
  discountIncludingTax: number;
  sellingPrice: number;
  mrp: number;
  taxPercentage: number;
  description: string | null;
}