import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="mt-2 text-slate-600">Page not found.</p>
        <Link to="/login" className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-white">
          Back to Login
        </Link>
      </div>
    </div>
  );
}