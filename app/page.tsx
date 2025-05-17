'use client';

import { useState } from 'react';

// Manuelle Marker-Positionen (aus dem Bild abgelesen, grob geschätzt)
const CONTAINER_MARKERS = [
  { x: 180, y: 90 },   // oben links
  { x: 320, y: 80 },  // oben Mitte
  { x: 470, y: 90 },  // oben rechts
  { x: 120, y: 200 }, // links oben
  { x: 250, y: 200 }, // Mitte links
  { x: 370, y: 200 }, // Mitte
  { x: 520, y: 200 }, // Mitte rechts
  { x: 150, y: 320 }, // links unten
  { x: 270, y: 320 }, // unten links
  { x: 400, y: 320 }, // unten Mitte
  { x: 540, y: 320 }, // unten rechts
  { x: 600, y: 180 }, // rechts oben
  { x: 650, y: 260 }, // rechts unten
];

function getRandomSelection(arr: any[], percent: number) {
  const count = Math.max(1, Math.round(arr.length * percent));
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Home() {
  const [showRoute, setShowRoute] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  // Bei Klick: 60% zufällig auswählen
  function handleShowRoute() {
    const sel = getRandomSelection(CONTAINER_MARKERS.map((_, i) => i), 0.6);
    setSelected(sel);
    setShowRoute(true);
  }

  // Route als Polyline durch die ausgewählten Marker
  const routePoints = selected.map(idx => `${CONTAINER_MARKERS[idx].x},${CONTAINER_MARKERS[idx].y}`).join(' ');

  return (
    <main className="p-5">
      <div className="flex gap-5 max-w-7xl mx-auto">
        <div className="flex-[2] relative" style={{ width: 1449, height: 655 }}>
          <img 
            src="/karte-markiert.png" // Lege das Bild in public/ ab!
            alt="Karlsruhe Map" 
            className="w-full h-full object-cover"
            style={{ width: 1449, height: 655 }}
          />
          <svg 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            width={1449} height={655}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Alle Marker */}
            {CONTAINER_MARKERS.map((m, i) => (
              <circle key={i} cx={m.x} cy={m.y} r={18} fill="#2563eb" stroke="#1e293b" strokeWidth={3} opacity={0.8} />
            ))}
            {/* Extra-Markierung für die ausgewählten (über 80% gefüllt) */}
            {selected.map(idx => (
              <circle key={idx} cx={CONTAINER_MARKERS[idx].x} cy={CONTAINER_MARKERS[idx].y} r={26} fill="none" stroke="#ef4444" strokeWidth={6} />
            ))}
            {/* Route */}
            {showRoute && selected.length > 1 && (
              <polyline 
                points={routePoints}
                fill="none" 
                stroke="#ef4444" 
                strokeWidth={8} 
                strokeDasharray="24,12"
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  from="0" 
                  to="100" 
                  dur="2s" 
                  repeatCount="indefinite"
                />
              </polyline>
            )}
          </svg>
        </div>
        <div className="flex-1 p-5 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Glascontainer Route</h2>
          <button 
            onClick={handleShowRoute}
            className="w-full py-4 px-6 mb-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Route anzeigen
          </button>
          <button 
            onClick={() => setShowRoute(false)}
            className="w-full py-4 px-6 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Route ausblenden
          </button>
          <div className="mt-8 text-lg text-gray-700">
            {showRoute && (
              <span>{selected.length} Container werden angefahren (über 80% gefüllt)</span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
