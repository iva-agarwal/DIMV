import React, { useState } from 'react';
import { sfx } from '../utils/audio';

const PLANETS = [
  { id: 'mercury', sym: '☿', name: 'MERCURY', orbitDays: 87.97, color: '#A8A8B8' },
  { id: 'venus',   sym: '♀', name: 'VENUS',   orbitDays: 224.70, color: '#E3BB7B' },
  { id: 'earth',   sym: '🜨', name: 'EARTH',   orbitDays: 365.25, color: '#4BA3E3' },
  { id: 'mars',    sym: '♂', name: 'MARS',    orbitDays: 686.98, color: '#FF4B2B', highlight: true },
  { id: 'jupiter', sym: '♃', name: 'JUPITER', orbitDays: 4332.59, color: '#D99B66' },
  { id: 'saturn',  sym: '♄', name: 'SATURN',  orbitDays: 10759.22, color: '#E8D099' },
  { id: 'uranus',  sym: '♅', name: 'URANUS',  orbitDays: 30685.40, color: '#7DE3E8' },
  { id: 'neptune', sym: '♆', name: 'NEPTUNE', orbitDays: 60189.00, color: '#4B6BFF' },
];

export default function PlanetaryStrip({ planetaryAges = [] }) {
  const [selected, setSelected] = useState('mars');

  if (!planetaryAges || planetaryAges.length === 0) return null;

  const current = planetaryAges.find(p => p.id === selected) || planetaryAges[3];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono-tech text-[8px] tracking-[0.2em] text-white/25 uppercase">
          SOLAR CHRONOLOGY MATRIX
        </p>
        <p className="font-mono-tech text-[8px] text-white/20 tracking-[0.1em]">
          EARTH BASE: 365.25d
        </p>
      </div>

      {/* Planet grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 mb-3">
        {planetaryAges.map((planet) => {
          const isSelected = selected === planet.id;
          const info = PLANETS.find(p => p.id === planet.id);
          return (
            <button
              key={planet.id}
              onClick={() => { sfx.click(); setSelected(planet.id); }}
              className="py-2.5 px-1 rounded-xl text-center cursor-pointer transition-all active:scale-95"
              style={{
                background: isSelected
                  ? `rgba(${planet.id === 'mars' ? '255,75,43' : '255,255,255'},0.08)`
                  : 'rgba(255,255,255,0.03)',
                border: isSelected
                  ? `1px solid ${info?.color || 'rgba(255,255,255,0.2)'}40`
                  : '1px solid rgba(255,255,255,0.04)',
                boxShadow: isSelected && planet.id === 'mars'
                  ? '0 0 16px rgba(255,75,43,0.15)' : 'none',
              }}
            >
              <p className="font-mono-tech text-[10px] mb-0.5" style={{ color: info?.color || '#fff' }}>
                {info?.sym || planet.id[0].toUpperCase()}
              </p>
              <p className="font-mono-tech text-[6.5px] tracking-[0.1em] uppercase text-white/30 mb-1">
                {planet.name.slice(0, 3)}
              </p>
              <p className="font-display-tech font-black text-[13px] leading-none"
                style={{ color: isSelected ? (info?.color || '#fff') : 'rgba(255,255,255,0.7)' }}>
                {planet.ageFormatted}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected planet detail row */}
      <div className="rounded-xl px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{PLANETS.find(p => p.id === selected)?.sym}</span>
          <div>
            <p className="font-display-tech font-black text-sm text-white">{current.name} PROFILE</p>
            <p className="font-mono-tech text-[8px] text-white/30 tracking-[0.1em]">
              {current.orbitDays}d per orbit · {(365.25 / current.orbitDays).toFixed(4)}× Earth speed
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display-tech font-black text-xl" style={{ color: PLANETS.find(p => p.id === selected)?.color || '#fff' }}>
            {current.ageFormatted}
          </p>
          <p className="font-mono-tech text-[7px] text-white/30">YRS OLD</p>
        </div>
      </div>
    </div>
  );
}
