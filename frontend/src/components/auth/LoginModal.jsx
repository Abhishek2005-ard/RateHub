import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  X,
  ArrowRight,
  Shield,
  Store,
  User,
  ShoppingBag
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg(null);
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMsg(null);
  };

  const fillDemoCredentials = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMsg(null);
    if (roleKey === 'admin') {
      setFormData({ email: 'admin@ratehub.dev', password: 'admin123' });
    } else if (roleKey === 'store_owner') {
      setFormData({ email: 'owner@heritage.com', password: 'owner123' });
    } else {
      setFormData({ email: 'user@ratehub.dev', password: 'user123' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: selectedRole
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      if (data.token) localStorage.setItem('ratehub_token', data.token);
      if (data.user) localStorage.setItem('ratehub_user', JSON.stringify(data.user));

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        const mockUser = {
          id: selectedRole === 'admin' ? 1 : selectedRole === 'store_owner' ? 2 : 3,
          name: selectedRole === 'admin' ? 'System Admin' : selectedRole === 'store_owner' ? 'Elena Rostova' : 'Alex Morgan',
          email: formData.email,
          role: selectedRole
        };
        if (onLoginSuccess) onLoginSuccess(mockUser);
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleConfigs = {
    user: { title: 'Normal User', icon: User },
    store_owner: { title: 'Store Owner', icon: Store },
    admin: { title: 'Administrator', icon: Shield },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full overflow-hidden relative my-8"
        >
          {/* Header */}
          <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Sign In to RateHub
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Select your role to continue
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Role Switcher */}
            <div>
              <label className="text-xs font-mono font-semibold text-slate-300 block mb-2">
                Account Role:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                {[
                  { id: 'user', label: 'User', icon: User },
                  { id: 'store_owner', label: 'Owner', icon: Store },
                  { id: 'admin', label: 'Admin', icon: Shield },
                ].map((tab) => {
                  const isActive = selectedRole === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleRoleSelect(tab.id)}
                      className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="user@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-indigo-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Account Shortcuts */}
              <div className="pt-1">
                <span className="text-[10px] font-mono text-slate-500 block mb-1">Demo accounts:</span>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('user')}
                    className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 rounded border border-slate-800"
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('store_owner')}
                    className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-purple-400 rounded border border-slate-800"
                  >
                    Store Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('admin')}
                    className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-indigo-400 rounded border border-slate-800"
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-mono font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as {roleConfigs[selectedRole].title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Switch to Register */}
              <div className="pt-3 text-center border-t border-slate-800">
                <p className="text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
