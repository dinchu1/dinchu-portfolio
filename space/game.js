// ============================================
// TITLE SCREEN STAR ANIMATION
// ============================================
const titleCanvas = document.getElementById("title-stars");
const titleCtx = titleCanvas.getContext("2d");
titleCanvas.width = window.innerWidth;
titleCanvas.height = window.innerHeight;

const titleStars = Array.from({ length: 200 }, () => ({
  x: Math.random() * titleCanvas.width,
  y: Math.random() * titleCanvas.height,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random(),
  speed: Math.random() * 0.005 + 0.002,
  offset: Math.random() * Math.PI * 2,
}));

const titleShootingStars = Array.from({ length: 5 }, () => ({
  x: Math.random() * titleCanvas.width,
  y: Math.random() * titleCanvas.height * 0.5,
  vx: -(Math.random() * 6 + 4),
  vy: Math.random() * 3 + 1,
  length: Math.random() * 120 + 60,
  opacity: 0,
  life: 0,
  maxLife: Math.random() * 80 + 40,
  delay: Math.random() * 200,
}));

let gameStarted = false;
let titleFrame = 0;

function drawTitleStars(time) {
  titleCtx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);
  titleFrame++;

  titleStars.forEach((star) => {
    star.opacity = 0.3 + Math.sin(time * star.speed * 60 + star.offset) * 0.4;
    titleCtx.beginPath();
    titleCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    titleCtx.fillStyle = `rgba(150, 180, 255, ${Math.max(0, star.opacity)})`;
    titleCtx.fill();
  });

  titleShootingStars.forEach((s) => {
    if (titleFrame < s.delay) return;
    s.life++;
    if (s.life > s.maxLife) {
      s.x = Math.random() * titleCanvas.width;
      s.y = Math.random() * titleCanvas.height * 0.4;
      s.life = 0;
      s.delay = 0;
      s.maxLife = Math.random() * 80 + 40;
    }
    const progress = s.life / s.maxLife;
    s.opacity =
      progress < 0.2
        ? progress / 0.2
        : progress > 0.7
          ? 1 - (progress - 0.7) / 0.3
          : 1;

    const grad = titleCtx.createLinearGradient(
      s.x,
      s.y,
      s.x - s.vx * (s.length / 6),
      s.y - s.vy * (s.length / 6),
    );
    grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
    grad.addColorStop(1, `rgba(150,180,255,0)`);
    titleCtx.beginPath();
    titleCtx.moveTo(s.x, s.y);
    titleCtx.lineTo(s.x - s.vx * (s.length / 6), s.y - s.vy * (s.length / 6));
    titleCtx.strokeStyle = grad;
    titleCtx.lineWidth = 2;
    titleCtx.stroke();
    s.x += s.vx;
    s.y += s.vy;
  });

  if (!gameStarted) requestAnimationFrame(drawTitleStars);
}
drawTitleStars(0);

// ============================================
// TITLE SCREEN — ENTER BUTTON
// ============================================
const titleScreen = document.getElementById("title-screen");
const gameUI = document.getElementById("game-ui");

document.getElementById("title-enter").addEventListener("click", startGame);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !gameStarted) startGame();
});

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  titleScreen.classList.add("fade-out");
  setTimeout(() => {
    titleScreen.style.display = "none";
    gameUI.classList.add("visible");
  }, 1500);
}

// ============================================
// RENDERER
// ============================================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ============================================
// SCENE
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000008);
scene.fog = new THREE.FogExp2(0x00000f, 0.004);

// ============================================
// CAMERA
// ============================================
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000,
);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// ============================================
// LIGHTING
// ============================================
const ambientLight = new THREE.AmbientLight(0x08091a, 1.2);
scene.add(ambientLight);

const starLight = new THREE.DirectionalLight(0x6677cc, 0.4);
starLight.position.set(50, 100, 50);
starLight.castShadow = true;
scene.add(starLight);

const fillLight = new THREE.DirectionalLight(0x110822, 0.2);
fillLight.position.set(0, -50, 0);
scene.add(fillLight);

// ============================================
// SKYSPHERE
// ============================================
const skyGeo = new THREE.SphereGeometry(1400, 32, 32);
const skyMat = new THREE.MeshBasicMaterial({
  color: 0x0a0820,
  side: THREE.BackSide,
  fog: false,
});
const skySphere = new THREE.Mesh(skyGeo, skyMat);
scene.add(skySphere);

function addNebulaCloud(x, y, z, col1, col2, count, spread) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const cols = new Float32Array(count * 3);
  const c1 = new THREE.Color(col1);
  const c2 = new THREE.Color(col2);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.4) * spread;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.5;
    pos[i * 3] = x + Math.cos(theta) * Math.cos(phi) * r;
    pos[i * 3 + 1] = y + Math.sin(phi) * r * 0.6;
    pos[i * 3 + 2] = z + Math.sin(theta) * Math.cos(phi) * r;
    const t = Math.random();
    cols[i * 3] = c1.r * (1 - t) + c2.r * t;
    cols[i * 3 + 1] = c1.g * (1 - t) + c2.g * t;
    cols[i * 3 + 2] = c1.b * (1 - t) + c2.b * t;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  const pts = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(pts);
}

addNebulaCloud(-400, 100, -900, 0x000833, 0x221166, 3000, 350);
addNebulaCloud(500, 80, -800, 0x000622, 0x0a2255, 2500, 300);
addNebulaCloud(0, 200, -1000, 0x080022, 0x220944, 2000, 400);
addNebulaCloud(-700, 60, -500, 0x000a22, 0x112244, 1500, 280);

// ============================================
// BACKGROUND STARS
// ============================================
function makeStars(count, spread, size, opacity, color) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color, size, transparent: true, opacity }),
  );
}
scene.add(makeStars(4000, 1800, 0.4, 0.8, 0xffffff));
scene.add(makeStars(1000, 900, 0.7, 0.9, 0xaabbff));
scene.add(makeStars(500, 700, 1.1, 0.6, 0xffd0aa));

