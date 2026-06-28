import React, { useState } from 'react';
import { allUniversities, getUniversityLogo } from '../data/universities';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import { ShieldAlert, Info } from 'lucide-react';

export default function Compare() {
  const [selectedUnis, setSelectedUnis] = useState([
    allUniversities.find(u => u.id === 'nust'),
    allUniversities.find(u => u.id === 'fast')
  ].filter(Boolean));

  const [searchQuery, setSearchQuery] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [targetAggregate, setTargetAggregate] = useState(75.0);

  const getSectorType = (uni) => {
    const publicSlugs = ['nust', 'uet-lahore', 'qau', 'gcu-lahore', 'pu', 'ned', 'comsats', 'air', 'giki', 'pieas', 'itu', 'uaf', 'muet', 'ist', 'uet-taxila'];
    const semiSlugs = ['numl', 'nums', 'foundation', 'amc', 'paf-iast'];
    if (publicSlugs.includes(uni.id)) return 'Public';
    if (semiSlugs.includes(uni.id)) return 'Semi-Government';
    return 'Private';
  };

  const handleAddUni = (uni) => {
    if (selectedUnis.length >= 3) return;
    if (selectedUnis.some(u => u.id === uni.id)) return;
    setSelectedUnis([...selectedUnis, uni]);
    setSearchQuery('');
    setIsAutocompleteOpen(false);
  };

  const handleRemoveUni = (id) => {
    setSelectedUnis(selectedUnis.filter(u => u.id !== id));
  };

  const filteredUnis = allUniversities.filter(uni => 
    !selectedUnis.some(selected => selected.id === uni.id) &&
    (uni.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     uni.shortName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMockRanking = (uniId) => {
    const ranks = {
      nust: '#1 in Engineering & Tech',
      fast: '#1 in Computer Science',
      lums: '#1 in Business & Finance',
      iba: '#2 in Business & Finance',
      pieas: '#2 in Engineering & Tech',
      'uet-lahore': '#3 in Engineering & Tech',
      comsats: '#3 in CS & IT',
      qau: '#1 Overall HEC Rank'
    };
    return ranks[uniId] || 'Top 15 national ranking';
  };

  const getNotableDept = (uniId) => {
    const depts = {
      nust: 'SEECS (Computing), SMME (Mech)',
      fast: 'School of Computing',
      lums: 'Suleman Dawood School of Business',
      iba: 'School of Business Studies',
      pieas: 'Dept of Nuclear Engineering',
      'uet-lahore': 'Dept of Electrical Engineering',
      comsats: 'Dept of Computer Science',
      giki: 'Faculty of Computer Science & Eng'
    };
    return depts[uniId] || 'Faculty of Engineering & CS';
  };

  const getMeritRange = (uni) => {
    const cutoffs = uni.programs.map(p => p.merits[2025]).filter(Boolean);
    if (cutoffs.length === 0) return 'Varies';
    const min = Math.min(...cutoffs);
    const max = Math.max(...cutoffs);
    return `${min.toFixed(1)}% – ${max.toFixed(1)}%`;
  };

  // Mock Radar Data Generation based on University
  const generateRadarData = () => {
    const metrics = ['Academic Rep', 'Employer Rep', 'Affordability', 'Campus Life', 'Research'];
    return metrics.map(metric => {
      const dataObj = { subject: metric };
      selectedUnis.forEach(uni => {
        // Generate pseudo-random deterministic scores based on university slug length/chars
        let score = 50 + ((uni.id.length * 5) % 40) + ((metric.length * 3) % 20);
        
        // Manual overrides for realism
        if (metric === 'Affordability' && getSectorType(uni) === 'Private') score -= 30;
        if (metric === 'Affordability' && getSectorType(uni) === 'Public') score += 20;
        if (metric === 'Employer Rep' && (uni.id === 'lums' || uni.id === 'nust' || uni.id === 'fast')) score = 95;
        if (metric === 'Campus Life' && uni.id === 'lums') score = 98;
        if (metric === 'Research' && uni.id === 'qau') score = 96;

        dataObj[uni.shortName] = Math.min(100, Math.max(20, score));
      });
      return dataObj;
    });
  };

  const colors = ['#D4AF37', '#0F172A', '#10B981']; // Gold, Ink, Green

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-10 flex flex-col space-y-8 select-none"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-4xl mx-auto w-full text-center md:text-left relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl -z-10" />
        <div className="space-y-2 flex-1">
          <h2 className="text-3xl md:text-5xl font-extrabold text-ink dark:text-white tracking-tight">University Comparison</h2>
          <p className="text-sm text-muted dark:text-white/60 max-w-lg mx-auto md:mx-0 font-medium">Evaluate up to 3 universities side-by-side using our AI-driven matrix and probability analysis.</p>
        </div>
        <EduAnimation type="compare" />
      </div>

      {/* Search Selection Input */}
      <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl border border-border dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-ink/5 relative z-20 text-ink dark:text-white">
        <label className="block text-xs font-extrabold text-ink dark:text-white uppercase mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-gold" /> Search & Add University (Max 3)
        </label>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {selectedUnis.map((uni, idx) => (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={uni.id} 
              className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-xl text-xs font-bold shadow-md border border-white/10"
              style={{ borderLeft: `4px solid ${colors[idx]}` }}
            >
              <span>{uni.shortName}</span>
              <button
                onClick={() => handleRemoveUni(uni.id)}
                className="text-white/50 hover:text-white hover:bg-white/10 rounded-full w-5 h-5 flex items-center justify-center transition-colors focus:outline-none"
              >
                ✕
              </button>
            </motion.div>
          ))}
          {selectedUnis.length === 0 && (
            <span className="text-sm text-muted py-2 font-medium italic">No institutions selected yet. Add one below to start comparing.</span>
          )}
        </div>

        {selectedUnis.length < 3 && (
          <div className="relative">
            <input
              type="text"
              placeholder="Type university name (e.g. NUST, FAST)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsAutocompleteOpen(true);
              }}
              onFocus={() => setIsAutocompleteOpen(true)}
              className="w-full p-4 bg-cloudy dark:bg-white/5 border-2 border-border dark:border-white/10 hover:border-gold/50 rounded-xl text-sm font-semibold text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-gold transition-all shadow-sm placeholder:text-muted dark:placeholder:text-white/30"
            />

            {isAutocompleteOpen && searchQuery && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                {filteredUnis.length > 0 ? (
                  filteredUnis.map(uni => (
                    <button
                      key={uni.id}
                      onClick={() => handleAddUni(uni)}
                      className="w-full text-left px-5 py-3 hover:bg-gold/10 text-sm font-bold text-ink dark:text-white transition-colors flex justify-between items-center"
                    >
                      <span>{uni.name}</span>
                      <span className="text-xs text-goldDark px-2 py-1 bg-gold/10 dark:bg-gold/25 rounded-md">{uni.shortName}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm font-bold text-muted dark:text-gray-400 bg-cloudy dark:bg-white/[0.02]">No institutions found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedUnis.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Admissions Probability Panel */}
          <div className="lg:col-span-1">
            <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={2000} className="h-full">
              <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col relative overflow-hidden h-full text-ink dark:text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-ink/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="font-extrabold text-ink dark:text-white text-lg mb-1">Admissions Probability Analyzer</h3>
                <p className="text-[11px] text-muted dark:text-gray-400 font-medium mb-6">Estimate your chances based on target aggregate scores.</p>
                
                {/* Target Aggregate Slider */}
                <div className="mb-6 bg-cloudy dark:bg-white/[0.02] p-4 rounded-2xl border border-border/50 dark:border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-ink dark:text-white">Target Aggregate Score:</span>
                    <span className="text-lg font-black text-gold">{targetAggregate.toFixed(1)}%</span>
                  </div>
              <input
                type="range"
                min="50"
                max="100"
                step="0.5"
                value={targetAggregate}
                onChange={(e) => setTargetAggregate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-muted font-bold mt-1">
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Probability Lists */}
            <div className="space-y-6 flex-1 overflow-y-auto max-h-[350px] no-scrollbar pr-1">
              {selectedUnis.map((uni, idx) => (
                <div key={uni.id} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-border dark:border-white/10 pb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx] }} />
                    <img 
                      src={getUniversityLogo(uni.id)} 
                      alt={`${uni.shortName} Logo`} 
                      className="w-5 h-5 object-contain bg-white rounded p-0.5 border border-border/40"
                    />
                    <h4 className="font-extrabold text-xs text-ink dark:text-white uppercase tracking-wider">{uni.shortName}</h4>
                  </div>
                  <div className="space-y-2.5">
                    {uni.programs.slice(0, 3).map(p => {
                      const cutoff = p.merits[2025] || 70.0;
                      const prob = 1 / (1 + Math.exp(-0.8 * (targetAggregate - cutoff)));
                      const probPercent = Math.round(prob * 100);
                      
                      let barColor = "bg-rose-500";
                      let textColor = "text-rose-600";
                      let statusText = "Reach";
                      
                      if (probPercent >= 80) {
                        barColor = "bg-emerald-500";
                        textColor = "text-emerald-600";
                        statusText = "Safe";
                      } else if (probPercent >= 40) {
                        barColor = "bg-amber-500";
                        textColor = "text-amber-600";
                        statusText = "Match";
                      }
                      
                      return (
                        <div key={p.name} className="text-xs space-y-1">
                          <div className="flex justify-between font-bold text-ink dark:text-white">
                            <span className="truncate max-w-[140px]">{p.name}</span>
                            <span className={`${textColor}`}>{probPercent}% ({statusText})</span>
                          </div>
                          <div className="w-full bg-cloudy dark:bg-white/10 rounded-full h-2 overflow-hidden border border-border/30 dark:border-white/5">
                            <motion.div 
                              className={`h-full ${barColor}`} 
                              animate={{ width: `${probPercent}%` }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tilt>
      </div>

        {/* Detailed Matrix Table */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0A1224] border border-border dark:border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-border dark:border-white/10 bg-cloudy dark:bg-white/[0.02]">
              <h3 className="font-extrabold text-ink dark:text-white text-lg flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-gold" /> Detailed Matrix
              </h3>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-white dark:bg-[#0A1224] border-b border-border dark:border-white/10">
                    <th className="p-5 text-xs text-muted dark:text-white/40 font-bold uppercase tracking-wider w-[140px] border-r border-border/50 dark:border-white/10">Feature</th>
                    {selectedUnis.map((uni, idx) => (
                      <th key={uni.id} className="p-5 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <img 
                            src={getUniversityLogo(uni.id)} 
                            alt={`${uni.shortName} Logo`}
                            className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-border/40 dark:border-white/10 shadow-sm"
                          />
                          <div className="font-extrabold text-lg text-ink dark:text-white" style={{ color: colors[idx] }}>{uni.shortName}</div>
                          <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase tracking-wide mt-1">{uni.city}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Ranking */}
                  <tr className="border-b border-border/50 dark:border-white/5 hover:bg-gold/5 transition-colors">
                    <td className="p-4 px-5 font-bold text-ink dark:text-white border-r border-border/50 dark:border-white/10 bg-cloudy/30 dark:bg-white/[0.02]">Top Ranking</td>
                    {selectedUnis.map(uni => (
                      <td key={uni.id} className="p-4 text-center font-semibold text-ink dark:text-white/90">{getMockRanking(uni.id)}</td>
                    ))}
                  </tr>

                  {/* Sector */}
                  <tr className="border-b border-border/50 dark:border-white/5 hover:bg-gold/5 transition-colors">
                    <td className="p-4 px-5 font-bold text-ink dark:text-white border-r border-border/50 dark:border-white/10 bg-cloudy/30 dark:bg-white/[0.02]">Sector Setup</td>
                    {selectedUnis.map(uni => (
                      <td key={uni.id} className="p-4 text-center">
                        <span className="px-3 py-1 bg-ink/5 dark:bg-white/5 border border-ink/10 dark:border-white/10 rounded-lg text-xs font-bold text-ink dark:text-white">
                          {getSectorType(uni)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Fee/Year */}
                  <tr className="border-b border-border/50 dark:border-white/5 hover:bg-gold/5 transition-colors">
                    <td className="p-4 px-5 font-bold text-ink dark:text-white border-r border-border/50 dark:border-white/10 bg-cloudy/30 dark:bg-white/[0.02]">Est. Fee / Year</td>
                    {selectedUnis.map(uni => (
                      <td key={uni.id} className="p-4 text-center font-extrabold text-goldDark text-base">
                        Rs. {(uni.feePerSemester * 2).toLocaleString()}
                      </td>
                    ))}
                  </tr>

                  {/* Entry Test */}
                  <tr className="border-b border-border/50 dark:border-white/5 hover:bg-gold/5 transition-colors">
                    <td className="p-4 px-5 font-bold text-ink dark:text-white border-r border-border/50 dark:border-white/10 bg-cloudy/30 dark:bg-white/[0.02]">Entry Test</td>
                    {selectedUnis.map(uni => (
                      <td key={uni.id} className="p-4 text-center font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-500/5">
                        {uni.entryTest}
                      </td>
                    ))}
                  </tr>

                  {/* Merit Range */}
                  <tr className="border-b border-border/50 dark:border-white/5 hover:bg-gold/5 transition-colors">
                    <td className="p-4 px-5 font-bold text-ink dark:text-white border-r border-border/50 dark:border-white/10 bg-cloudy/30 dark:bg-white/[0.02]">Merit Cutoff</td>
                    {selectedUnis.map(uni => (
                      <td key={uni.id} className="p-4 text-center font-extrabold text-ink dark:text-white">
                        {getMeritRange(uni)}
                      </td>
                    ))}
                  </tr>

                  {/* Notable Dept */}
                  <tr className="hover:bg-gold/5 transition-colors">
                    <td className="p-4 px-5 font-bold text-ink dark:text-white border-r border-border/50 dark:border-white/10 bg-cloudy/30 dark:bg-white/[0.02] rounded-bl-3xl">Flagship Dept.</td>
                    {selectedUnis.map(uni => (
                      <td key={uni.id} className="p-4 text-center font-semibold text-muted dark:text-white/60 text-xs">
                        {getNotableDept(uni.id)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-3xl p-16 text-center shadow-xl">
          <div className="w-24 h-24 bg-cloudy dark:bg-white/10 rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-white dark:border-white/10 shadow-lg">
            <span className="text-4xl">⚖️</span>
          </div>
          <h3 className="text-xl font-extrabold text-ink dark:text-white mb-2">Matrix Empty</h3>
          <p className="text-sm text-muted dark:text-white/50 max-w-sm mx-auto">Add up to 3 universities using the search bar above to instantly generate a comparative radar analysis and detailed matrix.</p>
        </div>
      )}
    </motion.div>
  );
}
