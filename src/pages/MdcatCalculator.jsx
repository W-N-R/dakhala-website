import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Mdcat3DModel from '../components/Mdcat3DModel';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { 
  ChevronRight, Calculator, Info, Sparkles, HeartPulse, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw, GraduationCap, Award
} from 'lucide-react';

export default function MdcatCalculator() {
  const {
    matricObt, matricTotal, fscObt, fscTotal,
    setMatricObt, setMatricTotal, setFscObt, setFscTotal
  } = useCalculatorStore();

  const [edSystem, setEdSystem] = useState('board'); // 'board' or 'olevel'
  const [mdcatObt, setMdcatObt] = useState('');
  const [mdcatTotal, setMdcatTotal] = useState('200');

  // O/A levels equivalent scores
  const [oLevelEquiv, setOLevelEquiv] = useState('');
  const [aLevelEquiv, setALevelEquiv] = useState('');

  // Live output states
  const [matricContribution, setMatricContribution] = useState(0);
  const [fscContribution, setFscContribution] = useState(0);
  const [mdcatContribution, setMdcatContribution] = useState(0);
  const [aggregate, setAggregate] = useState(0);

  // PMDC status check
  const [fscPercentage, setFscPercentage] = useState(0);
  const [mdcatPercentage, setMdcatPercentage] = useState(0);

  // Calculate Contribution and Aggregate live
  useEffect(() => {
    let matricScore = 0;
    let fscScore = 0;
    let mdcatScore = 0;

    // 1. Matric (10%)
    if (edSystem === 'board') {
      const obt = parseFloat(matricObt) || 0;
      const tot = parseFloat(matricTotal) || 1100;
      if (tot > 0 && obt <= tot) {
        matricScore = (obt / tot) * 10;
        setFscPercentage(0); // reset if not fsc
      }
    } else {
      const equiv = parseFloat(oLevelEquiv) || 0;
      // IBCC equivalence is usually out of 900 or 1050
      const tot = 1050; 
      if (equiv <= tot && equiv > 0) {
        matricScore = (equiv / tot) * 10;
      }
    }

    // 2. FSc Pre-Medical (40%)
    if (edSystem === 'board') {
      const obt = parseFloat(fscObt) || 0;
      const tot = parseFloat(fscTotal) || 1100;
      if (tot > 0 && obt <= tot) {
        fscScore = (obt / tot) * 40;
        setFscPercentage((obt / tot) * 100);
      } else {
        setFscPercentage(0);
      }
    } else {
      const equiv = parseFloat(aLevelEquiv) || 0;
      const tot = 1100; 
      if (equiv <= tot && equiv > 0) {
        fscScore = (equiv / tot) * 40;
        setFscPercentage((equiv / tot) * 100);
      } else {
        setFscPercentage(0);
      }
    }

    // 3. MDCAT Test (50%)
    const mObt = parseFloat(mdcatObt) || 0;
    const mTot = parseFloat(mdcatTotal) || 200;
    if (mTot > 0 && mObt <= mTot) {
      mdcatScore = (mObt / mTot) * 50;
      setMdcatPercentage((mObt / mTot) * 100);
    } else {
      setMdcatPercentage(0);
    }

    setMatricContribution(matricScore);
    setFscContribution(fscScore);
    setMdcatContribution(mdcatScore);
    setAggregate(matricScore + fscScore + mObt > 0 ? (matricScore + fscScore + mdcatScore) : 0);

  }, [edSystem, matricObt, matricTotal, fscObt, fscTotal, oLevelEquiv, aLevelEquiv, mdcatObt, mdcatTotal]);

  const handleReset = () => {
    setMatricObt('');
    setFscObt('');
    setMdcatObt('');
    setOLevelEquiv('');
    setALevelEquiv('');
  };

  const handleLoadMock = () => {
    setEdSystem('board');
    setMatricObt('1012');
    setMatricTotal('1100');
    setFscObt('1004');
    setFscTotal('1100');
    setMdcatObt('178');
    setMdcatTotal('200');
  };

  return (
    <div className="min-h-screen py-8 relative w-full flex flex-col text-ink dark:text-white">
      <Helmet>
        <title>MDCAT Aggregate Calculator 2026 | PMDC Merit Calculator (10:40:50)</title>
        <meta name="description" content="Calculate your official PMDC MDCAT aggregate score online for MBBS/BDS admissions 2026. Official formula: 10% Matric, 40% FSc Pre-Medical, 50% MDCAT." />
        <meta name="keywords" content="MDCAT aggregate calculator, mdcat aggregate calculator 2026, PMDC merit calculator, medical college aggregate calculator, MBBS aggregate calculator, MDCAT formula, PMDC calculator 10 40 50" />
      </Helmet>

      {/* ─── Breadcrumb ─── */}
      <div className="flex items-center gap-2 text-xs text-muted dark:text-white/40 font-medium mb-6 select-none">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculator/university" className="hover:text-gold transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink dark:text-white/80 font-bold">MDCAT Calculator</span>
      </div>

      {/* ─── Hero Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="space-y-4 flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
            <span className="text-ink dark:text-white flex items-center gap-3">
              {/* Medical Emblem Shield Logo */}
              <div className="w-12 h-12 bg-white dark:bg-white/95 rounded-2xl flex items-center justify-center p-1 border border-border dark:border-white/10 shadow-md overflow-hidden flex-shrink-0">
                <img 
                  src="/logos/mdcat.webp" 
                  alt="MDCAT Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              MDCAT Calculator
            </span>
            <span className="text-muted/20 dark:text-white/20 hidden md:inline">|</span>
            <span className="text-gold text-2xl md:text-3xl font-extrabold flex items-center gap-2 justify-center md:justify-start">
              <HeartPulse className="w-7 h-7 text-gold animate-pulse" />
              PMDC Standardized (10:40:50)
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted dark:text-white/60 font-medium max-w-3xl leading-relaxed">
            Determine your official aggregate for medical and dental colleges admissions in Pakistan. PMDC rules dictate 10% Matriculation, 40% Intermediate (FSc Pre-Medical), and 50% MDCAT entry test weightage.
          </p>
        </div>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-ink dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-gold" /> Calculate Your Marks
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleLoadMock}
                  className="px-3 py-1 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg text-[10px] font-bold uppercase transition-all"
                >
                  Load Demo Scores
                </button>
                <button 
                  onClick={handleReset}
                  className="p-1.5 bg-cloudy hover:bg-border dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-ink dark:text-white transition-all"
                  title="Reset calculator fields"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Education System Selector */}
            <div className="flex bg-cloudy/50 dark:bg-white/[0.02] border border-border dark:border-white/5 p-1 rounded-2xl mb-6">
              <button
                onClick={() => setEdSystem('board')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  edSystem === 'board' 
                    ? 'bg-gold text-white shadow-md' 
                    : 'text-muted dark:text-white/60 hover:text-ink dark:hover:text-white'
                }`}
              >
                Pakistani Board (SSC / HSSC)
              </button>
              <button
                onClick={() => setEdSystem('olevel')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  edSystem === 'olevel' 
                    ? 'bg-gold text-white shadow-md' 
                    : 'text-muted dark:text-white/60 hover:text-ink dark:hover:text-white'
                }`}
              >
                O / A Levels (IBCC Equivalence)
              </button>
            </div>

            {/* Input fields */}
            <div className="space-y-5">
              
              {/* Matriculation / O-Levels */}
              {edSystem === 'board' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wide text-ink/70 dark:text-white/60 mb-2">Matric Obt. Marks</label>
                    <input 
                      type="number"
                      placeholder="e.g. 1012"
                      value={matricObt}
                      onChange={(e) => setMatricObt(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-sm focus:border-gold focus:outline-none transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wide text-ink/70 dark:text-white/60 mb-2">Matric Total</label>
                    <input 
                      type="number"
                      placeholder="1100"
                      value={matricTotal}
                      onChange={(e) => setMatricTotal(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-sm focus:border-gold focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wide text-ink/70 dark:text-white/60 mb-2">O-Level Equivalence (Obtained Marks)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 945 (out of 1050)"
                    value={oLevelEquiv}
                    onChange={(e) => setOLevelEquiv(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-sm focus:border-gold focus:outline-none transition-all font-semibold"
                  />
                  <span className="text-[10px] text-muted dark:text-white/40 block mt-1.5">Note: Input your standard 8-subject IBCC equivalence certificate score. Total marks is standardized at 1050.</span>
                </div>
              )}

              {/* Intermediate / A-Levels */}
              {edSystem === 'board' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wide text-ink/70 dark:text-white/60 mb-2">FSc Obtained Marks</label>
                    <input 
                      type="number"
                      placeholder="e.g. 988"
                      value={fscObt}
                      onChange={(e) => setFscObt(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-sm focus:border-gold focus:outline-none transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wide text-ink/70 dark:text-white/60 mb-2">FSc Total Marks</label>
                    <input 
                      type="number"
                      placeholder="1100"
                      value={fscTotal}
                      onChange={(e) => setFscTotal(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-sm focus:border-gold focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wide text-ink/70 dark:text-white/60 mb-2">A-Level Equivalence (Obtained Marks)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 990 (out of 1100)"
                    value={aLevelEquiv}
                    onChange={(e) => setALevelEquiv(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-sm focus:border-gold focus:outline-none transition-all font-semibold"
                  />
                  <span className="text-[10px] text-muted dark:text-white/40 block mt-1.5">Note: Provide your equivalence out of 1100 including physics, chemistry, biology electives.</span>
                </div>
              )}

              {/* MDCAT Entry Test */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wide text-ink/70 dark:text-white/60 mb-2">MDCAT Obtained Marks</label>
                  <input 
                    type="number"
                    placeholder="e.g. 176"
                    value={mdcatObt}
                    onChange={(e) => setMdcatObt(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-sm focus:border-gold focus:outline-none transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wide text-ink/70 dark:text-white/60 mb-2">MDCAT Total</label>
                  <input 
                    type="number"
                    placeholder="200"
                    value={mdcatTotal}
                    onChange={(e) => setMdcatTotal(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/70 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-sm focus:border-gold focus:outline-none transition-all font-semibold"
                  />
                </div>
              </div>

            </div>

            {/* PMDC Regulations Alert Box */}
            <div className="mt-8 p-4 bg-gold/5 border border-gold/15 rounded-2xl text-xs space-y-2 leading-relaxed">
              <div className="font-extrabold text-gold flex items-center gap-1.5">
                <Info className="w-4 h-4" /> PMDC MDCAT WEIGHTAGES 2025/2026
              </div>
              <p className="text-muted dark:text-white/70">
                The aggregate formula is fixed and strictly monitored under PMDC regulation:
              </p>
              <ul className="list-disc list-inside space-y-1 text-ink/80 dark:text-white/80 font-semibold pl-2">
                <li>Matriculation (SSC/O-Level equivalent) — <span className="text-gold">10%</span></li>
                <li>Intermediate (HSSC/A-Level Pre-Medical equivalent) — <span className="text-gold">40%</span></li>
                <li>MDCAT Entrance Test Score — <span className="text-gold">50%</span></li>
              </ul>
            </div>
          </div>

          {/* Historical cutoffs */}
          <div className="bg-white/60 dark:bg-white/[0.01] border border-border dark:border-white/5 rounded-3xl p-6">
            <h3 className="text-sm font-black text-ink dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" /> Historical Cutoffs & Merit Trends (Punjab Public Sector)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-ink dark:text-white/80">
                <thead>
                  <tr className="border-b border-border dark:border-white/10 text-muted">
                    <th className="py-2.5 font-bold uppercase">Medical Institution</th>
                    <th className="py-2.5 font-bold uppercase text-center">2024 Cutoff</th>
                    <th className="py-2.5 font-bold uppercase text-center">2023 Cutoff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 dark:divide-white/5 font-medium">
                  <tr>
                    <td className="py-2.5 font-semibold">King Edward Medical University (KEMU)</td>
                    <td className="py-2.5 text-center text-gold font-bold">93.58%</td>
                    <td className="py-2.5 text-center">93.65%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Allama Iqbal Medical College (AIMC)</td>
                    <td className="py-2.5 text-center text-gold font-bold">92.61%</td>
                    <td className="py-2.5 text-center">92.70%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Services Institute of Medical Sciences (SIMS)</td>
                    <td className="py-2.5 text-center text-gold font-bold">91.82%</td>
                    <td className="py-2.5 text-center">91.90%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Nishtar Medical University (NMU)</td>
                    <td className="py-2.5 text-center text-gold font-bold">91.10%</td>
                    <td className="py-2.5 text-center">91.22%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Rawalpindi Medical University (RMU)</td>
                    <td className="py-2.5 text-center text-gold font-bold">90.87%</td>
                    <td className="py-2.5 text-center">91.01%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live HUD & 3D Hologram */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Circular HUD Dial */}
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={2000}>
            <div className="glass-panel rounded-3xl p-6 text-ink dark:text-white shadow-2xl relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-gold mb-5 flex items-center gap-1.5 w-full justify-start">
                <Sparkles className="w-4 h-4 text-gold" /> Live MDCAT Status
              </h3>

              <div className="flex flex-col items-center justify-center mb-6 relative">
                <svg width="170" height="170" className="rotate-[-90deg]">
                  <circle cx="85" cy="85" r="72" fill="transparent" stroke="rgba(0,0,0,0.06)" strokeWidth="11" />
                  <motion.circle 
                    cx="85" cy="85" r="72" fill="transparent" 
                    stroke="#0B5D56" strokeWidth="11" strokeLinecap="round"
                    strokeDasharray={452}
                    animate={{ strokeDashoffset: 452 - (452 * (aggregate || 0)) / 100 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4.5xl font-black text-ink dark:text-white leading-none">{aggregate.toFixed(3)}%</span>
                  <span className="text-[9px] uppercase text-muted dark:text-white/40 tracking-widest mt-1.5 font-extrabold">Calculated Aggregate</span>
                </div>
              </div>

              {/* Contribution Breakdown */}
              <div className="w-full space-y-3.5 border-t border-border/40 dark:border-white/5 pt-5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted dark:text-white/50 font-bold">Matriculation (10%)</span>
                  <span className="font-extrabold text-ink dark:text-white">{matricContribution.toFixed(3)} / 10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted dark:text-white/50 font-bold">FSc Pre-Medical (40%)</span>
                  <span className="font-extrabold text-ink dark:text-white">{fscContribution.toFixed(3)} / 40</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted dark:text-white/50 font-bold">MDCAT Entry Test (50%)</span>
                  <span className="font-extrabold text-ink dark:text-white">{mdcatContribution.toFixed(3)} / 50</span>
                </div>
              </div>
            </div>
          </Tilt>

          {/* PMDC Regulations Checklist */}
          <div className="glass-panel rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-ink dark:text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-gold" /> PMDC Eligibility Advisor
            </h3>

            <div className="space-y-3">
              
              {/* Check 1: FSc percentage minimum 60% */}
              <div className="flex items-start gap-3">
                {fscPercentage >= 60 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${fscPercentage > 0 ? 'text-rose-500' : 'text-muted/30'} shrink-0 mt-0.5`} />
                )}
                <div>
                  <div className="text-xs font-black text-ink dark:text-white">FSc Requirement (Min 60%)</div>
                  <p className="text-[10px] text-muted dark:text-white/50 mt-0.5">
                    {fscPercentage > 0 
                      ? `Your FSc Percentage is ${fscPercentage.toFixed(2)}%.` 
                      : 'Please input FSc marks to evaluate.'
                    }
                  </p>
                </div>
              </div>

              {/* Check 2: MBBS eligibility minimum 55% */}
              <div className="flex items-start gap-3">
                {mdcatPercentage >= 55 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${mdcatPercentage > 0 ? 'text-rose-500' : 'text-muted/30'} shrink-0 mt-0.5`} />
                )}
                <div>
                  <div className="text-xs font-black text-ink dark:text-white">MBBS Admission (MDCAT Min 55%)</div>
                  <p className="text-[10px] text-muted dark:text-white/50 mt-0.5">
                    Requires minimum 110/200 score. 
                    {mdcatPercentage > 0 && ` Current: ${mdcatPercentage.toFixed(2)}%.`}
                  </p>
                </div>
              </div>

              {/* Check 3: BDS eligibility minimum 50% */}
              <div className="flex items-start gap-3">
                {mdcatPercentage >= 50 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${mdcatPercentage > 0 ? 'text-rose-500' : 'text-muted/30'} shrink-0 mt-0.5`} />
                )}
                <div>
                  <div className="text-xs font-black text-ink dark:text-white">BDS Admission (MDCAT Min 50%)</div>
                  <p className="text-[10px] text-muted dark:text-white/50 mt-0.5">
                    Requires minimum 100/200 score. 
                    {mdcatPercentage > 0 && ` Current: ${mdcatPercentage.toFixed(2)}%.`}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 3D Holographic Model */}
          <div className="glass-panel rounded-3xl p-5 shadow-sm text-center relative overflow-hidden">
            <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-gold mb-3 text-left flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> MDCAT Medical DNA Hologram
            </h3>
            <div className="w-full flex items-center justify-center">
              <Mdcat3DModel />
            </div>
            <p className="text-[9px] text-muted dark:text-white/40 font-medium mt-2 leading-normal">
              Procedurally generated 3D DNA Helix representation of pre-medical disciplines. Drag to rotate and analyze structures.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
