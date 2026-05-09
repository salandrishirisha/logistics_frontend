import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardStats } from '../../types/dashboard';
import { Package, CheckCircle, ClipboardCheck } from 'lucide-react';
import { Loader } from '../../components/Loader';

export function EmployeeDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.employee()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = [
    { label: 'Assigned Shipments', value: stats.assignedShipments ?? 0, icon: Package },
    { label: 'Completed', value: stats.completedShipments ?? 0, icon: CheckCircle },
    { label: 'Pending Verification', value: stats.pendingVerification ?? 0, icon: ClipboardCheck },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Employee Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-slate-500">{c.label}</p>
              <c.icon size={18} className="text-primary-600" />
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}