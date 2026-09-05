import React from 'react';
import { User, Star, MapPin, CheckCircle2, LogOut, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function UserDashboard({ user, onLogout }) {
  return (
    <div className="bg-slate-900 rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden my-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white">Shopper Profile Dashboard</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                NORMAL USER ROLE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Welcome back, <strong className="text-white">{user?.name || 'Shopper'}</strong> ({user?.email})
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-xs font-mono font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Stores Rated</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">12 Stores</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Top Contributor Badge
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Account Verification</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">Verified Purchaser</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Anti-Bot Validation Passed</div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Saved Address</span>
            <MapPin className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xs font-mono text-slate-200 truncate">
            {user?.address || '742 Evergreen Terrace'}
          </div>
          <div className="text-[10px] font-mono text-indigo-400 mt-1">Default Neighborhood Radius</div>
        </div>
      </div>

      {/* User Activity History */}
      <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
        <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider mb-3">
          Your Recent Store Reviews
        </h3>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Heritage Roasters & Goods</div>
            <div className="text-amber-400">Rated ★★★★★ (5/5 Stars)</div>
          </div>
          <span className="text-slate-500 text-[10px]">Verified Visit</span>
        </div>
      </div>
    </div>
  );
}
