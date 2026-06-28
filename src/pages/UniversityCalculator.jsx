import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import { allUniversities, getUniversityLogo } from '../data/universities';
import { Search, BookOpen, GraduationCap, ChevronRight, Calculator } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Fields' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'cs', label: 'Computing & CS' },
  { id: 'medical', label: 'Medical & Dental' },
  { id: 'business', label: 'Business & Social Sci' }
];

export default function UniversityCalculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter & Search Logic
  const filteredUniversities = useMemo(() => {
    return allUniversities.filter(uni => {
      const matchesSearch = 
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        uni.categories?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Framer Motion Variants for Grid & Cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen py-8 relative w-full flex flex-col text-ink dark:text-white">
      <Helmet>
        <title>University Aggregate & Merit Calculators 2026 | Dakhala</title>
        <meta name="description" content="Access aggregate and merit calculators for all top Pakistani universities including NUST, FAST, GIKI, UET, MDCAT, and ECAT. Select your university to compute." />
        <meta name="keywords" content="university aggregate calculator, university merit calculator, pakistani universities aggregate calculator, calculate nust aggregate, calculate fast aggregate, ecat aggregate calculator" />
      </Helmet>

      {/* ─── Breadcrumb ─── */}
      <div className="flex items-center gap-2 text-xs text-muted dark:text-white/40 font-medium mb-6 select-none">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink dark:text-white/80 font-bold">University Calculators</span>
      </div>

      {/* ─── Hero Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 text-center md:text-left">
        <div className="space-y-4 flex-1">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none flex flex-col md:flex-row md:items-center gap-3">
            <span className="text-ink dark:text-white">
              University Calculators
            </span>
            <span className="text-muted/20 dark:text-white/20 hidden md:inline">|</span>
            <span className="text-black dark:text-gold text-2xl md:text-3xl font-extrabold flex items-center gap-2">
              <Calculator className="w-7 h-7 animate-pulse text-black dark:text-gold" />
              HEC & IBCC Standardized
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted dark:text-white/60 font-medium max-w-3xl leading-relaxed">
            Select any university to calculate your precise aggregate, review test subjects weightages, explore campus options, and match against historical merit cutoffs.
          </p>
        </div>
        <EduAnimation type="calculator" />
      </div>

      {/* ─── Search & Filters Bar ─── */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-border dark:border-white/5">
        {/* Search Field */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search university name, short-code, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-white/[0.03] border border-border dark:border-white/10 rounded-2xl text-ink dark:text-white font-semibold text-sm placeholder:text-muted/40 dark:placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all shadow-sm"
          />
          <Search className="w-5 h-5 text-muted/30 dark:text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none select-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                  : 'bg-white/80 dark:bg-white/[0.03] text-muted dark:text-white/60 border border-border dark:border-white/10 hover:border-gold dark:hover:border-white/20 hover:text-ink dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Grid Listing ─── */}
      {filteredUniversities.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredUniversities.map((uni) => (
            <Link key={uni.id} to={`/calculator/university/${uni.slug}`} className="block h-full">
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} transitionSpeed={2000} className="h-full">
                <motion.div
                  variants={cardVariants}
                  className="group relative h-full bg-white/60 dark:bg-white/[0.02] hover:bg-white/95 dark:hover:bg-white/[0.04] border border-border dark:border-white/[0.08] hover:border-gold dark:hover:border-white/20 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden"
                >
                {/* Dynamic Border Glow on Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${uni.colorHex || '#000000'}, transparent 70%)`
                  }}
                />

                <div className="space-y-4 relative z-10">
                  {/* Top Header inside Card */}
                  <div className="flex justify-between items-start">
                    {/* Badge logo */}
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/90 p-1.5 shadow-md border border-border dark:border-white/10 overflow-hidden relative"
                    >
                      <img 
                        src={getUniversityLogo(uni.id)} 
                        alt={`${uni.shortName} Logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <span className="hidden relative z-10 logo-font text-ink font-bold text-xs">{uni.shortName.substring(0, 3)}</span>
                    </div>

                    {/* Sector Tag */}
                    <span className="px-2.5 py-1 bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-lg text-[9px] text-muted dark:text-white/50 font-bold uppercase tracking-wider">
                      {uni.city}
                    </span>
                  </div>

                  {/* Name and Shortname */}
                  <div>
                    <h3 className="text-lg font-bold text-ink dark:text-white leading-tight group-hover:text-gold dark:group-hover:text-gold transition-colors flex items-center gap-1.5">
                      {uni.shortName}
                    </h3>
                    <p className="text-[11px] text-muted dark:text-white/40 font-medium line-clamp-2 mt-1">
                      {uni.name}
                    </p>
                  </div>
                </div>

                {/* Footer details inside Card */}
                <div className="pt-6 mt-6 border-t border-border dark:border-white/5 flex items-center justify-between text-xs text-muted dark:text-white/60 font-semibold relative z-10">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-muted/30 dark:text-white/30" />
                    <span>{uni.entryTest}</span>
                  </div>

                  <span className="text-gold text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Calc <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            </Tilt>
          </Link>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white/60 dark:bg-white/[0.02] border border-border dark:border-white/[0.08] rounded-3xl">
          <GraduationCap className="w-16 h-16 text-muted/20 dark:text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-ink dark:text-white">No Universities Found</h3>
          <p className="text-muted/40 dark:text-white/40 text-sm mt-1 max-w-xs mx-auto">
            Try adjusting your search filters or clear the query to see all institutions.
          </p>
        </div>
      )}
    </div>
  );
}
