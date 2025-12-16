'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import LandingAudioPlayer from './components/LandingAudioPlayer';
import InstallPWA from './components/InstallPWA';

export default function LandingPage() {
  const [isLive, setIsLive] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const twitchRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Vérification statut Twitch
  useEffect(() => {
    const checkTwitchStatus = async () => {
      try {
        const res = await fetch('https://decapi.me/twitch/uptime/bertarose');
        const text = await res.text();
        const online =
          !text.toLowerCase().includes('offline') &&
          !text.toLowerCase().includes('error');
        setIsLive(online);
      } catch {
        setIsLive(false);
      }
    };
    checkTwitchStatus();
    const interval = setInterval(checkTwitchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Twitch script
  useEffect(() => {
    if ((window as any).Twitch) {
      setScriptLoaded(true);
      return;
    }
    const id = 'twitch-embed-script';
    if (document.getElementById(id)) return;

    const script = document.createElement('script');
    script.id = id;
    script.src = 'https://player.twitch.tv/js/embed/v1.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(id);
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  // Twitch player init
  useEffect(() => {
    if (!scriptLoaded || !isLive || !(window as any).Twitch || twitchRef.current)
      return;

    let retryCount = 0;
    const maxRetries = 10;

    const initTwitch = () => {
      const embedDiv = document.getElementById('twitch-embed');
      if (!embedDiv) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initTwitch, 200);
        }
        return;
      }

      try {
        const player = new (window as any).Twitch.Player('twitch-embed', {
          channel: 'bertarose',
          width: '100%',
          height: '100%',
          muted: true,
          autoplay: true,
          parent: [
            window.location.hostname,
            'localhost',
            '127.0.0.1',
            'still-fm.vercel.app',
            'www.stillfm.com',
            'stillfm.com',
          ],
        });

        twitchRef.current = player;

        player.addEventListener(
          (window as any).Twitch.Player.READY,
          () => {}
        );

        player.addEventListener(
          (window as any).Twitch.Player.ONLINE,
          () => setIsLive(true)
        );

        player.addEventListener(
          (window as any).Twitch.Player.OFFLINE,
          () => setIsLive(false)
        );
      } catch (error) {
        console.error('Twitch player init error:', error);
      }
    };

    setTimeout(initTwitch, 500);

    return () => {
      if (twitchRef.current?.destroy) {
        twitchRef.current.destroy();
        twitchRef.current = null;
      }
    };
  }, [scriptLoaded, isLive]);

  // Video open/close with vibration & shake effect
  const openVideo = useCallback(() => {
    if (!twitchRef.current) return;
    twitchRef.current.setMuted(false);
    setWatchMode(true);

    // Vibration mobile
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    // Shake effect sur le bouton
    const btn = document.getElementById('watch-btn');
    if (btn) {
      btn.classList.add('vibe-effect');
      setTimeout(() => btn.classList.remove('vibe-effect'), 600);
    }
  }, []);

  const closeVideo = useCallback(() => {
    if (!twitchRef.current) return;
    twitchRef.current.setMuted(true);
    setWatchMode(false);
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
    }));

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden landing-page">

      {/* Twitch Embed */}
      {isLive && (
        <div
          id="twitch-embed"
          className={`absolute inset-0 transition-opacity duration-700 ${
            watchMode ? 'z-30 opacity-100' : 'z-0 opacity-70'
          }`}
        />
      )}

      {/* Fallback Video */}
      {!isLive && (
        <video
          src="/video.mov"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Canvas */}
      {!watchMode && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 mix-blend-screen opacity-40"
        />
      )}

      {/* Logo */}
      {!watchMode && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center text-white pointer-events-none -translate-y-28 md:-translate-y-8">
          <Image
            src="/Stillfm logo-white.png"
            alt="Still FM"
            width={600}
            height={200}
            className="w-[300px] sm:w-[260px] md:w-[500px]"
            priority
          />
        </div>
      )}

      {/* Player + Install */}
      {!watchMode && (
        <div
          className={`fixed bottom-0 left-0 right-0 md:left-4 md:bottom-4 z-50 flex flex-col md:items-start items-center gap-2 transition-all ${
            isLive ? 'footer-glow' : ''
          }`}
        >
          <LandingAudioPlayer
            isLive={isLive}
            onWatchVideo={openVideo}
            onCloseVideo={closeVideo}
            watchBtnId="watch-btn"
          />
          <InstallPWA />
        </div>
      )}

      {/* Close Stream Button */}
      {watchMode && (
        <button
          onClick={closeVideo}
          className="fixed top-6 right-6 z-50 bg-black/80 backdrop-blur-sm border border-white/50 px-6 py-3 text-sm uppercase tracking-widest font-bold text-white hover:bg-white hover:text-black transition-all shadow-lg"
        >
          ✕ Close Stream
        </button>
      )}

      {/* Vibe CSS */}
      <style jsx>{`
        .vibe-effect {
          animation: shake 0.6s ease-in-out;
        }
        @keyframes shake {
          0% { transform: translate(0,0); }
          25% { transform: translate(6px,-6px); }
          50% { transform: translate(-6px,6px); }
          75% { transform: translate(6px,6px); }
          100% { transform: translate(0,0); }
        }
        .footer-glow {
          animation: pulse 1s infinite alternate;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 5px #fff; }
          100% { box-shadow: 0 0 20px #fff; }
        }
      `}</style>
    </div>
  );
}
