'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Search, Filter, Edit, Trash2, Eye, MoreVertical, UserPlus, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface ClearingAgentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

// Mock data for clearing agent users
const mockUsers: ClearingAgentUser[] = [
  {
    id: 'USR001',
    name: 'John Mwangi',
    email: 'john.mwangi@clearingagent.com',
    phone: '+254 712 345 678',
    role: 'Manager',
    status: 'active',
    lastLogin: '2024-01-20T10:30:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    permissions: ['view_bonds', 'create_bonds', 'approve_bonds', 'manage_users']
  },
  {
    id: 'USR002',
    name: 'Sarah Kimani',
    email: 'sarah.kimani@clearingagent.com',
    phone: '+254 723 456 789',
    role: 'Agent',
    status: 'active',
    lastLogin: '2024-01-19T14:15:00Z',
    createdAt: '2024-01-10T11:30:00Z',
    permissions: ['view_bonds', 'create_bonds']
  },
  {
    id: 'USR003',
    name: 'Michael Ochieng',
    email: 'michael.ochieng@clearingagent.com',
    phone: '+254 734 567 890',
    role: 'Agent',
    status: 'inactive',
    lastLogin: '2024-01-15T16:45:00Z',
    createdAt: '2024-01-05T08:15:00Z',
    permissions: ['view_bonds']
  },
  {
    id: 'USR004',
    name: 'Grace Wanjiku',
    email: 'grace.wanjiku@clearingagent.com',
    phone: '+254 745 678 901',
    role: 'Supervisor',
    status: 'pending',
    lastLogin: 'Never',
    createdAt: '2024-01-18T13:20:00Z',
    permissions: ['view_bonds', 'create_bonds', 'approve_bonds']
  }
];

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ClearingAgentUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Supervisor':
        return 'bg-purple-100 text-purple-800';
      case 'Agent':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleViewUser = (user: ClearingAgentUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingUserId(editingUserId === userId ? null : userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      {/* Main Content */}
      <div className="pt-16 transition-all duration-300 min-h-screen">
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold">Manage Users</h1>
                <p className="text-sm text-gray-500">
                  Manage clearing agent users and their permissions
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="Manager">Manager</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Agent">Agent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewUser(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleEditUser(user.id, e)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {editingUserId === user.id && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(user.id);
                                  setEditingUserId(null);
                                }}
                                className={`px-2 py-1 text-xs rounded ${
                                  user.status === 'active' 
                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                }`}
                                title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUser(user.id);
                                  setEditingUserId(null);
                                }}
                                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                title="Delete User"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Search className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No users found</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No users to display at this time.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-sm text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">User ID</label>
                  <p className="text-sm text-gray-900">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedUser.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Login</label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.lastLogin === 'Never' ? 'Never' : new Date(selectedUser.lastLogin).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created At</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Permissions</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedUser.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  // Edit user logic
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select role</option>
                  <option value="Manager">Manager</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Agent">Agent</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
