'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LiveStatusContext = createContext({ isLive: false });

export function LiveStatusProvider({ children }: { children: React.ReactNode }) {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkLive = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();
        setIsLive(!text.toLowerCase().includes('offline'));
      } catch {
        setIsLive(false);
      }
    };

    checkLive();
    const interval = setInterval(checkLive, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LiveStatusContext.Provider value={{ isLive }}>
      {children}
    </LiveStatusContext.Provider>
  );
}

export function useLiveStatus() {
  return useContext(LiveStatusContext);
}
