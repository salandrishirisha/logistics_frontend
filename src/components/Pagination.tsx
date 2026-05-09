type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
      >
        Previous
      </button>
      <p className="text-sm text-slate-600">
        Page <span className="font-semibold">{page + 1}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </p>
      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}