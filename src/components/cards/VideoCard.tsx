import { Clock } from 'lucide-react';
import Image from 'next/image';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { OpticArt } from '@/components/ui/OpticArt';
import { siteConfig } from '@/config/site';
import { videoSources } from '@/content/media';

type VideoLabels = { playVideo: string; videoSoon: string };

export type VideoItem = {
  id: string;
  title: string;
  category: string;
  duration: string;
  /** CMS videos carry their own source + thumbnail; built-in ones are looked up in `videoSources`. */
  youtubeId?: string;
  src?: string;
  poster?: string;
};

/** Vertical (9:16) video card for shorts / reels. */
export function VideoCard({ video, labels }: { video: VideoItem; labels: VideoLabels }) {
  const builtIn = videoSources[video.id] ?? { youtubeId: '', src: '', tone: 'cyan' as const };
  const youtubeId = video.youtubeId || builtIn.youtubeId;
  const src = video.src || builtIn.src;

  return (
    <article className="card card-hover group overflow-hidden p-2">
      <VideoPlayer
        aspect="vertical"
        title={video.title}
        youtubeId={youtubeId}
        src={src}
        poster={video.poster}
        playLabel={labels.playVideo}
        soonLabel={labels.videoSoon}
        className="rounded-[1.25rem]"
      >
        {video.poster ? (
          <Image src={video.poster} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 560px) 50vw, 100vw" className="object-cover" />
        ) : (
          <OpticArt fill tone={builtIn.tone} focal="center" />
        )}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-secondary-950/90 via-secondary-950/35 to-transparent" />
        <span className="glass-dark absolute start-3 top-3 rounded-full px-3 py-1 text-[0.7rem] font-bold text-white">{video.category}</span>
        <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-[0.7rem] font-bold tabular-nums text-white backdrop-blur">
          <Clock aria-hidden className="size-3" />
          <span dir="ltr">{video.duration}</span>
        </span>
        <h3 className="absolute inset-x-0 bottom-0 p-4 font-heading text-base font-bold leading-snug text-white sm:p-5 sm:text-lg">{video.title}</h3>
      </VideoPlayer>
    </article>
  );
}

type FeatureVideoProps = {
  title: string;
  label: string;
  youtubeId?: string;
  src?: string;
  /** Uploaded thumbnail — replaces the branded doctor poster. */
  poster?: string;
  portraitAlt: string;
  labels: VideoLabels;
  aspect?: 'landscape' | 'cinema';
  className?: string;
};

/** Landscape (16:9 / cinematic 21:9) feature video with a branded poster featuring the doctor. */
export function FeatureVideo({ title, label, youtubeId, src, poster, portraitAlt, labels, aspect = 'landscape', className }: FeatureVideoProps) {
  return (
    <div className={className}>
      <div className="card group overflow-hidden p-2 shadow-elevated">
        <VideoPlayer
          aspect={aspect}
          title={title}
          youtubeId={youtubeId}
          src={src}
          poster={poster}
          playLabel={labels.playVideo}
          soonLabel={labels.videoSoon}
          className="rounded-[1.5rem]"
        >
          {poster ? (
            <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
          ) : (
            <>
              <OpticArt fill tone="navy" />
              <div className="absolute bottom-0 aspect-[4/5] h-[96%] ltr:right-[4%] rtl:left-[4%]">
                <Image
                  src={siteConfig.doctorPortrait}
                  alt={portraitAlt}
                  fill
                  sizes="(min-width: 1024px) 320px, 45vw"
                  className="object-contain object-bottom opacity-95 transition-transform duration-700 ease-optical group-hover:scale-[1.03]"
                />
              </div>
            </>
          )}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-secondary-950/80 via-secondary-950/10 to-transparent" />
          <span className="glass-dark absolute start-4 top-4 rounded-full px-3.5 py-1.5 font-heading text-xs font-bold text-white sm:start-5 sm:top-5">
            {label}
          </span>
          <p className="absolute bottom-0 start-0 max-w-[62%] p-5 font-heading text-base font-bold leading-snug text-white sm:p-7 sm:text-xl">{title}</p>
        </VideoPlayer>
      </div>
    </div>
  );
}
