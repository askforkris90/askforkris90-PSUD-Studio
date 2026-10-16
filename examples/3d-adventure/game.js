/**
 * PSUD Studio — 3D Adventure Example
 * Three.js based 3D platformer with a fully modeled character,
 * dynamic lighting, shadows, coins, hazards, and camera follow.
 * Uses global THREE from CDN script tag.
 */
(function () {
// ─── DOM ───────────────────────────────────────────────────
const canvas = document.getElementById('game');
const wrap = document.getElementById('canvas-wrap');

if (typeof THREE === 'undefined') {
  console.error('Three.js failed to load');
  return;
}

// ─── Renderer ──────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(wrap.clientWidth, wrap.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

// ─── Scene ─────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1528);
scene.fog = new THREE.FogExp2(0x0a1528, 0.012);

// ─── Camera ────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 200);
camera.position.set(0, 8, 14);

// ─── Lights ────────────────────────────────────────────────
const hemi = new THREE.HemisphereLight(0x4da6ff, 0x1a3050, 0.55);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff0dd, 1.4);
sun.position.set(20, 30, 15);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 80;
sun.shadow.camera.left = -30;
sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30;
sun.shadow.camera.bottom = -30;
sun.shadow.bias = -0.0005;
scene.add(sun);

const fill = new THREE.PointLight(0x00d4ff, 0.6, 40);
fill.position.set(-8, 6, 5);
scene.add(fill);

// ─── Materials ─────────────────────────────────────────────
const matPlatform = new THREE.MeshStandardMaterial({
  color: 0x1a3050,
  metalness: 0.3,
  roughness: 0.55,
});
const matPlatformTop = new THREE.MeshStandardMaterial({
  color: 0x00b4d8,
  metalness: 0.4,
  roughness: 0.35,
  emissive: 0x003344,
  emissiveIntensity: 0.3,
});
const matGround = new THREE.MeshStandardMaterial({
  color: 0x0d1a30,
  metalness: 0.2,
  roughness: 0.8,
});
const matSpike = new THREE.MeshStandardMaterial({
  color: 0xff3333,
  metalness: 0.5,
  roughness: 0.3,
  emissive: 0x440000,
  emissiveIntensity: 0.4,
});
const matCoin = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  metalness: 0.9,
  roughness: 0.2,
  emissive: 0xaa8800,
  emissiveIntensity: 0.35,
});
const matFlagPole = new THREE.MeshStandardMaterial({ color: 0x4da6ff, metalness: 0.6, roughness: 0.3 });
const matFlag = new THREE.MeshStandardMaterial({
  color: 0x00e676,
  metalness: 0.2,
  roughness: 0.5,
  emissive: 0x004422,
  emissiveIntensity: 0.3,
  side: THREE.DoubleSide,
});

// Character materials
const matBody = new THREE.MeshStandardMaterial({
  color: 0x00d4ff,
  metalness: 0.4,
  roughness: 0.4,
  emissive: 0x003344,
  emissiveIntensity: 0.25,
});
const matHead = new THREE.MeshStandardMaterial({
  color: 0xe8f0ff,
  metalness: 0.1,
  roughness: 0.5,
});
const matEye = new THREE.MeshStandardMaterial({ color: 0x060a14, roughness: 0.3 });
const matLimb = new THREE.MeshStandardMaterial({
  color: 0x0099cc,
  metalness: 0.3,
  roughness: 0.5,
});

// ─── Level Geometry ────────────────────────────────────────
function makePlatform(x, y, z, w, h, d) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matPlatform);
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.y = h / 2;
  group.add(body);

  // Glowing top edge
  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.05, 0.08, d + 0.05), matPlatformTop);
  top.position.y = h + 0.02;
  top.receiveShadow = true;
  group.add(top);

  group.position.set(x, y, z);
  scene.add(group);

  // Collision box (AABB)
  return {
    minX: x - w / 2, maxX: x + w / 2,
    minY: y, maxY: y + h,
    minZ: z - d / 2, maxZ: z + d / 2,
    mesh: group,
  };
}

