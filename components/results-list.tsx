"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2, Route } from "lucide-react";
import type { LocationCombo } from "@/lib/types";

interface ResultsListProps {
  results: LocationCombo[];
  selectedCombo: LocationCombo | null;
  isLoading: boolean;
  onSelectCombo: (combo: LocationCombo) => void;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(2)} km`;
}

export default function ResultsList({ results, selectedCombo, isLoading, onSelectCombo }: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <p className="text-sm text-neutral-400">Searching for combos...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
          <MapPin className="h-7 w-7 text-neutral-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-400">No results yet</p>
          <p className="mt-0.5 text-xs text-neutral-500">Select categories and search to find combos</p>
        </div>
      </div>
    );
  }

  const sorted = [...results].sort((a, b) => a.distance - b.distance);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-300">Results</span>
        <Badge variant="secondary" className="bg-indigo-500/15 text-indigo-300">
          {results.length} combos
        </Badge>
      </div>
      <ScrollArea className="h-[calc(100vh-580px)] min-h-[200px] lg:h-[calc(100vh-600px)]">
        <div className="flex flex-col gap-1.5 pr-3">
          {sorted.map((combo, index) => {
            const isSelected =
              selectedCombo?.locationA.id === combo.locationA.id &&
              selectedCombo?.locationB.id === combo.locationB.id;

            return (
              <button
                key={`${combo.locationA.id}-${combo.locationB.id}`}
                type="button"
                onClick={() => onSelectCombo(combo)}
                className={`group flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${
                  isSelected
                    ? "border-indigo-500/40 bg-indigo-500/10"
                    : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]"
                }`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-bold text-neutral-400 group-hover:text-neutral-300">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="truncate font-medium text-indigo-300">{combo.locationA.name}</span>
                    <span className="shrink-0 text-neutral-600">+</span>
                    <span className="truncate font-medium text-rose-300">{combo.locationB.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-500">
                    <Route className="h-3 w-3" />
                    {formatDistance(combo.distance)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
