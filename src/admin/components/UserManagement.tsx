import { useState, useEffect } from 'react';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface NewUser {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: 'admin';
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'admin'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load users');
      }
      
      const data = await response.json();
      const usersArray = data.admins || data;
      setUsers(Array.isArray(usersArray) ? usersArray : []);
      setError(null);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    setFormError('');
    
    // Validation
    if (!newUser.fullName || !newUser.username || !newUser.email || !newUser.password) {
      setFormError('All fields are required');
      return;
    }
    
    if (newUser.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setShowAddModal(false);
      setNewUser({
        username: '',
        email: '',
        fullName: '',
        password: '',
        role: 'admin'
      });
      loadUsers();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this admin user? This action cannot be undone.')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        
        .add-admin-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .add-admin-button:hover { transform: translateY(-2px); background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.4), 0 2px 4px -1px rgba(220, 38, 38, 0.3); }
        
        .edit-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .edit-button:hover { transform: translateY(-2px); background-color: #DBEAFE !important; color: #3B82F6 !important; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3); }
        
        .delete-button { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .delete-button:hover { transform: translateY(-2px); background-color: #FEE2E2 !important; color: #DC2626 !important; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3); }
        
        .content-fade-in { animation: slideIn 0.5s ease-out; }
        .modal-overlay { animation: fadeIn 0.2s ease-out; backdrop-filter: blur(2px); }
        .modal-content { animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="add-admin-button flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Admin User
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">⚠️ {error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-white border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Admin Users ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <p className="text-lg font-medium">No admin users found</p>
                      <p className="text-sm mt-1">Add your first admin user to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className={`hover:bg-red-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">
                            {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                          </span>
                        </div> */}
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.role === 'super_admin' ? '⭐ Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        {user.isActive ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {user.role !== 'super_admin' ? (
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleToggleActive(user.id, user.isActive)}
                            className="edit-button px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm transition-colors"
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="delete-button px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Protected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">Add New Admin User</h3>
              <p className="text-sm text-red-100 mt-1">Create a new administrator account</p>
            </div>
            
            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">⚠️ {formError}</p>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="johndoe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="john@ctpred.com.ph"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Minimum 8 characters"
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormError('');
                  setNewUser({
                    username: '',
                    email: '',
                    fullName: '',
                    password: '',
                    role: 'admin'
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}