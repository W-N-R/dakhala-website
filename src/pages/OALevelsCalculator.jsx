import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import Campus3DModel from '../components/Campus3DModel';
import { ChevronRight, ChevronLeft, BookOpen, Calculator, Info, AlertTriangle, Sparkles, Trash2, Award, Building2 } from 'lucide-react';
import { useCalculatorStore } from '../store/useCalculatorStore';

const GRADE_MARKS = {
  'A*': 90,
  'A': 85,
  'B': 75,
  'C': 65,
  'D': 55,
  'E': 45
};

const RATING_SCALES = {
  'A*': 'Outstanding',
  'A': 'Excellent',
  'B': 'Good',
  'C': 'Satisfactory',
  'D': 'Acceptable',
  'E': 'Minimum pass'
};

const COMPULSORY_SUBJECTS = [
  { id: 1, name: 'Urdu', grade: '', isCompulsory: true },
  { id: 2, name: 'Pakistan Studies', grade: '', isCompulsory: true },
  { id: 3, name: 'Islamic Studies / Islamiyat', grade: '', isCompulsory: true }
];

const ELECTIVE_SUBJECTS = [
  { id: 4, name: 'English Language', grade: '' },
  { id: 5, name: 'Mathematics', grade: '' },
  { id: 6, name: 'Physics', grade: '' },
  { id: 7, name: 'Chemistry', grade: '' },
  { id: 8, name: 'Biology / Computer Science', grade: '' }
];

