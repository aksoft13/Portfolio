"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
  videoUrl: string | null;
  videoType: string | null;
  videoFile: string | null;
}

export default function VideoPlayer({
  videoUrl,
  videoType,
  videoFile,
}: VideoPlayerProps) {
  const source =
    videoType === "upload" && videoFile ? videoFile : videoUrl || undefined;

  if (!source) return null;

  return (
    <div className="video-wrapper">
      <ReactPlayer src={source} controls width="100%" height="100%" />
    </div>
  );
}
