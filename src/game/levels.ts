import { LevelData, Platform, EnemyOtter, Collectible, Boss } from '../types/game';

export const createLevel1 = (): LevelData => {
  const width = 3400;
  const height = 600;

  // Platforms for Sông Buông
  const platforms: Platform[] = [
    // Starting riverbank ground (Village with thatched stilt cottages & palm trees)
    { x: 0, y: 500, width: 640, height: 100, type: 'ground' },

    // Thatched house porches & wooden steps
    { x: 110, y: 390, width: 90, height: 18, type: 'brick' },
    { x: 280, y: 360, width: 100, height: 18, type: 'brick' },

    // Center-left: Iconic Elevated Watchtower / Diving Board Platform with bamboo ladder
    { x: 680, y: 400, width: 130, height: 20, type: 'brick' },

    // Floating water hyacinth raft (Moving platform over river water)
    {
      x: 860,
      y: 470,
      width: 100,
      height: 25,
      type: 'hyacinth_raft',
      isMoving: true,
      minX: 840,
      maxX: 980,
      speed: 1.2,
      direction: 1,
    },

    // The iconic CẦU SÔNG BUÔNG (Bamboo & Wooden River Bridge with V-pilings)
    { x: 1020, y: 450, width: 100, height: 150, type: 'bridge_wood' }, // Bridge ascent
    { x: 1120, y: 410, width: 420, height: 190, type: 'bridge_wood' }, // Bridge main span across river
    { x: 1540, y: 450, width: 100, height: 150, type: 'bridge_wood' }, // Bridge descent

    // Central riverbank island with stilt cottage & coconut palms
    { x: 1680, y: 490, width: 540, height: 110, type: 'ground' },
    { x: 1780, y: 390, width: 110, height: 20, type: 'brick' }, // Island house porch
    { x: 1940, y: 330, width: 80, height: 20, type: 'brick' },

    // Mid-river water gap with floating lily raft & bamboo stepping pole
    {
      x: 2260,
      y: 460,
      width: 100,
      height: 25,
      type: 'hyacinth_raft',
      isMoving: true,
      minX: 2240,
      maxX: 2420,
      speed: 1.4,
      direction: 1,
    },
    { x: 2460, y: 420, width: 80, height: 180, type: 'bamboo_pole' },

    // Final riverbank stretch towards town gateway
    { x: 2580, y: 480, width: 820, height: 120, type: 'ground' },
    { x: 2760, y: 380, width: 130, height: 24, type: 'brick' },
    { x: 2980, y: 310, width: 120, height: 24, type: 'brick' },
  ];

  // Enemies: Mischievous otters (Rái cá Sông Buông)
  const enemies: EnemyOtter[] = [
    {
      id: 'otter-1',
      x: 360,
      y: 460,
      vx: -1.2,
      vy: 0,
      width: 44,
      height: 36,
      startX: 360,
      patrolDistance: 130,
      facing: 'left',
      state: 'alive',
      squishTimer: 0,
      animTimer: 0,
    },
    {
      id: 'otter-2',
      x: 520,
      y: 460,
      vx: 1.3,
      vy: 0,
      width: 44,
      height: 36,
      startX: 520,
      patrolDistance: 110,
      facing: 'right',
      state: 'alive',
      squishTimer: 0,
      animTimer: 0,
    },
    {
      id: 'otter-3',
      x: 1220,
      y: 370,
      vx: -1.3,
      vy: 0,
      width: 44,
      height: 36,
      startX: 1220,
      patrolDistance: 140,
      facing: 'left',
      state: 'alive',
      squishTimer: 0,
      animTimer: 0,
    },
    {
      id: 'otter-4',
      x: 1400,
      y: 370,
      vx: 1.4,
      vy: 0,
      width: 44,
      height: 36,
      startX: 1400,
      patrolDistance: 130,
      facing: 'right',
      state: 'alive',
      squishTimer: 0,
      animTimer: 0,
    },
    // Playful jumping otter on central island
    {
      id: 'otter-5',
      x: 1860,
      y: 450,
      vx: -1.3,
      vy: 0,
      width: 44,
      height: 36,
      startX: 1860,
      patrolDistance: 110,
      facing: 'left',
      state: 'alive',
      squishTimer: 0,
      isJumper: true,
      jumpTimer: 0,
      animTimer: 0,
    },
    // Final riverbank jumping otter
    {
      id: 'otter-6',
      x: 2850,
      y: 440,
      vx: 1.2,
      vy: 0,
      width: 44,
      height: 36,
      startX: 2850,
      patrolDistance: 120,
      facing: 'right',
      state: 'alive',
      squishTimer: 0,
      isJumper: true,
      jumpTimer: 0,
      animTimer: 0,
    },
  ];

  // Collectibles: Coins matching photo, Tân Triều grapefruits, and Heart Pickups!
  const collectibles: Collectible[] = [
    { id: 'c1', x: 220, y: 440, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0 },
    { id: 'c2', x: 710, y: 340, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.2 },
    { id: 'c3', x: 760, y: 340, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.8 },
    { id: 'c4', x: 910, y: 410, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 1.5 },
    { id: 'c_heart1', x: 290, y: 300, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0.4 },
    { id: 'c5', x: 1320, y: 350, width: 32, height: 32, type: 'grapefruit_heal', collected: false, bobOffset: 0.8 },
    { id: 'c6', x: 1780, y: 340, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.2 },
    { id: 'c_heart2', x: 1940, y: 270, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 1.1 },
    { id: 'c8', x: 2320, y: 400, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 1.2 },
    { id: 'c9', x: 2820, y: 330, width: 32, height: 32, type: 'grapefruit_heal', collected: false, bobOffset: 0.3 },
    { id: 'c10', x: 3040, y: 260, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 1.8 },
  ];

  return {
    id: 1,
    name: 'MÀN 1: CẦU SÔNG BUÔNG',
    subtitle: 'Vượt sông Buông & Băng qua bầy rái cá tinh nghịch',
    width,
    height,
    timeLimit: 120,
    platforms,
    enemies,
    collectibles,
    spawnPoint: { x: 80, y: 420 },
    goalPoint: { x: 3250, y: 360, width: 80, height: 140 },
    hasSpeechAttack: true,
  };
};

