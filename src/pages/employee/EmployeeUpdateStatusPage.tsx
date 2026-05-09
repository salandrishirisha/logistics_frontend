import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { employeeService } from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';
import type { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';

type FormValues = {
  status: string;
  remarks: string;
};

export function EmployeeUpdateStatusPage() {
  const { user } = useAuth();
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadShipments = async () => {
      try {
        const res = await employeeService.shipments(user.id, 0, 50);
        setShipments(res.content || []);
      } finally {
        setLoading(false);
      }
    };

    loadShipments();
  }, [user?.id]);

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setValue('status', shipment.status);
    setValue('remarks', shipment.employeeRemarks || '');
  };

  const onSubmit = (values: FormValues) => {
    if (!selectedShipment) {
      toast.error('Please select a shipment first');
      return;
    }
    setFormData(values);
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedShipment || !formData) return;

    setUpdating(true);
    try {
      await employeeService.updateStatus(selectedShipment.shipmentId, formData.status, formData.remarks);
      toast.success('Status updated successfully');

      // Update the shipment in the list
      setShipments(prev =>
        prev.map(s =>
          s.shipmentId === selectedShipment.shipmentId
            ? { ...s, status: formData.status as any, employeeRemarks: formData.remarks }
            : s
        )
      );

      setShowConfirmModal(false);
      setSelectedShipment(null);
      setFormData(null);
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Update Shipment Status</h1>
        <p className="mt-1 text-slate-600">Select a shipment and update its status</p>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Assigned Shipments</h2>
        {shipments.length > 0 ? (
          <div className="overflow-x-auto">
            <DataTable
              rows={shipments}
              rowKey={(r) => r.shipmentId}
              columns={[
                { key: 'shipmentId', title: 'ID' },
                { key: 'itemName', title: 'Item' },
                { key: 'quantity', title: 'Qty' },
                { key: 'weight', title: 'Weight (kg)' },
                { key: 'originCountry', title: 'Origin' },
                { key: 'destinationCountry', title: 'Destination' },
                { key: 'transportMode', title: 'Mode' },
                {
                  key: 'client',
                  title: 'Client',
                  render: (r) => r.client?.name || 'N/A',
                },
                {
                  key: 'status',
                  title: 'Status',
                  render: (r) => <StatusBadge status={r.status} />,
                },
                {
                  key: 'actions',
                  title: 'Action',
                  render: (r) => (
                    <button
                      onClick={() => handleSelectShipment(r)}
                      className={`rounded-lg px-3 py-1 text-sm font-medium ${
                        selectedShipment?.shipmentId === r.shipmentId
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {selectedShipment?.shipmentId === r.shipmentId ? 'Selected' : 'Select'}
                    </button>
                  ),
                },
              ]}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
            <p className="text-slate-600">No shipments assigned yet.</p>
          </div>
        )}
      </div>

      {/* Update Form */}
      {selectedShipment && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Update Status for Shipment #{selectedShipment.shipmentId}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register('status', { required: true })}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                <textarea
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add your remarks here..."
                  {...register('remarks', { required: true })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedShipment(null);
                  reset();
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmModal}
        title="Confirm Status Update"
        onClose={() => {
          setShowConfirmModal(false);
          setFormData(null);
        }}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Shipment Details</h3>
            <div className="space-y-1 text-sm text-slate-600">
              <p><span className="font-medium">ID:</span> {selectedShipment?.shipmentId}</p>
              <p><span className="font-medium">Item:</span> {selectedShipment?.itemName}</p>
              <p><span className="font-medium">Client:</span> {selectedShipment?.client?.name}</p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Update Details</h3>
            <div className="space-y-1 text-sm text-slate-600">
              <p><span className="font-medium">New Status:</span> {formData?.status}</p>
              <p><span className="font-medium">Remarks:</span> {formData?.remarks}</p>
            </div>
          </div>

          <p className="text-slate-600">Are you sure you want to update this shipment's status?</p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowConfirmModal(false);
                setFormData(null);
              }}
              className="flex-1 rounded-lg border px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmUpdate}
              disabled={updating}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Confirm Update'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}