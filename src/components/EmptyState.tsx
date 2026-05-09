export function EmptyState({
  title = 'No data found',
  description = 'Try changing your filters or add new records.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
