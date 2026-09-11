import React from "react"
import { LocationMap } from "../components/ui/expand-map"

export default function ExpandMapDemo() {
  return (
    <main className="min-h-screen flex items-center justify-center w-full bg-[#f0fdf4] p-6">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(52,211,153,0.08)_0%,_transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <p className="text-emerald-800 text-xs font-bold tracking-[0.2em] uppercase">
          Current Location
        </p>

        <LocationMap location="Lahore, Pakistan" coordinates="31.5497° N, 74.3436° E" />
      </div>
    </main>
  )
}