export default function OALevelsCalculator() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  // Combined subject list
  const [compulsoryList, setCompulsoryList] = useState(COMPULSORY_SUBJECTS);
  const [electiveList, setElectiveList] = useState(ELECTIVE_SUBJECTS);

  const [liveScore, setLiveScore] = useState(0);
  const [livePercentage, setLivePercentage] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const { targetPath, setTargetPath, setMatricObt, setMatricTotal } = useCalculatorStore();

  // FAQ Accordion Toggle
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Grade updates
  const handleCompulsoryGradeChange = (id, grade) => {
    setCompulsoryList(compulsoryList.map(sub => sub.id === id ? { ...sub, grade } : sub));
  };

  const handleElectiveGradeChange = (id, grade) => {
    setElectiveList(electiveList.map(sub => sub.id === id ? { ...sub, grade } : sub));
  };

  const handleElectiveNameChange = (id, name) => {
    setElectiveList(electiveList.map(sub => sub.id === id ? { ...sub, name } : sub));
  };

  const addElective = () => {
    const nextId = [...compulsoryList, ...electiveList].reduce((max, s) => Math.max(max, s.id), 0) + 1;
    setElectiveList([...electiveList, { id: nextId, name: `Elective Subject ${electiveList.length - 4}`, grade: '' }]);
  };

  const removeElective = (id) => {
    if (compulsoryList.length + electiveList.length <= 8) return; // Maintain minimum 8 subjects requirement
    setElectiveList(electiveList.filter(sub => sub.id !== id));
  };

  // Live HUD Update
  useEffect(() => {
    const allSubjects = [...compulsoryList, ...electiveList];
    let sum = 0;
    let completeCount = 0;

    allSubjects.forEach(sub => {
      if (sub.grade) {
        sum += GRADE_MARKS[sub.grade] || 0;
        completeCount++;
      }
    });

    const totalCount = allSubjects.length;
    const maxMarks = totalCount * 100;
    const rawPercent = maxMarks > 0 ? (sum / maxMarks) * 100 : 0;
    const scaledScore = maxMarks > 0 ? (sum / maxMarks) * 1050 : 0;
    const roundedScore = Math.round(scaledScore);

    setLivePercentage(rawPercent);
    setLiveScore(roundedScore);
    
    // Auto populate store
    if (roundedScore > 0) {
      setMatricObt(roundedScore.toString());
      setMatricTotal('1050');
    }
  }, [compulsoryList, electiveList, setMatricObt, setMatricTotal]);

  // Steps Navigation
  const nextStep = () => {
    setDirection(1);
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  const stepsList = ["Compulsory Grades", "Elective Grades", "Equivalence Result"];

  const getPerformanceRating = (pct) => {
    if (pct >= 90) return 'Outstanding';
    if (pct >= 85) return 'Excellent';
    if (pct >= 75) return 'Good';
    if (pct >= 65) return 'Satisfactory';
    if (pct >= 55) return 'Acceptable';
    return 'Minimum Pass';
  };

  return (
    <div className="min-h-[85vh] py-8 px-4 flex flex-col space-y-10 text-[13px] relative select-none">
      <Helmet>
        <title>O/A Level IBCC Equivalence Calculator 2026 | Dakhala</title>
        <meta name="description" content="Convert your Cambridge O-Level and A-Level grades to official IBCC Pakistani percentage equivalent marks online. Standardized HEC/IBCC formula tool." />
        <meta name="keywords" content="o level equivalence calculator, a level equivalence calculator, ibcc equivalence calculator, convert o level grades to marks, HEC equivalence calculator" />
      </Helmet>
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-60 right-1/4 w-80 h-80 bg-maqsadOrange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1000px] mx-auto w-full text-center md:text-left relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-5 flex-1">
          {/* IBCC Logo Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white p-2 border border-white/20 shadow-xl flex-shrink-0"
          >
            <img
              src="/logos/ibcc.webp"
              alt="IBCC Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>

          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-white">
              O-Level <span className="text-gold font-serif italic">Equivalence</span> Calculator
            </h1>
            <p className="text-muted dark:text-white/60 leading-relaxed font-light text-sm">
              Standardise international school grades to SSC equivalency marks out of 1050 per official IBCC formulas.
            </p>
          </div>
        </div>
        <EduAnimation type="calculator" />
      </div>

      {/* Main Grid Wrapper */}
      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 max-w-[1000px] mx-auto w-full">
        
        {/* Left Column: Form/Wizard */}
        <div className="flex-1 w-full glass-panel rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Progress Header */}
          <div className="bg-white/10 dark:bg-white/[0.02] p-5 border-b border-border dark:border-white/10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 h-0.5 bg-cloudy top-1/2 -translate-y-1/2 z-0 rounded-full" />
              <div 
                className="absolute left-0 h-0.5 bg-gold top-1/2 -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
              {stepsList.map((st, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                    step > idx 
                      ? 'bg-gold text-white shadow-md shadow-gold/20' 
                      : step === idx + 1 
                      ? 'bg-ink dark:bg-white text-white dark:text-ink ring-4 ring-ink/15 dark:ring-white/15' 
                      : 'bg-cloudy dark:bg-white/10 text-muted border border-border dark:border-white/10'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[9px] uppercase font-extrabold hidden md:block ${step >= idx + 1 ? 'text-ink dark:text-white' : 'text-muted dark:text-white/40'}`}>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 min-h-[350px]">
            <AnimatePresence mode="wait" custom={direction}>
              
              {/* Step 1: Compulsory Subjects */}
              {step === 1 && (
                <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
                  <div className="text-center mb-6">
                    <BookOpen className="w-10 h-10 text-gold mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-ink dark:text-white">Compulsory Pakistani Subjects</h2>
                    <p className="text-muted dark:text-white/50 text-xs">Islamiyat, Pakistan Studies, and Urdu are required for domestic equivalence.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                    {compulsoryList.map(sub => (
                      <div key={sub.id} className="flex justify-between items-center p-3 bg-white/40 dark:bg-white/[0.03] border border-border dark:border-white/10 rounded-2xl gap-4">
                        <span className="font-bold text-ink dark:text-white text-[13px]">{sub.name}</span>
                        <div className="relative w-36 shrink-0">
                          <select
                            value={sub.grade}
                            onChange={(e) => handleCompulsoryGradeChange(sub.id, e.target.value)}
                            className={`w-full p-2.5 pr-8 bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-xl text-xs font-bold cursor-pointer focus:border-gold outline-none ${sub.grade ? 'text-goldDark' : 'text-muted dark:text-white/40'}`}
                          >
                            <option value="">Select Grade</option>
                            {Object.keys(GRADE_MARKS).map(g => (
                              <option key={g} value={g}>{g} ({GRADE_MARKS[g]}%)</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted">
                            <span className="text-[10px]">▼</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Elective Subjects */}
              {step === 2 && (
                <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
                  <div className="text-center mb-6">
                    <Calculator className="w-10 h-10 text-gold mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-ink dark:text-white">Science & Elective Subjects</h2>
                    <p className="text-muted dark:text-white/50 text-xs">Add your remaining electives. At least 8 subjects total are needed.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {electiveList.map((sub, index) => (
                      <div key={sub.id} className="relative space-y-1.5 p-3 border border-border dark:border-white/10 rounded-2xl bg-white/30 dark:bg-white/[0.03]">
                        <div className="flex justify-between items-center text-[11px] font-bold text-muted dark:text-white/40">
                          <span>Elective {index + 1}</span>
                          {compulsoryList.length + electiveList.length > 8 && (
                            <button
                              type="button"
                              onClick={() => removeElective(sub.id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => handleElectiveNameChange(sub.id, e.target.value)}
                            className="flex-1 p-2 bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-xl text-xs font-semibold text-ink dark:text-white focus:border-gold outline-none"
                            placeholder="Subject name"
                          />
                          <select
                            value={sub.grade}
                            onChange={(e) => handleElectiveGradeChange(sub.id, e.target.value)}
                            className={`w-28 p-2 bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-xl text-xs font-bold focus:border-gold cursor-pointer outline-none ${sub.grade ? 'text-goldDark' : 'text-muted dark:text-white/40'}`}
                          >
                            <option value="">Grade</option>
                            {Object.keys(GRADE_MARKS).map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={addElective}
                      className="px-4 py-2 border border-dashed border-gold text-goldDark hover:bg-gold/5 font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 focus:outline-none"
                    >
                      + Add Custom Elective Subject
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Converted Result HUD */}
              {step === 3 && (
                <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6 flex flex-col items-center justify-center py-6">
                  
                  <div className="w-32 h-32 bg-gold/15 rounded-full flex items-center justify-center animate-pulse mb-3">
                    <div className="w-24 h-24 bg-gold text-white font-extrabold text-3xl rounded-full flex items-center justify-center shadow-lg border border-white">
                      {liveScore}
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-black text-ink dark:text-white">Equivalence Marks: {liveScore} / 1050</h2>
                    <p className="text-xs text-muted dark:text-white/50">Percentage: <span className="font-bold text-ink dark:text-white">{livePercentage.toFixed(2)}%</span> | Rating: <span className="font-bold text-goldDark">{getPerformanceRating(livePercentage)}</span></p>
                  </div>

                  {/* Target Pathway Selector */}
                  <div className="w-full max-w-md pt-4 border-t border-border dark:border-white/10 mt-4">
                    <label className="text-[11px] font-bold text-muted dark:text-white/40 uppercase tracking-wider block text-center mb-3">Check Pathway Recommendations</label>
                    <div className="flex gap-2 mb-4">
                      {['Medical', 'Engineering', 'General'].map(path => (
                        <button
                          key={path}
                          onClick={() => setTargetPath(path)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                            targetPath === path
                              ? 'bg-gold text-white border-gold'
                              : 'bg-white/50 dark:bg-white/5 border-border dark:border-white/10 text-ink dark:text-white hover:border-gold'
                          }`}
                        >
                          {path}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 bg-white/40 dark:bg-white/[0.03] rounded-2xl text-xs leading-relaxed text-ink/80 dark:text-white/80 border border-border dark:border-white/10">
                      {targetPath === 'Medical' && (
                        <p className="flex gap-2">
                          <Award className="w-5 h-5 text-goldDark shrink-0 mt-0.5" />
                          <span><strong>MDCAT Ready:</strong> Your equivalence maps to {liveScore}/1050. Biology, chemistry, and physics are required for medical admissions in Pakistan. Keep preparing for MCQs.</span>
                        </p>
                      )}
                      {targetPath === 'Engineering' && (
                        <p className="flex gap-2">
                          <Award className="w-5 h-5 text-goldDark shrink-0 mt-0.5" />
                          <span><strong>ECAT / NET Ready:</strong> Math and physics grades will be factored heavily in engineering aggregates. Prepare for ECAT calculations.</span>
                        </p>
                      )}
                      {targetPath === 'General' && (
                        <p className="flex gap-2">
                          <Award className="w-5 h-5 text-goldDark shrink-0 mt-0.5" />
                          <span><strong>Computing & Social Sciences:</strong> Highly eligible for business, law, CS and social sciences programs across public/private sectors.</span>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-5 border-t border-border dark:border-white/10 bg-white/20 dark:bg-white/[0.02] flex justify-between items-center">
            <button 
              onClick={prevStep} 
              disabled={step === 1}
              className={`flex items-center gap-1 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                step === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-white dark:bg-white/10 text-ink dark:text-white border-border dark:border-white/10 hover:bg-gold/10 hover:border-gold'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            <button 
              onClick={nextStep} 
              disabled={step === 3}
              className={`flex items-center gap-1 px-7 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all ${
                step === 3 
                  ? 'hidden' 
                  : 'bg-ink dark:bg-white/15 text-white hover:bg-gold hover:text-white shadow-md active:translate-y-0 hover:-translate-y-0.5'
              }`}
            >
              {step === 2 ? 'Show Results' : 'Next'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Live HUD & 3D Logo */}
        <div className="w-full md:w-72 flex-shrink-0 sticky top-24 space-y-6">
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={2000}>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-3xl p-5 text-ink dark:text-white shadow-2xl relative overflow-hidden"
            >
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-goldDark mb-5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Live Equivalence Status
            </h3>

            <div className="flex flex-col items-center justify-center mb-6 relative">
              <svg width="150" height="150" className="rotate-[-90deg]">
                <circle cx="75" cy="75" r="62" fill="transparent" stroke="rgba(0,0,0,0.06)" strokeWidth="10" />
                <motion.circle 
                  cx="75" cy="75" r="62" fill="transparent" 
                  stroke="#0B5D56" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={390}
                  animate={{ strokeDashoffset: 390 - (390 * livePercentage) / 100 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black">{liveScore}</span>
                <span className="text-[9px] uppercase text-muted dark:text-white/40 tracking-widest mt-0.5">scaled score</span>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-border dark:border-white/10 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted dark:text-white/40">Total Subjects</span>
                <span className="font-bold text-goldDark">{compulsoryList.length + electiveList.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted dark:text-white/40">Equivalent Pct</span>
                <span className="font-bold text-goldDark">{livePercentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted dark:text-white/40">Performance</span>
                <span className="font-bold text-goldDark">{getPerformanceRating(livePercentage)}</span>
              </div>
              </div>
            </motion.div>
          </Tilt>

          {/* 3D Rotating Logo Card */}
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} transitionSpeed={2000}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-3xl p-5 relative flex flex-col justify-between overflow-hidden min-h-[300px] border border-[#9BD7D2]/30 dark:border-white/5"
            >
              {/* Background blur decorative glow */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none bg-gold/10" />
              
              <div className="relative z-10 space-y-3 w-full">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted dark:text-white/50 font-black flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-goldDark" />
                  Interactive 3D Logo
                </h4>
                
                <div className="h-44 flex items-center justify-center">
                  <Campus3DModel colorHex="#0D3B66" uniId="ibcc" />
                </div>
                
                <p className="text-center text-[9px] text-muted dark:text-white/40 leading-relaxed font-semibold">
                  3D Holographic Model of official IBCC logo. Drag horizontally to orbit.
                </p>
              </div>
            </motion.div>
          </Tilt>
        </div>

      </div>

      {/* FAQ Section */}
      <div className="max-w-[1000px] mx-auto w-full pt-8 border-t border-border dark:border-white/10">
        <h2 className="text-lg font-extrabold text-ink dark:text-white mb-6 text-center select-none uppercase tracking-wide">
          Frequently Asked Questions & Guidelines
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              q: "Compulsory subjects package for domestic equivalence?",
              a: "For domestic candidates, Urdu, Pakistan Studies, and Islamic Studies are completely mandatory. If you are an international student applying from outside Pakistan, you can verify optional waivers through the IBCC board."
            },
            {
              q: "What is the grade conversion formula?",
              a: "IBCC maps O-level letter grades to fixed numeric percentages per subject: A* = 90%, A = 85%, B = 75%, C = 65%, D = 55%, E = 45%. Any failing grade is scaled as 0%."
            },
            {
              q: "How is the scaling out of 1050 calculated?",
              a: "Total score is determined by taking the average percentage across all subjects (raw average out of 100) and scaling it directly to the Matriculation standard (Multiplying the raw decimal average by 1050)."
            },
            {
              q: "Where do we verify or request equivalence certificates?",
              a: "Candidates must submit original CAIE certificates along with secondary identity documents to the Inter Board Committee of Chairmen (IBCC) portal or local office to secure official print credentials."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-white/[0.02] border border-border/80 dark:border-white/10 rounded-2xl p-4 space-y-2">
              <h4 className="font-extrabold text-ink dark:text-white text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-gold shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-muted dark:text-gray-400 leading-relaxed font-light">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
