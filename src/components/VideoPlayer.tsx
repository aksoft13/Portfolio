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
  layout?: string;
}

function SingleVideo({ type, url, portrait }: { type: string; url: string; portrait?: boolean }) {
  const wrapperClass = `video-wrapper${portrait ? " video-portrait" : ""}`;

  if (type === "google") {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = match ? match[1] : null;
    if (!fileId) return null;
    return (
      <div className={wrapperClass}>
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
    <div className={wrapperClass}>
      <ReactPlayer src={url} controls width="100%" height="100%" />
    </div>
  );
}

export default function VideoPlayer({
  videoUrl,
  videoType,
  videoFile,
  videos,
  layout = "stack",
}: VideoPlayerProps) {
  const videoList: VideoItem[] = videos && videos.length > 0
    ? videos
    : videoUrl || videoFile
      ? [{ type: videoType || "youtube", url: (videoType === "upload" && videoFile ? videoFile : videoUrl) || "" }]
      : [];

  if (videoList.length === 0) return null;

  if (layout === "side" && videoList.length >= 2) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {videoList.map((video, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            <SingleVideo type={video.type} url={video.url} portrait />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videoList.map((video, i) => (
        <SingleVideo key={i} type={video.type} url={video.url} />
      ))}
    </div>
  );
}
