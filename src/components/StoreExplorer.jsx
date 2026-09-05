import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  CheckCircle2,
  Code,
  Sparkles,
  X,
  Copy,
  Check,
  Zap
} from 'lucide-react';

const INITIAL_STORES = [
  {
    id: 'heritage-roasters',
    name: 'Heritage Roasters & Goods',
    category: 'Cafes',
    rating: 4.8,
    reviewsCount: 342,
    location: 'Pearl District, 0.4 mi',
    imageExt: '/images/exterior.png',
    imageInt: '/images/interior.png',
    verified: true,
    latency: '11ms',
    tags: ['Specialty Coffee', 'Artisanal Bakery', 'WiFi'],
    description: 'Premier artisanal roastery serving single-origin coffees, organic pastries, and curated lifestyle goods.',
    apiPayload: {
      id: "heritage-roasters",
      status: "active",
      ratings: {
        average: 4.85,
        total_count: 342,
        breakdown: { "5_star": 280, "4_star": 45, "3_star": 12, "2_star": 3, "1_star": 2 }
      },
      merchant: { name: "Heritage Roasters LLC", verified_tier: "enterprise_pro" },
      edge_node: "iad-us-east-1"
    }
  },
  {
    id: 'lumina-electronics',
    name: 'Lumina Tech & Audio',
    category: 'Electronics',
    rating: 4.9,
    reviewsCount: 819,
    location: 'Downtown Tech Corridor, 1.2 mi',
    imageExt: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    imageInt: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80',
    verified: true,
    latency: '9ms',
    tags: ['Custom PC', 'Hi-Fi Audio', 'Repairs'],
    description: 'High-end consumer electronics boutique specializing in audiophile gear, custom workstation builds, and fast tech repairs.',
    apiPayload: {
      id: "lumina-electronics",
      status: "active",
      ratings: {
        average: 4.92,
        total_count: 819,
        breakdown: { "5_star": 760, "4_star": 48, "3_star": 8, "2_star": 2, "1_star": 1 }
      },
      merchant: { name: "Lumina Retail Tech Inc", verified_tier: "enterprise_pro" },
      edge_node: "pdx-us-west-2"
    }
  },
  {
    id: 'velvet-archive',
    name: 'Velvet Archive Apparel',
    category: 'Boutiques',
    rating: 4.7,
    reviewsCount: 194,
    location: 'Arts District, 0.8 mi',
    imageExt: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    imageInt: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80',
    verified: true,
    latency: '14ms',
    tags: ['Designer Vintage', 'Sustainable', 'Tailoring'],
    description: 'Curated high-fashion vintage apparel, local independent designer showcases, and custom tailoring services.',
    apiPayload: {
      id: "velvet-archive",
      status: "active",
      ratings: {
        average: 4.71,
        total_count: 194,
        breakdown: { "5_star": 150, "4_star": 32, "3_star": 8, "2_star": 3, "1_star": 1 }
      },
      merchant: { name: "Velvet Archive Collective", verified_tier: "growth_tier" },
      edge_node: "sfo-us-west-1"
    }
  },
  {
    id: 'greenfield-market',
    name: 'Greenfield Organic Market',
    category: 'Supermarkets',
    rating: 4.85,
    reviewsCount: 1205,
    location: 'Westside Plaza, 2.1 mi',
    imageExt: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
    imageInt: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    verified: true,
    latency: '10ms',
    tags: ['100% Organic', 'Zero Waste', 'Juice Bar'],
    description: 'Community-owned organic grocery store providing fresh farm-to-table produce, natural remedies, and zero-waste bulk goods.',
    apiPayload: {
      id: "greenfield-market",
      status: "active",
      ratings: {
        average: 4.85,
        total_count: 1205,
        breakdown: { "5_star": 1050, "4_star": 120, "3_star": 25, "2_star": 7, "1_star": 3 }
      },
      merchant: { name: "Greenfield Coop Ltd", verified_tier: "enterprise_pro" },
      edge_node: "ord-us-central"
    }
  }
];

