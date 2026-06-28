import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Zap, BookOpen, Activity, Compass } from 'lucide-react';
import { TESTS } from '../data/entryTestsData';

const getSubjectColor = (subject) => {
  const s = subject.toLowerCase();
  if (s.includes('math')) return {
    from: 'from-[#0D3B66]', to: 'to-[#00F0FF]', text: 'text-[#00F0FF]',
    bgLight: 'bg-[#0D3B66]/10', borderLight: 'border-[#0D3B66]/20',
    pillBg: 'bg-[#0D3B66]/5 dark:bg-[#00F0FF]/5 hover:bg-[#0D3B66]/15 dark:hover:bg-[#00F0FF]/15',
    iconColor: '#00F0FF',
    gradient: 'linear-gradient(135deg, #0D3B66, #00F0FF)'
  };
  if (s.includes('phys')) return {
    from: 'from-[#0D5B41]', to: 'to-[#10B981]', text: 'text-[#10B981]',
    bgLight: 'bg-[#0D5B41]/10', borderLight: 'border-[#0D5B41]/20',
    pillBg: 'bg-[#0D5B41]/5 dark:bg-[#10B981]/5 hover:bg-[#0D5B41]/15 dark:hover:bg-[#10B981]/15',
    iconColor: '#10B981',
    gradient: 'linear-gradient(135deg, #0D5B41, #10B981)'
  };
  if (s.includes('chem')) return {
    from: 'from-[#F59E0B]', to: 'to-[#EF4444]', text: 'text-[#F59E0B]',
    bgLight: 'bg-[#F59E0B]/10', borderLight: 'border-[#F59E0B]/20',
    pillBg: 'bg-[#F59E0B]/5 dark:bg-[#F59E0B]/5 hover:bg-[#F59E0B]/15 dark:hover:bg-[#F59E0B]/15',
    iconColor: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)'
  };
  if (s.includes('biol')) return {
    from: 'from-[#EC4899]', to: 'to-[#8B5CF6]', text: 'text-[#EC4899]',
    bgLight: 'bg-[#EC4899]/10', borderLight: 'border-[#EC4899]/20',
    pillBg: 'bg-[#EC4899]/5 dark:bg-[#EC4899]/5 hover:bg-[#EC4899]/15 dark:hover:bg-[#EC4899]/15',
    iconColor: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)'
  };
  // Default purple/pink/indigo
  return {
    from: 'from-[#6366F1]', to: 'to-[#A855F7]', text: 'text-[#6366F1]',
    bgLight: 'bg-[#6366F1]/10', borderLight: 'border-[#6366F1]/20',
    pillBg: 'bg-[#6366F1]/5 dark:bg-[#A855F7]/5 hover:bg-[#6366F1]/15 dark:hover:bg-[#A855F7]/15',
    iconColor: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1, #A855F7)'
  };
};

