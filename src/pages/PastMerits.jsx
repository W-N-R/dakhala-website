import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { publicUniversities, privateUniversities, semiGovtUniversities, getUniversityBySlug, get7YearMerits, getUniversityLogo } from '../data/universities';
import UniversityCard from '../components/UniversityCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import Campus3DModel from '../components/Campus3DModel';
import { useDataStore } from '../store/useDataStore';
import EditableBlock from '../components/EditableBlock';

export default function PastMerits() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState('All');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rotationY, setRotationY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const { universities, updateUniversity } = useDataStore();
  const uni = slug ? universities.find(u => u.slug === slug) : null;

  useEffect(() => {
    if (uni) {
      const saved = JSON.parse(localStorage.getItem('dakhala-saved-unis') || '[]');
      setIsBookmarked(saved.some(u => u.id === uni.id));
    }
  }, [uni]);

  const handleToggleBookmark = () => {
    if (!uni) return;
    const saved = JSON.parse(localStorage.getItem('dakhala-saved-unis') || '[]');
    if (isBookmarked) {
      const filtered = saved.filter(u => u.id !== uni.id);
      localStorage.setItem('dakhala-saved-unis', JSON.stringify(filtered));
      setIsBookmarked(false);
    } else {
      const newUni = {
        id: uni.id,
        name: uni.name,
        slug: uni.slug,
        city: uni.city,
        shortName: uni.shortName
      };
      localStorage.setItem('dakhala-saved-unis', JSON.stringify([newUni, ...saved]));
      setIsBookmarked(true);
    }
  };

  useEffect(() => {
    if (uni && uni.campuses?.length > 0) {
      setSelectedCampus(uni.campuses[0]);
      setSelectedProgram('All');
    }
  }, [uni]);

  const getSectorBadge = (uni) => {
    if (publicUniversities.some(u => u.id === uni.id)) return 'Public Sector';
    if (semiGovtUniversities.some(u => u.id === uni.id)) return 'Semi-Government';
    return 'Private Sector';
  };

  // INDIVIDUAL UNI PAGE
  if (slug) {
    if (!uni) {
      return (
        <div className="text-center py-20 bg-cloudy min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-extrabold text-ink mb-2">University Not Found</h2>
          <Link to="/past-merits" className="text-gold font-bold underline hover:text-ink transition-colors">Return to Directory</Link>
        </div>
      );
    }

    // Resolve campus-specific programs
    const campusMeritData = uni.meritData?.campuses?.[selectedCampus];
    let activePrograms = [];
    if (campusMeritData && Object.keys(campusMeritData).length > 0) {
      activePrograms = Object.entries(campusMeritData).map(([progName, yearsData]) => {
        const meritsObj = {};
        Object.entries(yearsData).forEach(([yr, val]) => {
          meritsObj[yr] = typeof val === 'string' ? parseFloat(val.replace('%', '')) : val;
        });
        return { name: progName, merits: meritsObj };
      });
    } else {
      activePrograms = uni.programs || [];
    }

    const filteredPrograms = selectedProgram === 'All' 
      ? activePrograms 
      : activePrograms.filter(p => p.name === selectedProgram);

    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

    const handleSaveMerit = (progName, year, val) => {
      const campusMeritData = uni.meritData?.campuses?.[selectedCampus];
      if (campusMeritData && Object.keys(campusMeritData).length > 0) {
        const newMeritData = JSON.parse(JSON.stringify(uni.meritData));
        if (!newMeritData.campuses[selectedCampus][progName]) {
          newMeritData.campuses[selectedCampus][progName] = {};
        }
        newMeritData.campuses[selectedCampus][progName][year] = val === '' ? null : Number(val);
        updateUniversity(uni.id, { meritData: newMeritData });
      } else {
        const newPrograms = JSON.parse(JSON.stringify(uni.programs || []));
        const progIndex = newPrograms.findIndex(p => p.name === progName);
        if (progIndex !== -1) {
          if (!newPrograms[progIndex].merits) newPrograms[progIndex].merits = {};
          newPrograms[progIndex].merits[year] = val === '' ? null : Number(val);
          updateUniversity(uni.id, { programs: newPrograms });
        }
      }
    };

    // Prepare chart data for the selected program (or the first one if "All" is selected)
    const chartProgram = (selectedProgram === 'All' || !activePrograms.some(p => p.name === selectedProgram))
      ? activePrograms[0] 
      : filteredPrograms[0];

    const merits7 = chartProgram ? get7YearMerits(chartProgram) : {};
    
    const chartData = chartProgram ? years.map(year => ({
      year: year.toString(),
      merit: merits7[year] || null
    })).filter(d => d.merit !== null) : [];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 flex flex-col space-y-6 select-none text-ink dark:text-white"
      >
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate('/past-merits')}
            className="text-xs font-bold text-ink dark:text-white hover:text-gold transition-colors flex items-center gap-2 focus:outline-none bg-white dark:bg-[#0C132C] py-2 px-4 rounded-xl shadow-sm border border-border dark:border-white/10"
          >
            ← Back to Directory
          </button>
        </div>

        {/* Header Block */}
        <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center shadow-lg relative overflow-hidden gap-6">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-border dark:border-white/10 shrink-0 overflow-hidden relative flex items-center justify-center">
              <img 
                src={getUniversityLogo(uni.id)} 
                alt={`${uni.shortName} Logo`} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-ink dark:text-white leading-tight tracking-tight">
                <EditableBlock value={uni.name} onSave={(val) => updateUniversity(uni.id, { name: val })} />
              </h2>
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="px-3 py-1 bg-gold text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
                  {getSectorBadge(uni)}
                </span>
                <span className="text-xs font-semibold text-muted dark:text-gray-400 bg-cloudy dark:bg-white/5 px-3 py-1 rounded-lg border border-border dark:border-white/5">
                  <EditableBlock value={uni.entryTest} onSave={(val) => updateUniversity(uni.id, { entryTest: val })} /> Required
                </span>
                <button
                  onClick={handleToggleBookmark}
                  className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    isBookmarked 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25' 
                      : 'bg-gold/15 text-goldDark dark:text-gold border-gold/30 hover:bg-gold hover:text-white'
                  }`}
                >
                  ★ {isBookmarked ? 'Target Tracked' : 'Add to Targets'}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 relative z-10 shrink-0">
            <EduAnimation type="tracker" />
            <Link
              to={`/merit-tracker/${uni.slug}`}
              className="px-6 py-3.5 bg-gold hover:bg-[#E5B51B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 text-center"
            >
              📈 Detailed Tracker
            </Link>
          </div>
        </div>

        {/* 2-Column Main Layout: Left = Chart & Table, Right = 3D Model */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Recharts Data Visualization Area wrapped in Tilt */}
            {chartData.length > 0 && (
              <div className="w-full">
                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-ink dark:text-white">Historical Merit Trend</h3>
                      <p className="text-xs text-muted dark:text-gray-400 font-medium mt-1">
                        Viewing data for <strong className="text-goldDark">{chartProgram.name}</strong>
                      </p>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {/* Campus Selector Dropdown */}
                      {uni.campuses && uni.campuses.length > 0 && (
                        <select
                          value={selectedCampus}
                          onChange={(e) => {
                            setSelectedCampus(e.target.value);
                            setSelectedProgram('All');
                          }}
                          className="w-48 p-2.5 bg-cloudy dark:bg-gray-800 border border-border dark:border-white/10 text-ink dark:text-cloudy hover:border-gold/50 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer transition-all"
                        >
                          {uni.campuses.map(campus => (
                            <option key={campus} value={campus} className="bg-cloudy dark:bg-[#0A1128] text-ink dark:text-white">{campus}</option>
                          ))}
                        </select>
                      )}

                      {/* Program Filter Dropdown */}
                      <select
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="w-48 p-2.5 bg-cloudy dark:bg-gray-800 border border-border dark:border-white/10 text-ink dark:text-cloudy hover:border-gold/50 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer transition-all"
                      >
                        <option value="All" className="bg-cloudy dark:bg-[#0A1128] text-ink dark:text-white">All Programs</option>
                        {activePrograms.map(p => (
                          <option key={p.name} value={p.name} className="bg-cloudy dark:bg-[#0A1128] text-ink dark:text-white">{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="h-[300px] w-full text-ink dark:text-white">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorMerit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-white/5" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#888' }} dy={10} />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#888' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                          itemStyle={{ color: '#0F172A', fontWeight: '900' }}
                          formatter={(value) => uni.meritData?.type === 'rank' ? [`#${value}`, 'Closing Rank'] : [`${value}%`, 'Aggregate']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="merit" 
                          stroke="#D4AF37" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorMerit)" 
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Tilt>
              </div>
            )}

            {/* 7-Year Merit Table wrapped in overflow-x-auto */}
            <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl overflow-hidden shadow-sm text-ink dark:text-white">
              <div className="p-4 bg-cloudy dark:bg-white/5 border-b border-border dark:border-white/10">
                <h3 className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider">Raw Data Table</h3>
              </div>
              <div className="md:overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border-collapse md:min-w-[700px] block md:table">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-white dark:bg-[#0C132C] border-b border-border dark:border-white/10 text-muted dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4 w-[220px]">Degree Program</th>
                      {years.map(year => (
                        <th key={year} className="p-4 text-center">{year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="block md:table-row-group">
                    {filteredPrograms.map((prog, idx) => {
                      const merits7 = get7YearMerits(prog);
                      return (
                        <tr key={idx} className="block md:table-row border-b border-border dark:border-white/5 hover:bg-gold/5 dark:hover:bg-gold/10 transition-colors group p-4 md:p-0">
                          <td className="block md:table-cell p-0 pb-3 md:p-4 font-extrabold text-ink dark:text-white text-sm group-hover:text-goldDark transition-colors">
                            {prog.name}
                          </td>
                          
                          {/* Mobile View: Years Grid */}
                          <td className="block md:hidden">
                            <div className="grid grid-cols-4 gap-2">
                              {years.map(year => (
                                <div key={year} className="flex flex-col gap-1 bg-gray-50/80 dark:bg-white/[0.02] border border-border dark:border-white/5 p-2 rounded-lg items-center">
                                  <span className="text-[9px] font-bold text-muted dark:text-gray-500 uppercase">{year}</span>
                                  <span className="bg-white dark:bg-gray-800 text-ink dark:text-cloudy px-2 py-0.5 rounded-md font-bold border border-border dark:border-white/10 shadow-sm text-[11px] inline-flex items-center gap-0.5">
                                    {uni.meritData?.type === 'rank' && merits7[year] && '#'}
                                    <EditableBlock 
                                      type="number"
                                      value={merits7[year] || ''} 
                                      onSave={(val) => handleSaveMerit(prog.name, year, val)} 
                                    />
                                    {uni.meritData?.type !== 'rank' && merits7[year] && '%'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Desktop View: Standard Table Cells */}
                          {years.map(year => (
                            <td key={year} className="hidden md:table-cell p-4 text-center text-muted dark:text-gray-400 font-semibold group-hover:text-ink dark:group-hover:text-white transition-colors">
                              <span className="bg-cloudy dark:bg-gray-800 text-ink dark:text-cloudy px-2 py-1 rounded-md inline-flex items-center gap-0.5">
                                {uni.meritData?.type === 'rank' && merits7[year] && '#'}
                                <EditableBlock 
                                  type="number"
                                  value={merits7[year] || ''} 
                                  onSave={(val) => handleSaveMerit(prog.name, year, val)} 
                                />
                                {uni.meritData?.type !== 'rank' && merits7[year] && '%'}
                              </span>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Area: 3D Model */}
          <div className="lg:col-span-4 space-y-6">
            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} transitionSpeed={2000}>
              <div className="flat-card p-6 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-ink dark:text-white">3D Campus Model</h3>
                  <span className="px-2 py-0.5 bg-gold/15 border border-gold/25 rounded-md text-[9px] font-black uppercase text-goldDark dark:text-gold tracking-widest animate-pulse">
                    Interactive Hologram
                  </span>
                </div>
                
                <div className="relative h-64 bg-gray-50/50 dark:bg-white/[0.01] border border-border dark:border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                  <Campus3DModel colorHex={uni.colorHex} uniId={uni.id} />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[9px] font-semibold text-white/90">
                    ↔ Drag to rotate
                  </div>
                </div>
                
                <p className="text-xs text-muted dark:text-white/40 font-medium leading-relaxed">
                  3D Holographic Model of the official {uni.shortName} logo. Drag horizontally to orbit.
                </p>
              </div>
            </Tilt>
          </div>
        </div>
      </motion.div>
    );
  }

  // LANDING PAGE (/past-merits)
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-10 flex flex-col space-y-12"
    >
      <div className="text-center select-none relative text-ink dark:text-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-10" />
        <h2 className="text-3xl md:text-5xl font-extrabold text-ink dark:text-white mb-4 tracking-tight">Past Merit Data Explorer</h2>
        <p className="text-sm text-muted dark:text-gray-400 max-w-lg mx-auto font-medium">Click on any university below to view interactive 7-year cutoff trends and detailed historical records.</p>
      </div>

      {/* 1. Public Sector Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3 pl-4 border-l-4 border-gold select-none">
          <h3 className="text-lg font-extrabold text-ink dark:text-white tracking-wide">PUBLIC SECTOR</h3>
          <span className="bg-cloudy dark:bg-white/5 border border-border dark:border-white/10 text-xs text-muted dark:text-cloudy font-bold px-3 py-1 rounded-full">{publicUniversities.length} Institutions</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {universities.filter(u => publicUniversities.some(pu => pu.id === u.id)).map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => navigate(`/past-merits/${uni.slug}`)}
              />
            </Tilt>
          ))}
        </div>
      </div>

      {/* 2. Private Sector Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3 pl-4 border-l-4 border-gold select-none">
          <h3 className="text-lg font-extrabold text-ink dark:text-white tracking-wide">PRIVATE SECTOR</h3>
          <span className="bg-cloudy dark:bg-white/5 border border-border dark:border-white/10 text-xs text-muted dark:text-cloudy font-bold px-3 py-1 rounded-full">{privateUniversities.length} Institutions</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {universities.filter(u => privateUniversities.some(pu => pu.id === u.id)).map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => navigate(`/past-merits/${uni.slug}`)}
              />
            </Tilt>
          ))}
        </div>
      </div>

      {/* 3. Semi-Government Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-3 pl-4 border-l-4 border-gold select-none">
          <h3 className="text-lg font-extrabold text-ink dark:text-white tracking-wide">SEMI-GOVERNMENT</h3>
          <span className="bg-cloudy dark:bg-white/5 border border-border dark:border-white/10 text-xs text-muted dark:text-cloudy font-bold px-3 py-1 rounded-full">{semiGovtUniversities.length} Institutions</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {universities.filter(u => semiGovtUniversities.some(pu => pu.id === u.id)).map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => navigate(`/past-merits/${uni.slug}`)}
              />
            </Tilt>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
