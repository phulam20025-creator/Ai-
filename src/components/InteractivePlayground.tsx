import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Tv,
  FileCode,
  Sparkles,
  Trophy,
  Heart,
  Coins,
  ShieldCheck,
  ChevronRight,
  Info
} from "lucide-react";
import { Language } from "../types";

interface InteractivePlaygroundProps {
  language: Language;
  onUsePrompt: (promptData: any) => void;
}

// 8-Bit Web Audio Synthesizer
class RetroAudioSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playJump() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playAttack() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  playCoin() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }

  playEnemyHit() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  playVictory() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C E G C
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + (i + 1) * 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + (i + 1) * 0.12);
      });
    } catch {}
  }
}

export const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({
  language,
  onUsePrompt,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const synthRef = useRef<RetroAudioSynth>(new RetroAudioSynth());
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [gameState, setGameState] = useState<"playing" | "game_over" | "victory">("playing");
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [health, setHealth] = useState(3);
  const [fps, setFps] = useState(60);

  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    synthRef.current.enabled = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Game state
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    // Virtual resolution: 480x270 (16:9 pixel scale)
    const V_WIDTH = 480;
    const V_HEIGHT = 270;

    // Level map (solid platforms)
    const platforms = [
      { x: 0, y: 240, w: 900, h: 30, color: "#22c55e", subColor: "#78350f" }, // Ground
      { x: 120, y: 190, w: 90, h: 14, color: "#38bdf8", subColor: "#0369a1" },
      { x: 250, y: 145, w: 80, h: 14, color: "#38bdf8", subColor: "#0369a1" },
      { x: 370, y: 180, w: 100, h: 14, color: "#38bdf8", subColor: "#0369a1" },
      { x: 510, y: 135, w: 90, h: 14, color: "#38bdf8", subColor: "#0369a1" },
      { x: 640, y: 170, w: 110, h: 14, color: "#38bdf8", subColor: "#0369a1" },
      { x: 790, y: 200, w: 100, h: 14, color: "#fbbf24", subColor: "#b45309" }, // Goal platform
    ];

    // Coins
    let coins = [
      { x: 160, y: 160, collected: false, bobOffset: 0 },
      { x: 290, y: 115, collected: false, bobOffset: 1 },
      { x: 420, y: 150, collected: false, bobOffset: 2 },
      { x: 550, y: 105, collected: false, bobOffset: 3 },
      { x: 690, y: 140, collected: false, bobOffset: 4 },
    ];

    // Spikes hazard
    const spikes = [
      { x: 480, y: 232, w: 24, h: 8 },
    ];

    // Portal (Victory Goal)
    const portal = { x: 830, y: 160, w: 26, h: 40 };

    // Player
    const player = {
      x: 40,
      y: 180,
      w: 18,
      h: 24,
      vx: 0,
      vy: 0,
      isGrounded: false,
      facing: 1 as 1 | -1,
      jumpsRemaining: 2,
      isAttacking: false,
      attackCooldown: 0,
      attackTimer: 0,
      hp: 3,
      invulnerableTimer: 0,
      animFrame: 0,
      animTimer: 0,
    };

    // Enemies
    const enemies = [
      {
        id: 1,
        type: "slime",
        x: 180,
        y: 224,
        w: 18,
        h: 16,
        vx: 0.8,
        minX: 80,
        maxX: 300,
        alive: true,
        squash: 0,
      },
      {
        id: 2,
        type: "slime",
        x: 400,
        y: 164,
        w: 18,
        h: 16,
        vx: 1.0,
        minX: 370,
        maxX: 460,
        alive: true,
        squash: 0,
      },
      {
        id: 3,
        type: "bat",
        x: 540,
        y: 90,
        w: 16,
        h: 12,
        vx: 0.9,
        minX: 500,
        maxX: 610,
        baseY: 90,
        alive: true,
      },
    ];

    // Floating particles (dust, sparks)
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      maxLife: number;
      size: number;
    }
    let particles: Particle[] = [];

    const spawnParticles = (x: number, y: number, color: string, count = 6) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.8) * 2.5,
          color,
          life: 0,
          maxLife: 15 + Math.random() * 15,
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    // Camera
    let cameraX = 0;

    // Input handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
      if (["Space", "ArrowUp", "ArrowDown", "KeyW"].includes(e.code)) {
        e.preventDefault();
      }

      // Attack
      if (e.code === "KeyJ" || e.code === "KeyZ") {
        if (!player.isAttacking && player.attackCooldown <= 0) {
          player.isAttacking = true;
          player.attackTimer = 12;
          player.attackCooldown = 18;
          synthRef.current.playAttack();
        }
      }

      // Jump
      if ((e.code === "Space" || e.code === "KeyW" || e.code === "ArrowUp") && player.jumpsRemaining > 0) {
        player.vy = -6.2;
        player.isGrounded = false;
        player.jumpsRemaining--;
        synthRef.current.playJump();
        spawnParticles(player.x + player.w / 2, player.y + player.h, "#e2e8f0", 4);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Main Game Loop
    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Calculate FPS
      frameCount++;
      if (currentTime - lastFpsUpdate >= 500) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = currentTime;
      }

      // --- 1. UPDATE PHYSICS & LOGIC ---
      if (player.hp > 0) {
        // Horizontal input
        const moveLeft = keysPressed.current["KeyA"] || keysPressed.current["ArrowLeft"];
        const moveRight = keysPressed.current["KeyD"] || keysPressed.current["ArrowRight"];

        if (moveLeft) {
          player.vx = -2.8;
          player.facing = -1;
        } else if (moveRight) {
          player.vx = 2.8;
          player.facing = 1;
        } else {
          player.vx *= 0.75;
        }

        // Apply gravity
        player.vy += 0.32;
        if (player.vy > 8) player.vy = 8;

        // Move X & check platforms
        player.x += player.vx;
        if (player.x < 0) player.x = 0;
        if (player.x > 880) player.x = 880;

        // Move Y & check platform collisions
        player.y += player.vy;
        player.isGrounded = false;

        for (const p of platforms) {
          // Check collision from top
          if (
            player.x + player.w > p.x &&
            player.x < p.x + p.w &&
            player.y + player.h >= p.y &&
            player.y + player.h <= p.y + p.h + player.vy &&
            player.vy >= 0
          ) {
            player.y = p.y - player.h;
            player.vy = 0;
            player.isGrounded = true;
            player.jumpsRemaining = 2; // reset double jump
          }
        }

        // Animation update
        player.animTimer++;
        if (player.animTimer >= 6) {
          player.animTimer = 0;
          player.animFrame = (player.animFrame + 1) % 4;
        }

        // Attack cooldown & timer
        if (player.attackCooldown > 0) player.attackCooldown--;
        if (player.isAttacking) {
          player.attackTimer--;
          if (player.attackTimer <= 0) {
            player.isAttacking = false;
          }
        }

        // Invulnerability countdown
        if (player.invulnerableTimer > 0) player.invulnerableTimer--;

        // Coin collection
        coins.forEach((c) => {
          if (!c.collected) {
            const cx = c.x + 8;
            const cy = c.y + 8 + Math.sin(currentTime * 0.005 + c.bobOffset) * 3;
            const dist = Math.hypot(player.x + player.w / 2 - cx, player.y + player.h / 2 - cy);
            if (dist < 18) {
              c.collected = true;
              setScore((s) => s + 100);
              setCoinsCollected((cc) => cc + 1);
              synthRef.current.playCoin();
              spawnParticles(cx, cy, "#facc15", 8);
            }
          }
        });

        // Enemies update & collision
        enemies.forEach((e) => {
          if (!e.alive) return;

          if (e.type === "slime") {
            e.x += e.vx;
            if (e.x <= e.minX || e.x >= e.maxX) {
              e.vx = -e.vx;
            }
            e.squash = Math.sin(currentTime * 0.008 + e.id) * 2;
          } else if (e.type === "bat") {
            e.x += e.vx;
            if (e.x <= e.minX || e.x >= e.maxX) {
              e.vx = -e.vx;
            }
            e.y = e.baseY + Math.sin(currentTime * 0.006) * 12;
          }

          // Check hit by player sword attack
          if (player.isAttacking) {
            const attackHitboxX = player.facing === 1 ? player.x + player.w : player.x - 20;
            const attackHitboxW = 22;
            const attackHitboxY = player.y - 2;
            const attackHitboxH = player.h + 4;

            if (
              attackHitboxX + attackHitboxW > e.x &&
              attackHitboxX < e.x + e.w &&
              attackHitboxY + attackHitboxH > e.y &&
              attackHitboxY < e.y + e.h
            ) {
              e.alive = false;
              setScore((s) => s + 250);
              synthRef.current.playEnemyHit();
              spawnParticles(e.x + e.w / 2, e.y + e.h / 2, "#f43f5e", 10);
              return;
            }
          }

          // Check player takes damage
          if (
            player.invulnerableTimer <= 0 &&
            player.x + player.w > e.x &&
            player.x < e.x + e.w &&
            player.y + player.h > e.y &&
            player.y < e.y + e.h
          ) {
            // Jump on top to squish enemy
            if (player.vy > 0 && player.y + player.h <= e.y + 10) {
              e.alive = false;
              player.vy = -4.5;
              setScore((s) => s + 200);
              synthRef.current.playEnemyHit();
              spawnParticles(e.x + e.w / 2, e.y + e.h / 2, "#38bdf8", 8);
            } else {
              // Hurt player
              player.hp--;
              setHealth(player.hp);
              player.invulnerableTimer = 45;
              player.vy = -3;
              player.vx = player.facing === 1 ? -3 : 3;
              synthRef.current.playEnemyHit();
              spawnParticles(player.x + player.w / 2, player.y + player.h / 2, "#ef4444", 6);
              if (player.hp <= 0) {
                setGameState("game_over");
              }
            }
          }
        });

        // Spikes collision
        for (const s of spikes) {
          if (
            player.x + player.w > s.x &&
            player.x < s.x + s.w &&
            player.y + player.h >= s.y
          ) {
            if (player.invulnerableTimer <= 0) {
              player.hp--;
              setHealth(player.hp);
              player.invulnerableTimer = 45;
              player.vy = -4;
              synthRef.current.playEnemyHit();
              if (player.hp <= 0) {
                setGameState("game_over");
              }
            }
          }
        }

        // Portal victory check
        if (
          player.x + player.w > portal.x &&
          player.x < portal.x + portal.w &&
          player.y + player.h > portal.y
        ) {
          setGameState("victory");
          synthRef.current.playVictory();
        }

        // Camera lerp
        const targetCamX = player.x - V_WIDTH / 2 + player.w / 2;
        cameraX += (targetCamX - cameraX) * 0.1;
        cameraX = Math.max(0, Math.min(cameraX, 900 - V_WIDTH));
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // --- 2. RENDER PROCEDURAL PIXEL ART ---
      ctx.imageSmoothingEnabled = false;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, V_HEIGHT);
      bgGrad.addColorStop(0, "#090d16");
      bgGrad.addColorStop(0.6, "#131b2e");
      bgGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

      ctx.save();
      ctx.translate(-Math.round(cameraX), 0);

      // Parallax moon & mountains
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(V_WIDTH * 0.8 + cameraX * 0.7, 50, 22, 0, Math.PI * 2);
      ctx.fill();

      // Distant pixel mountains
      ctx.fillStyle = "#1e1b4b";
      ctx.beginPath();
      ctx.moveTo(-100, 240);
      ctx.lineTo(150, 110);
      ctx.lineTo(350, 240);
      ctx.lineTo(600, 130);
      ctx.lineTo(850, 240);
      ctx.lineTo(1100, 140);
      ctx.lineTo(1200, 240);
      ctx.fill();

      // Platforms
      for (const p of platforms) {
        // Main block
        ctx.fillStyle = p.subColor;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        // Top grass/crystal surface
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.w, 4);

        // Pixel detail studs
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        for (let bx = p.x + 8; bx < p.x + p.w; bx += 16) {
          ctx.fillRect(bx, p.y + 7, 6, 4);
        }
      }

      // Spikes
      for (const s of spikes) {
        ctx.fillStyle = "#e2e8f0";
        for (let sx = s.x; sx < s.x + s.w; sx += 8) {
          ctx.beginPath();
          ctx.moveTo(sx, s.y + s.h);
          ctx.lineTo(sx + 4, s.y);
          ctx.lineTo(sx + 8, s.y + s.h);
          ctx.fill();
        }
      }

      // Coins
      coins.forEach((c) => {
        if (!c.collected) {
          const cy = c.y + Math.sin(currentTime * 0.005 + c.bobOffset) * 3;
          // Gold outer
          ctx.fillStyle = "#facc15";
          ctx.fillRect(c.x + 2, cy, 8, 10);
          ctx.fillRect(c.x, cy + 2, 12, 6);
          // Highlight
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(c.x + 4, cy + 2, 2, 2);
          // Center core
          ctx.fillStyle = "#ca8a04";
          ctx.fillRect(c.x + 4, cy + 4, 4, 3);
        }
      });

      // Magic Portal
      const portalGlow = (Math.sin(currentTime * 0.006) + 1) * 0.5;
      ctx.fillStyle = `rgba(168, 85, 247, ${0.4 + portalGlow * 0.4})`;
      ctx.fillRect(portal.x - 2, portal.y - 2, portal.w + 4, portal.h + 4);
      ctx.fillStyle = "#c084fc";
      ctx.fillRect(portal.x, portal.y, portal.w, portal.h);
      ctx.fillStyle = "#fae8ff";
      ctx.fillRect(portal.x + 4, portal.y + 4, portal.w - 8, portal.h - 8);

      // Enemies
      enemies.forEach((e) => {
        if (!e.alive) return;

        if (e.type === "slime") {
          const sy = e.y - e.squash;
          const sh = e.h + e.squash;
          // Green slime body
          ctx.fillStyle = "#10b981";
          ctx.fillRect(e.x, sy, e.w, sh);
          ctx.fillStyle = "#34d399";
          ctx.fillRect(e.x + 2, sy + 2, e.w - 4, 4);
          // Eyes
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(e.vx > 0 ? e.x + 10 : e.x + 3, sy + 5, 4, 4);
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(e.vx > 0 ? e.x + 12 : e.x + 3, sy + 6, 2, 2);
        } else if (e.type === "bat") {
          // Purple flying bat
          ctx.fillStyle = "#a855f7";
          ctx.fillRect(e.x + 4, e.y + 2, 8, 8);
          // Animated wings
          const wingOffset = Math.sin(currentTime * 0.015) > 0 ? -3 : 3;
          ctx.fillStyle = "#7e22ce";
          ctx.fillRect(e.x - 3, e.y + wingOffset, 6, 4);
          ctx.fillRect(e.x + 13, e.y + wingOffset, 6, 4);
          // Red eye
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(e.vx > 0 ? e.x + 9 : e.x + 5, e.y + 4, 2, 2);
        }
      });

      // Player
      if (player.hp > 0) {
        // Flicker if invulnerable
        if (player.invulnerableTimer % 4 < 2) {
          const px = Math.round(player.x);
          const py = Math.round(player.y);
          const f = player.facing;

          // Cape
          ctx.fillStyle = "#dc2626";
          ctx.fillRect(f === 1 ? px - 4 : px + player.w, py + 8, 4, 12);

          // Body / Armor (Blue tunic)
          ctx.fillStyle = "#2563eb";
          ctx.fillRect(px + 3, py + 8, 12, 10);

          // Head / Helmet (Iron gray)
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(px + 4, py + 1, 10, 8);
          // Visor slit
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(f === 1 ? px + 8 : px + 4, py + 4, 5, 2);

          // Legs
          ctx.fillStyle = "#1e293b";
          const legShift = player.isGrounded && Math.abs(player.vx) > 0.5 ? (player.animFrame % 2 === 0 ? 2 : -2) : 0;
          ctx.fillRect(px + 4 + legShift, py + 18, 4, 6);
          ctx.fillRect(px + 10 - legShift, py + 18, 4, 6);

          // Sword slash
          if (player.isAttacking) {
            ctx.fillStyle = "#38bdf8";
            const slashX = f === 1 ? px + player.w + 2 : px - 18;
            ctx.fillRect(slashX, py + 4, 16, 4);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(slashX + (f === 1 ? 8 : 0), py + 2, 8, 2);
            ctx.fillRect(slashX, py + 8, 12, 2);
          }
        }
      }

      // Particles
      particles.forEach((p) => {
        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        ctx.globalAlpha = 1;
      });

      ctx.restore();

      // UI HUD rendered on top of canvas
      // Health hearts
      for (let h = 0; h < 3; h++) {
        ctx.fillStyle = h < health ? "#ef4444" : "#475569";
        ctx.fillRect(12 + h * 14, 12, 10, 8);
        ctx.fillRect(14 + h * 14, 10, 6, 12);
      }

      // Coins counter
      ctx.fillStyle = "#facc15";
      ctx.fillRect(80, 11, 8, 10);
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`x${coinsCollected}`, 94, 20);

      // Score
      ctx.fillText(`SCORE:${score}`, V_WIDTH - 150, 20);

      // Game state overlays
      if (gameState === "game_over") {
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);
        ctx.fillStyle = "#ef4444";
        ctx.font = "18px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", V_WIDTH / 2, V_HEIGHT / 2 - 10);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "8px 'Press Start 2P', monospace";
        ctx.fillText(language === "vi" ? "NHẤN NÚT CHƠI LẠI ĐỂ TIẾP TỤC" : "PRESS RESTART TO TRY AGAIN", V_WIDTH / 2, V_HEIGHT / 2 + 18);
        ctx.textAlign = "start";
      } else if (gameState === "victory") {
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);
        ctx.fillStyle = "#34d399";
        ctx.font = "18px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("VICTORY!", V_WIDTH / 2, V_HEIGHT / 2 - 10);
        ctx.fillStyle = "#fef08a";
        ctx.font = "8px 'Press Start 2P', monospace";
        ctx.fillText(language === "vi" ? `XUẤT SẮC! ĐIỂM SỐ: ${score}` : `GREAT JOB! FINAL SCORE: ${score}`, V_WIDTH / 2, V_HEIGHT / 2 + 18);
        ctx.textAlign = "start";
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [health, coinsCollected, score, gameState, language]);

  const restartGame = () => {
    setHealth(3);
    setScore(0);
    setCoinsCollected(0);
    setGameState("playing");
  };

  // Touch trigger helpers
  const triggerKey = (code: string, active: boolean) => {
    keysPressed.current[code] = active;
    if (active && (code === "Space" || code === "KeyJ")) {
      window.dispatchEvent(new KeyboardEvent(active ? "keydown" : "keyup", { code }));
    }
  };

  const samplePromptForThisGame = {
    gameConcept: "Retro 2D Pixel Knight Platformer with Chiptune Synth, Coins, Patrol Slimes, and Double Jump",
    genre: "platformer",
    artStyle: "16-Bit SNES",
    resolution: "32x32",
    engineTarget: "HTML5 Canvas + TypeScript",
    mechanics: ["Run & Smooth Acceleration", "Double Jump", "Sword Slash Attack", "AABB Collision", "Web Audio Procedural Chiptune Synth", "Coin Collection & Score", "Patrolling Slime & Flying Bat AI"],
    enemies: "Ground slime with squash & stretch, Flying bat oscillating with sine wave",
    biome: "Nighttime castle platformer with parallax moon and glowing purple goal portal",
    soundStyle: "Procedural Web Audio API 8-bit chiptune (square & sine waves)",
  };

  return (
    <div id="interactive-playground" className="flex flex-col gap-3">
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0D1117] border border-[#2D333B] rounded-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#161B22] border border-[#2D333B] flex items-center justify-center text-indigo-400">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-2">
              <span>{language === "vi" ? "Trình Giả Lập 2D Pixel Canvas" : "2D Pixel Canvas Sandbox"}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]">
                60 FPS LIVE
              </span>
            </h3>
            <p className="text-[11px] font-mono text-[#8B949E]">
              {language === "vi"
                ? "Bản mẫu trò chơi hoàn chỉnh tạo theo chuẩn Google AI Studio"
                : "Playable prototype engineered with Google AI Studio prompt specs"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Toggle */}
          <button
            id="toggle-audio-btn"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors border ${
              audioEnabled
                ? "bg-[#161B22] text-amber-400 border-amber-500/50"
                : "bg-[#0A0C10] text-[#8B949E] border-[#2D333B]"
            }`}
            title={audioEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Chiptune</span>
          </button>

          {/* CRT Filter Toggle */}
          <button
            id="toggle-crt-btn"
            onClick={() => setCrtEnabled(!crtEnabled)}
            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors border ${
              crtEnabled
                ? "bg-cyan-950/40 text-cyan-300 border-cyan-500/50"
                : "bg-[#0A0C10] text-[#8B949E] border-[#2D333B]"
            }`}
            title="Bật/Tắt hiệu ứng CRT Retro"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CRT Filter</span>
          </button>

          {/* Restart */}
          <button
            id="restart-game-btn"
            onClick={restartGame}
            className="px-2 py-1 rounded bg-[#161B22] hover:bg-[#21262D] text-[#E0E0E0] border border-[#2D333B] text-[11px] font-mono flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#3fb950]" />
            <span className="hidden sm:inline">{language === "vi" ? "Khởi động lại" : "Restart"}</span>
          </button>

          {/* Inspect Prompt */}
          <button
            id="inspect-prompt-btn"
            onClick={() => setShowPromptModal(true)}
            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{language === "vi" ? "Xem Prompt Game" : "Inspect Prompt"}</span>
          </button>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="relative w-full aspect-[16/9] max-h-[480px] bg-black rounded-lg overflow-hidden border border-[#2D333B] shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={480}
          height={270}
          className="w-full h-full object-contain [image-rendering:pixelated]"
        />

        {/* CRT Scanline Overlay */}
        {crtEnabled && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]">
            <div
              className="w-full h-full opacity-15"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 255, 0, 0.04))",
                backgroundSize: "100% 3px, 4px 100%",
              }}
            />
          </div>
        )}

        {/* Mini stats badge bottom left */}
        <div className="absolute bottom-2 left-3 bg-[#0A0C10]/85 px-2 py-0.5 rounded border border-[#2D333B] text-[10px] font-mono text-[#8B949E] flex items-center gap-2">
          <span className="flex items-center gap-1 text-[#3fb950]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
            {fps} FPS
          </span>
          <span className="text-[#484F58]">|</span>
          <span className="text-amber-400">480x270 CANVAS</span>
        </div>

        {/* Floating controls hint top right */}
        <div className="absolute top-2 right-3 hidden md:flex items-center gap-2 bg-[#0A0C10]/85 px-2.5 py-1 rounded border border-[#2D333B] text-[10px] text-[#8B949E] font-mono">
          <span>[A/D]: Move</span>
          <span className="text-[#484F58]">•</span>
          <span>[Space]: Double Jump</span>
          <span className="text-[#484F58]">•</span>
          <span>[J]: Sword Slash</span>
        </div>
      </div>

      {/* On-screen Touch Controls (Great for mobile & quick clicking) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-[#0D1117] border border-[#2D333B] rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-wider mr-1 hidden sm:inline">D-PAD:</span>
          <button
            onMouseDown={() => triggerKey("KeyA", true)}
            onMouseUp={() => triggerKey("KeyA", false)}
            onTouchStart={() => triggerKey("KeyA", true)}
            onTouchEnd={() => triggerKey("KeyA", false)}
            className="w-10 h-10 rounded bg-[#161B22] hover:bg-[#21262D] active:bg-indigo-600 font-mono font-bold text-[#E0E0E0] active:text-white border border-[#2D333B] flex items-center justify-center select-none text-sm transition-colors cursor-pointer"
          >
            ←
          </button>
          <button
            onMouseDown={() => triggerKey("KeyD", true)}
            onMouseUp={() => triggerKey("KeyD", false)}
            onTouchStart={() => triggerKey("KeyD", true)}
            onTouchEnd={() => triggerKey("KeyD", false)}
            className="w-10 h-10 rounded bg-[#161B22] hover:bg-[#21262D] active:bg-indigo-600 font-mono font-bold text-[#E0E0E0] active:text-white border border-[#2D333B] flex items-center justify-center select-none text-sm transition-colors cursor-pointer"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-wider mr-1 hidden sm:inline">ACTIONS:</span>
          <button
            onClick={() => {
              triggerKey("KeyJ", true);
              setTimeout(() => triggerKey("KeyJ", false), 150);
            }}
            className="px-3.5 h-10 rounded bg-[#da3633]/20 hover:bg-[#da3633]/30 active:bg-[#da3633] active:text-white font-mono text-xs font-bold text-[#f85149] border border-[#da3633]/50 flex items-center gap-1.5 select-none transition-colors cursor-pointer"
          >
            ⚔️ [J] Tấn Công
          </button>
          <button
            onClick={() => {
              triggerKey("Space", true);
              setTimeout(() => triggerKey("Space", false), 150);
            }}
            className="px-4 h-10 rounded bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 font-mono text-xs font-bold text-white flex items-center gap-1.5 shadow-[0_0_10px_rgba(99,102,241,0.3)] select-none transition-colors cursor-pointer"
          >
            ⬆️ [Space] Nhảy Đôi
          </button>
        </div>
      </div>

      {/* Prompt Inspector Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#2D333B] rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-3 bg-[#161B22] border-b border-[#2D333B] flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-mono font-bold text-[#E0E0E0] text-xs uppercase tracking-wider">
                  {language === "vi"
                    ? "Cấu Trúc Prompt AI Studio Của Trò Chơi Này"
                    : "AI Studio Prompt Architecture"}
                </h3>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-[#8B949E] hover:text-[#E0E0E0] text-xs px-2 py-0.5 rounded bg-[#21262D] border border-[#2D333B] font-mono cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex flex-col gap-3 text-xs font-mono">
              <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/40 rounded text-indigo-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-[11px]">
                  {language === "vi"
                    ? "Bạn có thể dùng cấu trúc prompt này hoặc ấn nút 'Chuyển vào Studio' bên dưới để tùy biến game thành phong cách riêng của bạn!"
                    : "You can copy this prompt directly into Google AI Studio, or click 'Load into Studio' to customize."}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[#8B949E] uppercase tracking-wider text-[10px]">1. System Instruction cho AI Studio:</span>
                <pre className="p-2.5 bg-[#0A0C10] rounded border border-[#2D333B] text-[#3fb950] whitespace-pre-wrap text-[11px] leading-relaxed">
                  {`[ROLE]: Lead 2D Pixel Game Engineer
[RULES]:
- Implement 100% complete runnable HTML5 Canvas + TypeScript code.
- Procedural pixel art sprites (no external dead image links).
- Web Audio API chiptune sound generator for jump, slash, and coin.
- Smooth 60 FPS requestAnimationFrame with delta time physics.
- Both keyboard controls and touch controls.`}
                </pre>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[#8B949E] uppercase tracking-wider text-[10px]">2. User Prompt:</span>
                <pre className="p-2.5 bg-[#0A0C10] rounded border border-[#2D333B] text-sky-300 whitespace-pre-wrap text-[11px] leading-relaxed">
                  {`Build a 2D Retro Pixel Platformer called "Shadow Knight Odyssey":
- Resolution: 480x270 virtual pixel canvas with imageSmoothingEnabled = false.
- Player: Animated pixel hero with run cycle, double jump, and sword slash attack (J key).
- Foes: Patrolling green slimes with squash & stretch, floating bats on sine wave.
- Items: Rotating gold coins that increase score.
- Hazards: Spikes on the ground.
- Audio: Built-in 8-bit sound effects using Web Audio API oscillators.
- CRT Filter: Scanlines overlay with toggle button.`}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-[#161B22] border-t border-[#2D333B] flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(samplePromptForThisGame, null, 2));
                  alert(language === "vi" ? "Đã sao chép prompt!" : "Prompt copied!");
                }}
                className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-[#E0E0E0] border border-[#2D333B] rounded text-[11px] font-mono cursor-pointer"
              >
                📋 {language === "vi" ? "Sao chép Prompt" : "Copy Prompt"}
              </button>

              <button
                onClick={() => {
                  setShowPromptModal(false);
                  onUsePrompt(samplePromptForThisGame);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(99,102,241,0.3)] cursor-pointer"
              >
                <span>{language === "vi" ? "Tùy biến trong Studio" : "Load into Studio"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
