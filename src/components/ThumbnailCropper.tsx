"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ThumbnailCropperProps {
  src: string;
  objectPosition: string; // e.g. "50% 50%"
  onChange: (position: string) => void;
}

export default function ThumbnailCropper({ src, objectPosition, onChange }: ThumbnailCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState(() => {
    const parts = objectPosition.split(" ");
    return { x: parseFloat(parts[0]) || 50, y: parseFloat(parts[1]) || 50 };
  });

  useEffect(() => {
    const parts = objectPosition.split(" ");
    setPos({ x: parseFloat(parts[0]) || 50, y: parseFloat(parts[1]) || 50 });
  }, [objectPosition]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setPos({ x, y });
    onChange(`${Math.round(x)}% ${Math.round(y)}%`);
  }, [onChange]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    handleMove(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, handleMove]);

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  useEffect(() => {
    if (!dragging) return;
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => setDragging(false);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, handleMove]);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">이미지를 클릭/드래그하여 포커스 위치를 조절하세요</p>

      {/* Preview: how it looks in the grid */}
      <div className="flex gap-4">
        {/* Source image with crosshair */}
        <div className="flex-1">
          <p className="text-xs text-[#555] mb-1.5">원본 (클릭하여 조절)</p>
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border cursor-crosshair select-none"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-contain bg-black/50"
              draggable={false}
            />
            {/* Crosshair */}
            <div
              className="absolute w-5 h-5 border-2 border-white rounded-full shadow-lg pointer-events-none"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <div className="absolute inset-[3px] bg-white rounded-full" />
            </div>
            {/* Crosshair lines */}
            <div className="absolute inset-0 pointer-events-none" style={{ opacity: dragging ? 0.4 : 0 }}>
              <div className="absolute bg-white/60" style={{ left: `${pos.x}%`, top: 0, width: "1px", height: "100%" }} />
              <div className="absolute bg-white/60" style={{ top: `${pos.y}%`, left: 0, height: "1px", width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Result preview */}
        <div className="w-48 shrink-0">
          <p className="text-xs text-[#555] mb-1.5">미리보기 (16:9)</p>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
              draggable={false}
            />
          </div>
          <p className="text-xs text-[#555] mt-1.5">미리보기 (1:1)</p>
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border mt-1">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span>Position: {Math.round(pos.x)}% {Math.round(pos.y)}%</span>
        <button
          type="button"
          onClick={() => { setPos({ x: 50, y: 50 }); onChange("50% 50%"); }}
          className="px-2 py-1 border border-border rounded hover:bg-border transition-colors"
        >
          중앙으로 리셋
        </button>
      </div>
    </div>
  );
}
