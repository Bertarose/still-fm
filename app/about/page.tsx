export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-white">
        <div className="max-w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xs font-normal tracking-widest uppercase hover:opacity-50">
              STILL FM
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="/shows" className="text-xs uppercase tracking-wider hover:opacity-50">Shows</a>
              <a href="/schedule" className="text-xs uppercase tracking-wider hover:opacity-50">Schedule</a>
              <a href="/residents" className="text-xs uppercase tracking-wider hover:opacity-50">Residents</a>
              <a href="/about" className="text-xs uppercase tracking-wider opacity-50">About</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-8">About Still FM</h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-xl uppercase tracking-wide mb-4 border-b border-white pb-2">Our Mission</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Still FM is an independent radio station broadcasting from Montreal, 
              showcasing the best in underground music and culture.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              We celebrate diversity, creativity, and authenticity through carefully 
              curated shows that span genres, eras, and cultures.
            </p>
          </div>

          <div>
            <h2 className="text-xl uppercase tracking-wide mb-4 border-b border-white pb-2">Contact</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 info@still.fm</li>
              <li>📍 Montreal, Quebec, Canada</li>
              <li>🎵 <a href="https://www.mixcloud.com/StillFM/" className="hover:text-white">Mixcloud</a></li>
              <li>📱 Instagram: @stillfm</li>
            </ul>
          </div>
        </div>

        <div className="border border-white p-8 mb-12">
          <h2 className="text-2xl uppercase tracking-wide mb-6">Get Involved</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-2">DJ With Us</h3>
              <p className="text-xs text-gray-400">Submit your demo</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-2">Support</h3>
              <p className="text-xs text-gray-400">Donate or become a member</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-2">Partner</h3>
              <p className="text-xs text-gray-400">Collaborate with us</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white mt-20 px-4 py-8">
        <p className="text-[10px] text-gray-400 text-center">© 2025 STILL FM</p>
      </footer>
    </div>
  );
}