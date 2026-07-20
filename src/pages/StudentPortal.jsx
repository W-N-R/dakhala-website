import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/useAuthStore';
import EduAnimation from '../components/EduAnimation';
import Tilt from 'react-parallax-tilt';
import { loginWithEmail, registerWithEmail, logout, resetPassword } from '../lib/firebase';
import { 
  GraduationCap, User, Mail, Lock, LogOut, Trash2, 
  Calculator, Calendar, MapPin, TrendingUp, AlertCircle, Check, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUniversityLogo } from '../data/universities';

export default function StudentPortal() {
  const { user, setUser, clearUser, loading } = useAuthStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard content states
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [savedUnis, setSavedUnis] = useState([]);

  // Load user data on mount / user state change
  useEffect(() => {
    if (user) {
      loadSavedData();
    }
  }, [user]);

  const loadSavedData = () => {
    const calcs = localStorage.getItem('dakhala-saved-aggregates');
    setSavedCalculations(calcs ? JSON.parse(calcs) : []);

    const unis = localStorage.getItem('dakhala-saved-unis');
    setSavedUnis(unis ? JSON.parse(unis) : []);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLoginView) {
        const u = await loginWithEmail(email, password);
        setUser(u);
        setSuccessMsg('Successfully signed in!');
      } else {
        const u = await registerWithEmail(email, password);
        setUser(u);
        setSuccessMsg('Account registered successfully!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message.replace("Firebase: ", ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address first.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await resetPassword(email);
      setSuccessMsg('Password reset email sent! Check your inbox.');
    } catch (err) {
      console.error(err);
      if (err.message.includes("not configured")) {
        setErrorMsg("Firebase is not configured yet. Please add your credentials to .env.local");
      } else {
        setErrorMsg(err.message.replace("Firebase: ", ""));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCalculation = (id) => {
    const updated = savedCalculations.filter(c => c.id !== id);
    setSavedCalculations(updated);
    localStorage.setItem('dakhala-saved-aggregates', JSON.stringify(updated));
  };

  const deleteUni = (id) => {
    const updated = savedUnis.filter(u => u.id !== id);
    setSavedUnis(updated);
    localStorage.setItem('dakhala-saved-unis', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-muted uppercase tracking-wider">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-[1280px] mx-auto min-h-[80vh] px-4">
      <Helmet>
        <title>Student Portal | Dakhala</title>
        <meta name="description" content="Manage your personal Dakhala dashboard, saved aggregate calculators, and track target university admissions." />
      </Helmet>

      {/* Hero Header */}
      <div className="text-center select-none relative mb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl -z-10" />
        <h2 className="text-3xl md:text-5xl font-extrabold text-ink dark:text-white mb-4 tracking-tight">Student Admission Portal</h2>
        <p className="text-sm text-muted dark:text-gray-400 max-w-lg mx-auto font-medium">
          Track your customized university eligibility, saved calculations, and admissions target boards.
        </p>
      </div>

      {!user ? (
        /* ================== SIGN IN / REGISTER FORM ================== */
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center max-w-4xl mx-auto">
          {/* Info Side */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <EduAnimation type="portal" />
            </div>
            <h3 className="text-2xl font-black text-ink dark:text-white">One Account, Endless Admission Metrics</h3>
            <p className="text-xs text-muted dark:text-gray-400 leading-relaxed max-w-md">
              Save your aggregates, compare university cutoff statistics, track entry test schedules, and check if you meet criteria across leading institutions in Pakistan.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/5 rounded-2xl">
                <Calculator className="w-5 h-5 text-gold mb-2" />
                <h4 className="text-xs font-bold text-ink dark:text-white">Save Aggregates</h4>
                <p className="text-[10px] text-muted">Never lose calculations for NUST, FAST, MDCAT, etc.</p>
              </div>
              <div className="p-4 bg-white/40 dark:bg-white/[0.02] border border-border dark:border-white/5 rounded-2xl">
                <TrendingUp className="w-5 h-5 text-gold mb-2" />
                <h4 className="text-xs font-bold text-ink dark:text-white">Track Cutoffs</h4>
                <p className="text-[10px] text-muted">Compare your score with 2025 cutoff data.</p>
              </div>
            </div>
          </div>

          {/* Form Side wrapped in Tilt */}
          <div className="w-full max-w-md flex-shrink-0">
            <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.01} glareEnable={true} glareMaxOpacity={0.15} className="rounded-3xl shadow-2xl overflow-hidden border border-border dark:border-white/10">
              <div className="bg-white dark:bg-[#0C132C] p-8 space-y-6">
                <div className="flex justify-between border-b border-gray-150 dark:border-white/10 pb-4">
                  <button
                    onClick={() => { setIsLoginView(true); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`flex-1 text-center font-bold text-xs uppercase tracking-wider pb-1 ${isLoginView ? 'text-gold border-b-2 border-gold' : 'text-muted hover:text-ink dark:hover:text-white'}`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsLoginView(false); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`flex-1 text-center font-bold text-xs uppercase tracking-wider pb-1 ${!isLoginView ? 'text-gold border-b-2 border-gold' : 'text-muted hover:text-ink dark:hover:text-white'}`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {!isLoginView && (
                    <div className="relative">
                      <User className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-250 dark:border-gray-700 rounded-xl text-xs focus:border-gold outline-none text-ink dark:text-cloudy"
                        required={!isLoginView}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-250 dark:border-gray-700 rounded-xl text-xs focus:border-gold outline-none text-ink dark:text-cloudy"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-250 dark:border-gray-700 rounded-xl text-xs focus:border-gold outline-none text-ink dark:text-cloudy"
                      required
                    />
                  </div>
                  
                  {isLoginView && (
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-muted hover:text-gold transition-colors underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-goldDark text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] disabled:opacity-75"
                  >
                    {isSubmitting ? 'Processing...' : isLoginView ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-start gap-2 border border-rose-500/20">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-start gap-2 border border-emerald-500/20">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}
              </div>
            </Tilt>
          </div>
        </div>
      ) : (
        /* ================== SIGNED IN STUDENT DASHBOARD ================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start select-none">
          
          {/* LEFT COLUMN: User Summary (col-span-4) */}
          <div className="lg:col-span-4 w-full">
            <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.01} className="rounded-3xl shadow-xl border border-border dark:border-white/10 overflow-hidden bg-white dark:bg-[#0C132C]">
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <img 
                    src={user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || user.email)} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full border-4 border-gold shadow-md bg-white" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 p-1 bg-green-500 rounded-full border-2 border-white dark:border-[#0C132C]" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-ink dark:text-white">{user.displayName || 'Admissions Aspirant'}</h3>
                  <p className="text-xs text-muted dark:text-gray-400">{user.email}</p>
                </div>

                <div className="w-full flex items-center justify-center gap-2 px-3 py-1 bg-gold/15 text-goldDark border border-gold/30 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" /> Student Member
                </div>

                {user.email === 'wuhs.official@gmail.com' && (
                  <Link
                    to="/admin-portal"
                    className="w-full py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-xl text-xs font-bold text-center block"
                  >
                    ⚙️ Admin Console
                  </Link>
                )}

                <div className="border-t border-gray-150 dark:border-white/5 w-full pt-4 space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/25 rounded-xl text-xs font-bold transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </Tilt>
            
            <div className="mt-6 flex justify-center">
              <EduAnimation type="portal" />
            </div>
          </div>

          {/* RIGHT COLUMN: Saved Aggregates & Bookmarks (col-span-8) */}
          <div className="lg:col-span-8 w-full space-y-6">
            
            {/* SAVED CALCULATIONS CARD */}
            <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/5 pb-3">
                <h3 className="text-base font-black text-ink dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-gold" />
                  Saved Calculations
                </h3>
                <span className="text-[10px] font-bold bg-cloudy dark:bg-white/5 px-2.5 py-1 rounded-full text-muted dark:text-cloudy">
                  {savedCalculations.length} Saved
                </span>
              </div>

              {savedCalculations.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="text-3xl">🧮</div>
                  <p className="text-xs text-muted dark:text-gray-400 font-medium">No saved aggregate calculations yet.</p>
                  <p className="text-[10px] text-muted max-w-xs mx-auto">
                    Go to any university calculator (e.g., NUST or FAST), enter your marks, and hit the "Save Score" button.
                  </p>
                  <Link to="/calculator/university" className="inline-block px-4 py-2 bg-gold hover:bg-goldDark text-white text-xs font-bold rounded-xl mt-2">
                    Explore Calculators
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedCalculations.map((calc) => (
                    <div 
                      key={calc.id} 
                      className="p-4 bg-white/40 dark:bg-white/[0.02] border border-border/80 dark:border-white/5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-gold/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-black text-ink dark:text-white leading-tight">
                            {calc.uniShortName} <span className="text-gold text-xs">({calc.program})</span>
                          </h4>
                          <p className="text-[10px] text-muted mt-1">{calc.date || 'Saved calc'}</p>
                        </div>
                        <button
                          onClick={() => deleteCalculation(calc.id)}
                          className="p-1.5 text-muted hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Delete Calculation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="bg-gold/10 p-3 rounded-xl border border-gold/25 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-goldDark">Aggregate:</span>
                        <span className="text-lg font-black text-goldDark">{calc.aggregate}%</span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-muted border-t border-gray-100 dark:border-white/5 pt-2.5">
                        <span>Matric: {calc.matricPercent}%</span>
                        <span>FSc: {calc.fscPercent}%</span>
                        <span>Test: {calc.testPercent}%</span>
                      </div>
                      
                      <Link 
                        to={`/calculator/university/${calc.uniSlug || 'nust'}`} 
                        className="w-full text-center py-2 bg-ink hover:bg-gold text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors"
                      >
                        Recalculate
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOOKMARKED UNIVERSITIES CARD */}
            <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/5 pb-3">
                <h3 className="text-base font-black text-ink dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gold" />
                  Target Universities
                </h3>
                <span className="text-[10px] font-bold bg-cloudy dark:bg-white/5 px-2.5 py-1 rounded-full text-muted dark:text-cloudy">
                  {savedUnis.length} Tracked
                </span>
              </div>

              {savedUnis.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="text-3xl">🏛️</div>
                  <p className="text-xs text-muted dark:text-gray-400 font-medium">No target universities selected yet.</p>
                  <p className="text-[10px] text-muted max-w-xs mx-auto">
                    Bookmark your target institutions across our explore grids or calculators to see them at a glance.
                  </p>
                  <Link to="/past-merits" className="inline-block px-4 py-2 bg-gold hover:bg-goldDark text-white text-xs font-bold rounded-xl mt-2">
                    Explore Directory
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedUnis.map((uni) => (
                    <div 
                      key={uni.id} 
                      className="p-4 bg-white/40 dark:bg-white/[0.02] border border-border/80 dark:border-white/5 rounded-2xl flex items-center justify-between hover:border-gold/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-border/30">
                          <img 
                            src={getUniversityLogo(uni.id)} 
                            alt={uni.shortName} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-ink dark:text-white leading-tight">{uni.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-muted">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{uni.city}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/merit-tracker/${uni.slug}`} 
                          className="px-2.5 py-1.5 bg-ink text-gold hover:bg-gold hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                        >
                          Cutoffs
                        </Link>
                        <button
                          onClick={() => deleteUni(uni.id)}
                          className="p-1.5 text-muted hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Remove Target"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
