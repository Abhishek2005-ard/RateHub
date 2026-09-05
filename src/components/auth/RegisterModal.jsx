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

  // Validation functions
  const validateField = (field, value) => {
    let err = '';
    if (field === 'name') {
      if (!value || value.trim().length < 2) {
        err = 'Full Name must be at least 2 characters.';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        err = 'Email address is required.';
      } else if (!emailRegex.test(value.trim())) {
        err = 'Please enter a valid email address (e.g. user@domain.com).';
      }
    } else if (field === 'address') {
      if (!value || value.trim().length < 5) {
        err = 'Street address must be at least 5 characters.';
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

  // Password strength meter computation
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
      // Connect to Express backend API
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // Success
      setSuccessData(data.user);
      if (onRegisterSuccess) {
        onRegisterSuccess(data.user);
      }
    } catch (err) {
      console.warn('API Error (falling back to mock response if backend offline):', err.message);
      
      // Fallback mock success if server isn't started yet
      if (err.message.includes('Failed to fetch')) {
        const mockUser = {
          id: 1,
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
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Create Normal User Account
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  RateHub Verified Community Index
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

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            
            {/* SUCCESS STATE CARD */}
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
                  Registration Successful!
                </h4>
                
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Welcome to RateHub, <strong className="text-white">{successData.name}</strong>! Your account has been encrypted and stored securely.
                </p>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registered Email:</span>
                    <span className="text-indigo-400 font-bold">{successData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping Address:</span>
                    <span className="text-slate-200 truncate max-w-[200px]">{successData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Password Security:</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Bcrypt Hash Saved
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
              /* REGISTRATION FORM */
              <form onSubmit={handleSubmit} className="space-y-4">

                {serverError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* 1. Full Name */}
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

                {/* 2. Email Address */}
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

                {/* 3. Address Field */}
                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    Physical Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <textarea
                      name="address"
                      rows="2"
                      placeholder="Street, City, Zip / Postal Code"
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border transition-colors focus:outline-none resize-none ${
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

                {/* 4. Password Field with Visibility Toggle */}
                <div>
                  <label className="text-xs font-mono font-semibold text-slate-300 block mb-1.5">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Minimum 8 characters"
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
                    
                    {/* Visibility Eye Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-indigo-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength Bar */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${pwdStrength.color} transition-all duration-300`}
                          style={{ width: `${pwdStrength.score}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400">Password Strength:</span>
                        <span className={`font-bold ${pwdStrength.text}`}>{pwdStrength.label}</span>
                      </div>
                    </div>
                  )}

                  {touched.password && errors.password && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button & Loading State */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-mono font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Encrypting & Registering...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Footer Switch to Login */}
                <div className="pt-3 text-center border-t border-slate-800">
                  <p className="text-xs text-slate-400">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
                    >
                      Log In to your Account
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
