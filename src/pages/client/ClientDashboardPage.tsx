import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { clientService } from '../../services/clientService';
import type { DashboardStats } from '../../types/dashboard';
import type { Shipment } from '../../types/shipment';
import { useAuth } from '../../context/AuthContext';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { Loader } from '../../components/Loader';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';

export function ClientDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        const [dashboardRes, shipmentsRes] = await Promise.all([
          dashboardService.client(user.id),
          clientService.myShipments(user.id, 0, 5),
        ]);
        setStats(dashboardRes);
        setShipments(shipmentsRes.content || []);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  if (loading) return <Loader label="Loading dashboard..." />;

  const statCards = [
    {
      label: 'Total Shipments',
      value: stats.totalShipments ?? 0,
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Pending',
      value: stats.pendingShipments ?? 0,
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Approved',
      value: stats.approvedShipments ?? 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Delivered',
      value: stats.deliveredShipments ?? 0,
      icon: Truck,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Client Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your shipment overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border border-slate-200 ${card.bgColor} p-6 shadow-sm transition-shadow hover:shadow-md`}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-slate-700">{card.label}</p>
              <card.icon size={24} className={card.iconColor} />
            </div>
            <p className="text-4xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Shipments Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Shipments</h2>
          <p className="mt-1 text-sm text-slate-600">Your latest shipment activity</p>
        </div>

        {shipments.length > 0 ? (
          <div className="overflow-x-auto">
            <DataTable
              rows={shipments}
              rowKey={(r) => r.shipmentId}
              columns={[
                { key: 'shipmentId', title: 'ID' },
                { key: 'itemName', title: 'Item' },
                { key: 'quantity', title: 'Qty' },
                { key: 'weight', title: 'Weight (kg)' },
                { key: 'originCountry', title: 'Origin' },
                { key: 'destinationCountry', title: 'Destination' },
                { key: 'transportMode', title: 'Mode' },
                {
                  key: 'assignedEmployee',
                  title: 'Assigned To',
                  render: (r) => r.assignedEmployee?.name || 'Not Assigned',
                },
                {
                  key: 'status',
                  title: 'Status',
                  render: (r) => <StatusBadge status={r.status} />,
                },
              ]}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600">No shipments yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}