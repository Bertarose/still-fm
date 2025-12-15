'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface LiveStatusContextType {
  isLive: boolean;
}

const LiveStatusContext = createContext<LiveStatusContextType>({
  isLive: false,
});

export function LiveStatusProvider({ children }: { children: React.ReactNode }) {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkLive = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();

        // decapi retourne "offline" ou "X hours Y minutes"
        setIsLive(!text.toLowerCase().includes('offline'));
      } catch {
        setIsLive(false);
      }
    };

    checkLive();
    interval = setInterval(checkLive, 60000);

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
