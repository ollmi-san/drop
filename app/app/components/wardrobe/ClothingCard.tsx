"use client";

import { Heart, Clock, Store, Globe } from "lucide-react";
import { useWardrobe, type WardrobeItem } from "../../store/useWardrobe";
import { playClickSound } from "../../lib/soundFx";

interface Props {
  item: WardrobeItem;
}

function formatRemaining(expiresAt: number): { text: string; urgent: boolean } {
  const ms = expiresAt - Date.now();
  if (ms <= 0) return { text: "abgelaufen", urgent: true };
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  if (days >= 1) return { text: `${days}d`, urgent: days <= 1 };
  if (hours >= 1) return { text: `${hours}h`, urgent: true };
  return { text: "<1h", urgent: true };
}

export default function ClothingCard({ item }: Props) {
  const toggleLike  = useWardrobe((s) => s.toggleLike);
  const setDragging = useWardrobe((s) => s.setDragging);
  const equipItem   = useWardrobe((s) => s.equipItem);

  const remaining = item.expiresAt ? formatRemaining(item.expiresAt) : null;
  const isWishlist = !!remaining;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "copy";
        setDragging(item.id);
      }}
      onDragEnd={() => setDragging(null)}
      onDoubleClick={() => {
        equipItem(item.id);
        playClickSound();
      }}
      className="relative rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing group hover:shadow-md"
      style={{
        borderColor: isWishlist
          ? (remaining!.urgent ? "#F59E0B" : "#FCD34D")
          : "#EFE9E0",
        background: "white",
        aspectRatio: "1",
      }}
      title={`${item.name} / ${item.nameEn}${isWishlist ? ` — Probier-Modus, noch ${remaining!.text}` : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
        style={{ background: "white", opacity: isWishlist ? 0.95 : 1 }}
      />

      {/* Category badge top-left */}
      <div
        className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-white shadow-sm pointer-events-none"
        style={{ background: item.badgeColor, fontSize: 9, fontWeight: 600 }}
      >
        {item.badge}
      </div>

      {/* Wishlist countdown — top center if temp */}
      {isWishlist && (
        <div
          className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded text-white shadow-sm pointer-events-none"
          style={{
            background: remaining!.urgent ? "#DC2626" : "#F59E0B",
            fontSize: 9,
            fontWeight: 700,
          }}
        >
          <Clock size={9} />
          {remaining!.text}
        </div>
      )}

      {/* Source icon — bottom-left */}
      {item.source && item.source !== "owned" && (
        <div
          className="absolute bottom-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm pointer-events-none"
          style={{ background: "white" }}
          title={item.source === "store" ? "Im Laden fotografiert" : "Aus dem Internet"}
        >
          {item.source === "store" && <Store size={10} color="#92400E" />}
          {item.source === "web"   && <Globe size={10} color="#2563EB" />}
        </div>
      )}

      {/* Heart top-right */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: item.liked ? "#fff" : "transparent" }}
      >
        <Heart
          size={13}
          fill={item.liked ? "#EF4444" : "none"}
          color={item.liked ? "#EF4444" : "#B8AFA0"}
          strokeWidth={item.liked ? 0 : 2}
        />
      </button>
    </div>
  );
}
