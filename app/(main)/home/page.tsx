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
        const online = !text.toLowerCase().includes('offline') && !text.toLowerCase().includes('error');
        console.log('🔴 Homepage Twitch status:', online ? 'ONLINE ✅' : 'OFFLINE ⚫');
        setIsLive(online);
      } catch (e) {
        console.error('Erreur Twitch API:', e);
        setIsLive(false);
      }
    };

    checkTwitchStatus();
    const interval = setInterval(checkTwitchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Initialisation du player Twitch ---
  useEffect(() => {
    // Ne pas initialiser si pas live ou déjà initialisé
    if (!isLive || playerInitialized.current) return;

    const initTwitch = () => {
      const embedDiv = document.getElementById('twitch-embed-home');
      
      if (!(window as any).Twitch || !embedDiv) {
        console.log('⏳ Waiting for Twitch script or embed div...');
        return;
      }

      console.log('🎥 Initializing Twitch player on homepage...');

      const parents = [window.location.hostname, 'localhost', '127.0.0.1', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com'];

      try {
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
        playerInitialized.current = true;

        player.addEventListener((window as any).Twitch.Player.READY, () => {
          console.log('✅ Twitch player ready on homepage');
        });

        player.addEventListener((window as any).Twitch.Player.ONLINE, () => {
          console.log('🔴 Twitch: ONLINE');
          setIsLive(true);
        });
        
        player.addEventListener((window as any).Twitch.Player.OFFLINE, () => {
          console.log('⚫ Twitch: OFFLINE');
          setIsLive(false);
        });
      } catch (error) {
        console.error('❌ Twitch player init error:', error);
      }
    };

    // Charger le script Twitch si nécessaire
    if (!(window as any).Twitch) {
      const script = document.createElement('script');
      script.src = 'https://player.twitch.tv/js/embed/v1.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Twitch script loaded');
        // Attendre un peu que le DOM soit prêt
        setTimeout(initTwitch, 500);
      };
      document.body.appendChild(script);
    } else {
      // Attendre un peu que le DOM soit prêt
      setTimeout(initTwitch, 500);
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
            <div className="flex items-center justify-center gap-8 mb-8">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/stillfm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Mixcloud */}
              <a 
                href="https://www.mixcloud.com/StillFM/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Mixcloud"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.462 8.596l1.372 6.49h.319l1.372-6.49h1.303v8h-.966v-5.743l-1.24 5.743h-.857l-1.24-5.743v5.743h-.966v-8h1.303zm6.654 0v8h-.966v-8h.966zm5.981 0l1.91 5.122 1.91-5.122h1.282l-2.656 7.252c-.385 1.037-1.13 1.555-2.235 1.555-.205 0-.438-.027-.697-.082v-.885c.205.041.41.062.615.062.656 0 1.073-.287 1.25-.861l.287-.82-2.284-6.221h1.303zm-4.654 0c1.497 0 2.656.629 2.656 2.132 0 1.538-1.159 2.132-2.656 2.132h-1.046v3.736h-.966v-8h2.012zm-.082 3.378c.902 0 1.722-.246 1.722-1.246s-.82-1.246-1.722-1.246h-.964v2.492h.964z"/>
                </svg>
              </a>

              {/* Soundcloud */}
              <a 
                href="https://soundcloud.com/stillfm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Soundcloud"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.051 0-.09.04-.099.099l-.135 1.326.135 1.265c.009.058.048.099.099.099.05 0 .09-.04.099-.099l.15-1.265-.15-1.326c-.009-.059-.05-.099-.099-.099m1.798-.551c-.06 0-.111.051-.12.111l-.21 1.877.21 1.814c.009.06.06.113.12.113.06 0 .111-.051.12-.113l.239-1.814-.24-1.877c0-.06-.051-.111-.119-.111m.899-.146c-.06 0-.11.05-.129.117l-.194 2.024.194 1.918c.009.067.069.117.129.117s.111-.05.129-.117l.21-1.918-.21-2.024c-.009-.067-.069-.117-.129-.117m.9-.07c-.07 0-.13.06-.139.135l-.179 2.094.179 2.035c.009.075.069.135.139.135.069 0 .129-.06.139-.135l.193-2.035-.193-2.094c-.01-.075-.07-.135-.139-.135m.899.04c-.07 0-.13.058-.149.133l-.164 2.054.164 2.035c.009.075.069.135.149.135.069 0 .129-.06.138-.135l.18-2.035-.18-2.054c0-.075-.059-.133-.138-.133m.899-.11c-.08 0-.139.06-.159.141l-.15 2.163.15 2.095c.009.075.069.135.159.135.079 0 .139-.06.158-.135l.165-2.095-.165-2.163c-.009-.081-.069-.141-.158-.141m.899.13c-.08 0-.149.068-.169.148l-.135 2.033.135 2.073c.01.08.079.147.169.147.08 0 .14-.067.159-.147l.15-2.073-.15-2.033c-.009-.08-.069-.148-.159-.148m.81-.14c-.09 0-.16.07-.179.153l-.12 2.173.12 2.082c.009.081.079.152.179.152.08 0 .149-.071.159-.152l.135-2.082-.135-2.173c-.01-.083-.069-.153-.159-.153m.898.15c-.09 0-.168.075-.179.165l-.104 2.023.104 2.065c.011.09.089.165.179.165.09 0 .158-.075.169-.165l.119-2.065-.119-2.023c-.011-.09-.079-.165-.169-.165m.9-.082c-.099 0-.179.081-.189.18l-.09 2.105.09 2.063c.01.099.09.18.189.18.09 0 .169-.081.179-.18l.105-2.063-.105-2.105c-.01-.099-.089-.18-.179-.18m.899.098c-.099 0-.179.089-.189.189l-.075 2.007.075 2.044c.01.1.09.188.189.188.1 0 .18-.089.189-.188l.09-2.044-.09-2.007c-.009-.1-.089-.189-.189-.189m.9-.199c-.11 0-.189.099-.199.199l-.061 2.206.061 2.024c.01.101.089.199.199.199.1 0 .179-.098.189-.199l.075-2.024-.075-2.206c-.01-.1-.089-.199-.189-.199m.899.106c-.11 0-.199.106-.209.216l-.045 2.1.045 2.029c.01.11.099.211.209.211.11 0 .189-.101.199-.211l.06-2.029-.06-2.1c-.01-.11-.089-.216-.199-.216m.899-.09c-.11 0-.199.099-.21.209l-.029 2.19.029 2.027c.011.11.1.21.21.21.11 0 .189-.1.199-.21l.045-2.027-.045-2.19c-.01-.11-.089-.209-.199-.209m.9.065c-.12 0-.21.109-.21.219l-.015 2.125.015 2.015c0 .12.09.219.21.219.11 0 .2-.099.21-.219l.03-2.015-.03-2.125c-.01-.11-.1-.219-.21-.219m.899-.053c-.12 0-.21.113-.21.223v4.14c0 .12.09.225.21.225.11 0 .2-.105.21-.225v-4.14c0-.11-.1-.223-.21-.223m.899.048c-.12 0-.209.118-.209.228l-.015 2.138.015 1.996c0 .12.089.228.209.228.12 0 .21-.108.21-.228l.015-1.996-.015-2.138c0-.11-.09-.228-.21-.228m.9-.15c-.13 0-.219.125-.219.235l-.015 2.288.015 1.972c0 .13.089.239.219.239.121 0 .21-.109.21-.239l.016-1.972-.016-2.288c0-.11-.089-.235-.21-.235"/>
                </svg>
              </a>

              {/* Twitch */}
              <a 
                href="https://www.twitch.tv/bertarose" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitch"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
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
