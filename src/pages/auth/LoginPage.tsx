import { useForm } from 'react-hook-form';
import type { LoginRequest } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: LoginRequest) => {
    try {
      setLoading(true);
      await login(values);
      toast.success('Login successful');

      const raw = localStorage.getItem('logistics_user');
      const user = raw ? JSON.parse(raw) : null;
      const role = user?.role;

      if (!role) {
        toast.error('Role not found in login response');
        return;
      }

      navigate(`/${String(role).toLowerCase()}/dashboard`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl border shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-600 mb-6">Sign in to your logistics dashboard</p>

              <input
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Email"
                {...register('email', { required: 'Email required' })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <input
                type="password"
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Password"
                {...register('password', { required: 'Password required' })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

              <button
                disabled={loading}
                className="w-full bg-primary-600 text-white rounded-xl py-3 hover:bg-primary-700 disabled:opacity-60 transition-colors font-medium"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>

              <p className="text-sm text-center text-slate-600">
                No account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Register
                </Link>
              </p>
            </form>
          </div>

          {/* Logistics Image */}
          <div className="hidden md:flex bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-8">
            <div className="text-center">
              <div className="mb-6">
                <svg
                  className="w-32 h-32 mx-auto text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Logistics Management</h2>
              <p className="text-slate-600">Efficient shipment tracking and management system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}