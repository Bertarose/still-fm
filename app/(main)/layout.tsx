// app/(main)/layout.tsx
import FixedHeader from '../components/FixedHeader';      
import TopAudioPlayer from '../components/TopAudioPlayer'; 

// app/(main)/layout.tsx
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-black">
        <TopAudioPlayer />
        <FixedHeader />
      </div>

      {/* Padding ajusté : 60px (player) + 64px (header) = 124px */}
      <main className="pt-[124px]">
        {children}
      </main>
    </>
  );
}