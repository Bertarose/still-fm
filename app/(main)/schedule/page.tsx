'use client';

import { useState } from 'react';

export default function SchedulePage() {
  const {activeTab === 'live' && 'status' in show && show.status === 'LIVE' && (

  // LIVE SHOWS (émissions en direct programmées)
  const liveShows = [
    {
      date: "FRI 06 DEC",
      time: "20:00 - 22:00",
      title: "TECHNO NIGHTS",
      resident: "DJ POSER",
      description: "Heavy techno session with industrial undertones. Deep, dark, relentless.",
      status: "LIVE"
    },
    {
      date: "SAT 07 DEC",
      time: "22:00 - 00:00",
      title: "BASS THERAPY",
      resident: "SHADOW BASS",
      description: "Drum & bass assault. Liquid rollers to jump-up mayhem. No mercy.",
      status: "UPCOMING"
    },
    {
      date: "SUN 08 DEC",
      time: "18:00 - 20:00",
      title: "HOUSE SESSION",
      resident: "NEON PULSE",
      description: "Classic house vibes. Disco samples, acid basslines, Chicago soul.",
      status: "UPCOMING"
    },
    {
      date: "WED 11 DEC",
      time: "21:00 - 23:00",
      title: "INDUSTRIAL HOUR",
      resident: "VOID RIDER",
      description: "Grinding gears and broken machines. EBM, power electronics, noise.",
      status: "UPCOMING"
    },
    {
      date: "THU 12 DEC",
      time: "19:00 - 21:00",
      title: "AMBIENT DRIFT",
      resident: "ECHO DRIFT",
      description: "Textural soundscapes for late night introspection. Drone, field recordings.",
      status: "UPCOMING"
    },
    {
      date: "FRI 13 DEC",
      time: "23:00 - 01:00",
      title: "ELECTRO BREAKS",
      resident: "PULSE WAVE",
      description: "Miami bass meets Detroit electro. 808 kicks, vocoders, breakbeats.",
      status: "UPCOMING"
    },
  ];

  // REPLAYS (rediffusions d'anciennes émissions)
  const replays = [
    {
      date: "MON 09 DEC",
      time: "14:00 - 16:00",
      title: "TECHNO NIGHTS",
      resident: "DJ POSER",
      description: "Replay from Nov 22. Heavy techno session with industrial undertones.",
      originalDate: "Originally aired: NOV 22"
    },
    {
      date: "TUE 10 DEC",
      time: "16:00 - 18:00",
      title: "HOUSE SESSION",
      resident: "NEON PULSE",
      description: "Replay from Nov 24. Classic house vibes with disco samples.",
      originalDate: "Originally aired: NOV 24"
    },
    {
      date: "WED 11 DEC",
      time: "15:00 - 17:00",
      title: "BASS THERAPY",
      resident: "SHADOW BASS",
      description: "Replay from Nov 30. Drum & bass assault from liquid to jump-up.",
      originalDate: "Originally aired: NOV 30"
    },
    {
      date: "THU 12 DEC",
      time: "13:00 - 15:00",
      title: "AMBIENT DRIFT",
      resident: "ECHO DRIFT",
      description: "Replay from Nov 28. Textural soundscapes and field recordings.",
      originalDate: "Originally aired: NOV 28"
    },
    {
      date: "FRI 13 DEC",
      time: "16:00 - 18:00",
      title: "INDUSTRIAL HOUR",
      resident: "VOID RIDER",
      description: "Replay from Dec 04. EBM, power electronics, and industrial noise.",
      originalDate: "Originally aired: DEC 04"
    },
    {
      date: "SAT 14 DEC",
      time: "14:00 - 16:00",
      title: "ELECTRO BREAKS",
      resident: "PULSE WAVE",
      description: "Replay from Nov 29. Miami bass meets Detroit electro.",
      originalDate: "Originally aired: NOV 29"
    },
  ];

  const currentShows = activeTab === 'live' ? liveShows : replays;

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black pb-12">
      
      <div className="crt-screen" />
      
      <main className="max-w-full">
        
        {/* Header avec onglets */}
        <div className="border-b border-white">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold uppercase tracking-wider">
              Schedule
            </h1>
            
            {/* Tabs */}
            <div className="flex gap-0 border border-white">
              <button
                onClick={() => setActiveTab('live')}
                className={`
                  px-6 py-2 text-xs uppercase tracking-wider transition-all
                  ${activeTab === 'live' 
                    ? 'bg-white text-black' 
                    : 'bg-black text-white hover:bg-white hover:text-black'
                  }
                `}
              >
                Live Shows
              </button>
              <button
                onClick={() => setActiveTab('replays')}
                className={`
                  px-6 py-2 text-xs uppercase tracking-wider border-l border-white transition-all
                  ${activeTab === 'replays' 
                    ? 'bg-white text-black' 
                    : 'bg-black text-white hover:bg-white hover:text-black'
                  }
                `}
              >
                Replays
              </button>
            </div>
          </div>
        </div>

        {/* Grid de shows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentShows.map((show, idx) => (
            <div 
              key={idx}
              className="border-b border-r border-white p-6 hover:bg-white hover:text-black transition-colors group cursor-pointer"
            >
              {/* Live badge (seulement pour les live shows) */}
              {activeTab === 'live' && show.status === 'LIVE' && (
                <div className="inline-block bg-white text-black group-hover:bg-black group-hover:text-white px-2 py-1 text-[10px] font-bold uppercase mb-3 animate-pulse">
                  ● LIVE NOW
                </div>
              )}

              {/* Replay badge */}
              {activeTab === 'replays' && (
                <div className="inline-block border border-white group-hover:border-black px-2 py-1 text-[10px] font-bold uppercase mb-3">
                  REPLAY
                </div>
              )}

              {/* Titre */}
              <h2 className="text-lg font-bold uppercase mb-2 leading-tight">
                {show.title}
              </h2>

              {/* Resident */}
              <div className="text-sm uppercase mb-3 opacity-70 group-hover:opacity-100">
                {show.resident}
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed mb-3 opacity-80 group-hover:opacity-100">
                {show.description}
              </p>

              {/* Original date (pour replays) */}
              {activeTab === 'replays' && 'originalDate' in show && (
                <div className="text-[9px] uppercase tracking-wider opacity-50 group-hover:opacity-70 mb-2">
                  {show.originalDate}
                </div>
              )}

              {/* Date & Time */}
              <div className="text-[10px] uppercase tracking-wider opacity-50 group-hover:opacity-70">
                {show.date} / {show.time}
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun show */}
        {currentShows.length === 0 && (
          <div className="border-b border-white p-12 text-center">
            <p className="text-sm uppercase opacity-50">
              No {activeTab === 'live' ? 'live shows' : 'replays'} scheduled
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="border-t border-white p-6 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold uppercase mb-4 tracking-wider">
              Host a Show
            </h2>
            <p className="text-sm mb-6 leading-relaxed opacity-80">
              Got an idea? Want to share your music? We're open to proposals. 
              Send us your concept and let's make it happen.
            </p>
            <a 
              href="mailto:schedule@still.fm"
              className="inline-block border border-white px-6 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
            >
              Propose a Show →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
