'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AudioPlayer from './components/AudioPlayer';

export default function LandingPage() {
  const [isLive, setIsLive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null); // Référence pour l'image de fond

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

  // Vérification du statut LIVE (Simulé ou via API si vous avez une route Twitch)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkLiveStatus = async () => {
      try { setIsLive(false); } catch (error) { console.error('Error checking live status:', error); setIsLive(false); }
    };
    checkLiveStatus();
  }, []);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* === IMAGE DE FOND AVEC EFFET VIEILLE TÉLÉ === */}
      {/* Le conteneur `image-vintage-effect` applique les filtres et le grain */}
      <div className="absolute inset-0 z-0">
        <img 
          ref={imageRef} // J'ai ajouté une référence ici si besoin plus tard
          src="/bg.jpg" 
          alt="Background" 
          // MODIFICATIONS ICI : Les classes CSS `image-vintage-effect` et `tv-noise-overlay` sont définies dans `globals.css`
          className="w-full h-full object-cover opacity-80 image-vintage-effect" 
        />
        {/* Cet overlay simule le "grain" ou le "bruit" d'une vieille télévision */}
        <div className="absolute inset-0 tv-noise-overlay pointer-events-none" />
      </div>

      {/* === CANVAS (ÉTOILES) === */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-1 pointer-events-none"
      />

      {/* Optional: Show Twitch when live */}
      {isLive && (
        <div className="absolute inset-0 w-full h-full opacity-30 z-2 pointer-events-none">
          <iframe
            src={`https://player.twitch.tv/?channel=stillfmradio&parent=localhost&parent=stillfm-radio.vercel.app&parent=www.stillfm.com&parent=stillfm.com&muted=true&autoplay=true`}
            className="w-full h-full object-cover"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      )}

      {/* Dark Overlay (Reduced) */}
      <div className="absolute inset-0 bg-black/10 z-3 pointer-events-none" />

      {/* === CONTENU PRINCIPAL === */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white font-mono">
        
        {/* Indicateur Live */}
        <div className="mb-8 flex items-center gap-3 backdrop-blur-sm px-4 py-2 rounded-full bg-black/20 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-[10px] uppercase tracking-[0.2em]">
            {isLive ? 'LIVE ON AIR' : 'OFFLINE'}
          </span>
        </div>

        {/* Grand Titre */}
        <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter mb-12 drop-shadow-2xl mix-blend-overlay opacity-90">
          STILL FM
        </h1>

        {/* Bouton Enter */}
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

      {/* === LECTEUR AUDIO (Unique) === */}
      <AudioPlayer />
    </div>
  );
}
