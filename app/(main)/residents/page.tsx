'use client';

import { useState } from 'react';

const residents = [
  {
    name: "DJ POSER",
    genre: "TECHNO / INDUSTRIAL",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=1200&fit=crop",
    bio: "Heavy techno and industrial sounds from the underground. Known for pushing boundaries and creating intense sonic experiences.",
    social: "https://www.instagram.com/djposer"
  },
  {
    name: "SHADOW BASS",
    genre: "DRUM & BASS",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=1200&fit=crop",
    bio: "Deep, dark drum & bass with a focus on sub-bass frequencies and atmospheric textures.",
    social: "https://www.instagram.com/shadowbass"
  },
  {
    name: "NEON PULSE",
    genre: "ELECTRO / SYNTHWAVE",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=1200&fit=crop",
    bio: "Retro-futuristic electro and synthwave with a modern twist. Neon-soaked soundscapes and pulsing rhythms.",
    social: "https://www.instagram.com/neonpulse"
  },
  {
    name: "VOID RIDER",
    genre: "AMBIENT / EXPERIMENTAL",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=1200&fit=crop",
    bio: "Experimental ambient soundscapes exploring the void between sound and silence.",
    social: "https://www.instagram.com/voidrider"
  },
  {
    name: "ECHO DRIFT",
    genre: "DUB TECHNO",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=1200&fit=crop",
    bio: "Deep dub techno with echoing delays and hypnotic grooves. Music for the late night.",
    social: "https://www.instagram.com/echodrift"
  },
  {
    name: "PULSE WAVE",
    genre: "ACID HOUSE",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=1200&fit=crop",
    bio: "Classic acid house with squelchy 303 basslines and driving four-to-the-floor beats.",
    social: "https://www.instagram.com/pulsewave"
  },
  {
    name: "DARK MATTER",
    genre: "INDUSTRIAL TECHNO",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=1200&fit=crop",
    bio: "Heavy industrial techno from the darkest corners of the dance floor.",
    social: "https://www.instagram.com/darkmatter"
  },
  {
    name: "COSMIC NOISE",
    genre: "NOISE / EXPERIMENTAL",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=1200&fit=crop",
    bio: "Pure noise experimentation pushing the boundaries of what music can be.",
    social: "https://www.instagram.com/cosmicnoise"
  },
  {
    name: "LUNAR PHASE",
    genre: "DOWNTEMPO / TRIP HOP",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1200&h=1200&fit=crop",
    bio: "Moody downtempo and trip hop for introspective journeys.",
    social: "https://www.instagram.com/lunarphase"
  },
  {
    name: "STEEL DRUM",
    genre: "BREAKBEAT / JUNGLE",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&h=1200&fit=crop",
    bio: "Fast-paced breakbeat and jungle rhythms with heavy bass.",
    social: "https://www.instagram.com/steeldrum"
  },
  {
    name: "GHOST SIGNAL",
    genre: "MINIMAL TECHNO",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&h=1200&fit=crop",
    bio: "Stripped-back minimal techno with haunting atmospheres.",
    social: "https://www.instagram.com/ghostsignal"
  },
  {
    name: "FREQUENCY X",
    genre: "ELECTRO / BREAKS",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=1200&fit=crop",
    bio: "High-energy electro and breakbeat fusion.",
    social: "https://www.instagram.com/frequencyx"
  },
  {
    name: "ACID RAIN",
    genre: "ACID TECHNO",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=1200&fit=crop",
    bio: "Acidic techno with twisted 303 lines and relentless energy.",
    social: "https://www.instagram.com/acidrain"
  },
  {
    name: "BINARY STAR",
    genre: "IDM / GLITCH",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=1200&fit=crop",
    bio: "Intelligent dance music with glitchy textures and complex rhythms.",
    social: "https://www.instagram.com/binarystar"
  },
  {
    name: "VOLTAGE DROP",
    genre: "ELECTRO HOUSE",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=1200&fit=crop",
    bio: "Peak-time electro house with massive drops and infectious energy.",
    social: "https://www.instagram.com/voltagedrop"
  },
  {
    name: "SUBSONIC",
    genre: "DUBSTEP / BASS",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=1200&fit=crop",
    bio: "Deep dubstep with earth-shaking sub-bass frequencies.",
    social: "https://www.instagram.com/subsonic"
  },
  {
    name: "CIRCUIT BREAKER",
    genre: "HARDCORE / GABBER",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=1200&fit=crop",
    bio: "Relentless hardcore and gabber beats at breakneck speeds.",
    social: "https://www.instagram.com/circuitbreaker"
  },
  {
    name: "FROST BYTE",
    genre: "CHIPTUNE / 8BIT",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=1200&fit=crop",
    bio: "Retro chiptune and 8-bit sounds with a modern edge.",
    social: "https://www.instagram.com/frostbyte"
  },
  {
    name: "OBSIDIAN",
    genre: "DARK AMBIENT",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=1200&fit=crop",
    bio: "Deep, dark ambient soundscapes for late night contemplation.",
    social: "https://www.instagram.com/obsidian"
  },
  {
    name: "REVERB CITY",
    genre: "TECHNO / HOUSE",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1200&h=1200&fit=crop",
    bio: "Classic techno and house with lush reverb and delay.",
    social: "https://www.instagram.com/reverbcity"
  },
  {
    name: "PLASMA WAVE",
    genre: "TRANCE / PSY",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&h=1200&fit=crop",
    bio: "Hypnotic trance and psytrance for transcendent dance floor experiences.",
    social: "https://www.instagram.com/plasmawave"
  },
  {
    name: "CHROME SOUL",
    genre: "TECHNO / FUNK",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&h=1200&fit=crop",
    bio: "Funky techno grooves with a futuristic chrome finish.",
    social: "https://www.instagram.com/chromesoul"
  },
  {
    name: "PIXEL DUST",
    genre: "FUTURE BASS",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=1200&fit=crop",
    bio: "Colorful future bass with glitchy textures and emotional melodies.",
    social: "https://www.instagram.com/pixeldust"
  },
  {
    name: "NEBULA DRIFT",
    genre: "SPACE DISCO",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=1200&fit=crop",
    bio: "Cosmic disco journeys through space and time.",
    social: "https://www.instagram.com/nebuladrift"
  },
  {
    name: "IRON GATE",
    genre: "EBM / INDUSTRIAL",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=1200&fit=crop",
    bio: "Electronic body music with industrial strength and precision.",
    social: "https://www.instagram.com/irongate"
  }
];

