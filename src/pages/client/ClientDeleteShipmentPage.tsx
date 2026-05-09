import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clientService } from '../../services/clientService';
import type { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { Loader } from '../../components/Loader';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import toast from 'react-hot-toast';

export function ClientDeleteShipmentPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await clientService.myShipments(user.id, 0, 50);
        setShipments(res.content || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const handleDelete = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedShipment) return;
    setDeleting(true);
    try {
      await clientService.deleteShipment(selectedShipment.shipmentId);
      toast.success('Shipment deleted successfully');
      setModalOpen(false);
      setSelectedShipment(null);
      const res = await clientService.myShipments(user!.id, 0, 50);
      setShipments(res.content || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete shipment');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Delete Shipment</h1>
        <p className="text-sm text-slate-600">Select a shipment to delete from your list.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <DataTable
          rows={shipments}
          rowKey={(r) => r.shipmentId}
          columns={[
            { key: 'shipmentId', title: 'ID' },
            { key: 'itemName', title: 'Item' },
            { key: 'originCountry', title: 'Origin' },
            { key: 'destinationCountry', title: 'Destination' },
            { key: 'status', title: 'Status', render: (r) => <StatusBadge status={r.status} /> },
            {
              key: 'action',
              title: 'Action',
              render: (r) => (
                <button
                  onClick={() => handleDelete(r)}
                  className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              ),
            },
          ]}
        />
      </div>

      <Modal
        open={modalOpen}
        title="Confirm Delete"
        onClose={() => {
          setModalOpen(false);
          setSelectedShipment(null);
        }}
      >
        <div className="space-y-4">
          <p className="text-slate-600">Do you really want to delete shipment #{selectedShipment?.shipmentId}?</p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold">{selectedShipment?.itemName}</p>
            <p className="text-sm text-slate-600">{selectedShipment?.originCountry} → {selectedShipment?.destinationCountry}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setModalOpen(false);
                setSelectedShipment(null);
              }}
              className="flex-1 rounded-xl border px-4 py-2 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Shipment'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
