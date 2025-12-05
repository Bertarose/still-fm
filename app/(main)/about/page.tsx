'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono pb-24">
      
      <div className="crt-screen" />

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
              <li>🎵 <a href="https://www.mixcloud.com/StillFM/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Mixcloud</a></li>
              <li>🎵 <a href="https://soundcloud.com/stillfm" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Soundcloud</a></li>
              <li>📱 Instagram: @stillfm</li>
            </ul>
          </div>
        </div>

        <div className="border border-white p-8 mb-12">
          <h2 className="text-2xl uppercase tracking-wide mb-6">Get Involved</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-2 text-white">DJ With Us</h3>
              <p className="text-xs text-gray-400">Submit your demo</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-2 text-white">Support</h3>
              <p className="text-xs text-gray-400">Donate or become a member</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-2 text-white">Partner</h3>
              <p className="text-xs text-gray-400">Collaborate with us</p>
            </div>
          </div>
        </div>

        <div className="border border-white p-8">
          <h2 className="text-2xl uppercase tracking-wide mb-6">Our Story</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Founded in 2023, Still FM emerged from Montreal's vibrant underground music scene 
            with a mission to provide a platform for artists and sounds that challenge the mainstream.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            We're more than a radio station—we're a community of music lovers, creators, 
            and cultural enthusiasts dedicated to pushing boundaries and celebrating authenticity.
          </p>
        </div>
      </main>

      <footer className="border-t border-white mt-20 px-4 py-8">
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider">
          © 2025 STILL FM — Montreal Underground Radio
        </p>
      </footer>
    </div>
  );
}
