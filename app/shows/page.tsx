// L'URL de l'API Mixcloud pour récupérer les shows (cloudcasts) de l'utilisateur "StillFM".
const LATEST_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=24';

// CORRECTION : Utilisation de ordering=hot pour obtenir les shows Trending
const TRENDING_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?ordering=hot&limit=6';

// Fonction pour mélanger un tableau (à garder pour la grille principale)
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fonction utilitaire pour adapter les données
const formatMixcloudShow = (mix: any) => {
    // Date: 04 NOV 2025
    const mixDate = new Date(mix.created_time).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric' 
    }).toUpperCase().replace(/\./g, '');

    // Time: 08:00 [GMT]
    const mixTime = new Date(mix.created_time).toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit', timeZone: 'GMT'
    });
    
    // Simplification des tags
    const tags = mix.tags && mix.tags.length > 0 
        ? mix.tags.slice(0, 2).map((tag: any) => tag.name.toUpperCase()) 
        : [];
    
    const formattedDate = `${mixDate} | ${mixTime} [GMT]`;

    return {
        title: mix.name.toUpperCase(), 
        url: mix.url,
        img: mix.pictures?.extra_large, 
        tags: tags,
        date: formattedDate,
        listens: mix.listen_count // On le garde si jamais vous voulez l'utiliser ailleurs
    };
};

// Fonction asynchrone pour récupérer les deux ensembles de données
async function getShowsData() {
    try {
        const [latestResponse, trendingResponse] = await Promise.all([
            fetch(LATEST_API_URL, { next: { revalidate: 3600 } }),
            fetch(TRENDING_API_URL, { next: { revalidate: 3600 } })
        ]);

        const [latestData, trendingData] = await Promise.all([
            latestResponse.json(),
            trendingResponse.json()
        ]);
        
        // Mappage et mélange pour la grille principale
        const mappedLatestShows = latestData.data.map(formatMixcloudShow);
        const shuffledLatestShows = shuffleArray(mappedLatestShows);
        
        // Mappage pour la section Trending (hot)
        const trendingShows = trendingData.data.map(formatMixcloudShow);

        return { allShows: shuffledLatestShows, trendingShows };

    } catch (error) {
        console.error("Erreur de récupération Mixcloud:", error);
        return { allShows: [], trendingShows: [] };
    }
}


// Le composant doit être une fonction asynchrone pour l'App Router de Next.js
export default async function ShowsPage() {
    
    const { allShows, trendingShows } = await getShowsData();
    
    const loading = allShows.length === 0 && trendingShows.length === 0;

    return (
        <div className="min-h-screen bg-black text-white font-mono">
            <header className="border-b border-white">
                <div className="max-w-full px-4 py-4">
                    <div className="flex items-center gap-8">
                        <a href="/" className="text-xs font-normal tracking-widest uppercase hover:opacity-50">
                            STILL FM
                        </a>
                        <nav className="hidden md:flex gap-6">
                            <a href="/shows" className="text-xs uppercase tracking-wider opacity-50">Shows</a>
                            <a href="/schedule" className="text-xs uppercase tracking-wider hover:opacity-50">Schedule</a>
                            <a href="/residents" className="text-xs uppercase tracking-wider hover:opacity-50">Residents</a>
                            <a href="/about" className="text-xs uppercase tracking-wider hover:opacity-50">About</a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-full px-4 py-12">
                
                {/* ========================================
                  SECTION 1: TRENDING NOW (6 shows HOT)
                  ========================================
                */}
                <section className="mb-12 border-b border-white pb-12">
                    <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 flex items-center gap-3">
                         🔥 Trending Now
                    </h2>
                    
                    {trendingShows.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {trendingShows.map((show: any, index: number) => (
                                <a href={show.url} key={index} target="_blank" rel="noopener noreferrer" className="group">
                                    <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                        <img 
                                            src={show.img}
                                            alt={show.title}
                                            className="w-full h-full object-cover group-hover:opacity-80 transition"
                                        />
                                         {/* Affichage d'un badge "HOT" ou du nombre d'écoutes si vous le souhaitez */}
                                        <div className="absolute top-2 left-2 text-[8px] font-bold uppercase tracking-wider bg-white text-black px-2 py-0.5">
                                            HOT
                                        </div>
                                    </div>
                                    <h3 className="text-xs uppercase tracking-wide mb-1">{show.title}</h3>
                                    <p className="text-[10px] text-gray-400">{show.date}</p>
                                </a>
                            ))}
                        </div>
                    ) : (
                         <p className="text-center text-gray-500 py-6">Aucun show populaire trouvé.</p>
                    )}
                </section>


                {/* ========================================
                  SECTION 2: ALL LATEST SHOWS (Grille de 24 shows aléatoires)
                  ========================================
                */}
                <h1 className="text-4xl font-bold uppercase tracking-wider mb-8 mt-12">All Shows</h1>

                {loading && (
                    <p className="text-center text-gray-500 py-12">Chargement des shows...</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {allShows.map((show: any, index: number) => (
                        <a href={show.url} key={index} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                <img 
                                    src={show.img}
                                    alt={show.title}
                                    className="w-full h-full object-cover group-hover:opacity-80 transition"
                                />
                                {show.tags.length > 0 && (
                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                        {show.tags.map((tag: string) => (
                                            <span key={tag} className="text-[8px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 border border-white">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xs uppercase tracking-wide mb-1">{show.title}</h3>
                            <p className="text-[10px] text-gray-400">{show.date}</p>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
}
