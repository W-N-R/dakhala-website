import React, { forwardRef } from 'react';
import { Target, GraduationCap, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { getUniversityLogo } from '../data/universities';

const ScorecardImage = forwardRef(({ uni, aggregate, programGroup, campus, edSystem, eligiblePrograms = [] }, ref) => {
  if (!uni) return null;

  return (
    <div 
      ref={ref} 
      className="bg-white text-[#1e1e1e] w-[800px] h-[800px] flex flex-col relative overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#25A18E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C1A05B]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      {/* Header */}
      <div className="bg-[#1D2E28] p-10 flex items-center justify-between z-10 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-xl flex items-center justify-center overflow-hidden border-4 border-[#C1A05B]/30">
            <img src={getUniversityLogo(uni.slug)} alt={uni.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide uppercase">{uni.name}</h1>
            <p className="text-[#C1A05B] text-lg font-bold mt-1 tracking-widest uppercase">Admission Scorecard 2025</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-sm font-bold tracking-widest uppercase">Campus</p>
          <p className="text-white text-2xl font-black">{campus || 'Main'}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-12 z-10 flex flex-col justify-center space-y-10">
        
        <div className="flex justify-between items-center bg-[#f8f9fa] p-10 rounded-3xl border border-[#e5e7eb] shadow-sm">
          <div>
            <p className="text-[#6b7280] text-sm font-bold tracking-widest uppercase mb-2">Program Group</p>
            <h2 className="text-3xl font-black text-[#1e1e1e]">{programGroup || 'All Programs'}</h2>
            <p className="text-[#1e1e1e]/60 text-lg font-bold mt-2">System: {edSystem}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-[#6b7280] text-sm font-bold tracking-widest uppercase mb-2">Calculated Aggregate</p>
            <div className="bg-[#25A18E]/10 px-8 py-4 rounded-2xl border border-[#25A18E]/20">
              <span className="text-6xl font-black text-[#25A18E]">{aggregate}%</span>
            </div>
          </div>
        </div>

        {/* Admission Chances Overview */}
        <div>
          <h3 className="text-xl font-bold text-[#1e1e1e] mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-[#25A18E]" />
            Feasibility Outlook
          </h3>
          {eligiblePrograms.length === 0 ? (
            <div className="bg-[#f8f9fa] p-6 rounded-2xl border border-[#e5e7eb] text-center">
              <p className="text-[#6b7280] font-bold tracking-widest uppercase">No program data available for this campus.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {eligiblePrograms.slice(0, 6).map(p => {
                const cutoff = p.merits[2025] || 70.0;
                const diff = parseFloat(aggregate) - cutoff;
                let badgeCls = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
                let statusText = "Likely";
                let StatusIcon = CheckCircle2;
                if (diff < -2.0) {
                  badgeCls = "bg-rose-500/10 text-rose-600 border-rose-500/20";
                  statusText = "Tough";
                  StatusIcon = XCircle;
                } else if (diff < 1.0) {
                  badgeCls = "bg-amber-500/10 text-amber-600 border-amber-500/20";
                  statusText = "Borderline";
                  StatusIcon = AlertCircle;
                }
                return (
                  <div key={p.name} className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-sm flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1e1e1e] text-lg">{p.name}</p>
                      <p className="text-xs text-[#6b7280] font-bold mt-1">2025 Cutoff: {cutoff}%</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${badgeCls} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusText}
                      </span>
                      <span className={`text-sm font-bold font-mono ${diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {diff >= 0 ? '+' : ''}{diff.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
              {eligiblePrograms.length > 6 && (
                <div className="col-span-2 text-center text-sm text-[#6b7280] font-bold mt-2 uppercase tracking-widest">
                  + {eligiblePrograms.length - 6} more programs...
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="bg-[#F8F9FA] p-8 flex items-center justify-between border-t border-[#e5e7eb] z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#1D2E28] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-[#C1A05B]" />
          </div>
          <div>
            <p className="text-[#1e1e1e] font-black text-lg">DAKHALA</p>
            <p className="text-[#6b7280] text-xs font-bold">Calculate your merit at dakhala.site</p>
          </div>
        </div>
        <p className="text-[#6b7280] text-sm font-bold">Generated securely & instantly.</p>
      </div>
      
    </div>
  );
});

export default ScorecardImage;