// ============================================
// SHOOTING STARS (3D)
// ============================================
const shootingStars = [];
const MAX_SHOOTING_STARS = 8;

function spawnShootingStar() {
  const geo = new THREE.BufferGeometry();
  const count = 30;
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const startX = (Math.random() - 0.5) * 600;
  const startY = 100 + Math.random() * 200;
  const startZ = -100 - Math.random() * 400;

  const dirX = (Math.random() - 0.5) * 2;
  const dirY = -Math.random() * 0.8 - 0.2;
  const dirZ = Math.random() * 0.5;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    pos[i * 3] = startX + dirX * t * 60;
    pos[i * 3 + 1] = startY + dirY * t * 60;
    pos[i * 3 + 2] = startZ + dirZ * t * 60;
    colors[i * 3] = 1;
    colors[i * 3 + 1] = 1 - t * 0.3;
    colors[i * 3 + 2] = 1 - t * 0.5;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  shootingStars.push({
    mesh: points,
    vx: dirX * 4,
    vy: dirY * 4,
    vz: dirZ * 4,
    life: 0,
    maxLife: 60 + Math.random() * 40,
  });
}

function updateShootingStars() {
  if (shootingStars.length < MAX_SHOOTING_STARS && Math.random() < 0.008) {
    spawnShootingStar();
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.life++;
    const pos = s.mesh.geometry.attributes.position.array;
    for (let j = 0; j < pos.length / 3; j++) {
      pos[j * 3] += s.vx;
      pos[j * 3 + 1] += s.vy;
      pos[j * 3 + 2] += s.vz;
    }
    s.mesh.geometry.attributes.position.needsUpdate = true;
    const progress = s.life / s.maxLife;
    s.mesh.material.opacity =
      progress < 0.1 ? progress / 0.1 : 1 - (progress - 0.1) / 0.9;
    if (s.life >= s.maxLife) {
      scene.remove(s.mesh);
      shootingStars.splice(i, 1);
    }
  }
}

// ============================================
// ANCIENT STONE BRIDGE SYSTEM
// ============================================
const BRIDGE_HALF = 26;
const BRIDGE_WIDTH = 4.0;
const DECK_H = 0.6;
const DECK_Y = 0.0;

const BRICK_W = 0.75;
const BRICK_D = 1.1;
const BRICK_GAP = 0.055;

const PARAPET_H = 0.75;
const PARAPET_THICK = 0.32;

const ARCH_COUNT = 3;
const PIER_H = 2.5;

const hubSize = BRIDGE_WIDTH + PARAPET_THICK * 2 + 0.2;

let _seed = 42;
function seededRand() {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}

const stoneMat = new THREE.MeshStandardMaterial({
  color: 0x2e2418,
  roughness: 0.97,
  metalness: 0.0,
  emissive: 0x060402,
  emissiveIntensity: 0.1,
});

const darkStoneMat = new THREE.MeshStandardMaterial({
  color: 0x1a130c,
  roughness: 0.99,
  metalness: 0.0,
  emissive: 0x030201,
  emissiveIntensity: 0.08,
});

const crackMat = new THREE.MeshStandardMaterial({
  color: 0xaa5511,
  emissive: 0x993300,
  emissiveIntensity: 0.8,
  roughness: 0.5,
  metalness: 0.2,
});

const mortarMat = new THREE.MeshStandardMaterial({
  color: 0x0e0a06,
  roughness: 1.0,
  metalness: 0.0,
  emissive: 0x000000,
});

function addBrickRow(group, z, y) {
  const cols = Math.floor(BRIDGE_WIDTH / (BRICK_W + BRICK_GAP));
  const totalW = cols * (BRICK_W + BRICK_GAP) - BRICK_GAP;
  for (let c = 0; c < cols; c++) {
    const bx = -totalW / 2 + BRICK_W / 2 + c * (BRICK_W + BRICK_GAP);
    const sinkY = seededRand() * 0.03;
    const mat = Math.floor(c + z * 3) % 2 === 0 ? stoneMat : darkStoneMat;
    const brick = new THREE.Mesh(
      new THREE.BoxGeometry(BRICK_W - 0.02, 0.13 - sinkY, BRICK_D - 0.02),
      mat,
    );
    brick.position.set(bx, y + 0.065 - sinkY * 0.5, z);
    brick.rotation.y = (seededRand() - 0.5) * 0.012;
    group.add(brick);
  }
  const mortar = new THREE.Mesh(
    new THREE.BoxGeometry(BRIDGE_WIDTH + 0.05, 0.015, BRICK_GAP * 0.6),
    mortarMat,
  );
  mortar.position.set(0, y - 0.008, z - BRICK_D / 2);
  group.add(mortar);
}

function addArch(group, zCenter, halfSpan, archWidth) {
  const steps = 12;
  const archR = halfSpan * 0.9;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI;
    const ay = DECK_Y - DECK_H - archR * 0.6 + Math.sin(angle) * archR * 0.6;
    const az = zCenter + Math.cos(angle) * halfSpan;
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(archWidth, 0.32, 0.35),
      darkStoneMat,
    );
    block.position.set(0, ay, az);
    block.rotation.x = -(angle - Math.PI / 2) * 0.6;
    group.add(block);
  }
  const keystone = new THREE.Mesh(
    new THREE.BoxGeometry(archWidth * 0.3, 0.1, 0.2),
    crackMat,
  );
  keystone.position.set(0, DECK_Y - DECK_H + 0.05, zCenter);
  group.add(keystone);
}

function addPier(group, zCenter) {
  const pier = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, PIER_H, BRIDGE_WIDTH * 0.5),
    darkStoneMat,
  );
  pier.position.set(0, DECK_Y - DECK_H - PIER_H / 2, zCenter);
  group.add(pier);
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.22, BRIDGE_WIDTH * 0.55),
    stoneMat,
  );
  cap.position.set(0, DECK_Y - DECK_H - 0.11, zCenter);
  group.add(cap);
  const rune = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, PIER_H * 0.5, 0.05),
    crackMat,
  );
  rune.position.set(
    0,
    DECK_Y - DECK_H - PIER_H / 2,
    zCenter + BRIDGE_WIDTH * 0.26,
  );
  group.add(rune);
}

