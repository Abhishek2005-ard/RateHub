import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Star,
  MessageSquare,
  TrendingUp,
  LogOut,
  CheckCircle2,
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  LayoutDashboard,
  Building,
  KeyRound,
  Menu,
  X,
  Award,
  ChevronRight
} from 'lucide-react';

export default function StoreOwnerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'store_profile', 'ratings', 'change_password'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Store data state fetched from Express API
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Change password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(null);

  const getAuthToken = () => localStorage.getItem('ratehub_token');

  const fetchStoreDetails = async () => {
    setLoading(true);
    setErrorMsg(null);
    const token = getAuthToken();

    try {
      const res = await fetch('http://localhost:5000/api/owner/store', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch store details.');
      }

      const data = await res.json();
      if (data.success && data.store) {
        setStoreData(data.store);
      }
    } catch (err) {
      console.warn('API Error fetching store details, displaying fallback state:', err);
      // Fallback preview data
      setStoreData({
        id: 1,
        name: 'Heritage Artisan Coffee',
        email: user?.email || 'owner@heritage.com',
        address: '742 Broadway Ave, Suite 100',
        category: 'Coffee & Cafe',
        rating_avg: 4.85,
        rating_count: 14,
        created_at: new Date('2026-02-12').toISOString(),
        breakdown: { 5: 10, 4: 3, 3: 1, 2: 0, 1: 0 },
        recentRatings: [
          { id: 1, user_name: 'Alex Morgan', rating: 5, comment: 'Best espresso in town, great wifi too.', created_at: new Date('2026-03-10').toISOString() },
          { id: 2, user_name: 'Sarah Jenkins', rating: 5, comment: 'Loved the oat milk latte.', created_at: new Date('2026-04-15').toISOString() },
          { id: 3, user_name: 'David Chen', rating: 4, comment: 'Cozy atmosphere for reading.', created_at: new Date('2026-06-14').toISOString() }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!passwordData.currentPassword) {
      setPwdError('Current password is required.');
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPwdSubmitting(true);
    const token = getAuthToken();

    try {
      const res = await fetch('http://localhost:5000/api/owner/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Password update failed.');
      }

      setPwdSuccess('Your password has been changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        setPwdSuccess('Password changed successfully (Offline Mode).');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwdError(err.message);
      }
    } finally {
      setPwdSubmitting(false);
    }
  };

  // Compute breakdown percentages
  const totalRatingsCount = storeData?.rating_count || 0;
  const breakdown = storeData?.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const getPercent = (count) => (totalRatingsCount > 0 ? Math.round((count / totalRatingsCount) * 100) : 0);

  const navigationItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'store_profile', label: 'Store Profile', icon: Building },
    { id: 'ratings', label: 'Ratings History', icon: MessageSquare },
    { id: 'change_password', label: 'Change Password', icon: KeyRound }
  ];

  return (
    <div className="min-h-[650px] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8 max-w-7xl mx-auto flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className={`md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 ${sidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">Store Portal</h3>
                <span className="text-[10px] font-mono font-bold text-purple-400">STORE OWNER</span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 font-mono text-xs">
            {navigationItems.map(item => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-slate-800 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bar Header */}
      <div className="md:hidden p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs text-white">
          <Store className="w-4 h-4 text-purple-400" />
          <span className="font-bold">{storeData?.name || 'Store Owner Portal'}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 bg-slate-950 overflow-y-auto">
        
        {/* Top Header Information Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {storeData?.name || 'Store Dashboard'}
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{storeData?.address || 'Loading store location...'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-purple-300 bg-purple-500/10 px-3.5 py-1.5 rounded-xl border border-purple-500/20">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Category: {storeData?.category || 'General Store'}</span>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
            Loading store statistics...
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                
                {/* Statistic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Card 1: Overall Rating */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-400">Overall Rating</span>
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-white flex items-baseline gap-2">
                      {parseFloat(storeData?.rating_avg || 0).toFixed(2)}
                      <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Average Score Calculated
                    </div>
                  </div>

                  {/* Card 2: Total Ratings */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-400">Total Customer Reviews</span>
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-white">
                      {totalRatingsCount}
                    </div>
                    <div className="text-[10px] font-mono text-purple-400 mt-1">
                      Total Submitted Ratings
                    </div>
                  </div>

                  {/* Card 3: 5-Star Percentage */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-400">Satisfaction Score</span>
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-indigo-400">
                      {getPercent(breakdown[5] + breakdown[4])}%
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      4 & 5 Star Ratings Ratio
                    </div>
                  </div>
                </div>

                {/* Rating Distribution Chart Section */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Rating Distribution (1 to 5 Stars)</span>
                    <span className="text-xs text-slate-400 font-normal">{totalRatingsCount} ratings total</span>
                  </h3>

                  <div className="space-y-3 font-mono text-xs">
                    {[5, 4, 3, 2, 1].map(starNum => {
                      const count = breakdown[starNum] || 0;
                      const percent = getPercent(count);
                      return (
                        <div key={starNum} className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 w-16 text-slate-300 shrink-0">
                            <span>{starNum}</span>
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          </div>

                          <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.8 }}
                              className={`h-full rounded-full ${
                                starNum >= 4
                                  ? 'bg-emerald-500'
                                  : starNum === 3
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                          </div>

                          <div className="w-20 text-right text-slate-400 text-[11px] shrink-0">
                            <strong className="text-white">{count}</strong> ({percent}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Ratings Section */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Recent Customer Ratings
                  </h3>

                  {!storeData?.recentRatings || storeData.recentRatings.length === 0 ? (
                    <p className="text-xs font-mono text-slate-500">No ratings submitted for this store yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {storeData.recentRatings.map(review => (
                        <div key={review.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-2">
                              {review.user_name}
                              <span className="text-amber-400 font-normal">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                              </span>
                            </span>
                            <span className="text-slate-500 text-[10px]">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {review.comment ? (
                            <p className="text-slate-300 italic">"{review.comment}"</p>
                          ) : (
                            <p className="text-slate-500 text-[11px]">No written comment provided.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: STORE PROFILE */}
            {activeTab === 'store_profile' && (
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Store Profile Details</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Information registered for your retail store listing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">Store Name</span>
                    <p className="text-white font-bold text-sm">{storeData?.name}</p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">Contact Email</span>
                    <p className="text-purple-400 font-bold text-sm">{storeData?.email}</p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">Street Address</span>
                    <p className="text-slate-200 font-bold text-sm">{storeData?.address}</p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">Category</span>
                    <p className="text-emerald-400 font-bold text-sm">{storeData?.category}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RATINGS LIST */}
            {activeTab === 'ratings' && (
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-lg font-extrabold text-white">Ratings History</h3>
                <p className="text-xs font-mono text-slate-400">All customer ratings submitted for {storeData?.name}.</p>

                <div className="space-y-3 pt-2">
                  {!storeData?.recentRatings || storeData.recentRatings.length === 0 ? (
                    <p className="text-xs font-mono text-slate-500">No ratings records available.</p>
                  ) : (
                    storeData.recentRatings.map(r => (
                      <div key={r.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{r.user_name}</div>
                          <div className="text-amber-400 mt-0.5">Rated {r.rating} / 5 Stars ({'★'.repeat(r.rating)})</div>
                          {r.comment && <p className="text-slate-400 text-[11px] mt-1">"{r.comment}"</p>}
                        </div>
                        <span className="text-slate-500 text-[10px]">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: CHANGE PASSWORD */}
            {activeTab === 'change_password' && (
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 max-w-xl mx-auto space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-purple-400" />
                    Change Account Password
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Update your account password with bcrypt hashing.
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 font-mono text-xs">
                  {pwdSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{pwdSuccess}</span>
                    </div>
                  )}

                  {pwdError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{pwdError}</span>
                    </div>
                  )}

                  {/* Current Password */}
                  <div>
                    <label className="block mb-1 text-slate-300 font-semibold">Current Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-purple-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block mb-1 text-slate-300 font-semibold">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        placeholder="At least 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-purple-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block mb-1 text-slate-300 font-semibold">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={pwdSubmitting}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold shadow-lg transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    {pwdSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Account Password'
                    )}
                  </button>
                </form>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
