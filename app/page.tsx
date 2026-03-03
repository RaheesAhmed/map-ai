"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import SearchPanel from "@/components/search-panel";
import ResultsList from "@/components/results-list";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import type { Category, LocationCombo } from "@/lib/types";

const MapView = dynamic(() => import("@/components/map-view"), { ssr: false });

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryA, setCategoryA] = useState("");
  const [categoryB, setCategoryB] = useState("");
  const [radius, setRadius] = useState(1000);
  const [results, setResults] = useState<LocationCombo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<LocationCombo | null>(null);
  const [center, setCenter] = useState<[number, number]>([31.5204, 74.3587]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setError(null);
      },
      () => setError("Could not get your location."),
    );
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      setCategories(json.data);
    } catch {
      console.error("Failed to load categories");
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!categoryA || !categoryB) {
      setError("Please select both categories.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedCombo(null);

    try {
      const res = await fetch("/api/combos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryA,
          categoryB,
          radius,
          centerLat: center[0],
          centerLon: center[1],
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message ?? "Search failed.");
        return;
      }

      setResults(json.data.combos);
    } catch {
      setError("Failed to fetch location combos.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryA, categoryB, radius, center]);

  const handleSelectCombo = useCallback((combo: LocationCombo) => {
    setSelectedCombo(combo);
    const midLat = (combo.locationA.lat + combo.locationB.lat) / 2;
    const midLon = (combo.locationA.lon + combo.locationB.lon) / 2;
    setCenter([midLat, midLon]);
    setSheetOpen(false);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-neutral-950">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar — fixed width, full height, never overlaps the map */}
        <aside className="hidden w-[380px] shrink-0 flex-col border-r border-white/[0.06] bg-neutral-950 lg:flex">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 scrollbar-thin">
            <SearchPanel
              categories={categories}
              categoryA={categoryA}
              categoryB={categoryB}
              radius={radius}
              isLoading={isLoading}
              error={error}
              onCategoryAChange={setCategoryA}
              onCategoryBChange={setCategoryB}
              onRadiusChange={setRadius}
              onSearch={handleSearch}
              onLoadCategories={loadCategories}
              onGetLocation={handleGetLocation}
            />
            <Separator className="my-5 bg-white/[0.06]" />
            <ResultsList
              results={results}
              selectedCombo={selectedCombo}
              isLoading={isLoading}
              onSelectCombo={handleSelectCombo}
            />
          </div>
        </aside>

        {/* Map — takes all remaining space, map canvas absolutely fills this section */}
        <section className="relative min-w-0 flex-1 overflow-hidden">
          <MapView center={center} results={results} selectedCombo={selectedCombo} />

          {/* Mobile Sheet Trigger */}
          <div className="absolute bottom-6 left-1/2 z-[9999] -translate-x-1/2 lg:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="rounded-full bg-indigo-600 px-6 shadow-2xl shadow-indigo-500/30 hover:bg-indigo-500"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Combos
                  {results.length > 0 && (
                    <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                      {results.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-white/[0.06] bg-neutral-950 p-0">
                <SheetTitle className="sr-only">Search Panel</SheetTitle>
                <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/[0.15]" />
                <ScrollArea className="h-full">
                  <div className="p-5">
                    <SearchPanel
                      categories={categories}
                      categoryA={categoryA}
                      categoryB={categoryB}
                      radius={radius}
                      isLoading={isLoading}
                      error={error}
                      onCategoryAChange={setCategoryA}
                      onCategoryBChange={setCategoryB}
                      onRadiusChange={setRadius}
                      onSearch={handleSearch}
                      onLoadCategories={loadCategories}
                      onGetLocation={handleGetLocation}
                    />
                    <Separator className="my-5 bg-white/[0.06]" />
                    <ResultsList
                      results={results}
                      selectedCombo={selectedCombo}
                      isLoading={isLoading}
                      onSelectCombo={handleSelectCombo}
                    />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </section>
      </main>
    </div>
  );
}
