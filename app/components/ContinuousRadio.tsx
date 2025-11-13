'use client';

import { useState, useEffect, useRef } from 'react';

// Interface pour les données de l'API Mixcloud
interface MixcloudShow {
  key: string; // Ex: "/stillfmradio/still-fm-ep-200-show-name/"
  name: string;
}

// Hook pour charger le script de l'API Mixcloud
const useMixcloudScript = (onScriptLoad: () => void) => {
  useEffect(() => {
    if (document.getElementById('mixcloud-widget-api')) {
      onScriptLoad();
      return;
    }

    const script = document.createElement('script');
    script.id = 'mixcloud-widget-api';
    script.src = 'https://www.mixcloud.com/media/js/widgetApi.js';
    script.async = true;
    script.onload = onScriptLoad;
    document.body.appendChild(script);

    return () => {
      if (document.getElementById('mixcloud-widget-api')) {
        document.body.removeChild(script);
      }
    };
  }, [onScriptLoad]);
};

// Le composant Radio
export default function ContinuousRadio() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showList, setShowList] = useState<MixcloudShow[]>([]);
  const [currentShowName, setCurrentShowName] = useState('Loading radio...');
  const playerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  // 1. Charger la liste des shows
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('https://api.mixcloud.com/stillfmradio/cloudcasts/');
        const data = await response.json();
        const formattedShows: MixcloudShow[] = data.data.map((show: any) => ({
          key: show.key,
          name: show.name,
        }));
        setShowList(formattedShows);
      } catch (error) {
        console.error('Erreur de chargement des shows Mixcloud:', error);
        setCurrentShowName('Radio error');
      }
    };
    fetchShows();
  }, []);

  // 2. Fonction pour jouer un show aléatoire
  const playRandomShow = () => {
    if (showList.length === 0 || !widgetRef.current) return;

    const randomShow = showList[Math.floor(Math.random() * showList.length)];
    setCurrentShowName(randomShow.name);
    widgetRef.current.load(randomShow.key, true); // 'true' = autoplay
  };

  // 3. Charger le script
  useMixcloudScript(() => {
    setIsScriptLoaded(true);
  });

  // 4. Initialiser le widget (quand script ET shows sont prêts)
  useEffect(() => {
    if (isScriptLoaded && showList.length > 0 && playerRef.current && !widgetRef.current) {
      const widget = (window as any).Mixcloud.PlayerWidget(playerRef.current);
      widgetRef.current = widget;

      widget.ready.then(() => {
        // Joue un nouveau show quand le précédent est fini
        widget.events.ended.on(playRandomShow); 
        // Joue le premier show
        playRandomShow();
      });
    }
  }, [isScriptLoaded, showList]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black text-white">
      <div className="text-sm uppercase tracking-widest mb-4">
        STILL FM RADIO
      </div>
      <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">
        Now Playing (Random)
      </div>
      <div className="text-lg font-bold uppercase tracking-wide leading-tight" title={currentShowName}>
        {currentShowName}
      </div>
      
      {/* Le conteneur invisible pour le widget Mixcloud */}
      <div ref={playerRef} className="w-full h-0 opacity-0" />
    </div>
  );
}
