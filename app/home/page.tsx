import MixcloudPlayer from '../components/MixcloudPlayer';
import TopAudioPlayer from '../components/TopAudioPlayer';
import Link from 'next/link';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// URL pour récupérer beaucoup de shows et les trier par popularité
const LATEST_SHOWS_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=100';

// URL pour les archives - Shows de 2022 (les débuts de Still FM)
// since = 1er janvier 2022, until = 31 décembre 2022
const ARCHIVE_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?since=1640995200&until=1672531199&limit=20';

// Fonction utilitaire pour adapter les données
const formatMixcloudShow = (mix: any, isPopular: boolean = false) => {
    // Formatage de la date à partir de mix.created_time
    const mixDate = new Date(mix.created_time).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric' 
    }).toUpperCase().replace(/\./g, ''); 

    // Pour l'archive, on affiche le nombre d'écoutes si disponible, sinon la date
    const dateOrStats = isPopular && mix.listen_count 
        ? `${mix.listen_count.toLocaleString('fr-FR')} ÉCOUTES`
        : `${mixDate}`;

    return {
        title: mix.name.toUpperCase(), 
        url: mix.url,
        img: mix.pictures?.extra_large,
        tags: [], 
        date: dateOrStats,
    };
};

// Récupération des archives (5 meilleurs shows de 2022)
async function getArchiveData() {
    try {
        const response = await fetch(ARCHIVE_API_URL, { 
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`Erreur HTTP: ${response.status} lors de la récupération des archives`);
            return [];
        }

        const data = await response.json();
        
        // Trier les shows de 2022 par popularité
        const sortedBy2022Popularity = data.data.sort((a: any, b: any) => {
            const aPlays = a.play_count || 0;
            const bPlays = b.play_count || 0;
            return bPlays - aPlays;
        });
        
        // Garder les 5 plus populaires de 2022
        const top5 = sortedBy2022Popularity.slice(0, 5);
        
        return top5.map((mix: any) => formatMixcloudShow(mix, true)); 

    } catch (error) {
        console.error("Erreur de récupération Archives Mixcloud:", error);
        return [];
    }
}


// Fonction de récupération principale
async function getMixcloudData() {
    const [latestShowsResponse, archiveShows] = await Promise.all([
        fetch(LATEST_SHOWS_API_URL, { cache: 'no-store' }),
        getArchiveData()
    ]);
    
    let latestMix = null;
    let latestShows = [];

    try {
        if (!latestShowsResponse.ok) {
            throw new Error(`Erreur HTTP pour les derniers shows: ${latestShowsResponse.status}`);
        }
        
        const data = await latestShowsResponse.json();
        
        // Trier manuellement par nombre d'écoutes (play_count) pour avoir les VRAIS plus populaires
        const sortedByPopularity = data.data.sort((a: any, b: any) => {
            const aPlays = a.play_count || 0;
            const bPlays = b.play_count || 0;
            return bPlays - aPlays; // Du plus populaire au moins populaire
        });
        
        const allLatestShows = sortedByPopularity.map((mix: any) => formatMixcloudShow(mix, false));
        
        // Le show le plus populaire pour le Hero
        if (allLatestShows.length > 0) {
            latestMix = {
                ...allLatestShows[0],
                tags: ["POPULAR", "ARCHIVE"], 
                pictures: { extra_large: allLatestShows[0].img }
            };
        }

        // Les 8 shows les plus populaires de tous les temps
        latestShows = allLatestShows.slice(0, 8);
        
    } catch (error) {
        console.error("Erreur de récupération des derniers shows:", error);
    }
    
    return { latestMix, latestShows, archiveShows };
}


