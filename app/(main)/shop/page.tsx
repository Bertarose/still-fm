'use client';

export default function ShopPage() {
  const products = [
    {
      id: 1,
      name: "STILL FM TEE",
      price: "35",
      image: "../../../public/t2.png",
      size: "S / M / L / XL"
    },
    {
      id: 2,
      name: "RESIDENTS CAP",
      price: "30",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop",
      size: "ONE SIZE"
    },
    {
      id: 3,
      name: "LOGO HOODIE",
      price: "75",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop",
      size: "S / M / L / XL / XXL"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black pb-24">
      
      <div className="crt-screen" />

      {/* Header minimal */}
      <div className="border-b border-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold uppercase tracking-wider">
            Shop
          </h1>
          <span className="text-[10px] uppercase tracking-wider opacity-50">
            Worldwide Shipping
          </span>
        </div>
      </div>

      {/* Grid produits */}
      <main className="max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {products.map((product) => (
            <div 
              key={product.id}
              className="border-b border-r border-white group cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden bg-black">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </div>

              {/* Info produit */}
              <div className="p-6 border-t border-white">
                
                {/* Nom + Prix */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wide mb-1">
                      {product.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider opacity-50">
                      {product.size}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ${product.price}
                    </div>
                    <div className="text-[9px] uppercase opacity-50">
                      CAD
                    </div>
                  </div>
                </div>

                {/* Bouton */}
                <button className="w-full border border-white py-3 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all font-bold">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="border-t border-white p-12 text-center">
          <h2 className="text-2xl font-bold uppercase mb-6 tracking-wider">
            Coming Soon
          </h2>
          <p className="text-sm opacity-70 mb-6 max-w-2xl mx-auto leading-relaxed">
            Limited edition merchandise drop. Screen printed locally in Montreal. 
            First batch shipping December 2024. Sign up for restock notifications.
          </p>
          <div className="flex items-center justify-center gap-4">
            <input 
              type="email" 
              placeholder="YOUR EMAIL"
              className="bg-transparent border border-white px-6 py-3 text-xs uppercase tracking-wider placeholder:text-gray-600 focus:outline-none focus:bg-white focus:text-black transition-all w-64"
            />
            <button className="border border-white px-8 py-3 text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all font-bold">
              Notify Me
            </button>
          </div>
        </div>

        {/* Shipping info */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white">
          <div className="p-8 border-b md:border-b-0 md:border-r border-white text-center">
            <div className="text-xs font-bold uppercase mb-2">Free Shipping</div>
            <div className="text-[10px] opacity-50">Orders over $100 CAD</div>
          </div>
          <div className="p-8 border-b md:border-b-0 md:border-r border-white text-center">
            <div className="text-xs font-bold uppercase mb-2">Local Pickup</div>
            <div className="text-[10px] opacity-50">Montreal area only</div>
          </div>
          <div className="p-8 text-center">
            <div className="text-xs font-bold uppercase mb-2">Returns</div>
            <div className="text-[10px] opacity-50">30 days exchange policy</div>
          </div>
        </div>
      </main>
    </div>
  );
}
