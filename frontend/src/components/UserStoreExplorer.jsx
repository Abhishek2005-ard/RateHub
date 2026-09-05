import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Store as StoreIcon,
  MessageSquare,
  Edit3
} from 'lucide-react';

export default function UserStoreExplorer({ currentUser }) {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Hover ratings per store { storeId: hoveredStarCount }
  const [hoverRatings, setHoverRatings] = useState({});
  // Submitting state per store { storeId: true/false }
  const [submittingId, setSubmittingId] = useState(null);
  // Comments input state per store { storeId: commentText }
  const [comments, setComments] = useState({});

  const getAuthToken = () => localStorage.getItem('ratehub_token');

  const fetchUserStores = async () => {
    setLoading(true);
    setErrorMsg(null);
    const token = getAuthToken();

    try {
      const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString()
      });

      const res = await fetch(`http://localhost:5000/api/user/stores?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch stores.');
      }

      const data = await res.json();
      if (data.success) {
        setStores(data.stores || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);

        // Pre-fill comments from existing user ratings
        const initialComments = {};
        (data.stores || []).forEach(store => {
          if (store.user_comment) {
            initialComments[store.id] = store.user_comment;
          }
        });
        setComments(initialComments);
      }
    } catch (err) {
      console.warn('API Error fetching user stores:', err);
      // Fallback mock stores for offline preview
      setStores([
        { id: 1, name: 'Heritage Artisan Coffee', address: '742 Broadway Ave, Suite 100', category: 'Coffee & Cafe', rating_avg: 4.85, rating_count: 12, user_rating: 5, user_comment: 'Great coffee!' },
        { id: 2, name: 'Lumina Tech Electronics', address: '88 Tech Boulevard', category: 'Electronics', rating_avg: 4.40, rating_count: 8, user_rating: 4, user_comment: '' },
        { id: 3, name: 'Urban Threads Boutique', address: '512 Fashion St', category: 'Apparel', rating_avg: 4.90, rating_count: 5, user_rating: null, user_comment: '' },
        { id: 4, name: 'Green Leaf Organic Market', address: '900 Natural Way', category: 'Groceries', rating_avg: 4.50, rating_count: 15, user_rating: null, user_comment: '' }
      ]);
      setTotal(4);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStores();
  }, [search, page, limit]);

  const handleRatingSubmit = async (storeId, stars) => {
    const token = getAuthToken();
    setSubmittingId(storeId);
    setErrorMsg(null);
    setSuccessMsg(null);

    const storeComment = comments[storeId] || '';

    try {
      const res = await fetch('http://localhost:5000/api/user/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          storeId,
          rating: stars,
          comment: storeComment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit rating.');
      }

      // Update store locally in state for instantaneous feedback
      setStores(prev =>
        prev.map(s => {
          if (s.id === storeId) {
            return {
              ...s,
              user_rating: stars,
              user_comment: storeComment,
              rating_avg: data.store ? parseFloat(data.store.rating_avg) : s.rating_avg,
              rating_count: data.store ? data.store.rating_count : s.rating_count
            };
          }
          return s;
        })
      );

      const targetStore = stores.find(s => s.id === storeId);
      const isUpdate = targetStore && targetStore.user_rating !== null;
      setSuccessMsg(
        isUpdate
          ? `Updated your rating for '${targetStore?.name}' to ${stars} ★!`
          : `Rating for '${targetStore?.name || 'store'}' saved as ${stars} ★!`
      );

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        // Local offline state update
        setStores(prev =>
          prev.map(s => {
            if (s.id === storeId) {
              const oldRating = s.user_rating;
              const hasRated = oldRating !== null;
              const newCount = hasRated ? s.rating_count : s.rating_count + 1;
              const newAvg = hasRated
                ? parseFloat(((s.rating_avg * s.rating_count - oldRating + stars) / s.rating_count).toFixed(2))
                : parseFloat(((s.rating_avg * s.rating_count + stars) / newCount).toFixed(2));

              return {
                ...s,
                user_rating: stars,
                user_comment: storeComment,
                rating_avg: newAvg,
                rating_count: newCount
              };
            }
            return s;
          })
        );
        setSuccessMsg(`Rating saved locally (${stars} ★)!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <StoreIcon className="w-5 h-5 text-indigo-400" />
            Explore & Rate Local Stores
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browse registered stores, view overall ratings, and submit or update your rating (1-5 stars).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>1 Rating Per Store Allowed</span>
        </div>
      </div>

      {/* Global Alerts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 text-xs text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Showing: <strong className="text-white">{stores.length}</strong> of {total} stores</span>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 animate-pulse space-y-4">
              <div className="h-5 bg-slate-900 rounded w-2/3"></div>
              <div className="h-4 bg-slate-900 rounded w-1/2"></div>
              <div className="h-16 bg-slate-900 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-950 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <StoreIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No stores found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No store match found for "{search}". Try searching with a different keyword.
          </p>
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 text-xs font-mono border border-slate-800 transition-colors"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        /* Stores Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map(store => {
            const currentRating = store.user_rating;
            const hoveredStars = hoverRatings[store.id] || 0;
            const isSubmittingThis = submittingId === store.id;

            return (
              <motion.div
                key={store.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950 rounded-3xl border border-slate-800 p-6 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl space-y-5"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-semibold">
                      {store.category || 'Retail Store'}
                    </span>

                    {currentRating !== null && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Rated: {currentRating} ★
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-extrabold text-white tracking-tight">
                    {store.name}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{store.address}</span>
                  </div>
                </div>

                {/* Overall Rating Display */}
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                      Overall Score
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="text-lg font-extrabold font-mono text-white">
                        {parseFloat(store.rating_avg || 0).toFixed(2)}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ({store.rating_count || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                      Your Status
                    </span>
                    <span className={`text-xs font-mono font-bold ${currentRating ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {currentRating ? `Rated ${currentRating}/5` : 'Not Rated Yet'}
                    </span>
                  </div>
                </div>

                {/* Rating Input Component */}
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                      {currentRating ? 'Modify Your Rating:' : 'Rate This Store:'}
                    </label>

                    {isSubmittingThis && (
                      <span className="text-[11px] font-mono text-indigo-400 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
                      </span>
                    )}
                  </div>

                  {/* 5-Star Hover & Click Rating Selector */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(star => {
                        const isFilled = star <= (hoveredStars || currentRating || 0);
                        return (
                          <button
                            key={star}
                            type="button"
                            disabled={isSubmittingThis}
                            onClick={() => handleRatingSubmit(store.id, star)}
                            onMouseEnter={() => setHoverRatings(prev => ({ ...prev, [store.id]: star }))}
                            onMouseLeave={() => setHoverRatings(prev => ({ ...prev, [store.id]: 0 }))}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none disabled:opacity-50"
                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                isFilled
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-700 hover:text-slate-500'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {hoveredStars
                        ? `${hoveredStars} Star${hoveredStars > 1 ? 's' : ''}`
                        : currentRating
                        ? `${currentRating} Star${currentRating > 1 ? 's' : ''}`
                        : 'Select Stars'}
                    </span>
                  </div>

                  {/* Optional Comment Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Optional review comment (e.g. Excellent service!)..."
                      value={comments[store.id] || ''}
                      onChange={e => setComments({ ...comments, [store.id]: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 text-xs text-white placeholder-slate-600 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">
            Page <strong className="text-white">{page}</strong> of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white border border-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white border border-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
