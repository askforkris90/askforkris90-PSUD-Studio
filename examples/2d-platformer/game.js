/**
 * PSUD Studio — 2D Platformer Example
 * A self-contained HTML5 Canvas game demonstrating core engine concepts:
 * - Entity / Component style objects
 * - Physics (gravity, collision)
 * - Input handling
 * - Camera follow
 * - Collectibles, hazards, win condition
 */

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // ─── Input ───────────────────────────────────────────────
  const keys = {};
  window.addEventListener('keydown', (e) => { keys[e.code] = true; if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault(); });
  window.addEventListener('keyup',   (e) => { keys[e.code] = false; });

  // ─── Level Data ──────────────────────────────────────────
  // Each platform: { x, y, w, h }
  const platforms = [
    // Ground
    { x: 0, y: 500, w: 400, h: 40 },
    { x: 450, y: 500, w: 300, h: 40 },
    { x: 800, y: 500, w: 400, h: 40 },
    { x: 1300, y: 500, w: 500, h: 40 },
    // Floating
    { x: 200, y: 400, w: 120, h: 20 },
    { x: 400, y: 320, w: 100, h: 20 },
    { x: 550, y: 250, w: 140, h: 20 },
    { x: 750, y: 350, w: 100, h: 20 },
    { x: 950, y: 280, w: 120, h: 20 },
    { x: 1150, y: 200, w: 100, h: 20 },
    { x: 1350, y: 320, w: 150, h: 20 },
    { x: 1550, y: 400, w: 120, h: 20 },
    { x: 1700, y: 280, w: 200, h: 20 },
    // Final platform
    { x: 1950, y: 500, w: 300, h: 40 },
  ];

  const coins = [
    { x: 250, y: 360, collected: false },
    { x: 440, y: 280, collected: false },
    { x: 600, y: 210, collected: false },
    { x: 790, y: 310, collected: false },
    { x: 990, y: 240, collected: false },
    { x: 1180, y: 160, collected: false },
    { x: 1400, y: 280, collected: false },
    { x: 1600, y: 360, collected: false },
    { x: 1780, y: 240, collected: false },
    { x: 2050, y: 440, collected: false },
  ];

  const spikes = [
    { x: 420, y: 480, w: 30, h: 20 },
    { x: 780, y: 480, w: 20, h: 20 },
    { x: 1100, y: 480, w: 40, h: 20 },
    { x: 1520, y: 480, w: 30, h: 20 },
  ];

  const flag = { x: 2100, y: 420, w: 20, h: 80 };

  // ─── Player ──────────────────────────────────────────────
  const player = {
    x: 60, y: 400,
    w: 28, h: 36,
    vx: 0, vy: 0,
    speed: 4.2,
    jumpForce: -11.5,
    onGround: false,
    facing: 1,
    invincible: 0,
  };

  // ─── Game State ──────────────────────────────────────────
  let cameraX = 0;
  let score = 0;
  let coinCount = 0;
  let lives = 3;
  let running = false;
  let won = false;
  let animFrame = 0;
  let particles = [];

  // ─── Helpers ─────────────────────────────────────────────
  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function spawnParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 30 + Math.random() * 20,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function resetPlayer() {
    player.x = 60;
    player.y = 400;
    player.vx = 0;
    player.vy = 0;
    player.invincible = 90;
    cameraX = 0;
  }

  function fullReset() {
    score = 0;
    coinCount = 0;
    lives = 3;
    won = false;
    coins.forEach(c => c.collected = false);
    particles = [];
    resetPlayer();
    updateHUD();
  }

  function updateHUD() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('coins').textContent = `Coins: ${coinCount}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
  }

  function showGameOver(title) {
    running = false;
    document.getElementById('endTitle').textContent = title;
    document.getElementById('endScore').textContent = `Score: ${score}  •  Coins: ${coinCount}`;
    document.getElementById('gameover').classList.remove('hidden');
  }

  // ─── Update ──────────────────────────────────────────────
  function update() {
    if (!running) return;
    animFrame++;

    // Horizontal input
    let move = 0;
    if (keys['KeyA'] || keys['ArrowLeft'])  move = -1;
    if (keys['KeyD'] || keys['ArrowRight']) move = 1;
    player.vx = move * player.speed;
    if (move !== 0) player.facing = move;

    // Jump
    if ((keys['KeyW'] || keys['ArrowUp'] || keys['Space']) && player.onGround) {
      player.vy = player.jumpForce;
      player.onGround = false;
    }

    // Gravity
    player.vy += 0.45;
    if (player.vy > 14) player.vy = 14;

    // Move X + collide
    player.x += player.vx;
    for (const p of platforms) {
      if (rectsOverlap(player, p)) {
        if (player.vx > 0) player.x = p.x - player.w;
        else if (player.vx < 0) player.x = p.x + p.w;
        player.vx = 0;
      }
    }

    // Move Y + collide
    player.y += player.vy;
    player.onGround = false;
    for (const p of platforms) {
      if (rectsOverlap(player, p)) {
        if (player.vy > 0) {
          player.y = p.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0) {
          player.y = p.y + p.h;
          player.vy = 0;
        }
      }
    }

    // Coins
    for (const c of coins) {
      if (!c.collected && rectsOverlap(player, { x: c.x, y: c.y, w: 16, h: 16 })) {
        c.collected = true;
        coinCount++;
        score += 100;
        spawnParticles(c.x + 8, c.y + 8, '#ffd700');
        updateHUD();
      }
    }

    // Spikes
    if (player.invincible <= 0) {
      for (const s of spikes) {
        if (rectsOverlap(player, s)) {
          lives--;
          updateHUD();
          spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#ff5252', 12);
          if (lives <= 0) {
            showGameOver('Game Over');
            return;
          }
          resetPlayer();
          break;
        }
      }
    } else {
      player.invincible--;
    }

    // Fall off world
    if (player.y > H + 50) {
      lives--;
      updateHUD();
      if (lives <= 0) {
        showGameOver('Game Over');
        return;
      }
      resetPlayer();
    }

    // Flag / win
    if (rectsOverlap(player, flag)) {
      score += 500 + coinCount * 50;
      updateHUD();
      won = true;
      showGameOver('You Win!');
      return;
    }

    // Camera
    const targetCam = player.x - W * 0.35;
    cameraX += (targetCam - cameraX) * 0.1;
    if (cameraX < 0) cameraX = 0;

    // Particles
    particles = particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.life--;
      return p.life > 0;
    });

    // Restart key
    if (keys['KeyR']) {
      fullReset();
      running = true;
      document.getElementById('gameover').classList.add('hidden');
    }
  }

  // ─── Draw ────────────────────────────────────────────────
  function draw() {
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a1a3a');
    grad.addColorStop(0.5, '#0d2040');
    grad.addColorStop(1, '#0a1528');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Parallax stars
    ctx.fillStyle = '#ffffff22';
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 97 + 50) - cameraX * 0.15) % (W + 20);
      const sy = (i * 53) % H;
      ctx.fillRect(sx, sy, 2, 2);
    }

    ctx.save();
    ctx.translate(-Math.round(cameraX), 0);

    // Platforms
    for (const p of platforms) {
      // Main body
      ctx.fillStyle = '#1a3050';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      // Top edge highlight
      ctx.fillStyle = '#00d4ff55';
      ctx.fillRect(p.x, p.y, p.w, 3);
      // Side shading
      ctx.fillStyle = '#0d1a30';
      ctx.fillRect(p.x, p.y + p.h - 4, p.w, 4);
    }

    // Spikes
    for (const s of spikes) {
      ctx.fillStyle = '#ff5252';
      const spikesCount = Math.floor(s.w / 10);
      for (let i = 0; i < spikesCount; i++) {
        const sx = s.x + i * 10;
        ctx.beginPath();
        ctx.moveTo(sx, s.y + s.h);
        ctx.lineTo(sx + 5, s.y);
        ctx.lineTo(sx + 10, s.y + s.h);
        ctx.fill();
      }
    }

    // Coins
    for (const c of coins) {
      if (c.collected) continue;
      const bob = Math.sin(animFrame * 0.1 + c.x) * 3;
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(c.x + 8, c.y + 8 + bob, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff8';
      ctx.beginPath();
      ctx.arc(c.x + 6, c.y + 6 + bob, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flag
    ctx.fillStyle = '#4da6ff';
    ctx.fillRect(flag.x, flag.y, 4, flag.h);
    ctx.fillStyle = '#00e676';
    ctx.beginPath();
    ctx.moveTo(flag.x + 4, flag.y);
    ctx.lineTo(flag.x + 40, flag.y + 14);
    ctx.lineTo(flag.x + 4, flag.y + 28);
    ctx.fill();

    // Player
    if (player.invincible <= 0 || Math.floor(animFrame / 4) % 2 === 0) {
      const px = player.x;
      const py = player.y;

      // Body
      ctx.fillStyle = '#00d4ff';
      ctx.fillRect(px + 4, py + 8, 20, 22);

      // Head
      ctx.fillStyle = '#e8f0ff';
      ctx.fillRect(px + 6, py, 16, 12);

      // Eyes
      ctx.fillStyle = '#060a14';
      const eyeOff = player.facing > 0 ? 4 : 0;
      ctx.fillRect(px + 8 + eyeOff, py + 4, 3, 3);
      ctx.fillRect(px + 14 + eyeOff, py + 4, 3, 3);

      // Legs (simple run cycle)
      ctx.fillStyle = '#0099cc';
      if (player.onGround && Math.abs(player.vx) > 0.5) {
        const leg = Math.sin(animFrame * 0.4) * 4;
        ctx.fillRect(px + 6, py + 30, 6, 6 + leg);
        ctx.fillRect(px + 16, py + 30, 6, 6 - leg);
      } else {
        ctx.fillRect(px + 6, py + 30, 6, 6);
        ctx.fillRect(px + 16, py + 30, 6, 6);
      }
    }

    // Particles
    for (const p of particles) {
      ctx.globalAlpha = Math.min(1, p.life / 20);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    // Vignette
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, '#060a1488');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  // ─── Loop ────────────────────────────────────────────────
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // ─── UI Events ───────────────────────────────────────────
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('overlay').classList.add('hidden');
    fullReset();
    running = true;
  });

  document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('gameover').classList.add('hidden');
    fullReset();
    running = true;
  });

  // Initial draw (idle)
  draw();
  loop();
})();
