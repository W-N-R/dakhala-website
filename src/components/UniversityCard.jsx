import React, { useState } from 'react';
import { getUniversityLogo } from '../data/universities';

export default function UniversityCard({ university, onClick }) {
  const fallbackBg = university.colorHex || '#C9A227';
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="w-full h-[180px] bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-2xl border-b-[4px] border-b-gold flex flex-col items-center justify-between cursor-pointer select-none transition-all hover:scale-[1.03] hover:border-gold p-4 shadow-md hover:shadow-lg"
    >
      {/* Top logo area (65%) */}
      <div className="h-[65%] w-full flex items-center justify-center">
        {!logoError ? (
          <img
            src={getUniversityLogo(university.id)}
            alt={`${university.shortName} Logo`}
            className="w-[90px] h-[90px] object-contain rounded-xl p-1 bg-white/50"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div
            className="w-[90px] h-[90px] rounded-xl flex items-center justify-center text-white font-black text-xs text-center px-2 select-none shadow-inner"
            style={{ backgroundColor: fallbackBg }}
          >
            <span className="logo-font text-white text-base">{university.shortName}</span>
          </div>
        )}
      </div>

      {/* Bottom text area (35%) */}
      <div className="h-[35%] w-full flex flex-col items-center justify-center text-center mt-2">
        <span className="text-xs font-bold text-ink dark:text-white leading-tight line-clamp-1">
          {university.shortName}
        </span>
        <span className="text-[10px] text-muted dark:text-white/40 leading-tight line-clamp-1 mt-0.5">
          {university.name}
        </span>
      </div>
    </div>
  );
}
