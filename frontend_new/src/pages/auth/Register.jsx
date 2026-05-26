import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building2, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser } from '../../api/auth.api';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { ROLE_LABELS, NON_ADMIN_ROLES } from '../../constants/roles';

const schema = z.object({
  name:       z.string().min(2, 'Name must be at least 2 characters'),
  email:      z.string().email('Enter a valid email'),
  password:   z.string().min(6, 'Password must be at least 6 characters'),
  role:       z.string().min(1, 'Please select a role'),
  department: z.string().min(2, 'Department is required'),
  employeeId: z.string().optional(),
});

const ROLE_OPTIONS = NON_ADMIN_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }));

const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'Chemical Engineering', 'MBA', 'MCA', 'Applied Sciences',
];

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Register for ISO Audit System access">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full Name" type="text" id="reg-name" placeholder="Dr. John Smith" icon={User} error={errors.name?.message} {...register('name')} required />
        <Input label="Email Address" type="email" id="reg-email" placeholder="you@college.edu" icon={Mail} error={errors.email?.message} {...register('email')} required />
        <Input label="Password" type="password" id="reg-password" placeholder="Min. 6 characters" icon={Lock} error={errors.password?.message} {...register('password')} required />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Role" id="reg-role" options={ROLE_OPTIONS} placeholder="Select role" error={errors.role?.message} {...register('role')} required />
          <Select label="Department" id="reg-dept" options={DEPARTMENTS} placeholder="Select dept." error={errors.department?.message} {...register('department')} required />
        </div>

        <Input label="Employee ID" type="text" id="reg-empid" placeholder="EMP001 (optional)" icon={BadgeCheck} error={errors.employeeId?.message} {...register('employeeId')} />

        <Button type="submit" className="w-full mt-2" size="lg" loading={isSubmitting} icon={BadgeCheck}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
        Already registered?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
