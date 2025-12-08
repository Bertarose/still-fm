'use client';

const residents = [
  {
    name: "DJ POSER",
    genre: "TECHNO / INDUSTRIAL",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/djposer"
  },
  {
    name: "SHADOW BASS",
    genre: "DRUM & BASS",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/shadowbass"
  },
  {
    name: "NEON PULSE",
    genre: "ELECTRO / SYNTHWAVE",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/neonpulse"
  },
  {
    name: "VOID RIDER",
    genre: "AMBIENT / EXPERIMENTAL",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/voidrider"
  },
  {
    name: "ECHO DRIFT",
    genre: "DUB TECHNO",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/echodrift"
  },
  {
    name: "PULSE WAVE",
    genre: "ACID HOUSE",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/pulsewave"
  },
  {
    name: "DARK MATTER",
    genre: "INDUSTRIAL TECHNO",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/darkmatter"
  },
  {
    name: "COSMIC NOISE",
    genre: "NOISE / EXPERIMENTAL",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/cosmicnoise"
  },
  {
    name: "LUNAR PHASE",
    genre: "DOWNTEMPO / TRIP HOP",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/lunarphase"
  },
  {
    name: "STEEL DRUM",
    genre: "BREAKBEAT / JUNGLE",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/steeldrum"
  },
  {
    name: "GHOST SIGNAL",
    genre: "MINIMAL TECHNO",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/ghostsignal"
  },
  {
    name: "FREQUENCY X",
    genre: "ELECTRO / BREAKS",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/frequencyx"
  },
  {
    name: "ACID RAIN",
    genre: "ACID TECHNO",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/acidrain"
  },
  {
    name: "BINARY STAR",
    genre: "IDM / GLITCH",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/binarystar"
  },
  {
    name: "VOLTAGE DROP",
    genre: "ELECTRO HOUSE",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/voltagedrop"
  },
  {
    name: "SUBSONIC",
    genre: "DUBSTEP / BASS",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/subsonic"
  },
  {
    name: "CIRCUIT BREAKER",
    genre: "HARDCORE / GABBER",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/circuitbreaker"
  },
  {
    name: "FROST BYTE",
    genre: "CHIPTUNE / 8BIT",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/frostbyte"
  },
  {
    name: "OBSIDIAN",
    genre: "DARK AMBIENT",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/obsidian"
  },
  {
    name: "REVERB CITY",
    genre: "TECHNO / HOUSE",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/reverbcity"
  },
  {
    name: "PLASMA WAVE",
    genre: "TRANCE / PSY",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/plasmawave"
  },
  {
    name: "CHROME SOUL",
    genre: "TECHNO / FUNK",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/chromesoul"
  },
  {
    name: "PIXEL DUST",
    genre: "FUTURE BASS",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/pixeldust"
  },
  {
    name: "NEBULA DRIFT",
    genre: "SPACE DISCO",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/nebuladrift"
  },
  {
    name: "IRON GATE",
    genre: "EBM / INDUSTRIAL",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=1200&fit=crop",
    social: "https://www.instagram.com/irongate"
  }
];

export default function ResidentsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black pb-12">
      
      <div className="crt-screen" />
      
      <main className="max-w-full">
        
        <div className="border-b border-white px-4 py-3">
          <h1 className="text-base md:text-xl font-bold uppercase tracking-wider">
            Residents ({residents.length})
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {residents.map((resident, idx) => (
            
              key={idx}
              href={resident.social}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-r border-white group cursor-pointer"
            >
              <div className="aspect-square relative overflow-hidden bg-black">
                <img 
                  src={resident.image}
                  alt={resident.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    <div className="text-xs uppercase tracking-wider mb-2">Follow</div>
                    <div className="text-2xl">→</div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-xs font-bold uppercase leading-tight mb-1">
                  {resident.name}
                </h3>
                
                <div className="text-[9px] uppercase opacity-50">
                  {resident.genre}
                </div>
              </div>
            </a>
          ))}
        </div>

      </main>
    </div>
  );
}
