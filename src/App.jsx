import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import PageSkeleton from './components/PageSkeleton';
import RightSidebar from './components/RightSidebar';
import PromoAdBanner from './components/PromoAdBanner';
import { useAppStore } from './store/useAppStore';
import { logPageView, logAction } from './lib/telemetry';
import { auth, onAuthStateChanged } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';
import { useDataStore } from './store/useDataStore';
import whatsappLogo from './assets/whatsapp.png';
import ProtectedRoute from './components/ProtectedRoute';

function TelemetryTracker() {
  const location = useLocation();
  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);
  return null;
}

// Lazy-loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const UniversityCalculator = lazy(() => import('./pages/UniversityCalculator'));
const UniversityDetailCalculator = lazy(() => import('./pages/UniversityDetailCalculator'));
const OALevelsCalculator = lazy(() => import('./pages/OALevelsCalculator'));
const Cgpacalculator = lazy(() => import('./pages/Cgpacalculator'));
const MdcatCalculator = lazy(() => import('./pages/MdcatCalculator'));
const MeritTracker = lazy(() => import('./pages/MeritTracker'));
const Compare = lazy(() => import('./pages/Compare'));
const Recommend = lazy(() => import('./pages/Recommend'));
const PastMerits = lazy(() => import('./pages/PastMerits'));
const AdmissionGuide = lazy(() => import('./pages/AdmissionGuide'));
const EntryTests = lazy(() => import('./pages/EntryTests'));
const UniDates = lazy(() => import('./pages/UniDates'));
const StudentPortal = lazy(() => import('./pages/StudentPortal'));
const AdminPortal = lazy(() => import('./pages/AdminPortal'));

