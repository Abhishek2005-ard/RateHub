import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Terminal,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  Code2,
  Layers,
  Compass,
  DollarSign,
  BookOpen
} from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode, onOpenCommandPalette, onOpenRegister, onOpenLogin, currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Version Pill */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                  Rate<span className="text-indigo-400">Hub</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    v2.4 API
                  </span>
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#explorer"
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              Store Explorer
            </a>
            <a
              href="#playground"
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
            >
              <Code2 className="w-4 h-4 text-purple-400" />
              Widget Builder
            </a>
            <a
              href="#features"
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              Architecture
            </a>
            <a
              href="#pricing"
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              Pricing
            </a>
            <a
              href="#api-docs"
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              Docs
            </a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            
            {/* Status indicator */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              99.99% SLA
            </div>

            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-all shadow-sm"
              title="Open Command Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-900 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Auth Buttons: Sign In & Register or Logged in badge */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{currentUser.name}</span>
              </div>
            ) : (
              <>
                <button
                  onClick={onOpenLogin}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
                >
                  Sign In
                </button>

                <button
                  onClick={onOpenRegister}
                  className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Register
                </button>
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-800 bg-[#090D16] px-4 pt-2 pb-6 space-y-3"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 mb-2">
              <Search className="w-4 h-4 text-slate-400" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommandPalette();
                }}
                className="text-xs text-slate-400 text-left w-full"
              >
                Press <span className="font-mono bg-slate-800 text-slate-200 px-1 py-0.5 rounded">⌘K</span> for commands
              </button>
            </div>
            
            {[
              { label: 'Store Explorer', href: '#explorer', icon: Compass },
              { label: 'Widget Builder', href: '#playground', icon: Code2 },
              { label: 'Architecture', href: '#features', icon: Layers },
              { label: 'Pricing', href: '#pricing', icon: DollarSign },
              { label: 'API Docs', href: '#api-docs', icon: BookOpen },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-indigo-400" />
                  {item.label}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}

            <div className="pt-2">
              <a
                href="#playground"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm shadow-md"
              >
                <Terminal className="w-4 h-4" />
                Get API Key
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
