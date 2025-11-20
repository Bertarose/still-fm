'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AudioPlayer from './components/AudioPlayer';
import { usePlayer } from './context/PlayerContext';

export default function LandingPage() {
  const { currentShow, isPlaying, togglePlay } = usePlayer();
  const [isLive, setIsLive] = useState(true); // Pour le test visuel
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


  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* === IMAGE DE FOND === */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bg.jpg" 
          alt="Background" 
          className={`w-full h-full object-cover transition-opacity duration-1000 image-vintage-effect ${isLive ? 'opacity-0' : 'opacity-80'}`} 
        />
        <div className="absolute inset-0 tv-noise-overlay pointer-events-none opacity-30" />
      </div>

      {/* === STREAM TWITCH (Visuel d'ambiance uniquement) === */}
      {/* pointer-events-none empêche de cliquer dessus, évitant le bouton play Twitch */}
      {isLive && (
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <iframe
            src={`https://player.twitch.tv/?channel=bertarose&parent=localhost&parent=still-fm.vercel.app&muted=true&autoplay=true&controls=false`}
            className="w-full h-full object-cover grayscale contrast-125 opacity-60"
            allowFullScreen
            style={{ border: 'none' }} 
          />
        </div>
      )}

      {/* === CANVAS (ÉTOILES) === */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-1 pointer-events-none mix-blend-screen opacity-50"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-3 pointer-events-none" />

      {/* === CONTENU PRINCIPAL === */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono pb-10">
        
        {/* INDICATEUR LIVE */}
        <div className="mb-8 flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-full bg-black/40 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-200">
            {isLive ? 'LIVE ON AIR' : 'OFFLINE'}
          </span>
        </div>

        {/* TITRE PRINCIPAL */}
        <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter mb-6 drop-shadow-2xl mix-blend-overlay opacity-90 select-none">
          STILL FM
        </h1>

        {/* === INFORMATION SHOW (Demande Client) === */}
        {/* Affiche le titre du show en cours ou "Loading..." */}
        <div className="mb-8 text-center max-w-2xl px-4">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">LATEST TRANSMISSION</div>
            <p className="text-sm md:text-lg uppercase font-bold text-white tracking-wider leading-relaxed">
                {currentShow ? currentShow.name : "LOADING FREQUENCY..."}
            </p>
        </div>

        {/* BOUTON ENTER SITE */}
        <Link 
          href="/home"
          className="group relative overflow-hidden"
        >
          <div className="border border-white px-16 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-black backdrop-blur-md bg-black/30 font-bold">
            Enter Site
          </div>
        </Link>

        <p className="mt-12 text-[10px] uppercase tracking-widest text-gray-500 opacity-60">
          Montreal Underground Radio
        </p>
      </div>

      {/* LECTEUR AUDIO FLOTTANT (Seul endroit pour contrôler le son) */}
      <AudioPlayer />
    </div>
  );
}
