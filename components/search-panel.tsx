"use client";

import { useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Search,
  Loader2,
  Zap,
} from "lucide-react";
import type { Category, PresetCombo } from "@/lib/types";
import { QUICK_PRESETS } from "@/lib/types";

interface SearchPanelProps {
  categories: Category[];
  categoryA: string;
  categoryB: string;
  radius: number;
  isLoading: boolean;
  error: string | null;
  onCategoryAChange: (value: string) => void;
  onCategoryBChange: (value: string) => void;
  onRadiusChange: (value: number) => void;
  onSearch: () => void;
  onLoadCategories: () => void;
  onGetLocation: () => void;
}

export default function SearchPanel({
  categories,
  categoryA,
  categoryB,
  radius,
  isLoading,
  error,
  onCategoryAChange,
  onCategoryBChange,
  onRadiusChange,
  onSearch,
  onLoadCategories,
  onGetLocation,
}: SearchPanelProps) {
  useEffect(() => {
    onLoadCategories();
  }, [onLoadCategories]);

  const handlePresetClick = useCallback(
    (preset: PresetCombo) => {
      onCategoryAChange(preset.categoryA);
      onCategoryBChange(preset.categoryB);
    },
    [onCategoryAChange, onCategoryBChange],
  );

  const formatRadius = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)} km`;
    return `${value} m`;
  };

  return (
    <div className="flex flex-col gap-5">
      <Button
        variant="outline"
        className="w-full justify-start gap-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
        onClick={onGetLocation}
      >
        <MapPin className="h-4 w-4" />
        Use My Location
      </Button>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-neutral-300">Quick Presets</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-left text-xs font-medium text-neutral-300 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-200"
            >
              <span className="mr-1.5">{preset.icon}</span>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-neutral-300">Category Selection</p>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-neutral-400">
            <Badge variant="secondary" className="h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 p-0 text-[10px] text-indigo-400">A</Badge>
            Category A
          </label>
          <Select value={categoryA} onValueChange={onCategoryAChange}>
            <SelectTrigger className="border-white/[0.08] bg-white/[0.04] text-neutral-200 focus:ring-indigo-500/40">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent className="border-white/[0.1] bg-neutral-900">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-neutral-200 focus:bg-indigo-500/20 focus:text-indigo-200">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-neutral-400">
            <Badge variant="secondary" className="h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 p-0 text-[10px] text-rose-400">B</Badge>
            Category B
          </label>
          <Select value={categoryB} onValueChange={onCategoryBChange}>
            <SelectTrigger className="border-white/[0.08] bg-white/[0.04] text-neutral-200 focus:ring-indigo-500/40">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent className="border-white/[0.1] bg-neutral-900">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-neutral-200 focus:bg-indigo-500/20 focus:text-indigo-200">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-300">Search Radius</span>
          <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs font-semibold text-indigo-300">
            {formatRadius(radius)}
          </span>
        </div>
        <Slider
          value={[radius]}
          onValueChange={(val) => onRadiusChange(val[0])}
          min={100}
          max={5000}
          step={100}
          className="[&_[role=slider]]:border-indigo-500 [&_[role=slider]]:bg-indigo-500 [&_[data-orientation=horizontal]>.bg-primary]:bg-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-neutral-500">
          <span>100 m</span>
          <span>5 km</span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300" role="alert">
          {error}
        </div>
      )}

      <Button
        onClick={onSearch}
        disabled={isLoading || !categoryA || !categoryB}
        className="w-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Find Combinations
          </>
        )}
      </Button>
    </div>
  );
}
