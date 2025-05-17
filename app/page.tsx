'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./MapLeaflet'), { ssr: false });

// Manuelle Marker-Positionen (aus dem Bild abgelesen, grob geschätzt)
const CONTAINER_MARKERS = [
  { id: 'KA-001', name: 'Container 1', address: 'Kaiserstraße 1' },
  { id: 'KA-002', name: 'Container 2', address: 'Kaiserstraße 2' },
  { id: 'KA-003', name: 'Container 3', address: 'Kaiserstraße 3' },
  { id: 'KA-004', name: 'Container 4', address: 'Leopoldstraße 1' },
  { id: 'KA-005', name: 'Container 5', address: 'Leopoldstraße 2' },
  { id: 'KA-006', name: 'Container 6', address: 'Leopoldstraße 3' },
  { id: 'KA-007', name: 'Container 7', address: 'Kriegsstraße 1' },
  { id: 'KA-008', name: 'Container 8', address: 'Kriegsstraße 2' },
  { id: 'KA-009', name: 'Container 9', address: 'Kriegsstraße 3' },
  { id: 'KA-010', name: 'Container 10', address: 'Hirschstraße 1' },
  { id: 'KA-011', name: 'Container 11', address: 'Hirschstraße 2' },
  { id: 'KA-012', name: 'Container 12', address: 'Durlacher Allee 1' },
  { id: 'KA-013', name: 'Container 13', address: 'Durlacher Allee 2' },
];

