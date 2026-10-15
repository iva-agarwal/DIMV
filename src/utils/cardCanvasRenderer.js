// High-Resolution Procedural Texture Generator for Three.js 3D Card
// Accurately renders the iconic MartianCard layout, avatar crosshairs, typography, and telemetry

export function drawCardFront(canvas, data, userPhotoImg = null) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // 1. Background: Smoked Obsidian Polycarbonate
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0d0d15');
  bgGrad.addColorStop(0.5, '#07070b');
  bgGrad.addColorStop(1, '#050508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle scanlines across entire card
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 2);
  }

  // Outer safety line / hairline border inside the card
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // 2. Rainbow Foil Top Strip
  const stripGrad = ctx.createLinearGradient(0, 0, W, 0);
  stripGrad.addColorStop(0.00, '#FF4B2B');
  stripGrad.addColorStop(0.18, '#FF8C00');
  stripGrad.addColorStop(0.36, '#FFD060');
  stripGrad.addColorStop(0.54, '#00F0C0');
  stripGrad.addColorStop(0.72, '#0090FF');
  stripGrad.addColorStop(0.90, '#A855F7');
  stripGrad.addColorStop(1.00, '#FF4B2B');
  ctx.fillStyle = stripGrad;
  ctx.fillRect(30, 30, W - 60, 8);

  // 3. Top Row Header
  const padX = 70;
  const topY = 70;

  // Issuer Monospace Label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText('DEPT. INTERPLANETARY MOTOR VEHICLES', padX, topY + 40);

  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 38px "Space Grotesk", sans-serif';
  ctx.fillText('MARTIAN OPERATOR PERMIT', padX, topY + 86);

  // Sector Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '500 19px "JetBrains Mono", monospace';
  ctx.fillText(`SECTOR: 04 // OLYMPUS MONS // ${data.licenseNumber || 'MRS-82F-1A4'}`, padX, topY + 120);

  // Hologram Seal (Top Right)
  const sealX = W - 160;
  const sealY = topY + 70;
  drawHologramSeal(ctx, sealX, sealY, 65);

  // 4. Mid Body: Portrait (Left) + Identity (Right)
  const pX = padX;
  const pY = 240;
  const pW = 440;
  const pH = 560;

  // Portrait Box Frame
  ctx.fillStyle = '#0A0A12';
  ctx.beginPath();
  ctx.roundRect(pX, pY, pW, pH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Render Image or Cyber Avatar
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pX + 4, pY + 4, pW - 8, pH - 8, 12);
  ctx.clip();

  if (userPhotoImg && userPhotoImg.complete && userPhotoImg.naturalWidth > 0) {
    const imgRatio = userPhotoImg.naturalWidth / userPhotoImg.naturalHeight;
    const boxRatio = (pW - 8) / (pH - 8);
    let sW, sH, sX, sY;
    if (imgRatio > boxRatio) {
      sH = userPhotoImg.naturalHeight;
      sW = sH * boxRatio;
      sX = (userPhotoImg.naturalWidth - sW) / 2;
      sY = 0;
    } else {
      sW = userPhotoImg.naturalWidth;
      sH = sW / boxRatio;
      sX = 0;
      sY = (userPhotoImg.naturalHeight - sH) / 2;
    }
    ctx.drawImage(userPhotoImg, sX, sY, sW, sH, pX + 4, pY + 4, pW - 8, pH - 8);
  } else {
    // Cyber astronaut fallback
    ctx.fillStyle = '#141624';
    ctx.fillRect(pX, pY, pW, pH);

    // Helmet circle
    ctx.fillStyle = '#222538';
    ctx.beginPath();
    ctx.arc(pX + pW / 2, pY + pH * 0.42, 110, 0, Math.PI * 2);
    ctx.fill();

    // Visor gold gradient
    const vGrad = ctx.createLinearGradient(pX + 130, pY + 160, pX + 310, pY + 280);
    vGrad.addColorStop(0, '#FFD700');
    vGrad.addColorStop(0.5, '#FF8C00');
    vGrad.addColorStop(1, '#FF4B2B');
    ctx.fillStyle = vGrad;
    ctx.beginPath();
    ctx.ellipse(pX + pW / 2, pY + pH * 0.42, 75, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor gleam
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(pX + pW / 2 - 15, pY + pH * 0.42 - 15, 45, -Math.PI / 3, 0);
    ctx.stroke();

    // Suit shoulders
    ctx.fillStyle = '#2b2d42';
    ctx.beginPath();
    ctx.ellipse(pX + pW / 2, pY + pH * 0.88, 160, 90, 0, Math.PI, 0);
    ctx.fill();
  }

  // Duo-tone warm amber overlay over photo
  const photoGrad = ctx.createLinearGradient(pX, pY, pX, pY + pH);
  photoGrad.addColorStop(0, 'rgba(255, 140, 0, 0.1)');
  photoGrad.addColorStop(1, 'rgba(255, 75, 43, 0.18)');
  ctx.fillStyle = photoGrad;
  ctx.fillRect(pX + 4, pY + 4, pW - 8, pH - 8);

  // Scanlines over photo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  for (let y = pY + 4; y < pY + pH - 4; y += 6) {
    ctx.fillRect(pX + 4, y, pW - 8, 2);
  }
  ctx.restore();

  // Crosshair crop marks on corners of photo
  drawCrosshairs(ctx, pX, pY, pW, pH);

  // BIO-VER Stamp badge under photo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.beginPath();
  ctx.roundRect(pX + pW / 2 - 60, pY + pH - 32, 120, 26, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BIO-VER', pX + pW / 2, pY + pH - 15);
  ctx.textAlign = 'left';

  // 5. Identity Details (Right Column)
  const rX = 570;

  // Callsign
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText('CALLSIGN', rX, pY + 30);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px "Space Grotesk", sans-serif';
  ctx.fillText((data.name || 'PILOT UNASSIGNED').toUpperCase(), rX, pY + 82);

  // Martian Age Section
  ctx.fillStyle = '#FF8C00';
  ctx.font = '700 19px "JetBrains Mono", monospace';
  ctx.fillText('MARTIAN AGE (SOL YEARS)', rX, pY + 145);

  // Split Giant Number: Integer in White, Decimal in #FF4B2B
  const ageStr = data.marsAge ? data.marsAge.toString() : '12.8';
  const parts = ageStr.split('.');
  const intPart = parts[0] || '12';
  const decPart = '.' + (parts[1] || '8');

  ctx.font = '900 135px "Syne", "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(intPart, rX, pY + 275);
  const intWidth = ctx.measureText(intPart).width;

  ctx.fillStyle = '#FF4B2B';
  ctx.font = '900 95px "Syne", "Space Grotesk", sans-serif';
  ctx.fillText(decPart, rX + intWidth, pY + 275);
  const decWidth = ctx.measureText(decPart).width;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.fillText('SOLS', rX + intWidth + decWidth + 18, pY + 275);

  // Pulsating Emerald Status Pill
  const statusTitle = data.status?.title || 'PRIME MARTIAN COMMANDER';
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(rX + 12, pY + 322, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#10B981';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText(statusTitle.toUpperCase(), rX + 30, pY + 330);

  // Two-Column Telemetry Grid
  const tY = pY + 390;
  const colW = 340;

  const drawField = (label, val, x, y, valColor = '#FFFFFF') => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillText(label.toUpperCase(), x, y);

    ctx.fillStyle = valColor;
    ctx.font = '700 26px "Space Grotesk", sans-serif';
    ctx.fillText(val, x, y + 34);
  };

  const dobDisplay = data.birthDate ? new Date(data.birthDate + 'T00:00:00').toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase() : '14 MAY 1998';

  // Row 1
  drawField('EARTH DOB', dobDisplay, rX, tY, 'rgba(255, 255, 255, 0.85)');
  drawField('EARTH YRS', `${data.earthYears || '26.4'} YRS`, rX + colW, tY, '#FFFFFF');

  // Row 2
  drawField('SOLS LIVED', Number(data.marsSols || 9642).toLocaleString(), rX, tY + 85, '#FF8C00');
  drawField('CLASS', 'A-EXO // PILOT', rX + colW, tY + 85, '#00F0FF');

  // 6. Bottom Row: Barcode + Corner Telemetry
  const bY = H - 150;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padX, bY - 20);
  ctx.lineTo(W - padX, bY - 20);
  ctx.stroke();

  // Barcode Lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  const barPattern = [2,1,3,1,2,2,1,2,1,3,2,1,2,3,1,2,1,2,3,2,1,2,1,3,1,2,2,3,1,2,1,3,2,1,2,1,3,1,2,1,2,1,3,2,2,1,3,1];
  let curBx = padX;
  for (const bw of barPattern) {
    ctx.fillRect(curBx, bY, bw * 3, 50);
    curBx += (bw * 3) + 5;
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.fillText(`*DIMV-${data.licenseNumber || 'MRS-82F-1A4'}*`, padX, bY + 80);

  // Right Corner Telemetry
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillText('LAT 18.65°N // LON 226.2°E', W - padX, bY + 25);
  ctx.fillText('SYS_VER: 2.4.9 // GRAV: 0.376g', W - padX, bY + 55);
  ctx.textAlign = 'left';
}

