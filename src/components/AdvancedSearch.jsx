import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Send, Command, MapPin, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    // Simulate AI parsing delay
    setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsSearching(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  // Generate dynamic AI autocomplete suggestions
  const getSuggestions = () => {
    const q = query.trim();
    if (!q) {
      return [
        { text: "Compare NUST and GIKI for Computer Science", icon: <GraduationCap className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-100" },
        { text: "Public medical colleges in Sindh with lowest merit", icon: <MapPin className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-100" },
        { text: "Which universities offer Artificial Intelligence?", icon: <Sparkles className="w-4 h-4" />, color: "text-purple-600", bg: "bg-purple-100" }
      ];
    }

    // Dynamic AI guesses based on current input
    return [
      { text: `${q} in Punjab with hostel facility`, icon: <MapPin className="w-4 h-4" />, color: "text-green-600", bg: "bg-green-100" },
      { text: `Compare ${q} vs top public universities`, icon: <Command className="w-4 h-4" />, color: "text-orange-600", bg: "bg-orange-100" },
      { text: `${q} fee structure and closing merit`, icon: <GraduationCap className="w-4 h-4" />, color: "text-indigo-600", bg: "bg-indigo-100" }
    ];
  };

  const suggestions = getSuggestions();

  return (
    <div className="w-full max-w-xl mx-auto relative mb-12 z-50">
      {/* Floating Label / AI Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -top-7 left-4 flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-widest bg-white/90 backdrop-blur-md px-3 py-1 rounded-t-lg border-t border-x border-gold/30"
      >
        <Sparkles className="w-3.5 h-3.5" /> AI Powered Search
      </motion.div>

      <motion.form
        onSubmit={handleSearch}
        className={`relative bg-white/80 backdrop-blur-2xl rounded-2xl border-2 transition-all duration-300 shadow-2xl ${
          isFocused ? 'border-gold shadow-gold/20' : 'border-border/60 hover:border-gold/50'
        }`}
      >
        {/* Animated Glow when focused */}
        {isFocused && (
          <motion.div
            layoutId="search-glow"
            className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-gold/40 via-[#00FFB3]/40 to-gold/40 blur-md -z-10"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 200%' }}
          />
        )}

        <div className="relative flex items-start p-2">
          <div className="pt-3 pl-3 text-gold">
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            ) : (
              <Search className="w-6 h-6 text-ink/40" />
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Type anything... e.g., Software Engineering under 80% aggregate"
            className="flex-1 w-full min-h-[60px] max-h-[120px] bg-transparent resize-none outline-none py-3 px-4 text-ink text-lg font-medium placeholder-ink/30"
            style={{ overflowY: query.length > 100 ? 'auto' : 'hidden' }}
            disabled={isSearching}
          />

          <div className="pt-2 pr-2 flex items-center">
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                query.trim() && !isSearching
                  ? 'bg-ink text-white hover:bg-gold shadow-lg hover:-translate-y-0.5'
                  : 'bg-cloudy text-ink/30 cursor-not-allowed'
              }`}
            >
              {isSearching ? (
                <span className="text-sm font-bold px-2">Processing...</span>
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Dynamic AI Suggestions Dropdown */}
        <AnimatePresence>
          {isFocused && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="border-t border-border/50 overflow-hidden bg-white/95 backdrop-blur-xl rounded-b-2xl"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">
                    {query.trim() ? "AI Autocomplete Guesses" : "Trending Queries"}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {suggestions.map((sug, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setQuery(sug.text);
                        setIsFocused(true);
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-cloudy transition-colors flex items-center gap-3 group"
                    >
                      <div className={`${sug.bg} p-2 rounded-lg ${sug.color} group-hover:scale-110 transition-transform`}>
                        {sug.icon}
                      </div>
                      <span className="text-sm font-semibold text-ink group-hover:text-gold transition-colors">
                        {sug.text}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gold/10 text-goldDark text-xs font-bold rounded-full border border-gold/20">Focus: AI & NLP</span>
                  <span className="px-3 py-1 bg-maqsadBlue/10 text-blue-700 text-xs font-bold rounded-full border border-blue-200">Pre-Medical</span>
                  <span className="px-3 py-1 bg-maqsadOrange/10 text-orange-700 text-xs font-bold rounded-full border border-orange-200">Computing</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
