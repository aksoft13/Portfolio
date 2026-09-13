"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

/* Drive 미리보기 플레이어는 iframe이 좁으면 영상을 잘라서 렌더링한다.
   (900px 정상 / 720px 이하 크롭) 항상 900px로 그린 뒤 컨테이너 폭에 맞춰 축소한다. */
const DRIVE_MIN_WIDTH = 900;

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

function GoogleDriveEmbed({
  fileId,
  wrapperClass,
  ratio,
}: {
  fileId: string;
  wrapperClass: string;
  ratio: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; scale: number } | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      const cw = el.clientWidth;
      if (!cw) return;
      const w = Math.max(DRIVE_MIN_WIDTH, cw);
      setBox({ w, scale: cw / w });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className={`${wrapperClass} drive-embed`}>
      {box && (
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          allow="autoplay"
          allowFullScreen
          style={
            {
              "--embed-w": `${box.w}px`,
              "--embed-h": `${box.w * ratio}px`,
              "--embed-scale": box.scale,
            } as CSSProperties
          }
        />
      )}
    </div>
  );
}

function SingleVideo({ type, url, portrait }: { type: string; url: string; portrait?: boolean }) {
  const wrapperClass = `video-wrapper${portrait ? " video-portrait" : ""}`;

  if (type === "google") {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = match ? match[1] : null;
    if (!fileId) return null;
    return (
      <GoogleDriveEmbed
        fileId={fileId}
        wrapperClass={wrapperClass}
        ratio={portrait ? 16 / 9 : 9 / 16}
      />
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
