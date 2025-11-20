'use client';

import Link from 'next/link';
import TopAudioPlayer from '../components/TopAudioPlayer';

export default function ShopPage() {
  const products = [
    {
      id: 1,
      name: "STILL FM LOGO TEE",
      price: "$35.00",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      desc: "Heavyweight cotton, Screen printed in MTL."
    },
    {
      id: 2,
      name: "RESIDENT CAP",
      price: "$30.00",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      desc: "Embroidered logo, adjustable strap."
    },
    {
      id: 3,
      name: "LAUNCH PARTY POSTER (A2)",
      price: "$20.00",
      image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      desc: "Limited edition run of 50. Signed."
    }
  ];

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black">
      {/* Filtre CRT */}
      <div className="crt-screen" />

      {/* HEADER (Identique à Home, sans Editorial) */}
      <header className="sticky top-0 z-50 bg-white text-black border-b border-black text-[11px] font-bold uppercase tracking-wide">
          <div className="flex h-8 items-stretch border-b border-black">
              <Link href="/home" className="w-32 flex items-center justify-center border-r border-black bg-black text-white px-4 hover:bg-gray-900 transition-colors cursor-pointer">
                  STILL FM
              </Link>
              <div className="flex-1 flex items-center px-4 bg-white">
                  /// OFFICIAL MERCHANDISE
              </div>
          </div>
          <nav className="flex h-8 items-stretch">
              {['Shows', 'Residents', 'Shop'].map((item) => (
                  <Link 
                      key={item} 
                      href={`/${item.toLowerCase()}`} 
                      className={`flex items-center px-6 border-r border-black hover:bg-black hover:text-white transition-colors cursor-pointer ${item === 'Shop' ? 'bg-black text-white' : ''}`}
                  >
                      {item}
                  </Link>
              ))}
          </nav>
      </header>

      {/* Player */}
      <div className="border-b border-gray-800 sticky top-[64px] z-40 bg-black">
          <TopAudioPlayer />
      </div>

      {/* CONTENU SHOP */}
      <main className="max-w-full px-4 py-12 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group border border-gray-800 hover:border-white transition-colors bg-black">
              <div className="aspect-square overflow-hidden border-b border-gray-800">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold uppercase text-white">{product.name}</h3>
                  <span className="text-sm font-bold bg-white text-black px-2 py-0.5">{product.price}</span>
                </div>
                <p className="text-[10px] text-gray-500 mb-4 border-b border-gray-900 pb-4">{product.desc}</p>
                <button className="w-full border border-white py-2 text-[10px] uppercase hover:bg-white hover:text-black transition-all font-bold">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-20 py-12 text-center">
          <p className="text-[10px] text-gray-600 font-mono uppercase">Worldwide Shipping /// Still FM Shop</p>
      </footer>
    </div>
  );
}
