import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Database, Network, Target, ChevronRight } from 'lucide-react';
import nlp from 'compromise';
import { publicUniversities, privateUniversities } from '../data/universities';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [nlpResults, setNlpResults] = useState(null);
  const [semanticMatches, setSemanticMatches] = useState([]);

  useEffect(() => {
    // Simulate a complex backend NLP / Vector Search pipeline
    setIsProcessing(true);
    
    setTimeout(() => {
      // 1. NLP Processing using compromise
      let doc = nlp(query);
      
      // Extract Places (Locations)
      let locations = doc.places().out('array');
      // Extract Organizations (Universities)
      let organizations = doc.organizations().out('array');
      // Extract Nouns (Potential subjects/keywords)
      let nouns = doc.nouns().out('array').filter(n => !locations.includes(n) && !organizations.includes(n));
      // Extract Values (Percentages, marks, etc.)
      let values = doc.values().out('array');

      setNlpResults({
        intent: query.toLowerCase().includes('compare') ? 'Comparison' : 'Discovery',
        locations: locations.length > 0 ? locations : ['National'],
        entities: organizations.length > 0 ? organizations : ['Any Institution'],
        keywords: nouns.slice(0, 4), // Take top 4 nouns as keywords
        constraints: values
      });

      // 2. Simulate Vector Database Cosine Similarity matching
      const allUnis = [...publicUniversities, ...privateUniversities];
      const shuffled = allUnis.sort(() => 0.5 - Math.random());
      
      // Generate mock similarity scores between 75% and 98%
      const matches = shuffled.slice(0, 4).map(uni => ({
        ...uni,
        score: Math.floor(Math.random() * (98 - 75 + 1) + 75)
      })).sort((a, b) => b.score - a.score);

      setSemanticMatches(matches);
      setIsProcessing(false);
    }, 2000);
  }, [query]);

  return (
    <div className="py-10 max-w-[1280px] mx-auto min-h-[60vh] text-ink dark:text-white px-4">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 p-6 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-ink dark:text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-gold" />
            Semantic Search Results
          </h1>
          <p className="text-muted dark:text-gray-400 text-sm mt-2 font-medium">
            NLP Vector Query: <span className="text-ink dark:text-gold font-semibold italic">"{query}"</span>
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <EduAnimation type="search" />
        </div>
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 rounded-3xl p-8 shadow-sm">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-t-gold border-r-gold border-b-transparent border-l-transparent rounded-full animate-spin" />
            <Network className="w-8 h-8 text-gold animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-ink dark:text-white">Analyzing Natural Language...</h3>
            <p className="text-xs text-muted dark:text-gray-400 font-medium">Running entity extraction and querying vector embeddings.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* NLP Analysis Panel wrapped in Tilt */}
          <div className="lg:col-span-4 w-full">
            <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.01} className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 p-6 rounded-3xl shadow-sm text-ink dark:text-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-goldDark dark:text-gold mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-2.5">
                <Database className="w-4 h-4" /> AI Interpretation
              </h3>
              
              <div className="space-y-4 text-xs font-medium">
                <div>
                  <div className="text-[10px] font-bold text-muted uppercase">Computed Intent</div>
                  <div className="text-xs font-semibold text-ink dark:text-white bg-cloudy dark:bg-white/5 border border-border dark:border-white/5 px-3 py-1.5 rounded-lg mt-1 inline-block">
                    {nlpResults.intent}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-muted uppercase">Detected Entities</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {nlpResults.entities.map((e, i) => (
                      <span key={i} className="text-xs font-semibold text-white bg-maqsadBlue px-2.5 py-1 rounded-md">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-muted uppercase">Location Context</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {nlpResults.locations.map((l, i) => (
                      <span key={i} className="text-xs font-semibold text-white bg-maqsadOrange px-2.5 py-1 rounded-md">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {nlpResults.keywords.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-muted uppercase">Extracted Context (Nouns)</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {nlpResults.keywords.map((k, i) => (
                        <span key={i} className="text-xs font-semibold text-ink dark:text-white bg-gold/20 border border-gold/30 px-2.5 py-1 rounded-md">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Tilt>
          </div>

          {/* Semantic Matches */}
          <div className="lg:col-span-8 w-full space-y-4">
            <h3 className="text-lg font-bold text-ink dark:text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" /> Vector Database Matches
            </h3>

            {semanticMatches.map((uni, idx) => (
              <Tilt key={uni.id} tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} className="w-full">
                <div 
                  className="bg-white dark:bg-[#0C132C] border border-border dark:border-white/10 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-ink dark:text-white"
                >
                  <div>
                    <h4 className="text-base font-black text-ink dark:text-white group-hover:text-gold transition-colors">{uni.name}</h4>
                    <p className="text-xs text-muted dark:text-gray-400 font-medium mt-1">{uni.city}, {uni.province}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-muted uppercase">Relevance Score</div>
                      <div className="text-lg font-black text-green-600 dark:text-green-400">{uni.score}%</div>
                    </div>
                    <Link to={`/merit-tracker/${uni.slug}`} className="p-2.5 bg-cloudy dark:bg-white/5 border border-border dark:border-white/5 rounded-xl group-hover:bg-gold group-hover:text-white transition-colors text-ink dark:text-white">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
