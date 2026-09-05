import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Terminal,
  RefreshCw
} from 'lucide-react';

export default function ApiSnippetSection() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('create_rating');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const endpoints = {
    create_rating: {
      method: 'POST',
      url: '/v1/stores/heritage-roasters/ratings',
      description: 'Submit a new verified customer store rating',
      requestBody: {
        stars: 5,
        store_id: "heritage-roasters",
        user_id: "usr_9921a",
        verified_receipt_hash: "0x8f192b4c...",
        comment: "Outstanding single-origin roast and swift checkout!"
      },
      responseBody: {
        status: 201,
        message: "Rating verified and published to edge ledger",
        data: {
          rating_id: "rat_8829104",
          store_id: "heritage-roasters",
          stars: 5,
          new_store_average: 4.86,
          total_reviews: 343,
          spam_score: 0.002,
          execution_time_ms: 12
        }
      }
    },
    get_analytics: {
      method: 'GET',
      url: '/v1/stores/heritage-roasters/analytics?period=30d',
      description: 'Fetch aggregate trust score and rating metrics',
      requestBody: null,
      responseBody: {
        status: 200,
        data: {
          store_id: "heritage-roasters",
          trust_score: 98.4,
          average_rating: 4.85,
          monthly_visits_rated: 1420,
          customer_satisfaction_percent: 97.2,
          sentiment: "Overwhelmingly Positive"
        }
      }
    },
    create_token: {
      method: 'POST',
      url: '/v1/widgets/token',
      description: 'Generate scoped widget embed token for merchant domain',
      requestBody: {
        allowed_domain: "heritageroasters.com",
        permissions: ["read_ratings", "submit_reviews"],
        ttl_seconds: 86400
      },
      responseBody: {
        status: 200,
        data: {
          embed_token: "rh_embed_tok_991204812a",
          domain: "heritageroasters.com",
          expires_at: "2026-09-06T17:16:09Z"
        }
      }
    }
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutionResult(null);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionResult(endpoints[selectedEndpoint].responseBody);
    }, 400);
  };

  return (
    <section id="api-docs" className="py-16 md:py-24 border-t border-slate-800/60 relative bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold tracking-wider text-sky-400 uppercase mb-2">
            <Terminal className="w-3.5 h-3.5" />
            INTERACTIVE REST API RUNNER
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Test the RateHub REST API Live
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Select an endpoint payload and execute real API requests right from your browser.
          </p>
        </div>

        {/* Console Box */}
        <div className="max-w-5xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Header Controls */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Endpoint Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {[
                { id: 'create_rating', label: 'POST Rating' },
                { id: 'get_analytics', label: 'GET Analytics' },
                { id: 'create_token', label: 'POST Embed Token' },
              ].map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep.id);
                    setExecutionResult(null);
                  }}
                  className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-all whitespace-nowrap min-h-[36px] ${
                    selectedEndpoint === ep.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {ep.label}
                </button>
              ))}
            </div>

            {/* Execute Request Button */}
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-mono font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Executing...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Send Request
                </>
              )}
            </button>
          </div>

          {/* Endpoint Banner info */}
          <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3 text-xs font-mono overflow-hidden">
            <span className={`shrink-0 px-2 py-0.5 rounded font-bold ${
              endpoints[selectedEndpoint].method === 'POST' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {endpoints[selectedEndpoint].method}
            </span>
            <span className="text-white font-semibold truncate">
              https://api.ratehub.dev{endpoints[selectedEndpoint].url}
            </span>
            <span className="text-slate-500 hidden md:inline shrink-0">
              — {endpoints[selectedEndpoint].description}
            </span>
          </div>

          {/* Grid Payload View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* Request Body */}
            <div className="p-5 bg-slate-950/40">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Request Payload JSON</span>
                <span className="text-[10px] text-indigo-400">Bearer rh_live_demo</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
                <code>
                  {endpoints[selectedEndpoint].requestBody
                    ? JSON.stringify(endpoints[selectedEndpoint].requestBody, null, 2)
                    : '// No request body required for GET endpoint'}
                </code>
              </pre>
            </div>

            {/* Response Preview */}
            <div className="p-5 bg-slate-950/80">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Response Output</span>
                {executionResult && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    HTTP {executionResult.status || 200} OK (12ms)
                  </span>
                )}
              </div>

              {executionResult ? (
                <motion.pre
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto"
                >
                  <code>{JSON.stringify(executionResult, null, 2)}</code>
                </motion.pre>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
                  <Send className="w-6 h-6 text-slate-600 mb-2" />
                  Click "Send Request" to trigger simulated API response
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
