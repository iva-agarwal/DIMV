import React, { useRef } from 'react';
import { Camera, Check } from 'lucide-react';
import { sfx } from '../utils/audio';
import { PRESET_AVATARS, getPresetAvatarDataUrl } from '../utils/avatars';
import DarkDatePicker from './DarkDatePicker';

export default function Phase1Intake({
  name,
  setName,
  birthDate,
  setBirthDate,
  userPhoto,
  setUserPhoto,
  onSubmit,
  isDissolving,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    sfx.click();
    sfx.warpWhoosh();
    onSubmit();
  };

  return (
    <div
      className={`relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-3 sm:px-6 py-6 sm:py-10 transition-all duration-700 ease-out ${
        isDissolving ? 'opacity-0 scale-95 pointer-events-none filter blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top telemetry badge */}
      <div className="mb-4 sm:mb-6 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B2B] animate-pulse" />
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase">
          SOLAR IDENTITY PROTOCOL // v4.2
        </span>
      </div>

      {/* Center Stage: Brutalist Headline */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 select-none px-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-2 sm:mb-3 font-display-tech leading-tight">
          HOW OLD ARE YOU REALLY?
        </h1>
        <p className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.3em] text-neutral-500 font-medium">
          DEPT. OF INTERPLANETARY MOTOR VEHICLES // MARS COLONY 01
        </p>
      </div>

      {/* Minimalist Input Array Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#0a0a10]/75 backdrop-blur-2xl border border-white/[0.1] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl relative"
      >
        <div className="space-y-4 sm:space-y-5">
          {/* 1. Full Name / Call-Sign Input */}
          <div>
            <label className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1 sm:mb-1.5">
              CALLSIGN / FULL NAME
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  sfx.typeKey();
                  setName(e.target.value);
                }}
                onFocus={() => sfx.hoverBlip()}
                placeholder="E.G. COMMANDER CHEN"
                required
                className="w-full bg-white/[0.03] border border-white/15 focus:border-[#FF4B2B] focus:bg-white/[0.06] rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-white font-mono text-xs sm:text-sm uppercase tracking-wider outline-none transition-all placeholder:text-neutral-600 placeholder:normal-case"
              />
              <span className="absolute right-3.5 top-3 sm:top-3.5 text-neutral-600 text-xs font-mono">
                [ID]
              </span>
            </div>
          </div>

          {/* 2. Date of Birth Input with DarkDatePicker */}
          <div>
            <label className="block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1 sm:mb-1.5">
              EARTH DATE OF BIRTH (TYPE OR CHOOSE)
            </label>
            <DarkDatePicker
              value={birthDate}
              onChange={(newDate) => setBirthDate(newDate)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          {/* 3. 4 Cyberpunk Avatar Presets */}
          <div>
            <label className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-2 block">
              CHOOSE AVATAR (4 PROTOCOLS)
            </label>

            {/* 4 Interactive Avatar Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {PRESET_AVATARS.map((preset, idx) => {
                const dataUrl = getPresetAvatarDataUrl(idx);
                const isSelected = userPhoto === dataUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      sfx.click();
                      setUserPhoto(dataUrl);
                    }}
                    onMouseEnter={() => sfx.hoverBlip()}
                    className={`relative p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-1.5 sm:gap-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-[#FF4B2B] bg-[#FF4B2B]/15 shadow-[0_0_15px_rgba(255,75,43,0.3)]'
                        : 'border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border border-white/15 transition-transform group-hover:scale-105"
                      dangerouslySetInnerHTML={{ __html: preset.svg }}
                    />
                    <div className="text-center w-full">
                      <span className="font-mono text-[8px] font-bold tracking-wider text-white block uppercase truncate">
                        {preset.tag}
                      </span>
                      <span className="font-mono text-[7px] text-neutral-400 block truncate">
                        {preset.name.split('//')[1]?.trim() || preset.name}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#FF4B2B] flex items-center justify-center">
                        <Check className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-black font-bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Big Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              onMouseEnter={() => sfx.hoverBlip()}
              className="w-full relative group overflow-hidden rounded-full py-3.5 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-white via-neutral-100 to-amber-100 hover:from-white hover:to-orange-400 text-black font-mono font-bold text-xs sm:text-sm tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,140,0,0.25)] hover:shadow-[0_0_40px_rgba(255,75,43,0.5)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>TRANSMIT & MINT PASS ↗</span>
            </button>
          </div>
        </div>

        {/* Security badge footer inside form */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-neutral-500">
          <span>SEC: CLASS-A 256-BIT</span>
          <span>SOL SYSTEM JURISDICTION</span>
        </div>
      </form>

      {/* Monolithic bottom copyright */}
      <div className="mt-6 sm:mt-8 text-center px-2">
        <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.25em] text-neutral-600 uppercase">
          DIMV-MARS-EXPEDITION-01 // NO COMMERCIAL CITIZENSHIP IMPLIED
        </p>
      </div>
    </div>
  );
}
