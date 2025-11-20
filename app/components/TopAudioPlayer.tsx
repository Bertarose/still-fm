'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

// Hook pour charger le script API Mixcloud proprement
const useMixcloudScript = (onScriptLoad: () => void) => {
  useEffect(() => {
    if (window.location.hostname === 'localhost' || typeof document === 'undefined') {
        // Petite sécurité
    }

    if ((window as any).Mixcloud) {
      onScriptLoad();
      return;
    }

    const id = 'mixcloud-widget-api-script';
    if (document.getElementById(id)) {
      return; // Déjà en cours de chargement
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://www.mixcloud.com/media/js/widgetApi.js';
    script.async = true;
    script.onload = onScriptLoad;
    document.body.appendChild(script);
  }, [onScriptLoad]);
};

export default function TopAudioPlayer() {
  const { currentShow, isPlaying, togglePlay, playShow } = usePlayer();
  const [isReady, setIsReady] = useState(false);
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Charger le script API
  useMixcloudScript(() => {
    // Le script est chargé, on peut initialiser si l'iframe est là
    if (iframeRef.current && !widgetRef.current) {
       initWidget();
    }
  });

  // Fonction d'initialisation du widget
  const initWidget = () => {
    if (!iframeRef.current || !(window as any).Mixcloud) return;

    const widget = (window as any).Mixcloud.PlayerWidget(iframeRef.current);
    widgetRef.current = widget;

    widget.ready.then(() => {
      setIsReady(true);
      console.log("Mixcloud Widget Ready");
      
      // Synchroniser les événements du widget avec notre Contexte (optionnel mais recommandé)
      // Par exemple, si l'utilisateur met pause directement sur le widget iframe
      widget.events.pause.on(() => {
         // On pourrait mettre à jour le contexte ici si on voulait une synchro parfaite bidirectionnelle
      });
    });
  };

  // 2. Initialiser un show par défaut si le contexte est vide au démarrage
  useEffect(() => {
    if (!currentShow) {
        const fetchLatest = async () => {
            try {
                const res = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
                const data = await res.json();
                if(data.data && data.data.length > 0) {
                    // On injecte le show dans le contexte MAIS sans le jouer tout de suite (false)
                    // Cela permet d'avoir le lecteur visuellement prêt
                    // Note : playShow du contexte met isPlaying à true, donc on ruse un peu ou on accepte l'autoplay
                    // Pour faire simple ici, on laisse l'utilisateur cliquer.
                }
            } catch(e) { console.error(e); }
        };
        fetchLatest();
    }
  }, []);

  // 3. RÉACTION : Quand le show change dans le contexte (clic sur une grille)
  useEffect(() => {
    if (widgetRef.current && currentShow) {
        // On charge le nouveau show et ON LANCE LA LECTURE (true)
        widgetRef.current.load(currentShow.key, true).then(() => {
            // Par sécurité, on s'assure que ça joue
             widgetRef.current.play();
        });
    }
  }, [currentShow]); // Se déclenche quand currentShow change

  // 4. RÉACTION : Quand isPlaying change (clic sur Play/Pause global)
  useEffect(() => {
    if (widgetRef.current && isReady) {
        if (isPlaying) {
            widgetRef.current.play();
        } else {
            widgetRef.current.pause();
        }
    }
  }, [isPlaying, isReady]);


  // Si aucun show n'est chargé, on ne rend rien ou un placeholder
  if (!currentShow) {
      return (
        <div className="w-full backdrop-blur-md bg-black border-b border-gray-800 font-mono h-[80px] flex items-center justify-center z-50">
            <span className="text-gray-500 text-xs uppercase animate-pulse">Waiting for signal...</span>
        </div>
      );
  }

  return (
    <div className="w-full backdrop-blur-md bg-black border-b border-gray-800 font-mono h-[80px] flex items-center z-50 relative">
      
      {/* Iframe Mixcloud */}
      <iframe
        ref={iframeRef}
        width="100%"
        height="60"
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&autoplay=${isPlaying ? 1 : 0}&feed=${encodeURIComponent(currentShow.key)}`}
        frameBorder="0"
        allow="autoplay"
        className="absolute top-2 left-0 w-full h-full"
        onLoad={initWidget} // Tente l'init au chargement de l'iframe
      />
      
      {/* Overlay de contrôle (Optionnel : masque l'iframe pour utiliser nos propres boutons, 
          mais ici on laisse l'iframe native pour avoir la barre de progression) */}
    </div>
  );
}
