'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isLive, setIsLive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = 150;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.5, '#0a0a1a');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      particles.forEach((particleA, indexA) => {
        particles.slice(indexA + 1).forEach(particleB => {
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Check if stream is live
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkLiveStatus = async () => {
      try {
        setIsLive(false);
      } catch (error) {
        console.error('Error checking live status:', error);
        setIsLive(false);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Optional: Show Twitch when live */}
      {isLive && (
        <div className="absolute inset-0 w-full h-full opacity-30">
          <iframe
            src="https://player.twitch.tv/?channel=stillfmradio&parent=localhost&parent=still-fm.vercel.app&parent=www.stillfm.com&parent=stillfm.com&muted=true&autoplay=true"
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
