/**
 * Canvas 2D Game Engine for Hành Trình Phước
 * High-performance 60fps physics, zero-lag input, robust collision detection,
 * and character model matching the user's reference sprite sheet.
 */

import {
  Player,
  Boss,
  EnemyOtter,
  Projectile,
  BossAttack,
  Collectible,
  Platform,
  Particle,
  LevelData,
  BossStoryEvent,
  AttackBecauseOptions,
  MobileAimMode,
  ThoaiQuestState,
} from '../types/game';
import { sounds } from '../audio/soundEffects';
import { drawPhuoc } from './phuocSprite';
import { drawOtter } from './otterSprite';
import { Level1Scenery } from './level1Scenery';
import { Level2Scenery } from './level2Scenery';
import { Level4Scenery } from './level4Scenery';
import { drawCsgtBoss } from './bossCsgtSprite';
import { drawBaHoLongBoss } from './bossBaHoLongSprite';
import { drawBossY, drawBobaCup, drawBobaPearl, drawBill50k } from './bossYSprite';
import { drawBossMyNhi, drawMyNhiFlowerProjectile } from './bossMyNhiSprite';
import { drawThuanNPC } from './thuanNpcSprite';
import { drawThoai } from './thoaiNpcSprite';
import { drawTruongMiniBoss, drawSingleSlipper, drawDroppedSlippers } from './truongMiniBossSprite';
import { TamPhuocSchoolScenery } from './tamPhuocSchoolScenery';
import { getStoryEventLines } from '../data/storyDialogues';

