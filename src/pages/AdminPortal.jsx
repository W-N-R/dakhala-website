import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldAlert, Users, Calendar, Settings, Trash2, ShieldCheck, Database, Award, ArrowLeft, Activity, TrendingUp, Share2, Clipboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import EduAnimation from '../components/EduAnimation';
import Tilt from 'react-parallax-tilt';
import { getAnalyticsSummary } from '../lib/telemetry';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0C132C]/90 text-white p-3 border border-white/10 rounded-xl shadow-xl text-xs backdrop-blur-md">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} style={{ color: item.color }} className="font-medium">
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminPortal() {
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'wuhs.official@gmail.com';

  const [activeSubTab, setActiveSubTab] = useState('analytics'); // 'analytics' | 'users' | 'dates' | 'formulas'
  const [usersList, setUsersList] = useState([]);
  const [calcCount, setCalcCount] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  // New Date form state
  const [dateTitle, setDateTitle] = useState('');
  const [dateType, setDateType] = useState('apply'); // 'apply' | 'test'
  const [dateValue, setDateValue] = useState('');
  const [dateUni, setDateUni] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
      setAnalytics(getAnalyticsSummary());
      const interval = setInterval(() => {
        setAnalytics(getAnalyticsSummary());
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadAdminData = () => {
    // Registered Users
    const uMap = JSON.parse(localStorage.getItem('dakhala-mock-users') || '{}');
    setUsersList(Object.values(uMap));

    // Saved Scorecards
    const calcs = JSON.parse(localStorage.getItem('dakhala-saved-aggregates') || '[]');
    setCalcCount(calcs.length);
  };

  const deleteUser = (email) => {
    if (email === 'wuhs.official@gmail.com') return; // Cannot delete admin
    const uMap = JSON.parse(localStorage.getItem('dakhala-mock-users') || '{}');
    delete uMap[email.toLowerCase()];
    localStorage.setItem('dakhala-mock-users', JSON.stringify(uMap));
    setUsersList(Object.values(uMap));
  };

  const handleAddDate = (e) => {
    e.preventDefault();
    if (!dateTitle || !dateValue || !dateUni) return;

    // Load current mock schedules
    const storageKey = dateType === 'apply' ? 'dakhala-mock-apply-dates' : 'dakhala-mock-test-dates';
    const dates = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newDate = {
      id: Date.now().toString(),
      title: dateTitle,
      uni: dateUni,
      date: new Date(dateValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      link: '#'
    };

    localStorage.setItem(storageKey, JSON.stringify([newDate, ...dates]));
    setDateTitle('');
    setDateUni('');
    setDateValue('');
    setFormSuccess('Important date added successfully!');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="py-20 px-4 flex flex-col items-center text-center min-h-[70vh] justify-center select-none">
        <Helmet>
          <title>Access Denied | Admin Portal</title>
        </Helmet>
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} className="w-full max-w-md bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-ink dark:text-white uppercase tracking-wider">Access Restricted</h1>
          <p className="text-xs text-muted dark:text-gray-400 max-w-sm leading-relaxed">
            You do not have administrative privileges to view this page. Please sign in with an authorized administrator account to continue.
          </p>
          <Link to="/student-portal" className="w-full py-3 bg-gold hover:bg-goldDark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98]">
            Go to Login
          </Link>
        </Tilt>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-[1280px] mx-auto min-h-[85vh] px-4 select-none">
      <Helmet>
        <title>Admin Dashboard | Dakhala</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-white dark:bg-[#0C132C] p-6 border border-border dark:border-white/10 rounded-3xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-gold/10 border border-gold/25 rounded-2xl flex items-center justify-center text-gold flex-shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-ink dark:text-white uppercase tracking-wider">Admin Dashboard</h1>
            <p className="text-xs text-muted dark:text-gray-400 mt-0.5">Secure Administrative Console • WUHS Official</p>
          </div>
        </div>
        <div className="flex gap-2 relative z-10 w-full md:w-auto">
          <Link to="/student-portal" className="flex-1 md:flex-initial py-2.5 px-4 bg-cloudy dark:bg-white/5 hover:bg-gray-150 border border-border dark:border-white/10 text-ink dark:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Student Portal
          </Link>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Stats Column (col-span-4) */}
        <div className="lg:col-span-4 w-full space-y-6">
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-6 shadow-md flex flex-col space-y-4">
            <h3 className="text-xs font-black text-ink dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-white/5 pb-2">System Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-blue-500/5 border border-blue-500/15 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted">Total Users</div>
                    <div className="text-base font-black text-ink dark:text-white">{usersList.length}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-gold/5 border border-gold/15 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-gold" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted">Calculations Saved</div>
                    <div className="text-base font-black text-ink dark:text-white">{calcCount}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-purple-500/5 border border-purple-500/15 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted">Formula Profiles</div>
                    <div className="text-base font-black text-ink dark:text-white">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </Tilt>

          <div className="flex justify-center">
            <EduAnimation type="portal" />
          </div>
        </div>

        {/* Right Dashboard Tabs Column (col-span-8) */}
        <div className="lg:col-span-8 w-full space-y-6">
          {/* Sub Navigation */}
          <div className="flex gap-2 p-1.5 bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeSubTab === 'analytics' ? 'bg-gold text-white shadow-md' : 'text-muted hover:text-ink dark:hover:text-white'}`}
            >
              <Activity className="w-4 h-4" /> Live Analytics
            </button>
            <button
              onClick={() => setActiveSubTab('users')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeSubTab === 'users' ? 'bg-gold text-white shadow-md' : 'text-muted hover:text-ink dark:hover:text-white'}`}
            >
              <Users className="w-4 h-4" /> Users List
            </button>
            <button
              onClick={() => setActiveSubTab('dates')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeSubTab === 'dates' ? 'bg-gold text-white shadow-md' : 'text-muted hover:text-ink dark:hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" /> Add Date
            </button>
            <button
              onClick={() => setActiveSubTab('formulas')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeSubTab === 'formulas' ? 'bg-gold text-white shadow-md' : 'text-muted hover:text-ink dark:hover:text-white'}`}
            >
              <Settings className="w-4 h-4" /> Formula Ed
            </button>
          </div>

          {/* TAB: REAL-TIME ANALYTICS */}
          {activeSubTab === 'analytics' && analytics && (
            <div className="space-y-6">
              
              {/* KPI Metrics row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-4 shadow-sm hover:scale-[1.02] transition-all">
                  <div className="text-muted dark:text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-500" /> Total Reach
                  </div>
                  <div className="text-xl font-extrabold text-ink dark:text-white">{analytics.totalViews}</div>
                  <div className="text-[10px] text-muted font-medium mt-0.5">Page views tracked</div>
                </div>

                <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-4 shadow-sm hover:scale-[1.02] transition-all">
                  <div className="text-muted dark:text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" /> Daily Visitors
                  </div>
                  <div className="text-xl font-extrabold text-ink dark:text-white">{analytics.uniqueVisitors}</div>
                  <div className="text-[10px] text-muted font-medium mt-0.5">Unique sessions</div>
                </div>

                <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-4 shadow-sm hover:scale-[1.02] transition-all">
                  <div className="text-muted dark:text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clipboard className="w-3.5 h-3.5 text-gold" /> Calculators
                  </div>
                  <div className="text-xl font-extrabold text-ink dark:text-white">{analytics.totalCalcs}</div>
                  <div className="text-[10px] text-emerald-500 font-extrabold mt-0.5">{analytics.conversionRate}% Conv. Rate</div>
                </div>

                <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-4 shadow-sm hover:scale-[1.02] transition-all">
                  <div className="text-muted dark:text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-emerald-500" /> Share & Connects
                  </div>
                  <div className="text-xl font-extrabold text-ink dark:text-white">{analytics.waClicks + analytics.shareClicks}</div>
                  <div className="text-[10px] text-muted font-medium mt-0.5">{analytics.shareClicks} shares • {analytics.waClicks} WA clicks</div>
                </div>
              </div>

              {/* Traffic Analysis Chart */}
              <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-5 shadow-sm">
                <h3 className="text-xs font-black text-ink dark:text-white uppercase tracking-wider mb-3">Daily Traffic Analysis (Past 7 Days)</h3>
                <div className="h-60 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.reachTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#7B61FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCalcs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FFB3" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#00FFB3" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                      <Area type="monotone" name="Page Views" dataKey="views" stroke="#7B61FF" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" name="Calculations" dataKey="calculations" stroke="#00FFB3" strokeWidth={2} fillOpacity={1} fill="url(#colorCalcs)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Statistics Masterclass Probability distribution curve */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Score Probability Distribution Curve */}
                <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-5 shadow-sm">
                  <div className="mb-3">
                    <h3 className="text-xs font-black text-ink dark:text-white uppercase tracking-wider">Aggregate Score Probability Density</h3>
                    <p className="text-[10px] text-muted">Normal distribution (Gaussian curve) of user calculations</p>
                  </div>
                  
                  {analytics.pdfData?.length > 0 ? (
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.pdfData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPdf" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FF007A" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#7B61FF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="score" stroke="#94A3B8" fontSize={8} label={{ value: 'Aggregate Score (%)', position: 'insideBottom', offset: -5, fontSize: 8 }} />
                          <YAxis stroke="#94A3B8" fontSize={8} />
                          <RechartsTooltip />
                          <Area type="monotone" name="Probability Density" dataKey="density" stroke="#FF007A" strokeWidth={2} fillOpacity={1} fill="url(#colorPdf)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-xs text-muted">Insufficient calculation data for probability analysis</div>
                  )}

                  {/* Masterclass details */}
                  <div className="grid grid-cols-3 gap-2 border-t border-border dark:border-white/5 pt-3.5 mt-3 text-center text-xs">
                    <div className="bg-cloudy dark:bg-white/5 rounded-xl p-2">
                      <div className="text-[9px] uppercase font-bold text-muted">μ (Mean)</div>
                      <div className="font-extrabold text-ink dark:text-white">{analytics.stats.mean || 0}%</div>
                    </div>
                    <div className="bg-cloudy dark:bg-white/5 rounded-xl p-2">
                      <div className="text-[9px] uppercase font-bold text-muted">Median</div>
                      <div className="font-extrabold text-ink dark:text-white">{analytics.stats.median || 0}%</div>
                    </div>
                    <div className="bg-cloudy dark:bg-white/5 rounded-xl p-2">
                      <div className="text-[9px] uppercase font-bold text-muted">σ (Std Dev)</div>
                      <div className="font-extrabold text-ink dark:text-white">±{analytics.stats.stdDev || 0}</div>
                    </div>
                  </div>
                </div>

                {/* Popular Calculators */}
                <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-ink dark:text-white uppercase tracking-wider mb-3">Popular University Calculators</h3>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.popularUnis} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} />
                          <YAxis stroke="#94A3B8" fontSize={8} />
                          <RechartsTooltip />
                          <Bar dataKey="calculations" fill="#0B5D56" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-[#0B5D56]/10 text-[#0B5D56] border border-[#0B5D56]/20 rounded-2xl p-2.5 text-center text-[10px] font-bold mt-2 leading-relaxed">
                    🎯 NUST and FAST remain the primary targets of admissions calculations.
                  </div>
                </div>

              </div>

              {/* Real-time Telemetry Log Feed */}
              <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-ink dark:text-white uppercase tracking-wider">Real-Time Telemetry Feed</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-black tracking-wider uppercase animate-pulse">Live</span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border dark:border-white/5 text-[11px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-cloudy dark:bg-white/[0.02] border-b border-border dark:border-white/5 text-[9px] font-black uppercase text-muted tracking-wider">
                        <th className="p-3">Event Type</th>
                        <th className="p-3">Visitor ID</th>
                        <th className="p-3">Path / Details</th>
                        <th className="p-3 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border/40 dark:border-white/[0.02] hover:bg-cloudy dark:hover:bg-white/[0.01]">
                          <td className="p-3 font-extrabold text-goldDark">PAGE_VIEW</td>
                          <td className="p-3 font-mono text-muted">{log.visitorId}</td>
                          <td className="p-3 font-medium text-ink dark:text-white truncate max-w-[200px]">{log.path}</td>
                          <td className="p-3 text-right text-muted">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 1: USERS LIST */}
          {activeSubTab === 'users' && (
            <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-ink dark:text-white uppercase tracking-wider mb-4">Mock Database Registrations</h3>
              <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/5">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-[10px] text-muted font-bold uppercase tracking-wider">
                      <th className="p-4">User Details</th>
                      <th className="p-4">Default Portal Role</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((usr) => (
                      <tr key={usr.email} className="border-b border-gray-150 dark:border-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.01]">
                        <td className="p-4 flex items-center gap-3">
                          <img src={usr.photoURL} alt="Avatar" className="w-8 h-8 rounded-full bg-white shrink-0 border border-gray-200" />
                          <div className="overflow-hidden">
                            <div className="font-bold text-ink dark:text-white truncate">{usr.displayName}</div>
                            <div className="text-[10px] text-muted truncate">{usr.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${usr.email === 'wuhs.official@gmail.com' ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'}`}>
                            {usr.email === 'wuhs.official@gmail.com' ? 'Administrator' : 'Student Aspirant'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {usr.email !== 'wuhs.official@gmail.com' ? (
                            <button
                              onClick={() => deleteUser(usr.email)}
                              className="p-1.5 text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-muted italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADD IMPORTANT DATE FORM */}
          {activeSubTab === 'dates' && (
            <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-ink dark:text-white uppercase tracking-wider mb-6">Add Admissions Milestone</h3>
              
              <form onSubmit={handleAddDate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink/70 dark:text-white/70">Milestone Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. ECAT Registrations Close"
                      value={dateTitle}
                      onChange={e => setDateTitle(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-250 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-purple-600 text-ink dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink/70 dark:text-white/70">University/Board Short Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. UET Lahore"
                      value={dateUni}
                      onChange={e => setDateUni(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-250 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-purple-600 text-ink dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink/70 dark:text-white/70">Type</label>
                    <select
                      value={dateType}
                      onChange={e => setDateType(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-250 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-purple-600 text-ink dark:text-white"
                    >
                      <option value="apply">Apply Deadline</option>
                      <option value="test">Entry Test Schedule</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-ink/70 dark:text-white/70">Date</label>
                    <input 
                      type="date"
                      value={dateValue}
                      onChange={e => setDateValue(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-250 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-purple-600 text-ink dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gold hover:bg-goldDark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
                >
                  Create Milestone
                </button>
              </form>

              {formSuccess && (
                <div className="mt-4 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs border border-emerald-500/20">
                  {formSuccess}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FORMULA EDITOR */}
          {activeSubTab === 'formulas' && (
            <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-ink dark:text-white uppercase tracking-wider mb-4">Formula Coefficient Profile Manager</h3>
              <p className="text-xs text-muted dark:text-gray-400 mb-6 leading-relaxed">
                Standard HEC weighting parameters are pre-programmed for calculations. Below are the current active configurations in Dakhala.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-white/[0.01] border border-gray-150 dark:border-white/5 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-black text-ink dark:text-white uppercase">Engineering Profile (NUST, UET)</h4>
                    <p className="text-[10px] text-muted mt-1">Standard ECAT Weighting: 10% Matric, 40% FSc, 50% Test</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-black rounded-lg">M: 10%</span>
                    <span className="px-2.5 py-1 bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-black rounded-lg">F: 40%</span>
                    <span className="px-2.5 py-1 bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-black rounded-lg">T: 50%</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-white/[0.01] border border-gray-150 dark:border-white/5 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-black text-ink dark:text-white uppercase">Computing & Business (FAST, LUMS)</h4>
                    <p className="text-[10px] text-muted mt-1">Standard BCAT Weighting: 50% FSc, 50% Test (or Matric options)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-gold/15 text-goldDark text-xs font-black rounded-lg">M: 0%</span>
                    <span className="px-2.5 py-1 bg-gold/15 text-goldDark text-xs font-black rounded-lg">F: 50%</span>
                    <span className="px-2.5 py-1 bg-gold/15 text-goldDark text-xs font-black rounded-lg">T: 50%</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-white/[0.01] border border-gray-150 dark:border-white/5 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-black text-ink dark:text-white uppercase">Medical Colleges (MDCAT PMDC)</h4>
                    <p className="text-[10px] text-muted mt-1">PMDC Standard Weighting: 10% Matric, 40% FSc, 50% MDCAT</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-black rounded-lg">M: 10%</span>
                    <span className="px-2.5 py-1 bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-black rounded-lg">F: 40%</span>
                    <span className="px-2.5 py-1 bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-black rounded-lg">T: 50%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
