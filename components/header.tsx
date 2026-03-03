import { MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center gap-3 border-b border-white/[0.06] bg-neutral-950/80 px-5 py-3.5 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
        <MapPin className="h-4.5 w-4.5 text-white" />
      </div>
      <div>
        <h1 className="text-base font-bold tracking-tight text-white">Map AI</h1>
        <p className="text-[11px] text-neutral-500">Location Combo Finder</p>
      </div>
    </header>
  );
}
