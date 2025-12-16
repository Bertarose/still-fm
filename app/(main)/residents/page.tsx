'use client';

import Link from 'next/link';

// 63 VRAIS RESIDENTS extraits depuis Mixcloud API
const residents = [
  { name: "COOPER RICHARDSON", genre: "ELECTRONIC", slug: "cooper-richardson" },
  { name: "SVVIMMING", genre: "ELECTRONIC", slug: "svvimming" },
  { name: "FAZ ONE", genre: "ELECTRONIC", slug: "faz-one" },
  { name: "DANTE MAXWELL", genre: "ELECTRONIC", slug: "dante-maxwell" },
  { name: "SKATE", genre: "ELECTRONIC", slug: "skate" },
  { name: "UTSAVA", genre: "ELECTRONIC", slug: "utsava" },
  { name: "UKG AFFAIR", genre: "UK GARAGE", slug: "ukg-affair" },
  { name: "SOUND VOYAGE", genre: "ELECTRONIC", slug: "sound-voyage" },
  { name: "GROOVY & CHILL", genre: "CHILL", slug: "groovy-chill" },
  { name: "ALEX MURPHY", genre: "ELECTRONIC", slug: "alex-murphy" },
  { name: "SENZ", genre: "ELECTRONIC", slug: "senz" },
  { name: "NORA ZION", genre: "ELECTRONIC", slug: "nora-zion" },
  { name: "MARK PM", genre: "ELECTRONIC", slug: "mark-pm" },
  { name: "TIGNASSE", genre: "ELECTRONIC", slug: "tignasse" },
  { name: "ME FLOAT", genre: "ELECTRONIC", slug: "me-float" },
  { name: "TECHNIQUE NADO", genre: "ELECTRONIC", slug: "technique-nado" },
  { name: "BREXIT DON'T KILL MY GRIME", genre: "GRIME", slug: "brexit-dont-kill-my-grime" },
  { name: "VO GUEULE", genre: "ELECTRONIC", slug: "vo-gueule" },
  { name: "SNOW CHOLO CHRONICLES", genre: "HIP HOP", slug: "snow-cholo-chronicles" },
  { name: "SECRET SELECTA VOL.1", genre: "ELECTRONIC", slug: "secret-selecta-vol1" },
  { name: "MAGNETIC SELECTS", genre: "ELECTRONIC", slug: "magnetic-selects" },
  { name: "CIDOINE", genre: "ELECTRONIC", slug: "cidoine" },
  { name: "LAURENCE NADEAU", genre: "ELECTRONIC", slug: "laurence-nadeau" },
  { name: "TÊTE DE VEAU", genre: "ELECTRONIC", slug: "tete-de-veau" },
  { name: "FANEVA", genre: "ELECTRONIC", slug: "faneva" },
  { name: "ASH-LIN", genre: "ELECTRONIC", slug: "ashlin" },
  { name: "MUSONI", genre: "ELECTRONIC", slug: "musoni" },
  { name: "SK7", genre: "ELECTRONIC", slug: "sk7" },
  { name: "FLYP", genre: "ELECTRONIC", slug: "flyp" },
  { name: "ICKY MAGDALA", genre: "ELECTRONIC", slug: "icky-magdala" },
  { name: "PHAT EST LA SONORITÉ", genre: "HIP HOP", slug: "phat-est-la-sonorite" },
  { name: "SUMMERCAST VOL.8", genre: "SUMMER MIX", slug: "summercast-vol8" },
  { name: "SUMMERCAST VOL.7", genre: "SUMMER MIX", slug: "summercast-vol7" },
  { name: "SUMMERCAST VOL.6", genre: "SUMMER MIX", slug: "summercast-vol6" },
  { name: "SUMMERCAST VOL.5", genre: "SUMMER MIX", slug: "summercast-vol5" },
  { name: "SUMMERCAST VOL.4", genre: "SUMMER MIX", slug: "summercast-vol4" },
  { name: "SUMMERCAST VOL.3", genre: "SUMMER MIX", slug: "summercast-vol3" },
  { name: "SUMMERCAST VOL.2", genre: "SUMMER MIX", slug: "summercast-vol2" },
  { name: "SUMMERCAST VOL.1", genre: "SUMMER MIX", slug: "summercast-vol1" },
  { name: "BAKE LE CAKE", genre: "ELECTRONIC", slug: "bake-le-cake" },
  { name: "BAD Q!", genre: "ELECTRONIC", slug: "bad-q" },
  { name: "PAS DE SUCRE PAS DE LAIT", genre: "ELECTRONIC", slug: "pas-de-sucre-pas-de-lait" },
  { name: "HARD ALBUMS", genre: "ELECTRONIC", slug: "hard-albums" },
  { name: "RADIO FOUGÈRE", genre: "RADIO SHOW", slug: "radio-fougere" },
  { name: "BAKED GOODS", genre: "ELECTRONIC", slug: "baked-goods" },
  { name: "STILL LIVE", genre: "LIVE SET", slug: "still-live" },
  { name: "WORLD WIDE WEB TRANSMISSION", genre: "ELECTRONIC", slug: "world-wide-web-transmission" },
  { name: "BRIDGES TO DUB", genre: "DUB", slug: "bridges-to-dub" },
  { name: "PARADISE ROOM", genre: "HOUSE", slug: "paradise-room" },
  { name: "TINY SOUNDS", genre: "AMBIENT", slug: "tiny-sounds" },
  { name: "LE KEYHOLE", genre: "ELECTRONIC", slug: "le-keyhole" },
  { name: "SOUL KEB @ 7", genre: "SOUL", slug: "soul-keb-7" },
  { name: "RADIO TO", genre: "RADIO SHOW", slug: "radio-to" },
  { name: "JET LAG", genre: "ELECTRONIC", slug: "jet-lag" },
  { name: "WURKIN' & WURKOUT", genre: "ELECTRONIC", slug: "wurkin-wurkout" },
  { name: "BOOGALOO STORY", genre: "BOOGALOO", slug: "boogaloo-story" },
  { name: "TERRAIN2ROAM", genre: "ELECTRONIC", slug: "terrain2roam" },
  { name: "L'HEURE MAUVE", genre: "ELECTRONIC", slug: "lheure-mauve" },
  { name: "KEYS TO THE SHOP @ 180G", genre: "HIP HOP", slug: "keys-to-the-shop-180g" },
  { name: "GUEST MIXES", genre: "GUEST MIX", slug: "guest-mixes" },
  { name: "INVITES ONLY", genre: "GUEST MIX", slug: "invites-only" },
  { name: "ARYTHMIE", genre: "ELECTRONIC", slug: "arythmie" },
  { name: "THE DUPPY REMOVER SHOW", genre: "REGGAE / DUB", slug: "the-duppy-remover-show" },
];

// Placeholder image - tu peux remplacer par des vraies images plus tard
const placeholderImage = "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1200&h=1200&fit=crop";

export default function ResidentsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black pb-12">
      <div className="crt-screen" />
      <main className="max-w-full">
        <div className="border-b border-white px-4 py-3">
          <h1 className="text-base md:text-xl font-bold uppercase tracking-wider">Residents ({residents.length})</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {residents.map((resident, idx) => (
            <div key={idx} className="border-b border-r border-white group relative">
              {/* Link vers Shows avec filtre resident */}
              <Link 
                href={`/shows?search=${encodeURIComponent(resident.name)}`}
                className="block cursor-pointer"
              >
                <div className="aspect-square relative overflow-hidden bg-black">
                  <img 
                    src={placeholderImage} 
                    alt={resident.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      <div className="text-xs uppercase tracking-wider mb-2">View Shows</div>
                      <div className="text-2xl">→</div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold uppercase leading-tight mb-1">{resident.name}</h3>
                  <div className="text-[9px] uppercase opacity-50">{resident.genre}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
