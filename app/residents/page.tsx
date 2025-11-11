export default function ResidentsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-white">
        <div className="max-w-full px-4 py-4">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xs font-normal tracking-widest uppercase hover:opacity-50">
              STILL FM
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="/shows" className="text-xs uppercase tracking-wider hover:opacity-50">Shows</a>
              <a href="/schedule" className="text-xs uppercase tracking-wider hover:opacity-50">Schedule</a>
              <a href="/residents" className="text-xs uppercase tracking-wider opacity-50">Residents</a>
              <a href="/about" className="text-xs uppercase tracking-wider hover:opacity-50">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-full px-4 py-12">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-8">Resident DJs</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square border border-white overflow-hidden mb-3">
                <img 
                  src={`https://images.unsplash.com/photo-${1493225457124 + i * 10000}?w=400&h=400&fit=crop`}
                  alt="DJ"
                  className="w-full h-full object-cover grayscale group-hover:opacity-80 transition"
                />
              </div>
              <h3 className="text-sm uppercase tracking-wide mb-1">DJ Name {i + 1}</h3>
              <p className="text-[10px] text-gray-400">Resident DJ</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}