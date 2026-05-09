import { useEffect, useState } from 'react';
import { employeeService } from '../../services/employeeService';
import type { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { Loader } from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

export function EmployeeShipmentsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    employeeService.shipments(user.id, page, 10)
      .then((res) => {
        setRows(res.content || []);
        setTotalPages(res.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page, user?.id]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Assigned Shipments</h1>
      <DataTable
        rows={rows}
        rowKey={(r) => r.shipmentId}
        columns={[
          { key: 'shipmentId', title: 'ID' },
          { key: 'itemName', title: 'Item' },
          { key: 'transportMode', title: 'Mode' },
          { key: 'shipmentType', title: 'Type' },
          { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}