function addParapet(group, sideX, length) {
  const hubGap = 12.0;
  const halfLen = length / 2 - hubGap / 2;

  [-1, 1].forEach((side) => {
    const zCenter = side * (halfLen / 2 + hubGap / 2);

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(PARAPET_THICK, PARAPET_H, halfLen),
      stoneMat,
    );
    wall.position.set(sideX, DECK_Y + PARAPET_H / 2, zCenter);
    group.add(wall);

    const mW = 0.4,
      mH = 0.3,
      mGap = 0.35;
    const mCount = Math.floor(halfLen / (mW + mGap));
    for (let m = 0; m < mCount; m++) {
      const mz = zCenter - halfLen / 2 + mW / 2 + m * (mW + mGap);
      const merlon = new THREE.Mesh(
        new THREE.BoxGeometry(PARAPET_THICK + 0.06, mH, mW),
        darkStoneMat,
      );
      merlon.position.set(sideX, DECK_Y + PARAPET_H + mH / 2, mz);
      group.add(merlon);
    }

    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.04, halfLen),
      crackMat,
    );
    glow.position.set(sideX, DECK_Y + 0.18, zCenter);
    group.add(glow);
  });
}

function createBridgeArm(dirX) {
  const group = new THREE.Object3D();
  scene.add(group);

  const armLen = BRIDGE_HALF * 2;
  const fullW = BRIDGE_WIDTH + PARAPET_THICK * 2;
  const hubClearance = hubSize + 0.2;

  [-1, 1].forEach((side) => {
    const halfLen = BRIDGE_HALF - hubClearance / 2;
    const zC = side * (halfLen / 2 + hubClearance / 2);
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(fullW, DECK_H, halfLen),
      darkStoneMat,
    );
    deck.position.set(0, DECK_Y - DECK_H / 2, zC);
    group.add(deck);
  });

  const rowCount = Math.floor(armLen / (BRICK_D + BRICK_GAP));
  for (let r = 0; r < rowCount; r++) {
    const z = -armLen / 2 + BRICK_D / 2 + r * (BRICK_D + BRICK_GAP);
    if (Math.abs(z) < 5.5) continue;
    addBrickRow(group, z, DECK_Y);
  }

  const cols = Math.floor(BRIDGE_WIDTH / (BRICK_W + BRICK_GAP));
  const totalW = cols * (BRICK_W + BRICK_GAP) - BRICK_GAP;
  for (let c = 1; c < cols; c++) {
    const bx = -totalW / 2 + c * (BRICK_W + BRICK_GAP) - BRICK_GAP / 2;
    [-1, 1].forEach((side) => {
      const halfLen = BRIDGE_HALF - hubClearance / 2;
      const zC = side * (halfLen / 2 + hubClearance / 2);
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(BRICK_GAP * 0.5, 0.015, halfLen),
        mortarMat,
      );
      line.position.set(bx, DECK_Y - 0.02, zC);
      group.add(line);
    });
  }

  addParapet(group, BRIDGE_WIDTH / 2 + PARAPET_THICK / 2, armLen);
  addParapet(group, -(BRIDGE_WIDTH / 2 + PARAPET_THICK / 2), armLen);

  const spanLen = armLen / (ARCH_COUNT + 1);
  for (let a = 0; a < ARCH_COUNT; a++) {
    const pz = -armLen / 2 + spanLen * (a + 1);
    if (Math.abs(pz) < 5.5) continue;
    addPier(group, pz);
    addArch(group, pz, spanLen * 0.42, BRIDGE_WIDTH * 0.8);
  }

  [-1, 1].forEach((side) => {
    const halfLen = BRIDGE_HALF - hubClearance / 2;
    const zC = side * (halfLen / 2 + hubClearance / 2);
    const belly = new THREE.Mesh(
      new THREE.BoxGeometry(fullW + 0.1, 0.1, halfLen),
      new THREE.MeshStandardMaterial({
        color: 0x0e0a06,
        roughness: 1,
        metalness: 0,
        emissive: 0x030201,
        emissiveIntensity: 0.3,
      }),
    );
    belly.position.set(0, DECK_Y - DECK_H - 0.05, zC);
    group.add(belly);
  });

  const underLight = new THREE.PointLight(0x331800, 0.25, 12);
  underLight.position.set(0, DECK_Y - DECK_H - 1.5, 0);
  group.add(underLight);

  if (dirX !== 0) group.rotation.y = Math.PI / 2;
}

createBridgeArm(0);
createBridgeArm(1);

const centerStone = new THREE.Mesh(
  new THREE.BoxGeometry(hubSize, DECK_H + 0.08, hubSize),
  new THREE.MeshStandardMaterial({
    color: 0x221a10,
    roughness: 0.95,
    metalness: 0.0,
    emissive: 0x060402,
    emissiveIntensity: 0.1,
  }),
);
centerStone.position.y = DECK_Y - (DECK_H + 0.08) / 2;
scene.add(centerStone);

const cornerSize = hubSize / 2;
[
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
].forEach(([sx, sz]) => {
  const corner = new THREE.Mesh(
    new THREE.BoxGeometry(cornerSize - 0.05, 0.14, cornerSize - 0.05),
    stoneMat,
  );
  corner.position.set(
    (sx * cornerSize) / 2,
    DECK_Y + 0.07,
    (sz * cornerSize) / 2,
  );
  scene.add(corner);
});

[
  { x: 0, z: -24, color: 0x994400 },
  { x: 24, z: 0, color: 0x883300 },
  { x: 0, z: 24, color: 0x996622 },
  { x: -24, z: 0, color: 0x884400 },
].forEach(({ x, z, color }) => {
  const endLight = new THREE.PointLight(color, 0.5, 10);
  endLight.position.set(x, DECK_Y + 1, z);
  scene.add(endLight);
});

// ============================================
// SPACE STATION HUB
// ============================================
const panelDirs = [
  { angle: 0, color: 0xffaa00 },
  { angle: Math.PI / 2, color: 0xff6600 },
  { angle: Math.PI, color: 0xffcc44 },
  { angle: -Math.PI / 2, color: 0xff8800 },
];

