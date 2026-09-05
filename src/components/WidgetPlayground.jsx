import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Sliders,
  Copy,
  Check,
  Star,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Settings,
  Eye
} from 'lucide-react';

export default function WidgetPlayground() {
  const [theme, setTheme] = useState('dark'); // 'dark', 'light', 'indigo'
  const [layout, setLayout] = useState('card'); // 'card', 'compact', 'badge'
  const [accentColor, setAccentColor] = useState('#FBBF24'); // Amber gold by default
  const [showMetrics, setShowMetrics] = useState(true);
  const [userStars, setUserStars] = useState(5);
  const [copiedCode, setCopiedCode] = useState(false);

  const getEmbedCode = () => {
    if (layout === 'card') {
      return `<RateWidget
  storeId="your-store-id"
  theme="${theme}"
  accentColor="${accentColor}"
  showMetrics={${showMetrics}}
  onRate={(rating) => console.log('Rating:', rating)}
/>`;
    } else if (layout === 'compact') {
      return `<RatePill
  storeId="your-store-id"
  variant="${theme}"
  accent="${accentColor}"
/>`;
    } else {
      return `<RateBadge storeId="your-store-id" theme="${theme}" />`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="playground" className="py-16 md:py-24 border-t border-slate-800/60 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-purple-400 uppercase mb-2">
            <Code2 className="w-3.5 h-3.5" />
            CUSTOMIZABLE UI COMPONENTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Embed Widget Playground
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Customize embeddable rating widgets to match your brand style. Copy the zero-dependency React or HTML code directly into your codebase.
          </p>
        </div>

        {/* Playground Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Controls Panel (Left side) */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-800">
              <Settings className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Widget Customizer
              </h3>
            </div>

            <div className="space-y-5 text-xs font-mono">
              
              {/* Theme Selection */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">
                  Widget Theme Mode:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark', label: 'Dark Slate' },
                    { id: 'light', label: 'Crisp Light' },
                    { id: 'indigo', label: 'Glass Glow' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`py-2 px-2 rounded-lg border text-center transition-all ${
                        theme === t.id
                          ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Mode */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">
                  Layout Variant:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Detailed Card' },
                    { id: 'compact', label: 'Compact Pill' },
                    { id: 'badge', label: 'Inline Badge' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLayout(l.id)}
                      className={`py-2 px-2 rounded-lg border text-center transition-all ${
                        layout === l.id
                          ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Accent Color */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">
                  Star Accent Color:
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { color: '#FBBF24', name: 'Amber Gold' },
                    { color: '#6366F1', name: 'Indigo' },
                    { color: '#10B981', name: 'Emerald' },
                    { color: '#EC4899', name: 'Pink' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setAccentColor(c.color)}
                      className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                        accentColor === c.color ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Toggle Metrics */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-semibold">Display Rating Count:</span>
                <button
                  onClick={() => setShowMetrics(!showMetrics)}
                  className={`w-10 h-6 rounded-full transition-colors p-1 ${
                    showMetrics ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      showMetrics ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* Live Output & Code Block (Right side) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Component Preview Container */}
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  WIDGET PREVIEW OUTPUT
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Interactive Preview
                </span>
              </div>

              {/* Rendered Widget depending on user configuration */}
              <div className="p-8 rounded-xl bg-slate-950 flex items-center justify-center min-h-[160px] border border-slate-800/80">
                
                {layout === 'card' && (
                  <div
                    className={`w-full max-w-sm p-4 rounded-xl shadow-lg border transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white border-slate-800'
                        : theme === 'light'
                        ? 'bg-white text-slate-900 border-slate-200'
                        : 'bg-indigo-950/80 text-white border-indigo-500/40 backdrop-blur-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-sm">Heritage Roasters & Goods</h4>
                        <p className="text-[11px] opacity-70">Pearl District Branch</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-mono font-bold">
                        <Star className="w-4 h-4" style={{ fill: accentColor, color: accentColor }} />
                        4.8
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-current/10">
                      <span className="text-xs font-mono opacity-80">Tap to rate:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => setUserStars(s)}
                            className="p-0.5 hover:scale-125 transition-transform"
                          >
                            <Star
                              className="w-4 h-4"
                              style={{
                                fill: s <= userStars ? accentColor : 'transparent',
                                color: s <= userStars ? accentColor : '#64748B'
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {showMetrics && (
                      <div className="mt-2 text-[10px] font-mono opacity-60 text-right">
                        Based on 342 verified customer visits
                      </div>
                    )}
                  </div>
                )}

                {layout === 'compact' && (
                  <div
                    className={`px-4 py-2 rounded-full border shadow-md flex items-center gap-3 transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white border-slate-800'
                        : theme === 'light'
                        ? 'bg-white text-slate-900 border-slate-200'
                        : 'bg-indigo-950/90 text-white border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-bold text-xs font-mono">
                      <Star className="w-4 h-4" style={{ fill: accentColor, color: accentColor }} />
                      4.8 / 5.0
                    </div>
                    {showMetrics && <span className="text-xs opacity-70">| 342 Reviews</span>}
                  </div>
                )}

                {layout === 'badge' && (
                  <div
                    className={`px-3 py-1 rounded-md border text-xs font-mono font-bold flex items-center gap-1.5 ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white border-slate-800'
                        : theme === 'light'
                        ? 'bg-white text-slate-900 border-slate-200'
                        : 'bg-indigo-950 text-indigo-300 border-indigo-500/40'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" style={{ fill: accentColor, color: accentColor }} />
                    RateHub Verified 4.8★
                  </div>
                )}

              </div>
            </div>

            {/* Generated Code Block */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  GENERATED REACT COMPONENT CODE
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied Code!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl overflow-x-auto border border-slate-800">
                <pre className="text-xs font-mono text-indigo-300 leading-relaxed">
                  <code>{getEmbedCode()}</code>
                </pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
