import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, UserCircle, X } from 'lucide-react';
import AccessibilityPanel from './AccessibilityPanel';
import AuthPanel from './AuthPanel';

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState(null); // 'accessibility' | 'auth' | null

  const toggleTab = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <>
      {/* Overlay when sidebar is open */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveTab(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Buttons on the Right */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-50">
        <button
          onClick={() => toggleTab('accessibility')}
          className="group relative bg-ink dark:bg-cloudy text-cloudy dark:text-ink p-3 rounded-l-xl shadow-lg hover:pr-5 transition-all duration-300"
          title="Accessibility Options"
        >
          <Moon className="w-5 h-5" />
          <span className="absolute right-full mr-2 px-2 py-1 bg-ink dark:bg-cloudy text-cloudy dark:text-ink text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2 pointer-events-none">
            Accessibility
          </span>
        </button>
        <button
          onClick={() => toggleTab('auth')}
          className="group relative bg-ink dark:bg-cloudy text-cloudy dark:text-ink p-3 rounded-l-xl shadow-lg hover:pr-5 transition-all duration-300"
          title="Login / Portals"
        >
          <UserCircle className="w-5 h-5" />
          <span className="absolute right-full mr-2 px-2 py-1 bg-ink dark:bg-cloudy text-cloudy dark:text-ink text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2 pointer-events-none">
            Login
          </span>
        </button>
      </div>

      {/* Floating Popover Panel */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 15, y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: 0, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.92, x: 15, y: '-50%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="fixed z-50 flex flex-col overflow-hidden bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 shadow-2xl rounded-3xl bottom-4 right-4 left-4 sm:left-auto sm:right-16 sm:top-1/2 sm:bottom-auto w-auto sm:w-[320px] max-h-[80vh]"
            style={{ y: '-50%' }} // standard positioning fallback
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
              <h2 className="text-sm font-black uppercase tracking-wider text-ink dark:text-cloudy">
                {activeTab === 'accessibility' ? 'Accessibility Control' : 'Account Portals'}
              </h2>
              <button
                onClick={() => setActiveTab(null)}
                className="p-1.5 text-muted hover:text-ink dark:hover:text-cloudy rounded-full hover:bg-gray-150 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gold dark:scrollbar-thumb-gold/50">
              {activeTab === 'accessibility' ? <AccessibilityPanel /> : <AuthPanel onNavigate={() => setActiveTab(null)} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