panelDirs.forEach(({ angle, color }) => {
  const dirPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.8, 0.1),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
    }),
  );
  dirPanel.position.set(Math.sin(angle) * 9, 1, Math.cos(angle) * 9);
  dirPanel.rotation.y = -angle;
  scene.add(dirPanel);
  const pLight = new THREE.PointLight(color, 0.4, 6);
  pLight.position.copy(dirPanel.position);
  scene.add(pLight);
});

const hubLight = new THREE.PointLight(0x552200, 0.8, 18);
hubLight.position.set(0, 2, 0);
scene.add(hubLight);

// ============================================
// CRYSTALS ON PATHS
// ============================================
const pathDefs = [
  { dir: new THREE.Vector3(0, 0, -1), color: 0xffaa00 },
  { dir: new THREE.Vector3(1, 0, 0), color: 0xff6600 },
  { dir: new THREE.Vector3(0, 0, 1), color: 0xffcc44 },
  { dir: new THREE.Vector3(-1, 0, 0), color: 0xff8833 },
];

const crystals = [];
pathDefs.forEach(({ dir, color }) => {
  [8, 16].forEach((dist, stopIndex) => {
    const perpL = new THREE.Vector3(-dir.z, 0, dir.x);
    const perpR = new THREE.Vector3(dir.z, 0, -dir.x);
    const baseY = 2 + stopIndex * 0.5;

    [perpL, perpR].forEach((perp, i) => {
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.3,
          roughness: 0.2,
          metalness: 0.7,
          transparent: true,
          opacity: 0.75,
        }),
      );
      crystal.position.set(
        dir.x * dist + perp.x * 2.5,
        baseY,
        dir.z * dist + perp.z * 2.5,
      );
      scene.add(crystal);
      crystals.push({
        mesh: crystal,
        baseY,
        offset: Math.random() * Math.PI * 2 + i,
        speed: 0.8,
      });
    });

    const cLight = new THREE.PointLight(color, 0.5, 5);
    cLight.position.set(dir.x * dist, baseY, dir.z * dist);
    scene.add(cLight);
  });
});

// ============================================
// FLOATING ROCKS
// ============================================
const floatingRocks = [];
[
  [-8, -3, -15, 1.5],
  [9, -4, -10, 1.0],
  [-6, 2, -20, 2.0],
  [7, 3, -18, 0.8],
  [-10, -2, 12, 1.2],
  [8, -5, 15, 1.8],
  [-5, 4, 20, 0.9],
  [6, 2, 22, 1.4],
  [-15, -3, 5, 1.6],
  [14, 3, -5, 1.1],
  [0, -6, -30, 2.5],
  [0, 5, 30, 1.8],
  [-30, 3, 0, 2.2],
  [30, -4, 0, 1.9],
].forEach(([x, y, z, size]) => {
  const rock = new THREE.Mesh(
    new THREE.IcosahedronGeometry(size, 1),
    new THREE.MeshStandardMaterial({
      color: 0x1a1510,
      emissive: 0x080604,
      emissiveIntensity: 0.5,
      roughness: 0.95,
      metalness: 0.0,
    }),
  );
  rock.position.set(x, y, z);
  rock.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  );
  scene.add(rock);
  floatingRocks.push({
    mesh: rock,
    rotSpeed: (Math.random() - 0.5) * 0.005,
    floatSpeed: Math.random() * 0.001 + 0.0005,
    floatOffset: Math.random() * Math.PI * 2,
    baseY: y,
  });
});

// ============================================
// PLANET + RING SYSTEM
// ============================================
const planetPos = new THREE.Vector3(0, 80, -420);

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(55, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0x060d1e,
    roughness: 0.92,
    metalness: 0.0,
    emissive: 0x020408,
    emissiveIntensity: 0.4,
  }),
);
planet.position.copy(planetPos);
scene.add(planet);

const bandData = [
  { lat: 0.15, width: 7, color: 0x0d1a2e, opacity: 0.55 },
  { lat: 0.35, width: 5, color: 0x091422, opacity: 0.45 },
  { lat: 0.55, width: 9, color: 0x111e32, opacity: 0.5 },
  { lat: 0.7, width: 4, color: 0x0a1628, opacity: 0.4 },
  { lat: -0.2, width: 6, color: 0x0e1c30, opacity: 0.5 },
  { lat: -0.5, width: 8, color: 0x0c1626, opacity: 0.45 },
];
bandData.forEach(({ lat, width, color, opacity }) => {
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(55 * Math.cos(lat * Math.PI), width, 12, 80),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity,
    }),
  );
  band.position.copy(planetPos);
  band.rotation.x = Math.PI / 2;
  band.position.y += lat * 55;
  scene.add(band);
});

const atmo = new THREE.Mesh(
  new THREE.SphereGeometry(58, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0x1144bb,
    emissive: 0x0a2266,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  }),
);
atmo.position.copy(planetPos);
scene.add(atmo);

const atmo2 = new THREE.Mesh(
  new THREE.SphereGeometry(66, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x3366cc,
    emissive: 0x1133aa,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.03,
    side: THREE.BackSide,
  }),
);
atmo2.position.copy(planetPos);
scene.add(atmo2);

const planetBackLight = new THREE.PointLight(0x6688cc, 6, 800);
planetBackLight.position.set(
  planetPos.x + 60,
  planetPos.y + 40,
  planetPos.z + 150,
);
scene.add(planetBackLight);

const planetGlowLight = new THREE.PointLight(0x223366, 3, 500);
planetGlowLight.position.copy(planetPos);
scene.add(planetGlowLight);

const ringTilt = 0.38;
const ringDefs = [
  { inner: 62, outer: 76, color: 0x2a3a55, opacity: 0.5 },
  { inner: 78, outer: 88, color: 0x3a4e6a, opacity: 0.65 },
  { inner: 90, outer: 108, color: 0x445577, opacity: 0.4 },
  { inner: 110, outer: 116, color: 0x556688, opacity: 0.55 },
  { inner: 118, outer: 135, color: 0x2a3a55, opacity: 0.28 },
];

