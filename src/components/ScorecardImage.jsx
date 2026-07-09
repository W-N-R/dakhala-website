import React, { forwardRef } from 'react';
import { Target, GraduationCap, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { getUniversityLogo } from '../data/universities';

const ScorecardImage = forwardRef(({ uni, aggregate, programGroup, campus, edSystem, eligiblePrograms = [] }, ref) => {
  if (!uni) return null;

  return (
    <div 
      ref={ref} 
      className="bg-[#0A100E] text-white w-[800px] h-[800px] flex flex-col relative overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Premium Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#25A18E]/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#C1A05B]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header - Glassmorphism */}
      <div className="bg-white/[0.03] p-8 flex items-center justify-between z-10 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-6 w-[75%]">
          <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#C1A05B]/30 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-200"></div>
            <img 
              src={getUniversityLogo(uni.slug)} 
              alt={uni.name} 
              className="w-full h-full object-contain relative z-10"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-[22px] leading-snug font-black text-white tracking-wide uppercase line-clamp-2">
              {uni.name}
            </h1>
            <p className="text-[#C1A05B] text-[13px] font-bold mt-1 tracking-[0.2em] uppercase">Admission Scorecard 2025</p>
          </div>
        </div>
        <div className="text-right w-[20%]">
          <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase">Campus</p>
          <p className="text-white text-xl font-black mt-0.5 truncate">{campus || 'Main'}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-10 py-8 z-10 flex flex-col justify-center gap-8">
        
        {/* Main Aggregate & Details Card */}
        <div className="flex justify-between items-center bg-white/[0.04] p-8 rounded-[2rem] border border-white/[0.08] shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 w-[45%] pr-4">
            <p className="text-white/40 text-[11px] font-black tracking-[0.2em] uppercase mb-3">Program Group</p>
            <h2 className="text-[22px] font-black text-white leading-tight mb-3 line-clamp-2">{programGroup || 'All Programs'}</h2>
            <p className="text-white/60 text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25A18E]"></span>
              System: <span className="text-white truncate">{edSystem}</span>
            </p>
          </div>
          
          <div className="relative z-10 w-[55%] flex flex-col items-end border-l border-white/10 pl-6">
            <p className="text-white/40 text-[11px] font-black tracking-[0.2em] uppercase mb-2">Calculated Aggregate</p>
            <div className="flex items-baseline justify-end">
              <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-tighter">
                {aggregate}
              </span>
              <span className="text-4xl font-black text-[#25A18E] ml-1">%</span>
            </div>
          </div>
        </div>

        {/* Admission Feasibility Outlook */}
        <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.05]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#25A18E]/20 rounded-xl border border-[#25A18E]/30 shadow-[0_0_15px_rgba(37,161,142,0.2)]">
              <Target className="w-5 h-5 text-[#25A18E]" />
            </div>
            <h3 className="text-xl font-black text-white tracking-wide">Feasibility Outlook</h3>
          </div>
          
          {eligiblePrograms.length === 0 ? (
            <div className="bg-black/20 p-6 rounded-2xl border border-white/[0.05] text-center">
              <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-[11px]">No program data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {eligiblePrograms.slice(0, 6).map(p => {
                const cutoff = p.merits[2025] || 70.0;
                const diff = parseFloat(aggregate) - cutoff;
                
                let badgeCls = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                let statusText = "Likely";
                let StatusIcon = CheckCircle2;
                let diffCls = "text-emerald-400";
                
                if (diff < -2.0) {
                  badgeCls = "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]";
                  statusText = "Tough";
                  StatusIcon = XCircle;
                  diffCls = "text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.3)]";
                } else if (diff < 1.0) {
                  badgeCls = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                  statusText = "Borderline";
                  StatusIcon = AlertCircle;
                  diffCls = "text-amber-400";
                } else {
                  badgeCls += " shadow-[0_0_10px_rgba(16,185,129,0.1)]";
                  diffCls += " drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]";
                }
                
                return (
                  <div key={p.name} className="bg-black/30 p-4 rounded-2xl border border-white/[0.06] flex items-center justify-between">
                    <div className="w-[60%]">
                      <p className="font-bold text-white text-[15px] truncate pr-2">{p.name}</p>
                      <p className="text-[10px] text-white/40 font-bold mt-1 tracking-wide">2025 Cutoff: {cutoff}%</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 w-[40%]">
                      <span className={`text-[9px] font-black tracking-[0.15em] uppercase px-2 py-1 rounded-md border ${badgeCls} flex items-center gap-1`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {statusText}
                      </span>
                      <span className={`text-[13px] font-black font-mono tracking-tighter ${diffCls}`}>
                        {diff >= 0 ? '+' : ''}{diff.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
              {eligiblePrograms.length > 6 && (
                <div className="col-span-2 text-center text-[11px] text-white/30 font-bold mt-3 uppercase tracking-[0.2em]">
                  + {eligiblePrograms.length - 6} more programs...
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="bg-black/60 px-8 py-6 flex items-center justify-between border-t border-white/[0.05] z-10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/[0.05] rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
            <GraduationCap className="w-5 h-5 text-[#C1A05B]" />
          </div>
          <div>
            <p className="text-white font-black text-[15px] tracking-[0.25em]">DAKHALA</p>
            <p className="text-white/40 text-[10px] font-bold tracking-widest mt-0.5">Calculate your merit at dakhala.site</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25A18E] animate-pulse"></span>
          <p className="text-[#C1A05B]/80 text-[10px] font-black tracking-[0.2em] uppercase">Generated Securely</p>
        </div>
      </div>
      
    </div>
  );
});

ScorecardImage.displayName = 'ScorecardImage';

export default ScorecardImage;
