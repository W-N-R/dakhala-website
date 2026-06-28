import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'light',
      aquaTheme: 'light',
      textSize: 'normal',
      dyslexiaFont: false,
      highContrast: false,
      monochrome: false,
      invertColors: false,
      readingGuide: false,
      highlightLinks: false,
      largeCursor: false,
      pauseAnimations: false,
      textSpacing: false,
      setTheme: (theme) => set({ theme }),
      setAquaTheme: (aquaTheme) => set({ aquaTheme }),
      setTextSize: (textSize) => set({ textSize }),
      setDyslexiaFont: (dyslexiaFont) => set({ dyslexiaFont }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setMonochrome: (monochrome) => set({ monochrome }),
      setInvertColors: (invertColors) => set({ invertColors }),
      setReadingGuide: (readingGuide) => set({ readingGuide }),
      setHighlightLinks: (highlightLinks) => set({ highlightLinks }),
      setLargeCursor: (largeCursor) => set({ largeCursor }),
      setPauseAnimations: (pauseAnimations) => set({ pauseAnimations }),
      setTextSpacing: (textSpacing) => set({ textSpacing }),
      resetAccessibility: () => set({
        dyslexiaFont: false,
        highContrast: false,
        monochrome: false,
        invertColors: false,
        readingGuide: false,
        highlightLinks: false,
        largeCursor: false,
        pauseAnimations: false,
        textSpacing: false,
      }),
    }),
    {
      name: 'dakhala-app-settings',
    }
  )
);
