// next.config.js - Configuration finale avec next-pwa

/** @type {import('next').NextConfig} */
const nextConfig = {
    // PWA Configuration
    reactStrictMode: true,

    // Headers pour PWA (Gardés car ils sont bien configurés)
    async headers() {
        return [
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/manifest+json',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, must-revalidate',
                    },
                ],
            },
            {
                // Ces headers sont cruciaux pour le Service Worker
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate', // Force la mise à jour
                    },
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/', // Permet au SW de contrôler tout le domaine
                    },
                ],
            },
        ];
    },

    // Images optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'thumbnailer.mixcloud.com',
            },
        ],
    },
};

// =======================================================
// === INTÉGRATION DE NEXT-PWA ===
// =======================================================

const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public', // Le Service Worker généré ira dans /public/sw.js
    cacheOnFrontEndNav: true, // Met en cache les pages visitées
    aggressive: true, // Active le mode de mise en cache plus rapide
    reloadOnOnline: true, // Recharge l'application si l'utilisateur revient en ligne
    disable: process.env.NODE_ENV === 'development', // DÉSACTIVE le PWA en mode développement
});

// Exporte la configuration Next.js enveloppée par le plugin PWA
module.exports = withPWA(nextConfig);
