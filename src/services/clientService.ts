import { api } from '../api/axios';
import type { ApiPage } from '../types/common';
import type { Shipment } from '../types/shipment';

export const clientService = {
  createShipment: (clientId: number, payload: Omit<Shipment, 'shipmentId' | 'status' | 'createdDate'>) =>
    api.post('/shipments', payload, { params: { clientId } }),
  myShipments: (clientId: number, page = 0, size = 10) =>
    api.get<ApiPage<Shipment>>('/client/my-shipments', { params: { clientId, page, size } }).then((r) => r.data),
  updateShipment: (shipmentId: number, payload: Partial<Omit<Shipment, 'shipmentId' | 'client' | 'assignedEmployee' | 'createdDate' | 'status'>>) =>
    api.put(`/shipments/${shipmentId}`, payload),
  deleteShipment: (shipmentId: number) => api.delete(`/shipments/${shipmentId}`),
};