const platforms = [
  // Starting ground
  makePlatform(0, 0, 0, 12, 1, 8),
  // Stepping stones
  makePlatform(10, 0, 0, 6, 1, 6),
  makePlatform(18, 1.5, 2, 5, 1, 5),
  makePlatform(26, 3, -1, 5, 1, 5),
  makePlatform(34, 1.5, 2, 5, 1, 5),
  makePlatform(42, 0, 0, 8, 1, 6),
  // Elevated path
  makePlatform(52, 2.5, 0, 5, 1, 5),
  makePlatform(60, 4.5, -2, 5, 1, 5),
  makePlatform(68, 6, 1, 5, 1, 5),
  makePlatform(76, 4, 0, 5, 1, 5),
  // Final area
  makePlatform(88, 0, 0, 14, 1, 10),
];

// Decorative ground plane
const groundGeo = new THREE.PlaneGeometry(250, 250);
const ground = new THREE.Mesh(groundGeo, matGround);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
ground.receiveShadow = true;
scene.add(ground);

// ─── Spikes ────────────────────────────────────────────────
function makeSpike(x, y, z) {
  const geo = new THREE.ConeGeometry(0.35, 1.0, 5);
  const mesh = new THREE.Mesh(geo, matSpike);
  mesh.position.set(x, y + 0.5, z);
  mesh.castShadow = true;
  scene.add(mesh);
  return { x, y, z, r: 0.5, mesh };
}

const spikes = [
  makeSpike(14, 1, 0),
  makeSpike(22, 2.5, 1),
  makeSpike(30, 4, -0.5),
  makeSpike(46, 1, 1.5),
  makeSpike(56, 3.5, -1),
  makeSpike(72, 7, 0.5),
];

// ─── Coins ─────────────────────────────────────────────────
function makeCoin(x, y, z) {
  const geo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 16);
  const mesh = new THREE.Mesh(geo, matCoin);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  scene.add(mesh);
  return { x, y, z, collected: false, mesh, baseY: y };
}

const coins = [
  makeCoin(6, 2.2, 0),
  makeCoin(14, 2.5, -1.5),
  makeCoin(22, 4, 0),
  makeCoin(30, 5.5, 1),
  makeCoin(38, 4, -1),
  makeCoin(48, 2.5, 0),
  makeCoin(56, 5.5, 1),
  makeCoin(64, 7.5, -1),
  makeCoin(72, 8.5, 0),
  makeCoin(82, 2.5, 0),
  makeCoin(90, 2.5, 2),
  makeCoin(92, 2.5, -2),
];

// ─── Flag (goal) ───────────────────────────────────────────
const flagGroup = new THREE.Group();
const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4, 8), matFlagPole);
pole.position.y = 2;
pole.castShadow = true;
flagGroup.add(pole);
const flagGeo = new THREE.PlaneGeometry(1.6, 1.0);
const flagMesh = new THREE.Mesh(flagGeo, matFlag);
flagMesh.position.set(0.85, 3.3, 0);
flagGroup.add(flagMesh);
flagGroup.position.set(94, 1, 0);
scene.add(flagGroup);

// ─── 3D Character ──────────────────────────────────────────
function createCharacter() {
  const group = new THREE.Group();

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.45), matBody);
  torso.position.y = 1.05;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.5), matHead);
  head.position.y = 1.75;
  head.castShadow = true;
  group.add(head);

  // Eyes
  const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.08), matEye);
  eyeL.position.set(-0.12, 1.8, 0.26);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.08), matEye);
  eyeR.position.set(0.12, 1.8, 0.26);
  group.add(eyeR);

  // Arms
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.22), matLimb);
  armL.position.set(-0.5, 1.05, 0);
  armL.castShadow = true;
  group.add(armL);
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.22), matLimb);
  armR.position.set(0.5, 1.05, 0);
  armR.castShadow = true;
  group.add(armR);

  // Legs
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 0.25), matLimb);
  legL.position.set(-0.2, 0.35, 0);
  legL.castShadow = true;
  group.add(legL);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 0.25), matLimb);
  legR.position.set(0.2, 0.35, 0);
  legR.castShadow = true;
  group.add(legR);

  // Store limb refs for animation
  group.userData = { armL, armR, legL, legR, torso, head };

  // Soft glow under character
  const glow = new THREE.PointLight(0x00d4ff, 0.8, 4);
  glow.position.y = 1;
  group.add(glow);

  return group;
}

