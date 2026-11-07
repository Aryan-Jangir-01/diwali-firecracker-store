import * as THREE from 'three';

// Procedural 1024x1024 Rangoli Canvas Texture for the celebration courtyard
export function createRangoliTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Background courtyard tile
  ctx.fillStyle = '#0f0c22';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle marble / stone tile grid
  ctx.strokeStyle = '#1f193f';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, 1024, 1024);

  const cx = 512, cy = 512;

  // Outer glowing ring
  const grad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 480);
  grad.addColorStop(0, '#ff990022');
  grad.addColorStop(0.5, '#ff336615');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 480, 0, Math.PI * 2);
  ctx.fill();

  // Rangoli layers
  const rings = [
    { r: 450, color: '#f59e0b', width: 5, dash: [15, 10] },
    { r: 420, color: '#f43f5e', width: 8, dash: [] },
    { r: 380, color: '#fbbf24', width: 4, dash: [10, 8] },
    { r: 330, color: '#ec4899', width: 6, dash: [] },
    { r: 260, color: '#fbbf24', width: 5, dash: [] },
    { r: 190, color: '#ef4444', width: 4, dash: [8, 6] },
    { r: 120, color: '#f59e0b', width: 6, dash: [] },
    { r: 60, color: '#ffffff', width: 4, dash: [] },
  ];

  rings.forEach(({ r, color, width, dash }) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Draw 16 decorative lotus petals
  const numPetals = 16;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i * Math.PI * 2) / numPetals;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Outer Petal
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.quadraticCurveTo(45, 340, 0, 420);
    ctx.quadraticCurveTo(-45, 340, 0, 260);
    ctx.fillStyle = i % 2 === 0 ? '#f59e0be6' : '#f43f5ee6';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner Petal
    ctx.beginPath();
    ctx.moveTo(0, 120);
    ctx.quadraticCurveTo(25, 170, 0, 220);
    ctx.quadraticCurveTo(-25, 170, 0, 120);
    ctx.fillStyle = i % 2 === 0 ? '#f43f5e' : '#fbbf24';
    ctx.fill();

    // Diya motif at petal tip
    ctx.beginPath();
    ctx.arc(0, 435, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffedd5';
    ctx.fill();

    ctx.restore();
  }

  // Center star mandala
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI * 2) / 16;
    const rad = i % 2 === 0 ? 55 : 28;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Radiant incandescent firework star with pure white core and hot corona
export function createFireworkStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64, cy = 64;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 64);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.15, 'rgba(255, 250, 230, 0.98)');
  grad.addColorStop(0.35, 'rgba(255, 215, 120, 0.7)');
  grad.addColorStop(0.65, 'rgba(255, 140, 20, 0.25)');
  grad.addColorStop(1, 'rgba(255, 80, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  // Cross flare rays
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, 10);
  ctx.lineTo(cx, 118);
  ctx.moveTo(10, cy);
  ctx.lineTo(118, cy);
  ctx.stroke();

  // Diagonal faint rays
  ctx.strokeStyle = 'rgba(255, 230, 150, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(25, 25);
  ctx.lineTo(103, 103);
  ctx.moveTo(103, 25);
  ctx.lineTo(25, 103);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Soft organic smoke puff texture for explosion aftermath and rocket trails
export function createSmokeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64, cy = 64;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  grad.addColorStop(0, 'rgba(210, 200, 230, 0.65)');
  grad.addColorStop(0.35, 'rgba(180, 170, 210, 0.35)');
  grad.addColorStop(0.7, 'rgba(140, 130, 180, 0.1)');
  grad.addColorStop(1, 'rgba(100, 90, 150, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Expanding shockwave ring texture for ground bomb blasts
export function createShockwaveTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const cx = 128, cy = 128;

  const grad = ctx.createRadialGradient(cx, cy, 70, cx, cy, 120);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  grad.addColorStop(0.65, 'rgba(255, 240, 180, 0.9)');
  grad.addColorStop(0.85, 'rgba(255, 160, 40, 0.7)');
  grad.addColorStop(1, 'rgba(255, 60, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Sparkle star texture
export function createSparkleTexture() {
  return createFireworkStarTexture();
}

// Jute / Twine texture for Sutli Bomb
export function createJuteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1e3a1e';
  ctx.fillRect(0, 0, 256, 256);

  ctx.lineWidth = 3;
  for (let y = 0; y < 256; y += 6) {
    ctx.strokeStyle = y % 12 === 0 ? '#2d5a2d' : '#142914';
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y + (Math.sin(y) * 4));
    ctx.stroke();
  }

  for (let x = 0; x < 256; x += 8) {
    ctx.strokeStyle = x % 16 === 0 ? '#386638' : '#1b331b';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.cos(x) * 4), 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Festive Wrapper texture
export function createFestiveWrapperTexture(baseColorHex = '#d92626') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 10;
  for (let i = -512; i < 1024; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
  }

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(0, 10, 512, 8);
  ctx.fillRect(0, 120, 512, 16);
  ctx.fillRect(0, 238, 512, 8);

  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIWALI SPECIAL ✦ 2026', 256, 134);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}
