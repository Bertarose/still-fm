'use client';

import { useState } from 'react';

export default function ShopPage() {
  const [selectedSize, setSelectedSize] = useState<string>('');

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black">
      
      <div className="crt-screen" />

      <main className="max-w-full">
        
        {/* Layout 50/50 : Image gauche / Info droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          
          {/* Image - Côté gauche */}
          <div className="relative border-b lg:border-b-0 lg:border-r border-white group">
            <div className="sticky top-0 aspect-square lg:h-screen relative overflow-hidden bg-black">
              <img 
                src="/t2.png" 
                alt="Still FM T-Shirt" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Badge "Available Now" */}
              <div className="absolute top-6 right-6 bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-wider">
                Available Now
              </div>
            </div>
          </div>

          {/* Info - Côté droit */}
          <div className="flex flex-col justify-between p-8 lg:p-12">
            
            {/* Détails produit */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold uppercase mb-4 tracking-tight leading-none">
                Still FM Tee
              </h1>
              
              <p className="text-sm uppercase tracking-wider opacity-50 mb-8 pb-6 border-b border-white/10">
                Official Merchandise
              </p>

              <div className="space-y-6 mb-12">
                <div>
                  <h3 className="text-xs uppercase tracking-wider opacity-50 mb-2">Description</h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    100% heavyweight cotton. Screen printed locally in Montreal. 
                    Official Still FM radio branding. Limited edition drop.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider opacity-50 mb-2">Sizes Available</h3>
                  <p className="text-sm opacity-80">S / M / L / XL / XXL</p>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-wider opacity-50 mb-2">Price</h3>
                  <p className="text-3xl font-bold">$35 <span className="text-sm font-normal opacity-50">CAD</span></p>
                </div>
              </div>

              {/* Sélecteur de taille */}
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-wider mb-3 opacity-50">
                  Select Size
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border py-3 text-sm uppercase tracking-wider transition-all font-bold ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'border-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton d'achat */}
              <button 
                disabled={!selectedSize}
                className={`w-full border-2 py-4 text-sm uppercase tracking-wider transition-all font-bold mb-8 ${
                  selectedSize
                    ? 'border-white hover:bg-white hover:text-black cursor-pointer'
                    : 'border-white/20 text-white/20 cursor-not-allowed'
                }`}
              >
                {selectedSize ? `Add to Cart — $35` : 'Select a Size'}
              </button>

              {/* Shipping info */}
              <div className="space-y-2 text-xs opacity-50 border-t border-white/10 pt-6">
                <p>✓ Free shipping on orders over $100 CAD</p>
                <p>✓ Local pickup available in Montreal</p>
                <p>✓ 30 days exchange policy</p>
              </div>
            </div>

            {/* Contact / Newsletter */}
            <div className="border-t border-white/10 pt-8 mt-8">
              <h3 className="text-xs uppercase tracking-wider mb-4 opacity-50">
                Stay Updated
              </h3>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="YOUR EMAIL"
                  className="flex-1 bg-transparent border border-white px-4 py-3 text-xs uppercase tracking-wider placeholder:text-gray-600 focus:outline-none focus:bg-white focus:text-black transition-all"
                />
                <button className="border border-white px-6 py-3 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all font-bold">
                  Join
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
