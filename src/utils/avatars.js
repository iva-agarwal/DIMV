// Procedural Cyberpunk Avatar Presets & Filters

export const PRESET_AVATARS = [
  {
    id: 'helmet-gold',
    name: 'EVA HELMET // GOLD VISOR',
    tag: 'EXPLORER',
    svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill="#0C0C12"/>
      <circle cx="60" cy="55" r="38" fill="#181824" stroke="#FF4B2B" stroke-width="2"/>
      <ellipse cx="60" cy="53" rx="26" ry="20" fill="url(#goldGrad)"/>
      <path d="M42 53 Q60 46 78 53" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      <rect x="36" y="86" width="48" height="34" rx="10" fill="#222232" stroke="#444" stroke-width="1.5"/>
      <rect x="52" y="90" width="16" height="8" rx="2" fill="#FF4B2B" opacity="0.9"/>
      <circle cx="28" cy="56" r="4" fill="#FF4B2B"/>
      <circle cx="92" cy="56" r="4" fill="#FF8C00"/>
      <defs>
        <linearGradient id="goldGrad" x1="34" y1="33" x2="86" y2="73" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFD700"/>
          <stop offset="0.4" stop-color="#FF8C00"/>
          <stop offset="1" stop-color="#FF4B2B"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    id: 'cyborg-ocular',
    name: 'CYBORG // NEURAL OCULAR',
    tag: 'AUGMENTED',
    svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill="#0A0B10"/>
      <path d="M38 40 C38 25, 82 25, 82 40 C82 65, 75 88, 60 96 C45 88, 38 65, 38 40 Z" fill="#1C1D2A" stroke="#33384A" stroke-width="2"/>
      <!-- Cyber eye -->
      <circle cx="70" cy="50" r="10" fill="#060608" stroke="#00F0FF" stroke-width="2.5"/>
      <circle cx="70" cy="50" r="4" fill="#00F0FF"/>
      <circle cx="50" cy="50" r="5" fill="#444"/>
      <!-- Neural temple jack -->
      <path d="M78 48 L94 48 L98 56" stroke="#00F0FF" stroke-width="2" stroke-linecap="round"/>
      <rect x="94" y="45" width="6" height="6" fill="#00F0FF"/>
      <!-- Mouth breather -->
      <rect x="52" y="72" width="16" height="10" rx="3" fill="#0B0D14" stroke="#FF4B2B" stroke-width="1.5"/>
      <line x1="56" y1="77" x2="64" y2="77" stroke="#FF4B2B"/>
      <!-- Neck -->
      <path d="M48 94 L42 120 L78 120 L72 94 Z" fill="#141520"/>
    </svg>`
  },
  {
    id: 'tactical-pilot',
    name: 'ROVER PILOT // HUD MASK',
    tag: 'TACTICAL',
    svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill="#0D0908"/>
      <circle cx="60" cy="52" r="36" fill="#1D1514" stroke="#FF4B2B" stroke-width="2"/>
      <path d="M34 50 L86 50 L80 64 L40 64 Z" fill="#FF4B2B" fill-opacity="0.2" stroke="#FF4B2B" stroke-width="2"/>
      <!-- HUD markings -->
      <line x1="44" y1="57" x2="76" y2="57" stroke="#FF8C00" stroke-width="1" stroke-dasharray="2 2"/>
      <circle cx="60" cy="57" r="2" fill="#FFF"/>
      <!-- Mask respiration -->
      <rect x="46" y="70" width="28" height="20" rx="6" fill="#2D1C1A" stroke="#FF4B2B" stroke-width="1.5"/>
      <circle cx="53" cy="80" r="3" fill="#FF8C00"/>
      <circle cx="67" cy="80" r="3" fill="#FF8C00"/>
      <path d="M30 92 L20 120 L100 120 L90 92 Z" fill="#1F1514"/>
    </svg>`
  },
  {
    id: 'deep-space-spec',
    name: 'SOLAR RECON // CHROMATIC',
    tag: 'DEEP SPACE',
    svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" fill="#080812"/>
      <circle cx="60" cy="54" r="36" fill="#12132A" stroke="#A855F7" stroke-width="2"/>
      <path d="M36 52 C36 42, 84 42, 84 52 C84 68, 60 76, 60 76 C60 76, 36 68, 36 52 Z" fill="url(#violetGlow)"/>
      <line x1="42" y1="52" x2="78" y2="52" stroke="#E9D5FF" stroke-width="1.5"/>
      <circle cx="60" cy="52" r="4" fill="#FFF"/>
      <path d="M40 92 L30 120 L90 120 L80 92 Z" fill="#1B1C38"/>
      <defs>
        <linearGradient id="violetGlow" x1="36" y1="42" x2="84" y2="76" gradientUnits="userSpaceOnUse">
          <stop stop-color="#C084FC"/>
          <stop offset="0.5" stop-color="#9333EA"/>
          <stop offset="1" stop-color="#3B82F6"/>
        </linearGradient>
      </defs>
    </svg>`
  }
];

export function getPresetAvatarDataUrl(presetIndex = 0) {
  const preset = PRESET_AVATARS[presetIndex] || PRESET_AVATARS[0];
  const encoded = encodeURIComponent(preset.svg);
  return `data:image/svg+xml;utf8,${encoded}`;
}

// Client-side image filter engine using HTML Canvas
export function applyCyberFilter(imageSrc, filterType = 'cyber-dither', callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Draw cover image cropped to square
    const minDim = Math.min(img.width, img.height);
    const sx = (img.width - minDim) / 2;
    const sy = (img.height - minDim) / 2;
    ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    if (filterType === 'cyber-dither') {
      // High contrast Martian Rust Dither
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const x = (i / 4) % size;
        const y = Math.floor((i / 4) / size);
        const threshold = ((x % 3) + (y % 3) * 3) * 28; // Bayer-like matrix approximation

        if (gray > threshold) {
          // Rust-orange highlight
          data[i] = 255;
          data[i + 1] = Math.min(255, 140 + (gray * 0.4));
          data[i + 2] = Math.floor(gray * 0.3);
        } else {
          // Obsidian shadow
          data[i] = 16;
          data[i + 1] = 14;
          data[i + 2] = 22;
        }
      }
    } else if (filterType === 'holographic') {
      // Chromatic shift + Cyan glow
      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = Math.min(255, gray * 0.4 + 40);       // Red reduced
        data[i + 1] = Math.min(255, gray * 1.1 + 30);    // Green/cyan high
        data[i + 2] = Math.min(255, gray * 1.3 + 80);    // Blue/cyan boost
      }
    } else if (filterType === 'monochrome') {
      // High contrast stark cyber black & white
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const val = gray > 110 ? Math.min(255, gray * 1.25) : gray * 0.6;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Add subtle grid scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let y = 0; y < size; y += 4) {
      ctx.fillRect(0, y, size, 2);
    }

    callback(canvas.toDataURL('image/png'));
  };
  img.src = imageSrc;
}
