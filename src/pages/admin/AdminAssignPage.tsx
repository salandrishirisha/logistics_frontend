import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

type FormValues = { shipmentId: number; employeeId: number };

export function AdminAssignPage() {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = async (v: FormValues) => {
    try {
      await adminService.assign(v.shipmentId, v.employeeId);
      toast.success('Shipment assigned');
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to assign shipment');
    }
  };

  return (
    <div className="max-w-lg rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Assign Shipment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="number" className="w-full rounded-xl border px-3 py-2" placeholder="Shipment ID" {...register('shipmentId', { required: true, valueAsNumber: true })} />
        <input type="number" className="w-full rounded-xl border px-3 py-2" placeholder="Employee ID" {...register('employeeId', { required: true, valueAsNumber: true })} />
        <button className="rounded-xl bg-primary-600 px-4 py-2 text-white">Assign</button>
      </form>
    </div>
  );
}