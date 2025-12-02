import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Search,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Users,
  Shield,
  UserCheck
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    role: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      };

      const res = await api.get('/users', { params });
      setUsers(res.data.users || []);
      setPagination({
        currentPage: Number(res.data.currentPage || 1),
        totalPages: res.data.totalPages || 1,
        totalUsers: res.data.totalUsers || 0
      });
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';

    if (
      !window.confirm(
        `Are you sure you want to ${
          newStatus === 'suspended' ? 'suspend' : 'activate'
        } this user?`
      )
    ) {
      return;
    }

    try {
      await api.put(`/users/${userId}/suspend`, { status: newStatus });
      toast.success(
        `User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`
      );
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Users Management
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              View, filter and manage all users in your platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary-50 px-4 py-1 text-xs font-medium text-primary-700 border border-primary-100">
              <span className="w-2 h-2 rounded-full bg-primary-500 mr-2" />
              {pagination.totalUsers} total users
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Total Users</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                {pagination.totalUsers}
              </p>
            </div>
            <div className="rounded-xl bg-primary-50 p-2">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
          </div>

          <div className="card flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Active Users</p>
              <p className="mt-1 text-xl font-semibold text-emerald-700">
                {activeUsersCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="card flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase text-gray-400">Admins</p>
              <p className="mt-1 text-xl font-semibold text-indigo-700">{adminCount}</p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-2">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or mobile..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  className="input pl-10 text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="input text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                className="input text-sm"
              >
                <option value="">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="subadmin">Sub Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  // Loading skeleton
                  [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100" />
                          <div className="space-y-2">
                            <div className="h-3 w-32 bg-gray-100 rounded" />
                            <div className="h-3 w-20 bg-gray-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 w-32 bg-gray-100 rounded mb-2" />
                        <div className="h-3 w-24 bg-gray-100 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-16 bg-gray-100 rounded-full" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-16 bg-gray-100 rounded-full" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-3 w-16 bg-gray-100 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          No users found
                        </p>
                        <p className="text-xs text-gray-500 max-w-sm">
                          Try adjusting your filters or search term to find
                          specific users.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const firstName = user.firstName || '';
                    const lastName = user.lastName || '';
                    const initials =
                      (firstName.charAt(0) || '?') + (lastName.charAt(0) || '');
                    const displayName =
                      firstName || lastName
                        ? `${firstName} ${lastName}`.trim()
                        : 'Unnamed User';

                    return (
                      <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center">
                                <span className="text-primary-700 text-xs font-semibold">
                                  {initials.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {displayName}
                              </div>
                              <div className="text-[11px] text-gray-400">
                                ID: {user._id?.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.mobile}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full border ${
                              user.role === 'admin'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                : user.role === 'subadmin'
                                ? 'bg-sky-50 text-sky-700 border-sky-100'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full border ${
                              user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                user.status === 'active'
                                  ? 'bg-emerald-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : '-'}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/users/${user._id}`}
                              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition"
                              title="View / Edit"
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </Link>

                            <button
                              onClick={() => handleSuspend(user._id, user.status)}
                              className={`inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-medium border transition ${
                                user.status === 'active'
                                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={user.status === 'active' ? 'Suspend' : 'Activate'}
                            >
                              {user.status === 'active' ? (
                                <Ban size={16} className="mr-1" />
                              ) : (
                                <CheckCircle size={16} className="mr-1" />
                              )}
                              {user.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>

                            <button
                              onClick={() => handleDelete(user._id)}
                              className="inline-flex items-center justify-center rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition"
                              title="Delete"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50/80 border-t border-gray-100 px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-xs md:text-sm text-gray-600">
                Page{' '}
                <span className="font-semibold">{pagination.currentPage}</span> of{' '}
                <span className="font-semibold">{pagination.totalPages}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage - 1,
                    }))
                  }
                  disabled={pagination.currentPage === 1}
                  className="btn btn-secondary text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: prev.currentPage + 1,
                    }))
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="btn btn-secondary text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