export default function EntryTests() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [openAccordion, setOpenAccordion] = useState(null);

  // For mobile page accordion view
  const [mobileExpandedTest, setMobileExpandedTest] = useState('ecat');

  const [expandedSubjects, setExpandedSubjects] = useState({});

  const toggleSubject = (subject) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;
  const isDesktop = windowWidth >= 1200;

  const currentTest = TESTS.find(t => t.id === (isMobile ? mobileExpandedTest : testId)) || TESTS[0];

  const handleAccordionToggle = (subject) => {
    setOpenAccordion(openAccordion === subject ? null : subject);
  };

  const handleMobileTestClick = (id) => {
    setMobileExpandedTest(mobileExpandedTest === id ? null : id);
    setOpenAccordion(null);
  };

  // Helper: Details view markup to avoid copy paste duplicates
  const renderDetails = (testData) => {
    return (
      <div className="space-y-6">
        {/* Stat Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-b border-border dark:border-white/10 py-4 text-[13px] text-ink dark:text-white">
          <div>
            <span className="text-muted dark:text-gray-400 block font-bold uppercase text-[11px] mb-0.5">Conducting Body</span>
            <strong className="text-ink dark:text-white">{testData.body}</strong>
          </div>
          <div>
            <span className="text-muted dark:text-gray-400 block font-bold uppercase text-[11px] mb-0.5">Total Questions</span>
            <strong className="text-ink dark:text-white">{testData.mcqs}</strong>
          </div>
          <div>
            <span className="text-muted dark:text-gray-400 block font-bold uppercase text-[11px] mb-0.5">Time Duration</span>
            <strong className="text-ink dark:text-white">{testData.duration}</strong>
          </div>
          <div>
            <span className="text-muted dark:text-gray-400 block font-bold uppercase text-[11px] mb-0.5">Negative Marking</span>
            <strong className="text-ink dark:text-white">{testData.negative}</strong>
          </div>
          <div className="sm:col-span-2">
            <span className="text-muted dark:text-gray-400 block font-bold uppercase text-[11px] mb-0.5">Applicable Institutions</span>
            <strong className="text-ink dark:text-white leading-snug">{testData.unis}</strong>
          </div>
        </div>

        {/* Chart */}
        <div>
          <h4 className="font-bold text-ink dark:text-white text-xs uppercase tracking-wider mb-3">Subject Marks Weightage (%)</h4>
          <div className="h-56 w-full pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={testData.chart} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEB" className="opacity-10" />
                <XAxis dataKey="subject" stroke="#888" tickLine={false} style={{ fontSize: '11px' }} />
                <YAxis domain={[0, 100]} stroke="#888" tickLine={false} style={{ fontSize: '11px' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(201, 162, 39, 0.05)' }}
                  contentStyle={{ backgroundColor: '#1C2333', borderColor: '#d4f6f7', borderRadius: '8px', color: '#FFFFFF' }}
                  labelStyle={{ color: '#0B5D56', fontWeight: 'bold', fontSize: '12px' }}
                  itemStyle={{ color: '#FFFFFF', fontSize: '12px' }}
                />
                <Bar dataKey="pct" fill="#0B5D56" radius={[4, 4, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Syllabus Outline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border dark:border-white/10 pb-2 mb-4">
            <h4 className="font-extrabold text-ink dark:text-white text-xs uppercase tracking-wider">Subject Syllabus Outline</h4>
            <span className="text-[10px] text-muted dark:text-white/40 font-bold uppercase tracking-wider">
              {Object.keys(testData.syllabus).length} Subjects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(testData.syllabus).map((subject) => {
              const colors = getSubjectColor(subject);
              const isExpanded = !!expandedSubjects[subject];
              
              // Find percentage
              const weightage = testData.chart?.find(c => c.subject.toLowerCase() === subject.toLowerCase() || subject.toLowerCase().includes(c.subject.toLowerCase()));
              const pct = weightage ? weightage.pct : 0;
              
              // Get topics list
              const topics = testData.syllabus[subject].split(',').map(t => t.trim()).filter(Boolean);
              
              // Decide icon
              let IconComponent = BookOpen;
              const sLower = subject.toLowerCase();
              if (sLower.includes('math')) IconComponent = Calculator;
              else if (sLower.includes('phys')) IconComponent = Zap;
              else if (sLower.includes('chem')) IconComponent = Activity;
              else if (sLower.includes('biol')) IconComponent = Activity;
              else if (sLower.includes('intel') || sLower.includes('log')) IconComponent = Compass;

              return (
                <div 
                  key={subject}
                  className={`group relative overflow-hidden bg-white/80 dark:bg-white/[0.02] border border-border/70 dark:border-white/10 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-gold/30 dark:hover:border-gold/20 flex flex-col ${
                    isExpanded ? 'ring-1 ring-gold/15 md:col-span-2' : ''
                  }`}
                >
                  {/* Left accent bar */}
                  <div 
                    className="absolute top-0 left-0 w-[3px] h-full rounded-l-xl"
                    style={{ background: colors.gradient }}
                  />
                  
                  {/* Card Header */}
                  <button
                    onClick={() => toggleSubject(subject)}
                    className="w-full p-4 pl-5 flex items-center justify-between text-left focus:outline-none group/btn"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg text-white bg-gradient-to-br ${colors.from} ${colors.to} shadow-sm`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-[13px] text-ink dark:text-white leading-snug">{subject}</h5>
                        <p className="text-[10px] text-muted dark:text-white/40 font-semibold mt-0.5">{topics.length} topics · {pct > 0 ? `${pct}% weightage` : 'Weightage varies'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Mini progress bar */}
                      {pct > 0 && (
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-border/50 dark:bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, background: colors.gradient }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-muted dark:text-white/50">{pct}%</span>
                        </div>
                      )}
                      <span className="text-muted dark:text-white/30 text-xs transition-transform duration-200 group-hover/btn:text-goldDark">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="px-5 pl-6 pb-4 border-t border-border/30 dark:border-white/5 pt-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {topics.map((topic, idx) => (
                          <div key={idx} className="flex items-start gap-2 py-1">
                            <span className="text-[10px] font-bold text-muted dark:text-white/30 mt-0.5 w-4 text-right shrink-0">{idx + 1}.</span>
                            <span className="text-[12px] text-ink/85 dark:text-white/80 font-medium leading-snug">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collapsed preview pills */}
                  {!isExpanded && (
                    <div className="px-5 pl-6 pb-3 flex flex-wrap gap-1.5">
                      {topics.slice(0, 4).map((topic, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 rounded-md text-[10px] font-medium text-ink/60 dark:text-white/50 bg-gray-100/80 dark:bg-white/[0.04] border border-border/40 dark:border-white/5"
                        >
                          {topic}
                        </span>
                      ))}
                      {topics.length > 4 && (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold text-goldDark bg-gold/5 border border-gold/20">
                          +{topics.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Link (height 48px, width 100%) */}
        <div>
          <a
            href={testData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn inline-flex items-center justify-center w-full h-12 bg-ink hover:bg-gold text-white hover:text-ink dark:bg-white/10 dark:hover:bg-gold dark:hover:text-ink font-bold text-xs uppercase tracking-wider rounded-lg transition-colors border border-transparent dark:border-white/5"
          >
            Visit Official Registration Site ↗
          </a>
        </div>
      </div>
    );
  };

  // MOBILE: Accordion layout (Click test name -> expand details right below)
  if (isMobile) {
    return (
      <div className="py-6 flex flex-col space-y-6 text-[13px] text-ink dark:text-white">
        <div className="flex justify-between items-center gap-6 text-center md:text-left select-none">
          <div className="space-y-1 flex-1">
            <h2 className="text-xl font-extrabold text-ink dark:text-white uppercase tracking-wide">Entry Tests Directory</h2>
            <p className="text-[12px] text-muted dark:text-gray-400 mt-1">Tap a test name below to expand its syllabus details.</p>
          </div>
          <EduAnimation type="syllabus" />
        </div>

        <div className="space-y-3">
          {TESTS.map(t => (
            <div key={t.id} className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl overflow-hidden text-ink dark:text-white">
              <button
                type="button"
                onClick={() => handleMobileTestClick(t.id)}
                className="w-full px-4 py-3 flex justify-between items-center text-xs font-extrabold text-ink dark:text-white text-left focus:outline-none min-h-[44px]"
              >
                <span>{t.name} — {t.body}</span>
                <span>{mobileExpandedTest === t.id ? '▲' : '▼'}</span>
              </button>
              
              {mobileExpandedTest === t.id && (
                <div className="p-5 border-t border-border dark:border-white/10 bg-[#FCFCFC] dark:bg-[#0A1224]/30">
                  {renderDetails(t)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // TABLET: Dropdown selector on top, panel below
  if (isTablet) {
    return (
      <div className="py-6 flex flex-col space-y-6 text-[13px] text-ink dark:text-white">
        <div className="flex justify-between items-center gap-6 text-center md:text-left select-none">
          <div className="space-y-1 flex-1">
            <h2 className="text-xl font-extrabold text-ink dark:text-white uppercase tracking-wide">Entry Tests Directory</h2>
            <p className="text-[12px] text-muted dark:text-gray-400 mt-1">Select an entrance exam to check timelines and syllabus structures.</p>
          </div>
          <EduAnimation type="syllabus" />
        </div>

        {/* Dropdown Selector */}
        <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-4 select-none">
          <select
            value={testId || 'ecat'}
            onChange={(e) => navigate(`/entry-tests/${e.target.value}`)}
            className="w-full p-2 bg-cloudy dark:bg-white/5 border border-border dark:border-white/10 rounded-lg text-xs font-semibold focus:outline-none min-h-[44px] cursor-pointer text-ink dark:text-white"
          >
            {TESTS.map(t => (
              <option key={t.id} value={t.id} className="dark:bg-ink">{t.name} ({t.body})</option>
            ))}
          </select>
        </div>

        {/* Details Panel below */}
        <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-extrabold text-ink dark:text-white mb-4">{currentTest.name} Specifications</h3>
          {renderDetails(currentTest)}
        </div>
      </div>
    );
  }

  // DESKTOP: 2-column sidebar (200px sidebar + 1fr)
  return (
    <div className="py-8 flex flex-col space-y-6">
      <div className="flex justify-between items-center gap-6 max-w-4xl w-full text-left relative z-10 select-none">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-ink dark:text-white leading-tight select-none">Entry Tests Directory</h2>
          <span className="text-[11px] text-muted dark:text-gray-400 font-bold uppercase select-none">Entrance Syllabus & Grid</span>
        </div>
        <EduAnimation type="syllabus" />
      </div>

      <div className="flex gap-6 text-[13px]">
        {/* 200px Sidebar */}
        <div className="w-[200px] flex-shrink-0">
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000} className="h-full">
            <div className="flex flex-col space-y-1 bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-3 h-full select-none text-ink dark:text-white">
              <span className="text-[11px] font-bold text-muted dark:text-gray-400 px-2 mb-2 block">Standard Entry Tests</span>
              {TESTS.map(t => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/entry-tests/${t.id}`)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors focus:outline-none ${
                    testId === t.id
                      ? 'bg-ink dark:bg-white/15 text-gold'
                      : 'text-ink dark:text-white hover:bg-cloudy dark:hover:bg-white/5'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </Tilt>
        </div>

        {/* Detail Panel */}
        <div className="flex-1">
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} transitionSpeed={2000}>
            <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-6 flex flex-col space-y-6 text-ink dark:text-white">
              <div>
                <h2 className="text-2xl font-extrabold text-ink dark:text-white leading-tight select-none">{currentTest.name} Details</h2>
                <span className="text-[11px] text-muted dark:text-gray-400 font-bold uppercase select-none">Entrance Syllabus & Grid</span>
              </div>
              {renderDetails(currentTest)}
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
}
