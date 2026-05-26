import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { resetPassword } from '../../api/auth.api';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ['confirm'] });

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }) => {
    try {
      await resetPassword(token, password);
      setDone(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Token may have expired.');
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password below">
      {done ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mb-4">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Password reset! Redirecting to login…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="New Password" type="password" id="reset-password" placeholder="Min. 6 characters" icon={Lock} error={errors.password?.message} {...register('password')} required />
          <Input label="Confirm Password" type="password" id="reset-confirm" placeholder="Repeat your password" icon={Lock} error={errors.confirm?.message} {...register('confirm')} required />
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting} icon={CheckCircle}>
            Set New Password
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
