/**
 * Boss Mỹ Nhi (Người Yêu Cũ - Set Son 500K) Sprite & Flower Attack Renderer
 * - Phase 1 (Hình 1 & 2): Váy cưới trắng tinh khôi, cầm bó hoa hồng phấn, phóng Hoa Hồng Phấn (Basic Attack) & Bão Gai Hoa Hồng (Flower Barrage).
 * - Phase 2 (Hình 3 & 4 - Sau khi hết 100% máu đầu sẽ HỒI SINH HÓA ĐIÊN):
 *   Mắt đỏ rực lửa hận tình, váy trắng vấy máu đỏ, aura hắc ám đỏ thẫm, phóng Hoa Hồng Đẫm Máu (Blood Flower Projectile) & Đại Địa Chấn Gai Máu (Blood Thorn Barrage).
 */

import { BossAttack } from '../types/game';

export interface MyNhiRenderOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  facing: 'left' | 'right';
  state: string;
  animTimer: number;
  invulnerableTimer: number;
  isEnraged?: boolean; // true = Phase 2 (Blood Rose Form)
  hp?: number;
  maxHp?: number;
  dialogueBubble?: {
    text: string;
    timer: number;
  };
}

export function drawBossMyNhi(ctx: CanvasRenderingContext2D, opt: MyNhiRenderOptions) {
  const {
    x,
    y,
    width,
    height,
    facing,
    state,
    animTimer,
    invulnerableTimer,
    isEnraged = false,
    hp = 100,
    maxHp = 100,
    dialogueBubble,
  } = opt;

  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  // Blinking when taking damage
  if (invulnerableTimer > 0 && Math.floor(animTimer * 24) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  const cx = width / 2;
  const isDefeated = state === 'defeated';
  const isCasting =
    state === 'rose_throw' ||
    state === 'flower_barrage' ||
    state === 'blood_flower_throw' ||
    state === 'blood_thorn_barrage';

  // Ground shadow
  ctx.fillStyle = isEnraged ? 'rgba(153, 27, 27, 0.55)' : 'rgba(15, 23, 42, 0.4)';
  ctx.beginPath();
  ctx.ellipse(cx, height - 3, 28, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // ==========================================
  // 1. AURA EFFECTS (Hình 2 Ultimate Cast / Hình 3 & 4 Blood Aura)
  // ==========================================
  if (isEnraged && !isDefeated) {
    // Dark crimson swirling flames at feet & around body (Hình 3 & 4)
    ctx.save();
    for (let i = 0; i < 7; i++) {
      const flameAngle = animTimer * 6 + i * 0.9;
      const fx = cx + Math.sin(flameAngle) * 26;
      const fy = height - 10 - ((animTimer * 45 + i * 14) % (height + 8));
      const r = 6 + Math.sin(animTimer * 12 + i) * 3;

      ctx.fillStyle = i % 2 === 0 ? 'rgba(220, 38, 38, 0.55)' : 'rgba(69, 10, 10, 0.65)';
      ctx.beginPath();
      ctx.arc(fx, fy, Math.max(2, r), 0, Math.PI * 2);
      ctx.fill();
    }

    // Dark blood vortex ring under dress
    ctx.strokeStyle = 'rgba(185, 28, 28, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, height - 6, 34 + Math.sin(animTimer * 10) * 4, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (isCasting && !isDefeated) {
    // Golden-white wind cast aura (Hình 2 Ultimate Cast)
    ctx.save();
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, height * 0.5, 36 + Math.sin(animTimer * 15) * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Flip horizontally according to facing
  ctx.save();
  if (facing === 'left') {
    ctx.scale(-1, 1);
    ctx.translate(-width, 0);
  }

  const walkBob = state === 'patrol' || state === 'idle' ? Math.sin(animTimer * 7) * 2 : 0;
  const hairWind = isEnraged || isCasting ? Math.sin(animTimer * 14) * 5 : Math.sin(animTimer * 4) * 1.5;

  // ==========================================
  // 2. LONG FLOWING BLACK HAIR (BACK LAYER)
  // ==========================================
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.moveTo(cx - 16, 12 + walkBob);
  ctx.quadraticCurveTo(cx - 26 - hairWind, 38 + walkBob, cx - 20 - hairWind, 58 + walkBob);
  ctx.lineTo(cx + 16, 56 + walkBob);
  ctx.quadraticCurveTo(cx + 22, 34 + walkBob, cx + 15, 12 + walkBob);
  ctx.closePath();
  ctx.fill();

  // ==========================================
  // 3. WHITE LACE GOWN / DRESS (Hình 1 vs Hình 3 Blood-Stained)
  // ==========================================
  // Shoes (White heels)
  const stepOff = state === 'patrol' ? Math.sin(animTimer * 10) * 4 : 0;
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(cx - 10 + stepOff, height - 8, 8, 6);
  ctx.fillRect(cx + 4 - stepOff, height - 8, 8, 6);
  ctx.fillStyle = isEnraged ? '#991B1B' : '#CBD5E1';
  ctx.fillRect(cx - 10 + stepOff, height - 4, 8, 2);
  ctx.fillRect(cx + 4 - stepOff, height - 4, 8, 2);

  // Flowing A-line White Gown Skirt
  const dressGrad = ctx.createLinearGradient(cx, 34 + walkBob, cx, height - 8);
  dressGrad.addColorStop(0, '#FFFFFF');
  dressGrad.addColorStop(0.7, '#F8FAFC');
  dressGrad.addColorStop(1, isEnraged ? '#FECACA' : '#E2E8F0');

  ctx.fillStyle = dressGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 11, 36 + walkBob);
  ctx.lineTo(cx + 11, 36 + walkBob);
  ctx.quadraticCurveTo(cx + 22, 62 + walkBob, cx + 24, height - 8);
  ctx.lineTo(cx - 22, height - 8);
  ctx.quadraticCurveTo(cx - 20, 62 + walkBob, cx - 11, 36 + walkBob);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = isEnraged ? '#991B1B' : '#CBD5E1';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Lace pattern details on dress
  ctx.fillStyle = 'rgba(203, 213, 225, 0.5)';
  for (let ly = 46; ly < height - 14; ly += 10) {
    ctx.fillRect(cx - 8, ly + walkBob, 3, 3);
    ctx.fillRect(cx + 4, ly + walkBob, 3, 3);
  }

  // Blood splatters on dress hem in Phase 2 (Hình 3 & 4)
  if (isEnraged && !isDefeated) {
    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.moveTo(cx - 21, height - 8);
    ctx.lineTo(cx - 14, height - 24);
    ctx.lineTo(cx - 8, height - 8);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 2, height - 8);
    ctx.lineTo(cx + 9, height - 28);
    ctx.lineTo(cx + 18, height - 8);
    ctx.fill();

    ctx.fillStyle = '#DC2626';
    ctx.fillRect(cx - 6, height - 34 + walkBob, 4, 9);
    ctx.fillRect(cx + 8, height - 42 + walkBob, 3, 7);
  }

  // Bodice & Puff Sleeves
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(cx - 11, 24 + walkBob, 22, 14);
  // Puff shoulders
  ctx.beginPath();
  ctx.arc(cx - 12, 27 + walkBob, 5.5, 0, Math.PI * 2);
  ctx.arc(cx + 12, 27 + walkBob, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // ==========================================
  // 4. HEAD, FACE & EXPRESSIONS (Hình 1 Gentle vs Hình 3 Enraged Red Eyes)
  // ==========================================
  // Neck
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(cx - 3, 19 + walkBob, 6, 6);

  // Face
  ctx.fillStyle = '#FFEDD5';
  ctx.beginPath();
  ctx.arc(cx, 12 + walkBob, 11, 0, Math.PI * 2);
  ctx.fill();

  // Front hair bangs framing face
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(cx, 9 + walkBob, 12, Math.PI * 0.85, Math.PI * 2.15);
  ctx.fill();
  // Side locks
  ctx.fillRect(cx - 12, 9 + walkBob, 4, 16);
  ctx.fillRect(cx + 8, 9 + walkBob, 4, 14);

  if (isEnraged && !isDefeated) {
    // Phase 2: Glowing Blood-Red Eyes, Angry Vein Mark & Fierce Mouth (Hình 3)
    // Red glowing eyes
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(cx - 6, 10 + walkBob, 4, 3.5);
    ctx.fillRect(cx + 3, 10 + walkBob, 4, 3.5);
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(cx - 5, 11 + walkBob, 1.5, 1.5);
    ctx.fillRect(cx + 4, 11 + walkBob, 1.5, 1.5);

    // Furrowed angry eyebrows
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx - 8, 8 + walkBob);
    ctx.lineTo(cx - 2, 10 + walkBob);
    ctx.moveTo(cx + 8, 8 + walkBob);
    ctx.lineTo(cx + 2, 10 + walkBob);
    ctx.stroke();

    // Red anger vein symbol (💢) on hair (Hình 3)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.6;
    const vx = cx + 8;
    const vy = 4 + walkBob;
    ctx.beginPath();
    ctx.moveTo(vx - 3, vy - 3);
    ctx.lineTo(vx + 3, vy + 3);
    ctx.moveTo(vx + 3, vy - 3);
    ctx.lineTo(vx - 3, vy + 3);
    ctx.stroke();

    // Angry shouting mouth
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(cx - 3, 16 + walkBob, 6, 3);
  } else {
    // Phase 1 or Redeemed: Pretty dark eyes, rosy cheeks & lipstick (Set son 500k!)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(cx - 6, 10 + walkBob, 3, 3.5);
    ctx.fillRect(cx + 3, 10 + walkBob, 3, 3.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 5.5, 10.5 + walkBob, 1.2, 1.2);
    ctx.fillRect(cx + 3.5, 10.5 + walkBob, 1.2, 1.2);

    // Soft blush
    ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.fillRect(cx - 8, 13 + walkBob, 3, 2);
    ctx.fillRect(cx + 5, 13 + walkBob, 3, 2);

    // 500k Rose Lipstick smile
    ctx.fillStyle = '#E11D48';
    ctx.fillRect(cx - 2, 16 + walkBob, 4, 2);
  }

  // ==========================================
  // 5. ARMS & ROSE BOUQUET (Hình 1 Pink Bouquet vs Hình 4 Blood Bouquet)
  // ==========================================
  if (isCasting && !isDefeated) {
    // Outstretched casting arm throwing roses forward (Hình 2 & Hình 4)
    ctx.fillStyle = '#FFEDD5';
    ctx.fillRect(cx + 10, 26 + walkBob, 18, 5);

    // Bouquet held in left arm
    drawRoseBouquet(ctx, cx + 6, 34 + walkBob, isEnraged);
  } else {
    // Holding large bouquet of roses gracefully in front (Hình 1 & Hình 3)
    ctx.fillStyle = '#FFEDD5';
    ctx.fillRect(cx - 13, 28 + walkBob, 6, 12);
    ctx.fillRect(cx + 8, 28 + walkBob, 6, 12);

    drawRoseBouquet(ctx, cx + 4, 34 + walkBob, isEnraged);
  }

  ctx.restore(); // Undo horizontal flip

  // ==========================================
  // 6. FLOATING BOSS HEALTH BAR & DIALOGUE BUBBLE
  // ==========================================
  const barW = 108;
  const barH = 9;
  const barX = cx - barW / 2;
  const barY = -26;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, 4);
  ctx.fill();

  const pct = Math.max(0, Math.min(1, hp / maxHp));
  const hpGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  if (isEnraged) {
    hpGrad.addColorStop(0, '#991B1B');
    hpGrad.addColorStop(0.5, '#DC2626');
    hpGrad.addColorStop(1, '#F43F5E');
  } else {
    hpGrad.addColorStop(0, '#EC4899');
    hpGrad.addColorStop(1, '#F472B6');
  }

  ctx.fillStyle = hpGrad;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW * pct, barH, 3);
  ctx.fill();

  ctx.fillStyle = isEnraged ? '#FCA5A5' : '#FBCFE8';
  ctx.font = '900 9px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  const title = isEnraged
    ? `🔥 MỸ NHI (HÓA ĐIÊN - DẠNG 2) ${Math.ceil(hp)}/${maxHp}`
    : `🌹 MỸ NHI (NGƯỜI YÊU CŨ) ${Math.ceil(hp)}/${maxHp}`;
  ctx.fillText(title, cx, barY - 5);

  if (dialogueBubble && dialogueBubble.timer > 0) {
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    const textW = ctx.measureText(dialogueBubble.text).width;
    const bW = Math.max(110, textW + 18);
    const bH = 24;
    const bX = cx - bW / 2;
    const bY = barY - 42;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = isEnraged ? '#EF4444' : '#F472B6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bX, bY, bW, bH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isEnraged ? '#FCA5A5' : '#FCE7F3';
    ctx.fillText(dialogueBubble.text, cx, bY + 16);
  }
  ctx.restore();

  ctx.restore();
}

