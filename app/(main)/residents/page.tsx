'use client';

import Link from 'next/link';

// LISTE MISE À JOUR SELON LA CAPTURE D'ÉCRAN
const residents = [
  { name: "ALEX MURPHY", genre: "ELECTRONIC", slug: "alex-murphy" },
  { name: "ASH-LIN", genre: "ELECTRONIC", slug: "ash-lin" },
  { name: "BERTA ROSE", genre: "ELECTRONIC", slug: "berta-rose" },
  { name: "CIDOINE", genre: "ELECTRONIC", slug: "cidoine" },
  { name: "COOPER RICHARDSON", genre: "ELECTRONIC", slug: "cooper-richardson" },
  { name: "DANTE MAXWELL", genre: "ELECTRONIC", slug: "dante-maxwell" },
  { name: "FANEVA", genre: "ELECTRONIC", slug: "faneva" },
  { name: "FAZ ONE", genre: "ELECTRONIC", slug: "faz-one" },
  { name: "FLYP", genre: "ELECTRONIC", slug: "flyp" },
  { name: "ICKY MAGDALA", genre: "ELECTRONIC", slug: "icky-magdala" },
  { name: "LAURENCE NADEAU", genre: "ELECTRONIC", slug: "laurence-nadeau" },
  { name: "MARK PM", genre: "ELECTRONIC", slug: "mark-pm" },
  { name: "ME FLOAT", genre: "ELECTRONIC", slug: "me-float" },
  { name: "MUSONI", genre: "ELECTRONIC", slug: "musoni" },
  { name: "NORA ZION", genre: "ELECTRONIC", slug: "nora-zion" },
  { name: "SENZ", genre: "ELECTRONIC", slug: "senz" },
  { name: "SK7", genre: "ELECTRONIC", slug: "sk7" },
  { name: "SKATE", genre: "ELECTRONIC", slug: "skate" },
  { name: "SVVIMMING", genre: "ELECTRONIC", slug: "svvimming" },
  { name: "TECHNIQUE NADO", genre: "ELECTRONIC", slug: "technique-nado" },
  { name: "TIGNASSE", genre: "ELECTRONIC", slug: "tignasse" },
  { name: "VARIOUS", genre: "ELECTRONIC", slug: "various" },
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
                    className="w-full h-full object-cover" 
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
