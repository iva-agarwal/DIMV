import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, ShieldCheck, Heart, RefreshCw, Cpu, Zap, Radio, Orbit } from 'lucide-react';
import { sfx } from '../utils/audio';

// Bayer matrix 4×4 for precise dithered hologram
const BAYER4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
];

// Rotating wireframe globe SVG seal
function HologramSeal({ size = 54 }) {
  return (
    <div style={{ width: size, height: size }} className="relative">
      {/* Outer ring */}
      <svg
        width={size} height={size}
        viewBox="0 0 54 54"
        className="absolute inset-0 seal-spin"
        fill="none"
      >
        <circle cx="27" cy="27" r="25" stroke="url(#sealGrad)" strokeWidth="1.2" strokeDasharray="4 3"/>
        <path d="M 27 2 A 25 25 0 0 1 52 27" stroke="#FF8C00" strokeWidth="1.8"/>
        <defs>
          <linearGradient id="sealGrad" x1="0" y1="0" x2="54" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4B2B"/>
            <stop offset="0.5" stopColor="#FF8C00"/>
            <stop offset="1" stopColor="#FFD060"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Inner counter-ring */}
      <svg
        width={size} height={size}
        viewBox="0 0 54 54"
        className="absolute inset-0 seal-spin-reverse"
        fill="none"
      >
        <circle cx="27" cy="27" r="18" stroke="rgba(255,200,80,0.4)" strokeWidth="0.8" strokeDasharray="2 4"/>
      </svg>
      {/* Core Mars Planetary Emblem (No Blue Ring) */}
      <svg
        width={size} height={size}
        viewBox="0 0 54 54"
        className="absolute inset-0"
        fill="none"
      >
        {/* Central Red Planet Sphere */}
        <circle cx="27" cy="27" r="8.5" fill="rgba(255, 75, 43, 0.25)" stroke="#FF4B2B" strokeWidth="1.8"/>
        {/* Caldera / Crater Rings */}
        <circle cx="25" cy="25" r="3.5" stroke="#FF8C00" strokeWidth="1.2" strokeDasharray="2 1.5"/>
        {/* Cardinal Precision Ticks */}
        <line x1="27" y1="11" x2="27" y2="15" stroke="rgba(255,200,80,0.85)" strokeWidth="1.2"/>
        <line x1="27" y1="39" x2="27" y2="43" stroke="rgba(255,200,80,0.85)" strokeWidth="1.2"/>
        <line x1="11" y1="27" x2="15" y2="27" stroke="rgba(255,200,80,0.85)" strokeWidth="1.2"/>
        <line x1="39" y1="27" x2="43" y2="27" stroke="rgba(255,200,80,0.85)" strokeWidth="1.2"/>
      </svg>
    </div>
  );
}

// Crosshair corner marks for portrait
function Crosshairs() {
  const size = 8;
  const color = "rgba(255,200,80,0.7)";
  const s = `${size}px`;
  const style = { position:'absolute', width: s, height: s };
  const corner = (top, left, right, bottom) => ({
    ...style,
    top: top !== undefined ? top : undefined,
    left: left !== undefined ? left : undefined,
    right: right !== undefined ? right : undefined,
    bottom: bottom !== undefined ? bottom : undefined,
  });
  const line = (h, v) => ({
    position:'absolute', background: color,
    width: h ? '100%' : '1px',
    height: h ? '1px' : '100%',
    top: v === 'top' ? 0 : undefined,
    bottom: v === 'bottom' ? 0 : undefined,
    left: h === 'left' ? 0 : undefined,
    right: h === 'right' ? 0 : undefined,
  });
  return (
    <>
      <div style={corner(0, 0)} className="pointer-events-none">
        <div style={line('left','top')}/>
        <div style={line(undefined,'top')}/>
      </div>
      <div style={corner(0, undefined, 0)} className="pointer-events-none">
        <div style={line('right','top')}/>
        <div style={line(undefined,'top')}/>
      </div>
      <div style={corner(undefined, 0, undefined, 0)} className="pointer-events-none">
        <div style={line('left','bottom')}/>
        <div style={line(undefined,'bottom')}/>
      </div>
      <div style={corner(undefined, undefined, 0, 0)} className="pointer-events-none">
        <div style={line('right','bottom')}/>
        <div style={line(undefined,'bottom')}/>
      </div>
    </>
  );
}

