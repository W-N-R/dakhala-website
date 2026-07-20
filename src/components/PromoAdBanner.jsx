import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Sparkles, MessageSquare, Code, GraduationCap } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useLocation } from 'react-router-dom';
import { logAction } from '../lib/telemetry';

const PROMO_ADS = [
  {
    id: 'wuhs',
    tagline: 'WUHS PREP ACADEMY',
    title: 'Crack NET, ECAT & MDCAT with 95% Success Rate',
    desc: 'Access video lectures, past papers, live test sessions, and HEC standard prep tools.',
    actionText: 'Join Academy',
    url: 'https://wa.me/923395066625?text=Assalam%20o%20Alaikum!%20I%20visited%20Dakhala%20Admissions%20Portal%20and%20need%20guidance%20regarding%20university%20admissions.%20Please%20assist%20me.',
    icon: GraduationCap,
    colorClasses: 'from-amber-500 to-orange-600',
    accentColor: '#F59E0B'
  },
  {
    id: 'xost',
    tagline: 'XOST WEB & UI SERVICES',
    title: 'Need a Premium Website, App or UI/UX Design?',
    desc: 'Get custom development and state-of-the-art designs by the creators of Dakhala.',
    actionText: 'Hire XOST Developers',
    url: 'https://xost.pro',
    icon: Code,
    colorClasses: 'from-blue-600 to-indigo-700',
    accentColor: '#3B82F6'
  },
  {
    id: 'counseling',
    tagline: 'DAKHALA PREMIUM ADVISORY',
    title: 'Struggling with Aggregate calculations or Equivalence?',
    desc: 'Book a 1-on-1 counseling session on WhatsApp with HEC & IBCC experts.',
    actionText: 'Chat on WhatsApp',
    url: 'https://wa.me/923395066625?text=Assalam%20o%20Alaikum!%20I%20visited%20Dakhala%20Admissions%20Portal%20and%20need%20guidance%20regarding%20university%20admissions.%20Please%20assist%20me.',
    icon: MessageSquare,
    colorClasses: 'from-emerald-500 to-teal-600',
    accentColor: '#10B981'
  }
];

export default function PromoAdBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const closedTime = sessionStorage.getItem('dakhala-ad-closed-time');
    if (closedTime && Date.now() - parseInt(closedTime, 10) < 60000) { // 1 minute cooldown
      return;
    }
    // Show the ad overlay on every route change (tab / sub-tab navigation)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);
    // Cycle index for variety
    setCurrentIndex((prev) => (prev + 1) % PROMO_ADS.length);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Rotate ads every 10 seconds
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_ADS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('dakhala-ad-closed-time', Date.now().toString());
  };

  if (!isVisible) return null;

  const ad = PROMO_ADS[currentIndex];
  const IconComponent = ad.icon;

  return (
    <div className="fixed inset-0 bg-[#0D1B2A]/98 dark:bg-black/98 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.01} transitionSpeed={2000} className="w-full max-w-sm">
        <div className="relative overflow-hidden bg-white/95 dark:bg-[#0A1224]/95 border border-[#9BD7D2]/40 dark:border-white/10 rounded-3xl p-6 shadow-[0_15px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.7)] flex flex-col space-y-4">
          
          {/* Glowing gradient aura in background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 dark:bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Styled Cancel button positioned absolutely on the card's top-right */}
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg border border-white/20 hover:scale-110 focus:outline-none z-10"
            title="Close Ad"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header row */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-muted dark:text-gray-400 uppercase">
              <Sparkles className="w-3 h-3 text-gold" /> Sponsored Link
            </span>
          </div>

          {/* Ad content body */}
          <div className="flex gap-3.5 items-start">
            <div className={`p-2.5 rounded-xl text-white bg-gradient-to-br ${ad.colorClasses} shrink-0 shadow-md`}>
              <IconComponent className="w-5 h-5" />
            </div>
            
            <div className="space-y-1 overflow-hidden">
              <h4 className="text-[10px] font-black text-gold dark:text-gold uppercase tracking-wider">{ad.tagline}</h4>
              <h3 className="text-xs font-bold text-ink dark:text-white leading-snug">{ad.title}</h3>
              <p className="text-[11px] text-muted dark:text-gray-400 leading-normal line-clamp-2 font-medium">{ad.desc}</p>
            </div>
          </div>

          {/* Call-to-action button */}
          <a
            href={ad.url}
            onClick={() => {
              if (ad.url.includes('wa.me')) {
                logAction('whatsapp_click');
              } else {
                logAction('promo_click', { adId: ad.id });
              }
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-ink hover:bg-gold text-white dark:bg-white/10 dark:hover:bg-gold dark:text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-sm"
          >
            <span>{ad.actionText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Skip button / link */}
          <button 
            onClick={handleClose}
            className="text-center text-xs text-muted hover:text-ink dark:hover:text-white cursor-pointer transition-colors pt-2 underline focus:outline-none w-full font-bold font-sans"
          >
            Skip Advertisement & Continue to Dakhala
          </button>

        </div>
      </Tilt>
    </div>
  );
}
