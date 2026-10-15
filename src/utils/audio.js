// Web Audio API synthesizer for tactile sci-fi sound effects
// Completely client-side, zero external files, instantaneous low-latency response

class SoundFX {
  constructor() {
    this.ctx = null;
    this.musicActive = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tactile click for buttons & inputs
  click() {
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext fallback
    }
  }

  // Card flip whoosh
  flip() {
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {
      // Ignore
    }
  }

  // Mint ID holographic laser chime
  mint() {
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Chime arpeggio
      const notes = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });

      // Low frequency sub rumble
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(45, now + 0.4);

      subGain.gain.setValueAtTime(0.15, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.4);

    } catch {
      // Ignore
    }
  }

  // Scan telemetry pulse
  scan() {
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.setValueAtTime(1420, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore
    }
  }

  // Tactile hover blip
  hoverBlip() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch {}
  }

  // Deep sub-bass hyperdrive warp whoosh for Phase 1 -> Phase 2 transition
  warpWhoosh() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      
      // Sub-bass sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);

      // Noise wash for atmospheric warp
      const bufferSize = this.ctx.sampleRate * 1.0;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.4);
      filter.frequency.exponentialRampToValueAtTime(100, now + 1.1);
      filter.Q.value = 3.0;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.3);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 1.1);

      // High frequency sonic ping at arrival
      const ping = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(1320, now + 0.6);
      ping.frequency.exponentialRampToValueAtTime(440, now + 1.2);
      pingGain.gain.setValueAtTime(0.0001, now + 0.6);
      pingGain.gain.linearRampToValueAtTime(0.15, now + 0.65);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      ping.connect(pingGain);
      pingGain.connect(this.ctx.destination);
      ping.start(now + 0.6);
      ping.stop(now + 1.2);
    } catch {}
  }

  // Subtle mechanical keystroke click for typing in inputs
  typeKey() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      // Randomize pitch slightly for natural mechanical feel
      const freq = 1200 + Math.random() * 400;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch {}
  }

  // Futuristic cyber harmonic blip when selecting an avatar
  avatarSelect() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [880, 1320].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.04;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.04, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.08);
      });
    } catch {}
  }

  // Sci-fi modal aperture open swoosh
  modalOpen() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // Sci-fi modal aperture close click
  modalClose() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Calendar day select mechanical lock-in click
  calendarDay() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.setValueAtTime(700, now + 0.015);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  // ══════════════════════════════════════════════════
  // PROCEDURAL FUTURISTIC CHILL BEAT ENGINE (105 BPM)
  // Low-volume cyberpunk groove synthesized directly into an AudioBuffer:
  // Punchy electro sub-kick, cyber clap, 16th hats, funky Dorian synth bass,
  // and neo-tokyo melodic arpeggio chords.
  // ══════════════════════════════════════════════════

  _getFuturisticBeatBuffer() {
    if (this.beatBuffer && this.beatBufferSampleRate === this.ctx.sampleRate) {
      return this.beatBuffer;
    }

    const sampleRate = this.ctx.sampleRate || 44100;
    const bpm = 105;
    const numBeats = 8; // 2 bars
    const beatSec = 60 / bpm;
    const stepSec = beatSec / 4; // 16th note (~0.1428s)
    const totalDuration = beatSec * numBeats;
    const numSamples = Math.floor(totalDuration * sampleRate);

    const audioBuf = this.ctx.createBuffer(2, numSamples, sampleRate);
    const L = audioBuf.getChannelData(0);
    const R = audioBuf.getChannelData(1);

    // 1. Kick on steps 0, 8, 14, 16, 24
    const kicks = [0, 8, 14, 16, 24];
    kicks.forEach((step) => {
      const start = Math.floor(step * stepSec * sampleRate);
      const dur = Math.floor(0.18 * sampleRate);
      const isGhost = step === 14;
      const vol = isGhost ? 0.28 : 0.45;
      for (let i = 0; i < dur && start + i < numSamples; i++) {
        const t = i / sampleRate;
        const freq = 42 + 95 * Math.exp(-t * 38);
        const env = Math.exp(-t * 22);
        const val = Math.sin(2 * Math.PI * freq * t) * env * vol;
        L[start + i] += val;
        R[start + i] += val;
      }
    });

    // 2. Cyber Snare / Clap on steps 4, 12, 20, 28
    const snares = [4, 12, 20, 28];
    snares.forEach((step) => {
      const start = Math.floor(step * stepSec * sampleRate);
      const dur = Math.floor(0.14 * sampleRate);
      for (let i = 0; i < dur && start + i < numSamples; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 28) * 0.18;
        const tone = Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 35) * 0.16;
        const val = noise + tone;
        L[start + i] += val * 0.95;
        R[start + i] += val * 1.05;
      }
    });

    // 3. Cyber Hi-hat on every even 16th note
    for (let step = 0; step < 32; step += 2) {
      const start = Math.floor(step * stepSec * sampleRate);
      const dur = Math.floor(0.035 * sampleRate);
      const isAccent = step % 8 === 4;
      const vol = isAccent ? 0.09 : 0.045;
      for (let i = 0; i < dur && start + i < numSamples; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 120) * vol;
        L[start + i] += noise;
        R[start + i] += noise;
      }
    }

    // 4. Funky Synth Bassline (Dorian)
    const bassNotes = [
      { step: 0, f: 73.42 }, { step: 3, f: 73.42 }, { step: 6, f: 87.31 },
      { step: 8, f: 98.00 }, { step: 11, f: 98.00 }, { step: 14, f: 130.81 },
      { step: 16, f: 73.42 }, { step: 19, f: 73.42 }, { step: 22, f: 87.31 },
      { step: 24, f: 110.00 }, { step: 27, f: 98.00 }, { step: 30, f: 87.31 }
    ];
    bassNotes.forEach((b) => {
      const start = Math.floor(b.step * stepSec * sampleRate);
      const dur = Math.floor(0.18 * sampleRate);
      for (let i = 0; i < dur && start + i < numSamples; i++) {
        const t = i / sampleRate;
        const env = Math.exp(-t * 14);
        const phase = 2 * Math.PI * b.f * t;
        const wave = (Math.sin(phase) + 0.35 * Math.sin(phase * 2)) * env * 0.35;
        L[start + i] += wave;
        R[start + i] += wave;
      }
    });

    // 5. Neon Cyber Arpeggio (uplifting futuristic melody)
    const arpNotes = [
      { step: 2, f: 293.66 }, { step: 5, f: 349.23 }, { step: 7, f: 440.00 },
      { step: 10, f: 523.25 }, { step: 13, f: 440.00 }, { step: 15, f: 349.23 },
      { step: 18, f: 293.66 }, { step: 21, f: 392.00 }, { step: 23, f: 493.88 },
      { step: 26, f: 587.33 }, { step: 29, f: 493.88 }, { step: 31, f: 392.00 }
    ];
    arpNotes.forEach((a) => {
      const start = Math.floor(a.step * stepSec * sampleRate);
      const dur = Math.floor(0.22 * sampleRate);
      for (let i = 0; i < dur && start + i < numSamples; i++) {
        const t = i / sampleRate;
        const env = Math.exp(-t * 16);
        const val = Math.sin(2 * Math.PI * a.f * t) * env * 0.18;
        L[start + i] += val * 0.8;
        R[start + i] += val * 1.1;
      }
    });

    this.beatBuffer = audioBuf;
    this.beatBufferSampleRate = sampleRate;
    return audioBuf;
  }

  startAmbientMusic() {
    this.musicActive = true;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        if (this.musicActive && !this.ambientActive) {
          this._playBeatLoop();
        }
      }).catch(() => {});
      return;
    }

    if (!this.ambientActive) {
      this._playBeatLoop();
    } else if (this.musicMasterGain) {
      const now = this.ctx.currentTime;
      this.musicMasterGain.gain.cancelScheduledValues(now);
      this.musicMasterGain.gain.setValueAtTime(this.musicMasterGain.gain.value, now);
      this.musicMasterGain.gain.linearRampToValueAtTime(0.22, now + 0.3);
    }
  }

  _playBeatLoop() {
    if (!this.ctx || this.ambientActive || !this.musicActive) return;

    try {
      this.ambientActive = true;
      const now = this.ctx.currentTime;

      // Master Gain for music (0.22: low, crisp, comfortable background volume)
      this.musicMasterGain = this.ctx.createGain();
      this.musicMasterGain.gain.setValueAtTime(0.001, now);
      this.musicMasterGain.gain.linearRampToValueAtTime(0.22, now + 0.5);
      this.musicMasterGain.connect(this.ctx.destination);

      // Buffer Source playing the seamless 2-bar loop
      this.beatSource = this.ctx.createBufferSource();
      this.beatSource.buffer = this._getFuturisticBeatBuffer();
      this.beatSource.loop = true;
      this.beatSource.connect(this.musicMasterGain);
      this.beatSource.start(0);

    } catch (e) {
      console.warn('Futuristic beat playback error:', e);
    }
  }

  stopAmbientMusic() {
    this.musicActive = false;
    this.ambientActive = false;

    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (this.musicMasterGain) {
        this.musicMasterGain.gain.cancelScheduledValues(now);
        this.musicMasterGain.gain.setValueAtTime(this.musicMasterGain.gain.value, now);
        this.musicMasterGain.gain.linearRampToValueAtTime(0.00001, now + 0.08);
      }

      if (this.beatSource) {
        try {
          this.beatSource.stop(now + 0.09);
          setTimeout(() => {
            try {
              if (this.beatSource) this.beatSource.disconnect();
              if (this.musicMasterGain) this.musicMasterGain.disconnect();
              this.beatSource = null;
              this.musicMasterGain = null;
            } catch {}
          }, 110);
        } catch {}
      }
    } catch {}
  }

  toggleMusic() {
    if (this.musicActive) {
      this.stopAmbientMusic();
      return false;
    } else {
      this.startAmbientMusic();
      return true;
    }
  }

  toggleMute() {
    return this.toggleMusic();
  }

  // Haptic feedback if device supports
  haptic(duration = 20) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {
        // Ignore
      }
    }
  }
}

export const sfx = new SoundFX();



