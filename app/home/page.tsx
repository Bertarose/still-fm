'use client'; // Devenu un composant client pour les intéractions

import { useState, useEffect } from 'react';
import TopAudioPlayer from '../components/TopAudioPlayer';
import Link from 'next/link';
import { usePlayer } from '../context/PlayerContext'; // Import du contexte

const LATEST_SHOWS_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=100';
const ARCHIVE_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?since=1640995200&until=1672531199&limit=20';

export default function Home() {
    const { playShow } = usePlayer(); // Hook pour contrôler le player
    const [data, setData] = useState<{ latestMix: any, recentShows: any[], archiveShows: any[] } | null>(null);

    // Fetch data côté client (car nous sommes dans un Client Component)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [latestRes, archiveRes] = await Promise.all([
                    fetch(LATEST_SHOWS_API_URL),
                    fetch(ARCHIVE_API_URL)
                ]);
                
                const latestData = await latestRes.json();
                const archiveData = await archiveRes.json();

                // Helper format
                const format = (mix: any) => ({
                    key: mix.key,
                    title: mix.name,
                    url: mix.url,
                    img: mix.pictures?.extra_large,
                    date: new Date(mix.created_time).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    time: new Date(mix.created_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    tags: mix.tags || []
                });

                const allShows = latestData.data.map(format);
                const archiveShows = archiveData.data.map(format);

                setData({
                    latestMix: allShows[0],
                    recentShows: allShows.slice(1, 15),
                    archiveShows: archiveShows
                });
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">LOADING STILL FM...</div>;

    const { latestMix, recentShows, archiveShows } = data;

    return (
        <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black pb-24">
            
            <div className="crt-screen" />
            
            <header className="sticky top-0 z-50 bg-white text-black border-b border-black text-[11px] font-bold uppercase tracking-wide">
                <div className="flex h-8 items-stretch border-b border-black">
                    <Link href="/home" className="w-32 flex items-center justify-center border-r border-black bg-black text-white px-4 hover:bg-gray-900 transition-colors cursor-pointer">
                        STILL FM
                    </Link>
                    <div className="flex-1 flex items-center overflow-hidden relative bg-white">
                        <div className="animate-marquee whitespace-nowrap absolute">
                            +++ NOW PLAYING: {latestMix?.title} +++ LIVE FROM MONTREAL +++
                        </div>
                    </div>
                    <div className="w-32 flex items-center justify-center border-l border-black bg-[#e0e0e0]">
                        STREAM OFFLINE
                    </div>
                </div>
                <nav className="flex h-8 items-stretch">
                    {['Shows', 'Residents', 'Editorial', 'Shop'].map((item) => (
                        <Link key={item} href={`/${item.toLowerCase()}`} className="flex items-center px-6 border-r border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                            {item}
                        </Link>
                    ))}
                </nav>
            </header>

            <div className="border-b border-gray-800 sticky top-[64px] z-40 bg-black">
                <TopAudioPlayer />
            </div>

            <main className="max-w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-800 h-auto lg:h-[85vh]">
                    
                    {/* HERO SECTION */}
                    <div className="lg:col-span-8 relative border-r border-gray-800 h-[50vh] lg:h-full group overflow-hidden">
                        {/* Le bouton PLAY est l'image elle-même ou un overlay */}
                        <div className="block w-full h-full relative cursor-pointer" onClick={() => playShow(latestMix)}>
                            <img src={latestMix.img} alt="Hero" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <div className="bg-white text-black px-4 py-2 text-sm font-bold uppercase">▶ Play Now</div>
                            </div>
                            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none">
                                <div className="bg-white text-black text-xs inline-block px-2 py-1 mb-4 font-bold">FEATURED</div>
                                <h1 className="text-4xl md:text-6xl font-bold uppercase leading-none mb-2 text-white mix-blend-difference">{latestMix.title}</h1>
                            </div>
                        </div>
                    </div>

                    {/* LISTE DROITE */}
                    <div className="lg:col-span-4 h-full bg-black overflow-y-auto custom-scrollbar">
                        {recentShows.map((show: any, idx: number) => (
                            <div key={idx} className="flex gap-4 p-4 border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors group h-32 relative">
                                {/* Click Image = PLAY */}
                                <div className="w-24 h-24 flex-shrink-0 border border-gray-800 cursor-pointer relative" onClick={() => playShow(show)}>
                                    <img src={show.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">▶</div>
                                </div>
                                {/* Click Title = LINK Mixcloud */}
                                <div className="flex flex-col justify-between overflow-hidden flex-1">
                                    <div>
                                        <a href={show.url} target="_blank" rel="noreferrer" className="text-sm font-bold uppercase leading-tight line-clamp-2 group-hover:text-white text-gray-300 hover:underline">
                                            {show.title}
                                        </a>
                                        <p className="text-[10px] text-gray-500 mt-1">{show.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GRILLE ARCHIVES */}
                <div className="p-4">
                    <h2 className="text-lg font-bold uppercase bg-white text-black px-2 mb-4 mt-8 inline-block">Archive Grid</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {archiveShows.map((show: any, i: number) => (
                            <div key={i} className="group">
                                <div className="aspect-square border border-gray-800 overflow-hidden mb-2 relative cursor-pointer" onClick={() => playShow(show)}>
                                    <img src={show.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="border border-white px-2 py-1 text-[10px] uppercase hover:bg-white hover:text-black">Play</span>
                                    </div>
                                </div>
                                {/* Titre lien vers Mixcloud */}
                                <a href={show.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase truncate text-gray-400 group-hover:text-white hover:underline block">
                                    {show.title}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
