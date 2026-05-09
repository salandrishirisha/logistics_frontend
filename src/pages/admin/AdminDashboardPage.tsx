import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, Users, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { shipmentService } from '../../services/shipmentService';
import { StatusBadge } from '../../components/StatusBadge';
import type { DashboardStats } from '../../types/dashboard';
import type { Shipment } from '../../types/shipment';
import { Loader } from '../../components/Loader';
import { DataTable } from '../../components/DataTable';
import { EmptyState } from '../../components/EmptyState';


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
    {
      label: 'Total Shipments',
      value: stats.totalShipments ?? 0,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Employees',
      value: stats.employeeCount ?? 0,
      icon: Users,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Clients',
      value: stats.clientCount ?? 0,
      icon: UserPlus,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Approved',
      value: stats.approvedShipments ?? 0,
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Rejected',
      value: stats.rejectedShipments ?? 0,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'Delivered',
      value: stats.deliveredShipments ?? 0,
      icon: LayoutDashboard,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
  ];

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-xl border border-slate-200 ${c.bgColor} p-6 shadow-sm transition-shadow hover:shadow-md`}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-slate-700">{c.label}</p>
              <c.icon size={24} className={c.iconColor} />
            </div>
            <p className="text-4xl font-bold text-slate-900">{c.value}</p>
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