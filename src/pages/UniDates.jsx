import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import { publicUniversities, privateUniversities, semiGovtUniversities, getUniversityBySlug } from '../data/universities';
import UniversityCard from '../components/UniversityCard';

export default function UniDates() {
  const { type } = useParams();
  const currentType = type || 'apply'; // 'test' | 'apply' | 'admission'

  const [selectedUni, setSelectedUni] = useState(null);

  const getTitle = () => {
    if (currentType === 'test') return 'Entry Test Schedules';
    if (currentType === 'apply') return 'Application Deadlines';
    return 'Admission & Merit List Dates';
  };

  // Mock specific dates helper
  const getUniDatesData = (uni, typeVal) => {
    const dates = {
      test: {
        title: `${uni.entryTest} Test Timeline`,
        timeline: 'July 10 – July 20, 2026',
        instructions: 'Test is conducted online/at dedicated campus labs. Candidates must print admit cards from portal 3 days prior.',
        status: 'Upcoming'
      },
      apply: {
        title: 'Fall 2026 Application Portal',
        timeline: 'June 01 – July 05, 2026',
        instructions: 'Submit academic details, upload required marksheets, and pay processing fees of Rs. 2,000 online.',
        status: 'Open'
      },
      admission: {
        title: 'Merit Lists & Enrolment',
        timeline: 'August 02 – August 15, 2026',
        instructions: 'Merit lists will be published on the university website. Selected candidates must deposit fee within 4 days.',
        status: 'Upcoming'
      }
    };

    // Varies slightly based on university logic
    if (uni.id === 'nust') {
      dates.test.timeline = 'NET Series 4: July 01 – July 15, 2026';
      dates.apply.timeline = 'May 15 – June 24, 2026';
      dates.admission.timeline = 'First Merit List: August 01, 2026';
    } else if (uni.id === 'uet-lahore') {
      dates.test.timeline = 'ECAT: Held in March 2026';
      dates.test.status = 'Completed';
      dates.apply.timeline = 'May 20 – June 20, 2026';
      dates.admission.timeline = 'First Merit List: July 05, 2026';
    } else if (uni.id === 'lums') {
      dates.test.timeline = 'LCAT / SAT: Held in Jan/Feb 2026';
      dates.test.status = 'Completed';
      dates.apply.timeline = 'Closed in February 2026';
      dates.apply.status = 'Closed';
      dates.admission.timeline = 'Admission Decision Offers: April – July 2026';
    }

    return dates[typeVal] || dates.apply;
  };

  const handleCardClick = (uni) => {
    setSelectedUni(uni);
  };

  const activeDates = selectedUni ? getUniDatesData(selectedUni, currentType) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col space-y-10 text-ink dark:text-white">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-4xl mx-auto w-full text-center md:text-left relative z-10 select-none">
        <div className="space-y-2 flex-1">
          <h2 className="text-3xl font-extrabold text-ink dark:text-white mb-1">{getTitle()}</h2>
          <p className="text-xs text-muted dark:text-gray-400 max-w-md mx-auto md:mx-0">
            Click on any university card below to view specific scheduling details.
          </p>
        </div>
        <EduAnimation type="dates" />
      </div>

      {/* 1. Public Sector */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center pl-3 border-l-[3px] border-l-gold select-none">
          <h3 className="text-[13px] font-medium text-ink dark:text-white leading-none uppercase tracking-wide">Public Sector</h3>
          <span className="text-[11px] text-muted dark:text-gray-400 font-bold ml-2">({publicUniversities.length} Institutions)</span>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-8">
          {publicUniversities.map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => handleCardClick(uni)}
              />
            </Tilt>
          ))}
        </div>
      </div>

      {/* 2. Private Sector */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center pl-3 border-l-[3px] border-l-gold select-none">
          <h3 className="text-[13px] font-medium text-ink dark:text-white leading-none uppercase tracking-wide">Private Sector</h3>
          <span className="text-[11px] text-muted dark:text-gray-400 font-bold ml-2">({privateUniversities.length} Institutions)</span>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-8">
          {privateUniversities.map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => handleCardClick(uni)}
              />
            </Tilt>
          ))}
        </div>
      </div>

      {/* 3. Semi-Government */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center pl-3 border-l-[3px] border-l-gold select-none">
          <h3 className="text-[13px] font-medium text-ink dark:text-white leading-none uppercase tracking-wide">Semi-Government</h3>
          <span className="text-[11px] text-muted dark:text-gray-400 font-bold ml-2">({semiGovtUniversities.length} Institutions)</span>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-8">
          {semiGovtUniversities.map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => handleCardClick(uni)}
              />
            </Tilt>
          ))}
        </div>
      </div>

      {/* Dates Details Flat Modal/Dialog Overlay */}
      {selectedUni && activeDates && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50 select-none">
          <div className="bg-white dark:bg-[#0C132C] border-l-[4px] border-l-gold border border-y-border dark:border-y-white/10 border-r-border dark:border-r-white/10 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl text-ink dark:text-white">
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-ink dark:text-white text-[15px]">{selectedUni.name}</h3>
                <span className="text-[11px] text-muted dark:text-gray-400 font-bold uppercase tracking-wider block mt-0.5">
                  {activeDates.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedUni(null)}
                className="text-muted hover:text-ink dark:hover:text-white font-bold text-sm focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-2 text-[13px] text-ink dark:text-white">
              <div className="flex justify-between">
                <span className="text-muted dark:text-gray-400">Target Timeline:</span>
                <span className="font-bold text-ink dark:text-white">{activeDates.timeline}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted dark:text-gray-400">Status:</span>
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase tracking-wider border ${
                  activeDates.status === 'Open' || activeDates.status === 'Ongoing'
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400'
                    : activeDates.status === 'Closed'
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400'
                    : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/30 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {activeDates.status || 'Upcoming'}
                </span>
              </div>
              <div className="pt-2 border-t border-border dark:border-white/10">
                <span className="block text-[11px] font-bold text-muted dark:text-gray-400 uppercase tracking-wide mb-1">Process Guidelines</span>
                <p className="text-muted dark:text-gray-400 leading-relaxed text-xs">
                  {activeDates.instructions}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedUni(null)}
                className="flex-1 py-2 bg-cloudy dark:bg-white/5 hover:bg-border dark:hover:bg-white/10 text-ink dark:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors border border-transparent dark:border-white/5 min-h-[44px]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
