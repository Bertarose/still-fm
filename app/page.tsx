import MixcloudPlayer from './components/MixcloudPlayer';

// L'URL de l'API Mixcloud pour récupérer les shows (cloudcasts) de l'utilisateur "StillFM"
const MIXCLOUD_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=10';

// Fonction utilitaire pour adapter les données de l'API Mixcloud à la structure de votre composant
const formatMixcloudShow = (mix) => {
    // Formatage de la date à partir de mix.created_time
    const mixDate = new Date(mix.created_time).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric' 
    }).toUpperCase().replace(/\./g, ''); // Enlève tous les points après les abréviations de mois

    return {
        title: mix.name.toUpperCase(), 
        url: mix.url,
        img: mix.pictures?.extra_large, 
        tags: [], // Tags laissés vides, à implémenter si l'API les fournit
        date: mixDate,
    };
};

// ------------------------------------------------------------------
// --- NOUVELLE FONCTION ASYNCHRONE DE RÉCUPÉRATION DE DONNÉES (Remplaçant getStaticProps) ---
// ------------------------------------------------------------------

async function getMixcloudData() {
    try {
        const response = await fetch(MIXCLOUD_API_URL, { 
            // Ajouter une option de cache pour Next.js 
            // Ici, nous forçons la récupération statique et la revalidation toutes les 3600s (1 heure)
            next: { revalidate: 3600 } 
        });

        if (!response.ok) {
            // Loguer l'erreur côté serveur
            console.error(`Erreur HTTP: ${response.status} lors de la récupération de Mixcloud`);
            // Retourner les valeurs par défaut
            return { latestMix: null, latestShows: [] };
        }

        const data = await response.json();
        const allShows = data.data.map(formatMixcloudShow);
        
        // Le tout dernier show pour la carte Hero (index 0)
        const latestMix = {
            ...allShows[0],
            tags: ["LAST SHOW", "ARCHIVE"], 
            pictures: { extra_large: allShows[0].img }
        };

        // Les 10 derniers shows pour la grille
        const latestShows = allShows.slice(0, 10);
        
        return { latestMix, latestShows };

    } catch (error) {
        console.error("Erreur de récupération Mixcloud:", error);
        return { latestMix: null, latestShows: [] };
    }
}


// ------------------------------------------------------------------
// --- COMPOSANT HOME ASYNCHRONE (REÇOIT LES DONNÉES DE LA FONCTION) ---
// ------------------------------------------------------------------

