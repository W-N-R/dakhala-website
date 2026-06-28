import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-16 py-10 animate-pulse">
      <div className="h-10 bg-muted/20 rounded-lg w-1/3 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-64 bg-muted/10 rounded-xl border border-white/20"></div>
        <div className="h-64 bg-muted/10 rounded-xl border border-white/20"></div>
        <div className="h-64 bg-muted/10 rounded-xl border border-white/20 hidden md:block"></div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="h-8 bg-muted/10 rounded-lg w-full"></div>
        <div className="h-8 bg-muted/10 rounded-lg w-5/6"></div>
        <div className="h-8 bg-muted/10 rounded-lg w-4/6"></div>
      </div>
    </div>
  );
}
