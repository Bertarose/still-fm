'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AudioPlayer from './components/AudioPlayer';
import { usePlayer } from './context/PlayerContext'; // Import du Contexte

export default function LandingPage() {
  // On récupère les commandes du lecteur global
  const { currentShow, isPlaying, togglePlay } = usePlayer();
  
  const [isLive, setIsLive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Animation des étoiles (Canvas) ---
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

  // Check Live Status (Twitch)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkLiveStatus = async () => {
      // Mettez à true pour tester le fond vidéo
      try { setIsLive(false); } catch (error) { console.error(error); setIsLive(false); }
    };
    checkLiveStatus();
  }, []);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* === CONTROLE RADIO (HAUT) === */}
      <div className="relative z-30 w-full p-4 backdrop-blur-sm bg-black/10 text-white font-mono flex flex-col items-center justify-center border-b border-white/10">
        <div className="text-xs uppercase tracking-widest mb-2 text-gray-400">STILL FM RADIO</div>
        
        <div className="flex items-center gap-4">
          {/* BOUTON PLAY / PAUSE GLOBAL (Contrôle le AudioPlayer) */}
          <button 
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-current"></div>
                <div className="w-1 h-3 bg-current"></div>
              </div>
            ) : (
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-current border-b-[5px] border-b-transparent ml-1"></div>
            )}
          </button>

          <div className="text-xs truncate max-w-[200px] md:max-w-md uppercase tracking-wide">
            {currentShow ? currentShow.name : 'Loading...'}
          </div>
        </div>
      </div>

      {/* === IMAGE DE FOND === */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-80 image-vintage-effect" 
        />
        <div className="absolute inset-0 tv-noise-overlay pointer-events-none" />
      </div>

      {/* === CANVAS (ÉTOILES) === */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-1 pointer-events-none mix-blend-screen"
      />

      {/* Optional: Show Twitch when live */}
      {isLive && (
        <div className="absolute inset-0 w-full h-full opacity-30 z-2 pointer-events-none">
          <iframe
            src={`https://player.twitch.tv/?channel=bertarose&parent=localhost&parent=still-fm.vercel.app&muted=true&autoplay=true`}
            className="w-full h-full object-cover"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10 z-3 pointer-events-none" />

      {/* === CONTENU PRINCIPAL === */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono pb-20">
        
        <div className="mb-8 flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-full bg-black/20 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-[10px] uppercase tracking-[0.2em]">
            {isLive ? 'LIVE ON AIR' : 'OFFLINE'}
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter mb-12 drop-shadow-2xl mix-blend-overlay opacity-90 select-none">
          STILL FM
        </h1>

        <Link 
          href="/home"
          className="group relative overflow-hidden"
        >
          <div className="border border-white px-16 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black backdrop-blur-md bg-black/20">
            Enter Site
          </div>
        </Link>

        <p className="mt-8 text-[10px] uppercase tracking-widest text-gray-400 opacity-70">
          Montreal Underground Radio
        </p>
      </div>

      {/* LECTEUR AUDIO FLOTTANT (Apparaît en bas à gauche) */}
      <AudioPlayer />
    </div>
  );
}
