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
  // Google Drive: extract file ID and use preview embed
  if (videoType === "google" && videoUrl) {
    const match = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = match ? match[1] : null;
    if (!fileId) return null;
    return (
      <div className="video-wrapper">
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          width="100%"
          height="100%"
          allow="autoplay"
          allowFullScreen
          style={{ border: "none" }}
        />
      </div>
    );
  }

  const source =
    videoType === "upload" && videoFile ? videoFile : videoUrl || undefined;

  if (!source) return null;

  return (
    <div className="video-wrapper">
      <ReactPlayer src={source} controls width="100%" height="100%" />
    </div>
  );
}
