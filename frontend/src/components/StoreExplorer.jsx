import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  CheckCircle2,
  Code,
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
    location: '742 Broadway Ave, Suite 100',
    verified: true,
    tags: ['Specialty Coffee', 'Bakery', 'WiFi'],
    description: 'Specialty coffee roastery offering single-origin beans, organic baked goods, and cozy seating.',
    apiPayload: {
      id: 1,
      name: "Heritage Roasters & Goods",
      email: "owner@heritage.com",
      address: "742 Broadway Ave, Suite 100",
      category: "Coffee & Cafe",
      rating_avg: 4.85,
      rating_count: 342
    }
  },
  {
    id: 'lumina-electronics',
    name: 'Lumina Tech & Electronics',
    category: 'Electronics',
    rating: 4.9,
    reviewsCount: 819,
    location: '88 Tech Boulevard',
    verified: true,
    tags: ['Computers', 'Audio', 'Repairs'],
    description: 'High-end consumer electronics store specializing in computer hardware, audio equipment, and tech repair.',
    apiPayload: {
      id: 2,
      name: "Lumina Tech & Electronics",
      email: "contact@lumina.tech",
      address: "88 Tech Boulevard",
      category: "Electronics",
      rating_avg: 4.92,
      rating_count: 819
    }
  },
  {
    id: 'velvet-archive',
    name: 'Urban Threads Boutique',
    category: 'Boutiques',
    rating: 4.7,
    reviewsCount: 194,
    location: '512 Fashion St',
    verified: true,
    tags: ['Apparel', 'Sustainable', 'Accessories'],
    description: 'Curated apparel boutique showcasing local independent designers, footwear, and accessories.',
    apiPayload: {
      id: 3,
      name: "Urban Threads Boutique",
      email: "info@urbanthreads.com",
      address: "512 Fashion St",
      category: "Apparel",
      rating_avg: 4.71,
      rating_count: 194
    }
  },
  {
    id: 'greenfield-market',
    name: 'Green Leaf Organic Market',
    category: 'Supermarkets',
    rating: 4.85,
    reviewsCount: 1205,
    location: '900 Natural Way',
    verified: true,
    tags: ['Organic', 'Produce', 'Groceries'],
    description: 'Organic grocery market providing fresh farm produce, natural remedies, and healthy foods.',
    apiPayload: {
      id: 4,
      name: "Green Leaf Organic Market",
      email: "support@greenleaf.org",
      address: "900 Natural Way",
      category: "Groceries",
      rating_avg: 4.85,
      rating_count: 1205
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
              STORE CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Registered Stores & Ratings
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              Browse stores, view average ratings, and submit ratings for local businesses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL REST API Connected</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by store name, address, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStores.map((store) => {
            const userRating = userStoreRatings[store.id] || 0;
            const currentHover = hoverRatings[store.id] || 0;

            return (
              <motion.div
                key={store.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl group flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Category & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-mono font-semibold">
                      {store.category}
                    </span>

                    <button
                      onClick={() => setActiveJsonModal(store)}
                      className="text-xs font-mono text-slate-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors p-1"
                    >
                      <Code className="w-3.5 h-3.5 text-indigo-400" />
                      <span>View API Data</span>
                    </button>
                  </div>

                  {/* Store Name & Location */}
                  <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                    {store.name}
                    {store.verified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 inline shrink-0" />
                    )}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{store.location}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {store.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {store.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating Footer */}
                <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Overall Average */}
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-lg font-extrabold font-mono text-white">
                      {store.rating.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ({store.reviewsCount} ratings)
                    </span>
                  </div>

                  {/* Interactive Star Rating */}
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">Your Rating:</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const activeStars = currentHover || userRating;
                        return (
                          <button
                            key={star}
                            onClick={() => handleRate(store.id, star)}
                            onMouseEnter={() => setHoverRatings(prev => ({ ...prev, [store.id]: star }))}
                            onMouseLeave={() => setHoverRatings(prev => ({ ...prev, [store.id]: 0 }))}
                            className="p-1.5 transition-transform hover:scale-125 focus:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
                            aria-label={`Rate ${star} star`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= activeStars
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-700'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* JSON Preview Modal */}
        <AnimatePresence>
          {activeJsonModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden max-h-[85vh] flex flex-col"
              >
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-300 overflow-hidden">
                    <Code className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">REST API Output: {activeJsonModal.name}</span>
                  </div>
                  <button
                    onClick={() => setActiveJsonModal(null)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-y-auto flex-1 relative">
                  <button
                    onClick={handleCopyJson}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 border border-slate-700 z-10"
                  >
                    {copiedModalJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedModalJson ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre className="whitespace-pre overflow-x-auto no-scrollbar pt-8">
                    <code>{JSON.stringify(activeJsonModal.apiPayload, null, 2)}</code>
                  </pre>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
