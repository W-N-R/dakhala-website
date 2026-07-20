import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { publicUniversities, privateUniversities, semiGovtUniversities } from '../data/universities';

const allStaticUniversities = [...publicUniversities, ...privateUniversities, ...semiGovtUniversities];

export const useDataStore = create((set) => ({
  universities: allStaticUniversities, // Fallback to all static data
  dates: [],
  loading: true,
  fetchData: async () => {
    if (!db) {
      set({ loading: false });
      return;
    }
    try {
      const unisSnap = await getDocs(collection(db, 'universities'));
      const datesSnap = await getDocs(collection(db, 'important_dates'));
      
      let firestoreUnis = unisSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Merge: For each static university, if a firestore doc exists, cleanly merge it over the static data.
      let unis = allStaticUniversities.map(staticUni => {
        const cloudUni = firestoreUnis.find(u => u.id === staticUni.id);
        if (cloudUni) {
          // Deep merge meritData specifically
          let mergedMeritData = { ...(staticUni.meritData || {}), ...(cloudUni.meritData || {}) };
          if (staticUni.meritData?.campuses || cloudUni.meritData?.campuses) {
            mergedMeritData.campuses = JSON.parse(JSON.stringify(staticUni.meritData?.campuses || {}));
            const cloudCampuses = cloudUni.meritData?.campuses || {};
            
            Object.keys(cloudCampuses).forEach(campus => {
              if (!mergedMeritData.campuses[campus]) {
                mergedMeritData.campuses[campus] = cloudCampuses[campus];
              } else {
                Object.keys(cloudCampuses[campus]).forEach(prog => {
                  mergedMeritData.campuses[campus][prog] = {
                    ...(mergedMeritData.campuses[campus][prog] || {}),
                    ...cloudCampuses[campus][prog]
                  };
                });
              }
            });
          }
          return { ...staticUni, ...cloudUni, meritData: mergedMeritData };
        }
        return staticUni;
      });

      // We use the Firestore document ID to allow deleting/editing
      const dates = datesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      set({ universities: unis, dates, loading: false });
    } catch (e) {
      console.error("Error fetching global data", e);
      set({ loading: false });
    }
  },
  updateUniversity: async (id, updates) => {
    if (!db) return;
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'universities', id), updates, { merge: true });
      set((state) => ({
        universities: state.universities.map(u => 
          u.id === id ? { ...u, ...updates } : u
        )
      }));
    } catch (e) {
      console.error("Failed to update university", e);
    }
  }
}));
