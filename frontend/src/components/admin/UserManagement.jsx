import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  Store,
  User,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  MapPin,
  Lock,
  Calendar,
  Key
} from 'lucide-react';

export default function UserManagement({ onOpenAddUser }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [submitting, setSubmitting] = useState(false);

  const getAuthToken = () => localStorage.getItem('ratehub_token');

  // Fetch Users with Search, Filter & Pagination from Express API
  const fetchUsersData = async () => {
    setLoading(true);
    setErrorMsg(null);
    const token = getAuthToken();

    try {
      const queryParams = new URLSearchParams({
        search,
        role: roleFilter,
        page: page.toString(),
        limit: limit.toString()
      });

      const res = await fetch(`http://localhost:5000/api/admin/users?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user directory from server.');
      }

      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.warn('API Error fetching user list, displaying offline state:', err);
      setErrorMsg('Unable to connect to Express backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [search, roleFilter, page, limit]);

  // Fetch Single User Details by ID
  const handleViewUser = async (userId) => {
    setDetailsLoading(true);
    const token = getAuthToken();

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setSelectedUser(data.user);
      } else {
        // Fallback to locally loaded item
        const fallback = users.find((u) => u.id === userId);
        setSelectedUser(fallback || null);
      }
    } catch (err) {
      const fallback = users.find((u) => u.id === userId);
      setSelectedUser(fallback || null);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Create User Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const token = getAuthToken();
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create user account.');
      }

      setSuccessMsg(`User ${newUser.name} created successfully!`);
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
      setShowAddUserModal(false);
      fetchUsersData();

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-400" />
            User Account Management
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Search, filter, view details, and provision Normal Users, Store Owners, and Admins.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* NOTIFICATIONS */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)}><X className="w-4 h-4 text-emerald-400" /></button>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)}><X className="w-4 h-4 text-rose-400" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH AND ROLE FILTERS BAR */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        
        {/* Multi-field search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Role Filter & Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Role:</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-xs font-mono rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="all">All Roles ({total})</option>
            <option value="admin">System Admins</option>
            <option value="store_owner">Store Owners</option>
            <option value="user">Normal Users</option>
          </select>

          {/* Page Limit Selector */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-xs font-mono rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>

          <button
            onClick={fetchUsersData}
            title="Refresh Users"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* USER DATA TABLE (DESKTOP & TABLET) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        
        {loading ? (
          /* SKELETON SHIMMER LOADING STATE */
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-9 h-9 rounded-full bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-800 rounded w-24" />
                    <div className="h-2 bg-slate-800/60 rounded w-36" />
                  </div>
                </div>
                <div className="h-6 bg-slate-800 rounded w-24" />
                <div className="h-3 bg-slate-800 rounded w-32" />
                <div className="h-8 bg-slate-800 rounded w-20" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          /* CLEAN EMPTY STATE */
          <div className="py-12 px-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Users Found</h3>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm mx-auto">
                No user accounts match your search query "{search}" and role filter "{roleFilter}".
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-mono font-semibold transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <>
            {/* MOBILE CARD VIEW (hidden on sm+) */}
            <div className="sm:hidden divide-y divide-slate-800/60">
              {users.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center font-bold font-mono text-sm ${
                      u.role === 'admin'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : u.role === 'store_owner'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {u.name ? u.name.charAt(0) : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate font-mono">{u.email}</p>
                      <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">{u.role.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewUser(u.id)}
                    className="shrink-0 px-3 py-2 rounded-xl bg-slate-950 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-slate-800 hover:border-indigo-500 text-[11px] font-mono font-semibold transition-all inline-flex items-center gap-1.5 min-h-[36px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE VIEW (hidden below sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">User Information</th>
                    <th className="py-3.5 px-4 font-bold">Role</th>
                    <th className="py-3.5 px-4 font-bold">Physical Address</th>
                    <th className="py-3.5 px-4 font-bold">Joined Date</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors group">
                      
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold font-mono ${
                            u.role === 'admin'
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                              : u.role === 'store_owner'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {u.name ? u.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs group-hover:text-indigo-300 transition-colors">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {u.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            <Shield className="w-3 h-3" /> ADMIN
                          </span>
                        )}
                        {u.role === 'store_owner' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            <Store className="w-3 h-3" /> STORE OWNER
                          </span>
                        )}
                        {u.role === 'user' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <User className="w-3 h-3" /> NORMAL USER
                          </span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 text-slate-300 truncate max-w-xs">{u.address}</td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleViewUser(u.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-slate-800 hover:border-indigo-500 text-[11px] font-mono font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PAGINATION FOOTER BAR */}
        {!loading && total > 0 && (
          <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div>
              Showing <strong className="text-white">{(page - 1) * limit + 1}</strong> to{' '}
              <strong className="text-white">{Math.min(page * limit, total)}</strong> of{' '}
              <strong className="text-indigo-400">{total}</strong> total users
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 flex items-center gap-1 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* USER DETAILS MODAL POPUP */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {selectedUser.name ? selectedUser.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{selectedUser.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">User ID: #{selectedUser.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Metadata Grid */}
              <div className="space-y-3 font-mono text-xs">
                
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Email Address</span>
                    <p className="font-bold text-slate-200">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Physical Address</span>
                    <p className="font-bold text-slate-200">{selectedUser.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Account Role</span>
                    <p className="font-bold text-indigo-300 mt-0.5 uppercase">{selectedUser.role}</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Registration Date</span>
                    <p className="font-bold text-slate-200 mt-0.5">
                      {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'Active'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Security Token Status</span>
                    <p className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Password Hashed (Bcrypt)
                    </p>
                  </div>
                </div>

              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors"
              >
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE USER MODAL */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-extrabold text-white">Create Platform User</h3>
                </div>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Account Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-xs font-mono rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                    >
                      <option value="user">Normal User</option>
                      <option value="store_owner">Store Owner</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Min 8 chars"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl px-3.5 py-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Physical Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Street Address, City, State"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                  >
                    {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
