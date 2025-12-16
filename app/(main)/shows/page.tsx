'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePlayer } from '../../context/PlayerContext';

function ShowsContent() {
  const { playShow } = usePlayer();
  const searchParams = useSearchParams();

  const [allShows, setAllShows] = useState<any[]>([]);
  const [displayedShows, setDisplayedShows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCount, setShowCount] = useState(100);
  
  const [selectedResident, setSelectedResident] = useState<string>('ALL');
  const [selectedStyle, setSelectedStyle] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ✅ LIRE LE PARAMÈTRE URL ?search=TIGNASSE
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      console.log('🔍 URL search param detected:', urlSearch);
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Fetch TOUS les shows (pagination)
  useEffect(() => {
    const fetchAllShows = async () => {
      try {
        let allData: any[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore && offset < 500) {
          console.log(`📡 Fetching shows ${offset}-${offset + limit}...`);
          const res = await fetch(
            `https://api.mixcloud.com/StillFM/cloudcasts/?limit=${limit}&offset=${offset}`
          );
          const data = await res.json();
          
          if (data.data && data.data.length > 0) {
            allData = [...allData, ...data.data];
            offset += limit;
            
            if (data.data.length < limit) {
              hasMore = false;
            }
          } else {
            hasMore = false;
          }
        }

        console.log(`✅ Loaded ${allData.length} shows total`);

        // ✅ EXTRAIRE LES VRAIS RESIDENTS DEPUIS LES TAGS MIXCLOUD
        const formatted = allData.map((show: any) => {
          const title = show.name;
          
          // Extraire resident depuis les tags ou le titre
          let resident = 'VARIOUS';
          
          // Chercher dans les tags d'abord
          if (show.tags && show.tags.length > 0) {
            const tagNames = show.tags.map((t: any) => t.name.toUpperCase());
            
            // Liste des residents connus (peut être étendue)
            const knownResidents = [
              'TIGNASSE', 'DANTE MAXWELL', 'COOPER RICHARDSON', 'SK7', 'BERTA ROSE',
              'MARK PM', 'NORA ZION', 'ME FLOAT', 'MUSONI', 'LAURENCE NADEAU',
              'CIDOINE', 'ICKY MAGDALA', 'FANEVA', 'SENZ', 'ALEX MURPHY',
              'FAZ ONE', 'SVVIMMING', 'SKATE', 'UTSAVA', 'TECHNIQUE NADO',
              'FLYP', 'ASH-LIN', 'UKG AFFAIR', 'SOUND VOYAGE', 'GROOVY & CHILL'
            ];
            
            for (const known of knownResidents) {
              if (tagNames.some((tag: string) => tag.includes(known))) {
                resident = known;
                break;
              }
            }
          }
          
          // Si pas trouvé dans tags, chercher dans le titre
          if (resident === 'VARIOUS') {
            const titleUpper = title.toUpperCase();
            if (titleUpper.includes('TIGNASSE')) resident = 'TIGNASSE';
            else if (titleUpper.includes('DANTE MAXWELL')) resident = 'DANTE MAXWELL';
            else if (titleUpper.includes('COOPER RICHARDSON')) resident = 'COOPER RICHARDSON';
            else if (titleUpper.includes('SK7')) resident = 'SK7';
            else if (titleUpper.includes('BERTA ROSE')) resident = 'BERTA ROSE';
            else if (titleUpper.includes('MARK PM')) resident = 'MARK PM';
            else if (titleUpper.includes('NORA ZION')) resident = 'NORA ZION';
            else if (titleUpper.includes('ME FLOAT')) resident = 'ME FLOAT';
            else if (titleUpper.includes('MUSONI')) resident = 'MUSONI';
            else if (titleUpper.includes('LAURENCE NADEAU')) resident = 'LAURENCE NADEAU';
            else if (titleUpper.includes('CIDOINE')) resident = 'CIDOINE';
            else if (titleUpper.includes('ICKY MAGDALA')) resident = 'ICKY MAGDALA';
            else if (titleUpper.includes('FANEVA')) resident = 'FANEVA';
            else if (titleUpper.includes('SENZ')) resident = 'SENZ';
            else if (titleUpper.includes('ALEX MURPHY')) resident = 'ALEX MURPHY';
            else if (titleUpper.includes('FAZ ONE')) resident = 'FAZ ONE';
            else if (titleUpper.includes('SVVIMMING')) resident = 'SVVIMMING';
            else if (titleUpper.includes('SKATE')) resident = 'SKATE';
            else if (titleUpper.includes('UTSAVA')) resident = 'UTSAVA';
            else if (titleUpper.includes('TECHNIQUE NADO')) resident = 'TECHNIQUE NADO';
            else if (titleUpper.includes('FLYP')) resident = 'FLYP';
            else if (titleUpper.includes('ASH-LIN') || titleUpper.includes('ASHLIN')) resident = 'ASH-LIN';
          }
          
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
            else if (tag.includes('hip hop') || tag.includes('rap')) style = 'HIP HOP';
            else if (tag.includes('grime')) style = 'GRIME';
            else if (tag.includes('footwork') || tag.includes('juke')) style = 'FOOTWORK / JUKE';
            else style = tag.toUpperCase();
          }
          
          const date = new Date(show.created_time);
          const year = date.getFullYear().toString();
          
          return {
            key: show.key,
            name: show.name,
            resident,
            style,
            date: show.created_time,
            year,
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
    
    fetchAllShows();
  }, []);

  // Extraire les valeurs uniques pour les filtres
  const residents = ['ALL', ...Array.from(new Set(allShows.map(s => s.resident))).sort()];
  const styles = ['ALL', ...Array.from(new Set(allShows.map(s => s.style))).sort()];
  const years = ['ALL', ...Array.from(new Set(allShows.map(s => s.year))).sort().reverse()];

  // Filtrer les shows
  useEffect(() => {
    let filtered = allShows.filter(show => {
      const matchResident = selectedResident === 'ALL' || show.resident === selectedResident;
      const matchStyle = selectedStyle === 'ALL' || show.style === selectedStyle;
      const matchYear = selectedYear === 'ALL' || show.year === selectedYear;
      const matchSearch = searchQuery === '' || 
        show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.resident.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchResident && matchStyle && matchYear && matchSearch;
    });

    setDisplayedShows(filtered);
  }, [allShows, selectedResident, selectedStyle, selectedYear, searchQuery]);

  const resetFilters = () => {
    setSelectedResident('ALL');
    setSelectedStyle('ALL');
    setSelectedYear('ALL');
    setSearchQuery('');
    setShowCount(100);
  };

  const loadMore = () => {
    setShowCount(prev => prev + 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl uppercase tracking-wider mb-2 animate-pulse">
            Loading All Shows...
          </div>
          <div className="text-xs opacity-50">This may take a moment</div>
        </div>
      </div>
    );
  }

  const visibleShows = displayedShows.slice(0, showCount);

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black pb-12">
      
      <div className="crt-screen" />
      
      <main className="max-w-full">
        
        {/* Header + Search */}
        <div className="border-b border-white px-4 py-3">
          
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h1 className="text-base md:text-xl font-bold uppercase tracking-wider">
              Shows ({displayedShows.length})
            </h1>
            
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black border border-white px-3 py-1 text-xs uppercase placeholder:text-gray-600 focus:outline-none focus:bg-white focus:text-black transition-all w-full md:w-64"
            />

            {(selectedResident !== 'ALL' || selectedStyle !== 'ALL' || selectedYear !== 'ALL' || searchQuery !== '') && (
              <button
                onClick={resetFilters}
                className="text-[9px] md:text-xs uppercase tracking-wider px-3 py-1 border border-white hover:bg-white hover:text-black transition-all"
              >
                Reset
              </button>
            )}
          </div>

          {/* Filtres compacts */}
          <div className="grid grid-cols-3 gap-2">
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-black border border-white px-2 py-1 text-[10px] md:text-xs uppercase cursor-pointer hover:bg-white hover:text-black transition-all"
            >
              <option value="ALL">All Years</option>
              {years.filter(y => y !== 'ALL').map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

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
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {visibleShows.map((show, idx) => (
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
                  <span>{show.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleShows.length < displayedShows.length && (
          <div className="border-t border-white p-12 text-center">
            <button
              onClick={loadMore}
              className="border border-white px-8 py-3 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all font-bold"
            >
              Load More Shows ({displayedShows.length - visibleShows.length} remaining)
            </button>
          </div>
        )}

        {/* No results */}
        {displayedShows.length === 0 && (
          <div className="border-t border-white p-12 text-center">
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

export default function ShowsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl uppercase tracking-wider mb-2 animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    }>
      <ShowsContent />
    </Suspense>
  );
}
