import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your ISO Audit account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          id="login-email"
          placeholder="you@college.edu"
          icon={Mail}
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="space-y-1.5">
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Lock size={16} />
            </div>
            <input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`input-base pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting} icon={LogIn}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}
