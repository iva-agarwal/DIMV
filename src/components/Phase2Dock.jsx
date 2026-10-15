import React, { useState } from 'react';
import { RotateCw, Edit3, Smartphone, X, User, Check } from 'lucide-react';
import { sfx } from '../utils/audio';
import { PRESET_AVATARS, getPresetAvatarDataUrl } from '../utils/avatars';
import DarkDatePicker from './DarkDatePicker';

export default function Phase2Dock({
  onFlip,
  isFlipped,
  onOpenStory,
  name,
  setName,
  birthDate,
  setBirthDate,
  userPhoto,
  setUserPhoto,
  cardData,
}) {
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showAvatarDrawer, setShowAvatarDrawer] = useState(false);

  const openAvatarDrawer = () => {
    sfx.modalOpen();
    setShowAvatarDrawer(true);
    setShowEditDrawer(false);
  };

  const closeAvatarDrawer = () => {
    sfx.modalClose();
    setShowAvatarDrawer(false);
  };

  const openEditDrawer = () => {
    sfx.modalOpen();
    setShowEditDrawer(true);
    setShowAvatarDrawer(false);
  };

  const closeEditDrawer = () => {
    sfx.modalClose();
    setShowEditDrawer(false);
  };

  return (
    <>
      {/* 1. Avatar Selector Drawer Modal */}
      {showAvatarDrawer && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeup select-none">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0c0c16]/95 border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="font-mono text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white font-bold">
                  CHOOSE AVATAR (4 PRESETS)
                </h3>
              </div>
              <button
                onClick={closeAvatarDrawer}
                className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Avatar Presets */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4">
              {PRESET_AVATARS.map((preset, idx) => {
                const dataUrl = getPresetAvatarDataUrl(idx);
                const isSelected = userPhoto === dataUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      sfx.avatarSelect();
                      setUserPhoto(dataUrl);
                    }}
                    onMouseEnter={() => sfx.hoverBlip()}
                    className={`relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border flex flex-col items-center gap-1.5 sm:gap-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-[#FF4B2B] bg-[#FF4B2B]/15 shadow-[0_0_15px_rgba(255,75,43,0.3)]'
                        : 'border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border border-white/15 transition-transform group-hover:scale-105"
                      dangerouslySetInnerHTML={{ __html: preset.svg }}
                    />
                    <div className="text-center w-full">
                      <span className="font-mono text-[9px] font-bold tracking-wider text-white block uppercase">
                        {preset.tag}
                      </span>
                      <span className="font-mono text-[8px] text-neutral-400 block truncate">
                        {preset.name.split('//')[1]?.trim() || preset.name}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF4B2B] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-black font-bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit Details Drawer Modal */}
      {showEditDrawer && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeup select-none">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0c0c16]/95 border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4B2B]" />
                <h3 className="font-mono text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white font-bold">
                  TELEMETRY EDIT // RE-CALIBRATE
                </h3>
              </div>
              <button
                onClick={closeEditDrawer}
                className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                  OPERATOR CALLSIGN
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    sfx.typeKey();
                    setName(e.target.value);
                  }}
                  onFocus={() => sfx.hoverBlip()}
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-[#FF4B2B] rounded-xl px-4 py-3 text-white font-mono text-sm uppercase outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                  DATE OF BIRTH (EARTH)
                </label>
                <DarkDatePicker
                  value={birthDate}
                  onChange={(newDate) => setBirthDate(newDate)}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sfx.click();
                    closeEditDrawer();
                  }}
                  className="w-full py-3 sm:py-3.5 rounded-xl bg-[#FF4B2B] hover:bg-[#FF8C00] text-black font-mono font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(255,75,43,0.3)] active:scale-[0.98]"
                >
                  SAVE & UPDATE ID ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating HUD Controls (Bottom Glass Dock - NO TIMER BUTTON) */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 select-none w-full max-w-fit px-2 sm:px-4 pointer-events-none">
        <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-full bg-[#08080f]/90 border border-white/10 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] pointer-events-auto max-w-[calc(100vw-1rem)] overflow-x-auto">
          {/* Flip Button */}
          <button
            onClick={() => {
              sfx.hoverBlip();
              sfx.flip();
              onFlip();
            }}
            onMouseEnter={() => sfx.hoverBlip()}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-white/20 transition-all font-mono text-[10px] sm:text-xs uppercase tracking-wider active:scale-95 cursor-pointer shrink-0"
            title="Rotate card to view Back / Front"
          >
            <RotateCw className={`w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180 text-[#00F0FF]' : 'text-[#FF4B2B]'}`} />
            <span className="hidden sm:inline">{isFlipped ? 'SHOW FRONT' : 'FLIP CARD'}</span>
            <span className="sm:hidden">{isFlipped ? 'FRONT' : 'FLIP'}</span>
          </button>

          {/* Avatar Selector Button */}
          <button
            onClick={openAvatarDrawer}
            onMouseEnter={() => sfx.hoverBlip()}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/5 transition-all font-mono text-[10px] sm:text-xs uppercase tracking-wider active:scale-95 cursor-pointer shrink-0"
            title="Switch between the 4 Avatar presets or upload photo"
          >
            <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#00F0FF]" />
            <span>AVATAR</span>
          </button>

          {/* Edit DOB / Name */}
          <button
            onClick={openEditDrawer}
            onMouseEnter={() => sfx.hoverBlip()}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/5 transition-all font-mono text-[10px] sm:text-xs uppercase tracking-wider active:scale-95 cursor-pointer shrink-0"
            title="Edit your Name or Birth Date"
          >
            <Edit3 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">EDIT DETAILS</span>
            <span className="sm:hidden">EDIT</span>
          </button>

          {/* Open Story Modal */}
          <button
            onClick={() => {
              sfx.hoverBlip();
              sfx.modalOpen();
              onOpenStory();
            }}
            onMouseEnter={() => sfx.hoverBlip()}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#FF4B2B] to-[#FF8C00] hover:from-[#ff5e40] hover:to-[#ffa126] text-black font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,75,43,0.35)] transition-all active:scale-95 cursor-pointer shrink-0"
            title="Preview & Export 9:16 Instagram Story Card"
          >
            <Smartphone className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span>STORY</span>
            <span className="text-[8px] sm:text-[9px] opacity-75 font-mono hidden sm:inline">(9:16)</span>
          </button>
        </div>
      </div>
    </>
  );
}
