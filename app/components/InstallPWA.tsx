'use client';
import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
      return;
    }

    // For iOS, show instructions button if not installed
    if (iOS) {
      setShowInstall(true);
      return;
    }

    // For Android/Chrome - listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // iOS - show instructions
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    // Android/Chrome - trigger install
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <>
      {/* Install Button : En haut à droite pour éviter le player mobile en bas */}
      <button
        onClick={handleInstallClick}
        className="fixed z-50 bg-white text-black px-4 md:px-6 py-2 md:py-3 text-[10px] md:text-xs uppercase tracking-wider font-bold border-2 border-black hover:bg-black hover:text-white transition-all flex items-center gap-2 shadow-lg"
        style={{ top: '1rem', right: '1rem' }}
      >
        <span>📱</span>
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowIOSInstructions(false)}
        >
          <div 
            className="bg-white text-black p-8 max-w-md border-2 border-black"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl uppercase tracking-wider font-bold mb-4">
              Install Still FM
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <p className="font-bold">Tap Share button</p>
                  <p className="text-gray-600">Bottom center (square with arrow)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <p className="font-bold">Scroll and find</p>
                  <p className="text-gray-600">"Add to Home Screen"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <p className="font-bold">Tap "Add"</p>
                  <p className="text-gray-600">Still FM icon on your home screen!</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full mt-6 bg-black text-white py-3 text-xs uppercase tracking-wider font-bold hover:bg-gray-800 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
