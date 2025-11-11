import { OrderProduct } from "./OrderProduct";
import { Shipment } from "./Shipment";
import { OrderActivity } from "./OrderActivity";
import { AwbData } from "./AwbData";

export interface Order {
  id: number;
  shiprocketId: number;
  customerId: number;
  channelOrderId: string;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentMethod: string;
  statusCode: number;  
  statusMessage: string;
  deliveredDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  products: OrderProduct[];
  shipments: Shipment[];
  activities: OrderActivity[];
  awbData: AwbData;
}