const character = createCharacter();
character.position.set(0, 1, 0);
scene.add(character);

// ─── Player State ──────────────────────────────────────────
const player = {
  x: 0, y: 1, z: 0,
  vx: 0, vy: 0, vz: 0,
  speed: 7,
  jumpForce: 12,
  onGround: false,
  invincible: 0,
  facing: 0, // yaw angle
  width: 0.6,
  height: 1.9,
  depth: 0.5,
};

// ─── Input ─────────────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

// ─── Game State ────────────────────────────────────────────
let running = false;
let score = 0;
let coinCount = 0;
let lives = 3;
let clock = new THREE.Clock();
let particles = [];

// ─── Particles (simple sprites) ────────────────────────────
function spawnParticles(x, y, z, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const geo = new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 4, 4);
    const mat = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    particles.push({
      mesh,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 4 + 1,
      vz: (Math.random() - 0.5) * 5,
      life: 0.6 + Math.random() * 0.5,
    });
  }
}

// ─── Collision helpers ─────────────────────────────────────
function playerAABB() {
  return {
    minX: player.x - player.width / 2,
    maxX: player.x + player.width / 2,
    minY: player.y,
    maxY: player.y + player.height,
    minZ: player.z - player.depth / 2,
    maxZ: player.z + player.depth / 2,
  };
}

function overlaps(a, b) {
  return a.minX < b.maxX && a.maxX > b.minX &&
         a.minY < b.maxY && a.maxY > b.minY &&
         a.minZ < b.maxZ && a.maxZ > b.minZ;
}

// ─── Reset ─────────────────────────────────────────────────
function resetPlayer() {
  player.x = 0; player.y = 1; player.z = 0;
  player.vx = 0; player.vy = 0; player.vz = 0;
  player.invincible = 1.5;
  player.facing = 0;
  character.position.set(0, 1, 0);
  character.rotation.y = 0;
}

