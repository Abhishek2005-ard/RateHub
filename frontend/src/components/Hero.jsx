import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Copy,
  Check,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle2
} from 'lucide-react';

export default function Hero({ onRateDemo }) {
  const [activeTab, setActiveTab] = useState('react');
  const [copied, setCopied] = useState(false);
  const [demoStars, setDemoStars] = useState(5);
  const [demoRated, setDemoRated] = useState(false);

  const codeExamples = {
    react: `import { StoreRatingCard } from './components';

export default function StoreListing() {
  return (
    <StoreRatingCard
      storeId={1}
      name="Heritage Artisan Coffee"
      address="742 Broadway Ave, Suite 100"
      averageRating={4.85}
      onRate={(rating) => submitRating(1, rating)}
    />
  );
}`,
    curl: `curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@ratehub.dev", "password": "user123", "role": "user"}'`,
    node: `import fetch from 'node-fetch';

const response = await fetch('http://localhost:5000/api/admin/stores', {
  headers: { 'Authorization': \`Bearer \${jwtToken}\` }
});

const { stores } = await response.json();
console.log('Stores count:', stores.length);`,
    python: `import requests

headers = {"Authorization": f"Bearer {jwt_token}"}
response = requests.get("http://localhost:5000/api/admin/stats", headers=headers)

stats = response.json().get("stats")
print(f"Total Users: {stats['totalUsers']}, Total Stores: {stats['totalStores']}")`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-[300px] h-[250px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Release Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/15 transition-all shadow-sm group"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="font-semibold text-white">Store Rating & User Management</span>
            <span className="text-slate-400">|</span>
            <span className="text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Express & PostgreSQL MVC <ArrowRight className="w-3 h-3" />
            </span>
          </a>
        </motion.div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Store Rating & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              User Management Platform
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
          >
            Manage users, registered stores, and submitted ratings with full role-based authentication, real-time analytics, and clean MVC API endpoints.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <a
              href="#explorer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <Terminal className="w-4 h-4" />
              Explore Store Ratings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#features"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              View API Documentation
            </a>
          </motion.div>

          {/* Metrics Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Fast Express REST API</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>JWT & Bcrypt Security</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>PostgreSQL Aggregation</span>
            </div>
          </motion.div>
        </div>

        {/* Code Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md"
        >
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                StoreRatingCard.jsx
              </span>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {[
                { id: 'react', label: 'React' },
                { id: 'curl', label: 'cURL' },
                { id: 'node', label: 'Node.js' },
                { id: 'python', label: 'Python' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Body */}
          <div className="relative p-4 sm:p-6 bg-slate-950/90 font-mono text-xs sm:text-sm overflow-x-auto text-slate-200">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 flex items-center gap-1.5 text-xs font-mono"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <pre className="text-slate-300 leading-relaxed font-mono">
              <code>{codeExamples[activeTab]}</code>
            </pre>
          </div>

          {/* Interactive Rating Demo Widget */}
          <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                ★
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white">Heritage Artisan Coffee</h4>
                <p className="text-[11px] font-mono text-slate-400">Rate this store to test rating calculation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setDemoStars(star);
                      setDemoRated(true);
                    }}
                    className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= demoStars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono text-emerald-400 font-bold">
                {demoRated ? `${demoStars}.0 / 5.0 Submitted` : 'Click to Rate'}
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
