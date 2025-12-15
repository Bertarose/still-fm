'use client';

import { useEffect, useState } from 'react';
import { usePlayer } from '@/app/context/PlayerContext';

const LATEST_SHOWS_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?limit=100';
const ARCHIVE_API_URL = 'https://api.mixcloud.com/StillFM/cloudcasts/?since=1640995200&until=1672531199&limit=20';

export default function Home() {
  const { playShow, isPlaying, togglePlay, isLive, twitchPlayer } = usePlayer();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [latestRes, archiveRes] = await Promise.all([
        fetch(LATEST_SHOWS_API_URL),
        fetch(ARCHIVE_API_URL),
      ]);
      const latestData = await latestRes.json();
      const archiveData = await archiveRes.json();

      const format = (mix: any) => ({
        key: mix.key,
        title: mix.name,
        url: mix.url,
        img: mix.pictures?.extra_large,
        date: new Date(mix.created_time).toLocaleDateString('fr-FR'),
      });

      const allShows = latestData.data.map(format);
      const archiveShows = archiveData.data.map(format);

      setData({ latestMix: allShows[0], recentShows: allShows.slice(1, 15), archiveShows });
    };

    fetchData();
  }, []);

  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">LOADING STILL FM...</div>;

  const { latestMix, recentShows, archiveShows } = data;

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black pb-24">
      <main className="max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-800 h-auto lg:h-[85vh]">

          {/* HERO */}
          <div className="lg:col-span-8 relative border-r border-gray-800 h-[50vh] lg:h-full group overflow-hidden">
            {isLive ? (
              <div id="twitch-embed-home" className="w-full h-full bg-black relative" />
            ) : (
              <div className="cursor-pointer" onClick={() => playShow(latestMix)}>
                <img src={latestMix.img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
            )}
          </div>

          {/* RECENT SHOWS */}
          <div className="lg:col-span-4 h-full bg-black overflow-y-auto custom-scrollbar">
            {recentShows.map((show: any) => (
              <div key={show.key} className="flex gap-4 p-4 border-b border-gray-800 hover:bg-[#1a1a1a] cursor-pointer" onClick={() => playShow(show)}>
                <div className="w-24 h-24 flex-shrink-0 border border-gray-800 relative">
                  <img src={show.img} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100">▶</div>
                </div>
                <div className="flex flex-col justify-between overflow-hidden flex-1">
                  <div>
                    <a href={show.url} target="_blank" rel="noreferrer" className="text-sm font-bold uppercase leading-tight line-clamp-2 hover:text-white">{show.title}</a>
                    <p className="text-[10px] text-gray-500 mt-1">{show.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ARCHIVE */}
        <div className="p-4">
          <h2 className="text-lg font-bold uppercase bg-white text-black px-2 mb-4 mt-8 inline-block">Archive Grid</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {archiveShows.map((show: any) => (
              <div key={show.key} className="group cursor-pointer" onClick={() => playShow(show)}>
                <div className="aspect-square border border-gray-800 overflow-hidden mb-2 relative">
                  <img src={show.img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <span className="border border-white px-2 py-1 text-[10px] uppercase hover:bg-white hover:text-black">Play</span>
                  </div>
                </div>
                <a href={show.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase truncate text-gray-400 hover:text-white block">{show.title}</a>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* RADIO PLAYER FIXED */}
      <div className="fixed bottom-4 right-4 z-50">
        <button onClick={togglePlay} className="px-4 py-2 border border-white/50 text-xs uppercase hover:bg-white hover:text-black transition">
          {isPlaying ? 'Pause Radio' : 'Listen Live'}
        </button>
      </div>
    </div>
  );
}
