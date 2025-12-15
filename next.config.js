// next.config.js - Configuration finale avec next-pwa et Webpack forcé

const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    cacheOnFrontEndNav: true,
    aggressive: true,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // =======================================================
    // === AJOUT POUR DÉSACTIVER TURBOPACK (SOLUTION DE L'ERREUR) ===
    // =======================================================
    compiler: {
        // Cette ligne force l'utilisation de Webpack au lieu de Turbopack.
        turbopack: false, 
    },
    // =======================================================

    async headers() {
        return [
            // ... (Vos headers existants)
        ];
    },

    images: {
        // ... (Vos images existantes)
    },
};

// Exporte la configuration Next.js enveloppée par le plugin PWA
module.exports = withPWA(nextConfig);