export default function MartianCard({
  name = "ALEX CHEN",
  dob = "2000-05-12",
  avatarUrl = null,
  planetaryData,
  isFlipped = false,
  onFlipToggle,
  id = "martian-id-card"
}) {
  const cardRef = useRef(null);
  const lerpRef = useRef({ rotX: 0, rotY: 0, glareX: 50, glareY: 50 });
  const targetRef = useRef({ rotX: 0, rotY: 0, glareX: 50, glareY: 50 });
  const rafRef = useRef(null);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, opacity: 0 });

  // Smooth LERP tilt loop
  const startLerp = useCallback(() => {
    const tick = () => {
      const L = lerpRef.current;
      const T = targetRef.current;
      const factor = 0.1;
      L.rotX += (T.rotX - L.rotX) * factor;
      L.rotY += (T.rotY - L.rotY) * factor;
      L.glareX += (T.glareX - L.glareX) * factor;
      L.glareY += (T.glareY - L.glareY) * factor;
      setTilt({ ...L, opacity: T.opacity });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLerp = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    startLerp();
    return stopLerp;
  }, [startLerp, stopLerp]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    targetRef.current = {
      rotX: -((y - cy) / cy) * 13,
      rotY: ((x - cx) / cx) * 13,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      opacity: 0.85
    };
  };

  const handleMouseLeave = () => {
    targetRef.current = { rotX: 0, rotY: 0, glareX: 50, glareY: 50, opacity: 0 };
    sfx.click();
  };

  const handleTouchMove = (e) => {
    if (!cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    targetRef.current = {
      rotX: -((y - cy) / cy) * 9,
      rotY: ((x - cx) / cx) * 9,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      opacity: 0.6
    };
  };

  const d = planetaryData || {
    marsAge: "12.7", earthYears: "24.0", marsSols: "8512",
    marsBirthSol: "2498", licenseNumber: "MRS-82F-1A4",
    status: { title: "LEGALLY A TEENAGER", badge: "AGE 12.7", permit: "CLASS B-MVR" }
  };

  const flipRotY = isFlipped ? tilt.rotY + 180 : tilt.rotY;

  const cardTransform = `rotateX(${tilt.rotX}deg) rotateY(${flipRotY}deg)`;

  const holoStyle = {
    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, 
      rgba(255,75,43,0.22) 0%, 
      rgba(255,200,0,0.18) 18%, 
      rgba(0,240,200,0.22) 36%, 
      rgba(80,100,255,0.18) 54%, 
      rgba(255,0,200,0.12) 72%, 
      transparent 90%)`,
    opacity: tilt.opacity,
    transition: 'opacity 0.3s',
    mixBlendMode: 'color-dodge',
  };

  const specularStyle = {
    background: `linear-gradient(${135 + tilt.rotY * 2}deg, 
      rgba(255,255,255,${0.18 + tilt.rotY * 0.01}) 0%, 
      transparent 40%)`,
    opacity: 0.7 + tilt.glareX * 0.001,
  };

  // Format dob for display
  const dobFormatted = dob ? new Date(dob + 'T00:00:00').toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase() : '12 MAY 2000';

  const marsAgeInt = d.marsAge ? d.marsAge.toString().split('.')[0] : '12';
  const marsAgeDec = d.marsAge ? '.' + d.marsAge.toString().split('.')[1] : '.7';

  return (
    <div className="perspective-scene w-full max-w-[540px] select-none mx-auto" style={{ aspectRatio: '85.6/53.98' }}>
      <div
        id={id}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        onClick={() => { sfx.flip(); if (onFlipToggle) onFlipToggle(); }}
        className="relative w-full h-full preserve-3d cursor-pointer rounded-2xl card-shadow"
        style={{
          transform: cardTransform,
          transition: 'transform 0.05s linear',
        }}
      >

        {/* ══════════════════════════════════════
            FRONT — Smoked Acrylic Polycarbonate
            ══════════════════════════════════════ */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden card-glass flex flex-col"
          style={{ borderRadius: '14px' }}
        >
          {/* Scanlines texture */}
          <div className="absolute inset-0 scanlines-card rounded-2xl z-10 pointer-events-none"/>

          {/* Iridescent Holo Foil (tracks cursor) */}
          <div className="absolute inset-0 rounded-2xl z-20 pointer-events-none" style={holoStyle}/>

          {/* Specular rim light */}
          <div className="absolute inset-0 rounded-2xl z-20 pointer-events-none card-rim" style={specularStyle}/>

          {/* Rainbow foil top strip */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] z-30 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, #FF4B2B, #FF8C00, #FFD060, #00F0C0, #0090FF, #A855F7, #FF4B2B)`,
              opacity: 0.85
            }}
          />

          {/* Card content */}
          <div className="relative z-30 flex flex-col h-full p-5 md:p-6">

            {/* ── Top Row ── */}
            <div className="flex items-start justify-between mb-4">
              {/* Issuer */}
              <div>
                <p className="font-mono-tech text-[8px] tracking-[0.18em] text-white/40 uppercase mb-0.5">
                  DEPT. INTERPLANETARY MOTOR VEHICLES
                </p>
                <h2 className="font-display-tech font-black text-[11px] md:text-[13px] text-white/90 tracking-[0.08em] uppercase">
                  MARTIAN OPERATOR PERMIT
                </h2>
                <p className="font-mono-tech text-[7px] tracking-[0.15em] text-white/30 uppercase">
                  SECTOR: 04 // OLYMPUS MONS // {d.licenseNumber}
                </p>
              </div>

              {/* Hologram seal */}
              <HologramSeal size={52} />
            </div>

            {/* ── Mid Body: Portrait + Identity ── */}
            <div className="flex gap-4 flex-1">

              {/* Portrait Box */}
              <div className="relative shrink-0" style={{ width: 96, height: 116 }}>
                <div
                  className="w-full h-full rounded-md overflow-hidden relative"
                  style={{
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: '#0A0A12'
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Operator"
                      className="w-full h-full object-cover"
                      style={{ filter: 'contrast(1.12) saturate(0.6) sepia(0.2)' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-[#FF4B2B]/40"/>
                    </div>
                  )}
                  {/* Duo-tone warm amber overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,140,0,0.08) 0%, rgba(255,75,43,0.12) 100%)',
                      mixBlendMode: 'color'
                    }}
                  />
                </div>
                {/* Crosshair crop marks */}
                <Crosshairs/>
                {/* VERIFIED stamp */}
                <div className="absolute -bottom-1 left-0 right-0 text-center">
                  <span className="font-mono-tech text-[6px] tracking-[0.15em] text-white/30 uppercase bg-black/60 px-1 py-0.5 rounded">
                    BIO-VER
                  </span>
                </div>
              </div>

              {/* Identity Details */}
              <div className="flex flex-col justify-between flex-1 py-0.5">

                {/* Name */}
                <div>
                  <p className="font-mono-tech text-[7.5px] tracking-[0.18em] text-white/35 uppercase mb-0.5">CALLSIGN</p>
                  <p className="font-display-tech font-black text-base md:text-lg text-white tracking-tight leading-none truncate">
                    {(name || 'UNREGISTERED').toUpperCase()}
                  </p>
                </div>

                {/* Giant Martian Age */}
                <div>
                  <p className="font-mono-tech text-[7px] tracking-[0.18em] text-[#FF8C00]/80 uppercase mb-0.5">
                    MARTIAN AGE (SOL YEARS)
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-display-tech font-black text-[2.4rem] md:text-[2.8rem] leading-none text-white"
                      style={{ letterSpacing: '-0.03em' }}>
                      {marsAgeInt}
                    </span>
                    <span className="font-display-tech font-black text-[1.4rem] md:text-[1.7rem] leading-none text-[#FF4B2B]"
                      style={{ letterSpacing: '-0.02em' }}>
                      {marsAgeDec}
                    </span>
                    <span className="font-mono-tech text-[8px] text-white/40 ml-1 mb-1 tracking-wider">SOLS</span>
                  </div>
                  {/* Status badge */}
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mars-pulse inline-block"/>
                    <span className="font-mono-tech text-[8px] tracking-[0.12em] text-emerald-400 font-bold uppercase">
                      {(d.status?.title || 'PRIME MARTIAN').slice(0,28)}
                    </span>
                  </div>
                </div>

                {/* Two-column telemetry */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  <div>
                    <p className="font-mono-tech text-[7px] text-white/30 tracking-[0.14em] uppercase">EARTH DOB</p>
                    <p className="font-mono-tech text-[9px] text-white/70 font-bold">{dobFormatted}</p>
                  </div>
                  <div>
                    <p className="font-mono-tech text-[7px] text-white/30 tracking-[0.14em] uppercase">EARTH YRS</p>
                    <p className="font-mono-tech text-[9px] text-white/70 font-bold">{d.earthYears}</p>
                  </div>
                  <div>
                    <p className="font-mono-tech text-[7px] text-white/30 tracking-[0.14em] uppercase">SOLS LIVED</p>
                    <p className="font-mono-tech text-[9px] text-[#FF8C00] font-bold">{Number(d.marsSols).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-mono-tech text-[7px] text-white/30 tracking-[0.14em] uppercase">CLASS</p>
                    <p className="font-mono-tech text-[9px] text-cyan-400 font-bold">A-EXO</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Bottom Row: Barcode + Corner coords ── */}
            <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-end justify-between">
              {/* Barcode SVG */}
              <div>
                <svg className="h-[22px] w-[130px] md:w-[160px]" viewBox="0 0 160 22" fill="currentColor" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {[0,4,6,11,14,17,20,25,28,31,35,38,43,46,49,52,57,60,63,67,70,75,78,82,86,90,95,98,102,106,110,114,118,122,126,130,134,138,142,146,150,154,157].map((x, i) =>
                    <rect key={i} x={x} y="0" width={[2,1,3,1,2,2,1,2,1,3,2,1,2,3,1,2,1,2,3,2,1,2,1,3,1,2,2,3,1,2,1,3,2,1,2,1,3,1,2,1,2,1,3][i]} height="22"/>
                  )}
                </svg>
                <p className="font-mono-tech text-[6px] tracking-[0.2em] text-white/25 mt-0.5">
                  *DIMV-{d.licenseNumber}*
                </p>
              </div>

              {/* Bottom corner telemetry */}
              <div className="text-right">
                <p className="font-mono-tech text-[6px] tracking-[0.12em] text-white/25 uppercase">
                  LAT 18.65°N // LON 226.2°E
                </p>
                <p className="font-mono-tech text-[6px] tracking-[0.12em] text-white/25 uppercase">
                  SYS_VER: 2.4.9 // GRAV: 0.376g
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            BACK — Magnetic Strip Editorial & Telemetry
            ══════════════════════════════════════ */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden card-glass flex flex-col"
          style={{ borderRadius: '14px' }}
        >
          {/* Scanlines */}
          <div className="absolute inset-0 scanlines-card z-10 pointer-events-none rounded-2xl"/>
          {/* Holo foil (mirrored) */}
          <div className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
            style={{ ...holoStyle, opacity: (tilt.opacity || 0) * 0.7 }}
          />
          {/* Specular */}
          <div className="absolute inset-0 rounded-2xl z-20 pointer-events-none card-rim"
            style={{ ...specularStyle, opacity: (specularStyle.opacity || 0.7) * 0.85 }}
          />
          {/* Top foil strip (back) */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] z-30 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #00F0FF, #A855F7, #FF4B2B, #FFD060, #00F0FF)',
              opacity: 0.85
            }}
          />

          <div className="relative z-30 flex flex-col h-full justify-between p-4 md:p-5">
            {/* Magnetic Strip with metallic gloss */}
            <div className="w-full -mx-4 md:-mx-5 px-5 py-2.5 my-1"
              style={{
                background: 'linear-gradient(180deg, #07070b 0%, #151620 40%, #090a0f 100%)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-center justify-between">
                <p className="font-mono-tech text-[6.5px] tracking-[0.25em] text-white/20 uppercase truncate">
                  %B{(d.licenseNumber || 'MRS-82F-1A4').replace(/-/g,'')}^{name?.toUpperCase() || 'PILOT'}^{dob?.replace(/-/g,'')}?
                </p>
                <span className="font-mono-tech text-[6px] tracking-wider text-[#00F0FF]/60 px-1 py-0.5 rounded bg-black/40 border border-[#00F0FF]/20">
                  CHIP 256
                </span>
              </div>
            </div>

            {/* Middle Section: Planetary Table & Endorsements */}
            <div className="my-1 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-mono-tech text-[7.5px] tracking-[0.18em] text-[#FF8C00] uppercase font-bold">
                  SOLAR SYSTEM RECKONING // 365.25d BASE
                </p>
                <p className="font-mono-tech text-[6.5px] tracking-wider text-white/30 uppercase">
                  ORBITAL SYNC: LIVE
                </p>
              </div>

              {/* 6-Planet Compact Matrix */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { sym: '☿', name: 'MERCURY', ratio: 0.24, color: '#A0A0B0', age: (Number(d.earthYears || 24.0) / 0.24).toFixed(1) },
                  { sym: '♀', name: 'VENUS',   ratio: 0.62, color: '#E3BB7B', age: (Number(d.earthYears || 24.0) / 0.62).toFixed(1) },
                  { sym: '🜨', name: 'EARTH',   ratio: 1.00, color: '#4BA3E3', age: (d.earthYears || '24.0') },
                  { sym: '♂', name: 'MARS',    ratio: 1.88, color: '#FF4B2B', age: (d.marsAge || '12.7'), highlight: true },
                  { sym: '♃', name: 'JUPITER', ratio: 11.86, color: '#D99B66', age: (Number(d.earthYears || 24.0) / 11.86).toFixed(1) },
                  { sym: '♄', name: 'SATURN',  ratio: 29.46, color: '#E8D099', age: (Number(d.earthYears || 24.0) / 29.46).toFixed(1) },
                ].map((planet) => (
                  <div key={planet.name}
                    className="flex items-center justify-between rounded px-2 py-0.5"
                    style={{
                      background: planet.highlight ? 'rgba(255,75,43,0.14)' : 'rgba(255,255,255,0.03)',
                      border: planet.highlight ? '1px solid rgba(255,75,43,0.45)' : '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-tech text-[8px]" style={{ color: planet.color }}>{planet.sym}</span>
                      <span className="font-mono-tech text-[7px] tracking-wider text-white/50 uppercase">{planet.name}</span>
                    </div>
                    <span
                      className="font-display-tech font-black text-[11px]"
                      style={{ color: planet.highlight ? '#FF4B2B' : 'rgba(255,255,255,0.85)' }}
                    >
                      {planet.age}<span className="font-mono-tech text-[7px] font-normal text-white/30 ml-0.5">Y</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Endorsements & Restrictions Strip */}
              <div className="p-1.5 rounded bg-white/[0.02] border border-white/[0.05] grid grid-cols-2 gap-2 text-[6.5px] font-mono-tech">
                <div>
                  <span className="text-neutral-500 uppercase tracking-wider block">ENDORSEMENTS:</span>
                  <span className="text-white/80 font-bold block truncate">EVA GRADE-IV // CRAWLER // MAG-BOOTS</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase tracking-wider block">RESTRICTIONS:</span>
                  <span className="text-[#00F0FF]/90 font-bold block truncate">0.38G GRAV ONLY // AIRLOCK MASK REQ</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Organ Donor + Biometric Signature + Legal Stamp */}
            <div className="pt-2 border-t border-white/[0.08] flex items-end justify-between gap-3">
              {/* Organ Donor & Blood Type */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0"/>
                <div>
                  <p className="font-mono-tech text-[6px] text-white/40 tracking-[0.1em] uppercase">DONOR // SYNTH-OK</p>
                  <p className="font-mono-tech text-[8px] font-bold text-white/80">O-POS (SYNTH 98%)</p>
                </div>
              </div>

              {/* Microprint Legal */}
              <div className="hidden sm:block text-[5.5px] font-mono-tech text-neutral-600 leading-tight max-w-[140px]">
                MARS COLONIAL ADMINISTRATION // DIMV. ISSUED UNDER STATUTE 14-B. IF FOUND RETURN TO HABITAT AIRLOCK.
              </div>

              {/* Biometric Signature */}
              <div className="text-right">
                <p className="font-mono-tech text-[5.5px] text-white/30 tracking-[0.12em] uppercase mb-0.5">
                  OPERATOR SIGNATURE
                </p>
                <p className="font-display-tech font-black text-sm text-white/80 italic tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  {name || 'Alex Chen'}
                </p>
                <p className="font-mono-tech text-[5.5px] text-emerald-400/80 tracking-wider uppercase">
                  SHA-256 VALIDATED
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
