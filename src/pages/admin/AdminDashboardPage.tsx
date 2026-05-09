import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, Users, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { shipmentService } from '../../services/shipmentService';
import { DashboardStats } from '../../types/dashboard';
import { Shipment } from '../../types/shipment';
import { Loader } from '../../components/Loader';
import { DataTable } from '../../components/DataTable';
import { EmptyState } from '../../components/EmptyState';
import   { StatusBadge } from '../../components/StatusBadge';


export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [recent, setRecent] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [s, shipments] = await Promise.all([
          dashboardService.admin(),
          shipmentService.getShipments(0, 5, ''),
        ]);
        setStats(s);
        setRecent(shipments.content || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const cards = [
    { label: 'Total Shipments', value: stats.totalShipments ?? 0, icon: Package },
    { label: 'Total Employees', value: stats.totalEmployees ?? 0, icon: Users },
    { label: 'Total Clients', value: stats.totalClients ?? 0, icon: UserPlus },
    { label: 'Approved', value: stats.approvedShipments ?? 0, icon: CheckCircle },
    { label: 'Rejected', value: stats.rejectedShipments ?? 0, icon: XCircle },
    { label: 'Overview', value: 'Admin', icon: LayoutDashboard },
  ];

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-slate-500">{c.label}</p>
              <c.icon size={18} className="text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{c.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Recent Shipments</h2>
        {!recent.length ? (
          <EmptyState />
        ) : (
          <DataTable
            rows={recent}
            rowKey={(r) => r.shipmentId}
            columns={[
              { key: 'shipmentId', title: 'ID' },
              { key: 'itemName', title: 'Item' },
              { key: 'originCountry', title: 'Origin' },
              { key: 'destinationCountry', title: 'Destination' },
              { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
        )}
      </div>
    </div>
  );
}