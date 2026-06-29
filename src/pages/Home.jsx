import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import { 
  Calculator, 
  CalendarDays, 
  TrendingUp, 
  Clock, 
  ArrowRightLeft, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  School, 
  MessageSquare 
} from 'lucide-react';
import { 
  publicUniversities, 
  privateUniversities, 
  semiGovtUniversities, 
  allUniversities,
  getUniversityLogo
} from '../data/universities';
import AdvancedSearch from '../components/AdvancedSearch';
import SpotlightCard from '../components/SpotlightCard';

export default function Home() {
  const navigate = useNavigate();
  const marqueeUniversities = allUniversities.filter(u => u.id !== 'dha-suffa');
  // Selected default font is Gamilia

  // Quick Calculator State
  const [calcUniId, setCalcUniId] = useState('nust');
  const [calcMatric, setCalcMatric] = useState('');
  const [calcFsc, setCalcFsc] = useState('');
  const [calcTest, setCalcTest] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  const [calcError, setCalcError] = useState('');

  // Quick Compare State
  const [compUniA, setCompUniA] = useState('nust');
  const [compUniB, setCompUniB] = useState('fast');

  // Live Statistics State
  const [stats, setStats] = useState({ calculations: 120000, universities: 0, consults: 10000 });

  // FAQ Accordion State
  const [faqActiveIdx, setFaqActiveIdx] = useState(null);

  // Animate stats counting up on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const targetCalculations = 124582;
    const targetUniversities = allUniversities.length || 45;
    const targetConsults = 12840;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: outQuad
      const easeProgress = progress * (2 - progress);

      setStats({
        calculations: Math.floor(easeProgress * targetCalculations),
        universities: Math.floor(easeProgress * targetUniversities),
        consults: Math.floor(easeProgress * targetConsults)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Get current weights for quick calculator
  const selectedUni = allUniversities.find(u => u.id === calcUniId) || allUniversities[0];
  let formulaWeights = selectedUni?.formula;
  if (!formulaWeights && selectedUni?.programGroups?.[0]?.formulas?.["FSc"]) {
    formulaWeights = selectedUni.programGroups[0].formulas["FSc"];
  }
  if (!formulaWeights) {
    formulaWeights = { matric: 10, fsc: 40, test: 50 };
  }

  // Auto-clear test input if test has 0 weight
  useEffect(() => {
    if (formulaWeights.test === 0) {
      setCalcTest('');
    }
  }, [calcUniId, formulaWeights]);

  const handleQuickCalculate = () => {
    setCalcError('');
    setCalcResult(null);

    const matricVal = parseFloat(calcMatric);
    const fscVal = parseFloat(calcFsc);
    const testVal = formulaWeights.test === 0 ? 0 : parseFloat(calcTest);

    if (isNaN(matricVal) || matricVal < 0 || matricVal > 100) {
      setCalcError('Please enter a valid Matric % (0 - 100).');
      return;
    }
    if (isNaN(fscVal) || fscVal < 0 || fscVal > 100) {
      setCalcError('Please enter a valid FSc / Inter % (0 - 100).');
      return;
    }
    if (formulaWeights.test > 0 && (isNaN(testVal) || testVal < 0 || testVal > 100)) {
      setCalcError('Please enter a valid Entry Test % (0 - 100).');
      return;
    }

    const mWeight = formulaWeights.matric || 0;
    const fWeight = formulaWeights.fsc || 0;
    const tWeight = formulaWeights.test || 0;

    const aggregate = (matricVal * mWeight / 100) + (fscVal * fWeight / 100) + (testVal * tWeight / 100);
    setCalcResult(parseFloat(aggregate.toFixed(2)));
  };

  const handleQuickCompare = () => {
    navigate(`/compare?uni1=${compUniA}&uni2=${compUniB}`);
  };

  const uniADetails = allUniversities.find(u => u.id === compUniA);
  const uniBDetails = allUniversities.find(u => u.id === compUniB);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="py-4 flex flex-col space-y-12 select-none relative overflow-hidden">
      <Helmet>
        <title>Dakhala | Pakistan University Admissions & Merit Calculators 2026</title>
        <meta name="description" content="Official admissions directory for NUST, FAST, MDCAT, GIKI, and UET. Calculate aggregate merit, compare tuition fee structures, and check entry test timelines." />
        <meta name="keywords" content="university admissions Pakistan, aggregate calculator, merit calculator, MDCAT aggregate calculator, NUST aggregate calculator, FAST merit calculator, admissions 2026" />
      </Helmet>
      
      {/* Abstract Glowing Blobs in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-maqsadOrange/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pt-4 pb-20 relative z-10 flex flex-col items-center text-center space-y-8"
      >
        <div className="max-w-4xl space-y-6">
          <h1 className="hero-heading text-4xl md:text-6xl text-ink dark:text-white tracking-tight leading-tight font-mileast">
            University Admissions <br />
            <span className="relative inline-block my-4 select-none font-elmessiri font-bold not-italic normal-case text-8xl md:text-[8rem] lg:text-[9.5rem] leading-none">
              <span className="absolute inset-0 text-transparent urdu-hero-stroke" aria-hidden="true">داخلہ</span>
              <span className="relative text-[#25A18E]">داخلہ</span>
            </span> <br />
            Made Simple
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-muted leading-relaxed font-light">
            Calculate aggregate merit, compare tuition fee structures, and check entry test timelines across Pakistan.
          </p>
        </div>

        {/* Spacer to push search bar down below the fold */}
        <div className="h-12 md:h-20 lg:h-24 w-full" aria-hidden="true" />

        {/* Advanced AI Semantic Search Bar */}
        <div className="w-full">
          <AdvancedSearch />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-lg justify-center w-full">
          <Link
            to="/calculator/university"
            className="px-8 py-4 bg-ink hover:bg-gold text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-gold/30 hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" /> Full Calculator
          </Link>
          <Link
            to="/recommend"
            className="px-8 py-4 bg-white/85 backdrop-blur-md hover:bg-white text-ink font-bold text-sm uppercase tracking-wider rounded-xl border-2 border-border hover:border-gold transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 flex items-center justify-center"
          >
            University Recommendation
          </Link>
        </div>
      </motion.div>

      {/* Dual Scrolling Logo Marquees of Universities */}
      <div className="relative z-10 py-6 overflow-hidden flex flex-col space-y-4">
        {/* Track 1: LTR */}
        <div className="relative flex overflow-x-hidden py-2 select-none">
          <div className="animate-marquee-ltr flex space-x-4 whitespace-nowrap">
            {[...marqueeUniversities, ...marqueeUniversities].map((uni, idx) => (
              <div 
                key={`ltr-${uni.id}-${idx}`} 
                onClick={() => navigate(`/calculator/university/${uni.slug}`)}
                className="w-20 h-20 sm:w-32 sm:h-32 bg-white/50 dark:bg-white/[0.03] border border-border/60 dark:border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md backdrop-blur-md hover:border-gold dark:hover:border-gold hover:scale-110 transition-all cursor-pointer select-none shrink-0"
              >
                <img 
                  src={getUniversityLogo(uni.id)} 
                  alt={`${uni.shortName} Logo`}
                  className="h-12 w-12 sm:h-24 sm:w-24 object-contain"
                  onError={(e) => { 
                    e.target.style.display = 'none'; 
                    e.target.nextSibling.style.display = 'flex'; 
                  }} 
                />
                <span className="hidden w-12 h-12 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl bg-gold/10 text-gold text-xs sm:text-sm font-black items-center justify-center text-center leading-none">
                  {uni.shortName.substring(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2: RTL */}
        <div className="relative flex overflow-x-hidden py-2 select-none">
          <div className="animate-marquee-rtl flex space-x-4 whitespace-nowrap">
            {[...marqueeUniversities, ...marqueeUniversities].reverse().map((uni, idx) => (
              <div 
                key={`rtl-${uni.id}-${idx}`} 
                onClick={() => navigate(`/calculator/university/${uni.slug}`)}
                className="w-20 h-20 sm:w-32 sm:h-32 bg-white/50 dark:bg-white/[0.03] border border-border/60 dark:border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md backdrop-blur-md hover:border-gold dark:hover:border-gold hover:scale-110 transition-all cursor-pointer select-none shrink-0"
              >
                <img 
                  src={getUniversityLogo(uni.id)} 
                  alt={`${uni.shortName} Logo`}
                  className="h-12 w-12 sm:h-24 sm:w-24 object-contain"
                  onError={(e) => { 
                    e.target.style.display = 'none'; 
                    e.target.nextSibling.style.display = 'flex'; 
                  }} 
                />
                <span className="hidden w-12 h-12 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl bg-gold/10 text-gold text-xs sm:text-sm font-black items-center justify-center text-center leading-none">
                  {uni.shortName.substring(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Admission Journey Simulator */}
      <div className="relative z-10 py-4">
        <EduAnimation type="landing" />
      </div>

      {/* Bento Grid Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
      >


        {/* Cell 3: Merit Trend Sparkline (Col span: 1) */}
        <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.01} transitionSpeed={2000}>
          <div className="flat-card p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-maqsadBlue/15 p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5 text-maqsadBlue" />
              </div>
              <h3 className="text-lg font-bold text-ink dark:text-white tracking-tight">Merit Cutoff Trends</h3>
            </div>
            <p className="text-xs text-muted mb-4 font-light leading-relaxed font-sans">
              Hover over the sparkline to track how FAST CS merit closing aggregates have steadily risen.
            </p>
            
            <div className="relative w-full h-24 mb-3 group/chart">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="0.5" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="0.5" />
                <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" strokeWidth="0.5" />
                
                <path 
                  d="M 5,30 L 28,26 L 51,21 L 74,15 L 95,8" 
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)]"
                />
                
                {[
                  { x: 5, y: 30, year: 2021, val: "74.0%" },
                  { x: 28, y: 26, year: 2022, val: "76.0%" },
                  { x: 51, y: 21, year: 2023, val: "78.5%" },
                  { x: 74, y: 15, year: 2024, val: "79.8%" },
                  { x: 95, y: 8, year: 2025, val: "80.5%" }
                ].map((pt, idx) => (
                  <g key={idx} className="cursor-pointer group/node">
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r="2.5" 
                      fill="#3B82F6" 
                      className="hover:r-3.5 transition-all fill-white stroke-[#3B82F6] stroke-2" 
                    />
                    <text 
                      x={pt.x} 
                      y={pt.y - 6} 
                      textAnchor="middle" 
                      fontSize="4.5" 
                      className="hidden group-hover/node:block font-bold fill-ink dark:fill-white text-[5px]"
                    >
                      {pt.year}: {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-muted font-bold px-1.5 font-sans">
              <span>2021</span>
              <span>2022</span>
              <span>2023</span>
              <span>2024</span>
              <span>2025</span>
            </div>
          </div>
          
          <Link to="/past-merits" className="text-maqsadBlue text-xs font-bold hover:underline flex items-center gap-1 mt-4">
            Compare Historical Lists <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        </Tilt>

        {/* Cell 4: Quick Program Compare (Col span: 2) */}
        <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} transitionSpeed={2000} className="md:col-span-2">
          <div className="flat-card p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-goldDark/15 p-2.5 rounded-xl">
                <ArrowRightLeft className="w-5 h-5 text-goldDark" />
              </div>
              <h3 className="text-lg font-bold text-ink dark:text-white tracking-tight">Quick University Comparator</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Select University A</label>
                <select 
                  value={compUniA} 
                  onChange={(e) => setCompUniA(e.target.value)}
                  className="w-full bg-white/60 dark:bg-white/[0.05] border border-border/80 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-ink dark:text-white focus:outline-none focus:border-gold transition-colors font-sans"
                >
                  {allUniversities.map(uni => (
                    <option key={`comp-a-${uni.id}`} value={uni.id} className="dark:bg-ink text-black dark:text-white font-sans">
                      {uni.name} ({uni.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Select University B</label>
                <select 
                  value={compUniB} 
                  onChange={(e) => setCompUniB(e.target.value)}
                  className="w-full bg-white/60 dark:bg-white/[0.05] border border-border/80 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-ink dark:text-white focus:outline-none focus:border-gold transition-colors font-sans"
                >
                  {allUniversities.map(uni => (
                    <option key={`comp-b-${uni.id}`} value={uni.id} className="dark:bg-ink text-black dark:text-white font-sans">
                      {uni.name} ({uni.shortName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {uniADetails && uniBDetails && (
              <div className="grid grid-cols-2 gap-4 p-3 bg-white/30 dark:bg-white/[0.02] border border-border/40 dark:border-white/5 rounded-xl text-xs mb-2">
                <div className="border-r border-border/40 dark:border-white/5 pr-2">
                  <p className="font-bold text-goldDark font-sans">{uniADetails.shortName}</p>
                  <p className="text-muted mb-1 font-sans">{uniADetails.city} • Sector: {publicUniversities.some(u => u.id === uniADetails.id) ? "Public" : "Private"}</p>
                  <p className="font-semibold text-ink dark:text-white font-sans">Fee: Rs. {uniADetails.feePerSemester?.toLocaleString()}/sem</p>
                </div>
                <div className="pl-2">
                  <p className="font-bold text-black dark:text-gold font-sans">{uniBDetails.shortName}</p>
                  <p className="text-muted mb-1 font-sans">{uniBDetails.city} • Sector: {publicUniversities.some(u => u.id === uniBDetails.id) ? "Public" : "Private"}</p>
                  <p className="font-semibold text-ink dark:text-white font-sans">Fee: Rs. {uniBDetails.feePerSemester?.toLocaleString()}/sem</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center border-t border-border/40 dark:border-white/5 pt-4">
            <button 
              onClick={handleQuickCompare}
              className="px-6 py-2.5 bg-ink hover:bg-gold hover:text-white text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 w-full sm:w-auto font-sans"
            >
              Compare Side-by-Side
            </button>
            <Link to="/compare" className="text-goldDark text-xs font-bold hover:underline hidden sm:flex items-center gap-1">
              Full Comparison Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        </Tilt>
      </motion.div>

      {/* Program Finder / Quick Filter Row */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="relative z-10 flex flex-col space-y-4"
      >
        <h3 className="text-sm font-bold text-ink dark:text-white text-center uppercase tracking-[0.2em] font-sans">
          Popular Fields of Study
        </h3>
        
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "Computer Science", category: "cs", icon: "💻" },
            { label: "Engineering", category: "engineering", icon: "⚙️" },
            { label: "Medical & Dental", category: "medical", icon: "🩺" },
            { label: "Business & Management", category: "business", icon: "💼" },
            { label: "Natural Sciences", category: "science", icon: "🔬" },
            { label: "Arts & Humanities", category: "arts", icon: "🎨" }
          ].map((field, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/search?category=${field.category}`)}
              className="px-5 py-3 bg-white/40 dark:bg-white/[0.03] border border-border/80 dark:border-white/10 rounded-2xl hover:border-gold dark:hover:border-gold hover:bg-white/80 dark:hover:bg-white/[0.08] text-xs font-bold text-ink dark:text-white flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 font-sans"
            >
              <span>{field.icon}</span>
              {field.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Platform Impact Dashboard (Live Stats) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="flat-card p-8 md:p-10 relative z-10 overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="text-sm font-bold text-ink dark:text-white mb-8 text-center uppercase tracking-[0.2em] font-sans">
          Dakhala Impact & Coverage
        </h3>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-8 text-center relative z-10">
          <div className="py-2 sm:py-4 px-1 sm:px-2 hover:scale-[1.03] transition-transform duration-300">
            <div className="bg-gold/10 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
              <Calculator className="w-4 h-4 sm:w-6 sm:h-6 text-gold" />
            </div>
            <div className="text-sm sm:text-3xl md:text-4xl font-extrabold text-ink dark:text-white mb-1 sm:mb-1.5 tracking-tight font-sans">
              {stats.calculations.toLocaleString()}+
            </div>
            <div className="text-[8px] sm:text-xs font-semibold text-muted uppercase tracking-wider leading-tight">Aggregates Calculated</div>
          </div>
          
          <div className="py-2 sm:py-4 px-1 sm:px-2 border-x border-border/50 dark:border-white/5 hover:scale-[1.03] transition-transform duration-300">
            <div className="bg-maqsadOrange/10 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
              <School className="w-4 h-4 sm:w-6 sm:h-6 text-maqsadOrange" />
            </div>
            <div className="text-sm sm:text-3xl md:text-4xl font-extrabold text-ink dark:text-white mb-1 sm:mb-1.5 tracking-tight font-sans">
              {stats.universities}+
            </div>
            <div className="text-[8px] sm:text-xs font-semibold text-muted uppercase tracking-wider leading-tight">Universities Mapped</div>
          </div>
          
          <div className="py-2 sm:py-4 px-1 sm:px-2 hover:scale-[1.03] transition-transform duration-300">
            <div className="bg-maqsadBlue/10 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-3">
              <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-maqsadBlue" />
            </div>
            <div className="text-sm sm:text-3xl md:text-4xl font-extrabold text-ink dark:text-white mb-1 sm:mb-1.5 tracking-tight font-sans">
              {stats.consults.toLocaleString()}+
            </div>
            <div className="text-[8px] sm:text-xs font-semibold text-muted uppercase tracking-wider leading-tight">Advisory Consults</div>
          </div>
        </div>
      </motion.div>

      {/* Interactive FAQ Accordion Block */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="flat-card p-6 md:p-8 relative z-10"
      >
        <h3 className="text-base md:text-lg font-bold text-ink dark:text-white mb-6 text-center uppercase tracking-[0.2em] font-sans">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-3.5 max-w-3xl mx-auto">
          {[
            {
              q: "How does IBCC A-level equivalence affect my aggregate?",
              a: "IBCC maps A-level letter grades to numerical marks out of 100 (A* = 90, A = 85, B = 75, etc.). For intermediate system admissions, universities usually calculate aggregate based on O-level equivalence or mid-term results, adjusting final admissions once A-level transcripts are submitted."
            },
            {
              q: "Can I apply to computing fields with pre-medical background?",
              a: "Yes! According to the new HEC guidelines, students with a Pre-Medical intermediate background can apply for BS Computer Science, Software Engineering, Data Science, and Artificial Intelligence, provided they pass a deficiency Mathematics course in their first year."
            },
            {
              q: "What is the weightage of NUST NET compared to intermediate scores?",
              a: "For NUST, the entry test (NET) carries a massive 75% weightage. Intermediate (FSc/A-levels) counts for 15%, and Matric/O-levels counts for 10%. This means doing well on the entry test is critical to securing admission."
            },
            {
              q: "How do I calculate CGPA to percentage?",
              a: "Unlike school grades, CGPA-to-percentage conversion varies by university. Typically, HEC's standardized formula is used: Percentage = (CGPA / 4.0) * 100, though some universities use custom linear scaling."
            }
          ].map((faq, idx) => {
            const isOpen = faqActiveIdx === idx;
            return (
              <div 
                key={idx} 
                className="border border-border/60 dark:border-white/5 rounded-2xl bg-white/20 dark:bg-white/[0.01] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setFaqActiveIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left font-bold text-base text-ink dark:text-white hover:bg-white/40 dark:hover:bg-white/[0.03] transition-colors focus:outline-none font-sans"
                >
                  <span>{faq.q}</span>
                  <span className="text-gold">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-48 border-t border-border/40 dark:border-white/5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-5 py-4 text-sm md:text-base text-muted leading-relaxed font-light font-sans">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