function getRandomSelection(arr: any[], percent: number) {
  const count = Math.max(1, Math.round(arr.length * percent));
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function VegaLogixLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vega-yellow" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD600" />
          <stop offset="1" stopColor="#FFD600" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="16" fill="url(#vega-yellow)" />
      <path d="M13 27L20 13L27 27" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const [routeStep, setRouteStep] = useState<'none' | 'main' | 'alt'>('none');
  const [selected, setSelected] = useState<number[]>([]);
  const [searchId, setSearchId] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  function handleRouteClick() {
    const sel = getRandomSelection(CONTAINER_MARKERS.map((_, i) => i), 0.6);
    setSelected(sel);
    setRouteStep(routeStep === 'none' ? 'main' : 'alt');
    setExpanded(true); // Container automatisch ausklappen
  }

  function handleSendRoute() {
    alert('Route wurde an einen Mitarbeiter gesendet!');
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchId.trim()) {
      alert(`Suche nach Container-ID: ${searchId}`);
      setSearchId('');
      searchInputRef.current?.blur();
    }
  }

  // Für die Container-Liste nach Route
  const routedContainers = selected.map(idx => CONTAINER_MARKERS[idx]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Leaflet-Karte als Hintergrund */}
      <div className="fixed inset-0 z-0">
        <Map containerMarkers={CONTAINER_MARKERS} />
      </div>
      {/* Rechter, schwebender Container */}
      <aside
        className={`fixed top-0 right-0 h-full z-10 flex flex-col transition-all duration-300 ${expanded ? 'w-[480px] max-w-full' : 'w-[200px]'} `}
      >
        <div className={`bg-white h-full shadow-2xl rounded-l-3xl border-l border-gray-100 flex flex-col transition-all duration-300 ${expanded ? 'px-10 py-8' : 'px-4 py-4 items-center'}`}
             style={{ minWidth: expanded ? 420 : 120 }}>
          {/* Header im Container */}
          <div className={`flex ${expanded ? 'justify-between' : 'flex-col items-center'} items-center w-full mb-6 gap-2`}>
            <div className="flex items-center gap-2">
              <VegaLogixLogo />
              <span className="text-xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-400 bg-clip-text text-transparent select-none" style={{ color: '#FFD600' }}>VegaLogix</span>
            </div>
            {/* Buttons und Filter nur im eingeklappten Modus sichtbar */}
            {!expanded && (
              <div className="w-full flex flex-col items-center gap-4 mt-4">
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex flex-col items-center gap-2 w-full">


                  </div>
                  {/* Suchfeld für Container-ID */}
                  <form onSubmit={handleSearch} className="flex items-center gap-2 w-full px-0">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Container-ID"
                      value={searchId}
                      onChange={e => setSearchId(e.target.value)}
                      className="w-full px-3 py-2 rounded-l-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700 font-medium shadow-sm transition-all text-xs"
                      style={{ fontSize: '0.85rem' }}
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-r-full bg-yellow-400 text-white font-semibold shadow hover:scale-105 active:scale-95 transition-all border-2 border-white/60 text-xs"
                      style={{ background: '#FFD600', fontSize: '0.85rem' }}
                    >
                      Suchen
                    </button>
                  </form>
                  <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-full border border-gray-200 bg-white text-black text-sm  shadow focus:ring-2 focus:ring-yellow-400">
                    <option value="">Stadtteil</option>
                    <option value="Innenstadt">Innenstadt</option>
                    <option value="Weststadt">Weststadt</option>
                    <option value="Oststadt">Oststadt</option>
                  </select>
                  <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-full border border-gray-200 bg-white text-black text-sm  shadow focus:ring-2 focus:ring-yellow-400">
                    <option value="">Füllstand</option>
                    <option value=">80">über 80%</option>
                    <option value="50-80">50-80%</option>
                    <option value="<50">unter 50%</option>
                  </select>
                  <button
                      onClick={handleRouteClick}
                      className="w-12 h-12 mt-6 flex items-center justify-center rounded-full bg-yellow-400 text-white shadow hover:scale-105 transition-all"
                      style={{ background: '#FFD600' }}
                      title="Route berechnen"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth={2}
                        style={{ transform: expanded ? 'scaleX(-1)' : 'none' }}
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582a2 2 0 011.518.716l2.045 2.577a2 2 0 001.518.716H15a2 2 0 012 2v1m0 0l-2 2m2-2l2 2"
                      />
                    </svg>
                  </button>

                </div>
              </div>
            )}
            {/* Ausklapp-Button */}
            <button onClick={() => setExpanded(e => !e)}
              className={`absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br bg-yellow-400 text-white shadow-lg flex items-center justify-center border-2 border-white/80 hover:scale-110 transition-all z-20`}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {expanded ? <path d="M15 19l-7-7 7-7" /> : <path d="M9 5l7 7-7 7" />}
              </svg>
            </button>
          </div>
          {/* Content im Container */}
          <div className="flex-1 w-full flex flex-col gap-6">
            {/* Im ausgeklappten Modus: Nach Route-Berechnung Liste anzeigen */}
            {expanded && routeStep !== 'none' && (
              <div className="flex flex-col gap-2 w-full h-full relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-semibold text-gray-800">Tourenübersicht:</div>
                  <button
                    onClick={handleRouteClick}
                    className="border border-gray-300 rounded-full px-5 py-2 bg-white text-black text-sm font-sans hover:underline hover:underline-offset-4 transition-all shadow-sm"
                    style={{ outline: 'none' }}
                  >
                    Alternative berechnen
                  </button>
                </div>
                <ul
                  className="flex flex-col gap-3 max-h-[340px] overflow-y-auto p-1 no-scrollbar"
                >
                  {routedContainers.map((container, idx) => (
                    <li
                      key={container.id}
                      className="flex items-center gap-4 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm"
                      style={{ minHeight: '56px' }}
                    >
                      <span className="text-lg font-bold text-gray-300 w-3 text-right mr-8 select-none">{idx + 1}</span>
                      <div className="flex flex-col">
                        <span className="font-sans text-gray-900">{container.name}</span>
                        <span className="text-xs text-gray-300 font-semibold">{container.id}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <style jsx global>{`
                  .no-scrollbar {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                  }
                  .no-scrollbar::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    background: transparent;
                  }
                `}</style>
                {/* Runder gelber Button in der Mitte */}
                <div className="flex flex-col items-center gap-4 mt-8 mb-2">
                  <button
                    onClick={handleSendRoute}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-400 text-white shadow hover:scale-105 transition-all text-2xl"
                    style={{ background: '#FFD600' }}
                    title="Route senden"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </button>
                </div>
                {/* Mitarbeiterplan-Button ganz unten */}
                <div className="absolute left-0 right-0 bottom-16 flex justify-center">
                  <button
                      onClick={() => alert('Mitarbeiterplan erstellen')}
                      className="text-black text-base font-sans flex items-center justify-center gap-2 border border-gray-300 rounded-full px-6 py-2 bg-white hover:underline hover:underline-offset-4 transition-all shadow-sm hover:shadow-md min-w-[220px]"
                      style={{ outline: 'none' }}
                  >
                    Mitarbeiterplan erstellen
                  </button>

                </div>
              </div>
            )}
            {/* Im ausgeklappten Modus: Suchfeld direkt unter Buttons, über Filter */}
            {expanded && routeStep === 'none' && (
              <>
                <div className="flex flex-col gap-2 w-full mb-2">
                  <div className="flex gap-2 w-full">

                  </div>
                  <form onSubmit={handleSearch} className="flex items-center gap-2 w-full mb-4">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Container-ID"
                      value={searchId}
                      onChange={e => setSearchId(e.target.value)}
                      className="w-full px-4 py-2 rounded-l-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700 font-medium shadow-sm transition-all text-base"
                      style={{ fontSize: '1rem' }}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-r-full bg-yellow-400 text-white font-semibold shadow hover:scale-105 active:scale-95 transition-all border-2 border-white/60 text-base"
                      style={{ background: '#FFD600', fontSize: '1rem' }}
                    >
                      Suchen
                    </button>
                  </form>
                </div>
                <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-gray-200 bg-white text-black text-base shadow focus:ring-2 focus:ring-yellow-400">
                  <option value="">Stadtteil</option>
                  <option value="Innenstadt">Innenstadt</option>
                  <option value="Weststadt">Weststadt</option>
                  <option value="Oststadt">Oststadt</option>
                </select>
                <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-gray-200 bg-white text-black text-base shadow focus:ring-2 focus:ring-yellow-400">
                  <option value="">Füllstand</option>
                  <option value=">80">über 80%</option>
                  <option value="50-80">50-80%</option>
                  <option value="<50">unter 50%</option>
                </select>
                <div className="flex flex-col justify-center items-center gap-2 w-full">
                <button
                    onClick={handleRouteClick}
                    className="w-12 h-12 mt-6 flex items-center justify-center rounded-full bg-yellow-400 text-white shadow hover:scale-105 transition-all"
                    style={{ background: '#FFD600' }}
                    title="Route berechnen"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      strokeWidth={2}
                      style={{ transform: expanded ? 'scaleX(-1)' : 'none' }}
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582a2 2 0 011.518.716l2.045 2.577a2 2 0 001.518.716H15a2 2 0 012 2v1m0 0l-2 2m2-2l2 2"
                    />
                  </svg>
                </button>
                </div>
              </>
            )}
            {/* Im eingeklappten Modus: Unten zwei Buttons untereinander */}
            {!expanded && (
              <div className="w-full mt-auto mb-2 flex flex-col gap-2">

              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
