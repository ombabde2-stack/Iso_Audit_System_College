import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ROLE_LABELS } from '../constants/roles';
import { formatDate } from '../utils/formatters';
import { Mail, Building2, BadgeCheck, Calendar, Phone, Upload, CheckCircle2, User as UserIcon } from 'lucide-react';
import { updateProfile } from '../api/auth.api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth(); // Assuming login updates the context
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    designation: user?.designation || '',
  });

  if (!user) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (signature) data.append('signature', signature);

      const res = await updateProfile(data);
      // Update local auth context if login method supports it or if there's a refresh
      toast.success('Profile and signature updated successfully');
      setEditing(false);
      window.location.reload(); // Quick way to refresh context for now
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { icon: Mail,      label: 'Email',      value: user.email },
    { icon: Building2, label: 'Department', value: user.department || '—' },
    { icon: BadgeCheck,label: 'Role',       value: ROLE_LABELS[user.role] },
    { icon: BadgeCheck,label: 'Designation',value: user.designation || '—', key: 'designation', editable: true },
    { icon: BadgeCheck,label: 'Employee ID',value: user.employeeId || '—' },
    { icon: Phone,     label: 'Phone',      value: user.phone || '—', key: 'phone', editable: true },
    { icon: Calendar,  label: 'Member Since',value: formatDate(user.createdAt) },
  ];

  return (
    <div className="max-w-xl mx-auto animate-slide-up space-y-6 pb-20">
      {/* Profile Header */}
      <div className="card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-slate-200 dark:bg-slate-700" />
        <Avatar name={user.name} size="xl" className="mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-xl relative z-10"/>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white relative z-10">{user.name}</h2>
        <div className="flex items-center justify-center gap-2 mt-2 relative z-10">
          <span className="badge bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
            {ROLE_LABELS[user.role]}
          </span>
          <span className={`badge ${user.isActive ? 'badge-approved' : 'badge-rejected'}`}>
            {user.isActive ? 'Active Status' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Profile Details Form */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white">
              <UserIcon size={18} className="text-brand-600" />
              <h3 className="font-bold">Personal Information</h3>
            </div>
            {!editing ? (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" loading={loading} onClick={handleUpdate}>Save Changes</Button>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            {fields.map((f) => (
              <div key={f.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 border-b border-slate-50 dark:border-slate-900 last:border-0">
                <div className="flex items-center gap-2 w-40 flex-shrink-0">
                  <f.icon size={14} className="text-slate-400"/>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{f.label}</span>
                </div>
                {editing && f.editable ? (
                  <input
                    type="text"
                    value={formData[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="input-base text-sm py-1 h-9"
                  />
                ) : (
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{f.value}</span>
                )}
              </div>
            ))}

            {/* Signature Section */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white mb-4">
                <BadgeCheck size={18} className="text-emerald-600" />
                <h3 className="font-bold">Digital Signature</h3>
              </div>
              
              <div className="space-y-4">
                {user.signatureUrl ? (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Current Verified Signature:</p>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl inline-block shadow-sm">
                      <img src={user.signatureUrl} alt="Signature" className="max-h-16 w-auto grayscale dark:invert" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center bg-slate-50/50 dark:bg-slate-900/20">
                    <p className="text-sm text-slate-500 italic">No digital signature uploaded yet.</p>
                  </div>
                )}

                {editing && (
                  <div className="space-y-3 pt-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Upload New Signature (White background recommended)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSignature(e.target.files?.[0] || null)}
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                      />
                      {signature && <CheckCircle2 size={16} className="text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-400">Supported formats: JPG, PNG. Recommended size: 400x150px</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