export interface EngineCallbacks {
  onLevelComplete: (nextLevelId: number) => void;
  onVictory: () => void;
  onGameOver: (reason?: string) => void;
  onScoreUpdate: (score: number, coins: number, health: number) => void;
  onBossHealthUpdate?: (hp: number, maxHp: number, bossName?: string) => void;
  onTrucHealthUpdate?: (hp: number, maxHp: number) => void;
  onTimeUpdate?: (timeLeft: number) => void;
  onCooldownUpdate?: (cooldownRemaining: number, maxCooldown: number) => void;
  onBossStoryEvent?: (event: BossStoryEvent) => void;
  onEnergyUpdate?: (energy: number, maxEnergy: number) => void;
  onParryStateUpdate?: (isParrying: boolean, parryCooldown: number) => void;
}

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: EngineCallbacks;

  public level: LevelData;
  public player: Player;
  public boss: Boss | null = null;
  public enemies: EnemyOtter[] = [];
  public collectibles: Collectible[] = [];
  public platforms: Platform[] = [];
  public projectiles: Projectile[] = [];
  public bossAttacks: BossAttack[] = [];
  public particles: Particle[] = [];

  // Countdown timer for level
  public timeLeft = 120;
  private lastReportedTime = -1;

  // Attack cooldown constraint tracking (Phước 2.5s cooldown)
  public readonly maxAttackCooldown = 2.5;
  private lastReportedCooldown = -1;

  // Safe ground checkpoint coordinates for pitfall recovery
  private lastSafeGroundedX = 80;
  private lastSafeGroundedY = 448;

  // Cached callback state to avoid unnecessary React re-renders
  private lastReportedScore = -1;
  private lastReportedCoins = -1;
  private lastReportedHealth = -1;
  private lastReportedBossHp = -1;
  private lastReportedEnergy = -1;
  private lastReportedParrying = false;

  // Camera viewport
  public cameraX = 0;
  public cameraY = 0;
  public viewportWidth = 960;
  public viewportHeight = 540;

  // Input states
  private keysHeld: Record<string, boolean> = {};
  private jumpBuffered = false;

  // Game loop & simulation
  private animFrameId: number | null = null;
  private lastTime = 0;
  public isRunning = false;
  public isPaused = false;

  // Stats
  public score = 0;
  public coins = 0;
  public becauseShoutsCount = 0;

  // Level 1: Thoại NPC & Trường Mini-Boss (THPT Tam Phước)
  public thoaiQuestState: ThoaiQuestState = 'not_started';
  public hasThoaiSlippers = false;
  public hasBridgeKey = false;
  public level1Area: 'river' | 'tam_phuoc_school' = 'river';
  public thoaiX = 1750;
  public thoaiY = 438;
  public thoaiVx = 0;
  public thoaiFacing: 'left' | 'right' = 'left';
  public thoaiState: 'idle' | 'walk' | 'wave' | 'worry' | 'celebrate' = 'worry';
  public thoaiAnimTimer = 0;
  public readonly thoaiWidth = 38;
  public readonly thoaiHeight = 52;
  public readonly schoolDoorX = 1860;
  public readonly schoolDoorY = 370;
  public readonly schoolDoorWidth = 70;
  public readonly schoolDoorHeight = 120;
  private lastRiverX = 1840;
  private lastRiverY = 438;

  // Trường Mini-Boss State inside THPT Tam Phước
  public truongDefeated = false;
  public truongIntroPlayed = false;
  public truongHp = 250;
  public truongMaxHp = 250;
  public truongX = 750;
  public truongY = 406;
  public truongVx = -1.3;
  public truongVy = 0;
  public truongWidth = 44;
  public truongHeight = 64;
  public truongFacing: 'left' | 'right' = 'left';
  public truongState:
    | 'idle'
    | 'patrol'
    | 'steal_slipper'
    | 'taunt_slipper'
    | 'dash_slipper'
    | 'throw_slipper'
    | 'rain_slipper'
    | 'stunned'
    | 'defeated' = 'patrol';
  public truongAnimTimer = 0;
  public truongStateTimer = 0;
  public truongAttackCooldown = 2.0;
  public truongInvulnerableTimer = 0;
  public truongDialogueBubble?: { text: string; timer: number };
  public truongEnraged = false;
  public truongPatrolStartX = 750;
  public droppedSlippersPos: { x: number; y: number } | null = null;

  // Level 3: Thuận NPC & Boss Ý State
  public thuanX = 180;
  public thuanY = 440;
  public thuanFacing: 'left' | 'right' = 'right';
  public thuanState: 'stand_tired' | 'run_panic' | 'cower' | 'hurt_kneel' | 'cheer' = 'hurt_kneel';
  public thuanAnimTimer = 0;
  public thuanSpeechBubble?: { text: string; timer: number };
  public level3IntroPlayed = false;
  public hasDinhKey = false;

  // Level 5 (Màn Cuối): Bảo vệ Trúc (50 HP) trước Boss Mỹ Nhi (Người Yêu Cũ - Set Son 500k)
  public trucHp = 50;
  public trucMaxHp = 50;
  public trucX = 110;
  public trucY = 414;
  public readonly trucWidth = 36;
  public readonly trucHeight = 56;
  public trucHurtTimer = 0;
  public trucSpeechBubble?: { text: string; timer: number };

  // Stored platforms for river vs school
  private riverPlatforms: Platform[] = [];
  private schoolPlatforms: Platform[] = [
    { x: 0, y: 470, width: 1200, height: 130, type: 'ground' },
    { x: 190, y: 380, width: 120, height: 20, type: 'brick' },
    { x: 520, y: 340, width: 160, height: 20, type: 'brick' },
    { x: 880, y: 380, width: 120, height: 20, type: 'brick' },
  ];
  private riverCollectibles: Collectible[] = [];
  private schoolCollectibles: Collectible[] = [
    { id: 'school-heart-1', x: 235, y: 320, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0 },
    { id: 'school-heart-2', x: 585, y: 280, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 1.5 },
    { id: 'school-heart-3', x: 925, y: 320, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 3.0 },
    { id: 'school-heart-4', x: 420, y: 425, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 2.2 },
  ];

  // Screen shake
  private screenShake = 0;

  // Background river waves timer
  private riverTimer = 0;

  // Aim Trajectory preview (for mobile drag-to-aim)
  public aimTrajectory: { active: boolean; angle: number } | null = null;
  public tapTargetEffect: { x: number; y: number; life: number; maxLife: number } | null = null;

  public setAimTrajectory(angleRad: number, active: boolean) {
    if (!active) {
      this.aimTrajectory = null;
    } else {
      this.aimTrajectory = { active: true, angle: angleRad };
    }
  }

  public triggerTapTargetEffect(x: number, y: number) {
    this.tapTargetEffect = { x, y, life: 0.35, maxLife: 0.35 };
  }

  constructor(canvas: HTMLCanvasElement, level: LevelData, callbacks: EngineCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
    this.callbacks = callbacks;
    this.level = level;

    this.player = this.createInitialPlayer(level.spawnPoint.x, level.spawnPoint.y);
    this.initLevel(level);
  }

  private createInitialPlayer(x: number, y: number): Player {
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      width: 34,
      height: 50,
      facing: 'right',
      isGrounded: false,
      health: 3,
      maxHealth: 3,
      invulnerableTimer: 0,
      attackCooldown: 0,
      isAttacking: false,
      speechShoutTimer: 0,
      state: 'idle',
      animTimer: 0,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      mobileJumpSustainTimer: 0,
      energy: 0,
      maxEnergy: 100,
      isParrying: false,
      parryTimer: 0,
      parryCooldown: 0,
    };
  }

  public initLevel(level: LevelData) {
    this.level = level;
    this.platforms = JSON.parse(JSON.stringify(level.platforms));
    this.enemies = JSON.parse(JSON.stringify(level.enemies));
    this.collectibles = JSON.parse(JSON.stringify(level.collectibles));
    this.boss = level.boss ? JSON.parse(JSON.stringify(level.boss)) : null;

    this.projectiles = [];
    this.bossAttacks = [];
    this.particles = [];
    this.player.x = level.spawnPoint.x;
    this.player.y = level.spawnPoint.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.isGrounded = false;
    this.cameraX = 0;
    this.lastSafeGroundedX = level.spawnPoint.x;
    this.lastSafeGroundedY = level.spawnPoint.y;

    this.timeLeft = level.timeLimit || 100;
    this.lastReportedTime = -1;
    this.player.attackCooldown = 0;
    this.lastReportedCooldown = -1;

    this.lastReportedScore = -1;
    this.lastReportedCoins = -1;
    this.lastReportedHealth = -1;
    this.lastReportedBossHp = -1;

    if (this.boss && this.callbacks.onBossHealthUpdate) {
      const bossName =
        this.boss.bossType === 'mynhi'
          ? 'Boss Mỹ Nhi (Người Yêu Cũ - Set Son 500k)'
          : this.boss.bossType === 'baholong'
          ? 'Bá Hộ Long'
          : this.boss.bossType === 'y'
          ? 'Boss Ý (Trà Sữa & 50K)'
          : 'Công an';
      this.callbacks.onBossHealthUpdate(this.boss.health, this.boss.maxHealth, bossName);
    }

    if (level.id === 5) {
      this.trucHp = 50;
      this.trucMaxHp = 50;
      this.trucX = 110;
      this.trucY = 414;
      this.trucHurtTimer = 0;
      this.trucSpeechBubble = {
        text: 'Anh Phước ơi, dùng Parry [C] đỡ hoa hồng cứu em với!',
        timer: 4.0,
      };
      if (this.callbacks.onTrucHealthUpdate) {
        this.callbacks.onTrucHealthUpdate(this.trucHp, this.trucMaxHp);
      }
    }

    if (level.id === 3) {
      this.thuanX = 180;
      this.thuanY = 440;
      this.thuanFacing = 'right';
      this.thuanState = 'hurt_kneel';
      this.level3IntroPlayed = false;
      this.hasDinhKey = false;
    }
    if (this.callbacks.onTimeUpdate) {
      this.callbacks.onTimeUpdate(Math.ceil(this.timeLeft));
    }
    if (this.callbacks.onCooldownUpdate) {
      this.callbacks.onCooldownUpdate(0, this.maxAttackCooldown);
    }

    if (level.id === 1) {
      this.riverPlatforms = JSON.parse(JSON.stringify(level.platforms));
      this.level1Area = 'river';
      this.thoaiQuestState = 'not_started';
      this.hasThoaiSlippers = false;
      this.hasBridgeKey = false;
      this.thoaiX = 1750;
      this.thoaiY = 438;
      this.thoaiVx = 0;
      this.thoaiFacing = 'left';
      this.thoaiState = 'worry';
      this.thoaiAnimTimer = 0;
      this.truongDefeated = false;
      this.truongHp = 250;
      this.truongMaxHp = 250;
      this.truongX = 750;
      this.truongY = 406;
      this.truongVy = 0;
      this.truongFacing = 'left';
      this.truongState = 'patrol';
      this.truongStateTimer = 0;
      this.truongEnraged = false;
      this.droppedSlippersPos = null;
      this.schoolCollectibles = [
        { id: 'school-heart-1', x: 235, y: 320, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 0 },
        { id: 'school-heart-2', x: 585, y: 280, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 1.5 },
        { id: 'school-heart-3', x: 925, y: 320, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 3.0 },
        { id: 'school-heart-4', x: 420, y: 425, width: 28, height: 28, type: 'heart_heal', collected: false, bobOffset: 2.2 },
      ];
    }

    if (level.id === 1) {
      this.setPlayerSpeech('Trúc ơi hãy đợi anh! Anh sẽ vượt Sông Buông cứu em!', 3.5);
    } else if (level.id === 2) {
      this.setPlayerSpeech('Phố Huyện! Cháu có lý lẽ chính đáng để cứu bạn gái... BECAUSE!', 3.5);
    } else if (level.id === 3) {
      this.setPlayerSpeech('Sau cú té xe, Long trốn vào cổng dinh! Anh tới cứu em đây, Trúc!', 3.5);
    } else if (level.id === 4) {
      this.setPlayerSpeech('Bá Hộ Long! Đại lộ Sài Gòn đêm nay sẽ là hồi kết!', 3.5);
    } else if (level.id === 5) {
      this.setPlayerSpeech('Trúc đứng sau lưng anh! Anh sẽ dùng Parry [C] đỡ hoa hồng của Mỹ Nhi bảo vệ em!', 4.0);
    }
  }

  public setPlayerSpeech(text: string, duration = 2.4) {
    this.player.dialogueBubble = {
      text,
      timer: duration,
    };
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    if (this.level.id === 5) {
      sounds.startBossMusic('mynhi');
    } else {
      sounds.startBgm(this.level.id);
    }

    if (this.level.id === 3 && !this.level3IntroPlayed && this.callbacks.onBossStoryEvent) {
      this.level3IntroPlayed = true;
      setTimeout(() => {
        if (!this.isRunning) return;
        this.pause();
        if (this.callbacks.onBossStoryEvent) {
          this.callbacks.onBossStoryEvent({
            stage: 'y_intro',
            speaker: 'Thuận & Ý',
            currentDialogIndex: 0,
            dialogues: [],
            lines: getStoryEventLines('y_intro'),
          });
        }
      }, 350);
    }

    const loop = (currentTime: number) => {
      if (!this.isRunning) return;
      const rawDt = (currentTime - this.lastTime) / 1000;
      const dt = Math.min(rawDt, 0.04);
      this.lastTime = currentTime;

      if (!this.isPaused) {
        this.update(dt);
      }
      this.render();

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    sounds.stopBgm();
  }

  public pause() {
    this.isPaused = true;
    sounds.pauseBgm();
  }

  public resume() {
    this.isPaused = false;
    this.lastTime = performance.now();
    if (this.level.id === 1 && this.level1Area === 'tam_phuoc_school' && !this.truongDefeated) {
      sounds.startBossMusic('truong');
    } else if (this.level.id === 3 && this.boss && this.boss.state !== 'defeated') {
      sounds.startBossMusic('y');
    } else if (this.level.id === 5 && this.boss && this.boss.state !== 'defeated') {
      sounds.startBossMusic(this.boss.isEnraged ? 'mynhi_enraged' : 'mynhi');
    } else {
      sounds.resumeBgm();
    }
  }

  public handleKeyDown(code: string) {
    this.keysHeld[code] = true;
    if (code === 'Space' || code === 'KeyW' || code === 'ArrowUp') {
      this.performJump();
    }
    if (code === 'KeyF') {
      this.triggerBecauseAttack();
    }
    if (code === 'KeyC' || code === 'KeyS' || code === 'ArrowDown') {
      this.triggerParry();
    }
    if (code === 'KeyE' || code === 'KeyK' || code === 'KeyQ' || code === 'KeyU') {
      if (code === 'KeyE' && (this.isNearThoai() || this.isNearSchoolDoor() || this.isNearSchoolExit())) {
        this.handleInteract();
      } else {
        this.triggerUltimateLipstick();
      }
    }
    if (code === 'Enter') {
      this.handleInteract();
    }
  }

  public handleKeyUp(code: string) {
    this.keysHeld[code] = false;
  }

  public performJump(fromMobile: boolean = false) {
    const p = this.player;
    if (p.isGrounded || p.coyoteTimer > 0) {
      p.vy = -12.0;
      p.isGrounded = false;
      p.coyoteTimer = 0;
      p.jumpBufferTimer = 0;
      this.jumpBuffered = false;
      if (fromMobile) {
        this.keysHeld['Space'] = true;
        p.mobileJumpSustainTimer = 0.32;
      }
      sounds.playJump();
      this.spawnJumpDust();
    } else {
      this.jumpBuffered = true;
      p.jumpBufferTimer = 0.18;
    }
  }

  public isNearThoai(): boolean {
    return (
      this.level.id === 1 &&
      this.level1Area === 'river' &&
      Math.abs(this.player.x - this.thoaiX) < 85 &&
      Math.abs(this.player.y - this.thoaiY) < 95
    );
  }

  public isNearSchoolDoor(): boolean {
    return (
      this.level.id === 1 &&
      this.level1Area === 'river' &&
      Math.abs(this.player.x - (this.schoolDoorX + 35)) < 85 &&
      Math.abs(this.player.y - (this.schoolDoorY + 60)) < 110
    );
  }

  public isNearSchoolExit(): boolean {
    return (
      this.level.id === 1 &&
      this.level1Area === 'tam_phuoc_school' &&
      this.player.x < 140
    );
  }

  public handleInteract() {
    if (this.isNearThoai()) {
      this.interactWithThoai();
    } else if (this.isNearSchoolDoor()) {
      this.enterTamPhuocSchool();
    } else if (this.isNearSchoolExit()) {
      this.exitTamPhuocSchool();
    }
  }

  public interactWithThoai() {
    if (this.level.id !== 1 || this.level1Area !== 'river') return;

    if (this.thoaiQuestState === 'not_started') {
      this.pause();
      if (this.callbacks.onBossStoryEvent) {
        this.callbacks.onBossStoryEvent({
          stage: 'thoai_intro',
          speaker: 'Thoại',
          currentDialogIndex: 0,
          dialogues: [],
          lines: getStoryEventLines('thoai_intro'),
        });
      }
      this.thoaiQuestState = 'accepted';
      this.setPlayerSpeech('Vào THPT Tam Phước dạy tên Trường một bài học thôi!', 3.0);
    } else if (this.thoaiQuestState === 'accepted') {
      this.pause();
      if (this.callbacks.onBossStoryEvent) {
        this.callbacks.onBossStoryEvent({
          stage: 'thoai_waiting',
          speaker: 'Thoại',
          currentDialogIndex: 0,
          dialogues: [],
          lines: getStoryEventLines('thoai_waiting'),
        });
      }
    } else if (this.thoaiQuestState === 'slippers_recovered') {
      this.pause();
      sounds.playKeyGet();
      if (this.callbacks.onBossStoryEvent) {
        this.callbacks.onBossStoryEvent({
          stage: 'thoai_return_slippers',
          speaker: 'Thoại',
          currentDialogIndex: 0,
          dialogues: [],
          lines: getStoryEventLines('thoai_return_slippers'),
        });
      }
      this.hasBridgeKey = true;
      this.thoaiQuestState = 'completed';
      this.score += 1000;
      this.spawnHeartHealParticles(this.thoaiX + 20, this.thoaiY);
      this.setPlayerSpeech('Đã có Chìa Khóa Cổng! Mau tiến sang Màn 2 thôi!', 3.5);
    } else {
      this.pause();
      if (this.callbacks.onBossStoryEvent) {
        this.callbacks.onBossStoryEvent({
          stage: 'thoai_completed',
          speaker: 'Thoại',
          currentDialogIndex: 0,
          dialogues: [],
          lines: getStoryEventLines('thoai_completed'),
        });
      }
    }
  }

  public enterTamPhuocSchool() {
    if (this.level.id !== 1 || this.level1Area === 'tam_phuoc_school') return;
    sounds.playDoorWarp();
    this.lastRiverX = this.player.x;
    this.lastRiverY = this.player.y;
    this.level1Area = 'tam_phuoc_school';
    this.platforms = this.schoolPlatforms;
    this.riverCollectibles = this.collectibles;
    this.collectibles = this.schoolCollectibles;
    this.player.x = 160;
    this.player.y = 410;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.facing = 'right';
    this.cameraX = 0;

    if (!this.truongDefeated) {
      sounds.startBossMusic('truong');
      if (this.callbacks.onBossHealthUpdate) {
        this.callbacks.onBossHealthUpdate(
          this.truongHp,
          this.truongMaxHp,
          'Trường - Trùm Bắt Nạt Trộm Dép (THPT Tam Phước)'
        );
      }
    }

    if (!this.truongDefeated && !this.truongIntroPlayed && this.callbacks.onBossStoryEvent) {
      this.truongIntroPlayed = true;
      this.pause();
      this.callbacks.onBossStoryEvent({
        stage: 'truong_intro',
        speaker: 'Trường',
        currentDialogIndex: 0,
        dialogues: [],
        lines: getStoryEventLines('truong_intro'),
      });
    }

    this.setPlayerSpeech('Trường đâu mau trả dép cho Thoại!', 2.5);
  }

  public exitTamPhuocSchool() {
    if (this.level.id !== 1 || this.level1Area !== 'tam_phuoc_school') return;
    sounds.playDoorWarp();
    sounds.startBgm(1);
    this.level1Area = 'river';
    this.platforms = this.riverPlatforms;
    this.schoolCollectibles = this.collectibles;
    this.collectibles = this.riverCollectibles;
    this.player.x = 1840;
    this.player.y = 438;
    this.player.vx = 0;
    this.player.vy = 0;
    this.cameraX = Math.max(0, this.player.x - this.viewportWidth * 0.4);

    if (this.callbacks.onBossHealthUpdate) {
      this.callbacks.onBossHealthUpdate(undefined as any, undefined as any, undefined);
    }

    if (this.hasThoaiSlippers && this.thoaiQuestState !== 'completed') {
      this.setPlayerSpeech('Đã lấy được dép rồi! Mau lại gặp Thoại để trả dép!', 3.0);
    }
  }

  public damageTruong(amount: number) {
    if (this.truongDefeated || this.truongInvulnerableTimer > 0) return;
    this.truongHp = Math.max(0, this.truongHp - amount);
    this.truongInvulnerableTimer = 0.42;
    this.truongState = 'stunned';
    this.truongStateTimer = 0.42;
    this.screenShake = 0.6;
    sounds.playBossHurt();

    for (let p = 0; p < 8; p++) {
      this.particles.push({
        x: this.truongX + this.truongWidth / 2,
        y: this.truongY + this.truongHeight / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 5 + 2,
        color: '#FACC15',
        alpha: 1,
        life: 0.4,
        maxLife: 0.4,
        shape: 'star',
      });
    }

    if (this.callbacks.onBossHealthUpdate) {
      this.callbacks.onBossHealthUpdate(
        this.truongHp,
        this.truongMaxHp,
        'Trường - Trùm Bắt Nạt Trộm Dép (THPT Tam Phước)'
      );
    }

    if (this.truongHp <= 125 && !this.truongEnraged) {
      this.truongEnraged = true;
      this.screenShake = 1.0;
      this.truongDialogueBubble = {
        text: 'BECAUSE GÌ?! TAO NỔI ĐIÊN RỒI! BÃO DÉP TỔ ONG HUỶ DIỆT!!!',
        timer: 2.8,
      };
      this.executeTruongRainSlipperAttack();
    }

    if (this.truongHp <= 0) {
      this.truongHp = 0;
      this.truongDefeated = true;
      this.truongState = 'defeated';
      sounds.startBgm(1);
      this.truongDialogueBubble = {
        text: 'Ui da! Tớ chừa rồi, trả dép cho Thoại đây!',
        timer: 3.5,
      };
      if (this.callbacks.onBossHealthUpdate) {
        this.callbacks.onBossHealthUpdate(0, this.truongMaxHp, 'Trường - Đã đầu hàng trả dép');
      }
      sounds.playVictory();
      this.score += 2000;
      this.droppedSlippersPos = { x: this.truongX, y: 440 };

      for (let p = 0; p < 24; p++) {
        this.particles.push({
          x: this.truongX + this.truongWidth / 2,
          y: this.truongY + 20,
          vx: (Math.random() - 0.5) * 10,
          vy: -Math.random() * 8 - 3,
          size: Math.random() * 6 + 3,
          color: ['#FACC15', '#4ADE80', '#38BDF8', '#F43F5E'][p % 4],
          alpha: 1,
          life: 0.8,
          maxLife: 0.8,
          shape: 'star',
        });
      }
    }
  }

  private executeTruongStealAction() {
    if (this.truongDefeated) return;
    this.truongState = 'steal_slipper';
    this.truongStateTimer = 2.2;
    const dir = this.player.x < this.truongX ? -1 : 1;
    this.truongFacing = dir === -1 ? 'left' : 'right';
    this.truongVx = dir * (this.truongEnraged ? 2.4 : 1.6);

    const stealShouts = [
      'Hí hí! Lén trộm thêm đôi dép tổ ong nữa!',
      'Dép để ở kệ trường à? Tao lấy luôn!',
      'Dép tổ ong của Thoại êm quá, giờ là của tao!',
      'Trộm sạch dép THPT Tam Phước xem ai cản được tao!',
    ];
    this.truongDialogueBubble = {
      text: stealShouts[Math.floor(Math.random() * stealShouts.length)],
      timer: 2.0,
    };

    sounds.playCoin();
  }

  private executeTruongTauntAction() {
    if (this.truongDefeated) return;
    this.truongState = 'taunt_slipper';
    this.truongStateTimer = 1.8;
    this.truongVx = 0;
    this.truongFacing = this.player.x < this.truongX ? 'left' : 'right';

    const tauntLines = [
      'Đố Phước lấy lại được đôi dép này đấy!',
      'Dép tổ ong huyền thoại giờ là của tao!',
      'Mày chỉ biết hét BECAUSE thôi à? Thách dám đụng tao!',
    ];
    this.truongDialogueBubble = {
      text: tauntLines[Math.floor(Math.random() * tauntLines.length)],
      timer: 1.8,
    };
  }

  private executeTruongDashAction() {
    if (this.truongDefeated) return;
    this.truongState = 'dash_slipper';
    this.truongStateTimer = 0.9;
    const dir = this.player.x < this.truongX ? -1 : 1;
    this.truongFacing = dir === -1 ? 'left' : 'right';
    this.truongVx = dir * (this.truongEnraged ? 7.6 : 6.0);

    this.truongDialogueBubble = {
      text: 'Lao vào cướp dép! Tránh đường ra mau!',
      timer: 1.2,
    };
    sounds.playSlipperThrow();
  }

  private executeTruongSlipperAttack() {
    if (this.truongDefeated) return;
    this.truongState = 'throw_slipper';
    this.truongStateTimer = 0.75;
    const dir = this.player.x < this.truongX ? -1 : 1;
    this.truongFacing = dir === -1 ? 'left' : 'right';

    sounds.playSlipperThrow();
    const taunts = [
      'Dép Tổ Ong bay thẳng vào mặt!',
      'Né thử chiếc dép lào này xem!',
      'Dép thần tốc! Đỡ lấy Phước!',
    ];
    this.truongDialogueBubble = {
      text: taunts[Math.floor(Math.random() * taunts.length)],
      timer: 1.6,
    };

    const count = this.truongEnraged ? 3 : (Math.random() > 0.4 ? 2 : 1);
    for (let i = 0; i < count; i++) {
      const speed = (this.truongEnraged ? 8.0 : 6.8) + i * 1.8;
      const angle = -0.12 - (i - 1) * 0.18;
      this.bossAttacks.push({
        id: Math.random().toString(),
        x: this.truongX + (dir === 1 ? this.truongWidth : 0),
        y: this.truongY + 18 + i * 6,
        vx: dir * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'slipper_throw',
        width: 28,
        height: 16,
        life: 2.8,
        rotation: 0,
        rotationSpeed: dir * (12 + Math.random() * 6),
      });
    }
  }

  private executeTruongRainSlipperAttack() {
    if (this.truongDefeated) return;
    this.truongState = 'rain_slipper';
    this.truongStateTimer = 1.2;
    sounds.playTruongUltimateSkill();
    this.screenShake = 0.6;

    this.truongDialogueBubble = {
      text: 'MƯA DÉP BÁT NHÃ RƠI TỪ NÓC TRƯỜNG ĐÂY!',
      timer: 1.8,
    };

    const centerTargetX = this.player.x;
    const offsets = this.truongEnraged ? [-160, -90, -20, 50, 120, 180] : [-130, -40, 50, 140];
    offsets.forEach((off, idx) => {
      setTimeout(() => {
        if (this.truongDefeated || this.isPaused) return;
        sounds.playSlipperThrow();
        const dropX = Math.max(160, Math.min(1050, centerTargetX + off));
        this.bossAttacks.push({
          id: Math.random().toString(),
          x: dropX,
          y: -20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 6.5 + Math.random() * 2.5,
          type: 'slipper_rain',
          width: 28,
          height: 16,
          life: 3.0,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 15,
        });
      }, idx * 160);
    });
  }

  private updateThoaiNPC(dt: number) {
    this.thoaiAnimTimer += dt;

    if (this.thoaiQuestState === 'completed') {
      if (this.isNearThoai()) {
        this.thoaiFacing = this.player.x < this.thoaiX ? 'left' : 'right';
        this.thoaiState = 'celebrate';
        this.thoaiVx = 0;
      } else {
        if (Math.sin(this.riverTimer * 1.5) > 0.4) {
          this.thoaiState = 'celebrate';
          this.thoaiVx = 0;
        } else {
          this.thoaiState = 'walk';
          const speed = 0.8;
          if (Math.abs(this.thoaiVx) < 0.2) {
            this.thoaiVx = this.thoaiFacing === 'left' ? -speed : speed;
          }
          this.thoaiX += this.thoaiVx * 60 * dt;
          if (this.thoaiX <= 1720) {
            this.thoaiX = 1720;
            this.thoaiVx = speed;
            this.thoaiFacing = 'right';
          } else if (this.thoaiX >= 1795) {
            this.thoaiX = 1795;
            this.thoaiVx = -speed;
            this.thoaiFacing = 'left';
          }
        }
      }
      return;
    }

    if (this.isNearThoai()) {
      this.thoaiFacing = this.player.x < this.thoaiX ? 'left' : 'right';
      this.thoaiVx = 0;
      if (this.hasThoaiSlippers) {
        this.thoaiState = 'wave';
      } else {
        this.thoaiState = 'worry';
      }
    } else {
      const cycle = Math.floor(this.riverTimer / 3.5) % 2;
      if (cycle === 0) {
        this.thoaiState = 'walk';
        const speed = 0.6;
        if (Math.abs(this.thoaiVx) < 0.2) {
          this.thoaiVx = this.thoaiFacing === 'left' ? -speed : speed;
        }
        this.thoaiX += this.thoaiVx * 60 * dt;
        if (this.thoaiX <= 1720) {
          this.thoaiX = 1720;
          this.thoaiVx = speed;
          this.thoaiFacing = 'right';
        } else if (this.thoaiX >= 1790) {
          this.thoaiX = 1790;
          this.thoaiVx = -speed;
          this.thoaiFacing = 'left';
        }
      } else {
        this.thoaiState = 'worry';
        this.thoaiVx = 0;
      }
    }
  }

  private updateThuanNPC(dt: number) {
    this.thuanAnimTimer += dt;
    if (this.thuanSpeechBubble) {
      this.thuanSpeechBubble.timer -= dt;
      if (this.thuanSpeechBubble.timer <= 0) {
        this.thuanSpeechBubble = undefined;
      }
    }

    if (this.boss && this.boss.state === 'defeated') {
      this.thuanState = 'cheer';
      this.thuanFacing = 'right';
      return;
    }

    this.thuanFacing = this.player.x < this.thuanX ? 'left' : 'right';

    if (!this.thuanSpeechBubble && Math.random() < 0.007) {
      const shouts = [
        'Phước ơi né ly trà sữa kìa!',
        'Bấm phím C đỡ đòn parry kìa Phước!',
        'Né hạt trân châu đang nảy kìa!',
        'Vì Trúc anh Phước cố lên!',
      ];
      this.thuanSpeechBubble = {
        text: shouts[Math.floor(Math.random() * shouts.length)],
        timer: 2.4,
      };
    }
  }

  private updateTruongMiniBoss(dt: number) {
    if (this.level1Area !== 'tam_phuoc_school') return;

    this.truongAnimTimer += dt;
    if (this.truongInvulnerableTimer > 0) this.truongInvulnerableTimer -= dt;
    if (this.truongDialogueBubble) {
      this.truongDialogueBubble.timer -= dt;
      if (this.truongDialogueBubble.timer <= 0) {
        this.truongDialogueBubble = undefined;
      }
    }

    if (this.truongDefeated) {
      this.truongVx = 0;
      this.truongVy += 24 * dt;
      this.truongY += this.truongVy * 60 * dt;
      if (this.truongY + this.truongHeight >= 470) {
        this.truongY = 470 - this.truongHeight;
        this.truongVy = 0;
      }
      return;
    }

    const GRAVITY = 26;
    this.truongVy += GRAVITY * dt;
    if (this.truongVy > 12) this.truongVy = 12;

    const prevY = this.truongY;
    this.truongY += this.truongVy * 60 * dt;

    if (this.truongVy >= 0) {
      const prevBottom = prevY + this.truongHeight;
      const currentBottom = this.truongY + this.truongHeight;
      let landed = false;
      for (const plat of this.platforms) {
        if (
          this.truongX + this.truongWidth > plat.x + 6 &&
          this.truongX < plat.x + plat.width - 6
        ) {
          if (prevBottom <= plat.y + 16 && currentBottom >= plat.y) {
            this.truongY = plat.y - this.truongHeight;
            this.truongVy = 0;
            landed = true;
            break;
          }
        }
      }
      if (!landed && this.truongY + this.truongHeight >= 470) {
        this.truongY = 470 - this.truongHeight;
        this.truongVy = 0;
      }
    }

    const isGrounded = this.truongVy === 0;
    if (isGrounded && this.player.y < this.truongY - 40 && Math.abs(this.player.x - this.truongX) < 280) {
      if (Math.random() < 0.035) {
        this.truongVy = -11.5;
        sounds.playJump();
      }
    }

    if (this.truongStateTimer > 0) {
      this.truongStateTimer -= dt;
      if (this.truongStateTimer <= 0) {
        if (this.truongState === 'steal_slipper') {
          this.executeTruongTauntAction();
          return;
        } else if (this.truongState === 'taunt_slipper') {
          if (Math.random() > 0.45) {
            this.executeTruongSlipperAttack();
          } else {
            this.truongState = 'patrol';
          }
          return;
        } else if (this.truongState === 'dash_slipper') {
          if (Math.random() > 0.5) {
            this.executeTruongSlipperAttack();
          } else {
            this.truongState = 'patrol';
          }
          return;
        } else {
          this.truongState = 'patrol';
        }
      }
    }

    if (this.truongState === 'patrol') {
      const walkSpeed = this.truongEnraged ? 2.2 : 1.4;
      if (Math.abs(this.truongVx) < 0.5) {
        this.truongVx = this.truongFacing === 'left' ? -walkSpeed : walkSpeed;
      }
      this.truongX += this.truongVx * 60 * dt;
      this.truongFacing = this.truongVx < 0 ? 'left' : 'right';

      if (Math.abs(this.truongX - this.truongPatrolStartX) > 220) {
        this.truongVx *= -1;
        this.truongFacing = this.truongVx < 0 ? 'left' : 'right';
      }
    } else if (this.truongState === 'steal_slipper') {
      this.truongX += this.truongVx * 60 * dt;
      this.truongFacing = this.truongVx < 0 ? 'left' : 'right';
    } else if (this.truongState === 'dash_slipper') {
      this.truongX += this.truongVx * 60 * dt;
      this.truongFacing = this.truongVx < 0 ? 'left' : 'right';

      const p = this.player;
      if (
        p.invulnerableTimer <= 0 &&
        p.x + p.width > this.truongX + 6 &&
        p.x < this.truongX + this.truongWidth - 6 &&
        p.y + p.height > this.truongY + 10 &&
        p.y < this.truongY + this.truongHeight
      ) {
        sounds.playSlipperSlap();
        this.handlePlayerDamage();
      }
    } else if (this.truongState === 'taunt_slipper' || this.truongState === 'throw_slipper') {
      this.truongFacing = this.player.x < this.truongX ? 'left' : 'right';
    }

    if (this.truongX < 260) {
      this.truongX = 260;
      if (this.truongVx < 0) {
        this.truongVx = Math.abs(this.truongVx);
        this.truongFacing = 'right';
      }
    } else if (this.truongX > 1080) {
      this.truongX = 1080;
      if (this.truongVx > 0) {
        this.truongVx = -Math.abs(this.truongVx);
        this.truongFacing = 'left';
      }
    }

    this.truongAttackCooldown -= dt;
    if (this.truongAttackCooldown <= 0 && (this.truongState === 'patrol' || this.truongStateTimer <= 0)) {
      this.truongAttackCooldown = this.truongEnraged ? 1.6 : 2.5;

      const roll = Math.random();
      if (roll < 0.3) {
        this.executeTruongStealAction();
      } else if (roll < 0.5) {
        this.executeTruongTauntAction();
      } else if (roll < 0.72) {
        this.executeTruongSlipperAttack();
      } else if (roll < 0.88) {
        this.executeTruongDashAction();
      } else {
        this.executeTruongRainSlipperAttack();
      }
    }
  }

  public addPlayerEnergy(amount: number) {
    const p = this.player;
    const oldEnergy = p.energy;
    p.energy = Math.min(p.maxEnergy, Math.max(0, p.energy + amount));
    if (p.energy >= p.maxEnergy && oldEnergy < p.maxEnergy) {
      sounds.playCoin();
      this.setPlayerSpeech('ĐÃ ĐỦ NỘI NĂNG! 💄 3 HỘP SON SẴN SÀNG!', 2.2);
      this.particles.push({
        x: p.x + p.width / 2,
        y: p.y - 12,
        vx: 0,
        vy: -1.8,
        size: 13,
        color: '#F43F5E',
        alpha: 1,
        life: 0.9,
        maxLife: 0.9,
        shape: 'letter',
        char: '💄 3 HỘP SON SẴN SÀNG! (Phím E)',
      });
    }
  }

  public triggerParry() {
    const p = this.player;
    if (p.parryCooldown && p.parryCooldown > 0) {
      sounds.playCooldownClick();
      return;
    }
    p.isParrying = true;
    p.parryTimer = 0.52; // Cửa sổ Parry rộng 520ms thuận tiện đỡ đòn bảo vệ Trúc
    p.parryCooldown = 0.65;
    sounds.playParry();
    this.setPlayerSpeech('THẾ THỦ! PARRY BẢO VỆ TRÚC! 🛡️', 1.2);

    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: p.x + p.width / 2,
        y: p.y + p.height / 2,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        size: Math.random() * 4 + 2,
        color: '#38BDF8',
        alpha: 1,
        life: 0.35,
        maxLife: 0.35,
        shape: 'star',
      });
    }
  }

  public triggerUltimateLipstick() {
    const p = this.player;
    if (p.energy < p.maxEnergy) {
      sounds.playCooldownClick();
      this.setPlayerSpeech(`Chưa đủ nội năng! Cần 100% (${Math.round(p.energy)}/100)`, 1.5);
      return;
    }

    p.energy = 0;
    p.attackCooldown = 0.8;
    p.isAttacking = true;
    p.speechShoutTimer = 0.45;
    this.screenShake = 1.0;
    sounds.playPhuocLipstickSkill();

    this.setPlayerSpeech('SET SON 500K HUYỀN THOẠI! ĐỠ LẤY NÀY! 💄💄💄', 2.5);

    const dir = p.facing === 'right' ? 1 : -1;
    const spawnX = p.facing === 'right' ? p.x + p.width + 6 : p.x - 26;
    const spawnY = p.y + 14;

    const angles = [-0.18, 0, 0.18];
    angles.forEach((angle, idx) => {
      setTimeout(() => {
        if (!this.isRunning || this.isPaused) return;
        const speed = 14.0;
        const vx = dir * Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        this.projectiles.push({
          id: 'lipstick-' + Math.random().toString(),
          x: spawnX,
          y: spawnY + (idx - 1) * 8,
          vx,
          vy,
          text: 'SON 500K 💄',
          size: 20,
          color: '#F43F5E',
          life: 2.0,
          maxLife: 2.0,
          isFromPlayer: true,
          rotation: (Math.random() - 0.5) * 0.2,
          scale: 1.0,
          projType: 'lipstick',
          damage: 10,
        });
      }, idx * 100);
    });
  }

  public handleCanvasClick(targetX?: number, targetY?: number) {
    if (this.level.hasSpeechAttack) {
      if (targetX !== undefined && targetY !== undefined) {
        this.triggerTapTargetEffect(targetX, targetY);
        this.triggerBecauseAttack({ targetX, targetY });
      } else {
        this.triggerBecauseAttack();
      }
    }
  }

  public triggerBecauseAttack(optionsOrTargetX?: number | AttackBecauseOptions, maybeTargetY?: number) {
    if (!this.level.hasSpeechAttack) return;
    if (this.player.attackCooldown > 0) {
      sounds.playCooldownClick();
      return;
    }

    this.player.attackCooldown = 2.5;
    this.player.speechShoutTimer = 0.35;
    this.player.isAttacking = true;
    this.becauseShoutsCount++;

    sounds.playBecauseAttack();
    this.addPlayerEnergy(15);

    this.particles.push({
      x: this.player.x + this.player.width / 2,
      y: this.player.y - 12,
      vx: 0,
      vy: -1.2,
      size: 11,
      color: '#38BDF8',
      alpha: 1,
      life: 0.6,
      maxLife: 0.6,
      shape: 'letter',
      char: '+15% NỘI NĂNG ⚡ (BECAUSE!)',
    });

    const chosenPhrase = 'BECAUSE!';
    const heroShouts = [
      'Chân lý là đây: BECAUSE!',
      'Sức mạnh tình yêu: BECAUSE!',
      'Đừng hòng làm hại Trúc: BECAUSE!',
      'Chính nghĩa sẽ thắng: BECAUSE!',
    ];
    this.setPlayerSpeech(heroShouts[Math.floor(Math.random() * heroShouts.length)], 1.8);

    let targetX: number | undefined;
    let targetY: number | undefined;
    let mode: MobileAimMode = 'auto';
    let customAngleRad: number | undefined;

    if (typeof optionsOrTargetX === 'object' && optionsOrTargetX !== null) {
      targetX = optionsOrTargetX.targetX;
      targetY = optionsOrTargetX.targetY;
      mode = optionsOrTargetX.mode || 'auto';
      customAngleRad = optionsOrTargetX.customAngleRad;
    } else if (typeof optionsOrTargetX === 'number') {
      targetX = optionsOrTargetX;
      targetY = maybeTargetY;
    }

    let vx = this.player.facing === 'right' ? 14 : -14;
    let vy = -1;

    if (targetX !== undefined && targetY !== undefined) {
      const worldTargetX = targetX + this.cameraX;
      const worldTargetY = targetY + this.cameraY;
      const dx = worldTargetX - (this.player.x + this.player.width / 2);
      const dy = worldTargetY - (this.player.y + 16);
      const mag = Math.hypot(dx, dy);
      if (mag > 0) {
        vx = (dx / mag) * 14;
        vy = (dy / mag) * 14;
      }
    } else if (customAngleRad !== undefined) {
      vx = Math.cos(customAngleRad) * 14;
      vy = Math.sin(customAngleRad) * 14;
    } else if (mode === 'up') {
      vx = 0;
      vy = -14;
    } else if (mode === 'diagonal') {
      const dirX = this.player.facing === 'right' ? 1 : -1;
      vx = dirX * 14 * 0.7071;
      vy = -14 * 0.7071;
    } else if (mode === 'straight') {
      const dirX = this.player.facing === 'right' ? 1 : -1;
      vx = dirX * 14;
      vy = -1;
    } else {
      let lockedTarget = false;
      if (this.boss && this.boss.state !== 'defeated') {
        const distToBoss = Math.abs(this.boss.x - this.player.x);
        if (distToBoss < 850) {
          const bCenterX = this.boss.x + this.boss.width / 2;
          const bCenterY = this.boss.y + this.boss.height * 0.45;
          const pCenterX = this.player.x + this.player.width / 2;
          const pCenterY = this.player.y + 16;
          const dx = bCenterX - pCenterX;
          const dy = bCenterY - pCenterY;
          const mag = Math.hypot(dx, dy);
          if (mag > 0) {
            vx = (dx / mag) * 14;
            vy = (dy / mag) * 14;
            lockedTarget = true;
          }
        }
      }

      if (!lockedTarget) {
        const aliveEnemies = this.enemies.filter(
          (e) => e.state === 'alive' && Math.abs(e.x - this.player.x) < 550
        );
        if (aliveEnemies.length > 0) {
          aliveEnemies.sort(
            (a, b) =>
              Math.hypot(a.x - this.player.x, a.y - this.player.y) -
              Math.hypot(b.x - this.player.x, b.y - this.player.y)
          );
          const e = aliveEnemies[0];
          const eCenterX = e.x + e.width / 2;
          const eCenterY = e.y + e.height / 2;
          const pCenterX = this.player.x + this.player.width / 2;
          const pCenterY = this.player.y + 16;
          const dx = eCenterX - pCenterX;
          const dy = eCenterY - pCenterY;
          const mag = Math.hypot(dx, dy);
          if (mag > 0) {
            vx = (dx / mag) * 14;
            vy = (dy / mag) * 14;
            lockedTarget = true;
          }
        }
      }
    }

    if (vx > 0.5) {
      this.player.facing = 'right';
    } else if (vx < -0.5) {
      this.player.facing = 'left';
    }

    const startX = this.player.facing === 'right' ? this.player.x + this.player.width + 4 : this.player.x - 24;
    const startY = this.player.y + 12;

    this.projectiles.push({
      id: Math.random().toString(),
      x: startX,
      y: startY,
      vx,
      vy,
      text: chosenPhrase,
      size: 18,
      color: '#FACC15',
      life: 1.2,
      maxLife: 1.2,
      isFromPlayer: true,
      rotation: (Math.random() - 0.5) * 0.15,
      scale: 0.85,
    });
  }

  private spawnJumpDust() {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: this.player.x + this.player.width / 2,
        y: this.player.y + this.player.height,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2,
        size: Math.random() * 4 + 2,
        color: '#E4E4E7',
        alpha: 0.8,
        life: 0.28,
        maxLife: 0.28,
        shape: 'circle',
      });
    }
  }

  private update(dt: number) {
    this.riverTimer += dt;
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 10);
    }

    this.timeLeft = Math.max(0, this.timeLeft - dt);
    const roundedTime = Math.ceil(this.timeLeft);
    if (this.callbacks.onTimeUpdate && roundedTime !== this.lastReportedTime) {
      this.lastReportedTime = roundedTime;
      this.callbacks.onTimeUpdate(roundedTime);
    }

    if (this.timeLeft <= 0) {
      sounds.playGameOver();
      this.callbacks.onGameOver('Hết thời gian! Hãy di chuyển nhanh hơn để kịp cứu Trúc!');
      return;
    }

    if (this.trucHurtTimer > 0) {
      this.trucHurtTimer -= dt;
    }
    if (this.trucSpeechBubble) {
      this.trucSpeechBubble.timer -= dt;
      if (this.trucSpeechBubble.timer <= 0) {
        this.trucSpeechBubble = undefined;
      }
    }

    this.updatePlayer(dt);
    this.updatePlatforms(dt);
    this.updateEnemies(dt);

    if (this.boss) {
      this.updateBoss(dt);
    }

    if (this.level.id === 1 && this.level1Area === 'river') {
      this.updateThoaiNPC(dt);
    }

    if (this.level.id === 3) {
      this.updateThuanNPC(dt);
    }

    if (this.level.id === 1 && this.level1Area === 'tam_phuoc_school') {
      this.updateTruongMiniBoss(dt);

      if (this.droppedSlippersPos && !this.hasThoaiSlippers) {
        const dist = Math.hypot(
          this.player.x + this.player.width / 2 - (this.droppedSlippersPos.x + 20),
          this.player.y + this.player.height / 2 - (this.droppedSlippersPos.y + 10)
        );
        if (dist < 45) {
          this.hasThoaiSlippers = true;
          this.thoaiQuestState = 'slippers_recovered';
          sounds.playKeyGet();
          this.score += 500;
          this.spawnHeartHealParticles(this.droppedSlippersPos.x + 20, this.droppedSlippersPos.y);
          this.setPlayerSpeech('Đã nhặt Đôi Dép Của Thoại! Mau trở về cổng trả cho em!', 3.5);
        }
      }

      if (!this.truongDefeated) {
        const p = this.player;
        if (
          p.x + p.width > this.truongX + 4 &&
          p.x < this.truongX + this.truongWidth - 4 &&
          p.y + p.height > this.truongY + 4 &&
          p.y < this.truongY + this.truongHeight
        ) {
          const isStomp = p.vy > 0 && p.y + p.height <= this.truongY + 34;
          if (isStomp) {
            p.vy = -10.5;
            this.damageTruong(25);
            sounds.playStomp();
            this.screenShake = 0.5;
          } else if (p.invulnerableTimer <= 0 && this.truongInvulnerableTimer <= 0) {
            this.handlePlayerDamage();
          }
        }
      }
    }

    this.updateProjectiles(dt);
    this.updateCollectibles();
    this.updateParticles(dt);
    if (this.tapTargetEffect) {
      this.tapTargetEffect.life -= dt;
      if (this.tapTargetEffect.life <= 0) {
        this.tapTargetEffect = null;
      }
    }
    this.updateCamera();
    this.checkLevelGoal();

    if (this.callbacks.onCooldownUpdate) {
      const remaining = Math.max(0, this.player.attackCooldown);
      if (Math.abs(remaining - this.lastReportedCooldown) > 0.04 || remaining === 0) {
        this.lastReportedCooldown = remaining;
        this.callbacks.onCooldownUpdate(remaining, this.maxAttackCooldown);
      }
    }

    if (this.callbacks.onEnergyUpdate && Math.round(this.player.energy) !== this.lastReportedEnergy) {
      this.lastReportedEnergy = Math.round(this.player.energy);
      this.callbacks.onEnergyUpdate(this.player.energy, this.player.maxEnergy);
    }

    const isParryingNow = Boolean(this.player.isParrying && this.player.parryTimer && this.player.parryTimer > 0);
    if (this.callbacks.onParryStateUpdate && isParryingNow !== this.lastReportedParrying) {
      this.lastReportedParrying = isParryingNow;
      this.callbacks.onParryStateUpdate(isParryingNow, this.player.parryCooldown || 0);
    }

    if (
      this.score !== this.lastReportedScore ||
      this.coins !== this.lastReportedCoins ||
      this.player.health !== this.lastReportedHealth
    ) {
      this.lastReportedScore = this.score;
      this.lastReportedCoins = this.coins;
      this.lastReportedHealth = this.player.health;
      this.callbacks.onScoreUpdate(this.score, this.coins, this.player.health);
    }
  }

  private updatePlayer(dt: number) {
    const p = this.player;

    if (p.invulnerableTimer > 0) p.invulnerableTimer -= dt;
    if (p.attackCooldown > 0) p.attackCooldown -= dt;
    if (p.speechShoutTimer > 0) {
      p.speechShoutTimer -= dt;
      if (p.speechShoutTimer <= 0) p.isAttacking = false;
    }
    if (p.parryTimer && p.parryTimer > 0) {
      p.parryTimer -= dt;
      if (p.parryTimer <= 0) p.isParrying = false;
    }
    if (p.parryCooldown && p.parryCooldown > 0) p.parryCooldown -= dt;
    if (p.jumpBufferTimer > 0) {
      p.jumpBufferTimer -= dt;
      if (p.jumpBufferTimer <= 0) this.jumpBuffered = false;
    }
    if (p.coyoteTimer > 0) p.coyoteTimer -= dt;

    if (p.dialogueBubble) {
      p.dialogueBubble.timer -= dt;
      if (p.dialogueBubble.timer <= 0) {
        p.dialogueBubble = undefined;
      }
    }

    p.animTimer += dt;

    if ((this.jumpBuffered || p.jumpBufferTimer > 0) && p.isGrounded) {
      this.performJump();
    }

    const moveLeft = this.keysHeld['KeyA'] || this.keysHeld['ArrowLeft'];
    const moveRight = this.keysHeld['KeyD'] || this.keysHeld['ArrowRight'];

    const ACCEL = 32;
    const MAX_SPEED = 5.4;
    const FRICTION = p.isGrounded ? 22 : 8;

    if (moveLeft && !moveRight) {
      p.vx = Math.max(p.vx - ACCEL * dt, -MAX_SPEED);
      p.facing = 'left';
    } else if (moveRight && !moveLeft) {
      p.vx = Math.min(p.vx + ACCEL * dt, MAX_SPEED);
      p.facing = 'right';
    } else {
      if (p.vx > 0) {
        p.vx = Math.max(0, p.vx - FRICTION * dt);
      } else if (p.vx < 0) {
        p.vx = Math.min(0, p.vx + FRICTION * dt);
      }
    }

    const GRAVITY = 28;
    p.vy += GRAVITY * dt;
    if (p.vy > 12) p.vy = 12;

    if (p.mobileJumpSustainTimer !== undefined && p.mobileJumpSustainTimer > 0) {
      p.mobileJumpSustainTimer -= dt;
      if (p.mobileJumpSustainTimer <= 0) {
        if (!this.keysHeld['Space'] && !this.keysHeld['KeyW'] && !this.keysHeld['ArrowUp']) {
          p.mobileJumpSustainTimer = 0;
        }
      }
    }

    const jumpHeld =
      this.keysHeld['Space'] ||
      this.keysHeld['KeyW'] ||
      this.keysHeld['ArrowUp'] ||
      (p.mobileJumpSustainTimer !== undefined && p.mobileJumpSustainTimer > 0);

    if (!jumpHeld && p.vy < -4) {
      p.vy *= 0.65;
    }

    p.x += p.vx * 60 * dt;
    this.checkHorizontalPlatformCollisions(p);

    const currentMaxX =
      this.level.id === 1 && this.level1Area === 'tam_phuoc_school' ? 1200 : this.level.width;

    if (p.x < 0) {
      p.x = 0;
      p.vx = 0;
    }
    if (p.x + p.width > currentMaxX) {
      p.x = currentMaxX - p.width;
      p.vx = 0;
    }

    const prevY = p.y;
    const wasGrounded = p.isGrounded;
    p.y += p.vy * 60 * dt;

    if (p.vy >= 0) {
      let landed = false;
      const prevBottom = prevY + p.height;
      const currentBottom = p.y + p.height;

      for (const plat of this.platforms) {
        const overlapsX = p.x + p.width > plat.x + 2 && p.x < plat.x + plat.width - 2;
        if (!overlapsX) continue;

        if (prevBottom <= plat.y + 16 && currentBottom >= plat.y) {
          p.y = plat.y - p.height;
          p.vy = 0;
          p.isGrounded = true;
          landed = true;

          if (plat.isMoving && plat.speed && plat.direction) {
            p.x += plat.speed * plat.direction * 60 * dt;
          }

          if (plat.type === 'ground' || plat.type === 'bridge_wood') {
            this.lastSafeGroundedX = p.x;
            this.lastSafeGroundedY = p.y;
          }
          break;
        }
      }

      if (!landed) {
        p.isGrounded = false;
      }
    } else {
      p.isGrounded = false;
    }

    if (wasGrounded && !p.isGrounded && p.vy >= 0) {
      p.coyoteTimer = 0.12;
    }

    if (p.speechShoutTimer > 0) {
      p.state = 'shout';
    } else if (!p.isGrounded) {
      p.state = p.vy < 0 ? 'jump' : 'fall';
    } else if (Math.abs(p.vx) > 0.4) {
      p.state = 'run';
    } else {
      p.state = 'idle';
    }

    if (p.y > 530) {
      this.handleWaterPitfall();
    }
  }

  private checkHorizontalPlatformCollisions(p: Player) {
    for (const plat of this.platforms) {
      if (plat.type === 'barricade') {
        if (
          p.x < plat.x + plat.width &&
          p.x + p.width > plat.x &&
          p.y + p.height > plat.y + 12 &&
          p.y < plat.y + plat.height - 4
        ) {
          if (p.vx > 0) {
            p.x = plat.x - p.width;
            p.vx = 0;
          } else if (p.vx < 0) {
            p.x = plat.x + plat.width;
            p.vx = 0;
          }
        }
      }
    }
  }

  private handleWaterPitfall() {
    const p = this.player;
    p.health--;
    sounds.playPlayerHurt();
    this.screenShake = 1.0;

    if (p.health <= 0) {
      sounds.playGameOver();
      this.callbacks.onGameOver();
      return;
    }

    p.x = this.lastSafeGroundedX;
    p.y = this.lastSafeGroundedY;
    p.vx = 0;
    p.vy = 0;
    p.isGrounded = true;
    p.invulnerableTimer = 1.6;
  }

  private updatePlatforms(dt: number) {
    for (const plat of this.platforms) {
      if (plat.isMoving && plat.speed && plat.direction && plat.minX !== undefined && plat.maxX !== undefined) {
        plat.x += plat.speed * plat.direction * 60 * dt;
        if (plat.x <= plat.minX) {
          plat.x = plat.minX;
          plat.direction = 1;
        } else if (plat.x + plat.width >= plat.maxX) {
          plat.x = plat.maxX - plat.width;
          plat.direction = -1;
        }
      }
    }
  }

  private updateEnemies(dt: number) {
    for (const otter of this.enemies) {
      if (otter.state === 'squished') {
        otter.squishTimer -= dt;
        if (otter.squishTimer <= 0) {
          otter.state = 'dead';
        }
        continue;
      }
      if (otter.state === 'dead') continue;

      otter.animTimer += dt;

      if (otter.isJumper) {
        otter.jumpTimer = (otter.jumpTimer || 0) + dt;
        if (otter.jumpTimer > 2.2) {
          otter.vy = -6.5;
          otter.jumpTimer = 0;
        }
        otter.vy += 20 * dt;
        otter.y += otter.vy * 60 * dt;
        if (otter.y > 450) {
          otter.y = 450;
          otter.vy = 0;
        }
      }

      otter.x += otter.vx * 60 * dt;
      if (Math.abs(otter.x - otter.startX) > otter.patrolDistance) {
        otter.vx *= -1;
        otter.facing = otter.vx > 0 ? 'right' : 'left';
      }

      const p = this.player;
      if (
        p.x + p.width > otter.x + 4 &&
        p.x < otter.x + otter.width - 4 &&
        p.y + p.height > otter.y + 4 &&
        p.y < otter.y + otter.height
      ) {
        const isStomp = p.vy > 0 && p.y + p.height <= otter.y + 20;
        if (isStomp) {
          otter.state = 'squished';
          otter.squishTimer = 0.35;
          p.vy = this.keysHeld['Space'] || this.keysHeld['KeyW'] ? -11.5 : -8.5;
          sounds.playStomp();
          this.score += 150;
        } else {
          if (p.invulnerableTimer <= 0) {
            this.handlePlayerDamage();
          }
        }
      }
    }
  }

  private updateBoss(dt: number) {
    const b = this.boss;
    if (!b) return;

    b.animTimer += dt;
    if (b.invulnerableTimer > 0) b.invulnerableTimer -= dt;
    if (b.dialogueBubble) {
      b.dialogueBubble.timer -= dt;
      if (b.dialogueBubble.timer <= 0) b.dialogueBubble = undefined;
    }

    if (b.state === 'defeated') return;

    // Berserk / Enrage Phase Trigger at <= 50% HP (For CSGT, Y, BaHoLong)
    // Note: Boss Mỹ Nhi enrages by REVIVING to 100% HP after losing her entire first health bar!
    const isUnderHalfHp = b.bossType !== 'mynhi' && b.health <= b.maxHealth * 0.5;
    if (isUnderHalfHp && !b.isEnraged) {
      b.isEnraged = true;
      this.screenShake = 1.3;
      sounds.playBossHurt();
      sounds.setBossEnraged(true);

      const enrageShout =
        b.bossType === 'baholong'
          ? 'MÀY DÁM ĐỤNG VÀO TAO?! TAO NỔI ĐIÊN RỒI! BẢO TÁP ĐÔ LA VÀ XÚC XẮC CUỒNG NỘ!!!'
          : b.bossType === 'y'
          ? 'ANH KHÔNG QUAY LẠI VỚI EM THÌ ĐỪNG HÒNG ĐẾN ĐƯỢC CHỖ CON TRÚC! BÃO TRÀ SỮA & 50K TOÀN LỰC!!!'
          : 'CHỐNG NGƯỜI THI HÀNH CÔNG VỤ?! BẮN LIÊN THANH TỔNG LỰC!!!';

      b.dialogueBubble = {
        text: enrageShout,
        timer: 2.8,
      };
    }

    if (b.state === 'stunned') {
      b.stunTimer -= dt;
      if (b.stunTimer <= 0) {
        b.state = 'idle';
        b.isShootingGun = false;
        b.phaseTimer = b.isEnraged ? 0.45 : 0.9;
      }
      return;
    }

    if (b.isShootingGun && b.gunShootTimer !== undefined) {
      b.gunShootTimer -= dt;
      if (b.gunShootTimer <= 0) {
        b.isShootingGun = false;
      }
    }

    const phaseDt = b.isEnraged ? dt * 1.5 : dt;
    b.phaseTimer -= phaseDt;
    b.attackCooldown -= phaseDt;

    const p = this.player;
    b.facing = p.x < b.x ? 'left' : 'right';

    if (b.phaseTimer <= 0) {
      if (b.bossType === 'mynhi') {
        const rand = Math.random();
        if (!b.isEnraged) {
          // DẠNG 1 (Hình 1 & 2): Phóng Hoa Hồng Phấn & Bão Hoa Hồng (Flower Barrage)
          if (rand < 0.58) {
            this.executeMyNhiRoseAttack();
          } else {
            this.executeMyNhiFlowerBarrage();
          }
        } else {
          // DẠNG 2 HÓA ĐIÊN (Hình 3 & 4): Phóng Hoa Hồng Đẫm Máu & Đại Địa Chấn Gai Máu
          if (rand < 0.52) {
            this.executeMyNhiBloodFlowerAttack();
          } else {
            this.executeMyNhiBloodThornBarrage();
          }
        }
      } else if (b.bossType === 'baholong') {
        const rand = Math.random();
        if (rand < 0.42) {
          this.executeBaHoLongDiceAttack();
        } else if (rand < 0.78) {
          this.executeBaHoLongMoneyAttack();
        } else if (rand < 0.93) {
          b.state = 'jump_slam';
          b.phaseTimer = b.isEnraged ? 1.2 : 1.8;
          b.vy = b.isEnraged ? -13.0 : -10.5;
        } else {
          b.state = 'whistle_attack';
          b.phaseTimer = b.isEnraged ? 0.9 : 1.4;
          this.executeBaHoLongTaunt();
        }
      } else if (b.bossType === 'y') {
        const rand = Math.random();
        if (rand < 0.44) {
          this.executeYBobaAttack();
        } else if (rand < 0.76) {
          this.executeYPearlAttack();
        } else {
          this.executeY50kAttack();
        }
      } else {
        const rand = Math.random();
        if (rand < 0.40) {
          b.state = 'gun_attack';
          b.isShootingGun = true;
          b.gunShootTimer = b.isEnraged ? 1.4 : 1.2;
          b.phaseTimer = b.isEnraged ? 1.2 : 1.7;
          this.executeBossGunAttack();
        } else if (rand < 0.68) {
          b.state = 'whistle_attack';
          b.phaseTimer = b.isEnraged ? 0.9 : 1.4;
          this.executeBossWhistleAttack();
        } else if (rand < 0.86) {
          b.state = 'citation_attack';
          b.phaseTimer = b.isEnraged ? 1.0 : 1.5;
          this.executeBossCitationAttack();
        } else {
          b.state = 'jump_slam';
          b.phaseTimer = b.isEnraged ? 1.2 : 1.8;
          b.vy = b.isEnraged ? -12.5 : -10;
        }
      }
    }

    if (b.state === 'jump_slam') {
      b.vy += (b.isEnraged ? 28 : 24) * dt;
      b.y += b.vy * 60 * dt;
      const jumpSpeed = b.isEnraged ? 3.4 : 2.2;
      b.x += (b.facing === 'left' ? -jumpSpeed : jumpSpeed) * 60 * dt;

      if (b.y >= (b.bossType === 'baholong' ? 365 : 404)) {
        b.y = b.bossType === 'baholong' ? 365 : 404;
        b.vy = 0;
        b.state = 'idle';
        this.screenShake = b.isEnraged ? 1.4 : 1.0;
        sounds.playBossHurt();

        const shockType = b.bossType === 'baholong' ? 'cane_shock' : 'ground_shock';
        this.bossAttacks.push({
          id: Math.random().toString(),
          x: b.x - 20,
          y: 470,
          vx: -6.5,
          vy: 0,
          type: shockType,
          width: 24,
          height: 24,
          life: 1.6,
        });
        this.bossAttacks.push({
          id: Math.random().toString(),
          x: b.x + b.width + 10,
          y: 470,
          vx: 6.5,
          vy: 0,
          type: shockType,
          width: 24,
          height: 24,
          life: 1.6,
        });
      }
    } else if (b.state === 'idle' || b.state === 'patrol') {
      const walkSpeed = b.isEnraged ? 2.1 : 1.2;
      b.x += (b.facing === 'left' ? -walkSpeed : walkSpeed) * 60 * dt;
      const minX = b.bossType === 'mynhi' ? 620 : b.bossType === 'y' ? 1200 : 720;
      const maxX = b.bossType === 'mynhi' ? 1280 : b.bossType === 'y' ? 2050 : 1880;
      if (b.x < minX) {
        b.x = minX;
        b.facing = 'right';
      }
      if (b.x > maxX) {
        b.x = maxX;
        b.facing = 'left';
      }
    }

    if (
      p.invulnerableTimer <= 0 &&
      p.x + p.width > b.x + 8 &&
      p.x < b.x + b.width - 8 &&
      p.y + p.height > b.y + 8 &&
      p.y < b.y + b.height
    ) {
      this.handlePlayerDamage();
    }
  }

  /**
   * BOSS MỸ NHI - DẠNG 1 CHIÊU 1 (Hình 2 Basic Attack):
   * Phóng Hoa Hồng Phấn nhắm thẳng về phía Trúc (đứng ở x=110, y=414)
   */
  private executeMyNhiRoseAttack() {
    if (!this.boss) return;
    const b = this.boss;
    b.state = 'rose_throw';
    b.phaseTimer = 1.9;

    const taunts = [
      'Con Trúc kia! Đỡ lấy cành hoa hồng đầy gai này đi!',
      'Set son 500k năm xưa còn đây, sao anh lại chọn nó?!',
      'Tránh ra Phước! Để em xử lý con nhỏ Trúc này!',
    ];
    b.dialogueBubble = {
      text: taunts[Math.floor(Math.random() * taunts.length)],
      timer: 1.8,
    };

    const shots = [0, 340];
    shots.forEach((delay, idx) => {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;
        sounds.playSlipperThrow();

        const spawnX = this.boss.x - 10;
        const spawnY = this.boss.y + 28 + idx * 8;
        const dx = this.trucX + this.trucWidth / 2 - spawnX;
        const dy = this.trucY + 22 - spawnY;
        const mag = Math.hypot(dx, dy) || 1;
        const speed = 7.4;

        this.bossAttacks.push({
          id: Math.random().toString(),
          x: spawnX,
          y: spawnY,
          vx: (dx / mag) * speed,
          vy: (dy / mag) * speed,
          type: 'rose_flower',
          width: 30,
          height: 20,
          life: 4.0,
          rotation: Math.atan2(dy, dx),
          targetsTruc: true,
        });
      }, delay);
    });
  }

  /**
   * BOSS MỸ NHI - DẠNG 1 CHIÊU 2 (Hình 2 Ultimate Cast & Flower Barrage):
   * Bão Gai Hoa Hồng Phấn càn quét về phía Phước và Trúc
   */
  private executeMyNhiFlowerBarrage() {
    if (!this.boss) return;
    const b = this.boss;
    b.state = 'flower_barrage';
    b.phaseTimer = 2.4;

    b.dialogueBubble = {
      text: 'BÃO HOA HỒNG TÌNH CŨ! VÙI LẤP CON TRÚC ĐI! 🌹',
      timer: 2.0,
    };
    this.screenShake = 0.5;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;
        sounds.playSlipperThrow();

        const spawnX = this.boss.x - 12;
        const spawnY = 395 + (i - 1) * 18;
        const dx = this.trucX + 18 - spawnX;
        const dy = this.trucY + 24 - spawnY;
        const mag = Math.hypot(dx, dy) || 1;
        const speed = 7.8 + i * 0.6;

        this.bossAttacks.push({
          id: Math.random().toString(),
          x: spawnX,
          y: spawnY,
          vx: (dx / mag) * speed,
          vy: (dy / mag) * speed,
          type: 'flower_barrage',
          width: 34,
          height: 22,
          life: 4.0,
          rotation: Math.atan2(dy, dx),
          targetsTruc: true,
        });
      }, i * 240);
    }
  }

  /**
   * BOSS MỸ NHI - DẠNG 2 HÓA ĐIÊN CHIÊU 1 (Hình 4 Blood Flower Projectile):
   * Phóng Hoa Hồng Đẫm Máu tốc độ cao nhắm thẳng vào Trúc
   */
  private executeMyNhiBloodFlowerAttack() {
    if (!this.boss) return;
    const b = this.boss;
    b.state = 'blood_flower_throw';
    b.phaseTimer = 1.6;

    const taunts = [
      'HOA HỒNG ĐẪM MÁU! XUYÊN TIM CON TRÚC ĐI! 🥀🩸',
      'PHƯỚC KHÔNG THUỘC VỀ TAO THÌ ĐỪNG HÒNG AI CÓ ĐƯỢC!',
      'ĐỠ THỬ CÀNH HOA Nhuốm Máu NÀY XEM PHƯỚC!',
    ];
    b.dialogueBubble = {
      text: taunts[Math.floor(Math.random() * taunts.length)],
      timer: 1.8,
    };

    const shots = [0, 240, 480];
    shots.forEach((delay, idx) => {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;
        sounds.playSlipperThrow();

        const spawnX = this.boss.x - 12;
        const spawnY = this.boss.y + 22 + (idx - 1) * 12;
        const dx = this.trucX + 18 - spawnX;
        const dy = this.trucY + 22 - spawnY;
        const mag = Math.hypot(dx, dy) || 1;
        const speed = 9.0;

        this.bossAttacks.push({
          id: Math.random().toString(),
          x: spawnX,
          y: spawnY,
          vx: (dx / mag) * speed,
          vy: (dy / mag) * speed,
          type: 'blood_flower',
          width: 32,
          height: 22,
          life: 4.0,
          rotation: Math.atan2(dy, dx),
          targetsTruc: true,
        });
      }, delay);
    });
  }

  /**
   * BOSS MỸ NHI - DẠNG 2 HÓA ĐIÊN CHIÊU TỐI THƯỢNG (Hình 4 Blood Thorn Ultimate & Barrage):
   * Đại Địa Chấn Bão Gai Hoa Hồng Đẫm Máu
   */
  private executeMyNhiBloodThornBarrage() {
    if (!this.boss) return;
    const b = this.boss;
    b.state = 'blood_thorn_barrage';
    b.phaseTimer = 2.1;
    this.screenShake = 0.9;

    b.dialogueBubble = {
      text: 'ĐẠI ĐỊA CHẤN BÃO GAI MÁU! CHÔN VÙI TẤT CẢ! 🔥🥀',
      timer: 2.0,
    };

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;
        sounds.playSlipperThrow();

        const spawnX = this.boss.x - 15;
        const spawnY = 385 + (i % 2 === 0 ? -10 : 14);
        const dx = this.trucX + 18 - spawnX;
        const dy = this.trucY + 24 - spawnY;
        const mag = Math.hypot(dx, dy) || 1;
        const speed = 9.4 + i * 0.5;

        this.bossAttacks.push({
          id: Math.random().toString(),
          x: spawnX,
          y: spawnY,
          vx: (dx / mag) * speed,
          vy: (dy / mag) * speed,
          type: 'blood_thorn_wave',
          width: 38,
          height: 24,
          life: 4.2,
          rotation: Math.atan2(dy, dx),
          targetsTruc: true,
        });
      }, i * 210);
    }
  }

  private executeBaHoLongDiceAttack() {
    if (!this.boss) return;
    const b = this.boss;
    const dir = b.facing === 'left' ? -1 : 1;
    b.state = 'dice_throw';
    b.phaseTimer = b.isEnraged ? 1.8 : 2.6;

    const taunts = b.isEnraged
      ? [
          'BÃO XÚC XẮC CUỒNG NỘ! CHẾT ĐI PHƯỚC!',
          'XÚC XẮC TỬ THẦN! NÉ SAO ĐƯỢC NỮA?!',
        ]
      : [
          'XÚC XẮC ĐỊNH MỆNH! ĐỠ LẤY PHƯỚC!',
          'NÉ THỬ CẶP XÚC XẮC NÀY XEM!',
        ];

    b.dialogueBubble = {
      text: taunts[Math.floor(Math.random() * taunts.length)],
      timer: 1.8,
    };

    if (b.isEnraged) {
      sounds.playBaHoLongUltimateSkill();
    }

    const bursts = b.isEnraged ? [0, 200, 400, 600, 800] : [0, 300, 600, 900];
    const diceCountPerBurst = b.isEnraged ? 3 : 2;

    bursts.forEach((delay, burstIdx) => {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;

        sounds.playDiceThrow();
        const spawnX = this.boss.x + (dir === 1 ? this.boss.width : 0);
        const spawnY = this.boss.y + 24;

        for (let d = 0; d < diceCountPerBurst; d++) {
          const angle = -0.25 - Math.random() * 0.35;
          const speed = (b.isEnraged ? 7.2 : 5.5) + Math.random() * 3.0;

          this.bossAttacks.push({
            id: Math.random().toString(),
            x: spawnX,
            y: spawnY - d * 5,
            vx: dir * Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            type: 'dice_shot',
            width: 24,
            height: 24,
            life: 3.5,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * (b.isEnraged ? 25 : 16),
            bounceCount: 0,
            pipNumber: Math.floor(Math.random() * 6) + 1,
          });
        }

        if (burstIdx === 0) {
          this.screenShake = b.isEnraged ? 0.7 : 0.5;
        }
      }, delay);
    });
  }

  private executeBaHoLongMoneyAttack() {
    if (!this.boss) return;
    const b = this.boss;
    const dir = b.facing === 'left' ? -1 : 1;
    b.state = 'money_throw';
    b.phaseTimer = b.isEnraged ? 1.7 : 2.4;

    const taunts = b.isEnraged
      ? [
          'BÃO TIỀN ĐÔ HUỶ DIỆT! TAO RẢI TIỀN CHÔN SỐNG MÀY!',
          'LỐC XOÁY ĐÔ LA TỔNG LỰC ĐÂY!',
        ]
      : [
          'TIỀN NÀY! CẦM LẤY RỒI BIẾN KHỎI SÀI GÒN!',
          'TAO KHÔNG THIẾU TIỀN! ĐỠ LẤY BÃO ĐÔ LA NÀY!',
        ];

    b.dialogueBubble = {
      text: taunts[Math.floor(Math.random() * taunts.length)],
      timer: 1.8,
    };

    sounds.playBaHoLongUltimateSkill();

    const waves = b.isEnraged ? [0, 190, 380, 570, 760] : [0, 280, 560];
    const itemsPerWave = b.isEnraged ? 5 : 3;

    waves.forEach((delay, waveIdx) => {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;

        sounds.playMoneyThrow();
        const spawnX = this.boss.x + (dir === 1 ? this.boss.width : 0);
        const spawnY = this.boss.y + 26;

        for (let i = 0; i < itemsPerWave; i++) {
          const angle = -0.35 + i * (0.6 / itemsPerWave);
          const speed = (b.isEnraged ? 6.8 : 5.2) + i * 1.1;
          const isStack = i % 2 === 1 && (waveIdx % 2 === 1 || b.isEnraged);

          this.bossAttacks.push({
            id: Math.random().toString(),
            x: spawnX,
            y: spawnY + (i - 2) * 8,
            vx: dir * Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            type: isStack ? 'money_stack' : 'dollar_bill',
            width: isStack ? 32 : 28,
            height: isStack ? 18 : 14,
            life: 3.2,
            rotation: Math.random() * Math.PI,
            rotationSpeed: dir * (b.isEnraged ? 10 : 6),
          });
        }
      }, delay);
    });
  }

  private executeBossGunAttack() {
    if (!this.boss) return;
    const b = this.boss;
    const dir = b.facing === 'left' ? -1 : 1;
    b.dialogueBubble = {
      text: b.isEnraged ? 'BẮN CẢNH CÁO TỔNG LỰC! ĐẦU HÀNG MAU!' : 'ĐỨNG LẠI! GIƠ TAY LÊN!',
      timer: 1.6,
    };

    sounds.playCsgtUltimateSkill();

    const bulletShots = b.isEnraged ? [200, 380, 540] : [320, 560];
    bulletShots.forEach((delay, idx) => {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;
        sounds.playGunshot();
        this.screenShake = b.isEnraged ? 0.8 : 0.6;

        this.bossAttacks.push({
          id: Math.random().toString(),
          x: this.boss.x + (dir === 1 ? this.boss.width + 12 : -12),
          y: this.boss.y + 36,
          vx: dir * (b.isEnraged ? 13.5 : 11.0),
          vy: idx === 1 ? -0.8 : idx === 2 ? 0.8 : 0,
          type: 'bullet_shot',
          width: 22,
          height: 10,
          life: 2.5,
        });
      }, delay);
    });
  }

  private executeBossWhistleAttack() {
    if (!this.boss) return;
    const b = this.boss;
    sounds.playBossWhistle();
    const dir = b.facing === 'left' ? -1 : 1;

    const count = b.isEnraged ? 5 : 3;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;
        this.bossAttacks.push({
          id: Math.random().toString(),
          x: this.boss.x + (dir === 1 ? this.boss.width : 0),
          y: this.boss.y + 24,
          vx: dir * ((b.isEnraged ? 7.0 : 5.5) + i * 1.5),
          vy: (i - Math.floor(count / 2)) * 1.3,
          type: 'whistle_wave',
          width: 28,
          height: 28,
          life: 2.2,
        });
      }, i * (b.isEnraged ? 130 : 180));
    }
  }

  private executeBossCitationAttack() {
    if (!this.boss) return;
    const dir = this.boss.facing === 'left' ? -1 : 1;

    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated') return;
        this.bossAttacks.push({
          id: Math.random().toString(),
          x: this.boss.x + (dir === 1 ? this.boss.width : 0),
          y: this.boss.y + 30,
          vx: dir * 7.0,
          vy: -2 + i * 3,
          type: 'citation_paper',
          width: 22,
          height: 28,
          life: 2.4,
          rotation: 0,
        });
      }, i * 220);
    }
  }

  private executeBaHoLongTaunt() {
    if (!this.boss) return;
    const lines = [
      'Trúc là của tao! Mày nghèo đừng mơ!',
      'Mày chỉ có set son 500k mà đòi đú!',
      'Tao giàu nứt đố đổ vách, mày có gì?!',
    ];
    this.boss.dialogueBubble = {
      text: lines[Math.floor(Math.random() * lines.length)],
      timer: 1.8,
    };
  }

  private executeYBobaAttack() {
    if (!this.boss) return;
    const b = this.boss;
    const dir = b.facing === 'left' ? -1 : 1;
    b.state = 'boba_throw';
    b.phaseTimer = b.isEnraged ? 1.4 : 2.0;

    b.dialogueBubble = {
      text: b.isEnraged
        ? 'BÃO TRÀ SỮA TRÂN CHÂU ĐƯỜNG ĐEN! NÉ SAO ĐƯỢC?!'
        : 'Trà sữa full topping em mua cho anh nè, quay lại với em đi!',
      timer: 1.8,
    };

    if (b.isEnraged) {
      sounds.playBossYUltimateSkill();
    } else {
      sounds.playBobaSplash();
    }

    const cupCount = b.isEnraged ? 2 : 1;
    for (let c = 0; c < cupCount; c++) {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;
        const spawnX = this.boss.x + (dir === 1 ? this.boss.width : 0);
        const spawnY = this.boss.y + 16 - c * 8;
        const speed = (b.isEnraged ? 9.5 : 7.5) + c * 1.5;
        const angle = -0.15 - c * 0.15;

        this.bossAttacks.push({
          id: Math.random().toString(),
          x: spawnX,
          y: spawnY,
          vx: dir * Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          type: 'boba_cup',
          width: 26,
          height: 36,
          life: 3.2,
          rotation: 0,
          rotationSpeed: dir * (b.isEnraged ? 9 : 6),
        });
      }, c * 220);
    }
  }

  private executeYPearlAttack() {
    if (!this.boss) return;
    const b = this.boss;
    const dir = b.facing === 'left' ? -1 : 1;
    b.state = 'pearl_barrage';
    b.phaseTimer = b.isEnraged ? 1.5 : 2.2;

    b.dialogueBubble = {
      text: 'Trân châu dai giòn, đố anh né được!',
      timer: 1.8,
    };

    const count = b.isEnraged ? 5 : 3;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!this.boss || this.boss.state === 'stunned' || this.boss.state === 'defeated' || this.isPaused) return;
        const spawnX = this.boss.x + (dir === 1 ? this.boss.width : 0);
        const spawnY = this.boss.y + 24;
        const angle = -0.1 - i * 0.08;
        const speed = (b.isEnraged ? 8.0 : 6.0) + Math.random() * 2.5;

        this.bossAttacks.push({
          id: Math.random().toString(),
          x: spawnX,
          y: spawnY,
          vx: dir * Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          type: 'boba_pearl',
          width: 16,
          height: 16,
          life: 3.5,
          bounceCount: 0,
        });
      }, i * (b.isEnraged ? 120 : 180));
    }
  }

  private executeY50kAttack() {
    if (!this.boss) return;
    const b = this.boss;
    const dir = b.facing === 'left' ? -1 : 1;
    b.state = 'money50k_throw';
    b.phaseTimer = b.isEnraged ? 1.3 : 1.9;

    b.dialogueBubble = {
      text: '50K NÈ! CẦM TIỀN MUA TRÀ SỮA RỒI BỎ CON TRÚC ĐI!',
      timer: 1.8,
    };

    const count = b.isEnraged ? 4 : 2;
    for (let i = 0; i < count; i++) {
      const angle = -0.25 + i * 0.18;
      const speed = b.isEnraged ? 8.5 : 7.0;
      this.bossAttacks.push({
        id: Math.random().toString(),
        x: this.boss.x + (dir === 1 ? this.boss.width : 0),
        y: this.boss.y + 28 + (i - 1) * 8,
        vx: dir * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'bill_50k',
        width: 32,
        height: 18,
        life: 2.8,
        rotation: 0,
        rotationSpeed: dir * 7,
      });
    }
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.life -= dt;
      proj.x += proj.vx * 60 * dt;
      proj.y += proj.vy * 60 * dt;
      proj.scale = Math.min(1.25, proj.scale + dt * 0.8);

      if (this.boss && this.boss.state !== 'defeated') {
        const b = this.boss;
        if (
          proj.x + 40 > b.x &&
          proj.x < b.x + b.width &&
          proj.y + 20 > b.y &&
          proj.y < b.y + b.height
        ) {
          const hitDmg = proj.damage !== undefined ? proj.damage : 10;
          b.health = Math.max(0, b.health - hitDmg);
          b.invulnerableTimer = 0.3;
          b.state = 'stunned';
          b.stunTimer = 0.45;
          b.vx = proj.vx > 0 ? 3 : -3;
          this.screenShake = 0.9;
          if (proj.projType === 'lipstick') {
            sounds.playLipstickHit();
          } else {
            sounds.playBossHurt();
          }

          if (this.callbacks.onBossHealthUpdate && b.health !== this.lastReportedBossHp) {
            this.lastReportedBossHp = b.health;
            this.callbacks.onBossHealthUpdate(b.health, b.maxHealth);
          }

          // === BOSS MỸ NHI (MÀN CUỐI): HẾT 100% MÁU ĐẦU SẼ HỒI SINH DẠNG 2 HÓA ĐIÊN! ===
          if (b.bossType === 'mynhi') {
            if (b.health <= 0 && !b.hasRevivedPhase2) {
              // HỒI SINH DẠNG 2 HÓA ĐIÊN (Hình 3 & Hình 4)
              b.hasRevivedPhase2 = true;
              b.isEnraged = true;
              b.health = 100;
              b.maxHealth = 100;
              b.state = 'idle';
              this.bossAttacks = [];
              this.screenShake = 1.6;
              sounds.startBossMusic('mynhi_enraged');

              if (this.callbacks.onBossHealthUpdate) {
                this.callbacks.onBossHealthUpdate(
                  100,
                  100,
                  '🔥 MỸ NHI (HÓA ĐIÊN DẠNG 2 - HOA HỒNG ĐẪM MÁU)'
                );
              }

              if (this.callbacks.onBossStoryEvent) {
                this.pause();
                this.callbacks.onBossStoryEvent({
                  stage: 'mynhi_revive_phase2',
                  speaker: 'Mỹ Nhi (Hóa Điên Dạng 2)',
                  currentDialogIndex: 0,
                  dialogues: [],
                  lines: getStoryEventLines('mynhi_revive_phase2'),
                });
              }
              this.projectiles.splice(i, 1);
              continue;
            } else if (b.health <= 0 && b.hasRevivedPhase2 && !b.hit100PercentCutscene) {
              // ĐÁNH BẠI HOÀN TOÀN DẠNG 2 -> MỸ NHI TỈNH NGỘ CHÚC PHÚC & HÔN NHAU
              b.hit100PercentCutscene = true;
              b.state = 'defeated';
              this.bossAttacks = [];
              this.score += 5000;
              sounds.playVictory();

              if (this.callbacks.onBossStoryEvent) {
                this.pause();
                this.callbacks.onBossStoryEvent({
                  stage: 'mynhi_defeated',
                  speaker: 'Mỹ Nhi, Phước & Trúc',
                  currentDialogIndex: 0,
                  dialogues: [],
                  lines: getStoryEventLines('mynhi_defeated'),
                });
              }
              this.projectiles.splice(i, 1);
              continue;
            }
          }

          // === BOSS CSGT STORY DIALOGUE MILESTONES ===
          if (b.bossType === 'csgt') {
            if (b.health <= 50 && !b.hit50PercentCutscene && this.callbacks.onBossStoryEvent) {
              b.hit50PercentCutscene = true;
              this.pause();
              this.callbacks.onBossStoryEvent({
                stage: 'phase_csgt_50',
                speaker: 'Trưởng Trạm CSGT',
                currentDialogIndex: 0,
                dialogues: [],
                lines: getStoryEventLines('phase_csgt_50'),
              });
              this.projectiles.splice(i, 1);
              continue;
            }
          }

          // === BOSS Ý STORY DIALOGUE MILESTONES (Màn 3) ===
          if (b.bossType === 'y') {
            if (b.health <= 50 && !b.hit50PercentCutscene && this.callbacks.onBossStoryEvent) {
              b.hit50PercentCutscene = true;
              this.pause();
              this.callbacks.onBossStoryEvent({
                stage: 'y_50',
                speaker: 'Ý, Thuận & Phước',
                currentDialogIndex: 0,
                dialogues: [],
                lines: getStoryEventLines('y_50'),
              });
              this.projectiles.splice(i, 1);
              continue;
            }

            if (b.health <= 0 && !b.hit100PercentCutscene && this.callbacks.onBossStoryEvent) {
              b.hit100PercentCutscene = true;
              b.state = 'defeated';
              this.hasDinhKey = true;
              this.thuanState = 'cheer';
              this.score += 2500;
              sounds.playVictory();
              this.pause();
              this.callbacks.onBossStoryEvent({
                stage: 'y_defeated',
                speaker: 'Ý, Thuận & Phước',
                currentDialogIndex: 0,
                dialogues: [],
                lines: getStoryEventLines('y_defeated'),
              });
              this.projectiles.splice(i, 1);
              continue;
            }
          }

          // === BÁ HỘ LONG STORY DIALOGUE MILESTONES (Màn 4) ===
          if (b.bossType === 'baholong') {
            if (b.health <= 70 && !b.hit30PercentCutscene && this.callbacks.onBossStoryEvent) {
              b.hit30PercentCutscene = true;
              this.pause();
              this.callbacks.onBossStoryEvent({
                stage: 'phase1_30',
                speaker: 'Bá Hộ Long',
                currentDialogIndex: 0,
                dialogues: [],
                lines: getStoryEventLines('phase1_30'),
              });
              this.projectiles.splice(i, 1);
              continue;
            }

            if (b.health <= 50 && !b.hit50PercentCutscene && this.callbacks.onBossStoryEvent) {
              b.hit50PercentCutscene = true;
              this.pause();
              this.callbacks.onBossStoryEvent({
                stage: 'phase_long_50',
                speaker: 'Bá Hộ Long',
                currentDialogIndex: 0,
                dialogues: [],
                lines: getStoryEventLines('phase_long_50'),
              });
              this.projectiles.splice(i, 1);
              continue;
            }

            if (b.health <= 30 && !b.hit70PercentCutscene && this.callbacks.onBossStoryEvent) {
              b.hit70PercentCutscene = true;
              this.pause();
              this.callbacks.onBossStoryEvent({
                stage: 'phase2_70',
                speaker: 'Bá Hộ Long',
                currentDialogIndex: 0,
                dialogues: [],
                lines: getStoryEventLines('phase2_70'),
              });
              this.projectiles.splice(i, 1);
              continue;
            }

            if (b.health <= 0 && !b.hit100PercentCutscene && this.callbacks.onBossStoryEvent) {
              b.hit100PercentCutscene = true;
              b.state = 'defeated';
              this.pause();
              this.callbacks.onBossStoryEvent({
                stage: 'phase3_100',
                speaker: 'Bá Hộ Long',
                currentDialogIndex: 0,
                dialogues: [],
                lines: getStoryEventLines('phase3_100'),
              });
              this.projectiles.splice(i, 1);
              continue;
            }
          }

          if (b.health <= 0) {
            b.state = 'defeated';
            b.isShootingGun = false;
            sounds.playVictory();
            this.score += 2000;
          }

          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (this.level.id === 1 && this.level1Area === 'tam_phuoc_school' && !this.truongDefeated) {
        if (
          proj.x + 36 > this.truongX &&
          proj.x < this.truongX + this.truongWidth &&
          proj.y + 20 > this.truongY &&
          proj.y < this.truongY + this.truongHeight
        ) {
          const hitDmg = proj.damage !== undefined ? proj.damage : 20;
          if (proj.projType === 'lipstick') {
            sounds.playLipstickHit();
          }
          this.damageTruong(hitDmg);
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      let hitEnemy = false;
      for (const enemy of this.enemies) {
        if (enemy.state === 'alive') {
          if (
            proj.x + 36 > enemy.x &&
            proj.x < enemy.x + enemy.width &&
            proj.y + 20 > enemy.y &&
            proj.y < enemy.y + enemy.height
          ) {
            enemy.state = 'squished';
            enemy.squishTimer = 0.5;
            sounds.playStomp();
            this.score += 200;
            this.screenShake = 0.4;
            this.projectiles.splice(i, 1);
            hitEnemy = true;
            break;
          }
        }
      }
      if (hitEnemy) continue;

      if (proj.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }

    for (let j = this.bossAttacks.length - 1; j >= 0; j--) {
      const atk = this.bossAttacks[j];
      atk.life -= dt;

      if (atk.type === 'boba_cup') {
        atk.vy += 18 * dt;
        atk.x += atk.vx * 60 * dt;
        atk.y += atk.vy * 60 * dt;
        atk.rotation = (atk.rotation || 0) + (atk.rotationSpeed || 8) * dt;
        if (atk.y >= 475) {
          sounds.playBobaSplash();
          this.bossAttacks.splice(j, 1);
          continue;
        }
      } else if (atk.type === 'boba_pearl') {
        atk.vy += 22 * dt;
        atk.x += atk.vx * 60 * dt;
        atk.y += atk.vy * 60 * dt;
        if (atk.y >= 485 && atk.vy > 0) {
          atk.y = 485;
          atk.vy = -atk.vy * 0.65;
          atk.vx *= 0.85;
          atk.bounceCount = (atk.bounceCount || 0) + 1;
        }
      } else if (atk.type === 'bill_50k') {
        atk.x += atk.vx * 60 * dt;
        atk.y += (atk.vy + Math.sin(this.riverTimer * 9 + (atk.rotation || 0)) * 0.45) * 60 * dt;
        if (atk.rotation !== undefined) {
          atk.rotation += (atk.rotationSpeed || 8) * dt;
        }
      } else if (atk.type === 'dice_shot') {
        atk.vy += 22 * dt;
        atk.x += atk.vx * 60 * dt;
        atk.y += atk.vy * 60 * dt;
        atk.rotation = (atk.rotation || 0) + (atk.rotationSpeed || 10) * dt;
        if (atk.y >= 470 && atk.vy > 0) {
          atk.y = 470;
          atk.vy = -atk.vy * 0.65;
          atk.vx *= 0.85;
          atk.bounceCount = (atk.bounceCount || 0) + 1;
        }
      } else if (atk.type === 'dollar_bill' || atk.type === 'money_stack') {
        atk.x += atk.vx * 60 * dt;
        atk.y += (atk.vy + Math.sin(this.riverTimer * 7 + (atk.rotation || 0)) * 0.45) * 60 * dt;
        if (atk.rotation !== undefined) {
          atk.rotation += (atk.rotationSpeed || 6) * dt;
        }
      } else {
        atk.x += atk.vx * 60 * dt;
        atk.y += atk.vy * 60 * dt;
        if (atk.rotationSpeed) {
          atk.rotation = (atk.rotation || 0) + atk.rotationSpeed * dt;
        }
      }

      const p = this.player;
      const isParryingActive = Boolean(p.isParrying && p.parryTimer && p.parryTimer > 0);
      // Khi bật khiên Parry, mở rộng vùng chắn thêm 18px để Phước dễ dàng đỡ hoa hồng bảo vệ Trúc!
      const pad = isParryingActive ? 18 : 0;

      if (
        p.invulnerableTimer <= 0 &&
        p.x + p.width + pad > atk.x &&
        p.x - pad < atk.x + atk.width &&
        p.y + p.height + pad > atk.y &&
        p.y - pad < atk.y + atk.height
      ) {
        if (isParryingActive) {
          sounds.playParrySuccessSkill();
          this.screenShake = 0.8;
          this.addPlayerEnergy(15);

          for (let sp = 0; sp < 10; sp++) {
            this.particles.push({
              x: atk.x + atk.width / 2,
              y: atk.y + atk.height / 2,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              size: Math.random() * 5 + 3,
              color: ['#38BDF8', '#FDE047', '#FFFFFF', '#60A5FA'][sp % 4],
              alpha: 1,
              life: 0.45,
              maxLife: 0.45,
              shape: 'star',
            });
          }

          this.particles.push({
            x: p.x + p.width / 2,
            y: p.y - 14,
            vx: 0,
            vy: -1.6,
            size: 13,
            color: '#38BDF8',
            alpha: 1,
            life: 0.85,
            maxLife: 0.85,
            shape: 'letter',
            char: 'PARRY BẢO VỆ TRÚC! 🛡️ (+15% NỘI NĂNG)',
          });

          const deflectDir = p.facing === 'right' ? 1 : -1;
          this.projectiles.push({
            id: 'reflected-' + Math.random().toString(),
            x: atk.x,
            y: atk.y,
            vx: deflectDir * 16,
            vy: -1.0,
            text: 'PHẢN ĐÒN ⚡',
            size: 16,
            color: '#38BDF8',
            life: 1.5,
            maxLife: 1.5,
            isFromPlayer: true,
            rotation: 0,
            scale: 0.9,
            projType: 'reflected',
            damage: 15,
          });

          this.bossAttacks.splice(j, 1);
          continue;
        }

        this.handlePlayerDamage();
        this.bossAttacks.splice(j, 1);
        continue;
      }

      // === KIỂM TRA ĐÒN ĐÁNH TRÚNG TRÚC TRONG MÀN 5 (MỖI LẦN TRÚNG MẤT 10 MÁU, HẾT 50 MÁU LÀ THUA!) ===
      if (
        this.level.id === 5 &&
        atk.x + atk.width > this.trucX + 4 &&
        atk.x < this.trucX + this.trucWidth - 4 &&
        atk.y + atk.height > this.trucY + 4 &&
        atk.y < this.trucY + this.trucHeight
      ) {
        this.trucHp = Math.max(0, this.trucHp - 10);
        this.trucHurtTimer = 0.6;
        this.screenShake = 1.0;
        sounds.playPlayerHurt();

        this.trucSpeechBubble = {
          text: `Áaa! Hoa hồng gai đâm trúng em rồi! (-10 HP, còn ${this.trucHp}/50 HP)`,
          timer: 2.2,
        };

        this.particles.push({
          x: this.trucX + this.trucWidth / 2,
          y: this.trucY - 12,
          vx: 0,
          vy: -1.6,
          size: 13,
          color: '#EF4444',
          alpha: 1,
          life: 0.9,
          maxLife: 0.9,
          shape: 'letter',
          char: 'TRÚC -10 HP 💔',
        });

        if (this.callbacks.onTrucHealthUpdate) {
          this.callbacks.onTrucHealthUpdate(this.trucHp, this.trucMaxHp);
        }

        this.bossAttacks.splice(j, 1);

        if (this.trucHp <= 0) {
          sounds.playGameOver();
          this.callbacks.onGameOver(
            'Trúc đã hết 50 máu do trúng đòn hoa hồng của Mỹ Nhi! Hãy đứng chắn trước Trúc và bấm Phím C (Parry) để đỡ đòn bảo vệ Trúc nhé!'
          );
          return;
        }
        continue;
      }

      if (atk.life <= 0) {
        this.bossAttacks.splice(j, 1);
      }
    }
  }

  private updateCollectibles() {
    const p = this.player;
    for (const c of this.collectibles) {
      if (c.collected) continue;
      c.bobOffset += 0.05;

      if (
        p.x + p.width > c.x &&
        p.x < c.x + c.width &&
        p.y + p.height > c.y &&
        p.y < c.y + c.height
      ) {
        c.collected = true;
        if (c.type === 'lotus_coin') {
          this.coins++;
          this.score += 50;
          sounds.playCoin();
        } else if (c.type === 'grapefruit_heal') {
          p.health = Math.min(p.maxHealth, p.health + 1);
          this.score += 100;
          this.timeLeft = Math.min(240, this.timeLeft + 5);
          sounds.playHeal();
        } else if (c.type === 'heart_heal') {
          p.health = Math.min(p.maxHealth, p.health + 1);
          this.score += 250;
          this.timeLeft = Math.min(240, this.timeLeft + 10);
          sounds.playHeartHeal();
          this.spawnHeartHealParticles(c.x + c.width / 2, c.y + c.height / 2);
        }
      }
    }
  }

  private spawnHeartHealParticles(x: number, y: number) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 5 - 2,
        size: Math.random() * 5 + 3,
        color: ['#F43F5E', '#FB7185', '#FDA4AF', '#FDE047'][i % 4],
        alpha: 1,
        life: 0.7,
        maxLife: 0.7,
        shape: 'heart',
      });
    }

    this.particles.push({
      x,
      y: y - 12,
      vx: 0,
      vy: -1.6,
      size: 13,
      color: '#F43F5E',
      alpha: 1,
      life: 0.85,
      maxLife: 0.85,
      shape: 'letter',
      char: '+1 HP ❤️ (+10s)',
    });
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.life -= dt;
      part.x += part.vx * 60 * dt;
      part.y += part.vy * 60 * dt;
      part.alpha = Math.max(0, part.life / part.maxLife);

      if (part.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private handlePlayerDamage() {
    const p = this.player;
    p.health--;
    p.invulnerableTimer = 1.5;
    p.vy = -6;
    p.vx = p.facing === 'right' ? -4 : 4;
    this.screenShake = 0.8;
    sounds.playPlayerHurt();

    if (p.health > 0) {
      this.setPlayerSpeech('Đau đấy, nhưng vì Trúc anh không bỏ cuộc!', 1.6);
    } else {
      sounds.playGameOver();
      this.callbacks.onGameOver('Bạn đã hết máu!');
    }
  }

  private updateCamera() {
    const currentMaxX =
      this.level.id === 1 && this.level1Area === 'tam_phuoc_school' ? 1200 : this.level.width;
    const targetCamX = this.player.x - this.viewportWidth * 0.4;
    this.cameraX += (targetCamX - this.cameraX) * 0.14;
    this.cameraX = Math.max(0, Math.min(this.cameraX, currentMaxX - this.viewportWidth));
  }

  private checkLevelGoal() {
    const p = this.player;
    const g = this.level.goalPoint;

    if (this.boss && this.boss.state !== 'defeated') {
      return;
    }

    if (this.level.id === 1) {
      if (this.level1Area !== 'river') return;

      if (!this.hasBridgeKey) {
        if (
          p.x + p.width > g.x &&
          p.x < g.x + g.width &&
          p.y + p.height > g.y &&
          p.y < g.y + g.height
        ) {
          p.x = g.x - p.width - 6;
          p.vx = 0;
          this.setPlayerSpeech(
            'Cổng đã bị khóa! Cần chìa khóa của Thoại ở giữa Sông Buông để qua Màn 2!',
            3.0
          );
        }
        return;
      }
    }

    if (
      p.x + p.width > g.x &&
      p.x < g.x + g.width &&
      p.y + p.height > g.y &&
      p.y < g.y + g.height
    ) {
      sounds.playVictory();
      if (this.level.id === 1) {
        this.callbacks.onLevelComplete(2);
      } else if (this.level.id === 2) {
        this.callbacks.onLevelComplete(3);
      } else if (this.level.id === 3) {
        this.callbacks.onLevelComplete(4);
      } else if (this.level.id === 4) {
        this.callbacks.onLevelComplete(5);
      } else {
        this.callbacks.onVictory();
      }
    }
  }

  public render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.viewportWidth, this.viewportHeight);

    ctx.save();

    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake * 8;
      const shakeY = (Math.random() - 0.5) * this.screenShake * 8;
      ctx.translate(shakeX, shakeY);
    }

    this.drawParallaxBackground(ctx);

    ctx.translate(-Math.floor(this.cameraX), 0);

    if (this.level.id === 1) {
      if (this.level1Area === 'river') {
        Level1Scenery.drawRiver(ctx, this.level.width, this.level.height, this.riverTimer);
        Level1Scenery.drawEnvironment(ctx, this.cameraX, this.riverTimer);

        TamPhuocSchoolScenery.drawEntranceDoorInLevel1(
          ctx,
          this.schoolDoorX,
          this.schoolDoorY,
          this.schoolDoorWidth,
          this.schoolDoorHeight,
          this.riverTimer,
          this.isNearSchoolDoor()
        );

        drawThoai(ctx, {
          x: this.thoaiX,
          y: this.thoaiY,
          width: this.thoaiWidth,
          height: this.thoaiHeight,
          facing: this.thoaiFacing,
          state: this.thoaiState,
          questState: this.thoaiQuestState,
          animTimer: this.thoaiAnimTimer,
          isPlayerNearby: this.isNearThoai(),
        });

        this.drawPlatforms(ctx);
        this.drawGoalPoint(ctx);
        this.drawCollectibles(ctx);
        this.drawEnemies(ctx);
      } else {
        TamPhuocSchoolScenery.drawEnvironment(ctx, 1200, 600, this.riverTimer);
        TamPhuocSchoolScenery.drawExitDoor(ctx, 50, 350, 70, 120, this.riverTimer);

        this.drawPlatforms(ctx);

        if (this.droppedSlippersPos && !this.hasThoaiSlippers) {
          drawDroppedSlippers(ctx, this.droppedSlippersPos.x, this.droppedSlippersPos.y, this.riverTimer);
        }

        drawTruongMiniBoss(ctx, {
          x: this.truongX,
          y: this.truongY,
          width: this.truongWidth,
          height: this.truongHeight,
          facing: this.truongFacing,
          state: this.truongState,
          animTimer: this.truongAnimTimer,
          invulnerableTimer: this.truongInvulnerableTimer,
          isEnraged: this.truongEnraged,
          hp: this.truongHp,
          maxHp: this.truongMaxHp,
        });

        if (this.truongDialogueBubble) {
          ctx.save();
          const bubbleX = this.truongX + this.truongWidth / 2;
          const bubbleY = this.truongY - 14;
          ctx.font = 'bold 11px system-ui, sans-serif';
          const textW = ctx.measureText(this.truongDialogueBubble.text).width;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(bubbleX - textW / 2 - 8, bubbleY - 22, textW + 16, 22, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#F87171';
          ctx.textAlign = 'center';
          ctx.fillText(this.truongDialogueBubble.text, bubbleX, bubbleY - 7);
          ctx.restore();
        }
      }
    } else {
      if (this.level.id === 2) {
        Level2Scenery.drawEnvironment(ctx, this.cameraX, this.riverTimer);
      } else if (this.level.id === 3) {
        this.drawLevel3Environment(ctx);
      } else if (this.level.id === 4) {
        this.drawLevel4Environment(ctx);
      } else if (this.level.id === 5) {
        this.drawLevel5Environment(ctx);
      }

      this.drawPlatforms(ctx);
      this.drawGoalPoint(ctx);
      this.drawCollectibles(ctx);
      this.drawEnemies(ctx);
    }

    if (this.boss) {
      this.drawBoss(ctx);
    }

    this.drawProjectiles(ctx);

    const isBossDefeated = this.boss && this.boss.state === 'defeated';
    const playerRenderState = isBossDefeated ? 'celebrate' : this.player.state;

    drawPhuoc(ctx, {
      x: this.player.x,
      y: this.player.y,
      width: this.player.width,
      height: this.player.height,
      facing: this.player.facing,
      state: playerRenderState,
      animTimer: this.player.animTimer,
      isInvulnerable: this.player.invulnerableTimer > 0,
      isParrying: !!(this.player.isParrying && this.player.parryTimer && this.player.parryTimer > 0),
    });

    if (this.player.isParrying && this.player.parryTimer && this.player.parryTimer > 0) {
      ctx.save();
      const pX = this.player.facing === 'right' ? this.player.x + this.player.width + 4 : this.player.x - 4;
      const pY = this.player.y + this.player.height / 2;
      const pulse = Math.sin(this.riverTimer * 22) * 2.5;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      const startAngle = this.player.facing === 'right' ? -Math.PI / 2.2 : Math.PI / 1.8;
      const endAngle = this.player.facing === 'right' ? Math.PI / 2.2 : Math.PI * 1.45;
      ctx.arc(pX, pY, 26 + pulse, startAngle, endAngle);
      ctx.stroke();

      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pX, pY, 20, startAngle, endAngle);
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fill();

      ctx.fillStyle = '#38BDF8';
      ctx.font = '900 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PARRY 🛡️', this.player.x + this.player.width / 2, this.player.y - 14);
      ctx.restore();
    }

    this.drawPlayerDialogueBubble(ctx);
    this.drawParticles(ctx);

    if (this.aimTrajectory && this.aimTrajectory.active) {
      const pX = this.player.x + (this.player.facing === 'right' ? this.player.width + 2 : -2);
      const pY = this.player.y + 16;
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pX, pY);
      const targetLength = 240;
      const endX = pX + Math.cos(this.aimTrajectory.angle) * targetLength;
      const endY = pY + Math.sin(this.aimTrajectory.angle) * targetLength;
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    }

    if (this.tapTargetEffect) {
      const tX = this.tapTargetEffect.x + this.cameraX;
      const tY = this.tapTargetEffect.y;
      const progress = 1 - this.tapTargetEffect.life / this.tapTargetEffect.maxLife;
      const radius = 10 + progress * 24;
      const alpha = Math.max(0, 1 - progress);

      ctx.save();
      ctx.strokeStyle = `rgba(250, 204, 21, ${alpha})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(tX, tY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  private drawParallaxBackground(ctx: CanvasRenderingContext2D) {
    const w = this.viewportWidth;
    const h = this.viewportHeight;

    if (this.level.id === 1) {
      if (this.level1Area === 'tam_phuoc_school') return;
      Level1Scenery.drawParallax(ctx, w, h, this.cameraX, this.riverTimer);
      return;
    }

    if (this.level.id === 2) {
      Level2Scenery.drawParallax(ctx, w, h, this.cameraX, this.riverTimer);
      return;
    }

    if (this.level.id === 3) {
      this.drawLevel3Parallax(ctx, w, h);
      return;
    }

    if (this.level.id === 4 || this.level.id === 5) {
      this.drawLevel4Parallax(ctx, w, h);
      return;
    }
  }

  private drawLevel3Parallax(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0F172A');
    skyGrad.addColorStop(0.6, '#1E293B');
    skyGrad.addColorStop(1, '#334155');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(w - 120, 60, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawLevel3Environment(ctx: CanvasRenderingContext2D) {
    drawThuanNPC(ctx, {
      x: this.thuanX,
      y: this.thuanY,
      width: 46,
      height: 64,
      facing: this.thuanFacing,
      state: this.thuanState,
      animTimer: this.thuanAnimTimer,
      speechBubble: this.thuanSpeechBubble,
    });

    for (let x = 160; x <= this.level.width; x += 360) {
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.ellipse(x, 260, 10, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(x - 2, 268, 4, 8);
    }
  }

  private drawLevel4Parallax(ctx: CanvasRenderingContext2D, w: number, h: number) {
    Level4Scenery.drawParallaxBackground(ctx, this.cameraX, this.riverTimer);
  }

  private drawLevel4Environment(ctx: CanvasRenderingContext2D) {
    Level4Scenery.drawCrashedMotorbike(ctx, 160, 440, this.riverTimer);
    const isBossDefeated = Boolean(this.boss && this.boss.state === 'defeated');
    Level4Scenery.drawInjuredTruc(ctx, 90, 445, this.riverTimer, isBossDefeated);
  }

  /**
   * Vẽ Màn 5: Thánh Đường Hoa Hồng Đêm & Nhân Vật Trúc (50 HP) Cần Được Bảo Vệ
   */
  private drawLevel5Environment(ctx: CanvasRenderingContext2D) {
    // 1. Vẽ Cổng Hoa Hồng & Cánh Hoa Bay Trong Đêm
    const isEnraged = Boolean(this.boss && this.boss.isEnraged);
    ctx.save();
    for (let p = 0; p < 16; p++) {
      const px = ((p * 110 + this.riverTimer * 35) % 1500);
      const py = 60 + ((p * 47 + this.riverTimer * 28) % 390);
      ctx.fillStyle = isEnraged ? '#DC2626' : '#F472B6';
      ctx.beginPath();
      ctx.ellipse(px, py, 4, 2.5, Math.sin(this.riverTimer * 3 + p), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Vẽ Trúc đứng ở vị trí cần bảo vệ (x=110, y=414) cùng Thanh Máu 50 HP trên đầu
    ctx.save();
    ctx.translate(this.trucX, this.trucY);

    if (this.trucHurtTimer > 0 && Math.floor(this.riverTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    const cx = this.trucWidth / 2;
    const bob = Math.sin(this.riverTimer * 4) * 1.5;

    // Vòng bảo hộ dưới chân Trúc
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, this.trucHeight - 2, 26, 7, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Tà Áo Dài Hồng của Trúc
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(cx - 8, 36 + bob, 16, 18);
    ctx.fillStyle = '#EC4899';
    ctx.beginPath();
    ctx.moveTo(cx - 9, 20 + bob);
    ctx.lineTo(cx + 9, 20 + bob);
    ctx.lineTo(cx + 13, 50 + bob);
    ctx.lineTo(cx - 13, 50 + bob);
    ctx.closePath();
    ctx.fill();

    // Khuôn mặt & Mái tóc đen dài cài hoa sen của Trúc
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx, 11 + bob, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 11, 11 + bob, 5, 22);

    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(cx + 1, 12 + bob, 9, 0, Math.PI * 2);
    ctx.fill();

    // Bông hoa sen cài tóc
    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.arc(cx - 6, 6 + bob, 4, 0, Math.PI * 2);
    ctx.fill();

    // Mắt
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(cx, 10 + bob, 2.5, 3);
    ctx.fillRect(cx + 5, 10 + bob, 2.5, 3);

    // Thanh Máu 50 HP trên đầu Trúc
    const barW = 74;
    const barH = 8;
    const barX = cx - barW / 2;
    const barY = -22;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, 4);
    ctx.fill();

    const hpPct = Math.max(0, Math.min(1, this.trucHp / this.trucMaxHp));
    ctx.fillStyle = this.trucHp > 20 ? '#EC4899' : '#EF4444';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * hpPct, barH, 3);
    ctx.fill();

    ctx.fillStyle = '#FCE7F3';
    ctx.font = '900 9px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`❤️ TRÚC: ${this.trucHp}/${this.trucMaxHp} HP`, cx, barY - 5);

    if (this.trucSpeechBubble && this.trucSpeechBubble.timer > 0) {
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      const tw = ctx.measureText(this.trucSpeechBubble.text).width;
      const bw = Math.max(100, tw + 16);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#F472B6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - bw / 2, barY - 38, bw, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FBCFE8';
      ctx.fillText(this.trucSpeechBubble.text, cx, barY - 23);
    }

    ctx.restore();
  }

  private drawPlatforms(ctx: CanvasRenderingContext2D) {
    for (const plat of this.platforms) {
      if (plat.type === 'ground') {
        if (this.level.id === 1) {
          ctx.fillStyle = '#15803D';
          ctx.fillRect(plat.x, plat.y, plat.width, 16);
          ctx.fillStyle = '#78350F';
          ctx.fillRect(plat.x, plat.y + 16, plat.width, plat.height - 16);
        } else if (this.level.id === 2) {
          ctx.fillStyle = '#334155';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#94A3B8';
          ctx.fillRect(plat.x, plat.y, plat.width, 6);
        } else if (this.level.id === 3) {
          ctx.fillStyle = '#475569';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#64748B';
          ctx.fillRect(plat.x, plat.y, plat.width, 6);
        } else {
          ctx.fillStyle = '#1E293B';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#475569';
          ctx.fillRect(plat.x, plat.y, plat.width, 5);
        }
      } else if (plat.type === 'bridge_wood') {
        ctx.fillStyle = '#B45309';
        ctx.fillRect(plat.x, plat.y, plat.width, 16);
        ctx.fillStyle = '#78350F';
        ctx.fillRect(plat.x, plat.y + 16, plat.width, plat.height - 16);
      } else if (plat.type === 'hyacinth_raft') {
        ctx.fillStyle = '#14532D';
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 10);
        ctx.fill();
      } else if (plat.type === 'bamboo_pole') {
        ctx.fillStyle = '#EAB308';
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      } else if (plat.type === 'dinh_roof') {
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      } else {
        ctx.fillStyle = '#64748B';
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      }
    }
  }

  private drawGoalPoint(ctx: CanvasRenderingContext2D) {
    const g = this.level.goalPoint;
    if (this.level.id === 1 && this.level1Area === 'tam_phuoc_school') return;

    const isOpen = this.level.id === 1 ? this.hasBridgeKey : Boolean(this.boss && this.boss.state === 'defeated');
    ctx.fillStyle = isOpen ? '#059669' : '#991B1B';
    ctx.fillRect(g.x, g.y, g.width, g.height);

    ctx.fillStyle = '#FDE047';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isOpen ? 'CỔNG MỞ' : 'ĐANG KHÓA', g.x + g.width / 2, g.y + 30);
  }

  private drawCollectibles(ctx: CanvasRenderingContext2D) {
    for (const c of this.collectibles) {
      if (c.collected) continue;

      if (c.type === 'heart_heal') {
        Level2Scenery.drawHeart(ctx, c, this.riverTimer);
        continue;
      }

      if (c.type === 'lotus_coin') {
        Level1Scenery.drawGoldCoin(ctx, c, this.riverTimer);
      } else {
        Level1Scenery.drawPomelo(ctx, c, this.riverTimer);
      }
    }
  }

  private drawEnemies(ctx: CanvasRenderingContext2D) {
    for (const otter of this.enemies) {
      drawOtter(ctx, {
        x: otter.x,
        y: otter.y,
        width: otter.width,
        height: otter.height,
        facing: otter.facing,
        state: otter.state,
        squishTimer: otter.squishTimer,
        animTimer: otter.animTimer,
        isJumper: otter.isJumper,
      });
    }
  }

  private drawBoss(ctx: CanvasRenderingContext2D) {
    const b = this.boss;
    if (!b) return;

    if (b.bossType === 'mynhi') {
      drawBossMyNhi(ctx, {
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height,
        facing: b.facing,
        state: b.state,
        animTimer: b.animTimer,
        invulnerableTimer: b.invulnerableTimer,
        isEnraged: b.isEnraged,
        hp: b.health,
        maxHp: b.maxHealth,
        dialogueBubble: b.dialogueBubble,
      });
    } else if (b.bossType === 'baholong') {
      drawBaHoLongBoss(ctx, { boss: b, timer: this.riverTimer });
    } else if (b.bossType === 'y') {
      drawBossY(ctx, {
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height,
        facing: b.facing,
        state: b.state,
        animTimer: b.animTimer,
        invulnerableTimer: b.invulnerableTimer,
        isEnraged: b.isEnraged,
        hp: b.health,
        maxHp: b.maxHealth,
      });
    } else {
      drawCsgtBoss(ctx, { boss: b, timer: this.riverTimer });
    }
  }

  private drawProjectiles(ctx: CanvasRenderingContext2D) {
    for (const proj of this.projectiles) {
      ctx.save();
      ctx.translate(proj.x, proj.y);
      ctx.rotate(proj.rotation);
      ctx.scale(proj.scale, proj.scale);

      if (proj.projType === 'lipstick') {
        const spin = (2.0 - proj.life) * 8;
        ctx.rotate(spin);

        ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
        ctx.beginPath();
        ctx.arc(6, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#B45309';
        ctx.fillRect(-15, -7, 16, 14);
        ctx.fillStyle = '#FDE047';
        ctx.fillRect(-14, -6, 14, 12);

        ctx.fillStyle = '#BE123C';
        ctx.beginPath();
        ctx.moveTo(5, -6);
        ctx.lineTo(19, -6);
        ctx.lineTo(26, 0);
        ctx.lineTo(19, 6);
        ctx.lineTo(5, 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#F43F5E';
        ctx.font = '900 10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SON 500K 💄', 5, -12);

        ctx.restore();
        continue;
      }

      if (proj.projType === 'reflected') {
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.roundRect(-4, -12, 90, 26, 8);
        ctx.fill();
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(proj.text, 40, 5);
        ctx.restore();
        continue;
      }

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.roundRect(-4, -14, 100, 36, 12);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.roundRect(-2, -12, 96, 32, 10);
      ctx.fill();

      ctx.fillStyle = '#92400E';
      ctx.font = '900 16px "Rowdies", "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(proj.text, 46, 10);

      ctx.restore();
    }

    for (const atk of this.bossAttacks) {
      ctx.save();
      ctx.translate(atk.x, atk.y);

      if (
        atk.type === 'rose_flower' ||
        atk.type === 'flower_barrage' ||
        atk.type === 'blood_flower' ||
        atk.type === 'blood_thorn_wave'
      ) {
        drawMyNhiFlowerProjectile(ctx, atk);
      } else if (atk.type === 'dice_shot') {
        Level4Scenery.drawDice(ctx, atk);
      } else if (atk.type === 'dollar_bill') {
        Level4Scenery.drawDollarBill(ctx, atk);
      } else if (atk.type === 'money_stack') {
        Level4Scenery.drawMoneyStack(ctx, atk);
      } else if (atk.type === 'bullet_shot') {
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.ellipse(10, 5, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (atk.type === 'whistle_wave') {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(10, 10, 14, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      } else if (atk.type === 'citation_paper') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-10, -14, 20, 28);
      } else if (atk.type === 'slipper_throw' || atk.type === 'slipper_rain' || atk.type === 'slipper_shockwave') {
        if (atk.rotation !== undefined) ctx.rotate(atk.rotation);
        drawSingleSlipper(ctx, -atk.width / 2, -atk.height / 2, atk.width, atk.height, '#FDE047');
      } else if (atk.type === 'cane_shock' || atk.type === 'ground_shock') {
        ctx.fillStyle = atk.type === 'cane_shock' ? '#A855F7' : '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(12, 0);
        ctx.lineTo(24, 20);
        ctx.closePath();
        ctx.fill();
      } else if (atk.type === 'boba_cup') {
        drawBobaCup(ctx, atk);
      } else if (atk.type === 'boba_pearl') {
        drawBobaPearl(ctx, atk);
      } else if (atk.type === 'bill_50k') {
        drawBill50k(ctx, atk);
      }

      ctx.restore();
    }
  }

  private drawParticles(ctx: CanvasRenderingContext2D) {
    for (const part of this.particles) {
      ctx.save();
      ctx.globalAlpha = part.alpha;
      ctx.fillStyle = part.color;

      if (part.shape === 'letter' && part.char) {
        ctx.font = '900 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(part.char, part.x, part.y);
      } else {
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawPlayerDialogueBubble(ctx: CanvasRenderingContext2D) {
    const p = this.player;
    if (p.dialogueBubble && p.dialogueBubble.timer > 0) {
      const text = p.dialogueBubble.text;
      ctx.save();
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      const textW = ctx.measureText(text).width;
      const bubbleW = Math.max(90, textW + 20);
      const bubbleH = 26;
      const cx = p.x + p.width / 2;
      const bubbleX = cx - bubbleW / 2;
      const bubbleY = p.y - 38;

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, [8]);
      ctx.fill();

      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#065F46';
      ctx.textAlign = 'center';
      ctx.fillText(text, cx, bubbleY + 17);
      ctx.restore();
    }
  }
}