function fullReset() {
  score = 0; coinCount = 0; lives = 3;
  coins.forEach(c => {
    c.collected = false;
    c.mesh.visible = true;
  });
  // Clear leftover particles
  particles.forEach(p => scene.remove(p.mesh));
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

// ─── Update ────────────────────────────────────────────────
function update(dt) {
  if (!running) return;

  // Movement input (relative to camera-forward on XZ plane)
  let mx = 0, mz = 0;
  if (keys['KeyA'] || keys['ArrowLeft'])  mx -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) mx += 1;
  if (keys['KeyW'] || keys['ArrowUp'])    mz -= 1;
  if (keys['KeyS'] || keys['ArrowDown'])  mz += 1;

  // Normalize diagonal
  const len = Math.hypot(mx, mz);
  if (len > 0) { mx /= len; mz /= len; }

  player.vx = mx * player.speed;
  player.vz = mz * player.speed;

  // Face movement direction
  if (len > 0.1) {
    player.facing = Math.atan2(mx, mz);
  }

  // Jump
  if ((keys['Space'] || keys['KeyW'] && keys['ShiftLeft']) && player.onGround) {
    // Space only for jump to avoid conflict; also allow if W not used for forward alone
  }
  if (keys['Space'] && player.onGround) {
    player.vy = player.jumpForce;
    player.onGround = false;
  }

  // Gravity
  player.vy -= 28 * dt;
  if (player.vy < -25) player.vy = -25;

  // Integrate X
  player.x += player.vx * dt;
  let box = playerAABB();
  for (const p of platforms) {
    if (overlaps(box, p)) {
      if (player.vx > 0) player.x = p.minX - player.width / 2;
      else if (player.vx < 0) player.x = p.maxX + player.width / 2;
      player.vx = 0;
      box = playerAABB();
    }
  }

  // Integrate Z
  player.z += player.vz * dt;
  box = playerAABB();
  for (const p of platforms) {
    if (overlaps(box, p)) {
      if (player.vz > 0) player.z = p.minZ - player.depth / 2;
      else if (player.vz < 0) player.z = p.maxZ + player.depth / 2;
      player.vz = 0;
      box = playerAABB();
    }
  }

  // Integrate Y
  player.y += player.vy * dt;
  player.onGround = false;
  box = playerAABB();
  for (const p of platforms) {
    if (overlaps(box, p)) {
      if (player.vy <= 0) {
        player.y = p.maxY;
        player.vy = 0;
        player.onGround = true;
      } else {
        player.y = p.minY - player.height;
        player.vy = 0;
      }
      box = playerAABB();
    }
  }

  // Sync character mesh
  character.position.set(player.x, player.y, player.z);
  character.rotation.y = player.facing;

  // Limb animation
  const { armL, armR, legL, legR } = character.userData;
  const moving = Math.hypot(player.vx, player.vz) > 0.5 && player.onGround;
  const t = clock.elapsedTime;
  if (moving) {
    const swing = Math.sin(t * 10) * 0.5;
    armL.rotation.x = swing;
    armR.rotation.x = -swing;
    legL.rotation.x = -swing;
    legR.rotation.x = swing;
  } else {
    armL.rotation.x *= 0.8;
    armR.rotation.x *= 0.8;
    legL.rotation.x *= 0.8;
    legR.rotation.x *= 0.8;
  }

  // Invincibility blink
  if (player.invincible > 0) {
    player.invincible -= dt;
    character.visible = Math.floor(t * 8) % 2 === 0;
  } else {
    character.visible = true;
  }

  // Coins
  for (const c of coins) {
    if (c.collected) continue;
    // Bob & spin
    c.mesh.position.y = c.baseY + Math.sin(t * 3 + c.x) * 0.2;
    c.mesh.rotation.z = t * 3;

    const dx = player.x - c.x;
    const dy = (player.y + 1) - c.mesh.position.y;
    const dz = player.z - c.z;
    if (dx * dx + dy * dy + dz * dz < 1.2) {
      c.collected = true;
      c.mesh.visible = false;
      coinCount++;
      score += 100;
      spawnParticles(c.x, c.mesh.position.y, c.z, 0xffd700);
      updateHUD();
    }
  }

  // Spikes
  if (player.invincible <= 0) {
    for (const s of spikes) {
      const dx = player.x - s.x;
      const dy = (player.y + 0.5) - (s.y + 0.5);
      const dz = player.z - s.z;
      if (dx * dx + dy * dy + dz * dz < 0.7) {
        lives--;
        updateHUD();
        spawnParticles(player.x, player.y + 1, player.z, 0xff3333, 14);
        if (lives <= 0) {
          showGameOver('Game Over');
          return;
        }
        resetPlayer();
        break;
      }
    }
  }

  // Fall death
  if (player.y < -5) {
    lives--;
    updateHUD();
    if (lives <= 0) {
      showGameOver('Game Over');
      return;
    }
    resetPlayer();
  }

  // Flag win
  const fdx = player.x - 94;
  const fdz = player.z - 0;
  if (fdx * fdx + fdz * fdz < 4 && player.y < 5) {
    score += 500 + coinCount * 50;
    updateHUD();
    showGameOver('You Win!');
    return;
  }

  // Particles update
  particles = particles.filter(p => {
    p.life -= dt;
    p.mesh.position.x += p.vx * dt;
    p.mesh.position.y += p.vy * dt;
    p.mesh.position.z += p.vz * dt;
    p.vy -= 12 * dt;
    p.mesh.scale.setScalar(Math.max(0.01, p.life));
    if (p.life <= 0) {
      scene.remove(p.mesh);
      return false;
    }
    return true;
  });

  // Camera follow (smooth third-person)
  const idealCam = new THREE.Vector3(
    player.x - Math.sin(player.facing) * 0.5,
    player.y + 7,
    player.z + 13
  );
  camera.position.lerp(idealCam, 1 - Math.pow(0.01, dt));
  camera.lookAt(player.x, player.y + 1.5, player.z);

  // Restart
  if (keys['KeyR']) {
    fullReset();
    running = true;
    document.getElementById('gameover').classList.add('hidden');
  }
}

// ─── Render Loop ───────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  update(dt);
  renderer.render(scene, camera);
}

// ─── Resize ────────────────────────────────────────────────
window.addEventListener('resize', () => {
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// ─── UI ────────────────────────────────────────────────────
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

// Start render loop (idle scene)
animate();
})();
