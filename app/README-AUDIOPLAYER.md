# 🎵 Still FM - Audio Player Update

## Ce qui a été ajouté:

### ✅ Nouveau composant: `AudioPlayer.tsx`
**Localisation:** `app/components/AudioPlayer.tsx`

**Fonctionnalités:**
- Player minimaliste style NTS en bas à gauche
- Récupère automatiquement le dernier show de Mixcloud Still FM
- Bouton Play/Pause élégant
- Affiche "Now Playing" avec le titre du show
- Indicateur live (point vert quand ça joue)
- Lien vers Mixcloud au hover
- Design noir & blanc cohérent avec ton site

### ✅ Landing Page mise à jour: `page.tsx`
**Localisation:** `app/page.tsx`

**Modifications:**
- Import du nouveau AudioPlayer
- Player intégré en position fixed bottom-left
- Reste visible sur toute la page

### ✅ Ancien composant conservé: `MixcloudPlayer.tsx`
Le composant original reste intact pour la compatibilité avec tes autres pages (home, shows, etc.)

---

## 🚀 Installation:

1. **Remplace ton dossier `app` actuel** par celui dans ce dossier
2. **OU** copie seulement les fichiers modifiés:
   - `app/components/AudioPlayer.tsx` (NOUVEAU)
   - `app/page.tsx` (MODIFIÉ)

---

## ⚙️ Configuration:

Dans `app/components/AudioPlayer.tsx` ligne 23, vérifie que le username Mixcloud est correct:

```typescript
const response = await fetch('https://api.mixcloud.com/StillFM/cloudcasts/?limit=1');
```

**Si ton username Mixcloud est différent, change "StillFM" par ton username exact!**

---

## 🎨 Personnalisation:

### Changer la position du player:
Dans `AudioPlayer.tsx`, ligne 105:
```tsx
className="fixed bottom-6 left-6 ..."
```
- `bottom-6` = 1.5rem du bas
- `left-6` = 1.5rem de la gauche

### Changer les couleurs:
- Background: `bg-black/90` (ligne 105)
- Border: `border-white/20` (ligne 105)
- Dot color when playing: `bg-green-400` (ligne 138)

---

## 🧪 Test:

1. Lance ton projet: `npm run dev`
2. Ouvre: `http://localhost:3000`
3. Le player devrait apparaître en bas à gauche
4. Clique sur Play pour tester!

---

## 📱 Responsive:

Le player est déjà responsive et fonctionne sur:
- Desktop ✅
- Tablette ✅
- Mobile ✅

Sur mobile, il reste en bas à gauche mais s'adapte automatiquement.

---

## 🔊 Prochaines étapes possibles:

- Ajouter le player sur d'autres pages (home, shows, etc.)
- Ajouter un contrôle de volume
- Afficher la pochette du show
- Ajouter une visualisation audio
- Faire un player qui reste entre les pages (persistent player)

---

**Questions? Dis-moi et on continue! 🎧**
