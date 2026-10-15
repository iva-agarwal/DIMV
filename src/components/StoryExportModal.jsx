import React, { useState, useRef } from 'react';
import { X, Download, Smartphone, Check, Sparkles, Orbit } from 'lucide-react';
import { toPng } from 'html-to-image';
import { sfx } from '../utils/audio';

export default function StoryExportModal({
  isOpen,
  onClose,
  userData,
  planetaryData,
  userPhotoImg,
}) {
  const [downloading, setDownloading] = useState(false);
  const storyCardRef = useRef(null);

  if (!isOpen || !planetaryData) return null;

  const d = planetaryData;
  const name = (userData?.name || 'CITIZEN').toUpperCase();
  const dob = userData?.dob || '2000-05-12';
  const dobFormatted = dob ? new Date(dob + 'T00:00:00').toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase() : '12 MAY 2000';

  const marsAgeStr = d.marsAge ? d.marsAge.toString() : '12.8';
  const [intPart, decPart] = marsAgeStr.split('.');

  const handleDownload = async () => {
    if (!storyCardRef.current || downloading) return;
    try {
      sfx.mint();
      setDownloading(true);

      const dataUrl = await toPng(storyCardRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        style: {
          transform: 'none',
        },
      });

      const link = document.createElement('a');
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '-');
      link.download = `MARTIAN-ID-${safeName}-STORY-9x16.png`;
      link.href = dataUrl;
      link.click();
      setTimeout(() => setDownloading(false), 900);
    } catch (err) {
      console.error('Failed to export story card:', err);
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeup select-none">
      <div className="relative w-full max-w-[400px] bg-[#0a0a12] border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[98vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-[#FF4B2B]" />
            <div>
              <h3 className="text-sm font-bold font-display-tech text-white leading-tight">
                Instagram / TikTok Story (9:16)
              </h3>
              <p className="font-mono text-[10px] text-neutral-400">
                1080 × 1920 HD Interplanetary Credential
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sfx.modalClose();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Vector 9:16 Story Card Preview Container */}
        <div className="flex-1 overflow-y-auto py-1 sm:py-2 flex justify-center items-center min-h-0">
          <div
            ref={storyCardRef}
            className="w-[360px] h-[640px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-5 relative border border-white/20 shrink-0 card-glass"
            style={{
              background: 'radial-gradient(circle at 50% 30%, #15101a 0%, #08080d 50%, #040407 100%)',
            }}
          >
            {/* Top Amber glow */}
            <div
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-44 pointer-events-none rounded-full"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,75,43,0.3) 0%, transparent 70%)',
              }}
            />

            {/* Scanlines texture */}
            <div className="absolute inset-0 scanlines-card rounded-2xl z-10 pointer-events-none"/>

            {/* Rainbow foil top strip */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] z-30 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, #FF4B2B, #FF8C00, #FFD060, #00F0C0, #0090FF, #A855F7, #FF4B2B)',
                opacity: 0.85
              }}
            />

            {/* Corner registration brackets */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#FF4B2B] z-20" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#FF4B2B] z-20" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#FF4B2B] z-20" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#FF4B2B] z-20" />

            {/* 1. Header Section */}
            <div className="relative z-30 text-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#FF8C00]/40 bg-[#FF8C00]/10 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B2B] animate-pulse" />
                <span className="font-mono text-[7px] tracking-[0.2em] text-[#FF8C00] uppercase font-bold">
                  DEPT. INTERPLANETARY MOTOR VEHICLES
                </span>
              </div>
              <p className="font-mono text-[6.5px] tracking-[0.2em] text-neutral-400 uppercase">
                MARS COLONY 01 // OLYMPUS MONS SECTOR
              </p>
              <h1 className="font-display-tech font-extrabold text-xl text-white tracking-tight mt-1">
                HOW OLD AM I ACTUALLY?
              </h1>
            </div>

            {/* 2. Mini Front ID Card in Story */}
            <div
              className="relative z-10 my-2 rounded-xl border border-white/20 p-3 card-shadow overflow-hidden card-glass"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Scanlines texture */}
              <div className="absolute inset-0 scanlines-card rounded-xl z-10 pointer-events-none"/>

              {/* Top rainbow foil */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] z-20"
                style={{
                  background: 'linear-gradient(90deg, #FF4B2B, #FF8C00, #FFD060, #00F0C0, #0090FF, #A855F7, #FF4B2B)',
                }}
              />

              <div className="flex items-center justify-between mb-2 relative z-30">
                <div>
                  <span className="font-mono text-[6px] tracking-widest text-neutral-400 block uppercase">
                    OPERATOR PERMIT // {d.licenseNumber}
                  </span>
                  <span className="font-display-tech font-bold text-[10px] text-white">
                    {name}
                  </span>
                </div>
                <div className="w-5 h-5 rounded-full border border-[#FF8C00]/50 bg-[#FF4B2B]/10 flex items-center justify-center">
                  <Orbit className="w-3 h-3 text-[#FF4B2B]" />
                </div>
              </div>

              {/* Card Body: Avatar + Big Age */}
              <div className="flex gap-2.5 items-center relative z-30">
                {/* Avatar Frame */}
                <div className="w-16 h-18 rounded border border-white/15 overflow-hidden bg-black/60 relative shrink-0" style={{ border: '1px solid rgba(255,255,255,0.14)', background: '#0A0A12' }}>
                  {userPhotoImg ? (
                    <img src={userPhotoImg.src} alt="Avatar" className="w-full h-full object-cover" style={{ filter: 'contrast(1.12) saturate(0.6) sepia(0.2)' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#FF4B2B] text-xs">
                      [ID]
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

                {/* Big Age & Telemetry */}
                <div className="flex-1">
                  <span className="font-mono text-[6px] tracking-wider text-[#FF8C00] block uppercase">
                    MARTIAN AGE (SOLS)
                  </span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-display-tech font-black text-2xl text-white leading-none">
                      {intPart}
                    </span>
                    <span className="font-display-tech font-black text-lg text-[#FF4B2B] leading-none">
                      .{decPart || '0'}
                    </span>
                    <span className="font-mono text-[7px] text-neutral-400 ml-1">SOLS</span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-[7px] font-mono text-emerald-400">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                    <span className="truncate">{d.status?.title || 'PRIME MARTIAN'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 mt-1 text-[6.5px] font-mono text-neutral-400">
                    <span>EARTH: {d.earthYears} YRS</span>
                    <span className="text-right">SOLS: {Number(d.marsSols).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Mini barcode */}
              <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[6px] font-mono text-neutral-500 relative z-30">
                <span>AUTH: SHA-256//COLONY-01</span>
                <span>LAT 18.65°N LON 226.2°E</span>
              </div>
            </div>

            {/* 3. Viral Status Banner */}
            <div className="relative z-30 p-2.5 rounded-xl border border-[#FF4B2B]/35 bg-[#FF4B2B]/10 text-center">
              <span className="font-mono text-[7px] text-[#FF8C00] tracking-widest uppercase block font-bold">
                LEGAL INTERPLANETARY STANDING
              </span>
              <h3 className="font-display-tech font-black text-sm text-white mt-0.5 tracking-tight">
                {d.status?.title}
              </h3>
              <p className="font-mono text-[7.5px] text-neutral-300 mt-0.5 italic">
                "{d.status?.tagline}"
              </p>
            </div>

            {/* 4. Planetary Age Strip (4 Cards) */}
            <div className="relative z-30">
              <span className="font-mono text-[7px] tracking-wider text-neutral-400 uppercase block text-center mb-1">
                SOLAR SYSTEM AGE RECKONING
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { name: 'MERCURY', age: (d.earthYears / 0.24).toFixed(1), sym: '☿', color: '#A0A0B0' },
                  { name: 'VENUS',   age: (d.earthYears / 0.62).toFixed(1), sym: '♀', color: '#E3BB7B' },
                  { name: 'MARS',    age: d.marsAge,                       sym: '♂', color: '#FF4B2B', highlight: true },
                  { name: 'JUPITER', age: (d.earthYears / 11.86).toFixed(1), sym: '♃', color: '#D99B66' },
                ].map((p) => (
                  <div
                    key={p.name}
                    className={`p-1.5 rounded-lg text-center border ${
                      p.highlight
                        ? 'border-[#FF4B2B] bg-[#FF4B2B]/15'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <span className="font-mono text-[7px] block" style={{ color: p.color }}>
                      {p.sym} {p.name}
                    </span>
                    <span className="font-display-tech font-black text-xs text-white block mt-0.5">
                      {p.age}
                    </span>
                    <span className="font-mono text-[5.5px] text-neutral-400 block uppercase">
                      YRS
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Live Next Birthday Snippet */}
            <div className="relative z-30 p-2 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-between text-[7px] font-mono">
              <span className="text-[#FFD060] font-bold">
                NEXT MARS BIRTHDAY (JUBILEE {d.nextMarsAge})
              </span>
              <span className="text-white font-bold">
                IN {d.daysUntilNextMarsBday} DAYS ({d.solsUntilNextMarsBday} SOLS)
              </span>
            </div>

            {/* 6. Footer QR Watermark */}
            <div className="relative z-30 text-center pt-1 border-t border-white/10">
              <p className="font-display-tech font-extrabold text-[9px] text-white tracking-wider uppercase">
                MINT YOUR OWN MARTIAN ID
              </p>
              <p className="font-mono text-[6.5px] text-[#FF4B2B] tracking-wider uppercase">
                HTTPS://MARTIAN-ID.IO // DIMV OLYMPUS MONS
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-white/10 pt-3 flex gap-3 shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#FF4B2B] to-[#FF8C00] font-mono font-bold text-black text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-[0_0_25px_rgba(255,75,43,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Check className="w-4 h-4 text-emerald-950 font-bold" />
                <span>GENERATING HD PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>DOWNLOAD 9:16 STORY (PNG)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
