'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// --- Début de la logique de la Radio Mixcloud ---

// Interface pour typer les données de l'API Mixcloud
interface MixcloudShow {
  key: string; // Ex: "/stillfmradio/still-fm-ep-200-show-name/"
  name: string;
}

// Hook personnalisé pour charger le script de l'API Mixcloud
const useMixcloudScript = (onScriptLoad: () => void) => {
  useEffect(() => {
    // Vérifie si le script est déjà chargé
    if (document.getElementById('mixcloud-widget-api')) {
      onScriptLoad();
      return;
    }

    const script = document.createElement('script');
    script.id = 'mixcloud-widget-api';
    script.src = 'https://www.mixcloud.com/media/js/widgetApi.js';
    script.async = true;
    script.onload = onScriptLoad; // Appelle notre fonction quand le script est prêt
    document.body.appendChild(script);

    return () => {
      // Nettoyage (optionnel, mais propre)
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onScriptLoad]);
};

// --- Fin de la logique de la Radio Mixcloud ---


export default function LandingPage() {
  const [isLive, setIsLive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- États pour la Radio ---
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showList, setShowList] = useState<MixcloudShow[]>([]);
  const [currentShowName, setCurrentShowName] = useState('Loading radio...');
  const playerRef = useRef<HTMLDivElement>(null); // Référence au conteneur du lecteur
  const widgetRef = useRef<any>(null); // Référence au widget Mixcloud

  // 1. Charger la liste des shows (une seule fois)
  useEffect(() => {
    const fetchShows = async () => {
      try {
        // <-- MODIFIÉ : J'essaie avec 'stillfmradio'
        const response = await fetch('https://api.mixcloud.com/stillfmradio/cloudcasts/');
        const data = await response.json();
        
        // <-- AJOUTÉ : Vérification plus robuste
        if (data.data && data.data.length > 0) {
          const formattedShows: MixcloudShow[] = data.data.map((show: any) => ({
            key: show.key,
            name: show.name,
          }));
          setShowList(formattedShows);
        } else {
          // Si la liste est vide
          console.error('Aucun show trouvé pour ce compte.');
          setCurrentShowName('Aucun show trouvé.'); // <-- Nouveau message d'état
        }
      } catch (error) {
        // Si l'API plante
        console.error('Erreur de chargement des shows Mixcloud:', error);
        setCurrentShowName('Radio error.'); // <-- Nouveau message d'état
      }
    };
    fetchShows();
  }, []); // Ce crochet ne s'exécute qu'une fois

  // 2. Fonction pour jouer un show aléatoire
  const playRandomShow = () => {
    if (showList.length === 0 || !widgetRef.current) {
      console.log('Liste de shows vide ou widget non prêt.');
      return;
    }

    const randomShow = showList[Math.floor(Math.random() * showList.length)];
    setCurrentShowName(randomShow.name);
    widgetRef.current.load(randomShow.key, true); // 'true' = autoplay
  };

  // 3. Charger le script de l'API
  useMixcloudScript(() => {
    setIsScriptLoaded(true); // Le script est prêt
  });

  // 4. Initialiser le widget (quand le script et la liste de shows sont prêts)
  useEffect(() => {
    // Ne s'exécute que si tout est prêt
    if (isScriptLoaded && showList.length > 0 && playerRef.current && !widgetRef.current) {
      
      const widget = (window as any).Mixcloud.PlayerWidget(playerRef.current);
      widgetRef.current = widget;

      widget.ready.then(() => {
        widget.events.ended.on(playRandomShow); // Joue le suivant à la fin
        playRandomShow(); // Joue le premier
      });
    }
    // Ce crochet se ré-exécute si isScriptLoaded ou showList changent
  }, [isScriptLoaded, showList]);


  // ... (votre code d'animation de particules reste ici) ...
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number;
      canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D;
      constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas; this.ctx = ctx;
        this.x = Math.random() * this.canvas.width; this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25; this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > this.canvas.width) this.x = 0; if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0; if (this.y < 0) this.y = this.canvas.height;
      }
      draw() {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        this.ctx.beginPath(); this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); this.ctx.fill();
      }
    }
    const particleCount = 150; const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) { particles.push(new Particle(canvas, ctx)); }
    const animate = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000000'); gradient.addColorStop(0.5, '#0a0a1a'); gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => { particle.update(); particle.draw(); });
      particles.forEach((particleA, indexA) => {
        particles.slice(indexA + 1).forEach(particleB => {
          const dx = particleA.x - particleB.x; const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y); ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resizeCanvas); };
  }, []);

  // ... (votre code 'checkLiveStatus' reste ici) ...
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkLiveStatus = async () => {
      try { setIsLive(false); } catch (error) { console.error('Error checking live status:', error); setIsLive(false); }
    };
    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 60000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* === LECTEUR RADIO === */}
      <div className="relative z-20 w-full p-4 backdrop-blur-sm bg-black/10 text-white font-mono text-center">
        <div className="text-xs uppercase tracking-widest mb-2">NOW PLAYING (RANDOM)</div>
        {/* Affiche le nom du show ou le message d'erreur */}
        <div className="text-xs truncate px-4" title={currentShowName}>
          {currentShowName}
        </div>
        
        {/* Le conteneur invisible pour le widget Mixcloud */}
        <div ref={playerRef} className="w-full h-0 opacity-0" />
      </div>
      {/* === FIN LECTEUR RADIO === */}


      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Optional: Show Twitch when live */}
      {isLive && (
        <div className="absolute inset-0 w-full h-full opacity-30">
          <iframe
            src={`https://player.twitch.tv/?channel=stillfmradio&parent=localhost&parent=stillfm-radio.vercel.app&parent=www.stillfm.com&parent=stillfm.com&muted=true&autoplay=true`}
            className="w-full h-full object-cover"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      )}

      {/* Dark Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono">
        
        {/* Live/Offline Indicator */}
        <div className="mb-8 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-xs uppercase tracking-widest">
            {isLive ? 'LIVE NOW' : 'OFFLINE'}
          </span>
        </div>

        {/* Logo/Title */}
        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-widest mb-16 drop-shadow-2xl">
          STILL FM
        </h1>

        {/* Enter Button */}
        <Link 
          href="/home"
          className="group relative"
        >
          <div className="border-2 border-white px-12 py-4 text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black backdrop-blur-sm">
            Enter Site
          </div>
        </Link>

        {/* Subtitle */}
        <p className="mt-8 text-xs uppercase tracking-wider text-gray-300">
          Montreal Underground Radio
        </p>
      </div>
    </div>
  );
}
