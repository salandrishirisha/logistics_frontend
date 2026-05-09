import { useEffect, useState } from 'react';
import { shipmentService } from '../../services/shipmentService';
import { adminService } from '../../services/adminService';
import type { Shipment } from '../../types/shipment';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { Loader } from '../../components/Loader';
import toast from 'react-hot-toast';

type UserRow = { userId: number; name: string; email: string };

export function AdminAssignPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [employees, setEmployees] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [shipmentsRes, employeesRes] = await Promise.all([
          shipmentService.getShipments(0, 100, ''),
          adminService.getEmployees(),
        ]);
        setShipments(shipmentsRes.content || []);
        setEmployees(employeesRes);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAssignClick = (shipmentId: number) => {
    setSelectedShipmentId(shipmentId);
    setSelectedEmployeeId(null);
    setShowEmployeeModal(true);
  };

  const handleEmployeeSelect = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleConfirmAssign = async () => {
    if (!selectedShipmentId || !selectedEmployeeId) return;

    setAssigning(true);
    try {
      await adminService.assign(selectedShipmentId, selectedEmployeeId);
      toast.success('Shipment assigned successfully');
      setShowEmployeeModal(false);
      setSelectedShipmentId(null);
      setSelectedEmployeeId(null);
      // Reload shipments
      const res = await shipmentService.getShipments(0, 100, '');
      setShipments(res.content || []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to assign shipment');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Assign Shipments</h1>
      <DataTable
        rows={shipments}
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
              <button
                onClick={() => handleAssignClick(r.shipmentId)}
                className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                Assign
              </button>
            ),
          },
        ]}
      />

      <Modal
        open={showEmployeeModal}
        title="Select Employee"
        onClose={() => {
          setShowEmployeeModal(false);
          setSelectedShipmentId(null);
          setSelectedEmployeeId(null);
        }}
      >
        <div className="space-y-4">
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {employees.map((emp) => (
              <div
                key={emp.userId}
                onClick={() => handleEmployeeSelect(emp.userId)}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  selectedEmployeeId === emp.userId
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">{emp.name}</div>
                <div className="text-sm text-slate-600">{emp.email}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={() => {
                setShowEmployeeModal(false);
                setSelectedShipmentId(null);
                setSelectedEmployeeId(null);
              }}
              className="flex-1 rounded-lg border px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAssign}
              disabled={!selectedEmployeeId || assigning}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {assigning ? 'Assigning...' : 'Confirm Assign'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}