export function drawCardBack(canvas, data) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0a0a10');
  bgGrad.addColorStop(0.5, '#060609');
  bgGrad.addColorStop(1, '#040407');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 2);
  }

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // Top Foil Strip (Mirrored)
  const stripGrad = ctx.createLinearGradient(0, 0, W, 0);
  stripGrad.addColorStop(0.00, '#00F0FF');
  stripGrad.addColorStop(0.25, '#A855F7');
  stripGrad.addColorStop(0.50, '#FF4B2B');
  stripGrad.addColorStop(0.75, '#FFD060');
  stripGrad.addColorStop(1.00, '#00F0FF');
  ctx.fillStyle = stripGrad;
  ctx.fillRect(30, 30, W - 60, 8);

  // Heavy Magnetic Strip across top
  const magY = 65;
  const magH = 160;
  const magGrad = ctx.createLinearGradient(0, magY, 0, magY + magH);
  magGrad.addColorStop(0, '#0A0A0E');
  magGrad.addColorStop(0.4, '#16161E');
  magGrad.addColorStop(1, '#0D0D12');
  ctx.fillStyle = magGrad;
  ctx.fillRect(30, magY, W - 60, magH);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, magY);
  ctx.lineTo(W - 30, magY);
  ctx.moveTo(30, magY + magH);
  ctx.lineTo(W - 30, magY + magH);
  ctx.stroke();

  // Track Data
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = '600 17px "JetBrains Mono", monospace';
  ctx.fillText(`ENCODED: ${data.licenseNumber || 'MRS-82F-1A4'} // CLASS A-EXO // ENCRYPTED SECTOR // ${new Date().getFullYear()}`, 70, magY + 90);

  // Body: Planetary Laser-Etched Table
  const padX = 70;
  const tY = 270;

  ctx.fillStyle = '#FF8C00';
  ctx.font = '700 19px "JetBrains Mono", monospace';
  ctx.fillText('SOLAR SYSTEM CHRONOLOGY // EARTH BASE: 365.25d', padX, tY);

  const planets = [
    { sym: '☿', name: 'MERCURY', ratio: 0.24, color: '#A0A0B0', age: (Number(data.earthYears || 26.4) / 0.24).toFixed(1) },
    { sym: '♀', name: 'VENUS',   ratio: 0.62, color: '#E3BB7B', age: (Number(data.earthYears || 26.4) / 0.62).toFixed(1) },
    { sym: '🜨', name: 'EARTH',   ratio: 1.00, color: '#4BA3E3', age: (data.earthYears || '26.4') },
    { sym: '♂', name: 'MARS',    ratio: 1.88, color: '#FF4B2B', age: (data.marsAge || '12.8'), highlight: true },
    { sym: '♃', name: 'JUPITER', ratio: 11.86, color: '#D99B66', age: (Number(data.earthYears || 26.4) / 11.86).toFixed(1) },
  ];

  const startRowY = tY + 30;
  const rowHeight = 70;

  planets.forEach((p, idx) => {
    const y = startRowY + idx * rowHeight;
    const isMars = p.highlight;

    // Row box
    ctx.fillStyle = isMars ? 'rgba(255, 75, 43, 0.12)' : 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(padX, y, W - padX * 2, 54, 8);
    ctx.fill();

    ctx.strokeStyle = isMars ? 'rgba(255, 75, 43, 0.45)' : 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = isMars ? 2 : 1;
    ctx.stroke();

    // Planet Symbol & Name
    ctx.fillStyle = p.color;
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillText(p.sym, padX + 25, y + 36);

    ctx.fillStyle = isMars ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillText(p.name, padX + 75, y + 36);

    // Planet Age
    ctx.textAlign = 'right';
    ctx.fillStyle = isMars ? '#FF4B2B' : 'rgba(255, 255, 255, 0.85)';
    ctx.font = '900 28px "Space Grotesk", sans-serif';
    ctx.fillText(`${p.age}`, W - padX - 85, y + 38);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillText('YRS', W - padX - 30, y + 37);
    ctx.textAlign = 'left';
  });

  // Bottom Row: Donor Badge + Biometric Signature
  const bY = H - 180;

  // Organ Donor Badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(padX, bY, 320, 85, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Heart Icon
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(padX + 45, bY + 38, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillText('ORGAN DONOR', padX + 80, bY + 35);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 18px "JetBrains Mono", monospace';
  ctx.fillText('CYBORG / SYNTH-OK', padX + 80, bY + 62);

  // Biometric Signature (Right)
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillText('BIOMETRIC SIG.', W - padX, bY + 20);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'italic 700 32px "Space Grotesk", sans-serif';
  ctx.fillText(data.name || 'Alex Vance', W - padX, bY + 58);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.fillText('GRAVITY ACCLIMATION: 0.376g CERTIFIED', W - padX, bY + 84);
  ctx.textAlign = 'left';
}

