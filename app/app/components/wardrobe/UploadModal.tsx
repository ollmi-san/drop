"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Camera, Sparkles, Check, Loader2, Clock, Store, Globe, Home } from "lucide-react";
import { useWardrobe, categoryToBadge, type Category, type ItemSource } from "../../store/useWardrobe";
import { suggestNameForImage } from "../../lib/aiNaming";
import { playDropSound } from "../../lib/soundFx";
import { extractDominantColor } from "../../lib/extractColor";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES: Category[] = ["Oberteile", "Unterteile", "Kleider", "Schuhe", "Jacken", "Accessoires", "Hüte", "Taschen", "Schmuck", "Sportswear"];

const DAY_MS = 24 * 60 * 60 * 1000;
const DURATIONS: { key: string; label: string; ms: number | null }[] = [
  { key: "permanent", label: "Permanent — gehört mir",  ms: null      },
  { key: "1d",        label: "1 Tag testen",            ms: DAY_MS    },
  { key: "7d",        label: "7 Tage testen",           ms: 7 * DAY_MS},
  { key: "30d",       label: "30 Tage testen",          ms: 30 * DAY_MS},
];

const SOURCES: { key: ItemSource; label: string; icon: typeof Home }[] = [
  { key: "owned", label: "Eigenes Teil", icon: Home   },
  { key: "store", label: "Im Laden",     icon: Store  },
  { key: "web",   label: "Im Internet",  icon: Globe  },
];

