'use client';

import { usePlayer } from '../context/PlayerContext';

export default function TopAudioPlayer() {
  const { currentShow } = usePlayer();

  if (!currentShow) {
    return (
      <div className="w-full bg-black border-b border-white h-[60px] flex items-center justify-center">
        <span className="text-white text-xs uppercase">No show loaded</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-black border-b border-white">
      <iframe
        width="100%"
        height="60"
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=1&feed=${encodeURIComponent(currentShow.key)}`}
        frameBorder="0"
        allow="autoplay"
      />
    </div>
  );
}