// Helper: Rotating Hologram Seal
function drawHologramSeal(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);

  // Outer circle with dashed orange ring
  ctx.strokeStyle = '#FF8C00';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.stroke();

  // Inner amber counter-ring
  ctx.strokeStyle = 'rgba(255, 208, 96, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Core Mars Planetary Emblem
  ctx.fillStyle = 'rgba(255, 75, 43, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FF4B2B';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Internal crater
  ctx.strokeStyle = '#FF8C00';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-4, -4, 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Helper: Crosshairs crop marks
function drawCrosshairs(ctx, x, y, w, h) {
  const len = 16;
  ctx.strokeStyle = 'rgba(255, 200, 80, 0.85)';
  ctx.lineWidth = 2;

  // Top-left
  ctx.beginPath(); ctx.moveTo(x - 2, y + len); ctx.lineTo(x - 2, y - 2); ctx.lineTo(x + len, y - 2); ctx.stroke();
  // Top-right
  ctx.beginPath(); ctx.moveTo(x + w + 2 - len, y - 2); ctx.lineTo(x + w + 2, y - 2); ctx.lineTo(x + w + 2, y + len); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(x - 2, y + h - len); ctx.lineTo(x - 2, y + h + 2); ctx.lineTo(x + len, y + h + 2); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(x + w + 2 - len, y + h + 2); ctx.lineTo(x + w + 2, y + h + 2); ctx.lineTo(x + w + 2, y + h - len); ctx.stroke();
}
