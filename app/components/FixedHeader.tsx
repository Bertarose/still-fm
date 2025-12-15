'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface FixedHeaderProps {
  currentPage?: string;
}

const navItems = ['Shows', 'Schedule', 'Residents', 'About', 'Shop'];

export default function FixedHeader({ currentPage: propCurrentPage }: FixedHeaderProps) {
  const pathname = usePathname();
  const currentPage = propCurrentPage || (pathname.split('/').filter(Boolean).pop() || 'home').toLowerCase();

  return (
    <header className="w-full bg-white text-black font-mono border-b border-black">
      
      {/* LIGNE 1 : Logo + Marquee + Status + Landing Link */}
      <div className="flex h-8 items-stretch border-b border-black">
        <Link 
          href="/home" 
          className="w-20 md:w-32 flex items-center justify-center border-r border-black bg-black text-white px-2 md:px-4 hover:bg-gray-900 transition-colors text-[9px] md:text-[11px] font-bold uppercase tracking-wide shrink-0"
        >
          STILL FM
        </Link>
        
        <div className="flex-1 flex items-center overflow-hidden relative bg-white">
          <div className="animate-marquee whitespace-nowrap absolute text-[9px] md:text-[11px] font-bold uppercase tracking-wide">
            +++ NOW PLAYING: 2023-07-23 // DANTE MAXWELL // SK7 // COOPER RICHARDSON - LE KEYHOLE EP. 18: 160BPM EDITION (PART 4) +++ LIVE FROM MONTREAL +++
          </div>
        </div>
        
        {/* Status OFFLINE + Lien Landing */}
        <div className="flex items-stretch shrink-0 border-l border-black">
          <div className="w-28 md:w-32 flex items-center justify-center bg-[#e0e0e0] text-[8px] md:text-[10px] font-bold uppercase tracking-wide">
            <span className="hidden md:inline">STREAM OFFLINE</span>
            <span className="md:hidden">OFFLINE</span>
          </div>
          
          {/* Lien vers Landing Page */}
          <Link
            href="/"
            className="w-8 md:w-10 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors border-l border-white text-lg md:text-xl"
            title="Go to Landing Page"
          >
            ⌂
          </Link>
        </div>
      </div>

      {/* LIGNE 2 : Navigation - Scroll horizontal sur mobile */}
      <nav className="flex h-8 items-stretch overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className={`flex items-center px-4 md:px-6 border-r border-black text-[10px] md:text-[11px] font-bold uppercase tracking-wide transition-colors whitespace-nowrap shrink-0 ${
              item.toLowerCase() === currentPage 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {item}
          </Link>
        ))}
      </nav>
    </header>
  );
}
