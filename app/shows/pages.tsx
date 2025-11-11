
export default function ShowsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-white">
        <div className="max-w-full px-4 py-4">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xs font-normal tracking-widest uppercase hover:opacity-50">
              STILL FM
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="/shows" className="text-xs uppercase tracking-wider opacity-50">Shows</a>
              <a href="/schedule" className="text-xs uppercase tracking-wider hover:opacity-50">Schedule</a>
              <a href="/residents" className="text-xs uppercase tracking-wider hover:opacity-50">Residents</a>
              <a href="/about" className="text-xs uppercase tracking-wider hover:opacity-50">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-full px-4 py-12">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-8">All Shows</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <a href="#" key={i} className="group">
              <div className="aspect-square relative mb-2 border border-white overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1514525253161 + i * 1000}?w=400&h=400&fit=crop`}
                  alt="Show"
                  className="w-full h-full object-cover grayscale group-hover:opacity-80 transition"
                />
              </div>
              <h3 className="text-xs uppercase tracking-wide mb-1">Show Title {i + 1}</h3>
              <p className="text-[10px] text-gray-400">DD MMM YYYY | HH:MM</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
