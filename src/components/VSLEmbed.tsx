"use client";

import { Play } from "lucide-react";

interface VSLEmbedProps {
  src?: string;
}

export function VSLEmbed({ src }: VSLEmbedProps) {
  if (src) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border shadow-xl">
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-white flex items-center justify-center group cursor-pointer shadow-xl">
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="absolute inset-0 dot-pattern opacity-50" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center group-hover:bg-navy/15 transition-colors">
          <Play className="h-6 w-6 text-navy ml-0.5" />
        </div>
        <p className="text-text-secondary text-sm font-medium">
          VSL loads here — paste HeyGen URL
        </p>
      </div>
    </div>
  );
}