export default function App() {
  const { setUser, clearUser } = useAuthStore();
  const { fetchData } = useDataStore();

  useEffect(() => {
    fetchData(); // Load universities and dates from Firestore

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        clearUser();
      }
    });
    return () => unsubscribe();
  }, [setUser, clearUser]);

  const {
    theme,
    aquaTheme,
    textSize,
    dyslexiaFont,
    highContrast,
    monochrome,
    invertColors,
    readingGuide,
    highlightLinks,
    largeCursor,
    pauseAnimations,
    textSpacing
  } = useAppStore();

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Apply dark mode class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Apply dark aqua theme class
    if (aquaTheme === 'dark') {
      document.body.classList.add('dark-aqua');
    } else {
      document.body.classList.remove('dark-aqua');
    }
  }, [aquaTheme]);

  // Apply all accessibility body classes
  useEffect(() => {
    const list = document.body.classList;
    
    if (dyslexiaFont) list.add('dyslexia-active');
    else list.remove('dyslexia-active');

    if (highContrast) list.add('contrast-active');
    else list.remove('contrast-active');

    if (monochrome) list.add('monochrome-active');
    else list.remove('monochrome-active');

    if (invertColors) list.add('invert-active');
    else list.remove('invert-active');

    if (highlightLinks) list.add('highlight-links-active');
    else list.remove('highlight-links-active');

    if (largeCursor) list.add('large-cursor-active');
    else list.remove('large-cursor-active');

    if (pauseAnimations) list.add('pause-animations-active');
    else list.remove('pause-animations-active');

    if (textSpacing) list.add('text-spacing-active');
    else list.remove('text-spacing-active');
  }, [dyslexiaFont, highContrast, monochrome, invertColors, highlightLinks, largeCursor, pauseAnimations, textSpacing]);

  // Global mousemove for reading guide
  useEffect(() => {
    const list = document.body.classList;
    if (!readingGuide) {
      list.remove('reading-guide-active');
      return;
    }
    list.add('reading-guide-active');

    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--guide-top', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      list.remove('reading-guide-active');
    };
  }, [readingGuide]);
  return (
    <HelmetProvider>
      <Router>
        <TelemetryTracker />
        <div className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-transparent transition-colors duration-300 flex flex-col ${textSize === 'large' ? 'text-lg' : textSize === 'xlarge' ? 'text-xl' : 'text-base'}`}>
        {/* Navigation Bar */}
        <Navbar />

        {/* Global Floating Sidebar */}
        <RightSidebar />

        {/* Publicity Ad Banner */}
        <PromoAdBanner />

        {/* Floating WhatsApp Advisory Widget */}
        <div className="fixed bottom-6 right-6 z-50 group">
          <a
            href="https://wa.me/923395066625?text=Assalam%20o%20Alaikum!%20I%20visited%20Dakhala%20Admissions%20Portal%20and%20need%20guidance%20regarding%20university%20admissions.%20Please%20assist%20me."
            onClick={() => logAction('whatsapp_click')}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1DA851] rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.4)] text-white hover:scale-110 active:scale-95 transition-all relative"
            title="Admissions Live Support"
          >
            <img src={whatsappLogo} alt="WhatsApp" className="w-7 h-7 object-contain" />
            <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-20 group-hover:opacity-30 animate-ping pointer-events-none" />
            <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-300 origin-right bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-white border border-[#CBE3E2] dark:border-white/10 px-3 py-1.5 rounded-xl text-xs font-black shadow-lg whitespace-nowrap">
              💬 Ask a Counselor
            </span>
          </a>
        </div>
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 p-3.5 bg-ink hover:bg-gold text-white dark:bg-white/10 dark:hover:bg-gold dark:text-white border border-[#CBE3E2] dark:border-white/10 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
            title="Scroll to Top"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
        {/* Page Content with responsive padding */}
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 lg:px-16">
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            {/* Calculators */}
            <Route path="/calculator/university" element={<UniversityCalculator />} />
            <Route path="/calculator/university/:slug" element={<UniversityDetailCalculator />} />
            <Route path="/calculator/oa-levels" element={<OALevelsCalculator />} />
            <Route path="/calculator/cgpa" element={<Cgpacalculator />} />
            <Route path="/calculator/mdcat" element={<MdcatCalculator />} />

            {/* Portals */}
            <Route path="/student-portal" element={<ProtectedRoute><StudentPortal /></ProtectedRoute>} />
            <Route path="/admin-portal" element={<ProtectedRoute adminOnly><AdminPortal /></ProtectedRoute>} />

            {/* Merit & Tracker */}
            <Route path="/merit-tracker/:slug" element={<MeritTracker />} />
            <Route path="/past-merits" element={<PastMerits />} />
            <Route path="/past-merits/:slug" element={<PastMerits />} />

            {/* Comparison & Recommendation */}
            <Route path="/compare" element={<Compare />} />
            <Route path="/recommend" element={<Recommend />} />

            {/* Guides & Tests */}
            <Route path="/admission-guide" element={<AdmissionGuide />} />
            <Route path="/admission-guide/:slug" element={<AdmissionGuide />} />
            <Route path="/entry-tests/:testId" element={<EntryTests />} />

            {/* Timelines */}
            <Route path="/uni-dates/:type" element={<UniDates />} />

            {/* Fallback */}
            <Route path="*" element={
              <div className="text-center py-20 bg-cloudy dark:bg-maqsadNavy min-h-screen flex flex-col items-center justify-center space-y-4">
                <h2 className="text-xl font-bold text-ink dark:text-white">Page Not Found</h2>
                <Link to="/" className="text-gold font-semibold underline mt-2 inline-block">Go Home</Link>
              </div>
            } />
            </Routes>
          </Suspense>
        </main>

        {/* Premium Medium Slate-Teal Footer */}
        <footer className="w-full bg-gradient-to-b from-[#2A4858] to-[#182E3A] border-t border-white/10 pt-16 pb-8 text-sm text-white/70 select-none relative overflow-hidden">
          {/* Decorative glowing blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-maqsadBlue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-[13px] relative z-10">
            {/* Left Column: Brand & Tagline */}
            <div className="space-y-4">
              <Link to="/" className="flex flex-col justify-center items-start focus:outline-none mb-2">
                <span className="font-elmessiri text-5xl text-gold font-bold tracking-wide leading-tight drop-shadow-md">داخلہ</span>
              </Link>
              <p className="text-[13px] text-white/60 leading-relaxed font-light">
                Pakistan's premium university admission advisory and aggregate calculation platform. Standardizing entries for MDCAT, ECAT, BCAT, and O/A Levels equivalence.
              </p>
              {/* Mock App Downloads */}
              <div className="flex gap-2 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-[11px] text-white/60 block leading-tight">Get it on <strong className="text-white block text-sm font-semibold">Google Play</strong></span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-[11px] text-white/60 block leading-tight">Download on the <strong className="text-white block text-sm font-semibold">App Store</strong></span>
                </div>
              </div>
            </div>

            {/* Column 2: Calculators & Tools */}
            <div className="space-y-4">
              <h4 className="text-[#25A18E] font-bold text-sm uppercase tracking-wider">Calculation Hub</h4>
              <ul className="space-y-3 text-sm text-white/80 font-medium">
                <li><Link to="/calculator/university" className="hover:text-gold transition-colors">University Calculator</Link></li>
                <li><Link to="/calculator/oa-levels" className="hover:text-gold transition-colors">O/A Level Equivalence</Link></li>
                <li><Link to="/calculator/cgpa" className="hover:text-gold transition-colors">CGPA / SGPA Calculator</Link></li>
                <li><Link to="/compare" className="hover:text-gold transition-colors">Compare Universities</Link></li>
                <li><Link to="/recommend" className="hover:text-gold transition-colors">University Recommendation</Link></li>
              </ul>
            </div>

            {/* Column 3: Directories & Info */}
            <div className="space-y-4">
              <h4 className="text-[#25A18E] font-bold text-sm uppercase tracking-wider">Admissions 2026</h4>
              <ul className="space-y-3 text-sm text-white/80 font-medium">
                <li><Link to="/past-merits" className="hover:text-gold transition-colors">Past Merit Cutoffs</Link></li>
                <li><Link to="/admission-guide" className="hover:text-gold transition-colors">Admission Guides</Link></li>
                <li><Link to="/uni-dates/apply" className="hover:text-gold transition-colors">Important Dates Calendar</Link></li>
                <li><Link to="/entry-tests/ecat" className="hover:text-gold transition-colors">Entry Tests Syllabus</Link></li>
              </ul>
            </div>

            {/* Column 4: WhatsApp Advisory Link */}
            <div className="space-y-4">
              <h4 className="text-[#25A18E] font-bold text-sm uppercase tracking-wider">Connect & Advisory</h4>
              <p className="text-[13px] text-white/60 leading-relaxed font-light">
                Facing issues with aggregates or equivalence? Get immediate guidance from our expert admission counselors.
              </p>
              <a
                href="https://wa.me/923395066625?text=Assalam%20o%20Alaikum!%20I%20visited%20Dakhala%20Admissions%20Portal%20and%20need%20guidance%20regarding%20university%20admissions.%20Please%20assist%20me."
                onClick={() => logAction('whatsapp_click')}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#1DA851] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl transition-all w-full justify-center shadow-lg active:scale-[0.98]"
              >
                {/* WhatsApp SVG Icon */}
                <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6 object-contain" />
                Help on WhatsApp
              </a>
            </div>
          </div>

          <div className="max-w-[1280px] mx-auto border-t border-white/10 pt-8 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 text-xs text-white/40 font-medium select-none">
            <div>
              <p className="font-semibold text-white/60 mb-1"><span className="font-elmessiri">داخلہ</span> — Dakhala Admissions Portal Pakistan</p>
              <p className="mb-3">© 2026 Dakhala. All Rights Reserved. Standardized HEC & IBCC metrics.</p>
              <p className="text-[12px] text-white/50 uppercase tracking-[0.1em] font-bold inline-flex flex-wrap items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 rounded-lg shadow-lg">
                Developed by{' '}
                <a 
                  href="https://xost.pro" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-gold hover:text-white transition-all duration-300 hover:scale-[1.03] group"
                >
                  <img 
                    src="/companyLogo/WhatsApp%20Image%202026-06-26%20at%207.44.32%20PM.jpeg" 
                    alt="XOST Logo" 
                    className="h-6 w-auto object-contain bg-white rounded px-1.5 py-0.5 border border-white/20 shadow-md transition-shadow group-hover:shadow-[0_0_10px_rgba(218,165,32,0.35)]"
                  />
                  <span className="font-extrabold text-[15px] tracking-wider text-gold group-hover:text-white drop-shadow-[0_0_6px_rgba(218,165,32,0.35)]">
                    XOST
                  </span>
                </a>
                <span className="text-white/20">|</span>
                <a 
                  href="https://xost.pro" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/60 hover:text-gold transition-colors font-semibold"
                >
                  xost.pro
                </a>
              </p>
            </div>
            <div className="max-w-md md:text-right text-[11px] text-white/30 leading-relaxed">
              Disclaimer: Aggregates and equivalence outputs are estimations based on past data and official university and IBCC formulas. Always verify cutoffs with the respective universities before final submission.
            </div>
          </div>
        </footer>
      </div>
    </Router>
    </HelmetProvider>
  );
}
