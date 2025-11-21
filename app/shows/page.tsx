'use client';

import { useState, useEffect } from 'react';
import TopAudioPlayer from '../components/TopAudioPlayer';
import Link from 'next/link';
import { usePlayer } from '../context/PlayerContext';

const ALL_SHOWS_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=100';

export default function ShowsPage() {
    const { playShow } = usePlayer();
    const [shows, setShows] = useState<any[]>([]);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const res = await fetch(ALL_SHOWS_API_URL);
                const data = await res.json();
                setShows(data.data.map((mix: any) => ({
                    key: mix.key,
                    title: mix.name,
                    url: mix.url,
                    img: mix.pictures?.large,
                    date: new Date(mix.created_time).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                })));
            } catch (e) { console.error(e); }
        };
        fetchShows();
    }, []);

    return (
        <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black">
            <div className="crt-screen" />
            
            <header className="sticky top-0 z-50 bg-white text-black border-b border-black text-[11px] font-bold uppercase tracking-wide">
                <div className="flex h-8 items-stretch border-b border-black">
                    <Link href="/home" className="w-32 flex items-center justify-center border-r border-black bg-black text-white px-4 hover:bg-gray-900 transition-colors cursor-pointer">
                        STILL FM
                    </Link>
                    <div className="flex-1 flex items-center px-4 bg-white">/// ALL BROADCASTS ARCHIVE</div>
                </div>
                <nav className="flex h-8 items-stretch">
                   {['Shows', 'Residents', 'About', 'Shop'].map((item) => (
                        <Link key={item} href={`/${item.toLowerCase()}`} className={`flex items-center px-6 border-r border-black hover:bg-black hover:text-white transition-colors cursor-pointer ${item === 'Shows' ? 'bg-black text-white' : ''}`}>
                            {item}
                        </Link>
                    ))}
                </nav>
            </header>

            <div className="border-b border-gray-800 sticky top-[64px] z-40 bg-black">
                <TopAudioPlayer />
            </div>

            <main className="max-w-full px-4 py-12 relative z-0">
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                    <h1 className="text-4xl font-bold uppercase tracking-tighter italic text-white">Full Archive</h1>
                    <div className="text-xs text-gray-500">{shows.length} TRANSMISSIONS</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                    {shows.map((show: any, index: number) => (
                        <div key={index} className="group block">
                            {/* ACTION 1: CLICK SUR L'IMAGE = JOUER SUR LE SITE */}
                            <div 
                                className="aspect-square relative mb-3 border border-gray-800 overflow-hidden cursor-pointer"
                                onClick={() => playShow(show)}
                            >
                                <img src={show.img} alt={show.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center pl-1 hover:scale-110 transition-transform">
                                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* ACTION 2: CLICK SUR LE TEXTE = LIEN EXTERNE MIXCLOUD */}
                            <div className="pr-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] text-white bg-gray-800 px-1 font-bold">{show.date}</span>
                                </div>
                                <a 
                                    href={show.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[10px] md:text-xs font-bold uppercase leading-tight text-gray-300 group-hover:text-white transition-colors line-clamp-2 hover:underline"
                                >
                                    {show.title}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
