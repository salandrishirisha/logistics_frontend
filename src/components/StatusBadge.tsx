import { CheckCircle, XCircle } from 'lucide-react';

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    ASSIGNED: 'bg-blue-100 text-blue-700',
    DELIVERED: 'bg-green-100 text-green-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
        styles[status] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {status === 'APPROVED' || status === 'DELIVERED' ? (
        <CheckCircle size={14} />
      ) : status === 'REJECTED' ? (
        <XCircle size={14} />
      ) : null}
      {status}
    </span>
  );
}