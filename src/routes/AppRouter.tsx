import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminShipmentsPage } from '../pages/admin/AdminShipmentsPage';
import { AdminEmployeesPage } from '../pages/admin/AdminEmployeesPage';
import { AdminClientsPage } from '../pages/admin/AdminClientsPage';
import { AdminAssignPage } from '../pages/admin/AdminAssignPage';
import { AdminApprovalsPage } from '../pages/admin/AdminApprovalsPage';
import { ClientDashboardPage } from '../pages/client/ClientDashboardPage';
import { ClientShipmentsPage } from '../pages/client/ClientShipmentsPage';
import { ClientCreateShipmentPage } from '../pages/client/ClientCreateShipmentPage';
import { EmployeeDashboardPage } from '../pages/employee/EmployeeDashboardPage';
import { EmployeeShipmentsPage } from '../pages/employee/EmployeeShipmentsPage';
import { EmployeeUpdateStatusPage } from '../pages/employee/EmployeeUpdateStatusPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/shipments" element={<AdminShipmentsPage />} />
            <Route path="/admin/employees" element={<AdminEmployeesPage />} />
            <Route path="/admin/clients" element={<AdminClientsPage />} />
            <Route path="/admin/assign" element={<AdminAssignPage />} />
            <Route path="/admin/approvals" element={<AdminApprovalsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['CLIENT']} />}>
            <Route path="/client/dashboard" element={<ClientDashboardPage />} />
            <Route path="/client/shipments" element={<ClientShipmentsPage />} />
            <Route path="/client/create-shipment" element={<ClientCreateShipmentPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['EMPLOYEE']} />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
            <Route path="/employee/shipments" element={<EmployeeShipmentsPage />} />
            <Route path="/employee/update-status" element={<EmployeeUpdateStatusPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}