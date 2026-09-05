import React from 'react';
import { Store, Star, MessageSquare, TrendingUp, LogOut, CheckCircle2, MapPin } from 'lucide-react';

export default function StoreOwnerDashboard({ user, onLogout }) {
  return (
    <div className="bg-slate-900 rounded-3xl border border-purple-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden my-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white">Merchant Portal</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full">
                STORE OWNER ROLE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Welcome back, <strong className="text-white">{user?.name || 'Store Owner'}</strong> ({user?.email})
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

      {/* Store Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Average Trust Score</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white flex items-baseline gap-2">
            4.85 <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
          </div>
          <div className="text-[10px] font-mono text-amber-400 mt-1">
            Top 5% Merchant Tier
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Total Customer Reviews</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">342</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> +28 new this week
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Customer Growth Trend</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-400">+18.4%</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Verified Visitor Footprint</div>
        </div>
      </div>

      {/* Customer Review Response Queue */}
      <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
        <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Recent Customer Feedback Queue</span>
          <span className="text-xs text-purple-400 font-normal">2 Pending Responses</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Alex Morgan ★★★★★</span>
              <span className="text-slate-500">2 hours ago</span>
            </div>
            <p className="text-slate-300">
              "Outstanding single-origin roast and swift checkout! Clean store environment."
            </p>
            <div className="pt-1 flex items-center gap-2">
              <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-[11px] font-bold">
                Post Merchant Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
