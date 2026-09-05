import React from 'react';
import { ShoppingBag, Globe, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Rate<span className="text-indigo-400">Hub</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The developer-first rating infrastructure empowering stores, merchants, and applications with edge-accelerated reviews and trust analytics.
            </p>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono inline-flex">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational (99.99%)
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-mono font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#explorer" className="hover:text-white transition-colors">Store Directory</a></li>
              <li><a href="#playground" className="hover:text-white transition-colors">Embed Builder</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Edge Engine</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-mono font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Developers
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#api-docs" className="hover:text-white transition-colors">REST API Docs</a></li>
              <li><a href="#playground" className="hover:text-white transition-colors">React SDK</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Webhooks API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="font-mono font-bold text-white uppercase text-[11px] tracking-wider mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Whitepaper</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Anti-Fraud Guidelines</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>
            © {new Date().getFullYear()} RateHub Inc. Built for developers worldwide.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-400" /> API Network
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-sky-400" /> Community
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
