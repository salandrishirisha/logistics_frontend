import { useForm } from 'react-hook-form';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

type FormValues = { shipmentId: number };

export function AdminApprovalsPage() {
  const { register, handleSubmit } = useForm<FormValues>();

  const approve = async (v: FormValues) => {
    try {
      await adminService.approve(v.shipmentId);
      toast.success('Shipment approved');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Approve failed');
    }
  };

  const reject = async (v: FormValues) => {
    try {
      await adminService.reject(v.shipmentId);
      toast.success('Shipment rejected');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Reject failed');
    }
  };

  return (
    <div className="max-w-lg rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-xl font-bold">Approvals</h1>
      <form className="space-y-4">
        <input
          type="number"
          className="w-full rounded-xl border px-3 py-2"
          placeholder="Shipment ID"
          {...register('shipmentId', { required: true, valueAsNumber: true })}
        />
        <div className="flex gap-3">
          <button type="button" onClick={handleSubmit(approve)} className="rounded-xl bg-green-600 px-4 py-2 text-white">
            Approve
          </button>
          <button type="button" onClick={handleSubmit(reject)} className="rounded-xl bg-red-600 px-4 py-2 text-white">
            Reject
          </button>
        </div>
      </form>
    </div>
  );
}