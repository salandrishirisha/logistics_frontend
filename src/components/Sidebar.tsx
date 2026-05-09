import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, Truck, ShieldCheck,
  ClipboardCheck, LogOut, UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Props = { open: boolean; setOpen: (v: boolean) => void };

export function Sidebar({ open, setOpen }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menus = {
    ADMIN: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Shipments', to: '/admin/shipments', icon: Package },
      { label: 'Employees', to: '/admin/employees', icon: Users },
      { label: 'Clients', to: '/admin/clients', icon: UserPlus },
      { label: 'Assign Shipments', to: '/admin/assign', icon: Truck },
      { label: 'Approvals', to: '/admin/approvals', icon: ClipboardCheck },
    ],
    CLIENT: [
      { label: 'Dashboard', to: '/client/dashboard', icon: LayoutDashboard },
      { label: 'My Shipments', to: '/client/shipments', icon: Package },
      { label: 'Create Shipment', to: '/client/create-shipment', icon: Truck },
    ],
    EMPLOYEE: [
      { label: 'Dashboard', to: '/employee/dashboard', icon: LayoutDashboard },
      { label: 'Assigned Shipments', to: '/employee/shipments', icon: Package },
      { label: 'Update Status', to: '/employee/update-status', icon: ShieldCheck },
    ],
  } as const;

  const items = user ? menus[user.role] : [];

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/30 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={() => setOpen(false)} />
      <aside className={`fixed z-40 inset-y-0 left-0 w-64 bg-white border-r transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-4 border-b font-semibold text-primary-700">Logistics Panel</div>
        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const Active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${Active ? 'bg-primary-50 text-primary-700' : 'hover:bg-slate-100'}`}>
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>
    </>
  );
}