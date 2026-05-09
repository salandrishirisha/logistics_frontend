import { api } from '../api/axios';
import type { DashboardStats } from '../types/dashboard';

export const dashboardService = {
  admin: () => api.get<DashboardStats>('/dashboard/admin').then((r) => r.data),
  client: (clientId?: number) => api.get<DashboardStats>(`/dashboard/client/${clientId}`).then((r) => r.data),
  employee: (employeeId?: number) => api.get<DashboardStats>(`/dashboard/employee/${employeeId}`).then((r) => r.data),
};