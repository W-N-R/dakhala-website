import React from 'react';
import { 
  Moon, Sun, Type, Contrast, Palette, Eye, 
  Link2, Ruler, MousePointer, Activity, RefreshCw 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const ToggleSwitch = ({ label, description, icon: Icon, value, onChange }) => (
  <div className="flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-3 rounded-2xl transition-all duration-300 hover:border-gold/30">
    <div className="flex gap-2.5 items-start">
      <div className="p-2 bg-gold/10 dark:bg-gold/5 rounded-xl shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gold" />
      </div>
      <div>
        <p className="font-bold text-xs text-ink dark:text-gray-200">{label}</p>
        <p className="text-[10px] text-muted dark:text-gray-400 mt-0.5 leading-tight">{description}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex items-center shrink-0 ${
        value ? 'bg-gold' : 'bg-gray-300 dark:bg-gray-700'
      }`}
    >
      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

export default function AccessibilityPanel() {
  const { 
    theme, setTheme,
    textSize, setTextSize,
    dyslexiaFont, setDyslexiaFont,
    highContrast, setHighContrast,
    monochrome, setMonochrome,
    invertColors, setInvertColors,
    readingGuide, setReadingGuide,
    highlightLinks, setHighlightLinks,
    largeCursor, setLargeCursor,
    pauseAnimations, setPauseAnimations,
    textSpacing, setTextSpacing,
    resetAccessibility
  } = useAppStore();

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-col space-y-6">
      
      {/* ─── Category: Core Theme & Size ─── */}
      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-widest font-black text-muted dark:text-gray-400">Core Adjustments</h3>
        
        {/* Dark Mode */}
        <div className="flex flex-col space-y-2">
          <label className="text-[11px] font-bold text-muted dark:text-gray-400">Appearance Mode</label>
          <button
            onClick={handleThemeToggle}
            className="flex items-center justify-between p-3 rounded-2xl border border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.05] transition-all hover:border-gold/30"
          >
            <span className="text-ink dark:text-cloudy text-xs font-bold flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-gold" /> : <Sun className="w-4 h-4 text-gold" />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-gold' : 'bg-gray-300 dark:bg-gray-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>

        {/* Text Size Slider */}
        <div className="flex flex-col space-y-2">
          <label className="text-[11px] font-bold text-muted dark:text-gray-400">Text Scaling</label>
          <div className="flex items-center gap-4 p-3 rounded-2xl border border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
            <Type className="w-4 h-4 text-gold" />
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="1"
              value={textSize === 'normal' ? 1 : textSize === 'large' ? 2 : 3}
              onChange={(e) => {
                const val = e.target.value;
                setTextSize(val === '1' ? 'normal' : val === '2' ? 'large' : 'xlarge');
              }}
              className="flex-1 accent-gold cursor-pointer"
            />
            <Type className="w-6 h-6 text-gold" />
          </div>
          <p className="text-[10px] text-muted dark:text-gray-400">
            Current Scale: <span className="capitalize font-extrabold text-gold">{textSize}</span>
          </p>
        </div>
      </div>

      {/* ─── Category: Colors & Contrast ─── */}
      <div className="space-y-3.5">
        <h3 className="text-[10px] uppercase tracking-widest font-black text-muted dark:text-gray-400">Visual Aids</h3>

        <ToggleSwitch 
          label="High Contrast" 
          description="Boost contrast and color saturation" 
          icon={Contrast} 
          value={highContrast} 
          onChange={setHighContrast} 
        />

        <ToggleSwitch 
          label="Monochrome Mode" 
          description="Grayscale colors for colorblindness" 
          icon={Palette} 
          value={monochrome} 
          onChange={setMonochrome} 
        />

        <ToggleSwitch 
          label="Invert Colors" 
          description="Reverse colors for light sensitivity" 
          icon={Eye} 
          value={invertColors} 
          onChange={setInvertColors} 
        />

        <ToggleSwitch 
          label="Dyslexia Font" 
          description="Use highly legible weighted font" 
          icon={Type} 
          value={dyslexiaFont} 
          onChange={setDyslexiaFont} 
        />

        <ToggleSwitch 
          label="Highlight Links" 
          description="Add outlines and high contrast to links" 
          icon={Link2} 
          value={highlightLinks} 
          onChange={setHighlightLinks} 
        />

        <ToggleSwitch 
          label="Extended Letter Spacing" 
          description="Increase space between words & characters" 
          icon={Type} 
          value={textSpacing} 
          onChange={setTextSpacing} 
        />
      </div>

      {/* ─── Category: Navigation & Focus ─── */}
      <div className="space-y-3.5">
        <h3 className="text-[10px] uppercase tracking-widest font-black text-muted dark:text-gray-400">Assistance Tools</h3>

        <ToggleSwitch 
          label="Reading Ruler" 
          description="Horizontal line tracking mouse pointer" 
          icon={Ruler} 
          value={readingGuide} 
          onChange={setReadingGuide} 
        />

        <ToggleSwitch 
          label="Large Cursor" 
          description="Upgrade to a high visibility cursor" 
          icon={MousePointer} 
          value={largeCursor} 
          onChange={setLargeCursor} 
        />

        <ToggleSwitch 
          label="Pause Animations" 
          description="Stop movement & reduce motion strain" 
          icon={Activity} 
          value={pauseAnimations} 
          onChange={setPauseAnimations} 
        />
      </div>

      {/* ─── Reset Button ─── */}
      <button
        onClick={resetAccessibility}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-500/10 dark:bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/40 text-rose-500 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all mt-4"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Reset to Defaults
      </button>

    </div>
  );
}
