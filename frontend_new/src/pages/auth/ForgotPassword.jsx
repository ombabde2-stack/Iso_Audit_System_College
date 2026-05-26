import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../api/auth.api';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const schema = z.object({ email: z.string().email('Enter a valid email address') });

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.');
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a reset link">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mb-4">
            <Send size={28} className="text-emerald-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Check your email inbox. The reset link expires in <strong>15 minutes</strong>.
          </p>
          <Link to="/login" className="mt-4 inline-flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email Address" type="email" id="forgot-email" placeholder="you@college.edu" icon={Mail} error={errors.email?.message} {...register('email')} required />
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting} icon={Send}>
            Send Reset Link
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
