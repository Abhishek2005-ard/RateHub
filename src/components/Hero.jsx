import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Copy,
  Check,
  Play,
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
    react: `import { RateWidget } from '@ratehub/react';

export default function StoreCard() {
  return (
    <RateWidget
      storeId="heritage-roasters"
      theme="dark"
      showMetrics={true}
      onRate={(rating) => console.log('Rated:', rating)}
    />
  );
}`,
    curl: `curl -X POST https://api.ratehub.dev/v1/stores/heritage-roasters/ratings \\
  -H "Authorization: Bearer rh_live_99a82b" \\
  -H "Content-Type: application/json" \\
  -d '{"stars": 5, "userId": "usr_99182", "comment": "Excellent specialty espresso!"}'`,
    node: `import { RateHubClient } from '@ratehub/sdk';

const ratehub = new RateHubClient({ apiKey: process.env.RATEHUB_API_KEY });

// Submit verified rating to global ledger
const response = await ratehub.ratings.create({
  storeId: 'heritage-roasters',
  stars: 5,
  verifiedPurchaser: true
});

console.log(response.averageRating); // 4.85`,
    python: `from ratehub import RateHub

client = RateHub(api_key="rh_live_99a82b")

# Retrieve aggregated ratings for any retail store
store = client.stores.get_rating("heritage-roasters")
print(f"Rating: {store.stars_avg} ({store.total_reviews} reviews)")`
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
            <span className="font-semibold text-white">RateHub Edge SDK 2.4</span>
            <span className="text-slate-400">|</span>
            <span className="text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Sub-15ms Rating Edge <ArrowRight className="w-3 h-3" />
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
            Developer-First Store <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Rating & Review Infrastructure
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
          >
            Collect, verify, and embed store ratings, user reviews, and trust analytics into any application with 3 lines of code or our edge-accelerated REST API.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <a
              href="#playground"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <Terminal className="w-4 h-4" />
              Get Free API Key
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#explorer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-slate-700/80 transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              Explore Live Demo Stores
            </a>
          </motion.div>

          {/* Quick Metrics Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400"
          >
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>&lt; 15ms Latency</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-Fraud ML Engine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Zero Dependency SDK</span>
            </div>
          </motion.div>
        </div>

        {/* Code & Live Terminal Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md"
        >
          {/* Terminal Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                ratehub-integration-preview.tsx
              </span>
            </div>

            {/* Language Code Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {[
                { id: 'react', label: 'React SDK' },
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

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-md border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Grid Split: Left = Code block, Right = Live UI Component Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Code Block */}
            <div className="lg:col-span-7 p-4 sm:p-6 bg-slate-950/60 overflow-x-auto">
              <pre className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>

            {/* Live Component Preview Card */}
            <div className="lg:col-span-5 p-5 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-indigo-400" /> Live Rendered Output
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    Active Widget
                  </span>
                </div>

                {/* Simulated RateHub Component */}
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">Heritage Roasters & Goods</h4>
                      <p className="text-[11px] text-slate-400">Merchant Store ID: <span className="font-mono text-indigo-300">#hr-9021</span></p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 text-xs font-mono font-bold px-2 py-1 rounded border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      4.85
                    </div>
                  </div>

                  {/* Rating Stars interactive inside terminal demo */}
                  <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                      <span>Rate this store:</span>
                      <span className="text-indigo-400 font-bold">{demoStars}/5 Stars</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-1 bg-slate-950/80 rounded-lg border border-slate-800">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            setDemoStars(star);
                            setDemoRated(true);
                            if (onRateDemo) onRateDemo(star);
                          }}
                          className="p-1 hover:scale-125 transition-transform focus:outline-none"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= demoStars
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                : 'text-slate-700 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    {demoRated && (
                      <div className="text-[11px] text-emerald-400 font-mono text-center flex items-center justify-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> API Received: HTTP 201 Created (12ms)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>SDK Footprint: <strong className="text-slate-200">1.8 kB gzip</strong></span>
                <span className="text-indigo-400">Zero Dependencies</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