ringDefs.forEach(({ inner, outer, color, opacity }) => {
  const ringGeo = new THREE.RingGeometry(inner, outer, 128);
  const pos = ringGeo.attributes.position;
  const uv = ringGeo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.sqrt(x * x + y * y);
    uv.setXY(
      i,
      (r - inner) / (outer - inner),
      Math.atan2(y, x) / (Math.PI * 2),
    );
  }
  const ring = new THREE.Mesh(
    ringGeo,
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  ring.position.copy(planetPos);
  ring.rotation.x = Math.PI / 2 + ringTilt;
  ring.rotation.z = 0.1;
  scene.add(ring);
});

const brightRing = new THREE.Mesh(
  new THREE.RingGeometry(87, 90, 128),
  new THREE.MeshBasicMaterial({
    color: 0x8aabdd,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
    depthWrite: false,
  }),
);
brightRing.position.copy(planetPos);
brightRing.rotation.x = Math.PI / 2 + ringTilt;
brightRing.rotation.z = 0.1;
scene.add(brightRing);

const ringDustGeo = new THREE.BufferGeometry();
const ringDustCount = 5000;
const ringDustPos = new Float32Array(ringDustCount * 3);
const ringDustCol = new Float32Array(ringDustCount * 3);
for (let i = 0; i < ringDustCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 64 + Math.random() * 70;
  const spread = (Math.random() - 0.5) * 4;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const cosT = Math.cos(Math.PI / 2 + ringTilt);
  const sinT = Math.sin(Math.PI / 2 + ringTilt);
  ringDustPos[i * 3] = planetPos.x + x;
  ringDustPos[i * 3 + 1] = planetPos.y + y * cosT + spread * sinT;
  ringDustPos[i * 3 + 2] = planetPos.z + y * sinT + spread * cosT;
  const t = Math.random();
  ringDustCol[i * 3] = 0.3 + t * 0.3;
  ringDustCol[i * 3 + 1] = 0.4 + t * 0.3;
  ringDustCol[i * 3 + 2] = 0.6 + t * 0.3;
}
ringDustGeo.setAttribute("position", new THREE.BufferAttribute(ringDustPos, 3));
ringDustGeo.setAttribute("color", new THREE.BufferAttribute(ringDustCol, 3));
const ringDust = new THREE.Points(
  ringDustGeo,
  new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }),
);
scene.add(ringDust);

// ============================================
// ORB + PLATFORMS
// ============================================
const orbsData = [
  {
    name: "About Me",
    position: new THREE.Vector3(0, 2, -25),
    color: 0xffaa00,
    lightColor: 0xff8800,
  },
  {
    name: "Skills",
    position: new THREE.Vector3(25, 2, 0),
    color: 0xff6600,
    lightColor: 0xff4400,
  },
  {
    name: "Projects",
    position: new THREE.Vector3(0, 2, 25),
    color: 0xffcc44,
    lightColor: 0xffaa00,
  },
  {
    name: "Contact",
    position: new THREE.Vector3(-25, 2, 0),
    color: 0xff8833,
    lightColor: 0xff6600,
  },
];

const orbs = [];
orbsData.forEach((data) => {
  const orbMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.88,
    }),
  );
  orbMesh.position.copy(data.position);
  scene.add(orbMesh);

  const glowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 32, 32),
    new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide,
    }),
  );
  glowMesh.position.copy(data.position);
  scene.add(glowMesh);

  const orbLight = new THREE.PointLight(data.lightColor, 0.8, 10);
  orbLight.position.copy(data.position);
  scene.add(orbLight);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16),
    new THREE.MeshStandardMaterial({
      color: 0x080820,
      emissive: data.color,
      emissiveIntensity: 0.2,
      roughness: 0.7,
      metalness: 0.5,
    }),
  );
  platform.position.set(data.position.x, 0.1, data.position.z);
  scene.add(platform);

  const label = document.createElement("div");
  label.className = "orb-label";
  label.textContent = data.name;
  label.style.color = "#" + data.color.toString(16).padStart(6, "0");
  document.body.appendChild(label);

  orbs.push({
    mesh: orbMesh,
    glow: glowMesh,
    light: orbLight,
    label,
    baseY: data.position.y,
    data,
  });
});

// ============================================
// PORTFOLIO CONTENT
// ============================================
const portfolioContent = {
  "About Me": {
    section: "Who I Am",
    title: "About Me",
    content: `Hi, I'm Dinchen — Senior Associate, Training & Quality
at Magicpin, though most of my actual day-to-day lives in
spreadsheets, dashboards, and automation scripts rather than
training rooms.

I'm currently pivoting toward Data Analyst / MIS Analyst roles —
turning the reporting systems I've already built at work into
a full-time focus. Outside of that, I build things like this
site for fun, because apparently regular portfolios weren't
interesting enough.`,
  },

  Skills: {
    section: "What I Know",
    title: "My Skills",
    content: `MIS & Reporting — Excel, Google Sheets, dashboard design, KPI tracking
Automation — Google Apps Script, Groq API (LLM) integration
Data — SQL, Python (actively growing)
Web Dev — Vanilla HTML/CSS/JS, Three.js, Vercel/Supabase

Most of what I know, I learned by automating something
at work that was annoying me until it wasn't a problem anymore.`,
  },

  Projects: {
    section: "What I Built",
    title: "My Projects",
    content: `This Portfolio — A Netflix-style site with this 3D universe
  hidden inside it. Vanilla JS, no framework, entirely custom.

AI-Powered Performance Reports — Apps Script + Groq API system
  that generates automated daily summaries for senior leadership.

QuickSlip — A payroll SaaS for small Indian shop owners,
  built with Supabase + Vercel.

Rongsa Farmstay — A live booking website for a homestay in
  Darjeeling, built and deployed end-to-end.`,
  },

  Contact: {
    section: "Get In Touch",
    title: "Contact Me",
    content: `I'd love to hear from you.

Email    — dinchusasonian10@gmail.com
LinkedIn — https://www.linkedin.com/in/dinchen-lepcha/
GitHub   — https://github.com/dinchu1

Open to Data Analyst / MIS Analyst opportunities, and always
happy to talk about spreadsheets I've made unnecessarily
overengineered.`,
  },
};

