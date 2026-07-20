import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const getVisitorId = () => {
  let id = localStorage.getItem('dakhala_telemetry_visitor_id');
  if (!id) {
    id = 'visitor_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('dakhala_telemetry_visitor_id', id);
  }
  return id;
};

export const logPageView = async (path) => {
  if (!db) return;
  try {
    const now = new Date();
    await addDoc(collection(db, 'analytics_visits'), {
      visitorId: getVisitorId(),
      path,
      timestamp: now.toISOString(),
      day: now.toDateString()
    });
  } catch (e) {
    console.error("Telemetry error logging page view", e);
  }
};

export const logCalculation = async (uniId, aggregate) => {
  if (!db) return;
  try {
    await addDoc(collection(db, 'analytics_calcs'), {
      visitorId: getVisitorId(),
      uniId,
      aggregate: parseFloat(aggregate),
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error("Telemetry error logging calculation", e);
  }
};

export const logAction = async (name, details = {}) => {
  if (!db) return;
  try {
    await addDoc(collection(db, 'analytics_actions'), {
      name,
      visitorId: getVisitorId(),
      timestamp: new Date().toISOString(),
      ...details
    });
  } catch (e) {
    console.error("Telemetry error logging action", e);
  }
};

// Statistical & Analytical Helpers for Admin Dashboard
export const getAnalyticsSummary = async () => {
  if (!db) return null;
  
  try {
    const visitsSnap = await getDocs(collection(db, 'analytics_visits'));
    const calcsSnap = await getDocs(collection(db, 'analytics_calcs'));
    const actionsSnap = await getDocs(collection(db, 'analytics_actions'));

    const visits = visitsSnap.docs.map(d => d.data());
    const calcs = calcsSnap.docs.map(d => d.data());
    const actions = actionsSnap.docs.map(d => d.data());

    const totalViews = visits.length;
    const uniqueVisitors = new Set(visits.map(v => v.visitorId)).size;
    const totalCalcs = calcs.length;
    
    const waClicks = actions.filter(a => a.name === 'whatsapp_click').length;
    const shareClicks = actions.filter(a => a.name === 'share_click').length;

    // Calculators conversion rate
    const conversionRate = totalViews > 0 ? ((totalCalcs / totalViews) * 100).toFixed(2) : 0;
    
    // Calculate distribution statistics for calculations
    const scores = calcs.map(c => c.aggregate);
    let mean = 0;
    let median = 0;
    let stdDev = 0;
    
    if (scores.length > 0) {
      const sum = scores.reduce((a, b) => a + b, 0);
      mean = Math.round((sum / scores.length) * 100) / 100;
      
      const sorted = [...scores].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 100) / 100;
      
      const sqDiffs = scores.map(s => Math.pow(s - mean, 2));
      const avgSqDiff = sqDiffs.reduce((a, b) => a + b, 0) / scores.length;
      stdDev = Math.round(Math.sqrt(avgSqDiff) * 100) / 100;
    }

    // Daily Reach Trend (past 30 days)
    const dailyReach = {};
    const dailyCalcs = {};
    const trendDays = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toDateString();
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendDays.push({ dateStr: dayStr, label });
      dailyReach[dayStr] = 0;
      dailyCalcs[dayStr] = 0;
    }

    visits.forEach(v => {
      const day = new Date(v.timestamp).toDateString();
      if (day in dailyReach) {
        dailyReach[day]++;
      }
    });

    calcs.forEach(c => {
      const day = new Date(c.timestamp).toDateString();
      if (day in dailyCalcs) {
        dailyCalcs[day]++;
      }
    });

    const reachTrend = trendDays.map(day => ({
      name: day.label,
      views: dailyReach[day.dateStr] || 0,
      calculations: dailyCalcs[day.dateStr] || 0
    }));

    // Popular calculators
    const uniCounts = {};
    calcs.forEach(c => {
      uniCounts[c.uniId] = (uniCounts[c.uniId] || 0) + 1;
    });
    const popularUnis = Object.entries(uniCounts)
      .map(([id, count]) => ({ name: id.toUpperCase(), calculations: count }))
      .sort((a, b) => b.calculations - a.calculations)
      .slice(0, 5);

    // Normal distribution curve points
    const pdfData = [];
    if (scores.length > 3) {
      const min = Math.max(10, Math.floor(mean - 3 * stdDev));
      const max = Math.min(100, Math.ceil(mean + 3 * stdDev));
      
      const step = (max - min) / 15;
      for (let val = min; val <= max; val += step) {
        const exponent = -Math.pow(val - mean, 2) / (2 * Math.pow(stdDev, 2));
        const density = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
        pdfData.push({
          score: Math.round(val),
          density: parseFloat((density * 100).toFixed(4))
        });
      }
    }

    return {
      totalViews,
      uniqueVisitors,
      totalCalcs,
      waClicks,
      shareClicks,
      conversionRate,
      stats: { mean, median, stdDev },
      reachTrend,
      popularUnis,
      pdfData,
      recentLogs: visits.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8)
    };
  } catch (error) {
    console.error("Error fetching analytics", error);
    return null;
  }
};
