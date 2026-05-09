import { useEffect, useState } from 'react';
import { shipmentService } from '../../services/shipmentService';
import { adminService } from '../../services/adminService';
import type { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { Modal } from '../../components/Modal';
import { Search } from 'lucide-react';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';

type ActionType = 'approve' | 'reject' | null;

export function AdminShipmentsPage() {
  const [rows, setRows] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [executing, setExecuting] = useState(false);

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

  const handleApproveClick = (shipmentId: number) => {
    setSelectedShipmentId(shipmentId);
    setActionType('approve');
    setConfirmModal(true);
  };

  const handleRejectClick = (shipmentId: number) => {
    setSelectedShipmentId(shipmentId);
    setActionType('reject');
    setConfirmModal(true);
  };

  const executeAction = async () => {
    if (!selectedShipmentId || !actionType) return;
    
    setExecuting(true);
    try {
      if (actionType === 'approve') {
        await adminService.approve(selectedShipmentId);
        toast.success('Shipment approved');
      } else {
        await adminService.reject(selectedShipmentId);
        toast.success('Shipment rejected');
      }
      setConfirmModal(false);
      setSelectedShipmentId(null);
      setActionType(null);
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Action failed');
    } finally {
      setExecuting(false);
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
              {
                key: 'client',
                title: 'Client',
                render: (r) => r.clientName || r.client?.name || 'N/A',
              },
              { key: 'transportMode', title: 'Mode' },
              { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              {
                key: 'actions',
                title: 'Actions',
                render: (r) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveClick(r.shipmentId)}
                      className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectClick(r.shipmentId)}
                      className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                ),
              },
            ]}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={confirmModal}
        title={actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        onClose={() => {
          setConfirmModal(false);
          setSelectedShipmentId(null);
          setActionType(null);
        }}
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to {actionType === 'approve' ? 'approve' : 'reject'} shipment #{selectedShipmentId}?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setConfirmModal(false);
                setSelectedShipmentId(null);
                setActionType(null);
              }}
              className="flex-1 rounded-lg border px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={executeAction}
              disabled={executing}
              className={`flex-1 rounded-lg px-4 py-2 text-white ${
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50`}
            >
              {executing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}