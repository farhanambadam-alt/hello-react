import { useState } from 'react';
import { Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface YouTubeShortProps {
  videoId: string;
  mode?: 'thumb' | 'full';
}

const YouTubeShort = ({ videoId, mode = 'full' }: YouTubeShortProps) => {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(mode === 'full');

  // Extract clean video ID (strip query params like ?si=...)
  const cleanId = videoId.split('?')[0];
  const thumbnailUrl = `https://img.youtube.com/vi/${cleanId}/0.jpg`;

  if (mode === 'thumb' || !playing) {
    return (
      <div
        className="relative w-full h-full cursor-pointer group"
        onClick={() => mode === 'full' && setPlaying(true)}
      >
        {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
        <img
          src={thumbnailUrl}
          alt="YouTube Short"
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={18} className="text-primary-foreground ml-0.5" fill="white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-foreground">
      <iframe
        src={`https://www.youtube.com/embed/${cleanId}?autoplay=1&loop=1&playlist=${cleanId}&rel=0&modestbranding=1`}
        title="YouTube Short"
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      />
    </div>
  );
};

export default YouTubeShort;