// ============================================
// ASTRONAUT CHARACTER (3D MODEL)
// ============================================
const player = new THREE.Object3D();
player.position.set(0, 1.2, 0);
scene.add(player);

const modelPivot = new THREE.Object3D();
modelPivot.rotation.y = Math.PI;
player.add(modelPivot);

// ---- LOAD 3D CHARACTER MODEL ----
// Place your .glb/.gltf file at models/astronaut.glb (adjust path as needed)
const gltfLoader = new THREE.GLTFLoader();
let characterMesh = null;
let mixer = null; // drives skeletal animation, if the model has any clips

gltfLoader.load(
  "models/astronaut.glb",
  (gltf) => {
    characterMesh = gltf.scene;

    // Every downloaded model comes in at a different scale/orientation/height —
    // tweak these three until the model's feet sit on top of the hover ring
    // (the hover ring is at player-local y = -0.85).
    characterMesh.scale.set(1, 1, 1);
    characterMesh.position.set(0, 0, 0);
    characterMesh.rotation.y = Math.PI / 2 + Math.PI; //;

    characterMesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    modelPivot.add(characterMesh);

    // Optional: auto-play the first animation clip (e.g. an idle or walk loop
    // exported from Mixamo/Blender). Safe to leave in even if there are none.
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(characterMesh);
      mixer.clipAction(gltf.animations[0]).play();
    }
  },
  undefined,
  (err) => {
    console.error("Failed to load character model:", err);
  },
);

// ---- HOVER RINGS ----
const hoverRingMat = new THREE.MeshStandardMaterial({
  color: 0xcc6600,
  emissive: 0x882200,
  emissiveIntensity: 1.2,
  transparent: true,
  opacity: 0.6,
});
const hoverRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.44, 0.042, 8, 32),
  hoverRingMat,
);
hoverRing.rotation.x = Math.PI / 2;
hoverRing.position.y = -0.85;
player.add(hoverRing);

const hoverRingInner = new THREE.Mesh(
  new THREE.TorusGeometry(0.25, 0.026, 8, 32),
  new THREE.MeshStandardMaterial({
    color: 0xdd8800,
    emissive: 0x885500,
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.7,
  }),
);
hoverRingInner.rotation.x = Math.PI / 2;
hoverRingInner.position.y = -0.85;
player.add(hoverRingInner);

// ---- TRAIL PARTICLES ----
const trailGeo = new THREE.BufferGeometry();
const trailCount = 40;
const trailPos = new Float32Array(trailCount * 3);
for (let i = 0; i < trailCount; i++) {
  trailPos[i * 3] = (Math.random() - 0.5) * 0.6;
  trailPos[i * 3 + 1] = -0.85 - Math.random() * 0.8;
  trailPos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
}
trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
const trail = new THREE.Points(
  trailGeo,
  new THREE.PointsMaterial({
    color: 0xff7700,
    size: 0.06,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  }),
);
player.add(trail);

// ---- PLAYER LIGHTS ----
const playerLight = new THREE.PointLight(0xcc6600, 0.9, 7);
playerLight.position.y = 0.5;
player.add(playerLight);

const playerLight2 = new THREE.PointLight(0xaa7700, 0.45, 4);
playerLight2.position.set(0, -0.5, 0);
player.add(playerLight2);

const visorLight = new THREE.PointLight(0xcc8800, 0.5, 2.5);
visorLight.position.set(0, 1.1, 0.45);
player.add(visorLight);

// ---- CHARACTER VISIBILITY LIGHTS ----
// Cool blue-white fill from front/above — simulates ambient space light hitting the model
const fillCharLight = new THREE.PointLight(0x99aacc, 0.65, 6);
fillCharLight.position.set(0, 2.5, 2.5);
player.add(fillCharLight);

// Warm rim light from behind — gives edge definition so character pops from dark bg
const rimLight = new THREE.PointLight(0xbb9966, 0.35, 4);
rimLight.position.set(0, 1.2, -2.2);
player.add(rimLight);

// ============================================
// KEYBOARD INPUT
// ============================================
const keysPressed = new Set();
document.addEventListener("keydown", (e) => {
  keysPressed.add(e.key.toLowerCase());
  if (
    ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(
      e.key.toLowerCase(),
    )
  ) {
    e.preventDefault();
  }
});
document.addEventListener("keyup", (e) =>
  keysPressed.delete(e.key.toLowerCase()),
);
function isDown(key) {
  return keysPressed.has(key);
}

// ============================================
// MOBILE JOYSTICK
// ============================================
const joystickEl = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystick-knob");
let joystickActive = false;
let joystickOrigin = { x: 0, y: 0 };
let joystickDelta = { x: 0, y: 0 };
const JOYSTICK_RADIUS = 45;

if (joystickEl) {
  joystickEl.addEventListener("touchstart", (e) => {
    e.preventDefault();
    joystickActive = true;
    const rect = joystickEl.getBoundingClientRect();
    joystickOrigin.x = rect.left + rect.width / 2;
    joystickOrigin.y = rect.top + rect.height / 2;
  });

  window.addEventListener("touchmove", (e) => {
    if (!joystickActive || e.touches.length !== 1) return;
    const touch = e.touches[0];
    let dx = touch.clientX - joystickOrigin.x;
    let dy = touch.clientY - joystickOrigin.y;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), JOYSTICK_RADIUS);
    const angle = Math.atan2(dy, dx);
    joystickDelta.x = (Math.cos(angle) * dist) / JOYSTICK_RADIUS;
    joystickDelta.y = (Math.sin(angle) * dist) / JOYSTICK_RADIUS;
    if (joystickKnob) {
      joystickKnob.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
    }
  });

  window.addEventListener("touchend", (e) => {
    if (e.touches.length === 0) {
      joystickActive = false;
      joystickDelta.x = 0;
      joystickDelta.y = 0;
      if (joystickKnob) joystickKnob.style.transform = "translate(-50%, -50%)";
    }
  });
}

