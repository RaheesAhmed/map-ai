"use client";

import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationCombo } from "@/lib/types";

interface MapViewProps {
  center: [number, number];
  results: LocationCombo[];
  selectedCombo: LocationCombo | null;
}

function createSvgIcon(label: string, bgColor: string, borderColor: string): L.DivIcon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <path fill="${bgColor}" stroke="${borderColor}" stroke-width="1.5"
        d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z"/>
      <circle fill="white" cx="16" cy="16" r="6.5"/>
      <text x="16" y="20" text-anchor="middle" fill="${bgColor}" font-size="10" font-weight="700" font-family="sans-serif">${label}</text>
    </svg>`;

  return L.divIcon({
    html: `<div style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5));">${svg}</div>`,
    className: "custom-marker",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
}

const ICONS = {
  A: createSvgIcon("A", "#6366f1", "#4f46e5"),
  B: createSvgIcon("B", "#f43f5e", "#e11d48"),
  selected: createSvgIcon("✓", "#10b981", "#059669"),
};

export default function MapView({ center, results, selectedCombo }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const locations = useMemo(() => {
    const map = new Map<string, { lat: number; lon: number; name: string; category: "A" | "B" }>();
    for (const combo of results) {
      const keyA = `a-${combo.locationA.id}`;
      if (!map.has(keyA)) {
        map.set(keyA, { lat: combo.locationA.lat, lon: combo.locationA.lon, name: combo.locationA.name, category: "A" });
      }
      const keyB = `b-${combo.locationB.id}`;
      if (!map.has(keyB)) {
        map.set(keyB, { lat: combo.locationB.lat, lon: combo.locationB.lon, name: combo.locationB.name, category: "B" });
      }
    }
    return map;
  }, [results]);

  // Initialize map only once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com">CARTO</a>',
      maxZoom: 20,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Invalidate map size whenever results change so Leaflet re-calculates its canvas
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Small timeout to allow the DOM to settle before Leaflet measures
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [results]);

  // Fly to center or fit bounds when selection/center changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedCombo) {
      const bounds = L.latLngBounds(
        [selectedCombo.locationA.lat, selectedCombo.locationA.lon],
        [selectedCombo.locationB.lat, selectedCombo.locationB.lon],
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    } else {
      map.flyTo(center, 14, { duration: 1 });
    }
  }, [center, selectedCombo]);

  // Update markers when locations or selected combo changes
  useEffect(() => {
    const group = markersRef.current;
    if (!group) return;
    group.clearLayers();

    for (const [, loc] of locations) {
      const isSelected =
        selectedCombo &&
        ((selectedCombo.locationA.lat === loc.lat && selectedCombo.locationA.lon === loc.lon) ||
          (selectedCombo.locationB.lat === loc.lat && selectedCombo.locationB.lon === loc.lon));

      const icon = isSelected ? ICONS.selected : ICONS[loc.category];
      const marker = L.marker([loc.lat, loc.lon], { icon });
      marker.bindPopup(
        `<div style="font-family:sans-serif;padding:4px 0"><strong style="font-size:14px">${loc.name}</strong><br/><span style="color:#94a3b8;font-size:12px">Category ${loc.category}</span></div>`,
      );
      group.addLayer(marker);
    }
  }, [locations, selectedCombo]);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0 }}
    />
  );
}
