'use client';

import { useState } from 'react';

export default function ResidentsPage() {
  const residents = [
    {
      name: "DJ POSER",
      genre: "TECHNO / INDUSTRIAL",
      image: "https://images.unsplash.com/photo-1571266028243-d220c6f1e5d8?w=1200&h=1200&fit=crop&q=80",
      bio: "Heavy techno and industrial sounds. Resident since 2023.",
      social: "https://www.instagram.com/djposer"
    },
    {
      name: "SHADOW BASS",
      genre: "DRUM & BASS / NEUROFUNK",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=1200&fit=crop&q=80",
      bio: "Liquid DnB and neurofunk specialist. Montreal underground veteran.",
      social: "https://www.instagram.com/shadowbass"
    },
    {
      name: "NEON PULSE",
      genre: "HOUSE / MINIMAL",
      image: "https://images.unsplash.com/photo-1574163759315-e8e6f8b4b315?w=1200&h=1200&fit=crop&q=80",
      bio: "Deep house and minimal grooves. Known for marathon sets.",
      social: "https://www.instagram.com/neonpulse"
    },
    {
      name: "VOID RIDER",
      genre: "INDUSTRIAL / EBM",
      image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=1200&h=1200&fit=crop&q=80",
      bio: "Dark industrial techno with EBM influences. Noise architect.",
      social: "https://www.instagram.com/voidrider"
    },
    {
      name: "ECHO DRIFT",
      genre: "AMBIENT / EXPERIMENTAL",
      image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200&h=1200&fit=crop&q=80",
      bio: "Atmospheric soundscapes and experimental textures.",
      social: "https://www.instagram.com/echodrift"
    },
    {
      name: "PULSE WAVE",
      genre: "ELECTRO / BREAKS",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=1200&fit=crop&q=80",
      bio: "Breakbeat and electro fusion. High-energy selector.",
      social: "https://www.instagram.com/pulsewave"
    },
    {
      name: "DARK MATTER",
      genre: "DUBSTEP / BASS",
      image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1200&h=1200&fit=crop&q=80",
      bio: "Heavy bass and dubstep. Sub-frequency specialist.",
      social: "https://www.instagram.com/darkmatter"
    },
    {
      name: "COSMIC NOISE",
      genre: "TECHNO / TRANCE",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=1200&fit=crop&q=80",
      bio: "Hypnotic techno and trance journeys. Psychedelic explorer.",
      social: "https://www.instagram.com/cosmicnoise"
    }
  ];

  const [selectedResident, setSelectedResident] = useState(residents[0]);

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black pb-12">
      
      <div className="crt-screen" />
      
      <main className="max-w-full">
        
        {/* Header */}
        <div className="border-b border-white px-6 py-4">
          <h1 className="text-xl font-bold uppercase tracking-wider">
            Residents ({residents.length})
          </h1>
        </div>

        {/* Layout: Hero (8 cols) + List (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Hero Image - 8 colonnes */}
          <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-white relative group">
            <div className="aspect-square lg:aspect-[16/10] relative overflow-hidden bg-black">
              <img 
                src={selectedResident.image}
                alt={selectedResident.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Overlay info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8 md:p-12">
                <div>
                  <h2 className="text-4xl md:text-6xl font-bold uppercase mb-2 tracking-wider">
                    {selectedResident.name}
                  </h2>
                  <p className="text-sm md:text-base uppercase tracking-wider opacity-70 mb-4">
                    {selectedResident.genre}
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed opacity-80 max-w-2xl mb-6">
                    {selectedResident.bio}
                  </p>
                  
                  {/* Social link */}
                  <a 
                    href={selectedResident.social}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border border-white px-6 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                  >
                    View Profile →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des Residents - 4 colonnes */}
          <div className="lg:col-span-4 bg-black">
            {residents.map((resident, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedResident(resident)}
                className={`border-b border-white p-6 cursor-pointer transition-all ${
                  selectedResident.name === resident.name
                    ? 'bg-white text-black'
                    : 'hover:bg-white hover:text-black'
                }`}
              >
                <h3 className="text-sm font-bold uppercase mb-1 tracking-wider">
                  {resident.name}
                </h3>
                <p className="text-[10px] uppercase tracking-wider opacity-50">
                  {resident.genre}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-t border-white p-12 text-center">
          <h2 className="text-2xl font-bold uppercase mb-6 tracking-wider">
            Join The Family
          </h2>
          <p className="text-sm opacity-70 mb-6 max-w-2xl mx-auto leading-relaxed">
            We're always looking for talented DJs and producers to join our resident roster. 
            If you're passionate about underground electronic music and want to be part of Montreal's 
            most exciting radio station, send us your demo.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL"
              className="bg-transparent border border-white px-6 py-3 text-xs uppercase tracking-wider placeholder:text-gray-600 focus:outline-none focus:bg-white focus:text-black transition-all w-full md:w-64"
            />
            <button className="border border-white px-8 py-3 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all font-bold w-full md:w-auto">
              Apply Now
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
