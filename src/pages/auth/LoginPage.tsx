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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl border p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="w-full border rounded-xl px-3 py-2"
          placeholder="Email"
          {...register('email', { required: 'Email required' })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          type="password"
          className="w-full border rounded-xl px-3 py-2"
          placeholder="Password"
          {...register('password', { required: 'Password required' })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <button
          disabled={loading}
          className="w-full bg-primary-600 text-white rounded-xl py-2 hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="text-sm">
          No account?{' '}
          <Link to="/register" className="text-primary-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}