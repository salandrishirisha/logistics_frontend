import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { clientService } from '../../services/clientService';
import toast from 'react-hot-toast';
import { useState } from 'react';

type FormValues = {
  shipmentType: 'IMPORT' | 'EXPORT';
  originCountry: string;
  destinationCountry: string;
  pickupAddress: string;
  deliveryAddress: string;
  itemName: string;
  quantity: number;
  weight: number;
  transportMode: string;
};

export function ClientCreateShipmentPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await clientService.createShipment(user.id, values as any);
      toast.success('Shipment created successfully');
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Create Shipment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <select className="rounded-xl border px-3 py-2" {...register('shipmentType')} defaultValue="IMPORT">
          <option value="IMPORT">IMPORT</option>
          <option value="EXPORT">EXPORT</option>
        </select>
        <input className="rounded-xl border px-3 py-2" placeholder="Origin Country" {...register('originCountry', { required: true })} />
        <input className="rounded-xl border px-3 py-2" placeholder="Destination Country" {...register('destinationCountry', { required: true })} />
        <input className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="Pickup Address" {...register('pickupAddress', { required: true })} />
        <input className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="Delivery Address" {...register('deliveryAddress', { required: true })} />
        <input className="rounded-xl border px-3 py-2" placeholder="Item Name" {...register('itemName', { required: true })} />
        <input type="number" className="rounded-xl border px-3 py-2" placeholder="Quantity" {...register('quantity', { required: true, valueAsNumber: true })} />
        <input type="number" step="0.1" className="rounded-xl border px-3 py-2" placeholder="Weight" {...register('weight', { required: true, valueAsNumber: true })} />
        <input className="rounded-xl border px-3 py-2" placeholder="Transport Mode" {...register('transportMode', { required: true })} />
        <button disabled={loading} className="md:col-span-2 rounded-xl bg-primary-600 py-2 text-white hover:bg-primary-700 disabled:opacity-60">
          {loading ? 'Submitting...' : 'Create Shipment'}
        </button>
      </form>
    </div>
  );
}