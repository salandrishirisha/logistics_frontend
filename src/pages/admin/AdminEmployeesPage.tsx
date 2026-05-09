import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/DataTable';
import { Loader } from '../../components/Loader';

type UserRow = { userId: number; name: string; email: string };

export function AdminEmployeesPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getEmployees().then(setRows).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Employees</h1>
      <DataTable
        rows={rows}
        rowKey={(r) => r.userId}
        columns={[
          { key: 'userId', title: 'ID' },
          { key: 'name', title: 'Name' },
          { key: 'email', title: 'Email' },
        ]}
      />
    </div>
  );
}