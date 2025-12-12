// app/layout.tsx
import { PlayerProvider } from './context/PlayerContext';
import './globals.css';
// MODIFICATIONS À AJOUTER DANS app/layout.tsx
import InstallPWA from './components/InstallPWA'; // Import ajouté

// Métadonnées mises à jour
export const metadata = {
  title: 'Still FM - Underground Radio Montreal',
  description: 'Independent underground radio station from Montreal',
  manifest: '/manifest.json', // ← AJOUTÉ
  themeColor: '#000000',      // ← AJOUTÉ
  appleWebApp: {              // ← BLOC AJOUTÉ
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Still FM'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
};


export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags - AJOUTÉES */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Still FM" />
      </head>
      <body>
        <PlayerProvider>
          {children}
        </PlayerProvider>
        <InstallPWA /> {/* ← COMPOSANT AJOUTÉ */}
        
        {/* Service Worker Registration - SCRIPT AJOUTÉ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered:', reg))
                    .catch(err => console.log('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
