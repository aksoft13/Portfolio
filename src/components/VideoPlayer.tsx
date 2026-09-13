"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoItem {
  type: string;
  url: string;
}

interface VideoPlayerProps {
  videoUrl?: string | null;
  videoType?: string | null;
  videoFile?: string | null;
  videos?: VideoItem[];
}

function SingleVideo({ type, url }: { type: string; url: string }) {
  if (type === "google") {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
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

  return (
    <div className="video-wrapper">
      <ReactPlayer src={url} controls width="100%" height="100%" />
    </div>
  );
}

export default function VideoPlayer({
  videoUrl,
  videoType,
  videoFile,
  videos,
}: VideoPlayerProps) {
  // Use videos array if available
  const videoList: VideoItem[] = videos && videos.length > 0
    ? videos
    : videoUrl || videoFile
      ? [{ type: videoType || "youtube", url: (videoType === "upload" && videoFile ? videoFile : videoUrl) || "" }]
      : [];

  if (videoList.length === 0) return null;

  return (
    <div className="space-y-4">
      {videoList.map((video, i) => (
        <SingleVideo key={i} type={video.type} url={video.url} />
      ))}
    </div>
  );
}
