// Telemetry and Real-Time Analytics Database for Dakhala
// Tracks page views, actions, calculations, and conversions in real-time.

const VISITS_KEY = 'dakhala_telemetry_visits';
const CALCS_KEY = 'dakhala_telemetry_calcs';
const ACTIONS_KEY = 'dakhala_telemetry_actions';

// Generate a random visitor ID if not exists
const getVisitorId = () => {
  let id = localStorage.getItem('dakhala_telemetry_visitor_id');
  if (!id) {
    id = 'visitor_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('dakhala_telemetry_visitor_id', id);
  }
  return id;
};

// Seed realistic historical data for the past 7 days if the DB is empty
const seedHistoricalData = () => {
  const visitorId = getVisitorId();
  
  if (!localStorage.getItem(VISITS_KEY)) {
    const visits = [];
    const now = new Date();
    
    // Seed visits for past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = date.toDateString();
      
      // Seed between 40 and 120 unique visits per day
      const dailyCount = Math.floor(Math.random() * 80) + 40;
      for (let j = 0; j < dailyCount; j++) {
        const hour = Math.floor(Math.random() * 24);
        const visitTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, Math.floor(Math.random() * 60));
        
        visits.push({
          id: 'visit_' + Math.random().toString(36).substring(2, 9),
          visitorId: 'visitor_seed_' + Math.floor(Math.random() * 200),
          path: ['/', '/calculator/university', '/compare', '/recommend', '/admission-guide', '/entry-tests/ecat'][Math.floor(Math.random() * 6)],
          timestamp: visitTime.toISOString(),
          day: dayStr
        });
      }
    }
    
    // Add current session's initial view
    visits.push({
      id: 'visit_' + Math.random().toString(36).substring(2, 9),
      visitorId,
      path: window.location.pathname,
      timestamp: now.toISOString(),
      day: now.toDateString()
    });
    
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  }

  if (!localStorage.getItem(CALCS_KEY)) {
    const calcs = [];
    const now = new Date();
    
    // Seed calculations for the past 7 days
    const unis = ['nust', 'fast', 'uet-lahore', 'giki', 'lums', 'pieas', 'ned', 'comsats'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // 10 to 30 calculations per day
      const dailyCount = Math.floor(Math.random() * 20) + 10;
      for (let j = 0; j < dailyCount; j++) {
        const hour = Math.floor(Math.random() * 24);
        const calcTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, Math.floor(Math.random() * 60));
        
        // Random score aggregates clustered around standard merit ranges (65% to 85%)
        const u = 75; // mean
        const s = 8;  // standard deviation
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const aggregate = Math.round((z * s + u) * 100) / 100;
        
        calcs.push({
          id: 'calc_' + Math.random().toString(36).substring(2, 9),
          visitorId: 'visitor_seed_' + Math.floor(Math.random() * 200),
          uniId: unis[Math.floor(Math.random() * unis.length)],
          aggregate: Math.min(100, Math.max(10, aggregate)),
          timestamp: calcTime.toISOString()
        });
      }
    }
    
    localStorage.setItem(CALCS_KEY, JSON.stringify(calcs));
  }

  if (!localStorage.getItem(ACTIONS_KEY)) {
    const actions = [];
    const now = new Date();
    
    // Seed clicks and shares
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // WhatsApp counseling clicks (5 to 15 per day)
      const waCount = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < waCount; j++) {
        actions.push({
          name: 'whatsapp_click',
          visitorId: 'visitor_seed_' + Math.floor(Math.random() * 200),
          timestamp: new Date(date.getTime() + Math.random() * 86400000).toISOString()
        });
      }
      
      // Link shares (2 to 8 per day)
      const shareCount = Math.floor(Math.random() * 6) + 2;
      for (let j = 0; j < shareCount; j++) {
        actions.push({
          name: 'share_click',
          visitorId: 'visitor_seed_' + Math.floor(Math.random() * 200),
          timestamp: new Date(date.getTime() + Math.random() * 86400000).toISOString()
        });
      }
    }
    localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
  }
};

// Seed immediately on import
seedHistoricalData();

export const logPageView = (path) => {
  try {
    const visits = JSON.parse(localStorage.getItem(VISITS_KEY) || '[]');
    const now = new Date();
    
    visits.push({
      id: 'visit_' + Math.random().toString(36).substring(2, 9),
      visitorId: getVisitorId(),
      path,
      timestamp: now.toISOString(),
      day: now.toDateString()
    });
    
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch (e) {
    console.error("Telemetry error logging page view", e);
  }
};

export const logCalculation = (uniId, aggregate) => {
  try {
    const calcs = JSON.parse(localStorage.getItem(CALCS_KEY) || '[]');
    calcs.push({
      id: 'calc_' + Math.random().toString(36).substring(2, 9),
      visitorId: getVisitorId(),
      uniId,
      aggregate: parseFloat(aggregate),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(CALCS_KEY, JSON.stringify(calcs));
  } catch (e) {
    console.error("Telemetry error logging calculation", e);
  }
};

export const logAction = (name, details = {}) => {
  try {
    const actions = JSON.parse(localStorage.getItem(ACTIONS_KEY) || '[]');
    actions.push({
      name,
      visitorId: getVisitorId(),
      timestamp: new Date().toISOString(),
      ...details
    });
    localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
  } catch (e) {
    console.error("Telemetry error logging action", e);
  }
};

// Statistical & Analytical Helpers for Admin Dashboard
export const getAnalyticsSummary = () => {
  const visits = JSON.parse(localStorage.getItem(VISITS_KEY) || '[]');
  const calcs = JSON.parse(localStorage.getItem(CALCS_KEY) || '[]');
  const actions = JSON.parse(localStorage.getItem(ACTIONS_KEY) || '[]');
  
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
    // Mean
    const sum = scores.reduce((a, b) => a + b, 0);
    mean = Math.round((sum / scores.length) * 100) / 100;
    
    // Median
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 100) / 100;
    
    // Standard Deviation
    const sqDiffs = scores.map(s => Math.pow(s - mean, 2));
    const avgSqDiff = sqDiffs.reduce((a, b) => a + b, 0) / scores.length;
    stdDev = Math.round(Math.sqrt(avgSqDiff) * 100) / 100;
  }

  // Daily Reach Trend (past 7 days)
  const dailyReach = {};
  const dailyCalcs = {};
  const last7Days = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStr = d.toDateString();
    // Human readable day label (e.g. Jun 26)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    last7Days.push({ dateStr: dayStr, label });
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

  const reachTrend = last7Days.map(day => ({
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

  // Normal distribution curve points (aggregate scores distribution density)
  const pdfData = [];
  if (scores.length > 3) {
    const min = Math.max(10, Math.floor(mean - 3 * stdDev));
    const max = Math.min(100, Math.ceil(mean + 3 * stdDev));
    
    // Create 15 intervals
    const step = (max - min) / 15;
    for (let val = min; val <= max; val += step) {
      // Normal probability density function formula
      const exponent = -Math.pow(val - mean, 2) / (2 * Math.pow(stdDev, 2));
      const density = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      pdfData.push({
        score: Math.round(val),
        density: parseFloat((density * 100).toFixed(4)) // scale for visualization
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
    recentLogs: visits.slice(-8).reverse() // past 8 real-time events
  };
};
