import { drawCardFront } from './cardCanvasRenderer';

export function exportStoryCard(cardData, userPhotoImg) {
  const W = 1080;
  const H = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Deep Space Cosmic Background
  const bgGrad = ctx.createRadialGradient(W / 2, H * 0.45, 50, W / 2, H * 0.45, 1000);
  bgGrad.addColorStop(0, '#120f18');
  bgGrad.addColorStop(0.4, '#0a0910');
  bgGrad.addColorStop(1, '#040406');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Distant stars / dust
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let i = 0; i < 280; i++) {
    const sx = Math.sin(i * 997) * 0.5 + 0.5;
    const sy = Math.cos(i * 613) * 0.5 + 0.5;
    const r = (i % 3 === 0) ? 1.8 : 1.0;
    ctx.beginPath();
    ctx.arc(sx * W, sy * H, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Framing Border (Editorial layout)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, W - 100, H - 100);

  // Corner brackets
  const bLen = 30;
  ctx.strokeStyle = '#FF4B2B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Top Left
  ctx.moveTo(50, 50 + bLen); ctx.lineTo(50, 50); ctx.lineTo(50 + bLen, 50);
  // Top Right
  ctx.moveTo(W - 50 - bLen, 50); ctx.lineTo(W - 50, 50); ctx.lineTo(W - 50, 50 + bLen);
  // Bottom Left
  ctx.moveTo(50, H - 50 - bLen); ctx.lineTo(50, H - 50); ctx.lineTo(50 + bLen, H - 50);
  // Bottom Right
  ctx.moveTo(W - 50 - bLen, H - 50); ctx.lineTo(W - 50, H - 50); ctx.lineTo(W - 50, H - 50 - bLen);
  ctx.stroke();

  // 2. Top Header Telemetry
  ctx.fillStyle = '#FF4B2B';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('● INTERPLANETARY MOTOR VEHICLES REGISTRY // MARS 01', 90, 120);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 52px "Space Grotesk", sans-serif';
  ctx.fillText('MARTIAN DRIVER ID', 90, 185);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText('OLYMPUS MONS SECTOR // COLONIAL PASS', 90, 225);

  // 3. Giant Martian Age Banner Callout
  const bY = 280;
  ctx.fillStyle = 'rgba(255, 75, 43, 0.08)';
  ctx.strokeStyle = 'rgba(255, 75, 43, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(90, bY, W - 180, 210, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FF8C00';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('EXACT MARTIAN LIFETIME', 130, bY + 50);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 100px "Syne", "Space Grotesk", sans-serif';
  const ageDisplay = `${cardData.marsAge || '12.8'} SOLS OLD`;
  ctx.fillText(ageDisplay, 130, bY + 150);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText(`EARTH EQUIVALENT: ${cardData.earthYears || '24.2'} YEARS (${cardData.earthDays || '8840'} DAYS)`, 130, bY + 185);

  // 4. Render the 3D ID Card in the center
  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = 2048;
  cardCanvas.height = 1292;
  drawCardFront(cardCanvas, cardData, userPhotoImg);

  const cardTargetW = 900;
  const cardTargetH = 900 * (1292 / 2048); // ~ 567px
  const cardTargetX = (W - cardTargetW) / 2;
  const cardTargetY = 530;

  // Drop shadow behind card
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 30;

  // Ambient rust glow under card
  ctx.fillStyle = 'rgba(255, 75, 43, 0.2)';
  ctx.beginPath();
  ctx.roundRect(cardTargetX - 10, cardTargetY - 10, cardTargetW + 20, cardTargetH + 20, 30);
  ctx.fill();

  // Draw card image
  ctx.beginPath();
  ctx.roundRect(cardTargetX, cardTargetY, cardTargetW, cardTargetH, 24);
  ctx.clip();
  ctx.drawImage(cardCanvas, 0, 0, 2048, 1292, cardTargetX, cardTargetY, cardTargetW, cardTargetH);
  ctx.restore();

  // Rim border around card
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(cardTargetX, cardTargetY, cardTargetW, cardTargetH, 24);
  ctx.stroke();

  // 5. Operator Details Grid (Under Card)
  const oY = cardTargetY + cardTargetH + 60;

  const drawRow = (label, val, y, valCol = '#FFF') => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.fillText(label.toUpperCase(), 90, y);

    ctx.fillStyle = valCol;
    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.fillText(val, 400, y);
  };

  drawRow('OPERATOR CALLSIGN', (cardData.name || 'PILOT').toUpperCase(), oY);
  drawRow('LICENSE NUMBER', cardData.licenseNumber || 'MRS-814-992', oY + 45, '#00F0FF');
  drawRow('CLASSIFICATION', cardData.status?.title || 'PRIME MARTIAN COMMANDER', oY + 90, '#FF4B2B');
  drawRow('NEXT MARTIAN BDAY', `IN ${cardData.daysUntilNextMarsBday || '142'} EARTH DAYS`, oY + 135, '#FFD060');

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(90, oY + 175);
  ctx.lineTo(W - 90, oY + 175);
  ctx.stroke();

  // 6. Planetary Age Matrix (4 columns)
  const pY = oY + 220;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText('SOLAR SYSTEM AGE COMPARISON:', 90, pY);

  const displayPlanets = (cardData.planetaryAges || []).slice(0, 4);
  const colWidth = (W - 180) / 4;

  displayPlanets.forEach((p, idx) => {
    const cX = 90 + idx * colWidth;
    ctx.fillStyle = p.color || '#FFF';
    ctx.font = '800 28px "Space Grotesk", sans-serif';
    ctx.fillText(p.ageFormatted, cX, pY + 50);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText(`${p.symbol} ${p.name}`, cX, pY + 76);
  });

  // 7. Footer Watermark & Barcode
  const fY = H - 120;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.fillText('OLYMPUS MONS TRANSIT AUTHORITY // LAT 18°39′N LON 226°12′E', 90, fY);
  ctx.fillText('MINTED AT HTTPS://MARTIAN-ID.IO // VERIFIED COLONIAL PASS', 90, fY + 26);

  // Trigger download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const safeName = (cardData.name || 'PILOT').replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `Martian-ID-Story-${safeName}.png`;
  link.href = dataUrl;
  link.click();
}
