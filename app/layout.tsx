// app/layout.tsx
import { PlayerProvider } from './context/PlayerContext';
import './globals.css';
import InstallPWA from './components/InstallPWA'; // Import conservé

// Métadonnées Mises à Jour (utilisées par Next.js pour générer le <head>)
export const metadata = {
  title: 'Still FM - Underground Radio Montreal',
  description: 'Independent underground radio station from Montreal',
  
  // Paramètres PWA directement gérés par Next.js
  manifest: '/manifest.json', 
  themeColor: '#000000',      
  appleWebApp: {              
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Still FM'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  },
  // Utilisation de l'objet 'icons' pour gérer l'icône Apple Touch
  icons: {
    apple: '/icon-192.png',
  },
};


export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      {/* 🛑 LA BALISE <head> MANUELLE DOIT ÊTRE SUPPRIMÉE DE CET ENDROIT ! */}
      <body>
        <PlayerProvider>
          {children}
        </PlayerProvider>
        <InstallPWA /> {/* Composant conservé dans le <body> */}
        
        {/* Service Worker Registration - Conservé dans le <body> */}
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
