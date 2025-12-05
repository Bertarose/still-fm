'use client';

import { useState } from 'react';

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'live' | 'replays'>('live');

  const liveShows = [
    {
      date: "FRI 06 DEC",
      time: "20:00 - 22:00",
      title: "TECHNO NIGHTS VOL.13",
      resident: "DJ POSER",
      description: "Heavy techno session with industrial undertones. Expect relentless 140+ BPM tracks.",
      status: "LIVE"
    },
    {
      date: "SAT 07 DEC",
      time: "22:00 - 00:00",
      title: "BASS THERAPY #09",
      resident: "SHADOW BASS",
      description: "Drum & Bass special featuring liquid and neurofunk vibes.",
      status: "UPCOMING"
    },
    {
      date: "SUN 08 DEC",
      time: "18:00 - 20:00",
      title: "AMBIENT DRIFT #06",
      resident: "ECHO DRIFT",
      description: "Atmospheric soundscapes and experimental ambient textures.",
      status: "UPCOMING"
    },
    {
      date: "MON 09 DEC",
      time: "21:00 - 23:00",
      title: "HOUSE SESSION",
      resident: "NEON PULSE",
      description: "Deep house and minimal grooves for Monday night.",
      status: "UPCOMING"
    },
    {
      date: "TUE 10 DEC",
      time: "20:00 - 22:00",
      title: "INDUSTRIAL HOUR",
      resident: "VOID RIDER",
      description: "Dark industrial techno with EBM influences.",
      status: "UPCOMING"
    },
    {
      date: "WED 11 DEC",
      time: "19:00 - 21:00",
      title: "ELECTRO BREAKS",
      resident: "PULSE WAVE",
      description: "Breakbeat and electro fusion session.",
      status: "UPCOMING"
    }
  ];

  const replayShows = [
    {
      date: "THU 05 DEC",
      time: "Previously aired",
      title: "BASS THERAPY #08",
      resident: "SHADOW BASS",
      description: "Drum & Bass special featuring liquid and neurofunk vibes.",
      originalDate: "Originally aired: Nov 28, 2024"
    },
    {
      date: "WED 04 DEC",
      time: "Previously aired",
      title: "TECHNO NIGHTS VOL.12",
      resident: "DJ POSER",
      description: "Heavy techno session with industrial undertones.",
      originalDate: "Originally aired: Nov 20, 2024"
    },
    {
      date: "TUE 03 DEC",
      time: "Previously aired",
      title: "HOUSE SESSION",
      resident: "NEON PULSE",
      description: "Deep house and minimal grooves.",
      originalDate: "Originally aired: Nov 15, 2024"
    },
    {
      date: "MON 02 DEC",
      time: "Previously aired",
      title: "AMBIENT DRIFT #05",
      resident: "ECHO DRIFT",
      description: "Atmospheric soundscapes and experimental ambient textures.",
      originalDate: "Originally aired: Nov 10, 2024"
    },
    {
      date: "SUN 01 DEC",
      time: "Previously aired",
      title: "INDUSTRIAL HOUR",
      resident: "VOID RIDER",
      description: "Dark industrial techno with EBM influences.",
      originalDate: "Originally aired: Nov 05, 2024"
    },
    {
      date: "SAT 30 NOV",
      time: "Previously aired",
      title: "ELECTRO BREAKS",
      resident: "PULSE WAVE",
      description: "Breakbeat and electro fusion session.",
      originalDate: "Originally aired: Oct 28, 2024"
    }
  ];

  const displayedShows = activeTab === 'live' ? liveShows : replayShows;

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black pb-12">
      
      <div className="crt-screen" />
      
      <main className="max-w-full">
        
        {/* Header avec Tabs */}
        <div className="border-b border-white">
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 px-6 py-4 text-sm uppercase tracking-wider transition-all border-r border-white ${
                activeTab === 'live'
                  ? 'bg-white text-black font-bold'
                  : 'hover:bg-white hover:text-black'
              }`}
            >
              Live Shows
            </button>
            <button
              onClick={() => setActiveTab('replays')}
              className={`flex-1 px-6 py-4 text-sm uppercase tracking-wider transition-all ${
                activeTab === 'replays'
                  ? 'bg-white text-black font-bold'
                  : 'hover:bg-white hover:text-black'
              }`}
            >
              Replays
            </button>
          </div>
        </div>

        {/* Grid des shows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {displayedShows.map((show, idx) => (
            <div 
              key={idx}
              className="border-b border-r border-white p-6 hover:bg-white hover:text-black transition-all cursor-pointer group"
            >
              {/* Date */}
              <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-50 group-hover:opacity-100">
                {show.date}
              </div>

              {/* Time */}
              <div className="text-sm font-bold uppercase mb-4">
                {show.time}
              </div>

              {/* Live badge (seulement pour les live shows) */}
              {activeTab === 'live' && 'status' in show && show.status === 'LIVE' && (
                <div className="inline-block bg-white text-black group-hover:bg-black group-hover:text-white px-2 py-1 text-[10px] font-bold uppercase mb-3 animate-pulse">
                  ● LIVE NOW
                </div>
              )}

              {/* Replay badge */}
              {activeTab === 'replays' && (
                <div className="inline-block bg-gray-800 text-white group-hover:bg-black px-2 py-1 text-[10px] font-bold uppercase mb-3 border border-white/20">
                  REPLAY
                </div>
              )}

              {/* Title */}
              <h3 className="text-base font-bold uppercase mb-2 leading-tight">
                {show.title}
              </h3>

              {/* Resident */}
              <div className="text-xs uppercase tracking-wider mb-3 opacity-70 group-hover:opacity-100">
                {show.resident}
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed opacity-60 group-hover:opacity-80 mb-3">
                {show.description}
              </p>

              {/* Original Date (pour replays) */}
              {'originalDate' in show && (
                <div className="text-[10px] uppercase opacity-40 group-hover:opacity-60 pt-2 border-t border-white/10">
                  {show.originalDate}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="border-t border-white p-12 text-center">
          <h2 className="text-2xl font-bold uppercase mb-6 tracking-wider">
            Host a Show
          </h2>
          <p className="text-sm opacity-70 mb-6 max-w-2xl mx-auto leading-relaxed">
            Want to broadcast on Still FM? We're always looking for talented residents 
            to join our lineup. Send us your mix and artist profile.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL"
              className="bg-transparent border border-white px-6 py-3 text-xs uppercase tracking-wider placeholder:text-gray-600 focus:outline-none focus:bg-white focus:text-black transition-all w-full md:w-64"
            />
            <button className="border border-white px-8 py-3 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all font-bold w-full md:w-auto">
              Submit Mix
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
