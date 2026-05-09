import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { clientService } from '../../services/clientService';
import type { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { Loader } from '../../components/Loader';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
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

export function ClientEditShipmentPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<EditFormValues>();

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

  const handleEdit = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setValue('originCountry', shipment.originCountry);
    setValue('destinationCountry', shipment.destinationCountry);
    setValue('pickupAddress', shipment.pickupAddress);
    setValue('deliveryAddress', shipment.deliveryAddress);
    setValue('itemName', shipment.itemName);
    setValue('quantity', shipment.quantity);
    setValue('weight', shipment.weight);
    setValue('transportMode', shipment.transportMode);
    setModalOpen(true);
  };

  const onSubmit = async (values: EditFormValues) => {
    if (!selectedShipment) return;
    setSaving(true);
    try {
      await clientService.updateShipment(selectedShipment.shipmentId, values);
      toast.success('Shipment updated successfully');
      setModalOpen(false);
      setSelectedShipment(null);
      reset();
      const res = await clientService.myShipments(user!.id, 0, 50);
      setShipments(res.content || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update shipment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Edit Shipment</h1>
        <p className="text-sm text-slate-600">Select a shipment and update its details.</p>
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
                  onClick={() => handleEdit(r)}
                  className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  Edit
                </button>
              ),
            },
          ]}
        />
      </div>

      <Modal
        open={modalOpen}
        title={`Edit Shipment #${selectedShipment?.shipmentId}`}
        onClose={() => {
          setModalOpen(false);
          setSelectedShipment(null);
          reset();
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-xl border px-3 py-2" placeholder="Origin Country" {...register('originCountry', { required: true })} />
            <input className="rounded-xl border px-3 py-2" placeholder="Destination Country" {...register('destinationCountry', { required: true })} />
            <input className="md:col-span-2 rounded-xl border px-3 py-2" placeholder="Pickup Address" {...register('pickupAddress', { required: true })} />
            <input className="md:col-span-2 rounded-xl border px-3 py-2" placeholder="Delivery Address" {...register('deliveryAddress', { required: true })} />
            <input className="rounded-xl border px-3 py-2" placeholder="Item Name" {...register('itemName', { required: true })} />
            <input type="number" className="rounded-xl border px-3 py-2" placeholder="Quantity" {...register('quantity', { required: true, valueAsNumber: true })} />
            <input type="number" step="0.1" className="rounded-xl border px-3 py-2" placeholder="Weight" {...register('weight', { required: true, valueAsNumber: true })} />
            <input className="rounded-xl border px-3 py-2" placeholder="Transport Mode" {...register('transportMode', { required: true })} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setModalOpen(false); setSelectedShipment(null); reset(); }} className="rounded-xl border px-4 py-2 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
