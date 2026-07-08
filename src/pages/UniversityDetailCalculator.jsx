import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUniversityLogo } from '../data/universities';
import { useDataStore } from '../store/useDataStore';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { useAuthStore } from '../store/useAuthStore';
import Campus3DModel from '../components/Campus3DModel';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import EditableBlock from '../components/EditableBlock';
import { logCalculation } from '../lib/telemetry';
import { toPng } from 'html-to-image';
import ScorecardImage from '../components/ScorecardImage';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import {
  ChevronRight, GraduationCap, Calculator, Target, Info,
  Share2, Check, CheckCircle2, AlertCircle, XCircle, Copy,
  MessageSquare, Clock, BookOpen, Award, BarChart3, Zap,
  MapPin, Building2, TrendingUp, ChevronDown, Settings
} from 'lucide-react';

export default function UniversityDetailCalculator() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { universities, updateUniversity } = useDataStore();
  const uni = universities.find(u => u.slug === slug);

  const scorecardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeTab, setActiveTab] = useState(uni?.slug === 'fast-nuces' ? 'test marks' : 'merit calc');
  const [rightPanelTab, setRightPanelTab] = useState('campus');
  const [selectedProgramGroup, setSelectedProgramGroup] = useState(0);
  const [selectedEdSystem, setSelectedEdSystem] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('');
  const [selectedMeritCampus, setSelectedMeritCampus] = useState('');
  const [selectedProgramName, setSelectedProgramName] = useState('');
  const [copied, setCopied] = useState(false);

  // Accessibility state
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [monochrome, setMonochrome] = useState(false);
  const [invertColors, setInvertColors] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [zoomScale, setZoomScale] = useState(100);

  // Calculator stores
  const {
    matricObt, matricTotal, fscObt, fscTotal,
    setMatricObt, setMatricTotal, setFscObt, setFscTotal
  } = useCalculatorStore();

  // Test states
  const [skipTestCalc, setSkipTestCalc] = useState(false);
  const [totalMcqs, setTotalMcqs] = useState(100);
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState('');
  const [negMarking, setNegMarking] = useState(false);
  const [deduction, setDeduction] = useState(0.25);
  const [testPercent, setTestPercent] = useState('');
  const [matricPercent, setMatricPercent] = useState('');
  const [fscPercent, setFscPercent] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [liveAggregate, setLiveAggregate] = useState(0);
  const [slipData, setSlipData] = useState({});

  // 3D rotation state
  const [rotationY, setRotationY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Redirect if university not found
  useEffect(() => {
    if (!uni) navigate('/calculator/university');
  }, [uni, navigate]);

  // Init defaults
  useEffect(() => {
    if (!uni) return;
    if (uni.educationSystems?.length) setSelectedEdSystem(uni.educationSystems[0]);
    if (uni.entryTestTypes?.length) setSelectedTestType(uni.entryTestTypes[0]);
    if (uni.campuses?.length) setSelectedMeritCampus(uni.campuses[0]);
    if (uni.programs?.length) setSelectedProgramName(uni.programs[0].name);

    // Test pattern defaults
    if (uni.testPattern) {
      setTotalMcqs(uni.testPattern.totalMarks || uni.testPattern.totalMcqs);
      const hasNeg = uni.testPattern.tags?.includes('Negative Marking');
      setNegMarking(hasNeg);
      setDeduction(hasNeg ? 0.25 : 0);
    }
  }, [uni]);

  // Accessibility Effects
  useEffect(() => {
    if (!readingGuide) {
      document.body.classList.remove('reading-guide-active');
      return;
    }
    document.body.classList.add('reading-guide-active');
    
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--guide-top', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [readingGuide]);

  useEffect(() => {
    const list = document.body.classList;
    if (dyslexiaFont) list.add('dyslexia-active');
    else list.remove('dyslexia-active');
  }, [dyslexiaFont]);

  useEffect(() => {
    const list = document.body.classList;
    if (highContrast) list.add('contrast-active');
    else list.remove('contrast-active');
  }, [highContrast]);

  useEffect(() => {
    const list = document.body.classList;
    if (monochrome) list.add('monochrome-active');
    else list.remove('monochrome-active');
  }, [monochrome]);

  useEffect(() => {
    const list = document.body.classList;
    if (invertColors) list.add('invert-active');
    else list.remove('invert-active');
  }, [invertColors]);

  useEffect(() => {
    document.body.style.fontSize = zoomScale === 100 ? '' : `${zoomScale}%`;
    return () => {
      document.body.style.fontSize = '';
    };
  }, [zoomScale]);

  // Get active formula based on selected program group and education system
  const getActiveFormula = () => {
    if (!uni) return { matric: 0, fsc: 0, test: 0 };
    if (uni.programGroups?.length > 0) {
      const group = uni.programGroups[selectedProgramGroup];
      if (group?.formulas?.[selectedEdSystem]) {
        return group.formulas[selectedEdSystem];
      }
    }
    return uni.formula || { matric: 0, fsc: 0, test: 0 };
  };

  const activeFormula = getActiveFormula();

  // Auto calc percentages
  useEffect(() => {
    const obt = parseFloat(matricObt);
    const tot = parseFloat(matricTotal);
    if (!isNaN(obt) && !isNaN(tot) && tot > 0) setMatricPercent(((obt / tot) * 100).toFixed(2));
  }, [matricObt, matricTotal]);

  useEffect(() => {
    const obt = parseFloat(fscObt);
    const tot = parseFloat(fscTotal);
    if (!isNaN(obt) && !isNaN(tot) && tot > 0) setFscPercent(((obt / tot) * 100).toFixed(2));
  }, [fscObt, fscTotal]);

  // Auto calc test percent
  useEffect(() => {
    const correct = parseFloat(correctAnswers) || 0;
    const wrong = parseFloat(wrongAnswers) || 0;
    const deductVal = negMarking ? (parseFloat(deduction) || 0) : 0;
    let score = correct - (wrong * deductVal);
    const percentage = totalMcqs > 0 ? (score / totalMcqs) * 100 : 0;
    if (!skipTestCalc) setTestPercent(Math.max(0, percentage).toFixed(2));
  }, [correctAnswers, wrongAnswers, negMarking, deduction, totalMcqs, skipTestCalc]);

  // Live aggregate
  useEffect(() => {
    const mP = parseFloat(matricPercent) || 0;
    const fP = parseFloat(fscPercent) || 0;
    const tP = parseFloat(testPercent) || 0;
    const agg = (mP * (activeFormula.matric / 100)) + (fP * (activeFormula.fsc / 100)) + (tP * (activeFormula.test / 100));
    setLiveAggregate(agg);
  }, [matricPercent, fscPercent, testPercent, activeFormula]);

  // Telemetry: Debounced calculation logger
  useEffect(() => {
    if (liveAggregate > 0 && uni?.id) {
      const timer = setTimeout(() => {
        logCalculation(uni.id, liveAggregate.toFixed(2));
      }, 1500); // 1.5s debounce to avoid flooding telemetry on active typing
      return () => clearTimeout(timer);
    }
  }, [liveAggregate, uni?.id]);

  const generateShareText = () => {
    if (!uni) return '';

    // Build per-campus department admission chances
    let campusLines = '';
    const campusKeys = uni.meritData?.campuses ? Object.keys(uni.meritData.campuses) : [];

    if (campusKeys.length > 0) {
      campusKeys.forEach(campusName => {
        const campusData = uni.meritData.campuses[campusName];
        if (!campusData || Object.keys(campusData).length === 0) return;

        campusLines += `\n🔥 Campus: ${campusName}\nDepartment Admission Chances:\n`;

        Object.entries(campusData).forEach(([progName, yearsData]) => {
          const meritsObj = {};
          Object.entries(yearsData).forEach(([yr, val]) => {
            meritsObj[yr] = typeof val === 'string' ? parseFloat(val.replace('%', '')) : val;
          });
          const cutoff = meritsObj[2025] || 70.0;
          const diff = liveAggregate - cutoff;
          let statusText = 'Likely Admission';
          if (diff < -2.0) statusText = 'Tough Chance';
          else if (diff < 1.0) statusText = 'Borderline';
          campusLines += `• ${progName}: ${statusText} (${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%)\n`;
        });
      });
    } else if (uni.programs?.length > 0) {
      campusLines += '\nDepartment Admission Chances:\n';
      uni.programs.forEach(p => {
        const cutoff = p.merits?.[2025] || 70.0;
        const diff = liveAggregate - cutoff;
        let statusText = 'Likely Admission';
        if (diff < -2.0) statusText = 'Tough Chance';
        else if (diff < 1.0) statusText = 'Borderline';
        campusLines += `• ${p.name}: ${statusText} (${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%)\n`;
      });
    }

    return `🎓 MY ADMISSIONS SCORECARD (${uni.shortName})
University: ${uni.name} (${uni.shortName})
----------------------------------
Matric/O-Levels Equivalent: ${matricPercent || '0.00'}%
FSc/A-Levels Equivalent: ${fscPercent || '0.00'}%
Entry Test (${uni.entryTest}): ${testPercent || '0.00'}%
----------------------------------
🔥 MY CALCULATED AGGREGATE: ${liveAggregate.toFixed(2)}%
${campusLines}
Calculate your aggregate instantly on Dakhala:
👉 ${window.location.origin}/calculator/university/${uni.slug}`;
  };

  const [saveStatus, setSaveStatus] = useState('');
  const { user } = useAuthStore();

  const handleSaveToPortal = () => {
    if (!user) {
      setSaveStatus('Login required');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }
    const currentCalcs = JSON.parse(localStorage.getItem('dakhala-saved-aggregates') || '[]');
    const progName = uni.programGroups?.length > 0 
      ? uni.programGroups[selectedProgramGroup]?.groupName 
      : selectedProgramName;

    const newCalc = {
      id: Date.now().toString(),
      uniId: uni.id,
      uniSlug: uni.slug,
      uniShortName: uni.shortName,
      program: progName || 'General',
      aggregate: liveAggregate.toFixed(2),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      matricPercent: matricPercent || '0.00',
      fscPercent: fscPercent || '0.00',
      testPercent: testPercent || '0.00'
    };

    localStorage.setItem('dakhala-saved-aggregates', JSON.stringify([newCalc, ...currentCalcs]));
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      // Give a tiny delay to ensure React renders the hidden component fully
      await new Promise(r => setTimeout(r, 100));
      
      if (!scorecardRef.current) return;
      
      const dataUrl = await toPng(scorecardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      // Try native share for mobile devices
      if (navigator.share) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], `${uni.shortName}_Scorecard.png`, { type: 'image/png' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `${uni.name} Admission Scorecard`,
              text: `Check out my admission chances for ${uni.name}!`,
            });
            return;
          }
        } catch (shareError) {
          console.log("Native share failed or cancelled, falling back to download", shareError);
        }
      }
      
      // Fallback: download on desktop
      const link = document.createElement('a');
      link.download = `${uni.shortName}_Admission_Scorecard.png`;
      link.href = dataUrl;
      link.click();
      
    } catch (err) {
      console.error('Error generating image', err);
      // Ultimate fallback: open whatsapp text
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(generateShareText())}`, '_blank');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!uni) return null;

  return (
    <div className="min-h-[80vh] py-6 relative w-full flex flex-col">
      <Helmet>
        <title>{uni.name} ({uni.shortName}) Aggregate Calculator 2026 | {uni.entryTest} Merit Calculator</title>
        <meta name="description" content={`Calculate your ${uni.name} (${uni.shortName}) aggregate merit score online for admissions 2026. Verified formula weightage: Matric, FSc, and ${uni.entryTest} entry test.`} />
        <meta name="keywords" content={`${uni.name} aggregate calculator, ${uni.shortName} aggregate calculator, ${uni.entryTest} aggregate calculator, ${uni.shortName} merit calculator, ${uni.shortName} aggregate formula, university merit calculator Pakistan, admissions 2026`} />
      </Helmet>

      {/* ─── Hero Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mb-8 relative overflow-hidden rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${uni.colorHex}15, ${uni.colorHex}05, transparent)`
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: `${uni.colorHex}20` }} />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Logo Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center bg-white p-2.5 shadow-2xl relative overflow-hidden flex-shrink-0 border-2 border-white/20"
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
            <span className="hidden relative z-10 logo-font text-xl md:text-2xl text-ink font-extrabold">
              {uni.shortName.substring(0, 4)}
            </span>
          </motion.div>

          {/* Title & Meta */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gold/15 text-goldDark border border-gold/25 text-[10px] font-extrabold uppercase tracking-wider rounded-lg backdrop-blur-sm">
                Dedicated Calculator
              </span>
              <span className="px-3 py-1 bg-ink/5 dark:bg-white/5 text-ink/70 dark:text-white/70 border border-border dark:border-white/10 text-[10px] font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                <EditableBlock value={uni.city} onSave={(val) => updateUniversity(uni.id, { city: val })} />
              </span>
              {uni.categories?.map(cat => (
                <span key={cat} className="px-2.5 py-0.5 bg-white/60 dark:bg-white/10 text-ink/50 dark:text-white/50 border border-border/60 dark:border-white/10 text-[9px] font-bold uppercase tracking-widest rounded-md">
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-ink dark:text-white tracking-tight leading-tight">
              <EditableBlock value={uni.name} onSave={(val) => updateUniversity(uni.id, { name: val })} />
              <span className="text-black dark:text-gold ml-2 text-lg md:text-2xl font-extrabold">
                (<EditableBlock value={uni.shortName} onSave={(val) => updateUniversity(uni.id, { shortName: val })} />)
              </span>
            </h1>

            <p className="text-xs md:text-sm text-muted dark:text-white/60 font-medium max-w-2xl">
              IBCC Standardized Metrics • Fee: PKR <EditableBlock value={uni.feePerSemester} type="number" onSave={(val) => updateUniversity(uni.id, { feePerSemester: Number(val) })} />/semester • <EditableBlock value={uni.entryTest} onSave={(val) => updateUniversity(uni.id, { entryTest: val })} />
            </p>
          </div>

          <div className="hidden md:block">
            <EduAnimation type="calculator" />
          </div>
        </div>
      </motion.div>

      {/* ─── Two Column Dashboard Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative w-full text-[13px] select-none text-ink dark:text-white">
        
        {/* ══════ COLUMN 1: Dark tabbed Calculator Card (col-span-8) ══════ */}
        <div className="lg:col-span-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flat-card p-6 md:p-8 relative flex flex-col space-y-6 text-ink dark:text-white"
          >
            {/* Top Tab Bar (exact style as screenshot) */}
            <div className="flex border-b border-border/70 dark:border-white/10 select-none pb-0 relative overflow-x-auto">
              {[ ...(uni.slug === 'fast-nuces' ? ['Test Marks'] : []), 'Merit Calc', 'Results', 'Merit', 'Pattern'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`flex-1 pb-3 md:pb-4 text-xs md:text-sm font-bold uppercase tracking-wider transition-all relative text-center ${
                    activeTab === tab.toLowerCase() ? 'text-ink dark:text-white' : 'text-ink/40 dark:text-white/40 hover:text-ink/75 dark:hover:text-white/70'
                  }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <motion.div layoutId="calcTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1D2E28]" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="space-y-6">
              {activeTab === 'merit calc' && (
                <div className="space-y-6">
                  {/* Live Aggregate Hub Banner */}
                  <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-[#1D2E28]/10 to-gold/10 border-[#1D2E28]/20">
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-[#25A18E] tracking-wider">Live Aggregate Hub</h4>
                      <p className="text-[11px] text-muted dark:text-white/50">Running aggregate estimates update in real-time as you enter your scores below.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/80 dark:bg-black/20 border border-border dark:border-white/10 px-4 py-2.5 rounded-xl shadow-lg">
                      <span className="text-xs font-bold text-ink/70 dark:text-white/70">Running Aggregate:</span>
                      <span className="text-2xl font-black text-gold dark:text-gold animate-pulse">{liveAggregate.toFixed(2)}%</span>
                    </div>
                  </div>
                  {/* Select Program */}
                  {(uni.programGroups?.length > 0 || uni.programs?.length > 0) && (
                    <div className="space-y-2">
                      <label className="block text-ink/80 dark:text-white/80 font-bold text-sm">Select Program</label>
                      <div className="relative">
                        {uni.programGroups?.length > 0 ? (
                          <select
                            value={selectedProgramGroup}
                            onChange={(e) => setSelectedProgramGroup(Number(e.target.value))}
                            className="w-full p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm appearance-none cursor-pointer focus:border-[#1D2E28] focus:outline-none transition-colors"
                          >
                            {uni.programGroups.map((g, i) => (
                              <option key={i} value={i} className="bg-cloudy dark:bg-[#0A1128] text-ink dark:text-white">{g.groupName}</option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={selectedProgramName}
                            onChange={(e) => setSelectedProgramName(e.target.value)}
                            className="w-full p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm appearance-none cursor-pointer focus:border-[#1D2E28] focus:outline-none transition-colors"
                          >
                            {uni.programs.map((p, i) => (
                              <option key={i} value={p.name} className="bg-cloudy dark:bg-[#0A1128] text-ink dark:text-white">{p.name}</option>
                            ))}
                          </select>
                        )}
                        <ChevronDown className="w-5 h-5 text-ink/40 dark:text-white/40 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Education System Toggle */}
                  {uni.educationSystems?.length > 1 && (
                    <div className="space-y-2">
                      <label className="block text-ink/60 dark:text-white/60 font-bold text-xs uppercase tracking-wider">Education System</label>
                      <div className="flex gap-2 flex-wrap">
                        {uni.educationSystems.map(sys => (
                          <button
                            key={sys}
                            type="button"
                            onClick={() => setSelectedEdSystem(sys)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                              selectedEdSystem === sys
                                ? 'bg-[#1D2E28] text-white border-[#1D2E28] shadow-md shadow-[#1D2E28]/20'
                                : 'bg-white/40 dark:bg-white/[0.02] text-ink/70 dark:text-white/60 border-border dark:border-white/10 hover:border-gold'
                            }`}
                          >
                            {sys}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matric Marks Input Group */}
                  {activeFormula.matric > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-ink/80 dark:text-white/80 font-bold text-sm">Matric Marks</label>
                        <span className="text-[#25A18E] text-sm font-bold">{activeFormula.matric}%</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4">
                        <input
                          type="number"
                          placeholder="Obtained"
                          value={matricObt}
                          onChange={e => setMatricObt(e.target.value)}
                          className="flex-1 min-w-0 p-3 sm:p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm placeholder-ink/20 dark:placeholder-white/20 focus:border-[#1D2E28] focus:outline-none transition-colors"
                        />
                        <span className="text-ink/40 dark:text-white/40 font-bold text-lg">/</span>
                        <input
                          type="number"
                          placeholder="Total"
                          value={matricTotal}
                          onChange={e => setMatricTotal(e.target.value)}
                          className="w-20 sm:w-32 p-3 sm:p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm placeholder-ink/20 dark:placeholder-white/20 focus:border-[#1D2E28] focus:outline-none transition-colors text-center"
                        />
                      </div>
                    </div>
                  )}

                  {/* Intermediate Marks Input Group */}
                  {activeFormula.fsc > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-ink/80 dark:text-white/80 font-bold text-sm">Intermediate Marks</label>
                        <span className="text-[#25A18E] text-sm font-bold">{activeFormula.fsc}%</span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4">
                        <input
                          type="number"
                          placeholder="Obtained"
                          value={fscObt}
                          onChange={e => setFscObt(e.target.value)}
                          className="flex-1 min-w-0 p-3 sm:p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm placeholder-ink/20 dark:placeholder-white/20 focus:border-[#1D2E28] focus:outline-none transition-colors"
                        />
                        <span className="text-ink/40 dark:text-white/40 font-bold text-lg">/</span>
                        <input
                          type="number"
                          placeholder="Total"
                          value={fscTotal}
                          onChange={e => setFscTotal(e.target.value)}
                          className="w-20 sm:w-32 p-3 sm:p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm placeholder-ink/20 dark:placeholder-white/20 focus:border-[#1D2E28] focus:outline-none transition-colors text-center"
                        />
                      </div>
                    </div>
                  )}

                  {/* Entry Test Input Group */}
                  {activeFormula.test > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-ink/80 dark:text-white/80 font-bold text-sm">Entry Test Marks</label>
                        <span className="text-[#25A18E] text-sm font-bold">{activeFormula.test}%</span>
                      </div>
                      
                      {/* Entry Test Type Toggles if multiple exist */}
                      {uni.entryTestTypes?.length > 1 && (
                        <div className="flex gap-2 pb-2">
                          {uni.entryTestTypes.map(tt => (
                            <button
                              key={tt}
                              type="button"
                              onClick={() => setSelectedTestType(tt)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                selectedTestType === tt
                                  ? 'bg-[#1D2E28] text-white border-[#1D2E28]'
                                  : 'bg-white/40 dark:bg-white/[0.02] text-ink/50 dark:text-white/50 border-border dark:border-white/10 hover:border-gold'
                              }`}
                            >
                              {tt}
                            </button>
                          ))}
                        </div>
                      )}

                      {!skipTestCalc ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 md:gap-4">
                            <input
                              type="number"
                              placeholder="Obtained Marks (Correct Answers)"
                              value={correctAnswers}
                              onChange={e => setCorrectAnswers(e.target.value)}
                              className="flex-1 min-w-0 p-3 sm:p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm placeholder-ink/20 dark:placeholder-white/20 focus:border-[#1D2E28] focus:outline-none transition-colors"
                            />
                            <span className="text-ink/40 dark:text-white/40 font-bold text-lg">/</span>
                            <input
                              type="number"
                              placeholder="Total MCQs"
                              value={totalMcqs}
                              onChange={e => setTotalMcqs(e.target.value)}
                              className="w-20 sm:w-32 p-3 sm:p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm placeholder-ink/20 dark:placeholder-white/20 focus:border-[#1D2E28] focus:outline-none transition-colors text-center"
                            />
                          </div>
                          
                          {/* Negative Marking settings in MCQs calculator */}
                          {uni.testPattern && (
                            <div className="flex items-center gap-4 py-1.5 px-3 bg-white/20 dark:bg-white/[0.01] rounded-xl border border-border dark:border-white/5 text-[11px] text-ink/60 dark:text-white/60">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={negMarking}
                                  onChange={e => setNegMarking(e.target.checked)}
                                  className="rounded border-border dark:border-white/10 bg-white/40 dark:bg-white/[0.02] text-[#1D2E28] focus:ring-0"
                                />
                                <span>Enable Negative Marking</span>
                              </label>
                              {negMarking && (
                                <div className="flex items-center gap-1.5">
                                  <span>Deduction:</span>
                                  <input
                                    type="number"
                                    step="0.05"
                                    value={deduction}
                                    onChange={e => setDeduction(parseFloat(e.target.value))}
                                    className="w-14 p-1 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded text-center text-ink dark:text-white"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setSkipTestCalc(true)}
                            className="text-[11px] text-[#25A18E] font-bold hover:underline"
                          >
                            Enter percentage directly →
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 md:gap-4">
                            <input
                              type="number"
                              placeholder="Obtained Percentage"
                              value={testPercent}
                              onChange={e => setTestPercent(e.target.value)}
                              className="flex-1 min-w-0 p-3 sm:p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-ink dark:text-white font-semibold text-sm placeholder-ink/20 dark:placeholder-white/20 focus:border-[#1D2E28] focus:outline-none transition-colors"
                            />
                            <span className="text-ink/40 dark:text-white/40 font-bold text-lg">/</span>
                            <div className="w-20 sm:w-32 p-3 sm:p-4 bg-white/30 dark:bg-white/[0.01] border border-border dark:border-white/10 rounded-xl text-ink/40 dark:text-white/40 font-semibold text-sm text-center flex items-center justify-center">
                              100
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSkipTestCalc(false)}
                            className="text-[11px] text-[#25A18E] font-bold hover:underline"
                          >
                            ← Use MCQs calculator
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Calculate Button & Guide */}
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('results')}
                      className="px-8 py-3.5 bg-[#1D2E28] hover:bg-[#1D2E28]/90 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-[#1D2E28]/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      Calculate Aggregate
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsGuideOpen(true)}
                      className="px-6 py-3.5 bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 text-[#1D2E28] dark:text-white font-bold text-sm uppercase tracking-wider rounded-xl border border-border dark:border-white/10 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                      How is it calculated?
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'test marks' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-border dark:border-white/10 pb-3">
                    <h4 className="font-extrabold text-ink dark:text-white text-sm uppercase tracking-wider flex items-center gap-2">
                      <span className="bg-[#25A18E]/20 text-[#25A18E] px-2 py-0.5 rounded text-[10px]">NEW</span> 
                      NU Test Slip Calculator
                    </h4>
                    <p className="text-xs text-muted dark:text-white/50 mt-1">Calculate your final entry test marks after negative marking (-0.25). Enter your total attempted and correct questions for each section from your physical slip.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {uni.testPattern?.subjects?.map(sub => {
                      const data = slipData[sub.name] || { att: '', corr: '' };
                      const att = Number(data.att) || 0;
                      const corr = Number(data.corr) || 0;
                      const wrong = Math.max(0, att - corr);
                      const penalty = wrong * 0.25;
                      const net = (corr - penalty) * (sub.weight || 1);
                      
                      return (
                        <div key={sub.name} className="bg-white/30 dark:bg-white/[0.01] p-3.5 rounded-xl border border-border dark:border-white/5 flex flex-col gap-3 justify-between">
                          <div className="flex justify-between items-start">
                            <h5 className="font-bold text-sm text-ink dark:text-white">{sub.name}</h5>
                            <p className="text-[11px] text-ink/60 dark:text-white/60 font-mono">Wt: {sub.weight || 1} | Max: {sub.mcqs}</p>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col">
                              <label className="text-[11px] uppercase tracking-wider font-bold text-ink/70 dark:text-white/70 mb-1">Attempted</label>
                              <input 
                                type="number" 
                                min="0" 
                                max={sub.mcqs}
                                value={data.att} 
                                onChange={e => setSlipData({...slipData, [sub.name]: {...data, att: e.target.value}})}
                                className="w-16 py-1.5 px-2 bg-white/50 dark:bg-black/20 border border-border dark:border-white/10 rounded-lg text-sm font-bold text-center focus:outline-none focus:border-[#1D2E28]"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[11px] uppercase tracking-wider font-bold text-ink/70 dark:text-white/70 mb-1">Correct</label>
                              <input 
                                type="number" 
                                min="0" 
                                max={data.att || sub.mcqs}
                                value={data.corr} 
                                onChange={e => setSlipData({...slipData, [sub.name]: {...data, corr: e.target.value}})}
                                className="w-16 py-1.5 px-2 bg-white/50 dark:bg-black/20 border border-border dark:border-white/10 rounded-lg text-sm font-bold text-center focus:outline-none focus:border-[#1D2E28]"
                              />
                            </div>
                            <div className="flex flex-col items-end justify-center">
                              <span className="text-[11px] uppercase tracking-wider font-bold text-ink/50 dark:text-white/50 mb-1">Score</span>
                              <span className={`text-lg font-black font-mono ${net >= 0 ? 'text-[#25A18E]' : 'text-rose-400'}`}>{net.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-[#1D2E28]/5 dark:bg-[#1D2E28]/20 p-5 rounded-2xl border border-[#1D2E28]/10 flex justify-between items-center mt-2">
                    <div>
                      <h4 className="font-extrabold text-[#1D2E28] dark:text-white">Total NU Test Score</h4>
                      <p className="text-[11px] text-ink/60 dark:text-white/60">Out of {uni.testPattern?.totalMarks || 100}</p>
                    </div>
                    <div className="text-3xl font-black text-goldDark">
                      {uni.testPattern?.subjects?.reduce((total, sub) => {
                        const data = slipData[sub.name] || { att: '', corr: '' };
                        const att = Number(data.att) || 0;
                        const corr = Number(data.corr) || 0;
                        const wrong = Math.max(0, att - corr);
                        const net = (corr - (wrong * 0.25)) * (sub.weight || 1);
                        return total + net;
                      }, 0).toFixed(2)}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const total = uni.testPattern?.subjects?.reduce((total, sub) => {
                        const data = slipData[sub.name] || { att: '', corr: '' };
                        const att = Number(data.att) || 0;
                        const corr = Number(data.corr) || 0;
                        const wrong = Math.max(0, att - corr);
                        const net = (corr - (wrong * 0.25)) * (sub.weight || 1);
                        return total + net;
                      }, 0);
                      setTestPercent(total.toFixed(2));
                      setSkipTestCalc(true);
                      setActiveTab('merit calc');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 bg-[#1D2E28] hover:bg-[#1D2E28]/90 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer mt-4"
                  >
                    Use this score in Merit Calc
                  </button>

                </div>
              )}

              {activeTab === 'results' && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Results Display Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/30 dark:bg-white/[0.01] p-6 rounded-2xl border border-border dark:border-white/5">
                    {/* Circle Gauge */}
                    <div className="flex flex-col items-center justify-center relative py-4">
                      <svg width="180" height="180" className="rotate-[-90deg]">
                        <circle cx="90" cy="90" r="75" fill="transparent" stroke="currentColor" className="text-ink/5 dark:text-white/5" strokeWidth="12" />
                        <motion.circle
                          cx="90" cy="90" r="75" fill="transparent"
                          stroke="#0B5D56" strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={471}
                          animate={{ strokeDashoffset: 471 - (471 * Math.min(liveAggregate, 100)) / 100 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-black text-ink dark:text-white">{liveAggregate.toFixed(2)}%</span>
                        <span className="text-[9px] uppercase text-ink/50 dark:text-white/50 tracking-widest mt-1">Calculated Aggregate</span>
                      </div>
                    </div>

                    {/* Breakdown details */}
                    <div className="space-y-4">
                      <h4 className="font-extrabold text-sm text-ink dark:text-white border-b border-border dark:border-white/10 pb-2">Contribution Breakdown</h4>
                      <div className="space-y-3 text-xs text-ink/70 dark:text-white/70">
                        <div className="flex justify-between items-center">
                          <span>Matric / O-Level ({activeFormula.matric}%)</span>
                          <span className="font-bold text-ink dark:text-white">{(parseFloat(matricPercent || 0) * (activeFormula.matric / 100)).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Intermediate / A-Level ({activeFormula.fsc}%)</span>
                          <span className="font-bold text-ink dark:text-white">{(parseFloat(fscPercent || 0) * (activeFormula.fsc / 100)).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Entry Test ({activeFormula.test}%)</span>
                          <span className="font-bold text-ink dark:text-white">{(parseFloat(testPercent || 0) * (activeFormula.test / 100)).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Admission Feasibility Cutoffs */}
                  <div className="space-y-4 bg-white/30 dark:bg-white/[0.01] p-6 rounded-2xl border border-border dark:border-white/5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border dark:border-white/10 pb-3">
                      <h3 className="text-sm font-extrabold text-ink dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-[#25A18E]" />
                        Admission Feasibility
                      </h3>
                      {uni.campuses?.length > 1 && (
                        <div className="flex items-center gap-1.5 select-none">
                          <span className="text-[10px] text-ink/40 dark:text-white/40 font-bold uppercase font-sans">Campus:</span>
                          <select
                            value={selectedMeritCampus}
                            onChange={(e) => setSelectedMeritCampus(e.target.value)}
                            className="p-1 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-lg text-xs font-bold text-ink dark:text-white outline-none cursor-pointer font-sans"
                          >
                            {uni.campuses.map(campus => (
                              <option key={campus} value={campus} className="bg-cloudy dark:bg-[#0A1128] text-ink dark:text-white">{campus}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                      {(() => {
                        const campusMeritData = uni.meritData?.campuses?.[selectedMeritCampus];
                        let programList = [];
                        if (campusMeritData && Object.keys(campusMeritData).length > 0) {
                          programList = Object.entries(campusMeritData).map(([progName, yearsData]) => {
                            const meritsObj = {};
                            Object.entries(yearsData).forEach(([yr, val]) => {
                              meritsObj[yr] = typeof val === 'string' ? parseFloat(val.replace('%', '')) : val;
                            });
                            return { name: progName, merits: meritsObj };
                          });
                          
                          if (uni.programGroups?.length > 0) {
                            const activeGroup = uni.programGroups[selectedProgramGroup];
                            if (activeGroup && activeGroup.programs) {
                              programList = programList.filter(p => activeGroup.programs.includes(p.name));
                            }
                          }
                        } else {
                          programList = uni.programs || [];
                        }

                        if (programList.length === 0) {
                          return (
                            <div className="col-span-2 text-center py-6 text-muted text-xs font-sans">
                              No program data found for this campus.
                            </div>
                          );
                        }

                        return programList.map(p => {
                          const cutoff = p.merits[2025] || 70.0;
                          const diff = liveAggregate - cutoff;
                          let badgeCls = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                          let statusText = "Likely";
                          let StatusIcon = CheckCircle2;
                          if (diff < -2.0) {
                            badgeCls = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                            statusText = "Tough";
                            StatusIcon = XCircle;
                          } else if (diff < 1.0) {
                            badgeCls = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                            statusText = "Borderline";
                            StatusIcon = AlertCircle;
                          }
                          return (
                            <div key={p.name} className="p-3 bg-white/20 dark:bg-white/[0.02] border border-border/50 dark:border-white/5 rounded-xl flex flex-col space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-xs text-ink dark:text-white font-sans">{p.name}</p>
                                  <p className="text-[10px] text-ink/40 dark:text-white/40 font-sans">2025 Cutoff: {cutoff}%</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badgeCls} flex items-center gap-1 font-sans`}>
                                    <StatusIcon className="w-2.5 h-2.5" />
                                    {statusText}
                                  </span>
                                  <span className={`text-xs font-mono font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {diff >= 0 ? '+' : ''}{diff.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Share scorecard details */}
                  <div className="flex flex-col sm:flex-row gap-4 border-t border-border dark:border-white/10 pt-6">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex-1 py-3 px-4 bg-white/30 dark:bg-[#1e1e1e] border border-border dark:border-white/10 hover:border-[#1D2E28] rounded-xl font-bold text-xs uppercase tracking-wider text-ink dark:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <><Check className="w-4 h-4 text-emerald-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Scorecard</>}
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" /> Share on WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToPortal}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        saveStatus === 'Saved!'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                          : saveStatus === 'Login required'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/25'
                          : 'bg-gold/15 text-goldDark dark:text-gold border-gold/30 hover:bg-gold hover:text-white'
                      }`}
                    >
                      <Calculator className="w-4 h-4" /> 
                      {saveStatus || 'Save to Portal'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'merit' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-border dark:border-white/10 pb-3">
                    <h4 className="font-extrabold text-ink dark:text-white text-sm uppercase tracking-wider">Historical Merit Lists</h4>
                    {/* Campus Filter */}
                    {uni.campuses?.length > 1 && (
                      <select
                        value={selectedMeritCampus}
                        onChange={(e) => setSelectedMeritCampus(e.target.value)}
                        className="p-2 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-lg text-xs font-bold outline-none text-ink dark:text-white cursor-pointer"
                      >
                        {uni.campuses.map(campus => (
                          <option key={campus} value={campus} className="bg-cloudy dark:bg-[#0A1128] text-ink dark:text-white">{campus}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {uni.meritData?.campuses?.[selectedMeritCampus] && Object.keys(uni.meritData.campuses[selectedMeritCampus]).length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-border dark:border-white/10 bg-white/30 dark:bg-white/[0.01]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-cloudy/50 dark:bg-white/[0.02] text-ink/50 dark:text-white/50 font-bold border-b border-border dark:border-white/10 uppercase text-[10px] tracking-wider">
                            <th className="p-3.5">Program</th>
                            <th className="p-3.5 text-center">2025 Closing</th>
                            <th className="p-3.5 text-center">2024 Closing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(uni.meritData.campuses[selectedMeritCampus]).map(([prog, years], idx) => (
                            <tr key={prog} className={`border-b border-border/50 dark:border-white/5 last:border-none ${idx % 2 === 0 ? 'bg-white/10 dark:bg-white/[0.01]' : 'bg-transparent'}`}>
                              <td className="p-3.5 font-bold text-ink dark:text-white">{prog}</td>
                              <td className="p-3.5 text-center text-blue-400 font-mono font-bold">{years[2025] || '--'}</td>
                              <td className="p-3.5 text-center text-ink/40 dark:text-white/40 font-mono">{years[2024] || '--'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-ink/30 dark:text-white/30 border border-dashed border-border dark:border-white/10 rounded-xl bg-white/20 dark:bg-white/[0.01]">
                      Historical merit records are not available for the selected options.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pattern' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-border dark:border-white/10 pb-3">
                    <h4 className="font-extrabold text-ink dark:text-white text-sm uppercase tracking-wider">Entry Test Details</h4>
                  </div>

                  {uni.testPattern ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/30 dark:bg-white/[0.01] border border-border/50 dark:border-white/5 p-4 rounded-xl text-center flex flex-col justify-center min-h-[96px]">
                          <p className="text-2xl font-black text-ink dark:text-white">{uni.testPattern.totalMcqs}</p>
                          <p className="text-[10px] text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider mt-1">Total MCQs</p>
                        </div>
                        <div className="bg-white/30 dark:bg-white/[0.01] border border-border/50 dark:border-white/5 p-4 rounded-xl text-center flex flex-col justify-center min-h-[96px]">
                          <p className="text-2xl font-black text-ink dark:text-white">{uni.testPattern.duration}</p>
                          <p className="text-[10px] text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider mt-1">Duration</p>
                        </div>
                        <div className="bg-white/30 dark:bg-white/[0.01] border border-border/50 dark:border-white/5 p-4 rounded-xl text-center flex flex-col justify-center min-h-[96px]">
                          <p className="text-2xl font-black text-ink dark:text-white">{uni.testPattern.passingMarks || '50%'}</p>
                          <p className="text-[10px] text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider mt-1">Passing Score</p>
                        </div>
                        <div className="bg-white/30 dark:bg-white/[0.01] border border-border/50 dark:border-white/5 p-4 rounded-xl text-center flex flex-col justify-center min-h-[96px]">
                          <p className="text-2xl font-black text-ink dark:text-white truncate">
                            {uni.testPattern.tags?.includes('Negative Marking') ? 'Enabled (0.25)' : 'No Deduction'}
                          </p>
                          <p className="text-[10px] text-ink/40 dark:text-white/40 font-bold uppercase tracking-wider mt-1">Negative Mark</p>
                        </div>
                      </div>

                      {uni.testPattern.subjects && (
                        <div className="space-y-3 bg-white/30 dark:bg-white/[0.01] p-5 rounded-2xl border border-border dark:border-white/5">
                          <h5 className="text-xs font-bold text-ink dark:text-white uppercase tracking-widest border-b border-border dark:border-white/10 pb-2">Subject Weightage / Marks Allocation</h5>
                          <div className="space-y-3">
                            {uni.testPattern.subjects.map((sub, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs text-ink/80 dark:text-white/80">
                                <span className="capitalize">{sub.name} section</span>
                                <span className="font-bold text-ink dark:text-white font-mono">{sub.mcqs} MCQs</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {uni.testPattern.sections && (
                        <div className="space-y-3 bg-white/30 dark:bg-white/[0.01] p-5 rounded-2xl border border-border dark:border-white/5">
                          <h5 className="text-xs font-bold text-ink dark:text-white uppercase tracking-widest border-b border-border dark:border-white/10 pb-2">Subject Weightage / Marks Allocation</h5>
                          <div className="space-y-3">
                            {Object.entries(uni.testPattern.sections).map(([sect, mcqs]) => (
                              <div key={sect} className="flex justify-between items-center text-xs text-ink/80 dark:text-white/80">
                                <span className="capitalize">{sect} section</span>
                                <span className="font-bold text-ink dark:text-white font-mono">{mcqs} MCQs</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-ink/30 dark:text-white/30 border border-dashed border-border dark:border-white/10 rounded-xl bg-white/20 dark:bg-white/[0.01]">
                      Detailed test patterns are not documented yet for this entry test.
                    </div>
                  )}
                </div>
              )}
            </div>

          </motion.div>
        </div>

        {/* ══════ COLUMN 2: Campus Interactive 3D view (col-span-4) ══════ */}
        <div className="lg:col-span-4 w-full">
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} transitionSpeed={2000}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel rounded-3xl shadow-2xl p-6 relative flex flex-col justify-between overflow-hidden min-h-[480px]"
            >
            {/* Background blur decorative glow */}
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl pointer-events-none" style={{ background: `${uni.colorHex}25` }} />
            
            <div className="relative z-10 space-y-4 w-full">
              <h4 className="text-[11px] uppercase tracking-[0.2em] text-muted dark:text-white/50 font-black flex items-center gap-2">
                <Building2 className="w-4 h-4 text-goldDark" />
                Interactive 3D Logo
              </h4>
              
              <div className="h-60 flex items-center justify-center">
                <Campus3DModel colorHex={uni.colorHex} uniId={uni.id} />
              </div>
              
              <p className="text-center text-[10px] text-muted dark:text-white/40 leading-relaxed font-semibold">
                3D Holographic Model of the official {uni.shortName} logo. Drag horizontally to orbit.
              </p>
            </div>

            {/* University Stats quick overview */}
            <div className="relative z-10 pt-6 border-t border-border/50 dark:border-white/5 mt-6 grid grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-1">
                <p className="text-muted dark:text-white/40 text-[10px] uppercase font-bold tracking-wider">Est. Fee / Sem</p>
                <p className="text-ink dark:text-white font-extrabold font-mono">PKR {uni.feePerSemester?.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted dark:text-white/40 text-[10px] uppercase font-bold tracking-wider">Entry Test</p>
                <p className="text-ink dark:text-white font-extrabold">{uni.entryTest}</p>
              </div>
            </div>
          </motion.div>
          </Tilt>
        </div>
      </div>

      {/* Guide Modal */}
      <AnimatePresence>
        {isGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setIsGuideOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0A1128] rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl relative border border-border dark:border-white/10"
            >
              <button
                onClick={() => setIsGuideOpen(false)}
                className="absolute top-4 right-4 p-2 bg-ink/5 hover:bg-ink/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-ink/50 dark:text-white/50" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-goldDark">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-ink dark:text-white">How it's calculated</h3>
                  <p className="text-sm text-ink/60 dark:text-white/60 font-semibold">Official {uni.shortName} formula breakdown</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cloudy dark:bg-white/[0.02] rounded-2xl p-5 border border-border/50 dark:border-white/5 h-full">
                  <p className="text-sm font-bold text-ink dark:text-white mb-4">Your selected program uses this weightage:</p>
                  
                  <div className="space-y-3">
                    {activeFormula.matric > 0 && (
                      <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl shadow-sm">
                        <span className="text-sm font-bold text-ink/80 dark:text-white/80">🏫 Matric / O-Level</span>
                        <span className="text-lg font-black text-[#25A18E]">{activeFormula.matric}%</span>
                      </div>
                    )}
                    {activeFormula.fsc > 0 && (
                      <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl shadow-sm">
                        <span className="text-sm font-bold text-ink/80 dark:text-white/80">🎓 Intermediate / A-Level</span>
                        <span className="text-lg font-black text-[#25A18E]">{activeFormula.fsc}%</span>
                      </div>
                    )}
                    {activeFormula.test > 0 && (
                      <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl shadow-sm">
                        <span className="text-sm font-bold text-ink/80 dark:text-white/80">📝 Entry Test</span>
                        <span className="text-lg font-black text-[#25A18E]">{activeFormula.test}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#1D2E28]/5 dark:bg-[#1D2E28]/20 rounded-2xl p-5 border border-[#1D2E28]/10 h-full flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-[#1D2E28] dark:text-white flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4" /> Simple Example
                  </h4>
                  <p className="text-xs text-ink/70 dark:text-white/70 leading-relaxed font-medium">
                    If you score 80% in Matric, 75% in Inter, and 60% in the Entry Test, your aggregate will be:<br/><br/>
                    <span className="font-mono bg-white dark:bg-black/20 px-3 py-3 rounded-lg block mt-1 border border-border/50 dark:border-white/10">
                      {activeFormula.matric > 0 && `(80 × ${(activeFormula.matric / 100).toFixed(2)}) `}
                      {activeFormula.matric > 0 && (activeFormula.fsc > 0 || activeFormula.test > 0) && '+ '}
                      {activeFormula.fsc > 0 && `(75 × ${(activeFormula.fsc / 100).toFixed(2)}) `}
                      {activeFormula.fsc > 0 && activeFormula.test > 0 && '+ '}
                      {activeFormula.test > 0 && `(60 × ${(activeFormula.test / 100).toFixed(2)}) `}
                      <br/><br/>= <strong className="text-[#25A18E] text-base">{((80 * (activeFormula.matric||0)/100) + (75 * (activeFormula.fsc||0)/100) + (60 * (activeFormula.test||0)/100)).toFixed(2)}%</strong>
                    </span>
                  </p>
                </div>
                
                <div className="md:col-span-2 mt-2">
                  <button
                    onClick={() => setIsGuideOpen(false)}
                    className="w-full py-4 bg-[#1D2E28] hover:bg-[#1D2E28]/90 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Scorecard for Image Generation */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ transform: 'scale(1)' }}>
        <ScorecardImage 
          ref={scorecardRef}
          uni={uni}
          aggregate={liveAggregate?.toFixed(2) || '0.00'}
          programGroup={uni.programGroups?.[selectedProgramGroup]?.groupName}
          campus={selectedMeritCampus}
          edSystem={selectedEdSystem === 'a-level' ? 'A-Levels/O-Levels' : 'FSc/Matric'}
        />
      </div>
    </div>
  );
}
