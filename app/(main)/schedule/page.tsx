'use client';

import { useState } from 'react';

export default function ResidentsPage() {
  const residents = [
    { 
      name: "DJ POSER", 
      genre: "TECHNO / TRANCE", 
      image: "https://images.unsplash.com/photo-1571607697765-063be663682a?w=800&h=800&fit=crop",
      social: "https://www.instagram.com/djposer"
    },
    { 
      name: "SHADOW BASS", 
      genre: "DRUM & BASS", 
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop",
      social: "https://www.instagram.com/shadowbass"
    },
    { 
      name: "NEON PULSE", 
      genre: "HOUSE / DISCO", 
      image: "https://images.unsplash.com/photo-1574163759315-e8e6f8b4b315?w=800&h=800&fit=crop",
      social: "https://soundcloud.com/neonpulse"
    },
    { 
      name: "VOID RIDER", 
      genre: "TECHNO / INDUSTRIAL", 
      image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&h=800&fit=crop",
      social: "https://www.instagram.com/voidrider"
    },
    { 
      name: "ECHO DRIFT", 
      genre: "AMBIENT / EXPERIMENTAL", 
      image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=800&fit=crop",
      social: "https://soundcloud.com/echodrift"
    },
    { 
      name: "PULSE WAVE", 
      genre: "ELECTRO / BREAKS", 
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=800&fit=crop",
      social: "https://www.instagram.com/pulsewave"
    },
    { 
      name: "DARK MATTER", 
      genre: "DUBSTEP / BASS", 
      image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=800&fit=crop",
      social: "https://soundcloud.com/darkmatter"
    },
    { 
      name: "COSMIC NOISE", 
      genre: "TECHNO / ACID", 
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop",
      social: "https://www.instagram.com/cosmicnoise"
    },
    { 
      name: "STEEL RHYTHM", 
      genre: "HARDCORE / GABBER", 
      image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=800&fit=crop",
      social: "https://soundcloud.com/steelrhythm"
    },
    { 
      name: "SYNTH CITY", 
      genre: "SYNTHWAVE / RETRO", 
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=800&fit=crop",
      social: "https://www.instagram.com/synthcity"
    },
  ];

  // État pour le résident sélectionné (featured)
  const [selectedResident, setSelectedResident] = useState(residents[0]);

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black pb-24">
      
      <div className="crt-screen" />
      
      <main className="max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-800 h-auto lg:h-[85vh]">
          
          {/* GROSSE IMAGE À GAUCHE */}
          <div className="lg:col-span-8 relative border-r border-gray-800 h-[50vh] lg:h-full group overflow-hidden">
            
            <div className="block w-full h-full relative">
              {/* Image du résident sélectionné */}
              <img 
                src={selectedResident.image} 
                alt={selectedResident.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              />
              
              {/* Overlay avec infos */}
              <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none">
                <div className="bg-white text-black text-xs inline-block px-2 py-1 mb-4 font-bold">
                  RESIDENT
                </div>
                <h1 className="text-4xl md:text-6xl font-bold uppercase leading-none mb-2 text-white mix-blend-difference">
                  {selectedResident.name}
                </h1>
                <p className="text-sm text-gray-300 uppercase tracking-wider">
                  {selectedResident.genre}
                </p>
              </div>

              {/* Bouton Social Media (hover) */}
              <a 
                href={selectedResident.social}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
              >
                <div className="bg-white text-black px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                  View Profile →
                </div>
              </a>
            </div>
          </div>

          {/* LISTE DES RÉSIDENTS À DROITE */}
          <div className="lg:col-span-4 h-full bg-black overflow-y-auto custom-scrollbar">
            {residents.map((resident, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedResident(resident)}
                className={`
                  flex flex-col justify-center p-6 border-b border-gray-800 
                  hover:bg-[#1a1a1a] transition-colors cursor-pointer
                  ${selectedResident.name === resident.name ? 'bg-[#1a1a1a]' : ''}
                `}
              >
                {/* Nom du résident */}
                <h3 className="text-xl font-bold uppercase leading-tight tracking-wide group-hover:text-white text-gray-300 mb-1">
                  {resident.name}
                </h3>
                
                {/* Genre */}
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {resident.genre}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section "Join The Family" en bas */}
        <div className="p-8 md:p-12">
          <h2 className="text-lg font-bold uppercase bg-white text-black px-2 mb-4 inline-block">
            Become a Resident
          </h2>
          
          <div className="border border-gray-800 p-8 hover:border-white transition-colors">
            <h3 className="text-2xl font-bold uppercase mb-4 tracking-wider">
              Join The Family
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-2xl">
              We're always looking for talented artists to join our crew. 
              If you think you have what it takes to be part of the Still FM family, 
              submit your demo and let's see what you got.
            </p>
            <a 
              href="mailto:residents@still.fm" 
              className="inline-block border border-white px-8 py-3 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
            >
              Submit Your Demo
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
