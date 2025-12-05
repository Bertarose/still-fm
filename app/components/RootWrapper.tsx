// app/components/RootWrapper.tsx
'use client';

import React from 'react';

// VEUILLEZ UTILISER UN SEUL ../ et vérifier la CASSE du dossier 'context'
import { PlayerProvider } from '../context/PlayerContext'; 

export default function RootWrapper({ children }: { children: React.ReactNode }) {
    return (
        <PlayerProvider>
            {children} 
        </PlayerProvider>
    );
}