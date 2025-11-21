'use client';

import { useState, useEffect } from 'react';
import TopAudioPlayer from '../components/TopAudioPlayer';
import Link from 'next/link';
import { usePlayer } from '../context/PlayerContext';

export default function AboutPage() {
  const { playShow } = usePlayer();
  const [latestMix, setLatestMix] = useState<any>(null);

  // Fetch latest show for the marquee
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          const mix = data.data[0];
          setLatestMix({
            title: mix.name,
            url: mix.url,
            img: mix.pictures?.extra_large,
            key: mix.key
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLatest();
  }, []);

  if (!latestMix) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">LOADING STILL FM...</div>;

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 font-mono selection:bg-white selection:text-black pb-24">
      
      <div className="crt-screen" />
      
      <header className="sticky top-0 z-50 bg-white text-black border-b border-black text-[11px] font-bold uppercase tracking-wide">
        <div className="flex h-8 items-stretch border-b border-black">
          <Link href="/home" className="w-32 flex items-center justify-center border-r border-black bg-black text-white px-4 hover:bg-gray-900 transition-colors cursor-pointer">
            STILL FM
          </Link>
          <div className="flex-1 flex items-center overflow-hidden relative bg-white">
            <div className="animate-marquee whitespace-nowrap absolute">
              +++ NOW PLAYING: {latestMix?.title} +++ LIVE FROM MONTREAL +++
            </div>
          </div>
          <div className="w-32 flex items-center justify-center border-l border-black bg-[#e0e0e0]">
            STREAM OFFLINE
          </div>
        </div>
        <nav className="flex h-8 items-stretch">
          {['Shows', 'Residents', 'About', 'Shop'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="flex items-center px-6 border-r border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
              {item}
            </Link>
          ))}
        </nav>
      </header>

      <div className="border-b border-gray-800 sticky top-[64px] z-40 bg-black">
        <TopAudioPlayer />
      </div>

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
              <li>🎵 <a href="https://soundcloud.com/stillfm" className="hover:text-white">Soundcloud</a></li>
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