export default function UploadModal({ open, onClose }: Props) {
  const fileRef   = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [step, setStep]                 = useState<"select" | "naming" | "edit">("select");
  const [name, setName]                 = useState("");
  const [nameEn, setNameEn]             = useState("");
  const [category, setCategory]         = useState<Category>("Oberteile");
  const [confidence, setConfidence]     = useState(0);
  const [aiLoading, setAiLoading]       = useState(false);
  const [duration, setDuration]         = useState<string>("permanent");
  const [source, setSource]             = useState<ItemSource>("owned");
  const [note, setNote]                 = useState("");

  const addItem = useWardrobe((s) => s.addItem);

  useEffect(() => {
    if (open) {
      setImageDataUrl("");
      setStep("select");
      setName("");
      setNameEn("");
      setCategory("Oberteile");
      setConfidence(0);
      setAiLoading(false);
      setDuration("permanent");
      setSource("owned");
      setNote("");
    }
  }, [open]);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setImageDataUrl(dataUrl);
      setStep("naming");
      setAiLoading(true);

      const suggestion = await suggestNameForImage(dataUrl);
      setName(suggestion.name);
      setNameEn(suggestion.nameEn);
      setCategory(suggestion.category);
      setConfidence(suggestion.confidence);
      setAiLoading(false);
      setStep("edit");
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!imageDataUrl || !name.trim()) return;
    const { badge, color } = categoryToBadge(category);
    const dominantColor = await extractDominantColor(imageDataUrl);
    const dur = DURATIONS.find((d) => d.key === duration);
    const expiresAt = dur?.ms ? Date.now() + dur.ms : undefined;

    addItem({
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      category,
      badge,
      badgeColor: color,
      imageUrl: imageDataUrl,
      bgFallback: dominantColor,
      liked: false,
      expiresAt,
      source,
      note: note.trim() || undefined,
    });
    playDropSound();
    onClose();
  }

  if (!open) return null;

  const selectedDur = DURATIONS.find((d) => d.key === duration);
  const isWishlist  = duration !== "permanent";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: "#E8E2DA" }}>
          <h3 className="text-base font-bold" style={{ color: "#111" }}>
            {step === "select" && "Neues Teil hinzufügen"}
            {step === "naming" && "KI analysiert..."}
            {step === "edit"   && "Details bestätigen"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <X size={18} color="#6B7280" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {step === "select" && (
            <div className="flex flex-col gap-3">
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Lade ein Foto deiner Kleidung hoch — vom eigenen Schrank, fotografiert im Laden, oder aus dem Web.
              </p>

              <button onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 py-8 rounded-xl border-2 border-dashed transition-all hover:border-purple-400 hover:bg-purple-50"
                style={{ borderColor: "#D1D5DB" }}>
                <Upload size={28} color="#7B2FBE" />
                <span className="font-semibold text-sm" style={{ color: "#111" }}>Foto hochladen</span>
                <span className="text-xs" style={{ color: "#9CA3AF" }}>JPG, PNG, WEBP</span>
              </button>

              <button onClick={() => cameraRef.current?.click()}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border transition-all hover:bg-gray-50"
                style={{ borderColor: "#E8E2DA", color: "#111" }}>
                <Camera size={16} />
                <span className="font-medium text-sm">Foto aufnehmen (z.B. im Laden)</span>
              </button>

              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          )}

          {(step === "naming" || step === "edit") && (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-xl overflow-hidden mx-auto" style={{ width: 180, height: 180, background: "#F5EFE8" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageDataUrl} alt="Vorschau" className="w-full h-full object-cover" />
                {aiLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <Loader2 size={28} color="white" className="animate-spin" />
                    <span className="text-xs text-white font-medium">KI analysiert...</span>
                  </div>
                )}
              </div>

              {step === "edit" && (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#F0EBF8" }}>
                    <Sparkles size={14} color="#7B2FBE" />
                    <span className="text-xs" style={{ color: "#7B2FBE" }}>
                      KI-Vorschlag — {Math.round(confidence * 100)}% Konfidenz
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: "#6B7280" }}>Name (DE)</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none text-sm" style={{ borderColor: "#E8E2DA" }} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: "#6B7280" }}>Name (EN)</label>
                    <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none text-sm" style={{ borderColor: "#E8E2DA" }} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: "#6B7280" }}>Kategorie</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {CATEGORIES.map((c) => (
                        <button key={c} onClick={() => setCategory(c)}
                          className="px-2 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: category === c ? "#111" : "#F3F4F6",
                            color:      category === c ? "white" : "#6B7280",
                          }}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Source */}
                  <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: "#6B7280" }}>Woher?</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SOURCES.map((s) => {
                        const Icon = s.icon;
                        return (
                          <button key={s.key} onClick={() => setSource(s.key)}
                            className="flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all"
                            style={{
                              background: source === s.key ? "#7B2FBE" : "#F3F4F6",
                              color:      source === s.key ? "white" : "#6B7280",
                            }}>
                            <Icon size={14} />
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration / Wishlist */}
                  <div>
                    <label className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: "#6B7280" }}>
                      <Clock size={12} /> Wie lange im Schrank?
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DURATIONS.map((d) => (
                        <button key={d.key} onClick={() => setDuration(d.key)}
                          className="px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
                          style={{
                            background: duration === d.key ? "#FEF3C7" : "#F3F4F6",
                            color:      duration === d.key ? "#92400E" : "#6B7280",
                            border:     `1px solid ${duration === d.key ? "#FCD34D" : "transparent"}`,
                          }}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                    {isWishlist && (
                      <div className="mt-2 p-2.5 rounded-lg text-xs" style={{ background: "#FEF3C7", color: "#92400E" }}>
                        ⏳ <strong>Probier-Modus.</strong> Du hast {selectedDur?.label.match(/\d+ Tag/)?.[0]} Zeit zu entscheiden ob du es kaufen willst. Danach verschwindet es automatisch.
                      </div>
                    )}
                  </div>

                  {/* Optional note (store name, URL etc.) */}
                  {(source === "store" || source === "web") && (
                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: "#6B7280" }}>
                        {source === "store" ? "Laden-Name (optional)" : "Link / Shop (optional)"}
                      </label>
                      <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                        placeholder={source === "store" ? "z.B. Zara Alexanderplatz" : "z.B. zalando.de/..."}
                        className="w-full px-3 py-2 rounded-lg border focus:outline-none text-sm" style={{ borderColor: "#E8E2DA" }} />
                    </div>
                  )}

                  <button onClick={handleSave} disabled={!name.trim()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                    style={{ background: "#7B2FBE", color: "white" }}>
                    <Check size={16} />
                    {isWishlist ? "Probier-Modus starten" : "In Schrank legen"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
