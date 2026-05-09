export type ShipmentStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'ASSIGNED'
  | 'DELIVERED';

export interface Shipment {
  shipmentId: number;
  shipmentType: 'IMPORT' | 'EXPORT';
  originCountry: string;
  destinationCountry: string;
  pickupAddress: string;
  deliveryAddress: string;
  itemName: string;
  quantity: number;
  weight: number;
  transportMode: string;
  status: ShipmentStatus;
  createdDate: string;
  employeeRemarks?: string;
    clientName?: string;

  client?: {
    userId: number;
    name: string;
    email: string;
    role: string;
  };
  assignedEmployee?: {
    userId: number;
    name: string;
    email: string;
    role: string;
  };
  approved?: boolean;
  rejected?: boolean;
}