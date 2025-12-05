// components/LayoutProvider.tsx
'use client';

import React from 'react';
// 1. SUPPRIMER l'import de { PlayerProvider }

import FixedHeader from './FixedHeader';
import TopAudioPlayer from './TopAudioPlayer'; 

interface LayoutProviderProps {
    children: React.ReactNode;
    currentPage: string;
}

export default function LayoutProvider({ children, currentPage }: LayoutProviderProps) {
    // 2. SUPPRIMER <PlayerProvider> ici
    return (
        <div className="min-h-screen bg-black text-white font-mono relative pb-4">
            
            {/* Rendu du fond étoilé/motif */}
            <div className="absolute inset-0 z-0 opacity-5"
                style={{
                    backgroundImage: 'radial-gradient(#ffffff05 1px, transparent 1px), radial-gradient(#ffffff05 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />
            
            {/* MENU FIXE */}
            <FixedHeader currentPage={currentPage} />

            {/* LECTEUR AUDIO PERSISTANT */}
            <div className="sticky top-[64px] z-40">
                {/* Le TopAudioPlayer utilise usePlayer, donc le PlayerProvider doit être plus haut */}
                <TopAudioPlayer /> 
            </div>

            {/* CONTENU DES PAGES */}
            {children}
            
        </div>
    );
}