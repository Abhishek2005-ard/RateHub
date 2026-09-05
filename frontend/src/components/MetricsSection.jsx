import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Server, Award } from 'lucide-react';

export default function MetricsSection() {
  const stats = [
    {
      label: 'Monthly API Requests',
      value: '14.8M+',
      subtext: 'Global Edge Ingestion',
      icon: Server,
      color: 'text-indigo-400',
    },
    {
      label: 'Edge Latency SLA',
      value: '< 15ms',
      subtext: 'Sub-millisecond Redis Caching',
      icon: Zap,
      color: 'text-amber-400',
    },
    {
      label: 'Spam Interception',
      value: '99.92%',
      subtext: 'AI ML Verification Guard',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      label: 'Uptime SLA',
      value: '99.99%',
      subtext: 'Multi-Region Failover',
      icon: Award,
      color: 'text-sky-400',
    },
  ];

  return (
    <section className="py-12 border-t border-slate-800/60 bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg text-center backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center mx-auto mb-3 border border-slate-800 shadow-inner">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${stat.color} tracking-tight`}>
                {stat.value}
              </div>
              <div className="text-xs font-bold text-white mt-1">
                {stat.label}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {stat.subtext}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
