import { useForm } from 'react-hook-form';
import type { RegisterRequest } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

export function RegisterPage() {
  const { register: reg, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: RegisterRequest) => {
    try {
      setLoading(true);
      await register(values);
      toast.success('Registered successfully');
      navigate('/login');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white rounded-2xl border p-6 space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>
        <input className="w-full border rounded-xl px-3 py-2" placeholder="Name" {...reg('name', { required: 'Name required' })} />
        <input className="w-full border rounded-xl px-3 py-2" placeholder="Email" {...reg('email', { required: 'Email required' })} />
        <input type="password" className="w-full border rounded-xl px-3 py-2" placeholder="Password" {...reg('password', { required: 'Password required' })} />
        <select className="w-full border rounded-xl px-3 py-2" {...reg('role', { required: 'Role required' })}>
          <option value="">Select role</option>
          <option value="CLIENT">CLIENT</option>
          <option value="EMPLOYEE">EMPLOYEE</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        {Object.values(errors)[0] && <p className="text-red-500 text-sm">All fields are required</p>}
        <button disabled={loading} className="w-full bg-primary-600 text-white rounded-xl py-2 hover:bg-primary-700 disabled:opacity-60">
          {loading ? 'Submitting...' : 'Register'}
        </button>
        <p className="text-sm">Already registered? <Link to="/login" className="text-primary-600">Login</Link></p>
      </form>
    </div>
  );
}