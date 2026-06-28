import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import { allUniversities, publicUniversities, privateUniversities, semiGovtUniversities, getUniversityLogo } from '../data/universities';

const FIELDS = ['CS', 'Engineering', 'Medical', 'Business', 'Law', 'Architecture', 'Social Sciences'];
const SECTORS = ['Any', 'Public', 'Private', 'Semi-Govt'];

const PRIORITY_LISTS = {
  'CS': ['fast', 'itu', 'nust', 'pu', 'comsats', 'lums', 'giki'],
  'Engineering': ['nust', 'uet-lahore', 'lums', 'pieas', 'giki', 'ned'],
  'Medical': ['nums', 'szabist'],
  'Business': ['lums', 'iba', 'nust', 'fast'],
  'Architecture': ['nust', 'uet-lahore', 'ned', 'air', 'pu'],
  'Social Sciences': ['nust', 'uet-lahore', 'ned', 'air', 'pu'],
  'Law': []
};

const RecommendationCard = ({ rec }) => {
  return (
    <div className="p-3.5 bg-white dark:bg-white/[0.02] border border-border/50 dark:border-white/10 rounded-xl hover:shadow-md transition-all duration-300 flex items-start gap-3 text-ink dark:text-white">
      {/* Logo with Initials Fallback */}
      <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-white dark:bg-white/90 border border-border/30 text-white font-extrabold shadow-sm relative overflow-hidden flex-shrink-0 p-1">
        <img 
          src={getUniversityLogo(rec.uni.id)} 
          alt={rec.uni.name} 
          className="absolute inset-0 w-full h-full object-contain p-1.5 z-10" 
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
        <span className="relative z-0 text-center font-black text-[10px] leading-none text-ink dark:text-ink" style={{ color: rec.uni.colorHex }}>
          {rec.uni.shortName}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h5 className="font-extrabold text-ink dark:text-white text-xs truncate leading-snug">{rec.uni.name}</h5>
        <p className="text-[10px] text-muted dark:text-gray-400 mt-0.5 uppercase tracking-wide truncate">
          {rec.programName}
        </p>
        <p className="text-[9px] text-muted/80 dark:text-gray-400 mt-0.5">
          2025 Cutoff: {rec.cutoff}% | Fee: PKR {rec.uni.feePerSemester ? (rec.uni.feePerSemester * 2).toLocaleString() : 'N/A'}/yr
        </p>
      </div>

      <span className={`px-2 py-0.5 text-[8px] font-black rounded border flex-shrink-0 uppercase tracking-widest ${rec.badgeColor}`}>
        {rec.badge}
      </span>
    </div>
  );
};

