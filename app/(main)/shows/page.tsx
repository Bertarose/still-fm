'use client';

import { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';

export default function ShowsPage() {
  const { playShow } = usePlayer();

  const [allShows, setAllShows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedResident, setSelectedResident] = useState<string>('ALL');
  const [selectedStyle, setSelectedStyle] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  // Fetch depuis Mixcloud API
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=100');
        const data = await res.json();
        
        const formatted = data.data.map((show: any) => {
          const title = show.name.toLowerCase();
          let resident = 'VARIOUS';
          
          if (title.includes('poser')) resident = 'DJ POSER';
          else if (title.includes('shadow') || title.includes('bass therapy')) resident = 'SHADOW BASS';
          else if (title.includes('neon') || title.includes('pulse')) resident = 'NEON PULSE';
          else if (title.includes('void') || title.includes('rider')) resident = 'VOID RIDER';
          else if (title.includes('echo') || title.includes('drift')) resident = 'ECHO DRIFT';
          else if (title.includes('dark') || title.includes('matter')) resident = 'DARK MATTER';
          else if (title.includes('cosmic') || title.includes('noise')) resident = 'COSMIC NOISE';
          
          let style = 'ELECTRONIC';
          if (show.tags && show.tags.length > 0) {
            const tag = show.tags[0].name.toLowerCase();
            if (tag.includes('techno')) style = 'TECHNO';
            else if (tag.includes('house')) style = 'HOUSE';
            else if (tag.includes('drum') || tag.includes('bass') || tag.includes('dnb')) style = 'DRUM & BASS';
            else if (tag.includes('ambient')) style = 'AMBIENT';
            else if (tag.includes('industrial')) style = 'INDUSTRIAL';
            else if (tag.includes('electro')) style = 'ELECTRO';
            else if (tag.includes('dubstep')) style = 'DUBSTEP';
            else style = tag.toUpperCase();
          }
          
          const date = new Date(show.created_time);
          const month = date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }).toUpperCase();
          
          return {
            key: show.key,
            name: show.name,
            resident,
            style,
            date: show.created_time,
            month,
            img: show.pictures?.extra_large || show.pictures?.large,
            url: show.url
          };
        });
        
        setAllShows(formatted);
        setIsLoading(false);
      } catch (e) {
        console.error('Error fetching shows:', e);
        setIsLoading(false);
      }
    };
    
    fetchShows();
  }, []);

  const residents = ['ALL', ...Array.from(new Set(allShows.map(s => s.resident))).sort()];
  const styles = ['ALL', ...Array.from(new Set(allShows.map(s => s.style))).sort()];
  const months = ['ALL', ...Array.from(new Set(allShows.map(s => s.month))).sort().reverse()];

  const filteredShows = allShows.filter(show => {
    const matchResident = selectedResident === 'ALL' || show.resident === selectedResident;
    const matchStyle = selectedStyle === 'ALL' || show.style === selectedStyle;
    const matchMonth = selectedMonth === 'ALL' || show.month === selectedMonth;
    return matchResident && matchStyle && matchMonth;
  });

  const resetFilters = () => {
    setSelectedResident('ALL');
    setSelectedStyle('ALL');
    setSelectedMonth('ALL');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl uppercase tracking-wider mb-2 animate-pulse">
            Loading Shows...
          </div>
          <div className="text-xs opacity-50">Fetching from Mixcloud</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black pb-12">
      
      <div className="crt-screen" />
      
      <main className="max-w-full">
        
        {/* Header + Filtres compacts sur une ligne */}
        <div className="border-b border-white px-4 py-3">
          
          {/* Première ligne : Titre + Reset */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base md:text-xl font-bold uppercase tracking-wider">
              Shows ({filteredShows.length})
            </h1>
            
            {(selectedResident !== 'ALL' || selectedStyle !== 'ALL' || selectedMonth !== 'ALL') && (
              <button
                onClick={resetFilters}
                className="text-[9px] md:text-xs uppercase tracking-wider px-3 py-1 border border-white hover:bg-white hover:text-black transition-all"
              >
                Reset
              </button>
            )}
          </div>

          {/* Deuxième ligne : 3 filtres minimalistes */}
          <div className="grid grid-cols-3 gap-2">
            
            <select
              value={selectedResident}
              onChange={(e) => setSelectedResident(e.target.value)}
              className="w-full bg-black border border-white px-2 py-1 text-[10px] md:text-xs uppercase cursor-pointer hover:bg-white hover:text-black transition-all"
            >
              <option value="ALL">All Residents</option>
              {residents.filter(r => r !== 'ALL').map(resident => (
                <option key={resident} value={resident}>
                  {resident}
                </option>
              ))}
            </select>

            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-black border border-white px-2 py-1 text-[10px] md:text-xs uppercase cursor-pointer hover:bg-white hover:text-black transition-all"
            >
              <option value="ALL">All Styles</option>
              {styles.filter(s => s !== 'ALL').map(style => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-black border border-white px-2 py-1 text-[10px] md:text-xs uppercase cursor-pointer hover:bg-white hover:text-black transition-all"
            >
              <option value="ALL">All Months</option>
              {months.filter(m => m !== 'ALL').map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filteredShows.map((show, idx) => (
            <div 
              key={idx}
              className="border-b border-r border-white group cursor-pointer"
              onClick={() => playShow(show)}
            >
              <div className="aspect-square relative overflow-hidden bg-black">
                <img 
                  src={show.img}
                  alt={show.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-xs font-bold uppercase leading-tight mb-1 line-clamp-2">
                  {show.name}
                </h3>
                
                <div className="text-[9px] uppercase opacity-50 mb-1">
                  {show.resident}
                </div>

                <div className="flex items-center justify-between text-[8px] uppercase opacity-40">
                  <span>{show.style}</span>
                  <span>{new Date(show.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShows.length === 0 && (
          <div className="border-b border-white p-12 text-center">
            <p className="text-sm uppercase opacity-50 mb-4">
              No shows match your filters
            </p>
            <button
              onClick={resetFilters}
              className="text-xs uppercase px-6 py-2 border border-white hover:bg-white hover:text-black transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
