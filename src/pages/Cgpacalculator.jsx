import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { BookOpen, Target, Sparkles, AlertCircle, Info, Plus, Trash2, ChartBar } from 'lucide-react';

const GRADE_POINTS = {
  'A+': 4.00,
  'A': 4.00,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.00,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.00,
  'C-': 1.67,
  'D+': 1.33,
  'D': 1.00,
  'F': 0.00
};

const DEFAULT_COURSES = [
  { name: 'Programming Fundamentals', credits: '4', grade: 'A' },
  { name: 'Calculus & Geometry', credits: '3', grade: 'B+' },
  { name: 'English Composition', credits: '3', grade: 'A-' },
  { name: 'Islamic Studies', credits: '2', grade: 'C+' }
];

export default function Cgpacalculator() {
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [liveGpa, setLiveGpa] = useState('0.00');
  const [totalCredits, setTotalCredits] = useState(0);

  // Target CGPA Advisory States
  const [targetCgpa, setTargetCgpa] = useState('3.50');
  const [remainingCredits, setRemainingCredits] = useState('15');
  const [advisoryResult, setAdvisoryResult] = useState(null);

  // Recalculate live stats
  useEffect(() => {
    let creditsSum = 0;
    let qualityPointsSum = 0;

    courses.forEach(c => {
      const cr = parseFloat(c.credits) || 0;
      const gp = GRADE_POINTS[c.grade] || 0;
      creditsSum += cr;
      qualityPointsSum += cr * gp;
    });

    setTotalCredits(creditsSum);

    if (creditsSum === 0) {
      setLiveGpa('0.00');
      return;
    }

    const computed = qualityPointsSum / creditsSum;
    setLiveGpa(computed.toFixed(2));
  }, [courses]);

  // Recalculate advisory projection
  useEffect(() => {
    const currentGpa = parseFloat(liveGpa) || 0;
    const target = parseFloat(targetCgpa) || 0;
    const remaining = parseFloat(remainingCredits) || 0;

    if (isNaN(target) || isNaN(remaining) || remaining <= 0 || totalCredits <= 0) {
      setAdvisoryResult(null);
      return;
    }

    // Equation: (currentGpa * totalCredits + neededGpa * remaining) / (totalCredits + remaining) = target
    // neededGpa = (target * (totalCredits + remaining) - currentGpa * totalCredits) / remaining
    const totalFutureCredits = totalCredits + remaining;
    const neededGpa = (target * totalFutureCredits - currentGpa * totalCredits) / remaining;

    setAdvisoryResult({
      neededGpa: neededGpa.toFixed(2),
      isFeasible: neededGpa <= 4.00 && neededGpa >= 0.00
    });
  }, [liveGpa, totalCredits, targetCgpa, remainingCredits]);

  // Handlers
  const handleNameChange = (index, name) => {
    const updated = [...courses];
    updated[index].name = name;
    setCourses(updated);
  };

  const handleCreditsChange = (index, credits) => {
    const updated = [...courses];
    updated[index].credits = credits;
    setCourses(updated);
  };

  const handleGradeChange = (index, grade) => {
    const updated = [...courses];
    updated[index].grade = grade;
    setCourses(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { name: `Course ${courses.length + 1}`, credits: '3', grade: 'A' }]);
  };

  const removeCourse = (index) => {
    setCourses(courses.filter((_, idx) => idx !== index));
  };

  // Recharts Data Prep
  const chartData = courses.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
    gp: GRADE_POINTS[c.grade] || 0,
    fullName: c.name,
    grade: c.grade,
    credits: c.credits
  }));

  // GPA rating text
  const getGpaRating = (val) => {
    const g = parseFloat(val);
    if (g >= 3.8) return { label: 'Summa Cum Laude', color: 'text-goldDark' };
    if (g >= 3.5) return { label: 'Excellent (Deans List)', color: 'text-gold' };
    if (g >= 3.0) return { label: 'Good Standing', color: 'text-emerald-600' };
    if (g >= 2.0) return { label: 'Average', color: 'text-slate-600' };
    return { label: 'Academic Warning', color: 'text-red-500' };
  };

  const currentRating = getGpaRating(liveGpa);

  return (
    <div className="min-h-[85vh] py-8 px-4 flex flex-col space-y-10 text-[13px] relative select-none">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-maqsadOrange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-[1000px] mx-auto w-full text-center md:text-left relative z-10">
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-white">
            Semester <span className="text-gold font-serif italic">GPA / CGPA</span> Calculator
          </h1>
          <p className="text-muted dark:text-white/60 leading-relaxed font-light text-sm">
            Compute semester grade point average and project targets for academic honors.
          </p>
        </div>
        <EduAnimation type="calculator" />
      </div>

      {/* Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10 max-w-[1000px] mx-auto w-full">
        
        {/* Left Column: Form Sheets */}
        <div className="flex-1 w-full space-y-6">
          
          <div className="glass-panel rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-border">
              <span className="text-[11px] font-extrabold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-gold" />
                Course Performance Sheet
              </span>
              <button
                type="button"
                onClick={addCourse}
                className="px-3.5 py-2 bg-ink text-white hover:bg-gold hover:text-ink font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:translate-y-0 hover:-translate-y-0.5 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {courses.map((course, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2 items-center"
                  >
                    {/* Course Title */}
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => handleNameChange(idx, e.target.value)}
                      className="flex-1 p-3 bg-white/50 border border-border rounded-xl text-xs font-semibold text-ink focus:border-gold outline-none"
                      placeholder="e.g. Programming Fundamentals"
                    />

                    {/* Credit Hours */}
                    <select
                      value={course.credits}
                      onChange={(e) => handleCreditsChange(idx, e.target.value)}
                      className="w-20 p-3 bg-white/50 border border-border rounded-xl text-xs font-bold text-ink cursor-pointer text-center outline-none focus:border-gold"
                    >
                      <option value="1">1 CH</option>
                      <option value="2">2 CH</option>
                      <option value="3">3 CH</option>
                      <option value="4">4 CH</option>
                    </select>

                    {/* Grade */}
                    <select
                      value={course.grade}
                      onChange={(e) => handleGradeChange(idx, e.target.value)}
                      className="w-28 p-3 bg-white/50 border border-border rounded-xl text-xs font-extrabold text-goldDark cursor-pointer outline-none focus:border-gold"
                    >
                      {Object.keys(GRADE_POINTS).map(g => (
                        <option key={g} value={g}>
                          {g} ({GRADE_POINTS[g].toFixed(2)})
                        </option>
                      ))}
                    </select>

                    {/* Remove button */}
                    {courses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourse(idx)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors w-11 h-11 flex items-center justify-center border border-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Dynamic Recharts Bar Chart Card */}
          {courses.length > 0 && (
            <div className="glass-panel rounded-3xl shadow-2xl p-6">
              <h3 className="text-[11px] font-extrabold text-ink uppercase tracking-wider mb-6 pb-3 border-b border-border flex items-center gap-1.5">
                <ChartBar className="w-4 h-4 text-gold" />
                Course Performance Distribution
              </h3>
              
              <div className="w-full h-48 text-[11px] font-bold">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#1d1c34" fontSize={9} tickLine={false} />
                    <YAxis domain={[0, 4.0]} stroke="#1d1c34" fontSize={9} tickLine={false} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-ink text-white p-3 rounded-xl border border-white/10 shadow-xl space-y-1">
                              <p className="font-extrabold text-xs">{data.fullName}</p>
                              <p className="text-gold font-bold">Grade: {data.grade} ({data.gp.toFixed(2)} GP)</p>
                              <p className="text-[10px] text-white/50">Credit Hours: {data.credits}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="gp" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.gp >= 3.67 ? '#0B5D56' : '#4A605E'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Dashboards (Live HUD & Advisory) */}
        <div className="w-full lg:w-80 space-y-6 flex-shrink-0 sticky top-24">
          
          {/* Circular HUD Dial */}
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={2000}>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-5 text-ink dark:text-white shadow-2xl relative overflow-hidden"
            >
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-goldDark mb-5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Live GPA Dashboard
            </h3>

            <div className="flex flex-col items-center justify-center mb-6 relative">
              <svg width="150" height="150" className="rotate-[-90deg]">
                <circle cx="75" cy="75" r="62" fill="transparent" stroke="rgba(0,0,0,0.06)" strokeWidth="10" />
                <motion.circle 
                  cx="75" cy="75" r="62" fill="transparent" 
                  stroke="#0B5D56" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={390}
                  animate={{ strokeDashoffset: 390 - (390 * (parseFloat(liveGpa) || 0)) / 4.0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4.5xl font-black text-ink">{liveGpa}</span>
                <span className="text-[8px] uppercase text-muted tracking-widest mt-1">out of 4.00</span>
              </div>
            </div>

            <div className="space-y-3.5 border-t border-border pt-4 text-center">
              <span className={`font-bold text-xs uppercase ${currentRating.color}`}>{currentRating.label}</span>
              <p className="text-[11px] text-muted dark:text-gray-400">Total Credit Hours: <strong>{totalCredits}</strong></p>
            </div>
          </motion.div>
          </Tilt>

          {/* Target Advisory Widget */}
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={2000}>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-5 shadow-2xl space-y-4 text-ink dark:text-white"
            >
            <h3 className="text-[11px] font-extrabold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-gold" />
              Target CGPA Advisor
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Target CGPA Goal</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="1.0" 
                  max="4.0" 
                  value={targetCgpa} 
                  onChange={e => setTargetCgpa(e.target.value)} 
                  className="w-full p-2.5 bg-white/50 border border-border rounded-xl font-bold text-ink outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Remaining Credits</label>
                <input 
                  type="number" 
                  min="1" 
                  max="130" 
                  value={remainingCredits} 
                  onChange={e => setRemainingCredits(e.target.value)} 
                  className="w-full p-2.5 bg-white/50 border border-border rounded-xl font-bold text-ink outline-none focus:border-gold"
                />
              </div>
            </div>

            {advisoryResult && (
              <div className="pt-2 border-t border-border mt-3">
                {advisoryResult.isFeasible ? (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                    <p className="font-extrabold">👍 Target Feasible</p>
                    <p className="font-light">To achieve your target of <strong>{parseFloat(targetCgpa).toFixed(2)}</strong>, you need an average GPA of <span className="font-bold text-emerald-700 dark:text-emerald-400">{advisoryResult.neededGpa}</span> in your remaining {remainingCredits} credits.</p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs text-red-800 dark:text-red-300 space-y-1">
                    <p className="font-extrabold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Goal Out of Reach
                    </p>
                    <p className="font-light">Mathematically impossible. Reaching <strong>{parseFloat(targetCgpa).toFixed(2)}</strong> requires a GPA of <span className="font-bold text-red-600 dark:text-red-400">{advisoryResult.neededGpa}</span>. Consider lower target limits.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
          </Tilt>
        </div>

      </div>

    </div>
  );
}
