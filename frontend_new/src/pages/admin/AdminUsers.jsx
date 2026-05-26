import { useEffect, useState, useCallback } from 'react';
import { Users, UserCheck, UserX, Edit2, Trash2, RefreshCw, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllUsers, updateUserRole, toggleUserStatus, deleteUser } from '../../api/admin.api';
import { registerUser } from '../../api/auth.api';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import { TableSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Avatar from '../../components/ui/Avatar';
import { ROLE_LABELS, ALL_ROLES } from '../../constants/roles';
import { formatDate } from '../../utils/formatters';

const ROLE_OPTIONS = ALL_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }));

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name:'', email:'', password:'Admin@123', role:'faculty', department:'' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsers({ page, limit: 15, search: search || undefined, role: roleFilter || undefined });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async () => {
    setSubmitting(true);
    try {
      await updateUserRole(editUser._id, newRole);
      toast.success('Role updated!');
      setEditUser(null);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleToggle = async (userId, name, isActive) => {
    if (!window.confirm(`${isActive ? 'Deactivate' : 'Activate'} ${name}?`)) return;
    try {
      await toggleUserStatus(userId);
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Permanently delete ${name}? This cannot be undone.`)) return;
    try {
      await deleteUser(userId);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const handleAddUser = async () => {
    setSubmitting(true);
    try {
      await registerUser(newUser);
      toast.success('User created!');
      setAddModal(false);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Manage Users</h2>
          <p className="text-sm text-slate-500 mt-0.5">{pagination.total ?? 0} total users</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..."
              className="input-base pl-8 w-52 text-sm"/>
          </div>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="input-base w-44 text-sm">
            <option value="">All Roles</option>
            {ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
          <button onClick={fetchUsers} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><RefreshCw size={16}/></button>
          <Button icon={Plus} onClick={() => setAddModal(true)} size="sm">Add User</Button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <TableSkeleton rows={8}/> : (
          users.length === 0 ? <EmptyState icon={Users} title="No users found"/> : (
            <table className="table-base">
              <thead><tr><th>User</th><th>Role</th><th>Department</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} size="sm"/>
                        <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td><span className="badge bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300">{ROLE_LABELS[u.role]}</span></td>
                    <td className="text-sm text-slate-500">{u.department || '—'}</td>
                    <td><span className={`badge ${u.isActive ? 'badge-approved' : 'badge-rejected'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="text-xs text-slate-400">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setEditUser(u); setNewRole(u.role); }} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600 transition-colors" title="Edit role">
                          <Edit2 size={13}/>
                        </button>
                        <button onClick={() => handleToggle(u._id, u.name, u.isActive)}
                          className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'hover:bg-rose-50 text-rose-500' : 'hover:bg-emerald-50 text-emerald-500'}`}
                          title={u.isActive ? 'Deactivate' : 'Activate'}>
                          {u.isActive ? <UserX size={13}/> : <UserCheck size={13}/>}
                        </button>
                        <button onClick={() => handleDelete(u._id, u.name)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 transition-colors" title="Delete">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
        <Pagination page={pagination.page} pages={pagination.pages} onPage={setPage}/>
      </div>

      {/* Edit Role Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Change User Role"
        footer={<><Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button><Button loading={submitting} onClick={handleRoleChange}>Save Role</Button></>}>
        {editUser && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">Changing role for <strong>{editUser.name}</strong></p>
            <Select label="New Role" options={ROLE_OPTIONS} value={newRole} onChange={(e) => setNewRole(e.target.value)}/>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New User" size="md"
        footer={<><Button variant="outline" onClick={() => setAddModal(false)}>Cancel</Button><Button loading={submitting} onClick={handleAddUser}>Create User</Button></>}>
        <div className="space-y-3">
          <Input label="Full Name" value={newUser.name} onChange={(e)=>setNewUser({...newUser,name:e.target.value})} placeholder="Dr. John Smith" required/>
          <Input label="Email" type="email" value={newUser.email} onChange={(e)=>setNewUser({...newUser,email:e.target.value})} placeholder="user@college.edu" required/>
          <Input label="Password" type="password" value={newUser.password} onChange={(e)=>setNewUser({...newUser,password:e.target.value})} required/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Role" options={ROLE_OPTIONS} value={newUser.role} onChange={(e)=>setNewUser({...newUser,role:e.target.value})} required/>
            <Input label="Department" value={newUser.department} onChange={(e)=>setNewUser({...newUser,department:e.target.value})} placeholder="Computer Science" required/>
          </div>
        </div>
      </Modal>
    </div>
  );
}