export default function StoreExplorer({ onRateStore }) {
  const [stores, setStores] = useState(INITIAL_STORES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJsonModal, setActiveJsonModal] = useState(null);
  const [copiedModalJson, setCopiedModalJson] = useState(false);
  const [userStoreRatings, setUserStoreRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});

  const categories = ['All', 'Cafes', 'Boutiques', 'Electronics', 'Supermarkets'];

  const filteredStores = stores.filter((store) => {
    const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
    const matchesQuery =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const handleRate = (storeId, stars) => {
    setUserStoreRatings(prev => ({ ...prev, [storeId]: stars }));
    
    setStores(prev => prev.map(s => {
      if (s.id === storeId) {
        const newCount = s.reviewsCount + 1;
        const newAvg = Number(((s.rating * s.reviewsCount + stars) / newCount).toFixed(2));
        return { ...s, rating: newAvg, reviewsCount: newCount };
      }
      return s;
    }));

    if (onRateStore) {
      const storeObj = stores.find(s => s.id === storeId);
      onRateStore(storeObj ? storeObj.name : 'Store', stars);
    }
  };

  const handleCopyJson = () => {
    if (!activeJsonModal) return;
    navigator.clipboard.writeText(JSON.stringify(activeJsonModal.apiPayload, null, 2));
    setCopiedModalJson(true);
    setTimeout(() => setCopiedModalJson(false), 2000);
  };

  return (
    <section id="explorer" className="py-16 md:py-24 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-indigo-400 uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              LIVE DATA EXPLORER
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Verified Retail Store Catalog
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Interact with live store entries. Every rating action updates the global ledger and fires simulated API webhook responses instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulated API Endpoints Active</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store name, tag, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-xl transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStores.map((store) => {
            const userRating = userStoreRatings[store.id] || 0;
            const hoverRating = hoverRatings[store.id] || 0;

            return (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image showcase grid */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/60 border-b border-slate-800/80">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                      <img
                        src={store.imageExt}
                        alt={`${store.name} Exterior`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/images/exterior.png';
                        }}
                      />
                      <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-slate-950/90 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {store.category}
                      </span>
                    </div>

                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                      <img
                        src={store.imageInt}
                        alt={`${store.name} Interior`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/images/interior.png';
                        }}
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-mono bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Store Details Body */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {store.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          {store.location}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {store.rating}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 mt-1">
                          {store.reviewsCount} reviews
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {store.description}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {store.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Interactive Star Rating & API Json Drawer Button */}
                <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  
                  {/* Tap to Rate Component */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      Rate:
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= (hoverRating || userRating);
                        return (
                          <button
                            key={star}
                            onMouseEnter={() => setHoverRatings(prev => ({ ...prev, [store.id]: star }))}
                            onMouseLeave={() => setHoverRatings(prev => ({ ...prev, [store.id]: 0 }))}
                            onClick={() => handleRate(store.id, star)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            aria-label={`Rate ${star} star`}
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                active
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-700 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    {userRating > 0 && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1">
                        ({userRating}★ Saved)
                      </span>
                    )}
                  </div>

                  {/* API Drawer Trigger */}
                  <button
                    onClick={() => setActiveJsonModal(store)}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono border border-slate-800 flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    Inspect JSON Response
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* API Response Modal Drawer */}
        <AnimatePresence>
          {activeJsonModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono font-bold text-white">
                      GET /v1/stores/{activeJsonModal.id}
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                      200 OK
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveJsonModal(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 bg-slate-950 overflow-x-auto max-h-96">
                  <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                    <code>{JSON.stringify(activeJsonModal.apiPayload, null, 2)}</code>
                  </pre>
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Edge Node: <strong className="text-slate-200">{activeJsonModal.apiPayload.edge_node}</strong> ({activeJsonModal.latency})
                  </span>
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copiedModalJson ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Payload!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy JSON
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
