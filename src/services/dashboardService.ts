import { api } from '../api/axios';
import { DashboardStats } from '../types/dashboard';

export const dashboardService = {
  admin: () => api.get<DashboardStats>('/dashboard/admin').then((r) => r.data),
  client: () => api.get<DashboardStats>('/dashboard/client').then((r) => r.data),
  employee: () => api.get<DashboardStats>('/dashboard/employee').then((r) => r.data),
};