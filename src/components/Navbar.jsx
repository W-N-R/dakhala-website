import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { publicUniversities, privateUniversities, semiGovtUniversities } from '../data/universities';
import { Share2, Check } from 'lucide-react';
import { logAction } from '../lib/telemetry';

// Clean inline SVG components for chevron icons
function ChevronDownIcon({ isOpen }) {
  return (
    <svg
      className={`w-3 h-3 ml-1 inline-block transition-transform duration-200 ${isOpen ? 'rotate-180 text-goldDark' : 'text-ink/60 dark:text-white/60'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="w-2.5 h-2.5 text-ink/40 dark:text-white/40 group-hover:text-goldDark transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function Navbar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState(null); // Level 1 open tab ID
  const [openSubSector, setOpenSubSector] = useState('tracker-public'); // For megamenu active panel

  // Mobile drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState(null);
  const [mobileActiveSub, setMobileActiveSub] = useState(null);
  const [mobileActiveSector, setMobileActiveSector] = useState(null);

  const [shareCopied, setShareCopied] = useState(false);

  const handleShareWebsite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + '/').then(() => {
      setShareCopied(true);
      logAction('share_click');
      setTimeout(() => setShareCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle window width resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAll();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close all menus on route change
  useEffect(() => {
    closeAll();
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const closeAll = () => {
    setActiveTab(null);
  };

  const handleTabClick = (tabName, hasDropdown, route) => {
    if (!hasDropdown) {
      navigate(route);
      closeAll();
    } else {
      setActiveTab(activeTab === tabName ? null : tabName);
      if (tabName === 'calculator') {
        setOpenSubSector('calc-public');
      } else if (tabName === 'merit') {
        setOpenSubSector('tracker-public');
      } else if (tabName === 'admissions') {
        setOpenSubSector('guide-public');
      }
    }
  };

  const handleLevel2ItemClick = (route) => {
    navigate(route);
    closeAll();
    setIsDrawerOpen(false);
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;
  const isDesktop = windowWidth >= 1200;

  const entryTestsList = [
    { name: 'ECAT', slug: 'ecat' },
    { name: 'MDCAT', slug: 'mdcat' },
    { name: 'NUST NET', slug: 'nust-net' },
    { name: 'NUSAT', slug: 'nusat' },
    { name: 'ETEA', slug: 'etea' },
    { name: 'NTS NAT', slug: 'nts-nat' },
    { name: 'LCAT', slug: 'lcat' },
    { name: 'IBA Aptitude', slug: 'iba-aptitude' },
    { name: 'NUMS Test', slug: 'nums-test' },
    { name: 'GIKI Test', slug: 'giki-test' },
    { name: 'PIEAS Test', slug: 'pieas-test' },
    { name: 'Air Uni Test', slug: 'air-uni-test' },
    { name: 'COMSATS Test', slug: 'comsats-test' },
    { name: 'UHS MDCAT', slug: 'uhs-mdcat' },
    { name: 'SAT/SAT II', slug: 'sat-sat-ii' },
  ];

  // Render Mobile Hamburger & Drawer
  if (isMobile) {
    return (
      <>
        <nav ref={navRef} className="sticky top-0 z-50 w-full bg-[#B5DFDD]/85 dark:bg-[#0A1C2A]/85 backdrop-blur-md border-b border-[#9BD7D2]/50 dark:border-gold/20 px-4 pt-3.5 pb-2.5 select-none">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none select-none group">
            <span className="logo-font-urdu text-[38px] bg-gradient-to-r from-gold via-goldDark to-gold bg-clip-text text-transparent font-black tracking-wide leading-none drop-shadow-[0_2px_10px_rgba(0,212,255,0.15)] transition-all duration-300 pt-2">
              داخلہ
            </span>
          </Link>

          {/* Hamburger Icon */}
          <div className="flex items-center space-x-3">
            {/* Mobile Share Website Button */}
            <button
              onClick={handleShareWebsite}
              className="p-2 bg-white/10 dark:bg-white/5 border border-border/30 dark:border-white/10 rounded-lg text-ink dark:text-white hover:text-goldDark transition-colors relative"
              title="Share Website"
            >
              {shareCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              {shareCopied && (
                <span className="absolute top-9 right-0 bg-ink dark:bg-[#0A1C2A] text-white text-[9px] font-black py-0.5 px-1.5 rounded shadow border border-border/30 dark:border-white/10 z-50 whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-ink dark:text-white hover:text-goldDark focus:outline-none p-1"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        </nav>

        {/* Full-screen Drawer Overlay */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[100] bg-[#B5DFDD]/98 dark:bg-[#0A1C2A]/98 backdrop-blur-xl flex flex-col p-5 overflow-y-auto space-y-4 text-ink dark:text-white">

              {/* Close Button */}
              <div className="flex justify-between items-center pb-3 border-b border-border dark:border-white/10">
                <span className="logo-font-urdu text-3xl bg-gradient-to-r from-gold to-goldDark bg-clip-text text-transparent font-bold">داخلہ</span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-ink/60 dark:text-white/60 hover:text-ink dark:hover:text-white font-bold text-xs p-1"
                >
                  ✕ CLOSE
                </button>
              </div>

              {/* Vertical Menu List */}
              <div className="flex flex-col text-base font-semibold">

                {/* 1. Aggregate Calculator Accordion */}
                <div>
                  <button
                    onClick={() => setMobileActiveTab(mobileActiveTab === 'calc' ? null : 'calc')}
                    className="w-full flex justify-between items-center h-[44px] border-b border-border dark:border-white/5 text-left hover:text-goldDark"
                  >
                    <span>Aggregate Calculator ▼</span>
                  </button>
                  {mobileActiveTab === 'calc' && (
                    <div className="pl-4 py-2 flex flex-col space-y-2.5 bg-cloudy/40 dark:bg-white/[0.02] border-b border-border dark:border-white/5 text-sm text-ink/80 dark:text-white/80">
                      <button onClick={() => handleLevel2ItemClick('/calculator/university')} className="w-full text-left py-1 hover:text-goldDark">University Calculator</button>
                      <button onClick={() => handleLevel2ItemClick('/calculator/mdcat')} className="w-full text-left py-1 hover:text-goldDark">MDCAT Calculator</button>
                      <button onClick={() => handleLevel2ItemClick('/calculator/oa-levels')} className="w-full text-left py-1 hover:text-goldDark">O/A Levels Equivalence</button>
                      <button onClick={() => handleLevel2ItemClick('/calculator/cgpa')} className="w-full text-left py-1 hover:text-goldDark">CGPA/SGPA Calculator</button>
                    </div>
                  )}
                </div>

                {/* 2. Past Merits Accordion */}
                <div>
                  <button
                    onClick={() => setMobileActiveTab(mobileActiveTab === 'merit' ? null : 'merit')}
                    className="w-full flex justify-between items-center h-[44px] border-b border-border dark:border-white/5 text-left hover:text-goldDark"
                  >
                    <span>Past Merits ▼</span>
                  </button>
                  {mobileActiveTab === 'merit' && (
                    <div className="pl-4 py-2 flex flex-col space-y-2.5 bg-cloudy/40 dark:bg-white/[0.02] border-b border-border dark:border-white/5 text-sm">
                      {/* Live Tracker Sub-accordion */}
                      <div>
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'tracker' ? null : 'tracker')}
                          className="w-full text-left py-1 hover:text-goldDark font-bold flex justify-between pr-2"
                        >
                          <span>Live Merit Tracker</span>
                          <span>{mobileActiveSub === 'tracker' ? '▲' : '▼'}</span>
                        </button>
                        {mobileActiveSub === 'tracker' && (
                          <div className="pl-4 py-1.5 flex flex-col space-y-1.5 border-l border-border dark:border-white/10 max-h-48 overflow-y-auto">
                            <button onClick={() => handleLevel2ItemClick('/past-merits')} className="w-full text-left py-0.5 text-xs text-goldDark italic">Tracker Home</button>
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Public Sector</div>
                            {publicUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/merit-tracker/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Private Sector</div>
                            {privateUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/merit-tracker/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Semi-Government</div>
                            {semiGovtUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/merit-tracker/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Historical Lists Sub-accordion */}
                      <div>
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'history' ? null : 'history')}
                          className="w-full text-left py-1 hover:text-goldDark font-bold flex justify-between pr-2"
                        >
                          <span>Historical Merit Lists</span>
                          <span>{mobileActiveSub === 'history' ? '▲' : '▼'}</span>
                        </button>
                        {mobileActiveSub === 'history' && (
                          <div className="pl-4 py-1.5 flex flex-col space-y-1.5 border-l border-border dark:border-white/10 max-h-48 overflow-y-auto">
                            <button onClick={() => handleLevel2ItemClick('/past-merits')} className="w-full text-left py-0.5 text-xs text-goldDark italic">Merits Home</button>
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Public Sector</div>
                            {publicUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/past-merits/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Private Sector</div>
                            {privateUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/past-merits/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Semi-Government</div>
                            {semiGovtUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/past-merits/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Predictor Accordion */}
                <div>
                  <button
                    onClick={() => setMobileActiveTab(mobileActiveTab === 'predictor' ? null : 'predictor')}
                    className="w-full flex justify-between items-center h-[44px] border-b border-border dark:border-white/5 text-left hover:text-goldDark"
                  >
                    <span>Predictor ▼</span>
                  </button>
                  {mobileActiveTab === 'predictor' && (
                    <div className="pl-4 py-2 flex flex-col space-y-2.5 bg-cloudy/40 dark:bg-white/[0.02] border-b border-border dark:border-white/5 text-sm">
                      <button onClick={() => handleLevel2ItemClick('/compare')} className="w-full text-left py-1 hover:text-goldDark">Compare Universities</button>
                      <button onClick={() => handleLevel2ItemClick('/recommend')} className="w-full text-left py-1 hover:text-goldDark">University Recommender</button>
                    </div>
                  )}
                </div>

                {/* 4. Admissions Hub Accordion */}
                <div>
                  <button
                    onClick={() => setMobileActiveTab(mobileActiveTab === 'admissions' ? null : 'admissions')}
                    className="w-full flex justify-between items-center h-[44px] border-b border-border dark:border-white/5 text-left hover:text-goldDark"
                  >
                    <span>Admissions Hub ▼</span>
                  </button>
                  {mobileActiveTab === 'admissions' && (
                    <div className="pl-4 py-2 flex flex-col space-y-2.5 bg-cloudy/40 dark:bg-white/[0.02] text-sm">
                      {/* Guides Sub-accordion */}
                      <div>
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'guide' ? null : 'guide')}
                          className="w-full text-left py-1 hover:text-goldDark font-bold flex justify-between pr-2"
                        >
                          <span>Admission Guides</span>
                          <span>{mobileActiveSub === 'guide' ? '▲' : '▼'}</span>
                        </button>
                        {mobileActiveSub === 'guide' && (
                          <div className="pl-4 py-1.5 border-l border-border dark:border-white/10 flex flex-col space-y-1 max-h-48 overflow-y-auto">
                            <button onClick={() => handleLevel2ItemClick('/admission-guide')} className="w-full text-left py-0.5 text-xs text-goldDark italic">All Guides</button>
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Public Sector</div>
                            {publicUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/admission-guide/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Private Sector</div>
                            {privateUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/admission-guide/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                            <div className="text-[10px] text-muted dark:text-white/40 font-bold uppercase mt-1">Semi-Govt</div>
                            {semiGovtUniversities.map(u => (
                              <button key={u.id} onClick={() => handleLevel2ItemClick(`/admission-guide/${u.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs pl-2">{u.shortName}</button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Entry Tests Sub-accordion */}
                      <div>
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'tests' ? null : 'tests')}
                          className="w-full text-left py-1 hover:text-goldDark font-bold flex justify-between pr-2"
                        >
                          <span>Entry Tests Info</span>
                          <span>{mobileActiveSub === 'tests' ? '▲' : '▼'}</span>
                        </button>
                        {mobileActiveSub === 'tests' && (
                          <div className="pl-4 py-1.5 border-l border-border dark:border-white/10 flex flex-col space-y-1 max-h-48 overflow-y-auto">
                            {entryTestsList.map(t => (
                              <button key={t.slug} onClick={() => handleLevel2ItemClick(`/entry-tests/${t.slug}`)} className="w-full text-left py-0.5 hover:text-goldDark text-xs">{t.name}</button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dates Sub-accordion */}
                      <div>
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'dates' ? null : 'dates')}
                          className="w-full text-left py-1 hover:text-goldDark font-bold flex justify-between pr-2"
                        >
                          <span>Important Dates</span>
                          <span>{mobileActiveSub === 'dates' ? '▲' : '▼'}</span>
                        </button>
                        {mobileActiveSub === 'dates' && (
                          <div className="pl-4 py-1.5 border-l border-border dark:border-white/10 flex flex-col space-y-1">
                            <button onClick={() => handleLevel2ItemClick('/uni-dates/test')} className="w-full text-left py-0.5 hover:text-goldDark text-xs">Test Dates</button>
                            <button onClick={() => handleLevel2ItemClick('/uni-dates/apply')} className="w-full text-left py-0.5 hover:text-goldDark text-xs">Apply Dates</button>
                            <button onClick={() => handleLevel2ItemClick('/uni-dates/admission')} className="w-full text-left py-0.5 hover:text-goldDark text-xs">Admission Dates</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

            </div>
          </div>
        )}
      </>
    );
  }

  // TABLET MODE
  if (isTablet) {
    return (
      <nav ref={navRef} className="sticky top-0 z-50 w-full bg-[#B5DFDD]/85 dark:bg-[#0A1C2A]/85 backdrop-blur-md border-b border-[#9BD7D2]/50 dark:border-gold/20 select-none">
        {activeTab && (
          <div
            className="fixed inset-0 top-[56px] bg-black/40 z-30 transition-opacity duration-300 pointer-events-auto"
            onClick={closeAll}
          />
        )}
        <div className="px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none flex-shrink-0 mr-4 group">
            <span className="logo-font-urdu text-4xl bg-gradient-to-r from-gold via-goldDark to-gold bg-clip-text text-transparent font-black tracking-wide leading-none drop-shadow-[0_2px_10px_rgba(0,212,255,0.15)] transition-all duration-300 group-hover:scale-105">
              داخلہ
            </span>
          </Link>

          {/* Horizontally scrollable Tabs Bar */}
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-2 h-full mr-2">

            {/* 1. Aggregate Calculator */}
            <div className="relative">
              <button
                onClick={() => handleTabClick('calculator', true)}
                className={`px-2.5 py-1.5 text-[10px] font-bold rounded transition-colors whitespace-nowrap flex items-center ${activeTab === 'calculator' ? 'text-gold' : 'text-ink/80 dark:text-white/80 hover:text-goldDark'
                  }`}
              >
                <span>Aggregate Calculator</span>
                <ChevronDownIcon isOpen={activeTab === 'calculator'} />
              </button>
              {activeTab === 'calculator' && (
                <div className="absolute top-[100%] left-0 w-56 bg-[#CDEAE8] dark:bg-[#0A1C2A] border border-[#9BD7D2]/50 dark:border-gold/20 rounded-xl py-1.5 mt-1 z-50 text-ink dark:text-white text-[11px] select-none shadow-xl">
                  <button onClick={() => handleLevel2ItemClick('/calculator/university')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">University Calculator</button>
                  <button onClick={() => handleLevel2ItemClick('/calculator/mdcat')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">MDCAT Calculator</button>
                  <button onClick={() => handleLevel2ItemClick('/calculator/oa-levels')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">O/A Levels Equivalence</button>
                  <button onClick={() => handleLevel2ItemClick('/calculator/cgpa')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">CGPA/SGPA Calculator</button>
                </div>
              )}
            </div>

            {/* 2. Past Merits */}
            <div className="relative">
              <button
                onClick={() => handleTabClick('merit', true)}
                className={`px-2.5 py-1.5 text-[10px] font-bold rounded transition-colors whitespace-nowrap flex items-center ${activeTab === 'merit' ? 'text-gold' : 'text-ink/80 dark:text-white/80 hover:text-goldDark'
                  }`}
              >
                <span>Past Merits</span>
                <ChevronDownIcon isOpen={activeTab === 'merit'} />
              </button>
              {activeTab === 'merit' && (
                <div className="absolute top-[100%] left-0 w-56 bg-[#CDEAE8] dark:bg-[#0A1C2A] border border-[#9BD7D2]/50 dark:border-gold/20 rounded-xl py-1.5 mt-1 z-50 text-ink dark:text-white text-[11px] select-none shadow-xl flex flex-col">
                  <button onClick={() => handleLevel2ItemClick('/past-merits')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark font-bold border-b border-border dark:border-white/5">Merits & Tracker Home</button>

                  <div className="px-3 py-1.5 text-[9px] text-muted dark:text-white/40 uppercase font-black tracking-wider">Live Tracker</div>
                  <button onClick={() => handleLevel2ItemClick('/calculator/university')} className="w-full text-left px-5 py-1 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark">Tracker (Select Uni)</button>

                  <div className="px-3 py-1.5 text-[9px] text-muted dark:text-white/40 uppercase font-black tracking-wider mt-1">Past Merit Lists</div>
                  <button onClick={() => handleLevel2ItemClick('/past-merits')} className="w-full text-left px-5 py-1 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark">Historical Records</button>
                </div>
              )}
            </div>

            {/* 3. Predictor */}
            <div className="relative">
              <button
                onClick={() => handleTabClick('predictor', true)}
                className={`px-2.5 py-1.5 text-[10px] font-bold rounded transition-colors whitespace-nowrap flex items-center ${activeTab === 'predictor' ? 'text-gold' : 'text-ink/80 dark:text-white/80 hover:text-goldDark'
                  }`}
              >
                <span>Predictor</span>
                <ChevronDownIcon isOpen={activeTab === 'predictor'} />
              </button>
              {activeTab === 'predictor' && (
                <div className="absolute top-[100%] left-0 w-56 bg-[#CDEAE8] dark:bg-[#0A1C2A] border border-[#9BD7D2]/50 dark:border-gold/20 rounded-xl py-1.5 mt-1 z-50 text-ink dark:text-white text-[11px] select-none shadow-xl">
                  <button onClick={() => handleLevel2ItemClick('/compare')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">Compare Universities</button>
                  <button onClick={() => handleLevel2ItemClick('/recommend')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">University Recommender</button>
                </div>
              )}
            </div>

            {/* 4. Admissions Hub */}
            <div className="relative">
              <button
                onClick={() => handleTabClick('admissions', true)}
                className={`px-2.5 py-1.5 text-[10px] font-bold rounded transition-colors whitespace-nowrap flex items-center ${activeTab === 'admissions' ? 'text-gold' : 'text-ink/80 dark:text-white/80 hover:text-goldDark'
                  }`}
              >
                <span>Admissions Hub</span>
                <ChevronDownIcon isOpen={activeTab === 'admissions'} />
              </button>
              {activeTab === 'admissions' && (
                <div className="absolute top-[100%] left-0 w-56 bg-[#CDEAE8] dark:bg-[#0A1C2A] border border-[#9BD7D2]/50 dark:border-gold/20 rounded-xl py-1.5 mt-1 z-50 text-ink dark:text-white text-[11px] select-none shadow-xl flex flex-col">
                  <button onClick={() => handleLevel2ItemClick('/admission-guide')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">Admission Guides</button>
                  <button onClick={() => handleLevel2ItemClick('/entry-tests/ecat')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">Entry Tests Syllabus</button>
                  <button onClick={() => handleLevel2ItemClick('/uni-dates/apply')} className="w-full text-left px-3 py-2 hover:bg-cloudy dark:hover:bg-white/[0.05] hover:text-goldDark transition-colors">Important Dates</button>
                </div>
              )}
            </div>

          </div>

          {/* Tablet Share Website Button */}
          <button
            onClick={handleShareWebsite}
            className="p-2 bg-white/10 dark:bg-white/5 border border-border/30 dark:border-white/10 rounded-lg text-ink dark:text-white hover:text-goldDark transition-colors relative shrink-0 ml-2"
            title="Share Website"
          >
            {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            {shareCopied && (
              <span className="absolute top-9 right-0 bg-ink dark:bg-[#0A1C2A] text-white text-[9px] font-black py-0.5 px-1.5 rounded shadow border border-border/30 dark:border-white/10 z-50 whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>

        </div>
      </nav>
    );
  }

  // DESKTOP MODE
  return (
    <nav ref={navRef} className="sticky top-0 z-50 w-full bg-[#B5DFDD]/85 dark:bg-[#0A1C2A]/85 backdrop-blur-md border-b border-[#9BD7D2]/50 dark:border-gold/20 select-none">
      {activeTab && (
        <div
          className="fixed inset-0 top-[64px] bg-black/40 z-30 transition-opacity duration-300 pointer-events-auto"
          onClick={closeAll}
        />
      )}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo Section */}
          <Link to="/" className="flex items-center focus:outline-none select-none group">
            <span className="logo-font-urdu text-[44px] bg-gradient-to-r from-gold via-goldDark to-gold bg-clip-text text-transparent font-black tracking-wide leading-none drop-shadow-[0_2px_10px_rgba(0,212,255,0.15)] transition-all duration-300 group-hover:scale-105">
              داخلہ
            </span>
          </Link>

          {/* Navigation Tabs */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center h-full z-10">
            <div className="flex space-x-6 items-center h-full text-sm font-semibold">

              {/* 1. Aggregate Calculator */}
              <div
                onMouseEnter={() => { setActiveTab('calculator'); setOpenSubSector('calc-public'); }}
                onMouseLeave={() => { setActiveTab(null); }}
                className="relative h-full flex items-center"
              >
                <button
                  onClick={() => handleLevel2ItemClick('/calculator/university')}
                  className={`px-3 py-2 rounded transition-colors flex items-center whitespace-nowrap ${activeTab === 'calculator' ? 'text-gold' : 'text-ink/80 dark:text-white/80 hover:text-goldDark'
                    }`}
                >
                  <span>Aggregate Calculator</span>
                  <ChevronDownIcon isOpen={activeTab === 'calculator'} />
                </button>
                {activeTab === 'calculator' && (
                  <div className="absolute top-[100%] left-0 pt-2 z-50 select-none">
                    <div className="bg-[#CDEAE8] dark:bg-[#0A1C2A] border border-[#9BD7D2]/50 dark:border-gold/20 rounded-2xl text-ink dark:text-white shadow-2xl flex w-[580px] overflow-hidden">
                      {/* Left Menu Panel */}
                      <div className="w-[200px] bg-gray-50/50 dark:bg-white/[0.01] p-3 flex flex-col space-y-1">
                        <button
                          onClick={() => handleLevel2ItemClick('/calculator/university')}
                          onMouseEnter={() => setOpenSubSector('calc-public')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${openSubSector.startsWith('calc-') ? 'bg-gold/10 text-goldDark' : 'hover:bg-cloudy dark:hover:bg-white/5'
                            }`}
                        >
                          University Calculators
                        </button>
                        <button
                          onClick={() => handleLevel2ItemClick('/calculator/mdcat')}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-cloudy dark:hover:bg-white/5"
                        >
                          MDCAT Calculator
                        </button>
                        <button
                          onClick={() => handleLevel2ItemClick('/calculator/oa-levels')}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-cloudy dark:hover:bg-white/5"
                        >
                          O/A Levels Equivalence
                        </button>
                        <button
                          onClick={() => handleLevel2ItemClick('/calculator/cgpa')}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-cloudy dark:hover:bg-white/5"
                        >
                          CGPA/SGPA Calculator
                        </button>
                      </div>

                      {/* Right Detail Panel */}
                      {openSubSector.startsWith('calc-') && (
                        <div className="flex-1 bg-[#CDEAE8] dark:bg-[#0A1C2A] p-4 border-l border-[#9BD7D2]/50 dark:border-gold/20 flex flex-col">
                          {/* Sector Pills */}
                          <div className="flex gap-2 pb-3 mb-3 border-b border-border dark:border-white/5">
                            {['public', 'private', 'semigovt'].map((sec) => (
                              <button
                                key={sec}
                                onMouseEnter={() => setOpenSubSector(`calc-${sec}`)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${openSubSector === `calc-${sec}`
                                  ? 'bg-gold text-white border-gold'
                                  : 'bg-transparent text-muted dark:text-white/50 border-border dark:border-white/10 hover:border-gold'
                                  }`}
                              >
                                {sec}
                              </button>
                            ))}
                          </div>

                          {/* List of Universities */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                            {(openSubSector === 'calc-public'
                              ? publicUniversities
                              : openSubSector === 'calc-private'
                                ? privateUniversities
                                : semiGovtUniversities
                            ).map((uni) => (
                              <button
                                key={uni.id}
                                onClick={() => handleLevel2ItemClick(`/calculator/university/${uni.slug}`)}
                                className="w-full text-left text-xs font-semibold py-1 px-1.5 hover:bg-cloudy dark:hover:bg-white/5 hover:text-goldDark transition-colors rounded"
                              >
                                {uni.shortName}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Past Merits */}
              <div
                onMouseEnter={() => { setActiveTab('merit'); setOpenSubSector('tracker-public'); }}
                onMouseLeave={() => { setActiveTab(null); }}
                className="relative h-full flex items-center"
              >
                <button
                  onClick={() => handleLevel2ItemClick('/past-merits')}
                  className={`px-3 py-2 rounded transition-colors flex items-center whitespace-nowrap ${activeTab === 'merit' ? 'text-gold' : 'text-ink/80 dark:text-white/80 hover:text-goldDark'
                    }`}
                >
                  <span>Past Merits</span>
                  <ChevronDownIcon isOpen={activeTab === 'merit'} />
                </button>
                {activeTab === 'merit' && (
                  <div className="absolute top-[100%] left-0 pt-2 z-50 select-none">
                    <div className="bg-[#CDEAE8] dark:bg-[#0A1C2A] border border-[#9BD7D2]/50 dark:border-gold/20 rounded-2xl text-ink dark:text-white shadow-2xl flex w-[580px] overflow-hidden">
                      {/* Left Menu Panel */}
                      <div className="w-[200px] bg-gray-50/50 dark:bg-white/[0.01] p-3 flex flex-col space-y-1">
                        <div className="text-[10px] text-muted dark:text-white/40 font-black uppercase tracking-wider px-2 py-1">Admission Tools</div>
                        <button
                          onMouseEnter={() => setOpenSubSector('tracker-public')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${openSubSector.startsWith('tracker-') ? 'bg-gold/10 text-goldDark' : 'hover:bg-cloudy dark:hover:bg-white/5'
                            }`}
                        >
                          Live Merit Tracker
                        </button>
                        <button
                          onMouseEnter={() => setOpenSubSector('past-public')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${openSubSector.startsWith('past-') ? 'bg-gold/10 text-goldDark' : 'hover:bg-cloudy dark:hover:bg-white/5'
                            }`}
                        >
                          Historical Merits
                        </button>
                      </div>

                      {/* Right Detail Panel */}
                      <div className="flex-1 bg-[#CDEAE8] dark:bg-[#0A1C2A] p-4 border-l border-[#9BD7D2]/50 dark:border-gold/20 flex flex-col">
                        {/* Sector Pills */}
                        <div className="flex gap-2 pb-3 mb-3 border-b border-border dark:border-white/5">
                          {['public', 'private', 'semigovt'].map((sec) => {
                            const isTracker = openSubSector.startsWith('tracker-');
                            const prefix = isTracker ? 'tracker-' : 'past-';
                            return (
                              <button
                                key={sec}
                                onMouseEnter={() => setOpenSubSector(`${prefix}${sec}`)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${openSubSector === `${prefix}${sec}`
                                  ? 'bg-gold text-white border-gold'
                                  : 'bg-transparent text-muted dark:text-white/50 border-border dark:border-white/10 hover:border-gold'
                                  }`}
                              >
                                {sec}
                              </button>
                            );
                          })}
                        </div>

                        {/* List of Universities */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                          {(openSubSector.endsWith('public')
                            ? publicUniversities
                            : openSubSector.endsWith('private')
                              ? privateUniversities
                              : semiGovtUniversities
                          ).map((uni) => {
                            const isTracker = openSubSector.startsWith('tracker-');
                            const route = isTracker ? `/merit-tracker/${uni.slug}` : `/past-merits/${uni.slug}`;
                            return (
                              <button
                                key={uni.id}
                                onClick={() => handleLevel2ItemClick(route)}
                                className="w-full text-left text-xs font-semibold py-1 px-1.5 hover:bg-cloudy dark:hover:bg-white/5 hover:text-goldDark transition-colors rounded"
                              >
                                {uni.shortName}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Predictor */}
              <div
                onMouseEnter={() => { setActiveTab('predictor'); }}
                onMouseLeave={() => { setActiveTab(null); }}
                className="relative h-full flex items-center"
              >
                <button
                  onClick={() => handleLevel2ItemClick('/compare')}
                  className={`px-3 py-2 rounded transition-colors flex items-center whitespace-nowrap ${activeTab === 'predictor' ? 'text-gold' : 'text-ink/80 dark:text-white/80 hover:text-goldDark'
                    }`}
                >
                  <span>Predictor</span>
                  <ChevronDownIcon isOpen={activeTab === 'predictor'} />
                </button>
                {activeTab === 'predictor' && (
                  <div className="absolute top-[100%] left-0 pt-2 z-50 select-none">
                    <div className="bg-[#CDEAE8] dark:bg-[#0A1C2A] border border-[#9BD7D2]/50 dark:border-gold/20 rounded-xl py-2 text-ink dark:text-white shadow-2xl w-60 flex flex-col">
                      <button
                        onClick={() => handleLevel2ItemClick('/compare')}
                        className="w-full text-left px-4 py-2.5 hover:bg-cloudy dark:hover:bg-white/5 hover:text-goldDark transition-colors flex items-center justify-between group"
                      >
                        <span>Compare Universities</span>
                        <ChevronRightIcon />
                      </button>
                      <button
                        onClick={() => handleLevel2ItemClick('/recommend')}
                        className="w-full text-left px-4 py-2.5 hover:bg-cloudy dark:hover:bg-white/5 hover:text-goldDark transition-colors flex items-center justify-between group"
                      >
                        <span>University Recommender</span>
                        <ChevronRightIcon />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Admissions Hub */}
              <div
                onMouseEnter={() => { setActiveTab('admissions'); setOpenSubSector('guide-public'); }}
                onMouseLeave={() => { setActiveTab(null); }}
                className="relative h-full flex items-center"
              >
                <button
                  onClick={() => handleLevel2ItemClick('/admission-guide')}
                  className={`px-3 py-2 rounded transition-colors flex items-center whitespace-nowrap ${activeTab === 'admissions' ? 'text-gold' : 'text-ink/80 dark:text-white/80 hover:text-goldDark'
                    }`}
                >
                  <span>Admissions Hub</span>
                  <ChevronDownIcon isOpen={activeTab === 'admissions'} />
                </button>
                {activeTab === 'admissions' && (
                  <div className="absolute top-[100%] right-0 pt-2 z-50 select-none">
                    <div className="bg-[#CDEAE8] dark:bg-[#0A1C2A] border border-[#9BD7D2]/50 dark:border-gold/20 rounded-2xl text-ink dark:text-white shadow-2xl flex w-[580px] overflow-hidden">
                      {/* Left Menu Panel */}
                      <div className="w-[200px] bg-gray-50/50 dark:bg-white/[0.01] p-3 flex flex-col space-y-1">
                        <button
                          onMouseEnter={() => setOpenSubSector('guide-public')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${openSubSector.startsWith('guide-') ? 'bg-gold/10 text-goldDark' : 'hover:bg-cloudy dark:hover:bg-white/5'
                            }`}
                        >
                          Admission Guides
                        </button>
                        <button
                          onMouseEnter={() => setOpenSubSector('entry-tests')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${openSubSector === 'entry-tests' ? 'bg-gold/10 text-goldDark' : 'hover:bg-cloudy dark:hover:bg-white/5'
                            }`}
                        >
                          Entry Tests Syllabus
                        </button>
                        <button
                          onMouseEnter={() => setOpenSubSector('dates')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${openSubSector === 'dates' ? 'bg-gold/10 text-goldDark' : 'hover:bg-cloudy dark:hover:bg-white/5'
                            }`}
                        >
                          Important Dates
                        </button>
                      </div>

                      {/* Right Detail Panel */}
                      <div className="flex-1 bg-[#CDEAE8] dark:bg-[#0A1C2A] p-4 border-l border-[#9BD7D2]/50 dark:border-gold/20 flex flex-col">
                        {openSubSector.startsWith('guide-') && (
                          <>
                            {/* Sector Pills */}
                            <div className="flex gap-2 pb-3 mb-3 border-b border-border dark:border-white/5">
                              {['public', 'private', 'semigovt'].map((sec) => (
                                <button
                                  key={sec}
                                  onMouseEnter={() => setOpenSubSector(`guide-${sec}`)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${openSubSector === `guide-${sec}`
                                    ? 'bg-gold text-white border-gold'
                                    : 'bg-transparent text-muted dark:text-white/50 border-border dark:border-white/10 hover:border-gold'
                                    }`}
                                >
                                  {sec}
                                </button>
                              ))}
                            </div>

                            {/* List of Universities */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                              {(openSubSector === 'guide-public'
                                ? publicUniversities
                                : openSubSector === 'guide-private'
                                  ? privateUniversities
                                  : semiGovtUniversities
                              ).map((uni) => (
                                <button
                                  key={uni.id}
                                  onClick={() => handleLevel2ItemClick(`/admission-guide/${uni.slug}`)}
                                  className="w-full text-left text-xs font-semibold py-1 px-1.5 hover:bg-cloudy dark:hover:bg-white/5 hover:text-goldDark transition-colors rounded"
                                >
                                  {uni.shortName}
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {openSubSector === 'entry-tests' && (
                          <div className="flex flex-col h-full">
                            <div className="text-[10px] text-muted dark:text-white/40 border-b border-border dark:border-white/5 pb-1 mb-2 font-extrabold uppercase tracking-wider">
                              Choose Entry Test to View Syllabus
                            </div>
                            <div className="grid grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-1">
                              {entryTestsList.map((test) => (
                                <button
                                  key={test.slug}
                                  onClick={() => handleLevel2ItemClick(`/entry-tests/${test.slug}`)}
                                  className="text-left text-xs font-semibold py-1 px-1.5 hover:bg-cloudy dark:hover:bg-white/5 hover:text-goldDark transition-colors rounded"
                                >
                                  {test.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {openSubSector === 'dates' && (
                          <div className="flex flex-col h-full justify-center space-y-2">
                            <div className="text-[10px] text-muted dark:text-white/40 border-b border-border dark:border-white/5 pb-1 mb-2 font-extrabold uppercase tracking-wider">
                              Timelines & Schedules
                            </div>
                            <button
                              onClick={() => handleLevel2ItemClick('/uni-dates/test')}
                              className="w-full text-left text-xs font-bold py-2 px-3 bg-cloudy dark:bg-white/5 hover:bg-gold/15 hover:text-goldDark rounded-xl transition-all"
                            >
                              📅 Entry Test Registration & Exam Dates
                            </button>
                            <button
                              onClick={() => handleLevel2ItemClick('/uni-dates/apply')}
                              className="w-full text-left text-xs font-bold py-2 px-3 bg-cloudy dark:bg-white/5 hover:bg-gold/15 hover:text-goldDark rounded-xl transition-all"
                            >
                              📝 Admission Application Deadlines
                            </button>
                            <button
                              onClick={() => handleLevel2ItemClick('/uni-dates/admission')}
                              className="w-full text-left text-xs font-bold py-2 px-3 bg-cloudy dark:bg-white/5 hover:bg-gold/15 hover:text-goldDark rounded-xl transition-all"
                            >
                              🎓 Class Commencement & Merit List Dates
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Right Section for Share Button */}
          <div className="flex items-center space-x-3 z-10">
            <button
              onClick={handleShareWebsite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 dark:bg-white/5 hover:bg-gold/15 text-ink dark:text-white hover:text-goldDark border border-border/50 dark:border-white/10 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative shadow-sm"
              title="Share Website"
            >
              {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-gold" />}
              <span>Share Link</span>
              {shareCopied && (
                <span className="absolute top-[38px] right-0 bg-ink dark:bg-[#0A1C2A] text-white text-[9px] font-bold py-1 px-2 rounded-lg shadow-lg border border-border/40 dark:border-white/10 z-50 whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
    </nav>
  );
}
