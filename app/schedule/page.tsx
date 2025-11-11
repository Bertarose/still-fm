export default function SchedulePage() {
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
              <a href="/schedule" className="text-xs uppercase tracking-wider opacity-50">Schedule</a>
              <a href="/residents" className="text-xs uppercase tracking-wider hover:opacity-50">Residents</a>
              <a href="/about" className="text-xs uppercase tracking-wider hover:opacity-50">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-8">Weekly Schedule</h1>
        
        <div className="border border-white">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="border-b border-white last:border-b-0">
              <div className="bg-white text-black px-4 py-2">
                <h2 className="text-sm uppercase tracking-wider font-bold">{day}</h2>
              </div>
              
              {[
                { time: '08:00 - 10:00', show: 'Morning Show', host: 'DJ Name', genre: 'JAZZ' },
                { time: '14:00 - 16:00', show: 'Afternoon Mix', host: 'DJ Name', genre: 'SOUL' },
                { time: '20:00 - 22:00', show: 'Evening Session', host: 'DJ Name', genre: 'ELECTRONIC' },
              ].map((slot, i) => (
                <div key={i} className="p-4 border-b border-gray-800 last:border-b-0 hover:bg-white hover:text-black transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xs tracking-wider">{slot.time}</span>
                      <h3 className="text-sm uppercase tracking-wide">{slot.show}</h3>
                      <span className="text-xs text-gray-400">with {slot.host}</span>
                    </div>
                    <span className="text-[8px] border border-current px-2 py-1">{slot.genre}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
