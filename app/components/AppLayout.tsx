// components/AppLayout.tsx
'use client';

import React from 'react';
import FixedHeader from './FixedHeader';
import TopAudioPlayer from './TopAudioPlayer'; 

// La hauteur du FixedHeader est 64px (32 + 32).
// La hauteur du TopAudioPlayer est 80px.
// La hauteur totale fixe est 144px.

export default function AppLayout({ children, currentPage }: { children: React.ReactNode, currentPage: string }) {
    
    // Remarque : Le PlayerProvider (PlayerContext.tsx) doit envelopper AppLayout dans votre root 'layout.tsx' ou '_app.tsx'

    return (
        <div className="min-h-screen bg-black text-white font-mono relative pb-4">
            
            {/* Rendu du fond étoilé/motif, etc. */}
            <div className="absolute inset-0 z-0 opacity-5"
                style={{
                    backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px), radial-gradient(#ffffff05 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />
            
            {/* 1. MENU FIXE (FixedHeader) */}
            <FixedHeader currentPage={currentPage} />

            {/* 2. LECTEUR AUDIO PERSISTANT (Sticky top-[64px] = juste sous le menu) */}
            {/* TopAudioPlayer doit contenir l'iframe Mixcloud qui gère la persistance */}
            <div className="sticky top-[64px] z-40">
                <TopAudioPlayer /> 
            </div>

            {/* 3. CONTENU DE LA PAGE (Children) */}
            {children}
            
        </div>
    );
}