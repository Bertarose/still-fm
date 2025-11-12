'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ShowCard from './components/ShowCard';

interface Show {
  key: string;
  name: string;
  url: string;
  pictures: {
    large: string;
  };
  created_time: string;
  play_count?: number;
  favorite_count?: number;
}

interface Resident {
  id: string;
  name: string;
  image: string;
  mixcloudUser: string;
  bio: string;
}

export default function Home() {
  const [trendingShows, setTrendingShows] = useState<Show[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending shows
        const trendingResponse = await fetch('/api/mixcloud?type=trending');
        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json();
          setTrendingShows(trendingData.data || []);
        }

        // Fetch residents
        const residentsResponse = await fetch('/api/residents');
        if (residentsResponse.ok) {
          const residentsData = await residentsResponse.json();
          setResidents(residentsData.slice(0, 3)); // Show only 3 residents
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex-grow">
      {/* Hero Section with Twitch Embed */}
      <section className="relative w-full bg-black">
        <div className="w-full" style={{ paddingTop: '56.25%', position: 'relative' }}>
          <iframe
            src="https://player.twitch.tv/?channel=stillfmradio&parent=localhost&parent=still-fm.vercel.app&parent=www.stillfm.com&parent=stillfm.com&muted=true&autoplay=true"
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      </section>

      {/* About Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Welcome to Still FM
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
            Still FM is Montreal's underground radio station, broadcasting live shows and curated mixes 
            from local and international artists. Tune in to discover new sounds and experience the pulse 
            of underground music culture.
          </p>
          <Link 
            href="/about" 
            className="inline-block bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Trending Shows Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Trending Shows</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : trendingShows && trendingShows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {trendingShows.slice(0, 6).map((show) => (
                <ShowCard key={show.key} show={show} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No trending shows available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-8 sm:mt-12">
            <Link 
              href="/shows" 
              className="inline-block bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              View All Shows
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Residents Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Featured Residents</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : residents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {residents.map((resident) => (
                <Link 
                  key={resident.id} 
                  href={`/residents/${resident.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="relative w-full pt-[100%]">
                      <Image
                        src={resident.image}
                        alt={resident.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-gray-600 transition-colors">
                        {resident.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                        {resident.bio}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No residents available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-8 sm:mt-12">
            <Link 
              href="/residents" 
              className="inline-block bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Meet All Residents
            </Link>
          </div>
        </div>
      </section>

      {/* Schedule Teaser */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Live Shows & Schedule
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
            Check out our weekly schedule to catch your favorite residents live on air.
          </p>
          <Link 
            href="/schedule" 
            className="inline-block bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            View Full Schedule
          </Link>
        </div>
      </section>
    </main>
  );
}