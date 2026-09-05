import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  Webhook,
  Cpu,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function DeveloperFeatures() {
  return (
    <section id="features" className="py-16 md:py-24 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase mb-2">
            <Layers className="w-3.5 h-3.5" />
            ENGINEERED FOR EXTREME PERFORMANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Developer-First Architecture
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Built from the ground up for high-concurrency retail platforms, mobile apps, and headless commerce engines.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Sub-15ms Edge Engine */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-6 shadow-md">
                <Zap className="w-6 h-6" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Sub-15ms Edge Rating Resolution
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Ratings are calculated and cached at 300+ global edge locations using Upstash Redis & Cloudflare Workers. Your store pages load instantly without database overhead.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Edge Node</span>
                  <span>Latency</span>
                  <span>Status</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="text-indigo-400">iad1 (US-East)</span>
                  <span>11ms</span>
                  <span className="text-emerald-400">● 100% OK</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="text-indigo-400">fra1 (EU-Central)</span>
                  <span>14ms</span>
                  <span className="text-emerald-400">● 100% OK</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="text-indigo-400">hkg1 (Asia-East)</span>
                  <span>16ms</span>
                  <span className="text-emerald-400">● 100% OK</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: ML Anti-Fraud Protection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Anti-Fraud & ML Validation
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Automated sentiment verification, device fingerprinting, and receipt hash checks block fake bot reviews before they reach your rating score.
              </p>
            </div>

            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>99.92% Spam Interception Accuracy</span>
            </div>
          </motion.div>

          {/* Card 3: Realtime Webhooks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-5 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-6 shadow-md">
                <Webhook className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Real-Time Event Webhooks
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                Receive instant JSON webhooks on rating submission. Sync customer feedback directly into Slack, Discord, Zendesk, or your PostgreSQL warehouse.
              </p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-purple-300">
              event: rating.created | signature: ed25519
            </div>
          </motion.div>

          {/* Card 4: Multi-Tenant SDK Suite */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-7 bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-md">
                <Cpu className="w-6 h-6" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Native Client & Server SDKs
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Official libraries for React, Next.js, Vue, React Native, Node.js, Python, and Go with full TypeScript definition files.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                {['@ratehub/react', '@ratehub/node', 'ratehub-python', 'RateHub-Go'].map((pkg) => (
                  <div key={pkg} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 text-center truncate">
                    {pkg}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