// ============================================
// SETTINGS
// ============================================
const WALK_SPEED = 0.08;
const RUN_SPEED = 0.18;
const TURN_SPEED = 0.03;
const CAM_DISTANCE = 7;
const CAM_SMOOTHING = 0.08;
const INTERACT_RADIUS = 6;
const BOUNDARY = 27;
const ORBIT_SENSITIVITY = 0.005;
const PITCH_MIN = 0.1;
const PITCH_MAX = 1.2;
const HOVER_HEIGHT = 1.2;

// ============================================
// CAMERA ORBIT
// ============================================
let camYaw = 0,
  camPitch = 0.3;
let isOrbiting = false,
  orbitMode = false;
let lastMouseX = 0,
  lastMouseY = 0;

renderer.domElement.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  isOrbiting = true;
  orbitMode = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});
window.addEventListener("mouseup", () => {
  isOrbiting = false;
});
window.addEventListener("mousemove", (e) => {
  if (!isOrbiting) return;
  camYaw -= (e.clientX - lastMouseX) * ORBIT_SENSITIVITY;
  camPitch += (e.clientY - lastMouseY) * ORBIT_SENSITIVITY;
  camPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, camPitch));
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

let lastTouchX = 0,
  lastTouchY = 0,
  isTouching = false;
renderer.domElement.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    isTouching = true;
    orbitMode = true;
    lastTouchX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    lastTouchY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  }
});
window.addEventListener("touchend", () => {
  isTouching = false;
});
window.addEventListener("touchmove", (e) => {
  if (!isTouching || e.touches.length < 2) return;
  const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
  const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
  camYaw -= (mx - lastTouchX) * ORBIT_SENSITIVITY;
  camPitch += (my - lastTouchY) * ORBIT_SENSITIVITY;
  camPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, camPitch));
  lastTouchX = mx;
  lastTouchY = my;
});

// ============================================
// PANEL SYSTEM
// ============================================
const panel = document.getElementById("portfolio-panel");
const panelAccent = document.getElementById("panel-accent");
const panelSection = document.getElementById("panel-section");
const panelTitle = document.getElementById("panel-title");
const panelContent = document.getElementById("panel-content");
const panelClose = document.getElementById("panel-close");
const interactHint = document.getElementById("interact-hint");

let panelOpen = false;
let nearbyOrb = null;

function openPanel(orbName, color) {
  const content = portfolioContent[orbName];
  if (!content) return;
  panelSection.textContent = content.section;
  panelTitle.textContent = content.title;
  panelContent.textContent = content.content;
  const hex = "#" + color.toString(16).padStart(6, "0");
  panelAccent.style.background = hex;
  panelSection.style.color = hex;
  panel.classList.add("open");
  panelOpen = true;
}

function closePanel() {
  panel.classList.remove("open");
  panelOpen = false;
}

panelClose.addEventListener("click", closePanel);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && panelOpen) closePanel();
  if (e.key.toLowerCase() === "e" && nearbyOrb && !panelOpen && gameStarted) {
    openPanel(nearbyOrb.data.name, nearbyOrb.data.color);
  }
});

const mobileInteract = document.getElementById("mobile-interact");
if (mobileInteract) {
  mobileInteract.addEventListener("click", () => {
    if (nearbyOrb && !panelOpen && gameStarted) {
      openPanel(nearbyOrb.data.name, nearbyOrb.data.color);
    } else if (panelOpen) {
      closePanel();
    }
  });
}

// ============================================
// PLAYER UPDATE
// ============================================
let hoverTime = 0;
let isMoving = false;

