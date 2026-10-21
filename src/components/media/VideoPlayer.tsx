'use client';

import { Play } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type VideoPlayerProps = {
  title: string;
  youtubeId?: string;
  /** Self-hosted MP4 path, e.g. '/videos/intro.mp4', or a CMS upload URL. */
  src?: string;
  /** Thumbnail shown by the <video> element while the file loads. */
  poster?: string;
  /** vertical 9:16 · landscape 16:9 · cinema 16:9 on mobile → 21:9 on desktop */
  aspect: 'vertical' | 'landscape' | 'cinema';
  playLabel: string;
  soonLabel: string;
  className?: string;
  /** Server-rendered poster shown until the user presses play (a lightweight "facade"). */
  children: ReactNode;
};

/**
 * Click-to-load video facade: no third-party iframe is loaded until the visitor asks for it,
 * which keeps pages fast and privacy-friendly (youtube-nocookie).
 */
export function VideoPlayer({ title, youtubeId, src, poster, aspect, playLabel, soonLabel, className, children }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const playable = Boolean(youtubeId || src);

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-secondary-900',
        aspect === 'vertical' ? 'aspect-[9/16]' : aspect === 'cinema' ? 'aspect-video lg:aspect-[21/9]' : 'aspect-video',
        className,
      )}
    >
      {playing && playable ? (
        youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <video src={src} poster={poster} title={title} controls autoPlay playsInline className="absolute inset-0 size-full bg-black object-cover" />
        )
      ) : (
        <>
          <div className="absolute inset-0">{children}</div>
          <button
            type="button"
            onClick={() => setPlaying(true)}
            disabled={!playable}
            aria-label={playable ? `${playLabel}: ${title}` : `${title} — ${soonLabel}`}
            className="group/play absolute inset-0 grid size-full place-items-center disabled:cursor-default"
          >
            <span className="relative grid place-items-center">
              {playable && <span aria-hidden className="absolute size-20 animate-pulse-ring rounded-full bg-white/40" />}
              <span
                aria-hidden
                className="relative grid size-16 place-items-center rounded-full bg-white/95 text-primary shadow-glow-lg transition-transform duration-300 ease-optical group-hover/play:scale-110"
              >
                {/* Media controls never mirror in RTL. */}
                <Play className="ml-1 size-6 fill-current" />
              </span>
              {!playable && (
                <span className="glass-dark absolute top-full mt-3 whitespace-nowrap rounded-full px-3 py-1 font-heading text-xs font-bold text-white">
                  {soonLabel}
                </span>
              )}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