function drawRoseBouquet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isBloodForm: boolean
) {
  ctx.save();
  ctx.translate(x, y);

  // White wrapping paper cone
  ctx.fillStyle = isBloodForm ? '#FECACA' : '#FFF1F2';
  ctx.beginPath();
  ctx.moveTo(-10, -4);
  ctx.lineTo(10, -4);
  ctx.lineTo(2, 14);
  ctx.lineTo(-4, 14);
  ctx.closePath();
  ctx.fill();

  // Ribbon bow
  ctx.fillStyle = isBloodForm ? '#991B1B' : '#F43F5E';
  ctx.fillRect(-4, 5, 7, 3);

  // Green leaves
  ctx.fillStyle = isBloodForm ? '#14532D' : '#16A34A';
  ctx.beginPath();
  ctx.arc(-8, -6, 4, 0, Math.PI * 2);
  ctx.arc(8, -6, 4, 0, Math.PI * 2);
  ctx.arc(0, -10, 4, 0, Math.PI * 2);
  ctx.fill();

  // Rose blossoms cluster
  const roseColor = isBloodForm ? '#DC2626' : '#FB7185';
  const coreColor = isBloodForm ? '#7F1D1D' : '#E11D48';
  const positions = [
    [-5, -6],
    [5, -6],
    [0, -9],
    [-2, -3],
    [4, -2],
  ];
  for (const [rx, ry] of positions) {
    ctx.fillStyle = roseColor;
    ctx.beginPath();
    ctx.arc(rx, ry, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = coreColor;
    ctx.beginPath();
    ctx.arc(rx, ry, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw Flower Projectile / Blood Flower Projectile / Thorn Barrage (Hình 2 & Hình 4)
 */
export function drawMyNhiFlowerProjectile(ctx: CanvasRenderingContext2D, atk: BossAttack) {
  ctx.save();
  ctx.translate(atk.width / 2, atk.height / 2);
  if (atk.rotation !== undefined) {
    ctx.rotate(atk.rotation);
  }

  const isBlood = atk.type === 'blood_flower' || atk.type === 'blood_thorn_wave';
  const isBarrage = atk.type === 'flower_barrage' || atk.type === 'blood_thorn_wave';

  // Glowing aura around flower
  ctx.fillStyle = isBlood ? 'rgba(220, 38, 38, 0.35)' : 'rgba(244, 114, 182, 0.3)';
  ctx.beginPath();
  ctx.arc(0, 0, isBarrage ? 18 : 14, 0, Math.PI * 2);
  ctx.fill();

  // Thorny green stem
  ctx.strokeStyle = isBlood ? '#14532D' : '#15803D';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14, 6);
  ctx.lineTo(8, -4);
  ctx.stroke();

  // Sharp thorns along stem
  ctx.fillStyle = isBlood ? '#991B1B' : '#166534';
  ctx.beginPath();
  ctx.moveTo(-8, 3);
  ctx.lineTo(-11, -2);
  ctx.lineTo(-5, 1);
  ctx.fill();

  // Leaves
  ctx.fillStyle = isBlood ? '#166534' : '#22C55E';
  ctx.beginPath();
  ctx.ellipse(-6, 5, 5, 2.5, 0.5, 0, Math.PI * 2);
  ctx.ellipse(-2, -3, 5, 2.5, -0.6, 0, Math.PI * 2);
  ctx.fill();

  // Rose Blossom Head
  ctx.fillStyle = isBlood ? '#DC2626' : '#FB7185';
  ctx.beginPath();
  ctx.arc(8, -5, 8, 0, Math.PI * 2);
  ctx.fill();

  // Inner spiral petals
  ctx.fillStyle = isBlood ? '#7F1D1D' : '#E11D48';
  ctx.beginPath();
  ctx.arc(8, -5, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isBlood ? '#FCA5A5' : '#FFE4E6';
  ctx.beginPath();
  ctx.arc(7, -6, 2, 0, Math.PI * 2);
  ctx.fill();

  // If Blood Flower (Hình 4): dripping crimson droplets & blood trail
  if (isBlood) {
    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.arc(6, 5, 2.2, 0, Math.PI * 2);
    ctx.arc(11, 4, 1.8, 0, Math.PI * 2);
    ctx.arc(-12, 8, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // If Barrage (Hình 2 Flower Barrage / Hình 4 Blood Thorn Barrage): extra flying petals & thorns
  if (isBarrage) {
    ctx.fillStyle = isBlood ? '#EF4444' : '#F472B6';
    ctx.beginPath();
    ctx.ellipse(-15, -6, 4, 2, 0.4, 0, Math.PI * 2);
    ctx.ellipse(2, 9, 4, 2, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}