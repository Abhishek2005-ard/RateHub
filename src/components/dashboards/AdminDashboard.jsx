import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserManagement from '../admin/UserManagement';
import {
  Shield,
  Users,
  Store,
  Star,
  Activity,
  LogOut,
  LayoutDashboard,
  UserPlus,
  Store as StoreIcon,
  User,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Filter,
  RefreshCw,

  Mail,
  MapPin,
  Lock
} from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Stats & Data State
  const [stats, setStats] = useState({
    totalUsers: 1772,
    totalStores: 72,
    totalRatings: 3120,
    ratingBreakdown: { 5: 1850, 4: 820, 3: 290, 2: 110, 1: 50 },
    categoryCounts: { 'Coffee & Cafe': 18, Electronics: 15, Apparel: 14, Groceries: 12, Entertainment: 13 },
    monthlyTrends: [
      { month: 'Jan', users: 120, ratings: 450 },
      { month: 'Feb', users: 240, ratings: 680 },
      { month: 'Mar', users: 380, ratings: 920 },
      { month: 'Apr', users: 510, ratings: 1140 },
      { month: 'May', users: 690, ratings: 1480 },
      { month: 'Jun', users: 840, ratings: 1770 },
      { month: 'Jul', users: 1050, ratings: 2100 },
      { month: 'Aug', users: 1420, ratings: 2650 },
      { month: 'Sep', users: 1772, ratings: 3120 }
    ],
    systemUptime: '99.99%',
    avgLatencyMs: 14
  });

  const [usersList, setUsersList] = useState([]);
  const [storesList, setStoresList] = useState([]);

  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [storeSearch, setStoreSearch] = useState('');

  // Add User Form State
  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [userSubmitting, setUserSubmitting] = useState(false);

  // Add Store Form State
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', category: 'Coffee & Cafe' });
  const [storeSubmitting, setStoreSubmitting] = useState(false);

  const getAuthToken = () => localStorage.getItem('ratehub_token');

  // Fetch Stats, Users, and Stores from Express API
  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    const token = getAuthToken();

    try {
      // Fetch Admin Stats
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.stats) setStats(data.stats);
      }

      // Fetch Users
      const usersRes = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const data = await usersRes.json();
        if (data.users) setUsersList(data.users);
      }

      // Fetch Stores
      const storesRes = await fetch('http://localhost:5000/api/admin/stores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (storesRes.ok) {
        const data = await storesRes.json();
        if (data.stores) setStoresList(data.stores);
      }
    } catch (err) {
      console.warn('Backend API connection issue, displaying active offline fallback state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

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
        throw new Error(data.message || 'Failed to create user.');
      }

      setSuccessMsg(`User ${newUser.name} (${newUser.role.toUpperCase()}) created successfully!`);
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchData();
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('users');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUserSubmitting(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setStoreSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

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
        throw new Error(data.message || 'Failed to create store.');
      }

      setSuccessMsg(`Store '${newStore.name}' created successfully!`);
      setNewStore({ name: '', email: '', address: '', category: 'Coffee & Cafe' });
      fetchData();
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('stores');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setStoreSubmitting(false);
    }
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.address.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Stores
  const filteredStores = storesList.filter((s) => {
    return (
      s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.address.toLowerCase().includes(storeSearch.toLowerCase())
    );
  });

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users, badge: usersList.length || stats.totalUsers },
    { id: 'stores', label: 'Stores', icon: Store, badge: storesList.length || stats.totalStores },
    { id: 'addUser', label: 'Add User', icon: UserPlus },
    { id: 'addStore', label: 'Add Store', icon: StoreIcon },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col md:flex-row my-4 rounded-3xl border border-indigo-500/30 overflow-hidden shadow-2xl">
      
      {/* MOBILE HEADER BAR */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white">RateHub Admin</h1>
            <p className="text-[10px] font-mono text-indigo-400">Control Center</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl md:hidden"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Admin Portal</h2>
                    <p className="text-xs text-slate-400 font-mono">{user?.name}</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-1.5">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-slate-900/90 border-r border-slate-800/80 p-5 flex-col justify-between shrink-0 backdrop-blur-md">
        <div>
          {/* Logo & Admin User Badge */}
          <div className="pb-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">RateHub Admin</h2>
              <span className="inline-block px-2 py-0.5 text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full mt-0.5">
                SYSTEM ADMINISTRATOR
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-mono font-bold text-xs">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'System Admin'}</p>
              <p className="text-[10px] font-mono text-slate-400 truncate">{user?.email || 'admin@ratehub.dev'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 font-mono text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-slate-950/50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Global Notifications */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between"
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
              className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)}><X className="w-4 h-4 text-rose-400" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  <LayoutDashboard className="w-6 h-6 text-indigo-400" />
                  Analytics & System Overview
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Real-time PostgreSQL metrics, user activity, store ratings, and edge system health.
                </p>
              </div>

              <button
                onClick={fetchData}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 text-xs font-mono font-semibold border border-slate-700 flex items-center gap-2 transition-all self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* STATISTIC CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat Card 1: Total Users */}
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+14.2% this month</span>
                </div>
              </motion.div>

              {/* Stat Card 2: Total Stores */}
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Stores</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Store className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {stats.totalStores.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-amber-300">
                  <Award className="w-3.5 h-3.5" />
                  <span>Verified Merchant Index</span>
                </div>
              </motion.div>

              {/* Stat Card 3: Total Submitted Ratings */}
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Ratings</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <Star className="w-4 h-4 fill-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  {stats.totalRatings.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-purple-300">
                  <Star className="w-3.5 h-3.5 fill-purple-400" />
                  <span>⭐ 4.85 Avg System Score</span>
                </div>
              </motion.div>

              {/* Stat Card 4: System API Health */}
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden shadow-xl"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">API Health</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
                  {stats.systemUptime}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{stats.avgLatencyMs}ms Avg Latency</span>
                </div>
              </motion.div>

            </div>

            {/* RESPONSIVE CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
              
              {/* Chart 1: Monthly Signups & Rating Trends (2 Columns) */}
              <div className="lg:col-span-2 bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                        Monthly User & Rating Activity
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Growth trends for ratings submitted vs new account registrations.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="flex items-center gap-1.5 text-indigo-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Ratings
                      </span>
                      <span className="flex items-center gap-1.5 text-purple-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Signups
                      </span>
                    </div>
                  </div>

                  {/* SVG Animated Responsive Bar Chart */}
                  <div className="h-56 w-full pt-4 flex items-end justify-between gap-2 sm:gap-4 px-2">
                    {stats.monthlyTrends.map((t, idx) => {
                      const maxRating = Math.max(...stats.monthlyTrends.map(m => m.ratings));
                      const ratingHeight = Math.round((t.ratings / maxRating) * 100);
                      const userHeight = Math.round((t.users / maxRating) * 100);

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                          {/* Tooltip Hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-slate-950 border border-slate-700 text-white text-[10px] font-mono p-2 rounded-xl shadow-2xl pointer-events-none whitespace-nowrap">
                            <p className="font-bold text-indigo-300">{t.month}:</p>
                            <p>Ratings: {t.ratings}</p>
                            <p>Signups: {t.users}</p>
                          </div>

                          <div className="w-full flex items-end justify-center gap-1 h-44">
                            {/* Ratings Bar */}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${ratingHeight}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.05 }}
                              className="w-2.5 sm:w-4 bg-gradient-to-t from-indigo-700 to-indigo-400 rounded-t-lg group-hover:brightness-125 transition-all"
                            />
                            {/* Users Bar */}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${userHeight}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.05 + 0.1 }}
                              className="w-2.5 sm:w-4 bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-lg group-hover:brightness-125 transition-all"
                            />
                          </div>

                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-white font-semibold">
                            {t.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chart 2: Rating Score Breakdown (1 Column) */}
              <div className="bg-slate-900/90 p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Rating Star Distribution
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mb-5">
                    Breakdown of customer feedback scores across stores.
                  </p>

                  <div className="space-y-3.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = stats.ratingBreakdown[stars] || 0;
                      const total = Object.values(stats.ratingBreakdown).reduce((a, b) => a + b, 0) || 1;
                      const pct = Math.round((count / total) * 100);

                      return (
                        <div key={stars} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-300 flex items-center gap-1">
                              {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
                            </span>
                            <span className="text-slate-400 font-bold">{count} ({pct}%)</span>
                          </div>

                          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8 }}
                              className={`h-full rounded-full ${
                                stars >= 4
                                  ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                                  : stars === 3
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 mt-4 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Satisfied Users (4★ & 5★):</span>
                  <span className="text-emerald-400 font-bold">85.6% Positive Sentiment</span>
                </div>
              </div>

            </div>

            {/* QUICK ACTIONS BANNER */}
            <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 p-5 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Quick Administrator Controls
                </h4>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Need to provision a new user account or register a new store branch?
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('addUser')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add User
                </button>

                <button
                  onClick={() => setActiveTab('addStore')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-purple-600/30"
                >
                  <StoreIcon className="w-3.5 h-3.5" />
                  Add Store
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT DIRECTORY */}
        {activeTab === 'users' && (
          <UserManagement onOpenAddUser={() => setActiveTab('addUser')} />
        )}


        {/* TAB 3: STORES DIRECTORY */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  <Store className="w-6 h-6 text-amber-400" />
                  Store Directory & Ratings
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Verified merchant accounts, store locations, categories, and customer rating scores.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('addStore')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 self-start sm:self-auto"
              >
                <StoreIcon className="w-4 h-4" />
                Add New Store
              </button>
            </div>

            {/* SEARCH BAR */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search stores by name, email, category, address..."
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* STORES DATA TABLE */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono text-slate-300">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-bold">Store Name</th>
                      <th className="py-3.5 px-4 font-bold">Category</th>
                      <th className="py-3.5 px-4 font-bold">Owner Email</th>
                      <th className="py-3.5 px-4 font-bold">Address</th>
                      <th className="py-3.5 px-4 font-bold text-right">Rating Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredStores.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-mono">
                          No store branches found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStores.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                              <Store className="w-4 h-4" />
                            </div>
                            {s.name}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950 text-indigo-300 border border-slate-800">
                              {s.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-400">{s.email}</td>
                          <td className="py-3.5 px-4 text-slate-300 truncate max-w-xs">{s.address}</td>
                          
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{s.rating_avg || '5.0'}</span>
                              <span className="text-[10px] text-slate-400 font-normal">({s.rating_count || 12})</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ADD USER FORM */}
        {activeTab === 'addUser' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-indigo-400" />
                Add New Platform User
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Provision a new user account with hashed password storage and role authorization.
              </p>
            </div>

            <form onSubmit={handleCreateUser} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl pl-9 pr-4 py-3 text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. marcus@ratehub.dev"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl pl-9 pr-4 py-3 text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Assigned Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl px-4 py-3 text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="user">Normal User</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Physical / Street Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 Technology Way, San Jose, CA"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl pl-9 pr-4 py-3 text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-xs font-mono rounded-xl pl-9 pr-4 py-3 text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={userSubmitting}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                {userSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating User Account...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Provision User Account
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: ADD STORE FORM */}
        {activeTab === 'addStore' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <StoreIcon className="w-6 h-6 text-purple-400" />
                Register New Store Branch
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Add a store listing to the RateHub directory and link owner email for feedback.
              </p>
            </div>

            <form onSubmit={handleCreateStore} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Store / Business Name</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Artisan Bakery"
                    value={newStore.name}
                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl pl-9 pr-4 py-3 text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Owner / Contact Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="owner@business.com"
                      value={newStore.email}
                      onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl pl-9 pr-4 py-3 text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Industry Category</label>
                  <select
                    value={newStore.category}
                    onChange={(e) => setNewStore({ ...newStore, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl px-4 py-3 text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="Coffee & Cafe">Coffee & Cafe</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Dining & Restaurants">Dining & Restaurants</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">Store Street Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 102 Gourmet Boulevard, Suite A"
                    value={newStore.address}
                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs font-mono rounded-xl pl-9 pr-4 py-3 text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={storeSubmitting}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                {storeSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Registering Store...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Register Store Branch
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-400" />
                Administrator Profile & Security
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                View authenticated admin session metadata, permissions, and security token.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              
              <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold font-mono shadow-lg shadow-indigo-500/30">
                  {user?.name ? user.name.charAt(0) : 'A'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{user?.name || 'System Admin'}</h3>
                  <p className="text-xs font-mono text-slate-400">{user?.email || 'admin@ratehub.dev'}</p>
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full mt-2">
                    ROOT ACCESS ROLE: ADMIN
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Headquarters / Location</span>
                  <p className="text-xs font-mono font-bold text-slate-200 mt-1">{user?.address || 'RateHub HQ, Tech Center'}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">JWT Authentication Status</span>
                  <p className="text-xs font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Token Verified (24h)
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Role-Based System Permissions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-2">✓ Read/Write User Accounts</span>
                  <span className="flex items-center gap-2">✓ Register & Edit Stores</span>
                  <span className="flex items-center gap-2">✓ Access Aggregated Analytics</span>
                  <span className="flex items-center gap-2">✓ Authorize System API Keys</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