// COMPOSANT HOME ASYNCHRONE (Serveur)
export default async function Home() {
    
    const { latestMix, latestShows, archiveShows } = await getMixcloudData();
    
    const loading = !latestMix && latestShows.length === 0;
    const featuredArchive = archiveShows[0]; 
    const smallArchiveGrid = archiveShows.slice(1, 5); 

    const heroCard1Content = latestMix ? (
        <>
            <img 
                src={latestMix.pictures?.extra_large} 
                alt={latestMix.title}
                className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                    {latestMix.date && (
                        <span className="text-[10px] font-normal tracking-wider uppercase border border-white px-2 py-1">
                            {latestMix.date}
                        </span>
                    )}
                    {latestMix.tags && latestMix.tags.map((tag: string) => (
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
            {/* Header: Ajout de 'relative' pour que le menu mobile absolu fonctionne */}
            <header className="border-b border-white relative">
                <div className="max-w-full px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xs font-normal tracking-widest uppercase">
                            STILL FM
                        </h1>
                        {/* Navigation de bureau classique */}
                        <nav className="hidden md:flex gap-6">
                            <Link href="/shows" className="text-xs uppercase tracking-wider hover:opacity-50 transition-opacity">Shows</Link>
                            <Link href="/schedule" className="text-xs uppercase tracking-wider hover:opacity-50 transition-opacity">Schedule</Link>
                            <Link href="/residents" className="text-xs uppercase tracking-wider hover:opacity-50 transition-opacity">Residents</Link>
                            <Link href="/about" className="text-xs uppercase tracking-wider hover:opacity-50 transition-opacity">About</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <a 
                            href="https://www.twitch.tv/bertarose" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hidden md:block text-xs uppercase tracking-wider border border-white px-4 py-1 hover:bg-white hover:text-black transition-all"
                        >
                            Listen Live
                        </a>
                        
                        {/* Bouton hamburger */}
                        <button 
                            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
                            aria-label="Menu"
                        >
                            <span className="block w-6 h-0.5 bg-white"></span>
                            <span className="block w-6 h-0.5 bg-white"></span>
                            <span className="block w-6 h-0.5 bg-white"></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Audio Player en haut */}
            <div className="border-b border-white">
                <TopAudioPlayer />
            </div>

            {/* Main */}
            <main className="max-w-full px-4 py-8">
                
                {/* Hero Section - 2 cartes côte à côte */}
                <section className="grid md:grid-cols-2 gap-4 mb-12">
                    {/* Carte 1: Dernier show */}
                    <Link href={latestMix?.url || "#"} target="_blank" rel="noopener noreferrer" className="group">
                        <div className="aspect-[4/5] relative border border-white overflow-hidden">
                            {heroCard1Content}
                        </div>
                    </Link>

                    {/* Carte 2: Lecteur Twitch */}
                    <div className="aspect-[4/5] relative border border-white overflow-hidden bg-gray-900">
                        <iframe
                            src="https://player.twitch.tv/?channel=bertarose&parent=still-fm.vercel.app&parent=localhost&muted=false&autoplay=true"
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            allow="autoplay; fullscreen"
                            style={{ border: 'none' }}
                        />
                    </div>
                </section>

                {/* Popular Shows Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-wider">Popular Shows</h2>
                        <a href="https://www.mixcloud.com/StillFM/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-wider border border-white px-4 py-1 hover:bg-white hover:text-black transition-all">
                            See All
                        </a>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Chargement des shows...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {latestShows.map((show: any, index: number) => (
                                <Link href={show.url} key={index} target="_blank" rel="noopener noreferrer" className="group">
                                    <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                        <img 
                                            src={show.img} 
                                            alt={show.title}
                                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                        />
                                    </div>
                                    <h3 className="text-xs uppercase tracking-wide mb-1">{show.title}</h3>
                                    <p className="text-[10px] text-gray-400 tracking-wider">{show.date}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Archive Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-wider">From the Archive</h2>
                        <a href="https://www.mixcloud.com/StillFM/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-wider border border-white px-4 py-1 hover:bg-white hover:text-black transition-all">
                            See All
                        </a>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Grande carte d'archive à gauche */}
                        {featuredArchive ? (
                            <Link href={featuredArchive.url} target="_blank" rel="noopener noreferrer" className="group">
                                <div className="md:col-span-1 aspect-[3/4] relative border border-white overflow-hidden">
                                    <img 
                                        src={featuredArchive.img} 
                                        alt={featuredArchive.title}
                                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                                        <h3 className="text-xs uppercase tracking-wide mb-1 font-bold">{featuredArchive.title}</h3>
                                        <p className="text-[10px] text-gray-400 tracking-wider">{featuredArchive.date}</p>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                             <div className="md:col-span-1 flex items-center justify-center aspect-[3/4] border border-white">
                                <p className="text-xs text-gray-500">Chargement...</p>
                             </div>
                        )}

                        {/* Petite Grille d'Archive (Les 4 shows suivants) */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            {smallArchiveGrid.map((show: any, index: number) => (
                                <Link href={show.url} key={index} target="_blank" rel="noopener noreferrer" className="group">
                                    <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                                        <img 
                                            src={show.img} 
                                            alt={show.title}
                                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                        />
                                    </div>
                                    <h3 className="text-xs uppercase tracking-wide mb-1">{show.title}</h3>
                                    <p className="text-[10px] text-gray-400 tracking-wider">{show.date}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SCHEDULE Preview Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-wider">This Week</h2>
                        <Link href="/schedule" className="text-xs uppercase tracking-wider border border-white px-4 py-1 hover:bg-white hover:text-black transition-all">
                            Full Schedule
                        </Link>
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

            {/* Footer */}
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