export default function ResidentsPage() {
  const [selectedResident, setSelectedResident] = useState(residents[0]);

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black">
      
      <div className="crt-screen" />
      
      <main className="h-screen flex flex-col">
        
        {/* Header */}
        <div className="border-b border-white px-6 py-4">
          <h1 className="text-xl font-bold uppercase tracking-wider">
            Residents ({residents.length})
          </h1>
        </div>

        {/* Content Grid : Hero (gauche) + Liste scrollable (droite) */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          
          {/* HERO - 9 colonnes */}
          <div className="col-span-9 border-r border-white flex flex-col">
            
            {selectedResident && (
              <>
                {/* Image */}
                <div className="flex-1 relative overflow-hidden">
                  <img 
                    src={selectedResident.image}
                    alt={selectedResident.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  
                  {/* Overlay avec info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8">
                    <h2 className="text-4xl font-bold uppercase tracking-wider mb-2">
                      {selectedResident.name}
                    </h2>
                    <p className="text-sm uppercase tracking-wider opacity-70 mb-4">
                      {selectedResident.genre}
                    </p>
                    <p className="text-sm leading-relaxed opacity-90 max-w-2xl mb-4">
                      {selectedResident.bio}
                    </p>
                    <a 
                      href={selectedResident.social}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs uppercase tracking-wider border border-white px-4 py-2 hover:bg-white hover:text-black transition-all"
                    >
                      Follow →
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* LISTE SCROLLABLE - 3 colonnes */}
          <div className="col-span-3 overflow-y-auto">
            {residents.map((resident, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedResident(resident)}
                className={`w-full text-left px-3 py-2 border-b border-white transition-all ${
                  selectedResident.name === resident.name 
                    ? 'bg-white text-black' 
                    : 'bg-black text-white hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider leading-tight">
                  {resident.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