export default function Recommend() {
  const [selectedField, setSelectedField] = useState('CS');
  const [selectedSector, setSelectedSector] = useState('Any');
  const [userAggregate, setUserAggregate] = useState('');
  const [recommendations, setRecommendations] = useState(null);

  const getSectorType = (uni) => {
    if (publicUniversities.some(u => u.id === uni.id)) return 'public';
    if (semiGovtUniversities.some(u => u.id === uni.id)) return 'semigovt';
    return 'private';
  };

  const isProgramMatch = (progName, field) => {
    const name = progName.toLowerCase();
    if (field === 'CS') {
      return name.includes('computer') || name.includes('software') || name.includes('data') || name.includes('artificial') || name.includes('cyber') || name.includes('information') || name.includes('computing') || name.includes('ai');
    }
    if (field === 'Engineering') {
      return name.includes('engineering') && !name.includes('software');
    }
    if (field === 'Medical') {
      return name.includes('mbbs') || name.includes('bds') || name.includes('nursing') || name.includes('cardiac') || name.includes('physical') || name.includes('biomedical');
    }
    if (field === 'Business') {
      return name.includes('business') || name.includes('management') || name.includes('administration') || name.includes('economics');
    }
    if (field === 'Law') {
      return name.includes('law') || name.includes('llb');
    }
    if (field === 'Architecture') {
      return name.includes('architecture') || name.includes('design') || name.includes('visual');
    }
    if (field === 'Social Sciences') {
      return name.includes('english') || name.includes('political') || name.includes('international') || name.includes('psychology') || name.includes('liberal');
    }
    return false;
  };

  const handleRecommendationSubmit = (e) => {
    e.preventDefault();
    const agg = parseFloat(userAggregate);
    if (isNaN(agg) || agg <= 0 || agg > 100) return;

    const matched = [];

    allUniversities.forEach(uni => {
      const sectorType = getSectorType(uni);

      // Filter by Sector Preference
      if (selectedSector !== 'Any') {
        const secLower = selectedSector.toLowerCase().replace('-', '');
        if (secLower === 'public' && sectorType !== 'public') return;
        if (secLower === 'private' && sectorType !== 'private') return;
        if (secLower === 'semigovt' && sectorType !== 'semigovt') return;
      }

      // Check matching programs
      const matchedProgs = uni.programs.filter(p => isProgramMatch(p.name, selectedField));
      if (matchedProgs.length === 0) return;

      matchedProgs.forEach(prog => {
        const cutoff = prog.merits[2025] || 70.0;
        let badge = 'Unlikely';
        let badgeColor = 'bg-red-50 dark:bg-red-500/15 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400';

        if (agg >= cutoff + 1.5) {
          badge = 'Likely';
          badgeColor = 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400';
        } else if (agg >= cutoff - 1.5) {
          badge = 'Borderline';
          badgeColor = 'bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400';
        }

        matched.push({
          uni,
          programName: prog.name,
          cutoff: cutoff,
          badge,
          badgeColor,
          sector: sectorType
        });
      });
    });

    const priority = PRIORITY_LISTS[selectedField] || [];
    matched.sort((a, b) => {
      const aIdx = priority.indexOf(a.uni.id);
      const bIdx = priority.indexOf(b.uni.id);
      
      const aHasPriority = aIdx !== -1;
      const bHasPriority = bIdx !== -1;
      
      if (aHasPriority && bHasPriority) {
        return aIdx - bIdx;
      }
      if (aHasPriority) return -1;
      if (bHasPriority) return 1;
      
      // Fallback sorting: Likely first, then Borderline, then Unlikely
      const sortOrder = { Likely: 1, Borderline: 2, Unlikely: 3 };
      if (sortOrder[a.badge] !== sortOrder[b.badge]) {
        return sortOrder[a.badge] - sortOrder[b.badge];
      }
      return b.cutoff - a.cutoff;
    });

    setRecommendations(matched);
  };

  // Filter recommendations by sector for the dashboard columns
  const publicMatches = recommendations ? recommendations.filter(r => r.sector === 'public') : [];
  const semiGovtMatches = recommendations ? recommendations.filter(r => r.sector === 'semigovt') : [];
  const privateMatches = recommendations ? recommendations.filter(r => r.sector === 'private') : [];

  return (
    <div className="py-6 flex flex-col space-y-6 text-[13px] relative select-none">
      {/* Background Glowing Blobs */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-2xl mx-auto w-full text-center md:text-left relative z-10">
        <div className="space-y-2 flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-white font-kingsman">
            University <span className="text-gold font-serif italic">Recommender</span>
          </h1>
          <p className="text-muted dark:text-white/60 leading-relaxed font-light text-sm">
            Input your preferences to identify your best fit educational programs based on HEC records and admission algorithms.
          </p>
        </div>
        <EduAnimation type="recommend" />
      </div>

      {/* Recommender Form Wizard */}
      <form onSubmit={handleRecommendationSubmit} className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10">
        
        {/* Step 1: Field of Interest */}
        <div>
          <label className="block text-[11px] font-extrabold text-ink/40 dark:text-white/40 uppercase tracking-wider mb-3">Step 1: Select Field of Interest</label>
          <div className="flex flex-wrap gap-2">
            {FIELDS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedField(f)}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all min-h-[44px] ${
                  selectedField === f
                    ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                    : 'bg-white/50 dark:bg-white/[0.02] border-border dark:border-white/10 text-ink dark:text-white hover:border-gold hover:bg-white dark:hover:bg-white/[0.08]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Sector Preference */}
        <div>
          <label className="block text-[11px] font-extrabold text-ink/40 dark:text-white/40 uppercase tracking-wider mb-3">Step 2: Sector Preference</label>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSector(s)}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all min-h-[44px] ${
                  selectedSector === s
                    ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                    : 'bg-white/50 dark:bg-white/[0.02] border-border dark:border-white/10 text-ink dark:text-white hover:border-gold hover:bg-white dark:hover:bg-white/[0.08]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Aggregate Percentage */}
        <div>
          <label className="block text-[11px] font-extrabold text-ink/40 dark:text-white/40 uppercase tracking-wider block mb-2">Step 3: Enter Your Aggregate / HSc Percentage</label>
          <input
            type="number"
            step="0.01"
            min="30"
            max="100"
            required
            placeholder="e.g. 78.50"
            value={userAggregate}
            onChange={(e) => setUserAggregate(e.target.value)}
            className="w-full sm:w-72 p-3 bg-white/50 dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl text-xs font-semibold focus:border-gold outline-none min-h-[44px] text-ink dark:text-white"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-12 bg-ink hover:bg-gold text-white hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center shadow-lg active:translate-y-0 hover:-translate-y-0.5 cursor-pointer"
          >
            Find My Matches
          </button>
        </div>
      </form>

      {/* Classification Dashboard Columns */}
      {recommendations !== null && (
        <div className="space-y-6 relative z-10 w-full">
          <div className="glass-panel rounded-3xl p-6 shadow-2xl">
            <h3 className="font-extrabold text-ink text-base mb-1">Recommended Institutions</h3>
            <p className="text-[11px] text-muted mb-6">Matched programs ranked by feasibility and sorted by sector-specific priority lists.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Column 1: Government (Public) Sector */}
              <div className="flex flex-col space-y-4 bg-cloudy/30 dark:bg-white/[0.01] p-4 rounded-2xl border border-border/50 dark:border-white/5 min-h-[300px]">
                <div className="flex items-center gap-2 border-b border-border dark:border-white/10 pb-2 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase rounded-md">Govt</span>
                  <h4 className="font-black text-ink dark:text-white text-xs uppercase tracking-wider">Government (Public)</h4>
                  <span className="text-[10px] text-muted dark:text-gray-400 font-bold ml-auto">{publicMatches.length}</span>
                </div>
                
                <div className="space-y-3 max-h-[32rem] overflow-y-auto no-scrollbar pr-0.5">
                  {publicMatches.length > 0 ? (
                    publicMatches.map((rec, idx) => (
                      <Tilt key={idx} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000}>
                        <RecommendationCard rec={rec} />
                      </Tilt>
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-muted dark:text-gray-400 italic">No matching public sector options.</div>
                  )}
                </div>
              </div>

              {/* Column 2: Semi-Government */}
              <div className="flex flex-col space-y-4 bg-cloudy/30 dark:bg-white/[0.01] p-4 rounded-2xl border border-border/50 dark:border-white/5 min-h-[300px]">
                <div className="flex items-center gap-2 border-b border-border dark:border-white/10 pb-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase rounded-md">Semi</span>
                  <h4 className="font-black text-ink dark:text-white text-xs uppercase tracking-wider">Semi-Government</h4>
                  <span className="text-[10px] text-muted dark:text-gray-400 font-bold ml-auto">{semiGovtMatches.length}</span>
                </div>

                <div className="space-y-3 max-h-[32rem] overflow-y-auto no-scrollbar pr-0.5">
                  {semiGovtMatches.length > 0 ? (
                    semiGovtMatches.map((rec, idx) => (
                      <Tilt key={idx} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000}>
                        <RecommendationCard key={idx} rec={rec} />
                      </Tilt>
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-muted dark:text-gray-400 italic">No matching semi-govt options.</div>
                  )}
                </div>
              </div>

              {/* Column 3: Private Sector */}
              <div className="flex flex-col space-y-4 bg-cloudy/30 dark:bg-white/[0.01] p-4 rounded-2xl border border-border/50 dark:border-white/5 min-h-[300px]">
                <div className="flex items-center gap-2 border-b border-border dark:border-white/10 pb-2 mb-1">
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase rounded-md">Priv</span>
                  <h4 className="font-black text-ink dark:text-white text-xs uppercase tracking-wider">Private Sector</h4>
                  <span className="text-[10px] text-muted dark:text-gray-400 font-bold ml-auto">{privateMatches.length}</span>
                </div>

                <div className="space-y-3 max-h-[32rem] overflow-y-auto no-scrollbar pr-0.5">
                  {privateMatches.length > 0 ? (
                    privateMatches.map((rec, idx) => (
                      <Tilt key={idx} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000}>
                        <RecommendationCard key={idx} rec={rec} />
                      </Tilt>
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-muted dark:text-gray-400 italic">No matching private sector options.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
