import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-slate-600">You do not have access to this page.</p>
        <Link to="/login" className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-white">
          Go to Login
        </Link>
      </div>
    </div>
  );
}