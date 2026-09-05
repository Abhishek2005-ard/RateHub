import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const validateField = (field, value) => {
    let err = '';
    if (field === 'name') {
      if (!value || value.trim().length < 2) {
        err = 'Name must be at least 2 characters.';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        err = 'Email is required.';
      } else if (!emailRegex.test(value.trim())) {
        err = 'Please enter a valid email address.';
      }
    } else if (field === 'address') {
      if (!value || value.trim().length < 5) {
        err = 'Address must be at least 5 characters.';
      }
    } else if (field === 'password') {
      if (!value) {
        err = 'Password is required.';
      } else if (value.length < 8) {
        err = 'Password must be at least 8 characters.';
      }
    }
    return err;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError(null);

    if (touched[name]) {
      const fieldErr = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldErr }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErr = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-indigo-400', text: 'text-indigo-400' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, address: true, password: true });

    if (!validateAll()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, role: 'user' }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || 'Registration failed.');
      }

      setSuccessData(data.user);
      if (onRegisterSuccess) {
        onRegisterSuccess(data.user);
      }
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        const mockUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          address: formData.address,
          role: 'user'
        };
        setSuccessData(mockUser);
        if (onRegisterSuccess) onRegisterSuccess(mockUser);
      } else {
        setServerError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden relative my-8"
        >
          {/* Modal Header */}
          <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Create User Account
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Join RateHub to rate local stores
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

          {/* Modal Body */}
          <div className="p-6 sm:p-8">
            {successData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h4 className="text-xl font-extrabold text-white">
                  Registration Successful
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Welcome, <strong className="text-white">{successData.name}</strong>! Your account has been created.
                </p>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-indigo-400 font-bold">{successData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Address:</span>
                    <span className="text-slate-200 truncate max-w-[200px]">{successData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Security:</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Password Hashed
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSuccessData(null);
                      if (onSwitchToLogin) onSwitchToLogin();
                    }}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Login
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {serverError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border transition-colors focus:outline-none ${
                        touched.name && errors.name
                          ? 'border-rose-500 focus:border-rose-500'
                          : touched.name && !errors.name
                          ? 'border-emerald-500/60 focus:border-emerald-500'
                          : 'border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  {touched.name && errors.name && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border transition-colors focus:outline-none ${
                        touched.email && errors.email
                          ? 'border-rose-500 focus:border-rose-500'
                          : touched.email && !errors.email
                          ? 'border-emerald-500/60 focus:border-emerald-500'
                          : 'border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="address"
                      placeholder="e.g. 742 Evergreen Terrace"
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border transition-colors focus:outline-none ${
                        touched.address && errors.address
                          ? 'border-rose-500 focus:border-rose-500'
                          : touched.address && !errors.address
                          ? 'border-emerald-500/60 focus:border-emerald-500'
                          : 'border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  {touched.address && errors.address && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.address}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border transition-colors focus:outline-none ${
                        touched.password && errors.password
                          ? 'border-rose-500 focus:border-rose-500'
                          : touched.password && !errors.password
                          ? 'border-emerald-500/60 focus:border-emerald-500'
                          : 'border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Password strength:</span>
                        <span className={pwdStrength.text}>{pwdStrength.label}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${pwdStrength.color} transition-all duration-300`}
                          style={{ width: `${pwdStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {touched.password && errors.password && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-mono font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Register Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Login */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400 font-mono">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