export const createLevel2 = (): LevelData => {
  const width = 2200;
  const height = 600;

  const platforms: Platform[] = [
    { x: 0, y: 500, width: 2200, height: 100, type: 'ground' },
    { x: 80, y: 390, width: 140, height: 20, type: 'brick' },
    { x: 480, y: 310, width: 180, height: 20, type: 'brick' },
    { x: 680, y: 370, width: 220, height: 24, type: 'brick' },
    { x: 740, y: 440, width: 140, height: 20, type: 'brick' },
    { x: 1040, y: 390, width: 160, height: 20, type: 'brick' },
    { x: 1220, y: 440, width: 110, height: 20, type: 'brick' },
    { x: 1400, y: 360, width: 180, height: 24, type: 'brick' },
  ];

  const collectibles: Collectible[] = [
    { id: 'l2_c1', x: 510, y: 260, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0 },
    { id: 'l2_c2', x: 550, y: 260, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.4 },
    { id: 'l2_c3', x: 590, y: 260, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.8 },
    { id: 'l2_heart1', x: 780, y: 310, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0.5 },
    { id: 'l2_c4', x: 750, y: 405, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.1 },
    { id: 'l2_c5', x: 780, y: 405, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.3 },
    { id: 'l2_c6', x: 810, y: 405, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.5 },
    { id: 'l2_c7', x: 840, y: 405, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.7 },
    { id: 'l2_c8', x: 1080, y: 345, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.2 },
    { id: 'l2_c9', x: 1120, y: 345, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.6 },
    { id: 'l2_heart2', x: 1360, y: 340, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 1.0 },
    { id: 'l2_c10', x: 1450, y: 315, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.3 },
    { id: 'l2_c11', x: 1490, y: 315, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.7 },
  ];

  const boss: Boss = {
    x: 1620,
    y: 405,
    vx: -1.5,
    vy: 0,
    width: 68,
    height: 96,
    health: 100,
    maxHealth: 100,
    facing: 'left',
    state: 'idle',
    phaseTimer: 1.8,
    attackCooldown: 1.8,
    bossType: 'csgt',
    stunTimer: 0,
    invulnerableTimer: 0,
    animTimer: 0,
  };

  return {
    id: 2,
    name: 'MÀN 2: PHỐ HUYỆN & TRẠM CSGT',
    subtitle: 'Đấu trí với Boss Công An bằng lý lẽ "BECAUSE" & né đạn súng!',
    width,
    height,
    timeLimit: 100,
    platforms,
    enemies: [],
    collectibles,
    spawnPoint: { x: 80, y: 420 },
    goalPoint: { x: 2080, y: 360, width: 80, height: 140 },
    boss,
    hasSpeechAttack: true,
  };
};

