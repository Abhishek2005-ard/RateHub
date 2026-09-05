import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StoreExplorer from './components/StoreExplorer';
import WidgetPlayground from './components/WidgetPlayground';
import DeveloperFeatures from './components/DeveloperFeatures';
import ApiSnippetSection from './components/ApiSnippetSection';
import MetricsSection from './components/MetricsSection';
import PricingSection from './components/PricingSection';
import CommandPalette from './components/CommandPalette';
import Footer from './components/Footer';

// Auth Modals
import RegisterModal from './components/auth/RegisterModal';
import LoginModal from './components/auth/LoginModal';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Auth Modals State
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  // Global keydown listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'bg-[#090D16] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-indigo-500/40 backdrop-blur-md"
          >
            <div className="bg-amber-400 text-slate-950 p-1 rounded-full">
              <Star className="w-4 h-4 fill-slate-950" />
            </div>
            <span className="text-xs sm:text-sm font-mono font-medium">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onRateDemo={(stars) => showToast(`Demo API Received ${stars}/5 Star Rating! (12ms)`)}
      />

      {/* Benchmark Stats Section */}
      <MetricsSection />

      {/* Store Explorer Directory */}
      <StoreExplorer
        onRateStore={(storeName, stars) => showToast(`Successfully rated ${storeName} ${stars}/5 stars!`)}
      />

      {/* Widget Playground */}
      <WidgetPlayground />

      {/* Developer Bento Features */}
      <DeveloperFeatures />

      {/* REST API & Webhooks Testing */}
      <ApiSnippetSection />

      {/* Pricing Tiers */}
      <PricingSection />

      {/* Footer */}
      <Footer />

      {/* Cmd + K Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Normal User Registration Modal */}
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
        onRegisterSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome ${user.name}! Your account has been registered.`);
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Logged in as ${user.name}`);
        }}
      />

    </div>
  );
}
