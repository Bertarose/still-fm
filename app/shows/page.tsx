// L'URL de l'API Mixcloud pour récupérer les shows (cloudcasts) de l'utilisateur "StillFM".
const MIXCLOUD_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=24';

// NOUVELLE FONCTION: Algorithme de Fisher-Yates pour mélanger un tableau de manière aléatoire
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fonction utilitaire pour adapter les données de l'API Mixcloud à la structure de votre composant
const formatMixcloudShow = (mix: any) => {
    // Date: 04 NOV 2025
    const mixDate = new Date(mix.created_time).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric' 
    }).toUpperCase().replace(/\./g, '');

    // Time: 08:00 [GMT]
    const mixTime = new Date(mix.created_time).toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit', timeZone: 'GMT'
    });
    
    // Pour l'exemple, nous incluons des tags simulés ou un tag générique "ARCHIVE"
    const tags = mix.tags && mix.tags.length > 0 
        ? mix.tags.slice(0, 2).map((tag: any) => tag.name.toUpperCase()) 
        : ["ARCHIVE"];
    
    // Le format final sera "04 NOV 2025 | 08:00 GMT"
    const formattedDate = `${mixDate} | ${mixTime} [GMT]`;

    return {
        title: mix.name.toUpperCase(), 
        url: mix.url,
        img: mix.pictures?.extra_large, 
        tags: tags,
        date: formattedDate,
    };
};

// Fonction asynchrone pour récupérer les données de Mixcloud
async function getMixcloudData() {
    try {
        const response = await fetch(MIXCLOUD_API_URL, { 
            // Caching pour Next.js : Revalidation toutes les 3600s (1 heure)
            next: { revalidate: 3600 } 
        });

        if (!response.ok) {
            console.error(`Erreur HTTP: ${response.status} lors de la récupération de Mixcloud`);
            return [];
        }

        const data = await response.json();
        
        // Mappage des données brutes vers notre format structuré
        const mappedShows = data.data.map(formatMixcloudShow);
        
        // ÉTAPE CLÉ : Mélanger les shows avant de les retourner
        return shuffleArray(mappedShows);

    } catch (error) {
        console.error("Erreur de récupération Mixcloud:", error);
        return [];
    }
}


// Le composant doit être une fonction asynchrone pour l'App Router de Next.js
export default async function ShowsPage() {
    
    // Récupération des 24 derniers shows (maintenant mélangés)
    const allShows = await getMixcloudData();
    
    const loading = allShows.length === 0;

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
                <h1 className="text-4xl font-bold uppercase tracking-wider mb-8">All Shows</h1>
                
                {loading && (
                    <p className="text-center text-gray-500 py-12">Chargement des shows...</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Iteration sur les shows réels récupérés */}
                    {allShows.map((show: any, index: number) => (
                        <a href={show.url} key={index} target="_blank" rel="noopener noreferrer" className="group">
                            <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                <img 
                                    src={show.img}
                                    alt={show.title}
                                    className="w-full h-full object-cover group-hover:opacity-80 transition"
                                />
                                {/* Ajout des tags */}
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
                            {/* Utilisation de la date/heure formatée */}
                            <p className="text-[10px] text-gray-400">{show.date}</p>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
}