export const createLevel3 = (): LevelData => {
  const width = 2400;
  const height = 600;

  const platforms: Platform[] = [
    { x: 0, y: 500, width: 2400, height: 100, type: 'ground' },
    { x: 120, y: 400, width: 160, height: 22, type: 'brick' },
    { x: 480, y: 340, width: 200, height: 22, type: 'brick' },
    { x: 840, y: 410, width: 220, height: 24, type: 'brick' },
    { x: 910, y: 300, width: 140, height: 20, type: 'dinh_roof' },
    { x: 1240, y: 350, width: 210, height: 22, type: 'brick' },
    { x: 1580, y: 410, width: 180, height: 22, type: 'brick' },
    { x: 1880, y: 340, width: 190, height: 24, type: 'dinh_roof' },
  ];

  const collectibles: Collectible[] = [
    { id: 'l3_c1', x: 200, y: 340, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.2 },
    { id: 'l3_heart1', x: 570, y: 270, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0.5 },
    { id: 'l3_c2', x: 910, y: 240, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.6 },
    { id: 'l3_c3', x: 990, y: 240, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 1.1 },
    { id: 'l3_heart2', x: 1340, y: 280, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0.3 },
    { id: 'l3_c4', x: 1640, y: 350, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.8 },
    { id: 'l3_c5', x: 1940, y: 280, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 1.2 },
  ];

  const boss: Boss = {
    x: 1650,
    y: 405,
    vx: -1.4,
    vy: 0,
    width: 60,
    height: 85,
    health: 100,
    maxHealth: 100,
    facing: 'left',
    state: 'idle',
    phaseTimer: 1.6,
    attackCooldown: 1.5,
    bossType: 'y',
    stunTimer: 0,
    invulnerableTimer: 0,
    animTimer: 0,
  };

  return {
    id: 3,
    name: 'MÀN 3: CỔNG DINH CƠ & ĐẠI CHIẾN BOSS Ý',
    subtitle: 'Giải cứu Thuận, vượt Bão Trà Sữa & đoạt Chìa Khóa Cổng Dinh Cơ!',
    width,
    height,
    timeLimit: 110,
    platforms,
    enemies: [],
    collectibles,
    spawnPoint: { x: 120, y: 420 },
    goalPoint: { x: 2200, y: 350, width: 90, height: 150 },
    boss,
    hasSpeechAttack: true,
  };
};

