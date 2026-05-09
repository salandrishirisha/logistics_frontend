import { api } from '../api/axios';
import type { ApiPage } from '../types/common';
import type { Shipment } from '../types/shipment';

export const employeeService = {
  shipments: (employeeId: number, page = 0, size = 10) =>
    api.get<ApiPage<Shipment>>('/employee/shipments', { params: { employeeId, page, size } }).then((r) => r.data),
  updateStatus: (shipmentId: number, status: string, remarks: string) =>
    api.put(`/employee/update-status/${shipmentId}`, null, { params: { status, remarks } }),
};