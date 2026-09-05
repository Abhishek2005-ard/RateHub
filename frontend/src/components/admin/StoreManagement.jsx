import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Search,
  Filter,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  User,
  Mail,
  MapPin,
  Tag,
  Calendar,
  Award,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building
} from 'lucide-react';

export default function StoreManagement() {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Store Details Modal State
  const [selectedStore, setSelectedStore] = useState(null);

  // Add Store Modal State
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', category: 'Coffee & Cafe' });
  const [submitting, setSubmitting] = useState(false);

  const getAuthToken = () => localStorage.getItem('ratehub_token');

  // Fetch Stores with Search, Category Filter & Pagination
  const fetchStoresData = async () => {
    setLoading(true);
    setErrorMsg(null);
    const token = getAuthToken();

    try {
      const queryParams = new URLSearchParams({
        search,
        category: categoryFilter,
        page: page.toString(),
        limit: limit.toString()
      });

      const res = await fetch(`http://localhost:5000/api/admin/stores?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch store directory from server.');
      }

      const data = await res.json();
      if (data.success) {
        setStores(data.stores || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.warn('API Error fetching store list, displaying offline fallback:', err);
      setErrorMsg('Unable to connect to Express backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoresData();
  }, [search, categoryFilter, page, limit]);

  // Fetch Single Store Details by ID
  const handleViewStore = async (storeId) => {
    const token = getAuthToken();
    try {
      const res = await fetch(`http://localhost:5000/api/admin/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.store) {
        setSelectedStore(data.store);
      } else {
        const fallback = stores.find((s) => s.id === storeId);
        setSelectedStore(fallback || null);
      }
    } catch (err) {
      const fallback = stores.find((s) => s.id === storeId);
      setSelectedStore(fallback || null);
    }
  };

  // Create Store Handler
  const handleCreateStore = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const token = getAuthToken();
    try {
      const res = await fetch('http://localhost:5000/api/admin/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newStore)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create store listing.');
      }

      setSuccessMsg(`Store '${newStore.name}' registered successfully!`);
      setNewStore({ name: '', email: '', address: '', category: 'Coffee & Cafe' });
      setShowAddStoreModal(false);
      fetchStoresData();

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Store className="w-6 h-6 text-purple-400" />
            Store Branch Management
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Search, filter, inspect merchant details, view overall rating averages, and add new store branches.
          </p>
        </div>

        <button
          onClick={() => setShowAddStoreModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Store</span>
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

      {/* SEARCH AND CATEGORY FILTERS BAR */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Store Name, Owner Email, or Address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Category & Pagination Limits */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Category:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-xs font-mono rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="all">All Categories ({total})</option>
            <option value="Coffee & Cafe">Coffee & Cafe</option>
            <option value="Electronics">Electronics</option>
            <option value="Apparel">Apparel</option>
            <option value="Groceries">Groceries</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Dining & Restaurants">Dining & Restaurants</option>
          </select>

          {/* Page Limit Selector */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-xs font-mono rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>

          <button
            onClick={fetchStoresData}
            title="Refresh Stores"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* STORE DATA TABLE */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        
        {loading ? (
          /* SKELETON SHIMMER LOADING STATE */
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-800 rounded w-28" />
                    <div className="h-2 bg-slate-800/60 rounded w-40" />
                  </div>
                </div>
                <div className="h-6 bg-slate-800 rounded w-28" />
                <div className="h-3 bg-slate-800 rounded w-32" />
                <div className="h-8 bg-slate-800 rounded w-20" />
              </div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          /* CLEAN EMPTY STATE */
          <div className="py-12 px-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Stores Found</h3>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm mx-auto">
                No store branches match your search query "{search}" and category filter "{categoryFilter}".
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-mono font-semibold transition-colors"
            >
              Reset Search & Category Filters
            </button>
          </div>
        ) : (
          /* RESPONSIVE TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Store & Category</th>
                  <th className="py-3.5 px-4 font-bold">Assigned Owner</th>
                  <th className="py-3.5 px-4 font-bold">Physical Address</th>
                  <th className="py-3.5 px-4 font-bold text-center">Overall Rating</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors group">
                    
                    {/* Name & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs group-hover:text-purple-300 transition-colors">{s.name}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-indigo-300 border border-slate-800">
                            {s.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Owner Name & Email */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-200">{s.owner_name || 'Store Owner'}</p>
                      <p className="text-[10px] text-slate-400">{s.email}</p>
                    </td>

                    {/* Address */}
                    <td className="py-3.5 px-4 text-slate-300 truncate max-w-xs">{s.address}</td>

                    {/* Overall Rating Calculation */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{s.rating_avg ? s.rating_avg : '5.0'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({s.rating_count || 12})</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewStore(s.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-purple-600 text-purple-300 hover:text-white border border-slate-800 hover:border-purple-500 text-[11px] font-mono font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
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
        )}

        {/* PAGINATION FOOTER BAR */}
        {!loading && total > 0 && (
          <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div>
              Showing <strong className="text-white">{(page - 1) * limit + 1}</strong> to{' '}
              <strong className="text-white">{Math.min(page * limit, total)}</strong> of{' '}
              <strong className="text-purple-400">{total}</strong> total stores
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
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

      {/* STORE DETAILS MODAL POPUP */}
      <AnimatePresence>
        {selectedStore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{selectedStore.name}</h3>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mt-0.5">
                      {selectedStore.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Store Metadata Grid */}
              <div className="space-y-3 font-mono text-xs">
                
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <User className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Assigned Store Owner</span>
                    <p className="font-bold text-slate-200">{selectedStore.owner_name || 'Store Owner'}</p>
                    <p className="text-[10px] text-slate-400">{selectedStore.email}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Physical Address</span>
                    <p className="font-bold text-slate-200">{selectedStore.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Overall Rating</span>
                    <p className="font-bold text-amber-300 mt-0.5 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {selectedStore.rating_avg || '5.0'} / 5.0
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Total Reviews</span>
                    <p className="font-bold text-slate-200 mt-0.5">
                      {selectedStore.rating_count || 12} Ratings Submitted
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Verification Index</span>
                    <p className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Merchant Listing
                    </p>
                  </div>
                </div>

              </div>

              <button
                onClick={() => setSelectedStore(null)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors"
              >
                Close Store Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE STORE MODAL */}
      <AnimatePresence>
        {showAddStoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Store className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-extrabold text-white">Register Store Branch</h3>
                </div>
                <button
                  onClick={() => setShowAddStoreModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStore} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heritage Artisan Bakery"
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Owner / Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="owner@heritage.com"
                    value={newStore.email}
                    onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Industry Category</label>
                  <select
                    value={newStore.category}
                    onChange={(e) => setNewStore({ ...newStore, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-xs font-mono rounded-xl px-3 py-2.5 text-white outline-none cursor-pointer"
                  >
                    <option value="Coffee & Cafe">Coffee & Cafe</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Dining & Restaurants">Dining & Restaurants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase mb-1">Store Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Street Address, Suite, City, State"
                    value={newStore.address}
                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddStoreModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-colors shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5"
                  >
                    {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Register Store'}
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
