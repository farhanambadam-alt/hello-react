import { useEffect, useRef, useState } from 'react';
import { Play, Instagram } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let scriptLoaded = false;
function loadInstagramScript() {
  if (scriptLoaded) return;
  scriptLoaded = true;
  const s = document.createElement('script');
  s.src = 'https://www.instagram.com/embed.js';
  s.async = true;
  document.body.appendChild(s);
}

interface InstagramEmbedProps {
  url: string;
  type: 'post' | 'reel';
  mode?: 'thumb' | 'full';
  onLoaded?: () => void;
}

const InstagramEmbed = ({ url, type, mode = 'full', onLoaded }: InstagramEmbedProps) => {
  const ref = useRef<HTMLQuoteElement>(null);
  const [loaded, setLoaded] = useState(false);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    setLoaded(false);
    loadInstagramScript();

    const processEmbed = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setTimeout(() => {
          setLoaded(true);
          onLoadedRef.current?.();
        }, 1800);
      }
    };

    if (window.instgrm) {
      processEmbed();
    } else {
      const interval = setInterval(() => {
        if (window.instgrm) {
          clearInterval(interval);
          processEmbed();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [url]);

  const isReel = type === 'reel';
  const isThumbnail = mode === 'thumb';

  return (
    <div className={isThumbnail ? 'ig-card' : 'ig-card ig-card--full'}>
      {/* Loading placeholder */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
          <Skeleton className="absolute inset-0 rounded-none" />
          <Instagram
            size={isThumbnail ? 20 : 32}
            className="relative z-10 text-muted-foreground/40 animate-pulse"
          />
          {isReel && (
            <div className="relative z-10 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center shadow-md">
              <Play size={14} className="text-foreground ml-0.5" fill="currentColor" />
            </div>
          )}
          {!isThumbnail && (
            <span className="relative z-10 text-[11px] text-muted-foreground/50 font-body mt-1">
              Loading {type}…
            </span>
          )}
        </div>
      )}

      <div className="ig-viewport">
        <div
          className={isThumbnail ? 'ig-scaler' : 'ig-scaler ig-scaler--full'}
          style={isThumbnail ? {
            ['--crop-top' as string]: '60px',
            ['--crop-bottom' as string]: isReel ? '100px' : '80px',
          } : {
            ['--crop-top' as string]: '60px',
            ['--crop-bottom' as string]: isReel ? '100px' : '80px',
          }}
        >
          <blockquote
            ref={ref}
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{
              width: '100%',
              height: '100%',
              margin: 0,
              padding: 0,
              border: 0,
              minWidth: '100%',
              display: 'block',
              background: 'transparent',
            }}
          >
            <a href={url} />
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default InstagramEmbed;
