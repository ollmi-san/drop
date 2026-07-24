"use client";

import { useEffect, useRef, useState } from "react";

// spriteIdx:  0 = Front | 1 = Left-Side | 2 = Right-Side | 3 = Back
// Rotation order in AvatarStage: [0, 2, 3, 1]

interface Props {
  spriteIdx: 0 | 1 | 2 | 3;
  gender: "female" | "male";
  fading: boolean;
  onSwipe: (dir: 1 | -1) => void;
}

const VIEW_FILES = {
  female: [
    "/avatars/frau_front.png",
    "/avatars/frau_side_l.png",
    "/avatars/frau_side_r.png",
    "/avatars/frau_back.png",
  ],
  male: [
    "/avatars/mann_front.png",
    "/avatars/mann_side_l.png",
    "/avatars/mann_side_r.png",
    "/avatars/mann_back.png",
  ],
} as const;

// Remove near-pure-black background.
// Threshold 12: only removes pixels where R<12 AND G<12 AND B<12.
// This preserves dark clothing (charcoal ~30-60) while removing the bg (0-8).
function removeBlackBg(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] < 12 && d[i + 1] < 12 && d[i + 2] < 12) {
      d[i + 3] = 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/webp", 0.95);
}

export default function AvatarSprite({ spriteIdx, gender, fading, onSwipe }: Props) {
  const [views, setViews]     = useState<(string | null)[]>([null, null, null, null]);
  const [loading, setLoading] = useState(true);
  const dragStartX = useRef<number | null>(null);
  const didSwipe   = useRef(false);

  useEffect(() => {
    setLoading(true);
    setViews([null, null, null, null]);

    const files = VIEW_FILES[gender];
    const results: (string | null)[] = [null, null, null, null];
    let done = 0;

    files.forEach((src, idx) => {
      const img = new window.Image();
      img.onload = () => {
        results[idx] = removeBlackBg(img);
        done++;
        if (done === files.length) { setViews([...results]); setLoading(false); }
      };
      img.onerror = () => {
        done++;
        if (done === files.length) { setViews([...results]); setLoading(false); }
      };
      img.src = src;
    });
  }, [gender]);

  function handlePointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    didSwipe.current   = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (!didSwipe.current && Math.abs(delta) > 50) {
      didSwipe.current   = true;
      dragStartX.current = null;
      onSwipe(delta > 0 ? 1 : -1);
    }
  }
  function handlePointerUp() { dragStartX.current = null; }

  const currentSrc = views[spriteIdx];

  return (
    <div
      className="w-full h-full flex items-end justify-center"
      style={{ cursor: "ew-resize", userSelect: "none", paddingBottom: "2%" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {loading && <AvatarPlaceholder />}

      {!loading && currentSrc && (
        <img
          key={`${gender}-${spriteIdx}`}
          src={currentSrc}
          alt="Avatar"
          draggable={false}
          style={{
            height:        "100%",
            width:         "auto",
            maxWidth:      "100%",
            objectFit:     "contain",
            objectPosition: "bottom center",
            opacity:       fading ? 0 : 1,
            transition:    "opacity 0.3s ease",
            pointerEvents: "none",
            display:       "block",
          }}
        />
      )}

      {!loading && !currentSrc && <AvatarPlaceholder missing />}
    </div>
  );
}

function AvatarPlaceholder({ missing }: { missing?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 pb-8">
      <svg width="140" height="280" viewBox="0 0 160 310" fill="none" opacity={0.22}>
        <ellipse cx="80" cy="34" rx="26" ry="30" fill="#9c8060" />
        <rect x="70" y="61" width="20" height="22" rx="8" fill="#9c8060" />
        <path d="M44 83 Q62 79 80 82 Q98 79 116 83 L112 168 Q80 176 48 168 Z" fill="#9c8060" />
        <rect x="22" y="83" width="22" height="76" rx="11" fill="#9c8060" />
        <rect x="116" y="83" width="22" height="76" rx="11" fill="#9c8060" />
        <rect x="44" y="166" width="72" height="28" rx="14" fill="#9c8060" />
        <rect x="44" y="188" width="32" height="98" rx="15" fill="#9c8060" />
        <rect x="84" y="188" width="32" height="98" rx="15" fill="#9c8060" />
        <ellipse cx="60" cy="294" rx="24" ry="12" fill="#9c8060" />
        <ellipse cx="100" cy="294" rx="24" ry="12" fill="#9c8060" />
      </svg>
      <p className="text-xs text-center" style={{ color: "#9C8060", maxWidth: 160 }}>
        {missing ? "Avatar-Bild nicht gefunden" : "Wird geladen…"}
      </p>
    </div>
  );
}
