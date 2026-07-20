import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUniversityBySlug, get7YearMerits, getUniversityLogo } from '../data/universities';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import Campus3DModel from '../components/Campus3DModel';

// Custom Label for the last data point
const CustomizedLabel = (props) => {
  const { x, y, value, index, isRank } = props;
  const isLast = index === 7; // 8-year chart index 7 is the last (2026)
  if (isLast) {
    return (
      <g>
        <text
          x={x}
          y={y - 15}
          fill="#C9A227"
          fontSize={11}
          fontWeight="extrabold"
          textAnchor="middle"
          className="select-none font-sans"
        >
          AI Est: {isRank ? `#${value}` : `${value}%`}
        </text>
      </g>
    );
  }
  return null;
};

export default function MeritTracker() {
  const { slug } = useParams();
  const [uni, setUni] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [chartData, setChartData] = useState([]);
  const [rotationY, setRotationY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const found = getUniversityBySlug(slug || 'nust');
    if (found) {
      setUni(found);
      const initialCampus = found.campuses && found.campuses.length > 0 ? found.campuses[0] : '';
      setSelectedCampus(initialCampus);
    }
  }, [slug]);

  // Resolve active programs for the selected campus
  const getActivePrograms = () => {
    if (!uni) return [];
    const campusMeritData = uni.meritData?.campuses?.[selectedCampus];
    if (campusMeritData && Object.keys(campusMeritData).length > 0) {
      return Object.entries(campusMeritData).map(([progName, yearsData]) => {
        const meritsObj = {};
        Object.entries(yearsData).forEach(([yr, val]) => {
          meritsObj[yr] = typeof val === 'string' ? parseFloat(val.replace(/[%#]/g, '')) : val;
        });
        return { name: progName, merits: meritsObj };
      });
    }
    return uni.programs || [];
  };

  const activePrograms = getActivePrograms();

  // Reset selected program when campus changes
  useEffect(() => {
    if (activePrograms.length > 0) {
      if (!activePrograms.some(p => p.name === selectedProgram)) {
        setSelectedProgram(activePrograms[0].name);
      }
    } else {
      setSelectedProgram('');
    }
  }, [selectedCampus, uni]);

  useEffect(() => {
    if (uni && selectedProgram) {
      const progObj = activePrograms.find(p => p.name === selectedProgram);
      if (progObj) {
        const merits7 = get7YearMerits(progObj);
        const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
        const formatted = years.map(year => ({
          year: year.toString(),
          merit: merits7[year]
        }));
        setChartData(formatted);
      }
    }
  }, [uni, selectedProgram, selectedCampus]);

  if (!uni) {
    return (
      <div className="text-center py-20 min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold text-ink dark:text-white">University Not Found</h2>
        <Link to="/" className="text-gold font-semibold underline mt-2 inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col space-y-6 select-none text-[13px] text-ink dark:text-white">
      {/* Header Block */}
      <div className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white p-1.5 border border-border dark:border-white/10 shrink-0 overflow-hidden relative flex items-center justify-center">
            <img 
              src={getUniversityLogo(uni.id)} 
              alt={`${uni.shortName} Logo`} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-extrabold text-ink dark:text-white">{uni.name} — Merit Trends</h2>
            <span className="inline-block px-2.5 py-1 bg-gold text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
              {uni.entryTest} Required
            </span>
          </div>
        </div>
        <div className="relative z-10 shrink-0">
          <EduAnimation type="tracker" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Area (Selector + 3D Model) */}
        <div className="w-full flex flex-col space-y-6">
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.01} className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-5 flex flex-col space-y-4 shadow-sm">
            {uni.campuses && uni.campuses.length > 1 && (
              <div>
                <h3 className="font-bold text-ink dark:text-white text-xs uppercase tracking-wider mb-3 pb-2 border-b border-border dark:border-white/5">Select Campus</h3>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full p-2.5 bg-cloudy dark:bg-gray-800 border border-border dark:border-white/10 text-ink dark:text-cloudy hover:border-gold/50 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer transition-all"
                >
                  {uni.campuses.map(campus => (
                    <option key={campus} value={campus} className="bg-cloudy dark:bg-[#0A1128] text-ink dark:text-white">{campus}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <h3 className="font-bold text-ink dark:text-white text-xs uppercase tracking-wider mb-3 pb-2 border-b border-border dark:border-white/5">Select Program</h3>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {activePrograms.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedProgram(p.name)}
                    className={`w-full text-left p-3 text-xs font-semibold rounded-xl border transition-all ${
                      selectedProgram === p.name
                        ? 'bg-ink dark:bg-gold border-ink dark:border-gold text-white dark:text-white'
                        : 'bg-cloudy dark:bg-gray-800 border-border dark:border-white/10 text-ink dark:text-cloudy hover:border-ink dark:hover:border-white/20'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </Tilt>

          {/* 3D Model Card */}
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} transitionSpeed={2000}>
            <div className="flat-card p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-ink dark:text-white">3D Campus Model</h3>
                <span className="px-2 py-0.5 bg-gold/15 border border-gold/25 rounded-md text-[9px] font-black uppercase text-goldDark dark:text-gold tracking-widest animate-pulse">
                  Interactive Hologram
                </span>
              </div>
              
              <div className="relative h-48 bg-gray-50/50 dark:bg-white/[0.01] border border-border dark:border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                <Campus3DModel colorHex={uni.colorHex} uniId={uni.id} />
              </div>
              
              <p className="text-[11px] text-muted dark:text-white/40 font-medium leading-relaxed">
                3D Holographic Model of the official {uni.shortName} logo. Drag horizontally to orbit.
              </p>
            </div>
          </Tilt>
        </div>

        {/* Right graph (fixed height 280px) */}
        <div className="lg:col-span-2 w-full">
          <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-2xl p-5 flex flex-col space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-ink dark:text-white text-xs uppercase tracking-wider">Historical Merit Graph: {selectedProgram}</h3>
              <p className="text-[11px] text-muted dark:text-gray-400">Cutoff score trends with AI estimations.</p>
            </div>

            <div className="h-[280px] w-full pr-2 text-ink dark:text-white">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 25, right: 30, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEB" className="dark:stroke-white/5" />
                  <XAxis dataKey="year" stroke="#888" tickLine={false} style={{ fontSize: '11px' }} />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#888" tickLine={false} style={{ fontSize: '11px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d4f6f7', borderRadius: '8px', color: '#0F172A', fontWeight: 'bold' }}
                    labelStyle={{ color: '#C9A227', fontWeight: 'bold', fontSize: '12px' }}
                    itemStyle={{ color: '#0F172A', fontSize: '12px' }}
                    formatter={(value) => uni.meritData?.type === 'rank' ? [`#${value}`, 'Closing Rank'] : [`${value}%`, 'Aggregate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="merit"
                    stroke="#C9A227"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    dot={{ r: 4, fill: '#ffffff', strokeWidth: 2 }}
                    label={<CustomizedLabel isRank={uni.meritData?.type === 'rank'} />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
}
