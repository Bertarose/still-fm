'use client';

import Link from 'next/link';

export default function ResidentsPage() {
  // Données simulées pour les résidents (Images d'ambiance)
  const residents = [
    { name: "DJ POSER", genre: "TECHNO / TRANCE", image: "https://images.unsplash.com/photo-1571607697765-063be663682a?w=500&h=500&fit=crop" },
    { name: "COCCYX", genre: "GABBER / HARDCORE", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop" },
    { name: "MOTEL SCANDALOUS", genre: "AMBIENT / DUB", image: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=500&h=500&fit=crop" },
    { name: "KUMANDA", genre: "EXPERIMENTAL", image: "https://images.unsplash.com/photo-1493225457124-a14a61fb0a23?w=500&h=500&fit=crop" },
    { name: "MANY WORLDS", genre: "JAZZ / FUSION", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop" },
    { name: "BLUEBUBBLE", genre: "POP / HYPERPOP", image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=500&h=500&fit=crop" },
    { name: "ANDERDOG", genre: "BREAKS / JUNGLE", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop" },
    { name: "FIVE WILLOWS", genre: "HOUSE / LO-FI", image: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?w=500&h=500&fit=crop" },
    { name: "TAQWA CORE", genre: "PUNK / METAL", image: "https://images.unsplash.com/photo-1499887142886-791eca5918cd?w=500&h=500&fit=crop" },
    { name: "CONSTANTINE", genre: "WAVE / SYNTH", image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=500&h=500&fit=crop" },
    { name: "FILTER", genre: "IDM / GLITCH", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=500&fit=crop" },
    { name: "NEBULAE", genre: "DRONE / NOISE", image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35ad?w=500&h=500&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black pb-24">
      
      {/* === FILTRE CRT FIXE === */}
      <div className="crt-screen" />
      
      {/* === HEADER (Cohérent avec Home & Shop) === */}
      <header className="sticky top-0 z-50 bg-white text-black border-b border-black text-[11px] font-bold uppercase tracking-wide">
          
          {/* Ligne 1 : Logo et Fil d'Ariane */}
          <div className="flex h-8 items-stretch border-b border-black">
              <Link href="/home" className="w-32 flex items-center justify-center border-r border-black bg-black text-white px-4 hover:bg-gray-900 transition-colors cursor-pointer">
                  STILL FM
              </Link>
              <div className="flex-1 flex items-center px-4 bg-white">
                  /// RESIDENT ARTISTS & HOSTS
              </div>
              <div className="w-32 flex items-center justify-center border-l border-black bg-[#e0e0e0]">
                   {residents.length} RESIDENTS
              </div>
          </div>

          {/* Ligne 2 : Navigation */}
          <nav className="flex h-8 items-stretch">
              {['Shows', 'Residents', 'Shop'].map((item) => (
                  <Link 
                      key={item} 
                      href={`/${item.toLowerCase()}`} 
                      className={`flex items-center px-6 border-r border-black hover:bg-black hover:text-white transition-colors cursor-pointer ${item === 'Residents' ? 'bg-black text-white' : ''}`}
                  >
                      {item}
                  </Link>
              ))}
          </nav>
      </header>

      {/* === CONTENU PRINCIPAL === */}
      <main className="max-w-full px-4 py-12 relative z-0">
        
        {/* Titre de section */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-4xl font-bold uppercase tracking-tighter italic text-white">
                Our Family
            </h1>
        </div>

        {/* Grille des Résidents */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {residents.map((resident, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Image Carrée avec effet */}
              <div className="aspect-square border border-gray-800 overflow-hidden mb-3 relative">
                <img 
                  src={resident.image}
                  alt={resident.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                />
                {/* Overlay sombre au survol pour faire ressortir le texte si besoin */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
              </div>
              
              {/* Infos Résident */}
              <div className="border-l-2 border-transparent group-hover:border-white pl-2 transition-all duration-300">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-200 group-hover:text-white">
                    {resident.name}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono uppercase group-hover:text-gray-400">
                    {resident.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-12 text-center">
          <p className="text-[10px] text-gray-600 font-mono uppercase">Join the family /// Submit your demo</p>
      </footer>
    </div>
  );
}