function updatePlayer() {
  if (panelOpen || !gameStarted) return;

  const running = isDown("shift");
  const speed = running ? RUN_SPEED : WALK_SPEED;

  const fwdKey = isDown("w") || isDown("arrowup");
  const backKey = isDown("s") || isDown("arrowdown");
  const leftKey = isDown("a") || isDown("arrowleft");
  const rightKey = isDown("d") || isDown("arrowright");

  const joyFwd = joystickDelta.y < -0.2;
  const joyBack = joystickDelta.y > 0.2;
  const joyLeft = joystickDelta.x < -0.2;
  const joyRight = joystickDelta.x > 0.2;

  isMoving =
    fwdKey ||
    backKey ||
    joyFwd ||
    joyBack ||
    leftKey ||
    rightKey ||
    joyLeft ||
    joyRight;
  if (isMoving) orbitMode = false;

  const prevX = player.position.x;
  const prevZ = player.position.z;

  if (leftKey || joyLeft) player.rotation.y += TURN_SPEED;
  if (rightKey || joyRight) player.rotation.y -= TURN_SPEED;

  const actualSpeed =
    speed + (joystickActive ? Math.abs(joystickDelta.y) * speed : 0);

  if (fwdKey || joyFwd) {
    player.position.x -= Math.sin(player.rotation.y) * actualSpeed;
    player.position.z -= Math.cos(player.rotation.y) * actualSpeed;
  }
  if (backKey || joyBack) {
    player.position.x += Math.sin(player.rotation.y) * actualSpeed;
    player.position.z += Math.cos(player.rotation.y) * actualSpeed;
  }

  // Bridge collision
  const px = player.position.x;
  const pz = player.position.z;
  const halfW = BRIDGE_WIDTH / 2 + PARAPET_THICK - 0.3;
  const hubR = 4.8;
  const armEnd = BRIDGE_HALF - 0.5;

  const onNSArm = Math.abs(px) <= halfW && Math.abs(pz) <= armEnd;
  const onEWArm = Math.abs(pz) <= halfW && Math.abs(px) <= armEnd;
  const onHub = Math.sqrt(px * px + pz * pz) <= hubR;

  if (!onNSArm && !onEWArm && !onHub) {
    player.position.x = prevX;
    player.position.z = prevZ;
  }

  hoverTime += 0.02;
  const hoverY = HOVER_HEIGHT + Math.sin(hoverTime) * 0.18;
  player.position.y += (hoverY - player.position.y) * 0.1;

  // ---- TILT: forward lean only when moving forward, slight back lean when reversing ----
  const movingForward = fwdKey || joyFwd;
  const movingBack = backKey || joyBack;
  const targetTilt = movingForward
    ? running
      ? -0.12
      : -0.07 // lean forward — subtle, not too much
    : movingBack
      ? 0.05 // lean back slightly when reversing
      : 0; // stand upright otherwise
  player.rotation.x += (targetTilt - player.rotation.x) * 0.06;

  hoverRing.material.opacity = 0.35 + Math.sin(hoverTime * 2) * 0.15;
  hoverRingInner.rotation.z += 0.04;
  hoverRing.rotation.z -= 0.02;

  const trailPosArr = trail.geometry.attributes.position.array;
  for (let i = 0; i < trailCount; i++) {
    trailPosArr[i * 3 + 1] -= 0.03;
    if (trailPosArr[i * 3 + 1] < -1.7) {
      trailPosArr[i * 3] = (Math.random() - 0.5) * 0.5;
      trailPosArr[i * 3 + 1] = -0.85;
      trailPosArr[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
  }
  trail.geometry.attributes.position.needsUpdate = true;
  trail.material.opacity = isMoving ? 0.9 : 0.5;
}

// ============================================
// CAMERA UPDATE
// ============================================
function updateCamera() {
  if (orbitMode) {
    const x =
      player.position.x + Math.sin(camYaw) * Math.cos(camPitch) * CAM_DISTANCE;
    const y = player.position.y + Math.sin(camPitch) * CAM_DISTANCE;
    const z =
      player.position.z + Math.cos(camYaw) * Math.cos(camPitch) * CAM_DISTANCE;
    camera.position.x += (x - camera.position.x) * 0.1;
    camera.position.y += (y - camera.position.y) * 0.1;
    camera.position.z += (z - camera.position.z) * 0.1;
  } else {
    camYaw += (player.rotation.y - camYaw) * 0.05;
    camPitch += (0.3 - camPitch) * 0.05;
    const tx =
      player.position.x + Math.sin(camYaw) * Math.cos(camPitch) * CAM_DISTANCE;
    const ty = player.position.y + Math.sin(camPitch) * CAM_DISTANCE;
    const tz =
      player.position.z + Math.cos(camYaw) * Math.cos(camPitch) * CAM_DISTANCE;
    camera.position.x += (tx - camera.position.x) * CAM_SMOOTHING;
    camera.position.y += (ty - camera.position.y) * CAM_SMOOTHING;
    camera.position.z += (tz - camera.position.z) * CAM_SMOOTHING;
  }
  camera.lookAt(player.position.x, player.position.y + 0.8, player.position.z);
}

// ============================================
// ORB UPDATE
// ============================================
function updateOrbs(time) {
  nearbyOrb = null;
  let closestDist = Infinity;

  orbs.forEach((orb, index) => {
    orb.mesh.position.y =
      orb.baseY + Math.sin(time * 0.001 + index * 1.5) * 0.4;
    orb.glow.position.y = orb.mesh.position.y;
    orb.light.position.y = orb.mesh.position.y;
    orb.mesh.rotation.y += 0.005;

    const dx = player.position.x - orb.data.position.x;
    const dz = player.position.z - orb.data.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < INTERACT_RADIUS) {
      orb.mesh.material.emissiveIntensity =
        0.55 + Math.sin(time * 0.005) * 0.15;
      orb.glow.material.opacity = 0.14;
      orb.light.intensity = 1.6;
      if (dist < closestDist) {
        closestDist = dist;
        nearbyOrb = orb;
      }
    } else {
      orb.mesh.material.emissiveIntensity = 0.25;
      orb.glow.material.opacity = 0.07;
      orb.light.intensity = 0.8;
    }

    const pos3D = orb.mesh.position.clone();
    pos3D.y += 1.8;
    pos3D.project(camera);
    const sx = (pos3D.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-pos3D.y * 0.5 + 0.5) * window.innerHeight;
    if (pos3D.z < 1) {
      orb.label.style.opacity = gameStarted ? "1" : "0";
      orb.label.style.left = sx + "px";
      orb.label.style.top = sy + "px";
    } else {
      orb.label.style.opacity = "0";
    }
  });

  if (mobileInteract) {
    mobileInteract.style.opacity =
      nearbyOrb && !panelOpen && gameStarted ? "1" : "0";
    mobileInteract.style.pointerEvents =
      nearbyOrb && !panelOpen && gameStarted ? "all" : "none";
  }
  interactHint.style.opacity =
    nearbyOrb && !panelOpen && gameStarted ? "1" : "0";
}

// ============================================
// CRYSTAL + PLANET + ROCKS UPDATE
// ============================================
function updateCrystals(time) {
  crystals.forEach((c) => {
    c.mesh.rotation.y += 0.01;
    c.mesh.rotation.x += 0.005;
    c.mesh.position.y =
      c.baseY + Math.sin(time * 0.001 * c.speed + c.offset) * 0.3;
  });
}

function updateStation(time) {
  planet.rotation.y = time * 0.00008;
}

function updateRocks(time) {
  floatingRocks.forEach((r) => {
    r.mesh.rotation.y += r.rotSpeed;
    r.mesh.rotation.x += r.rotSpeed * 0.5;
    r.mesh.position.y =
      r.baseY + Math.sin(time * r.floatSpeed + r.floatOffset) * 1.5;
  });
}

// ============================================
// ANIMATION LOOP
// ============================================
const clock = new THREE.Clock();

function animate(time) {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  updatePlayer();
  updateCamera();
  updateOrbs(time);
  updateCrystals(time);
  updateStation(time);
  updateRocks(time);
  updateShootingStars();
  renderer.render(scene, camera);
}

animate(0);

// ============================================
// WINDOW RESIZE
// ============================================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  titleCanvas.width = window.innerWidth;
  titleCanvas.height = window.innerHeight;
});
