import React, { useState, useEffect } from 'react';
import { SOL_IN_EARTH_DAYS } from '../utils/planetaryMath';

export default function BirthdayCountdown({ birthDate, nextMarsDate, nextMarsAge }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, sols: 0 });

  useEffect(() => {
    if (!nextMarsDate) return;
    const update = () => {
      const diff = new Date(nextMarsDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, sols: 0 }); return; }
      const totalDays = diff / 86400000;
      setTimeLeft({
        days: Math.floor(totalDays),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        sols: (totalDays / SOL_IN_EARTH_DAYS).toFixed(1),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [nextMarsDate]);

  if (!nextMarsDate) return null;

  const segments = [
    { value: timeLeft.days, label: 'EARTH DAYS' },
    { value: String(timeLeft.hours).padStart(2,'0'), label: 'HRS' },
    { value: String(timeLeft.minutes).padStart(2,'0'), label: 'MIN' },
    { value: String(timeLeft.seconds).padStart(2,'0'), label: 'SEC', accent: true },
  ];

  return (
    <div className="w-full rounded-2xl p-5" style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono-tech text-[8px] tracking-[0.2em] text-[#FF8C00]/70 uppercase">
            SOLAR ORBIT TELEMETRY
          </p>
          <p className="font-display-tech font-black text-sm text-white mt-0.5">
            Next Martian Birthday — Sol Jubilee {nextMarsAge}
          </p>
        </div>
        <p className="font-mono-tech text-[8px] text-white/25 tracking-[0.1em]">
          {new Date(nextMarsDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {segments.map((seg) => (
          <div key={seg.label} className="text-center py-3 rounded-xl"
            style={{
              background: seg.accent ? 'rgba(255,75,43,0.08)' : 'rgba(255,255,255,0.03)',
              border: seg.accent ? '1px solid rgba(255,75,43,0.2)' : '1px solid rgba(255,255,255,0.05)',
            }}>
            <p className="font-display-tech font-black text-2xl md:text-3xl leading-none"
              style={{ color: seg.accent ? '#FF4B2B' : '#E8E8EE', letterSpacing: '-0.03em' }}>
              {seg.value}
            </p>
            <p className="font-mono-tech text-[7px] tracking-[0.16em] text-white/30 mt-1.5 uppercase">
              {seg.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="font-mono-tech text-[8px] text-white/25 tracking-[0.12em]">MARTIAN SOL EQUIVALENT</p>
        <p className="font-mono-tech text-[9px] font-bold text-white/60">{timeLeft.sols} SOLS</p>
      </div>
    </div>
  );
}
