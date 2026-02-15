import { useEffect, useState } from 'react';
import {
  UserPlus,
  Edit,
  Trash2,
  Shield,
  User,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: 'super_admin' | 'admin';
  full_name: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const AdminUserManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'admin' as 'admin' | 'super_admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data.admins);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create admin');
      setSuccess('Admin created successfully!');
      setShowCreateModal(false);
      setFormData({ username: '', email: '', password: '', fullName: '', role: 'admin' });
      fetchAdmins();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdateAdmin = async (admin: Admin) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${admin.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: admin.email, fullName: admin.full_name, role: admin.role, isActive: admin.is_active })
      });
      if (!response.ok) throw new Error('Failed to update admin');
      setSuccess('Admin updated successfully!');
      setEditingAdmin(null);
      fetchAdmins();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete admin');
      setSuccess('Admin deleted successfully!');
      fetchAdmins();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleAdminStatus = async (admin: Admin) => {
    await handleUpdateAdmin({ ...admin, is_active: !admin.is_active });
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage administrator accounts and permissions</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-5 h-5" />Add Admin
        </button>
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-sm text-red-800">{error}</p></div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-sm text-green-800">{success}</p></div>}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center"><User className="h-5 w-5 text-blue-600" /></div><div><div className="text-sm font-medium text-gray-900">{admin.full_name}</div><div className="text-sm text-gray-500">@{admin.username}</div></div></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{admin.email}</div></td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}><Shield className="w-3 h-3" />{admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span></td>
                <td className="px-6 py-4 whitespace-nowrap"><button onClick={() => toggleAdminStatus(admin)} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80" style={{ backgroundColor: admin.is_active ? '#dcfce7' : '#fee2e2', color: admin.is_active ? '#166534' : '#991b1b' }}>{admin.is_active ? <><CheckCircle className="w-3 h-3" />Active</> : <><XCircle className="w-3 h-3" />Inactive</>}</button></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div className="flex items-center justify-end gap-2"><button onClick={() => setEditingAdmin(admin)} className="text-blue-600 hover:text-blue-900 p-1"><Edit className="w-4 h-4" /></button><button onClick={() => handleDeleteAdmin(admin.id)} className="text-red-600 hover:text-red-900 p-1"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Admin</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Username</label><input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter username" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter full name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="admin@ctpred.com.ph" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><input type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Min. 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'super_admin' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option value="admin">Admin</option><option value="super_admin">Super Admin</option></select></div>
              <div className="flex gap-3 mt-6"><button type="button" onClick={() => { setShowCreateModal(false); setFormData({ username: '', email: '', password: '', fullName: '', role: 'admin' }); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Admin</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;