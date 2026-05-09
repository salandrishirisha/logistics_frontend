export function Loader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3 text-slate-600">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}