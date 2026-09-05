import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Developer Hobby',
      priceMonthly: '$0',
      priceAnnual: '$0',
      description: 'Ideal for side projects, single store testing, and indie developers.',
      features: [
        '10,000 API Requests / mo',
        '1 Verified Store Profile',
        'Standard React & HTML Embeds',
        'Community Support & Discord Access',
        '99.9% Edge Availability',
      ],
      cta: 'Start Free Tier',
      popular: false,
      buttonStyle: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
    },
    {
      name: 'Developer Pro',
      priceMonthly: '$29',
      priceAnnual: '$23',
      description: 'For growing retail merchants, multi-store brands, and SaaS integrations.',
      features: [
        '250,000 API Requests / mo',
        'Up to 15 Store Profiles',
        'Sub-15ms Redis Edge Latency',
        'Real-time Webhook Event Stream',
        'Remove RateHub Watermark',
        'Custom Widget CSS & Accent Colors',
        'Priority API Email Support',
      ],
      cta: 'Get Pro API Key',
      popular: true,
      buttonStyle: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-500/30',
    },
    {
      name: 'Enterprise Scale',
      priceMonthly: '$199',
      priceAnnual: '$159',
      description: 'High-throughput retail networks, marketplaces, and custom SLA requirements.',
      features: [
        '5,000,000+ API Requests / mo',
        'Unlimited Store Profiles',
        'Custom ML Anti-Fraud Rules',
        'Dedicated Edge Nodes & IP Whitelisting',
        'SAML SSO & SOC2 Compliance Logs',
        '24/7 Dedicated Developer On-Call SLA',
      ],
      cta: 'Contact Sales',
      popular: false,
      buttonStyle: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-amber-400 uppercase mb-2">
            <Zap className="w-3.5 h-3.5" />
            TRANSPARENT DEVELOPER PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simple, Predictable API Billing
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Scale seamlessly from localhost testing to millions of monthly store reviews.
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 text-xs font-mono rounded-lg transition-all ${
                !isAnnual ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                isAnnual ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual Billing
              <span className="px-1.5 py-0.5 text-[9px] bg-amber-400 text-slate-950 font-bold rounded">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-mono font-bold uppercase rounded-full shadow-md tracking-wider">
                  MOST POPULAR DEVELOPER PLAN
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold font-mono text-white">
                    {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>

                <div className="space-y-3 mb-8 pt-4 border-t border-slate-800">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#playground"
                className={`w-full py-3 rounded-xl text-xs font-mono text-center transition-all ${plan.buttonStyle}`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
