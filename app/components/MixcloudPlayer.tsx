'use client';

interface MixcloudPlayerProps {
  mixcloudUrl: string;
}

export default function MixcloudPlayer({ mixcloudUrl }: MixcloudPlayerProps) {
  return (
    <div className="w-full">
      <iframe 
        width="100%" 
        height="120" 
        src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=${encodeURIComponent(mixcloudUrl)}`}
        frameBorder="0"
        className="border border-white"
      />
    </div>
  );
}
