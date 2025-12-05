'use client';

import { useState } from 'react';

export default function ShopPage() {
  const [selectedSize, setSelectedSize] = useState<string>('');

  return (
    <div className="h-screen bg-black text-white font-mono selection:bg-white selection:text-black overflow-hidden">
      
      <div className="crt-screen" />

      <main className="h-full">
        
        {/* Layout 50/50 : Image gauche / Info droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          
          {/* Image - Côté gauche */}
          <div className="relative border-b lg:border-b-0 lg:border-r border-white group h-full">
            <div className="w-full h-full relative overflow-hidden bg-black">
              <img 
                src="/t2.png" 
                alt="Still FM T-Shirt" 
                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Badge "Available Now" */}
              <div className="absolute top-6 left-6 bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-wider">
                Available Now
              </div>
            </div>
          </div>

          {/* Info - Côté droit */}
          <div className="flex flex-col justify-center p-8 lg:p-12 h-full overflow-y-auto custom-scrollbar">
            
            <div className="max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-bold uppercase mb-3 tracking-tight leading-none">
                Still FM Tee
              </h1>
              
              <p className="text-xs uppercase tracking-wider opacity-50 mb-6">
                Official Merchandise
              </p>

              <div className="space-y-4 mb-8 text-sm">
                <p className="leading-relaxed opacity-80">
                  100% heavyweight cotton. Screen printed locally in Montreal. 
                  Official Still FM radio branding. Limited edition drop.
                </p>
              </div>

              {/* Prix */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <p className="text-4xl font-bold">
                  $35 <span className="text-lg font-normal opacity-50">CAD</span>
                </p>
              </div>

              {/* Sélecteur de taille */}
              <div className="mb-6">
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
                className={`w-full border-2 py-4 text-sm uppercase tracking-wider transition-all font-bold mb-6 ${
                  selectedSize
                    ? 'border-white hover:bg-white hover:text-black cursor-pointer'
                    : 'border-white/20 text-white/20 cursor-not-allowed'
                }`}
              >
                {selectedSize ? `Add to Cart — $35` : 'Select a Size'}
              </button>

              {/* Shipping info */}
              <div className="space-y-1 text-[10px] opacity-50 pt-4 border-t border-white/10">
                <p>✓ Free shipping over $100 CAD</p>
                <p>✓ Local pickup in Montreal</p>
                <p>✓ 30 days exchange policy</p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
