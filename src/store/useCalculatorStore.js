import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCalculatorStore = create(
  persist(
    (set) => ({
      matricObt: '',
      matricTotal: '1100',
      fscObt: '',
      fscTotal: '1100',
      targetPath: 'Medical',

      setMatricObt: (val) => set({ matricObt: val }),
      setMatricTotal: (val) => set({ matricTotal: val }),
      setFscObt: (val) => set({ fscObt: val }),
      setFscTotal: (val) => set({ fscTotal: val }),
      setTargetPath: (val) => set({ targetPath: val }),
    }),
    {
      name: 'dakhala-calculator-storage', // name of the item in the storage (must be unique)
    }
  )
);
