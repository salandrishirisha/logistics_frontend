import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { clientService } from '../../services/clientService';
import type { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { Pagination } from '../../components/Pagination';
import { StatusBadge } from '../../components/StatusBadge';
import { Loader } from '../../components/Loader';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

type EditFormValues = {
  originCountry: string;
  destinationCountry: string;
  pickupAddress: string;
  deliveryAddress: string;
  itemName: string;
  quantity: number;
  weight: number;
  transportMode: string;
};

export function ClientShipmentsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm<EditFormValues>();

  const loadShipments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await clientService.myShipments(user.id, page, 10);
      setRows(res.content || []);
      setTotalPages(res.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, [page, user?.id]);

  const handleEditClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setValue('originCountry', shipment.originCountry);
    setValue('destinationCountry', shipment.destinationCountry);
    setValue('pickupAddress', shipment.pickupAddress);
    setValue('deliveryAddress', shipment.deliveryAddress);
    setValue('itemName', shipment.itemName);
    setValue('quantity', shipment.quantity);
    setValue('weight', shipment.weight);
    setValue('transportMode', shipment.transportMode);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setDeleteModalOpen(true);
  };

  const onEditSubmit = async (values: EditFormValues) => {
    if (!selectedShipment) return;
    setActionLoading(true);
    try {
      await clientService.updateShipment(selectedShipment.shipmentId, values);
      toast.success('Shipment updated successfully');
      setEditModalOpen(false);
      setSelectedShipment(null);
      reset();
      loadShipments();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update shipment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedShipment) return;
    setActionLoading(true);
    try {
      await clientService.deleteShipment(selectedShipment.shipmentId);
      toast.success('Shipment deleted successfully');
      setDeleteModalOpen(false);
      setSelectedShipment(null);
      loadShipments();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to delete shipment');
    } finally {
      setActionLoading(false);
    }
  };

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
          {
            key: 'actions',
            title: 'Actions',
            render: (r) => (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleEditClick(r)}
                  className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(r)}
                  className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        open={editModalOpen}
        title={`Edit Shipment #${selectedShipment?.shipmentId}`}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedShipment(null);
          reset();
        }}
      >
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-xl border px-3 py-2"
              placeholder="Origin Country"
              {...register('originCountry', { required: true })}
            />
            <input
              className="rounded-xl border px-3 py-2"
              placeholder="Destination Country"
              {...register('destinationCountry', { required: true })}
            />
            <input
              className="md:col-span-2 rounded-xl border px-3 py-2"
              placeholder="Pickup Address"
              {...register('pickupAddress', { required: true })}
            />
            <input
              className="md:col-span-2 rounded-xl border px-3 py-2"
              placeholder="Delivery Address"
              {...register('deliveryAddress', { required: true })}
            />
            <input
              className="rounded-xl border px-3 py-2"
              placeholder="Item Name"
              {...register('itemName', { required: true })}
            />
            <input
              type="number"
              className="rounded-xl border px-3 py-2"
              placeholder="Quantity"
              {...register('quantity', { required: true, valueAsNumber: true })}
            />
            <input
              type="number"
              step="0.1"
              className="rounded-xl border px-3 py-2"
              placeholder="Weight"
              {...register('weight', { required: true, valueAsNumber: true })}
            />
            <input
              className="rounded-xl border px-3 py-2"
              placeholder="Transport Mode"
              {...register('transportMode', { required: true })}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedShipment(null);
                reset();
              }}
              className="rounded-xl border px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteModalOpen}
        title="Confirm Delete"
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedShipment(null);
        }}
      >
        <div className="space-y-4">
          <p className="text-slate-600">Are you sure you want to delete shipment #{selectedShipment?.shipmentId}?</p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold">{selectedShipment?.itemName}</p>
            <p className="text-sm text-slate-600">
              {selectedShipment?.originCountry} → {selectedShipment?.destinationCountry}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedShipment(null);
              }}
              className="flex-1 rounded-xl border px-4 py-2 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={actionLoading}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading ? 'Deleting...' : 'Delete Shipment'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