// Rendre le composant par défaut asynchrone pour attendre les données.
export default async function Home() {
    
    // Appel de la fonction de récupération de données au moment du build/revalidation
    const { latestMix, latestShows } = await getMixcloudData();
    
    // Next.js gère la mise en cache et le rendu statique pour vous.
    
    // Vérification de chargement/erreur simplifiée
    const loading = !latestMix && latestShows.length === 0;

    // Le contenu de la grande carte Hero (utilise latestMix)
    const heroCard1Content = latestMix ? (
        <>
            <img 
                src={latestMix.pictures?.extra_large} 
                alt={latestMix.title}
                className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                    {latestMix.date && (
                        <span className="text-[10px] font-normal tracking-wider uppercase border border-white px-2 py-1">
                            {latestMix.date}
                        </span>
                    )}
                    {latestMix.tags && latestMix.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-normal tracking-wider uppercase border border-white px-2 py-1">
                            {tag}
                        </span>
                    ))}
                </div>
                <h2 className="text-lg font-normal uppercase tracking-wide leading-tight">
                    {latestMix.title}
                </h2>
            </div>
        </>
    ) : (
        <div className="aspect-[4/5] relative flex items-center justify-center bg-gray-900">
            <p className="text-sm uppercase tracking-wider text-gray-500">Chargement du dernier show...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white font-mono">
            {/* Header (inchangé) */}
            <header className="border-b border-white">
                <div className="max-w-full px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xs font-normal tracking-widest uppercase">
                            STILL FM
                        </h1>
                        <nav className="hidden md:flex gap-6">
                            <a href="/shows" className="text-xs uppercase tracking-wider hover:opacity-50 transition-opacity">Shows</a>
                            <a href="/schedule" className="text-xs uppercase tracking-wider hover:opacity-50 transition-opacity">Schedule</a>
                            <a href="/residents" className="text-xs uppercase tracking-wider hover:opacity-50 transition-opacity">Residents</a>
                            <a href="/about" className="text-xs uppercase tracking-wider hover:opacity-50 transition-opacity">About</a>
                        </nav>
                    </div>
                    <button className="border border-white px-4 py-1 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                        Listen Live
                    </button>
                </div>
            </header>
            
            <main className="max-w-full px-4 py-4">
                {/* Hero Section - 2 Large Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {/* Card 1 - Latest Mixcloud Show (Dynamique) */}
                    <a href={latestMix?.url || "#"} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden bg-black hover:opacity-80 transition-opacity">
                        <div className="aspect-[4/5] relative">
                            {heroCard1Content}
                        </div>
                    </a>

                    {/* Card 2 - TWITCH LIVE STREAM (inchangé) */}
                    <div className="group relative overflow-hidden bg-black">
                        <div className="aspect-[4/5] relative">
                            <iframe
                                src="https://player.twitch.tv/?channel=bertarose&parent=still-fm.vercel.app"
                                className="w-full h-full"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; fullscreen"
                            ></iframe>
                            <div className="absolute top-6 left-6 bg-white text-black px-3 py-1 text-[10px] font-bold tracking-wider flex items-center gap-2 z-10 pointer-events-none">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                LIVE STUDIO
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-normal tracking-wider uppercase border border-white px-2 py-1">
                                        LIVE NOW
                                    </span>
                                    <span className="text-[10px] font-normal tracking-wider uppercase border border-white px-2 py-1">
                                        TWITCH
                                    </span>
                                </div>
                                <h2 className="text-lg font-normal uppercase tracking-wide leading-tight">
                                    STILL FM LIVE STREAM
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Now Playing Bar with Mixcloud Player (inchangé) */}
                <div className="border border-white p-4 mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 border border-white flex items-center justify-center flex-shrink-0">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-1"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] uppercase tracking-wider mb-1">Now Playing</p>
                            <p className="text-xs uppercase tracking-wide">Latest Show from Still FM</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white animate-pulse"></div>
                            <span className="text-[10px] uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                    
                    {/* Mixcloud Player */}
                    <MixcloudPlayer mixcloudUrl="https://www.mixcloud.com/StillFM/" />
                </div>

                {/* LATEST SHOWS Section (Dynamique) */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-wider">Latest Shows</h2>
                        <a href="#" className="text-xs uppercase tracking-wider border border-white px-4 py-1 hover:bg-white hover:text-black transition-all">
                            See All
                        </a>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {loading && latestShows.length === 0 && <p className="col-span-full text-center text-gray-500">Chargement des derniers shows...</p>}
                        
                        {/* Boucle des shows récupérés de Mixcloud */}
                        {latestShows.map((show, index) => (
                            <a key={index} href={show.url} target="_blank" rel="noopener noreferrer" className="group">
                                <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                    <img 
                                        src={show.img} 
                                        alt={show.title}
                                        className="w-full h-full object-cover grayscale group-hover:opacity-80 transition-opacity"
                                    />
                                </div>
                                <h3 className="text-xs uppercase tracking-wide mb-1">{show.title}</h3> 
                                <p className="text-[10px] text-gray-400 tracking-wider">{show.date}</p>
                                {show.tags.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                        {show.tags.map(tag => (
                                            <span key={tag} className="text-[8px] border border-white px-1 py-0.5">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </a>
                        ))}
                    </div>
                </section>
                
                {/* FROM THE ARCHIVE Section (inchangé) */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-wider">From The Archive</h2>
                        <a href="#" className="text-xs uppercase tracking-wider border border-white px-4 py-1 hover:bg-white hover:text-black transition-all">
                            See All
                        </a>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                        <a href="#" className="md:col-span-1 group">
                            <div className="aspect-[3/4] relative border border-white overflow-hidden">
                                <img 
                                    src="https://images.unsplash.com/photo-1574186893279-0e600b61a24d?w=600&h=800&fit=crop" 
                                    alt="Archive Featured"
                                    className="w-full h-full object-cover grayscale group-hover:opacity-80 transition-opacity"
                                />
                            </div>
                        </a>

                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            <a href="#" className="group">
                                <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop" 
                                        alt="Archive"
                                        className="w-full h-full object-cover grayscale group-hover:opacity-80 transition-opacity"
                                    />
                                </div>
                                <h3 className="text-xs uppercase tracking-wide mb-1">MUZIKAWI CURATES: ZURET</h3>
                                <p className="text-[10px] text-gray-400 tracking-wider">05 SEP 2025 | 11:00 [BST]</p>
                            </a>

                            <a href="#" className="group">
                                <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1556035511-3168381ea4d4?w=400&h=400&fit=crop" 
                                        alt="Archive"
                                        className="w-full h-full object-cover grayscale group-hover:opacity-80 transition-opacity"
                                    />
                                </div>
                                <h3 className="text-xs uppercase tracking-wide mb-1">ETHIO GROOVES: HEWAN</h3>
                                <p className="text-[10px] text-gray-400 tracking-wider">05 SEP 2025 | 08:00 [BST]</p>
                            </a>

                            <a href="#" className="group">
                                <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=400&h=400&fit=crop" 
                                        alt="Archive"
                                        className="w-full h-full object-cover grayscale group-hover:opacity-80 transition-opacity"
                                    />
                                </div>
                                <h3 className="text-xs uppercase tracking-wide mb-1">MIDNIGHT SESSIONS</h3>
                                <p className="text-[10px] text-gray-400 tracking-wider">04 SEP 2025 | 00:00 [BST]</p>
                            </a>

                            <a href="#" className="group">
                                <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop" 
                                        alt="Archive"
                                        className="w-full h-full object-cover grayscale group-hover:opacity-80 transition-opacity"
                                    />
                                </div>
                                <h3 className="text-xs uppercase tracking-wide mb-1">CAVITY FEELING</h3>
                                <p className="text-[10px] text-gray-400 tracking-wider">03 SEP 2025 | 15:00 [BST]</p>
                            </a>
                        </div>
                    </div>
                </section>

                {/* SCHEDULE Preview Section (inchangé) */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-wider">This Week</h2>
                        <a href="#" className="text-xs uppercase tracking-wider border border-white px-4 py-1 hover:bg-white hover:text-black transition-all">
                            Full Schedule
                        </a>
                    </div>

                    <div className="border border-white">
                        <div className="border-b border-white p-4 hover:bg-white hover:text-black transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs tracking-wider">TUE 05 NOV</span>
                                    <span className="text-xs tracking-wider">18:00 - 20:00</span>
                                    <h3 className="text-sm uppercase tracking-wide">Evening Sounds with Marcus</h3>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-[8px] border border-current px-2 py-1">JAZZ</span>
                                    <span className="text-[8px] border border-current px-2 py-1">SOUL</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-white p-4 hover:bg-white hover:text-black transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs tracking-wider">WED 06 NOV</span>
                                    <span className="text-xs tracking-wider">20:00 - 22:00</span>
                                    <h3 className="text-sm uppercase tracking-wide">Techno Therapy</h3>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-[8px] border border-current px-2 py-1">TECHNO</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-white p-4 hover:bg-white hover:text-black transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs tracking-wider">THU 07 NOV</span>
                                    <span className="text-xs tracking-wider">14:00 - 16:00</span>
                                    <h3 className="text-sm uppercase tracking-wide">Afternoon Delight</h3>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-[8px] border border-current px-2 py-1">DISCO</span>
                                    <span className="text-[8px] border border-current px-2 py-1">FUNK</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 hover:bg-white hover:text-black transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs tracking-wider">FRI 08 NOV</span>
                                    <span className="text-xs tracking-wider">22:00 - 00:00</span>
                                    <h3 className="text-sm uppercase tracking-wide">Late Night Sessions</h3>
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-[8px] border border-current px-2 py-1">AMBIENT</span>
                                    <span className="text-[8px] border border-current px-2 py-1">ELECTRONIC</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer (inchangé) */}
            <footer className="border-t border-white mt-20">
                <div className="max-w-full px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-xs uppercase tracking-wider mb-4">About</h3>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                Still FM is an independent radio station broadcasting from Montreal, showcasing the best in underground music and culture.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-wider mb-4">Connect</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-[10px] text-gray-400 hover:text-white">Instagram</a></li>
                                <li><a href="#" className="text-[10px] text-gray-400 hover:text-white">Twitter</a></li>
                                <li><a href="#" className="text-[10px] text-gray-400 hover:text-white">Facebook</a></li>
                                <li><a href="https://www.mixcloud.com/StillFM/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-white">Mixcloud</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-wider mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-[10px] text-gray-400 hover:text-white">Donate</a></li>
                                <li><a href="#" className="text-[10px] text-gray-400 hover:text-white">Membership</a></li>
                                <li><a href="#" className="text-[10px] text-gray-400 hover:text-white">Merchandise</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-wider mb-4">Newsletter</h3>
                            <input 
                                type="email" 
                                placeholder="YOUR EMAIL" 
                                className="w-full bg-transparent border border-white px-3 py-2 text-[10px] tracking-wider placeholder-gray-500"
                            />
                            <button className="w-full border border-white px-3 py-2 text-[10px] uppercase tracking-wider mt-2 hover:bg-white hover:text-black transition-all">
                                Subscribe
                            </button>
                        </div>
                    </div>
                    <div className="border-t border-white pt-8 flex items-center justify-between">
                        <p className="text-[10px] text-gray-400 tracking-wider">© 2025 STILL FM. ALL RIGHTS RESERVED.</p>
                        <p className="text-[10px] text-gray-400 tracking-wider">MONTREAL, CANADA</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