export const createLevel4 = (): LevelData => {
  const width = 2200;
  const height = 600;

  const platforms: Platform[] = [
    { x: 0, y: 470, width: 2200, height: 130, type: 'ground' },
    { x: 300, y: 380, width: 170, height: 20, type: 'bridge_wood' },
    { x: 540, y: 310, width: 180, height: 20, type: 'bridge_wood' },
    { x: 800, y: 240, width: 220, height: 20, type: 'bridge_wood' },
    { x: 1080, y: 330, width: 190, height: 20, type: 'bridge_wood' },
    { x: 1350, y: 250, width: 220, height: 20, type: 'bridge_wood' },
    { x: 1640, y: 350, width: 190, height: 20, type: 'bridge_wood' },
  ];

  const collectibles: Collectible[] = [
    { id: 'l4_c1', x: 340, y: 320, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.1 },
    { id: 'l4_c2', x: 580, y: 250, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.4 },
    { id: 'l4_heart1', x: 910, y: 180, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0.7 },
    { id: 'l4_c3', x: 840, y: 190, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.2 },
    { id: 'l4_c4', x: 970, y: 190, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.8 },
    { id: 'l4_heart2', x: 1450, y: 190, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 1.1 },
    { id: 'l4_c5', x: 1380, y: 200, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.5 },
    { id: 'l4_c6', x: 1510, y: 200, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.9 },
    { id: 'l4_c7', x: 1700, y: 290, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.3 },
  ];

  const boss: Boss = {
    x: 1460,
    y: 365,
    vx: -1.2,
    vy: 0,
    width: 72,
    height: 105,
    health: 100,
    maxHealth: 100,
    facing: 'left',
    state: 'idle',
    phaseTimer: 1.6,
    attackCooldown: 1.6,
    bossType: 'baholong',
    stunTimer: 0,
    invulnerableTimer: 0,
    animTimer: 0,
  };

  return {
    id: 4,
    name: 'MÀN 4: ĐẠI LỘ SÀI GÒN & QUYẾT ĐẤU BÁ HỘ LONG',
    subtitle: 'Đại chiến cầu đêm Sài Gòn – Đánh bại Bá Hộ Long giải cứu Trúc!',
    width,
    height,
    timeLimit: 120,
    platforms,
    enemies: [],
    collectibles,
    spawnPoint: { x: 260, y: 400 },
    goalPoint: { x: 2060, y: 350, width: 90, height: 150 },
    boss,
    hasSpeechAttack: true,
  };
};

/**
 * MÀN 5 (MÀN CUỐI): ĐẠI CHIẾN BOSS MỸ NHI (NGƯỜI YÊU CŨ - SET SON 500K) & BẢO VỆ TRÚC (50 HP)
 */
export const createLevel5 = (): LevelData => {
  const width = 1600;
  const height = 600;

  const platforms: Platform[] = [
    // Thánh đường Hoa Hồng Đêm
    { x: 0, y: 470, width: 1600, height: 130, type: 'ground' },
    // Các bệ đá cẩm thạch để nhảy né và đón đầu đòn hoa hồng
    { x: 360, y: 370, width: 160, height: 20, type: 'brick' },
    { x: 640, y: 290, width: 180, height: 20, type: 'brick' },
    { x: 960, y: 360, width: 160, height: 20, type: 'brick' },
  ];

  const collectibles: Collectible[] = [
    { id: 'l5_heart1', x: 425, y: 310, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0.2 },
    { id: 'l5_heart2', x: 715, y: 230, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0.8 },
    { id: 'l5_heart3', x: 1025, y: 300, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 1.4 },
    { id: 'l5_c1', x: 540, y: 420, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 0.5 },
    { id: 'l5_c2', x: 840, y: 420, width: 28, height: 28, type: 'lotus_coin', collected: false, bobOffset: 1.1 },
  ];

  // Boss Mỹ Nhi: Dạng 1 (100 HP) -> Khi hết 100% máu sẽ HỒI SINH Dạng 2 Hóa Điên (100 HP)
  const boss: Boss = {
    x: 1020,
    y: 380,
    vx: -1.4,
    vy: 0,
    width: 64,
    height: 90,
    health: 100,
    maxHealth: 100,
    facing: 'left',
    state: 'idle',
    phaseTimer: 1.5,
    attackCooldown: 1.5,
    bossType: 'mynhi',
    stunTimer: 0,
    invulnerableTimer: 0,
    animTimer: 0,
    isEnraged: false,
    hasRevivedPhase2: false,
  };

  return {
    id: 5,
    name: 'MÀN CUỐI: BẢO VỆ TRÚC TRƯỚC BOSS MỸ NHI',
    subtitle: 'Dùng Parry [C] đỡ hoa hồng bảo vệ Trúc (50 HP) & đánh bại Mỹ Nhi 2 giai đoạn!',
    width,
    height,
    timeLimit: 180,
    platforms,
    enemies: [],
    collectibles,
    spawnPoint: { x: 260, y: 400 },
    goalPoint: { x: 1450, y: 340, width: 90, height: 130 },
    boss,
    hasSpeechAttack: true,
  };
}