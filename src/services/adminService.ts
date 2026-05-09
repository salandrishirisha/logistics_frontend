import { api } from '../api/axios';

export const adminService = {
  approve: (shipmentId: number) => api.put(`/admin/approve/${shipmentId}`),
  reject: (shipmentId: number) => api.put(`/admin/reject/${shipmentId}`),
  assign: (shipmentId: number, employeeId: number) =>
    api.put('/admin/assign', null, { params: { shipmentId, employeeId } }),
  createEmployee: (payload: { name: string; email: string; password: string }) =>
    api.post('/admin/create-employee', payload),
  createClient: (payload: { name: string; email: string; password: string }) =>
    api.post('/admin/create-client', payload),
  getEmployees: () => api.get('/admin/employees').then((r) => r.data),
  getClients: () => api.get('/admin/clients').then((r) => r.data),
};