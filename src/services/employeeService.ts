import { api } from '../api/axios';
import { ApiPage } from '../types/common';
import { Shipment } from '../types/shipment';

export const employeeService = {
  shipments: (employeeId: number, page = 0, size = 10) =>
    api.get<ApiPage<Shipment>>('/employee/shipments', { params: { employeeId, page, size } }).then((r) => r.data),
  updateStatus: (shipmentId: number, status: string, remarks: string) =>
    api.put('/employee/update-status', null, { params: { shipmentId, status, remarks } }),
};