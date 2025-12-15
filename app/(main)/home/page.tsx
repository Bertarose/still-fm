'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';

const LATEST_SHOWS_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=100';
const ARCHIVE_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?since=1640995200&until=1672531199&limit=20';

export default function Home() {
  const { playShow } = usePlayer();
  const [data, setData] = useState<{ latestMix: any, recentShows: any[], archiveShows: any[] } | null>(null);

  // --- Twitch Live Status ---
  const [isLive, setIsLive] = useState(false);  
  const playerInitialized = useRef(false);
  const twitchPlayerRef = useRef<any>(null);

  // Vérification Twitch via API comme source de secours
  useEffect(() => {
    const checkTwitchViaAPI = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();
        setIsLive(!text.toLowerCase().includes('offline') && !text.toLowerCase().includes('error'));
      } catch (e) {
        console.error("Erreur Twitch API:", e);
      }
    };

    const initialTimeout = setTimeout(checkTwitchViaAPI, 3000);
    const interval = setInterval(checkTwitchViaAPI, 60000);
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Initialisation Twitch Player
  useEffect(() => {
    if (playerInitialized.current || !isLive) return;

    const initTwitchPlayer = () => {
      if (playerInitialized.current) return;
      const embedEl = document.getElementById('twitch-embed-home');
      if ((window as any).Twitch && embedEl) {
        playerInitialized.current = true;
        const parents = ['localhost', '127.0.0.1', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com', window.location.hostname];
        const player = new (window as any).Twitch.Player('twitch-embed-home', {
          width: '100%',
          height: '100%',
          channel: 'bertarose',
          parent: parents,
          autoplay: true,
          muted: false,
          controls: true,
        });
        twitchPlayerRef.current = player;

        player.addEventListener((window as any).Twitch.Player.READY, () => {
          const playPromise = player.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch((err: any) => console.warn('Twitch play failed (autoplay restriction):', err));
          }
        });

        player.addEventListener((window as any).Twitch.Player.ONLINE, () => setIsLive(true));
      }
    };

    if (!(window as any).Twitch) {
      if (!document.getElementById('twitch-js')) {
        const script = document.createElement('script');
        script.id = 'twitch-js';
        script.src = 'https://player.twitch.tv/js/embed/v1.js';
        script.async = true;
        script.onload = initTwitchPlayer;
        document.body.appendChild(script);
      }
    } else {
      initTwitchPlayer();
    }

    return () => {
      if (twitchPlayerRef.current && typeof twitchPlayerRef.current.destroy === 'function') {
        twitchPlayerRef.current.destroy();
        twitchPlayerRef.current = null;
        playerInitialized.current = false;
      }
    };
  }, [isLive]);

  // Fetch Mixcloud
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, archiveRes] = await Promise.all([
          fetch(LATEST_SHOWS_API_URL),
          fetch(ARCHIVE_API_URL)
        ]);
        const latestData = await latestRes.json();
        const archiveData = await archiveRes.json();

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

  const heroContent = isLive ? (
    <div id="twitch-embed-home" className="w-full h-full bg-black relative">
      <div className="absolute top-0 left-0 p-4 z-10">
        <div className="bg-red-600 text-white text-xs inline-block px-2 py-1 font-bold animate-pulse">
          🔴 LIVE STREAM
        </div>
      </div>
    </div>
  ) : (
    <div className="block w-full h-full relative group overflow-hidden">
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
  );

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black pb-24 relative">
      {/* BADGE LIVE / OFFLINE */}
      <div className="absolute top-4 right-4 z-30">
        <div className={`w-28 md:w-40 flex items-center justify-center border-l border-black
            text-[8px] md:text-[11px] font-bold uppercase tracking-wide shrink-0
            ${isLive ? 'bg-green-600 text-white' : 'bg-gray-400 text-black'}`}>
          <span className="hidden md:inline">{isLive ? 'STREAM ONLINE' : 'STREAM OFFLINE'}</span>
          <span className="md:hidden">{isLive ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>

      <main className="max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-800 h-auto lg:h-[85vh]">
          <div className="lg:col-span-8 relative border-r border-gray-800 h-[50vh] lg:h-full group overflow-hidden">
            {heroContent}
          </div>
          <div className="lg:col-span-4 h-full bg-black overflow-y-auto custom-scrollbar">
            {recentShows.map((show: any, idx: number) => (
              <div key={idx} className="flex gap-4 p-4 border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors group h-32 relative">
                <div className="w-24 h-24 flex-shrink-0 border border-gray-800 cursor-pointer relative" onClick={() => playShow(show)}>
                  <img src={show.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">▶</div>
                </div>
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
