import { useEffect, useState } from 'react';
import { clientService } from '../../services/clientService';
import  type { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { Pagination } from '../../components/Pagination';
import { StatusBadge } from '../../components/StatusBadge';
import { Loader } from '../../components/Loader';
import { useAuth } from '../../context/AuthContext';

export function ClientShipmentsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    clientService.myShipments(user.id, page, 10)
      .then((res) => {
        setRows(res.content || []);
        setTotalPages(res.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page, user?.id]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">My Shipments</h1>
      <DataTable
        rows={rows}
        rowKey={(r) => r.shipmentId}
        columns={[
          { key: 'shipmentId', title: 'ID' },
          { key: 'itemName', title: 'Item' },
          { key: 'originCountry', title: 'Origin' },
          { key: 'destinationCountry', title: 'Destination' },
          { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}