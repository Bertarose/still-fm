'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';

const LATEST_SHOWS_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=100';

export default function Home() {
  const { playShow } = usePlayer();

  const [data, setData] = useState<{ 
    featuredShow: any; 
    staffPicks: any[]; 
    recentShows: any[];
    upcomingShows: any[];
  } | null>(null);
  const [isLive, setIsLive] = useState(false);

  const playerInitialized = useRef(false);
  const twitchPlayerRef = useRef<any>(null);

  // --- Vérification du statut Twitch via API ---
  useEffect(() => {
    const checkTwitchStatus = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();
        setIsLive(!text.toLowerCase().includes('offline') && !text.toLowerCase().includes('error'));
      } catch (e) {
        console.error('Erreur Twitch API:', e);
      }
    };

    checkTwitchStatus();
    const interval = setInterval(checkTwitchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Initialisation du player Twitch ---
  useEffect(() => {
    if (!isLive || playerInitialized.current) return;

    const initTwitch = () => {
      if (!(window as any).Twitch || !document.getElementById('twitch-embed-home')) return;

      const parents = [window.location.hostname, 'localhost', '127.0.0.1', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com'];

      const player = new (window as any).Twitch.Player('twitch-embed-home', {
        width: '100%',
        height: '100%',
        channel: 'bertarose',
        parent: parents,
        autoplay: false,
        muted: false,
        controls: true,
      });

      twitchPlayerRef.current = player;
      playerInitialized.current = true;

      player.addEventListener((window as any).Twitch.Player.ONLINE, () => setIsLive(true));
      player.addEventListener((window as any).Twitch.Player.OFFLINE, () => setIsLive(false));
    };

    if (!(window as any).Twitch) {
      const script = document.createElement('script');
      script.src = 'https://player.twitch.tv/js/embed/v1.js';
      script.async = true;
      script.onload = initTwitch;
      document.body.appendChild(script);
    } else {
      initTwitch();
    }

    return () => {
      if (twitchPlayerRef.current?.destroy) {
        twitchPlayerRef.current.destroy();
        twitchPlayerRef.current = null;
        playerInitialized.current = false;
      }
    };
  }, [isLive]);

  // --- Fetch Mixcloud + Upcoming Shows ---
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const [latestRes] = await Promise.all([fetch(LATEST_SHOWS_API_URL)]);
        const latestData = await latestRes.json();

        const formatShow = (mix: any) => ({
          key: mix.key,
          title: mix.name,
          url: mix.url,
          img: mix.pictures?.extra_large,
          date: new Date(mix.created_time).toLocaleDateString('fr-FR'),
        });

        // Featured show (le dernier)
        const featuredShow = formatShow(latestData.data[0]);

        // Staff Picks - Sélection manuelle des 8 meilleurs shows (indexes 1-8)
        const staffPicks = latestData.data.slice(1, 9).map(formatShow);

        // Recent shows (pour la sidebar)
        const recentShows = latestData.data.slice(9, 24).map(formatShow);

        // Upcoming shows (données statiques pour l'instant - tu pourras les remplacer par une API)
        const upcomingShows = [
          {
            date: "FRI 20 DEC",
            time: "20:00 - 22:00",
            title: "TECHNO NIGHTS VOL.14",
            resident: "DJ POSER",
            status: "UPCOMING"
          },
          {
            date: "SAT 21 DEC",
            time: "22:00 - 00:00",
            title: "BASS THERAPY #10",
            resident: "SHADOW BASS",
            status: "UPCOMING"
          },
          {
            date: "SUN 22 DEC",
            time: "18:00 - 20:00",
            title: "AMBIENT DRIFT #07",
            resident: "ECHO DRIFT",
            status: "UPCOMING"
          },
          {
            date: "MON 23 DEC",
            time: "21:00 - 23:00",
            title: "HOUSE SESSION",
            resident: "NEON PULSE",
            status: "UPCOMING"
          },
        ];

        setData({
          featuredShow,
          staffPicks,
          recentShows,
          upcomingShows
        });
      } catch (e) {
        console.error('Erreur fetch Mixcloud:', e);
      }
    };

    fetchShows();
  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
        LOADING STILL FM...
      </div>
    );

  const { featuredShow, staffPicks, recentShows, upcomingShows } = data;

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black pb-24">
      <main className="max-w-full">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-800 h-auto lg:h-[85vh]">
          
          {/* FEATURED - Left */}
          <div className="lg:col-span-8 relative border-r border-gray-800 h-[50vh] lg:h-full group overflow-hidden">
            {isLive ? (
              <div id="twitch-embed-home" className="w-full h-full bg-black relative">
                <div className="absolute top-0 right-0 p-2 z-20">
                  <div className="w-28 md:w-40 flex items-center justify-center border-l border-black text-[8px] md:text-[11px] font-bold uppercase tracking-wide shrink-0 bg-green-600 text-white">
                    <span className="hidden md:inline">STREAM ONLINE</span>
                    <span className="md:hidden">ONLINE</span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="block w-full h-full relative group overflow-hidden cursor-pointer"
                onClick={() => playShow(featuredShow)}
              >
                <img
                  src={featuredShow.img}
                  alt="Hero"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="bg-white text-black px-4 py-2 text-sm font-bold uppercase">▶ Play Now</div>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none">
                  <div className="bg-white text-black text-xs inline-block px-2 py-1 mb-4 font-bold">FEATURED</div>
                  <h1 className="text-4xl md:text-6xl font-bold uppercase leading-none mb-2 text-white mix-blend-difference">
                    {featuredShow.title}
                  </h1>
                </div>
              </div>
            )}
          </div>

          {/* RECENT RELEASES - Right Sidebar */}
          <div className="lg:col-span-4 h-full bg-black overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 bg-black border-b border-gray-800 p-3 z-10">
              <h2 className="text-xs font-bold uppercase tracking-wider">Recent Releases</h2>
            </div>
            {recentShows.map((show: any, idx: number) => (
              <div
                key={idx}
                className="flex gap-4 p-4 border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors group h-32 relative"
              >
                <div
                  className="w-24 h-24 flex-shrink-0 border border-gray-800 cursor-pointer relative"
                  onClick={() => playShow(show)}
                >
                  <img
                    src={show.img}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    ▶
                  </div>
                </div>
                <div className="flex flex-col justify-between overflow-hidden flex-1">
                  <div>
                    <a
                      href={show.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold uppercase leading-tight line-clamp-2 group-hover:text-white text-gray-300 hover:underline"
                    >
                      {show.title}
                    </a>
                    <p className="text-[10px] text-gray-500 mt-1">{show.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STAFF PICKS SECTION */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold uppercase bg-white text-black px-3 py-1 inline-block mb-2">
                Staff Picks
              </h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Recent radio highlights hand picked by Still FM
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {staffPicks.map((show: any, i: number) => (
              <div key={i} className="group">
                <div
                  className="aspect-square border border-gray-800 overflow-hidden mb-3 relative cursor-pointer bg-black"
                  onClick={() => playShow(show)}
                >
                  <img
                    src={show.img}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <a
                  href={show.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold uppercase leading-tight text-gray-400 group-hover:text-white hover:underline block line-clamp-2 mb-1"
                >
                  {show.title}
                </a>
                <p className="text-[10px] text-gray-600">{show.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING SHOWS SECTION */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold uppercase bg-white text-black px-3 py-1 inline-block mb-2">
              Upcoming Shows
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Next shows on Still FM Radio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingShows.map((show, idx) => (
              <div 
                key={idx}
                className="border border-gray-800 p-5 hover:bg-white hover:text-black transition-all group"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-50 group-hover:opacity-100">
                  {show.date}
                </div>

                <div className="text-xs font-bold uppercase mb-3">
                  {show.time}
                </div>

                <h3 className="text-sm font-bold uppercase mb-2 leading-tight">
                  {show.title}
                </h3>

                <div className="text-xs uppercase tracking-wider opacity-70 group-hover:opacity-100">
                  {show.resident}
                </div>
              </div>
            ))}
          </div>

          {/* CTA vers Schedule */}
          <div className="text-center mt-8">
            <a
              href="/schedule"
              className="inline-block border border-white px-8 py-3 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all font-bold"
            >
              View Full Schedule →
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-gray-800 mt-12 px-6 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Free. No Ads. 24/7 */}
            <div className="text-center mb-8">
              <div className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-4">
                FREE. NO ADS. 24/7
              </div>
              <p className="text-sm text-gray-500">
                Independent underground radio from Montreal
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <a 
                href="https://www.instagram.com/stillfm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-white transition-colors"
                aria-label="Instagram"
              >
                📷
              </a>
              <a 
                href="https://www.mixcloud.com/StillFM/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-white transition-colors"
                aria-label="Mixcloud"
              >
                ☁️
              </a>
              <a 
                href="https://soundcloud.com/stillfm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-white transition-colors"
                aria-label="Soundcloud"
              >
                🎵
              </a>
              <a 
                href="https://www.twitch.tv/bertarose" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-white transition-colors"
                aria-label="Twitch"
              >
                📺
              </a>
            </div>

            {/* Copyright */}
            <p className="text-[10px] text-gray-600 text-center uppercase tracking-wider">
              © 2025 STILL FM — Montreal Underground Radio
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}
