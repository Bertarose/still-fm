'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AudioPlayer from './components/AudioPlayer';
import { usePlayer } from './context/PlayerContext';

export default function LandingPage() {
  const { togglePlay } = usePlayer();
  const [isLive, setIsLive] = useState(false); // On laisse false par défaut, l'API nous dira si c'est vrai
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Référence pour éviter de charger le player deux fois
  const playerInitialized = useRef(false);

  // --- 1. INTÉGRATION TWITCH API (Le "Force Play") ---
  useEffect(() => {
    // Sécurité pour ne pas charger si on quitte la page ou re-render
    if (playerInitialized.current) return;

    // Fonction d'initialisation du player
    const initTwitchPlayer = () => {
      if ((window as any).Twitch && document.getElementById('twitch-embed')) {
        playerInitialized.current = true;
        
        const options = {
          width: '100%',
          height: '100%',
          channel: 'bertarose', // Votre chaîne
          // LISTE DES DOMAINES AUTORISÉS (Important pour Twitch)
          parent: ['localhost', 'still-fm.vercel.app', 'www.stillfm.com', 'stillfm.com'], 
          autoplay: true,   // Demande la lecture auto
          muted: true,      // OBLIGATOIRE pour l'autoplay
          controls: false,  // CACHE L'INTERFACE (Le gros bouton play, le volume, etc.)
        };

        const player = new (window as any).Twitch.Player('twitch-embed', options);

        // Écouteurs d'événements pour automatiser le tout
        player.addEventListener((window as any).Twitch.Player.READY, () => {
          console.log("Twitch Ready");
          player.setMuted(true); // On insiste sur le mute
          player.play(); // ON POUSSE LE PLAY ICI
        });

        // Si le stream commence à jouer, on considère qu'on est LIVE
        player.addEventListener((window as any).Twitch.Player.PLAY, () => {
          console.log("Twitch Playing -> LIVE ON");
          setIsLive(true);
        });

        // Si le stream est offline
        player.addEventListener((window as any).Twitch.Player.OFFLINE, () => {
          console.log("Twitch Offline");
          setIsLive(false);
        });
      }
    };

    // Chargement du script Twitch si pas déjà là
    if (!document.getElementById('twitch-js')) {
      const script = document.createElement('script');
      script.id = 'twitch-js';
      script.src = 'https://player.twitch.tv/js/embed/v1.js';
      script.async = true;
      script.onload = initTwitchPlayer;
      document.body.appendChild(script);
    } else {
      initTwitchPlayer();
    }

  }, []);


  // --- 2. Animation des étoiles (Canvas) ---
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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


  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* === CONTAINER TWITCH (En arrière-plan absolu) === */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Le div qui recevra le lecteur Twitch via JS */}
        <div 
          id="twitch-embed" 
          className={`w-full h-full object-cover transition-opacity duration-1000 grayscale contrast-125 pointer-events-none ${isLive ? 'opacity-60' : 'opacity-0'}`}
        />
      </div>

      {/* === IMAGE DE FOND (Visible si Twitch est Offline ou charge) === */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isLive ? 'opacity-0' : 'opacity-80'}`}>
        <img 
          src="/bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover image-vintage-effect" 
        />
        <div className="absolute inset-0 tv-noise-overlay pointer-events-none opacity-30" />
      </div>

      {/* === CANVAS (ÉTOILES) === */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-1 pointer-events-none mix-blend-screen opacity-50"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-3 pointer-events-none" />

      {/* === CONTENU PRINCIPAL === */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono pb-20">
        
        {/* INDICATEUR LIVE (Automatique maintenant !) */}
        <div className="mb-8 flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-full bg-black/40 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-200">
            {isLive ? 'LIVE ON AIR' : 'OFFLINE'}
          </span>
        </div>

        {/* TITRE (Sans interaction confuse) */}
        <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter mb-12 drop-shadow-2xl mix-blend-overlay opacity-90 select-none">
          STILL FM
        </h1>

        {/* BOUTON D'ENTRÉE */}
        <Link 
          href="/home"
          className="group relative overflow-hidden"
        >
          <div className="border border-white px-16 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black backdrop-blur-md bg-black/30 font-bold">
            Enter Site
          </div>
        </Link>

        <p className="mt-8 text-[10px] uppercase tracking-widest text-gray-400 opacity-70">
          Montreal Underground Radio
        </p>
      </div>

      {/* LECTEUR AUDIO FLOTTANT */}
      <AudioPlayer />
    </div>
  );
}
