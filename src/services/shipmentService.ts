import { api } from '../api/axios';
import { ApiPage } from '../types/common';
import { Shipment } from '../types/shipment';

export const shipmentService = {
  getShipments: async (page = 0, size = 10, keyword = '') => {
    const { data } = await api.get<ApiPage<Shipment>>('/shipments', {
      params: { page, size, keyword },
    });
    return data;
  },
  getById: async (id: number) => (await api.get<Shipment>(`/shipments/${id}`)).data,
  update: async (id: number, payload: Partial<Shipment>) =>
    (await api.put(`/shipments/${id}`, payload)).data,
  remove: async (id: number) => (await api.delete(`/shipments/${id}`)).data,
};