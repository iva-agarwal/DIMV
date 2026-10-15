import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Clock, Orbit, Volume2, VolumeX } from 'lucide-react';
import CosmicBackground from './components/CosmicBackground';
import MartianCard from './components/MartianCard';
import Phase1Intake from './components/Phase1Intake';
import Phase2Dock from './components/Phase2Dock';
import StoryExportModal from './components/StoryExportModal';
import { calculatePlanetaryAges, SOL_IN_EARTH_DAYS } from './utils/planetaryMath';
import { getPresetAvatarDataUrl } from './utils/avatars';
import { sfx } from './utils/audio';

export default function App() {
  const [phase, setPhase] = useState('intake'); // 'intake' | 'warping' | 'card'
  const [isDissolving, setIsDissolving] = useState(false);

  // User details
  const [name, setName] = useState('ALEX CHEN');
  const [birthDate, setBirthDate] = useState('2000-05-12');
  const [userPhoto, setUserPhoto] = useState(getPresetAvatarDataUrl(0));
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);

  // Story modal state
  const [showStoryModal, setShowStoryModal] = useState(false);

  // Preloaded image object for story card drawing
  const [userPhotoImg, setUserPhotoImg] = useState(null);

  // Live countdown timer state for HUD
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, sols: '0' });

  // Load URL parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('name');
      const urlDob = params.get('dob');
      if (urlName) setName(urlName.toUpperCase());
      if (urlDob) setBirthDate(urlDob);
    } catch {}
  }, []);

  const triggerStartMusic = () => {
    sfx.init();
    sfx.startAmbientMusic();
    setIsMusicOn(true);
  };

  // Start slow atmospheric space ambient music on first user gesture anywhere
  useEffect(() => {
    const handleFirstInteraction = () => {
      triggerStartMusic();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Pre-load user image object whenever photo changes
  useEffect(() => {
    if (!userPhoto) {
      setUserPhotoImg(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      setUserPhotoImg(img);
    };
    img.src = userPhoto;
  }, [userPhoto]);

  // Compute planetary data dynamically
  const cardData = useMemo(() => {
    const data = calculatePlanetaryAges(birthDate || '2000-05-12');
    return {
      ...data,
      name: name || 'ALEX CHEN',
      birthDate: birthDate || '2000-05-12',
    };
  }, [name, birthDate]);

  // Live ticking countdown for next Martian Birthday
  useEffect(() => {
    if (!cardData?.nextMarsDate) return;
    const updateCountdown = () => {
      const diff = new Date(cardData.nextMarsDate).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, sols: '0.0' });
        return;
      }
      const totalDays = diff / 86400000;
      setCountdown({
        days: Math.floor(totalDays),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        sols: (totalDays / SOL_IN_EARTH_DAYS).toFixed(1),
      });
    };
    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerId);
  }, [cardData?.nextMarsDate]);

  // Phase 1 -> Phase 2 Warp Transition Trigger
  const handleIntakeSubmit = () => {
    setIsDissolving(true);
    setPhase('warping');
  };

  // Called when hyperdrive warp finishes
  const handleWarpComplete = () => {
    setPhase('card');
    setIsDissolving(false);
    sfx.mint();

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FF4B2B', '#FF8C00', '#00F0FF', '#FFFFFF'],
      scalar: 0.85,
    });
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleToggleMusic = () => {
    if (!isMusicOn) {
      triggerStartMusic();
      return;
    }
    const isPlaying = sfx.toggleMusic();
    setIsMusicOn(isPlaying);
    sfx.click();
  };

  return (
    <div className="film-grain relative w-screen min-h-screen overflow-x-hidden bg-[#040406] text-[#E8E8EE] select-none font-sans flex flex-col justify-between">
      {/* ─── Three.js Cosmic Particle Background & Hyperdrive Warp ─── */}
      <CosmicBackground
        isWarping={phase === 'warping'}
        onWarpComplete={handleWarpComplete}
      />

      {/* ─── The One Audio Button for Space Music (Phase 1) ─── */}
      {phase !== 'card' && (
        <button
          onClick={handleToggleMusic}
          onMouseEnter={() => sfx.hoverBlip()}
          className={`fixed top-3 right-3 sm:top-5 sm:right-5 z-40 flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border backdrop-blur-2xl transition-all font-mono text-[10px] sm:text-[11px] cursor-pointer shadow-2xl active:scale-95 ${
            isMusicOn
              ? 'bg-[#0a0a14]/90 border-[#00F0FF]/30 text-white shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:border-[#00F0FF]/50'
              : 'bg-[#FF4B2B]/10 hover:bg-[#FF4B2B]/20 border-[#FF4B2B]/40 text-[#FF8C00] shadow-[0_0_20px_rgba(255,75,43,0.25)]'
          }`}
          title={isMusicOn ? 'Turn Off Space Music' : 'Turn On Space Music'}
        >
          {isMusicOn ? (
            <>
              {/* 4 Animated Equalizer bars */}
              <div className="flex items-end gap-[2px] sm:gap-[3px] h-3.5 sm:h-4 w-3 sm:w-3.5 justify-center">
                <span className="w-[1.5px] sm:w-[2px] bg-[#00F0FF] rounded-full eq-bar-1" />
                <span className="w-[1.5px] sm:w-[2px] bg-[#FF8C00] rounded-full eq-bar-2" />
                <span className="w-[1.5px] sm:w-[2px] bg-[#00F0FF] rounded-full eq-bar-3" />
                <span className="w-[1.5px] sm:w-[2px] bg-[#FF4B2B] rounded-full eq-bar-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.16em] font-bold text-white uppercase flex items-center gap-1 sm:gap-1.5">
                  FUTURISTIC BEAT <span className="text-[#00F0FF] text-[7px] sm:text-[8px] animate-pulse">● ON</span>
                </span>
                <span className="text-[7px] sm:text-[8px] tracking-[0.1em] text-neutral-400 hidden sm:inline">104 BPM // CYBER GROOVE</span>
              </div>
              <Volume2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#00F0FF] ml-0.5 sm:ml-1" />
            </>
          ) : (
            <>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#FF4B2B] animate-ping" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.16em] font-bold text-white uppercase flex items-center gap-1">
                  ▶ PLAY CYBER BEAT
                </span>
                <span className="text-[7px] sm:text-[8px] tracking-[0.1em] text-[#FF8C00] hidden sm:inline">LOW BACKGROUND SOUNDTRACK</span>
              </div>
              <VolumeX className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-neutral-400 ml-0.5 sm:ml-1" />
            </>
          )}
        </button>
      )}

      {/* ─── Phase 1: The Monolithic Intake (Starting Screen) ─── */}
      {phase !== 'card' && (
        <Phase1Intake
          name={name}
          setName={setName}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          userPhoto={userPhoto}
          setUserPhoto={setUserPhoto}
          onSubmit={handleIntakeSubmit}
          isDissolving={isDissolving}
        />
      )}

      {/* ─── Phase 2: Top Telemetry Header & Live Martian Birthday Timer ─── */}
      {phase === 'card' && (
        <header className="relative z-30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 px-3.5 py-3 sm:px-6 sm:py-5 animate-fadeup">
          {/* Left Brand Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#FF4B2B] to-[#FF8C00] shadow-[0_0_16px_rgba(255,75,43,0.4)] shrink-0">
              <Orbit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] text-white font-bold leading-tight">
                DIMV // MARS 01
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.18em] text-neutral-500 uppercase">
                OLYMPUS MONS // LIVE 3D
              </span>
            </div>
          </div>

          {/* Right: Live Ticking Martian Birthday Countdown Banner + One Audio Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
            {/* Live Ticking Countdown */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#0c0d16]/80 border border-white/10 backdrop-blur-xl shadow-lg">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF8C00] animate-spin" style={{ animationDuration: '10s' }} />
              <div className="flex items-baseline gap-0.5 sm:gap-1 font-mono text-[10px] sm:text-[11px]">
                <span className="text-neutral-400 text-[8px] sm:text-[9px] tracking-wider hidden md:inline">NEXT BDAY:</span>
                <span className="text-white font-bold">{countdown.days}D</span>
                <span className="text-neutral-500">:</span>
                <span className="text-white font-bold">{String(countdown.hours).padStart(2, '0')}H</span>
                <span className="text-neutral-500">:</span>
                <span className="text-white font-bold">{String(countdown.minutes).padStart(2, '0')}M</span>
                <span className="text-neutral-500">:</span>
                <span className="text-[#FF4B2B] font-bold">{String(countdown.seconds).padStart(2, '0')}S</span>
                <span className="text-[#FF8C00] text-[8px] sm:text-[9px] ml-1 font-semibold hidden xs:inline">({countdown.sols} SOLS)</span>
              </div>
            </div>

            {/* The One Audio Button That Toggles Space Music (Phase 2) */}
            <button
              onClick={handleToggleMusic}
              onMouseEnter={() => sfx.hoverBlip()}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border backdrop-blur-xl transition-all cursor-pointer font-mono text-[10px] sm:text-[11px] shadow-lg active:scale-95 ${
                isMusicOn
                  ? 'bg-[#0c0d16]/90 border-[#00F0FF]/30 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'bg-[#FF4B2B]/10 hover:bg-[#FF4B2B]/20 border-[#FF4B2B]/40 text-[#FF8C00]'
              }`}
              title={isMusicOn ? 'Turn Off Space Music' : 'Turn On Space Music'}
            >
              {isMusicOn ? (
                <>
                  <div className="flex items-end gap-[1.5px] sm:gap-[2px] h-2.5 sm:h-3 w-2.5 sm:w-3 justify-center">
                    <span className="w-[1.5px] bg-[#00F0FF] rounded-full eq-bar-1" />
                    <span className="w-[1.5px] bg-[#FF8C00] rounded-full eq-bar-2" />
                    <span className="w-[1.5px] bg-[#00F0FF] rounded-full eq-bar-3" />
                    <span className="w-[1.5px] bg-[#FF4B2B] rounded-full eq-bar-4" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] tracking-wider text-neutral-300 hidden sm:inline">BEAT: ON</span>
                  <Volume2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#00F0FF]" />
                </>
              ) : (
                <>
                  <span className="text-[8px] sm:text-[9px] tracking-wider text-[#FF8C00] hidden sm:inline">BEAT: OFF</span>
                  <VolumeX className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-neutral-400" />
                </>
              )}
            </button>
          </div>
        </header>
      )}

      {/* ─── Phase 2: The Original 3D MartianCard Spotlight Stage ─── */}
      {phase === 'card' && (
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-3 sm:px-4 pt-2 sm:pt-4 pb-28 sm:pb-32 animate-fadeup">
          {/* Status summary above card */}
          <div className="mb-3 sm:mb-4 text-center max-w-full">
            <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] text-[#FF8C00] uppercase mb-0.5 sm:mb-1">
              INTERPLANETARY CREDENTIAL // {cardData?.status?.badge || 'CLASS A-EXO'}
            </p>
            <h2 className="font-display-tech font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-snug">
              {cardData?.status?.title || 'PRIME MARTIAN COMMANDER'}
            </h2>
            <p className="font-mono text-[10px] sm:text-[11px] text-neutral-400 mt-1 max-w-md mx-auto px-2">
              "{cardData?.status?.tagline}"
            </p>
          </div>

          {/* The Original 3D MartianCard with tilt, holographic sheen, avatar, and rotating seal */}
          <div className="w-full max-w-[540px] my-1 sm:my-2">
            <MartianCard
              name={name}
              dob={birthDate}
              avatarUrl={userPhoto}
              planetaryData={cardData}
              isFlipped={isFlipped}
              onFlipToggle={handleFlipCard}
            />
          </div>

          <p className="font-mono text-[8px] sm:text-[9px] text-neutral-400 tracking-[0.12em] sm:tracking-[0.15em] mt-3 uppercase text-center px-2">
            Hover / Drag to tilt 3D · Tap to flip
          </p>
        </main>
      )}

      {/* ─── Phase 2: Floating HUD Controls (Bottom Glass Pill Dock) ─── */}
      {phase === 'card' && (
        <Phase2Dock
          onFlip={handleFlipCard}
          isFlipped={isFlipped}
          onOpenStory={() => setShowStoryModal(true)}
          name={name}
          setName={setName}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          userPhoto={userPhoto}
          setUserPhoto={setUserPhoto}
          cardData={cardData}
        />
      )}

      {/* ─── Story Export Modal (Manual Download, Never Auto-Download!) ─── */}
      <StoryExportModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        userData={{ name, dob: birthDate }}
        planetaryData={cardData}
        userPhotoImg={userPhotoImg}
      />
    </div>
  );
}
