export interface Shipment {
  shipmentId: number;
  isdCode: string;
  courier: string;
  courierId: string;
  awb: string;
  weight: number;
  dimensions: string;
  deliveredDate: string | null;
  status: number;
  total: number;
  cost: number;
}