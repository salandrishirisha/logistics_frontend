import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
        <Menu size={20} />
      </button>
      <div className="font-semibold">Shipment Logistics Management</div>
      <div className="text-sm text-slate-600">{user?.name} ({user?.role})</div>
    </header>
  );
}