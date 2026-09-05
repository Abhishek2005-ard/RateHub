import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Code2,
  Compass,
  Layers,
  DollarSign,
  Terminal,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { label: 'Store Explorer Catalog', category: 'Navigation', href: '#explorer', icon: Compass },
    { label: 'Live Embed Widget Builder', category: 'Playground', href: '#playground', icon: Code2 },
    { label: 'Developer Architecture & Edge Latency', category: 'Features', href: '#features', icon: Layers },
    { label: 'REST API & Webhooks Testing', category: 'API Docs', href: '#api-docs', icon: Terminal },
    { label: 'Developer API Pricing Tiers', category: 'Billing', href: '#pricing', icon: DollarSign },
    { label: 'Heritage Roasters & Goods (Boutique Cafe)', category: 'Stores', href: '#explorer', icon: Sparkles },
    { label: 'Lumina Tech & Audio (Electronics)', category: 'Stores', href: '#explorer', icon: Sparkles },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3 bg-slate-950 border-b border-slate-800">
            <Search className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command, search store, or jump to section..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
            />
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-400 rounded border border-slate-700 ml-2">
              ESC
            </kbd>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="p-2 max-h-80 overflow-y-auto space-y-1">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, idx) => (
                <a
                  key={idx}
                  href={cmd.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
                      <cmd.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {cmd.label}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {cmd.category}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
                </a>
              ))
            ) : (
              <div className="p-6 text-center text-xs font-mono text-slate-500">
                No matching command or store found.
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Use ↑ ↓ to navigate</span>
            <span>RateHub Command Palette</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
