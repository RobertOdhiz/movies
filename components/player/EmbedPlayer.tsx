"use client";

interface EmbedPlayerProps {
  src: string;
  title?: string;
  className?: string;
}

export function EmbedPlayer({ src, title, className }: EmbedPlayerProps) {
  return (
    <div className={className}>
      <iframe
        src={src}
        title={title ?? "Video Player"}
        className="h-full w-full border-0"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
