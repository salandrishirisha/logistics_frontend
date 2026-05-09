import { useForm } from 'react-hook-form';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';
import { useState } from 'react';

type FormValues = {
  shipmentId: number;
  status: string;
  remarks: string;
};

export function EmployeeUpdateStatusPage() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await employeeService.updateStatus(values.shipmentId, values.status, values.remarks);
      toast.success('Status updated');
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Update Shipment Status</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="number"
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Shipment ID"
          {...register('shipmentId', { required: true, valueAsNumber: true })}
        />
        <select className="w-full rounded-xl border px-3 py-2" {...register('status', { required: true })}>
          <option value="PENDING">PENDING</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
        <textarea
          className="w-full rounded-xl border px-3 py-2"
          rows={4}
          placeholder="Remarks"
          {...register('remarks', { required: true })}
        />
        <button disabled={loading} className="rounded-xl bg-primary-600 px-4 py-2 text-white disabled:opacity-60">
          {loading ? 'Updating...' : 'Update Status'}
        </button>
      </form>
    </div>
  );
}