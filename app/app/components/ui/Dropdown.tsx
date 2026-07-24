"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  emoji?: string;
}

interface Props<T extends string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (v: T) => void;
  trigger: (label: string, emoji?: string) => ReactNode;
  align?: "left" | "right";
  width?: number;
}

export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
  trigger,
  align = "left",
  width = 200,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative" style={{ display: "inline-block" }}>
      <button onClick={() => setOpen(!open)} className="block">
        {trigger(selected?.label ?? "", selected?.emoji)}
      </button>
      {open && (
        <div
          className="absolute mt-2 rounded-xl shadow-xl overflow-hidden z-50"
          style={{
            background: "white",
            border: "1px solid #E8E2DA",
            minWidth: width,
            [align]: 0,
          }}
        >
          <div className="max-h-72 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-purple-50"
                style={{ color: "#111", textAlign: "left" }}
              >
                {opt.emoji && <span style={{ fontSize: 16 }}>{opt.emoji}</span>}
                <span className="flex-1">{opt.label}</span>
                {opt.value === value && <Check size={14} color="#7B2FBE" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
