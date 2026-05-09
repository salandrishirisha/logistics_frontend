import { useEffect, useState } from 'react';
import { shipmentService } from '../../services/shipmentService';
import { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { Search } from 'lucide-react';
import { Loader } from '../../components/Loader';

export function AdminShipmentsPage() {
  const [rows, setRows] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const res = await shipmentService.getShipments(page, 10, keyword);
      setRows(res.content || []);
      setTotalPages(res.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">All Shipments</h1>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search shipments..."
          className="w-full rounded-xl border py-2 pl-9 pr-3"
        />
      </div>

      <button onClick={() => { setPage(0); load(); }} className="rounded-lg bg-primary-600 px-4 py-2 text-white">
        Search
      </button>

      {loading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            rows={rows}
            rowKey={(r) => r.shipmentId}
            columns={[
              { key: 'shipmentId', title: 'ID' },
              { key: 'itemName', title: 'Item' },
              { key: 'clientName', title: 'Client' },
              { key: 'transportMode', title: 'Mode' },
              { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}