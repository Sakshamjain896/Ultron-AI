/* ===== CANVAS ANIMATION — HEX GRID PULSE ===== */
const canvas = document.getElementById("metalFlow");
const ctx = canvas.getContext("2d");

let W, H;
const HEX_SIZE = 28;    // radius of each hex
const HEX_GAP  = 3;     // gap between hexes
let hexes = [];         // { cx, cy, pulse, phase, speed, lit }
let pulseWaves = [];    // { cx, cy, radius, alpha } — expanding ring waves

function hexCorner(cx, cy, size, i) {
  const angle = (Math.PI / 180) * (60 * i - 30);
  return { x: cx + size * Math.cos(angle), y: cy + size * Math.sin(angle) };
}

function buildGrid() {
  hexes = [];
  const r = HEX_SIZE + HEX_GAP;
  const colW = r * 2 * Math.cos(Math.PI / 6);
  const rowH = r * 1.5;
  const cols = Math.ceil(W / colW) + 2;
  const rows = Math.ceil(H / rowH) + 2;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * colW + (row % 2 === 0 ? 0 : colW / 2);
      const y = row * rowH;
      hexes.push({
        cx: x, cy: y,
        pulse: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012,
        lit: Math.random() < 0.08  // 8% start lit
      });
    }
  }
}

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildGrid();
}
window.addEventListener("resize", resize);
resize();

// Spawn a pulse wave every 2.5s from a random lit hex
setInterval(() => {
  if (hexes.length === 0) return;
  const lit = hexes.filter(h => h.lit);
  if (lit.length === 0) return;
  const src = lit[Math.floor(Math.random() * lit.length)];
  pulseWaves.push({ cx: src.cx, cy: src.cy, radius: 0, alpha: 0.6 });
}, 2500);

function drawHex(cx, cy, size, fillStyle, strokeStyle) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const c = hexCorner(cx, cy, size, i);
    i === 0 ? ctx.moveTo(c.x, c.y) : ctx.lineTo(c.x, c.y);
  }
  ctx.closePath();
  if (fillStyle)   { ctx.fillStyle   = fillStyle;   ctx.fill();   }
  if (strokeStyle) { ctx.strokeStyle = strokeStyle; ctx.stroke(); }
}

function animateBG() {
  ctx.clearRect(0, 0, W, H);

  // Background gradient
  const grad = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
  grad.addColorStop(0,   "#04080f");
  grad.addColorStop(0.5, "#020408");
  grad.addColorStop(1,   "#000000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Draw hex grid
  ctx.lineWidth = 0.8;
  hexes.forEach(h => {
    h.phase += h.speed;
    const glow = (Math.sin(h.phase) + 1) / 2; // 0‒1

    if (h.lit) {
      // Lit hexes pulse red
      const intensity = 0.12 + glow * 0.25;
      drawHex(h.cx, h.cy, HEX_SIZE - 1, `rgba(255,42,77,${intensity * 0.4})`, `rgba(255,42,77,${intensity})`);
    } else {
      // Dim hexes — barely visible grid
      const dim = 0.035 + glow * 0.02;
      drawHex(h.cx, h.cy, HEX_SIZE - 1, null, `rgba(255,42,77,${dim})`);
    }

    // Random chance to flip lit state (creates living grid effect)
    if (Math.random() < 0.0003) h.lit = !h.lit;
  });

  // Draw expanding pulse waves
  pulseWaves = pulseWaves.filter(pw => pw.alpha > 0.01);
  pulseWaves.forEach(pw => {
    ctx.beginPath();
    ctx.arc(pw.cx, pw.cy, pw.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 80, 100, ${pw.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Light up hexes near the wave ring
    hexes.forEach(h => {
      const dx = h.cx - pw.cx;
      const dy = h.cy - pw.cy;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (Math.abs(d - pw.radius) < HEX_SIZE * 1.5) {
        h.lit = true;
        h.phase = 0; // restart pulse at full brightness
      }
    });

    pw.radius += 3;
    pw.alpha  *= 0.985;
  });

  requestAnimationFrame(animateBG);
}

animateBG();

/* ===== DASHBOARD LOGIC ===== */

// -- 1. Clock & World Data --
function updateWorldData() {
  const now = new Date();

  // Time
  const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
  const elTime = document.getElementById('worldTime');
  if (elTime) elTime.textContent = timeStr + " UTC";

  // Date
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase();
  const elDate = document.getElementById('worldDate');
  if (elDate) elDate.textContent = dateStr;

  // Mock Lat/Lon (or use navigator.geolocation if allowed, but mock is safer for UI demo)
  // Slowly drift the values to look like a satellite orbit
  const baseLat = 34.0522;
  const baseLon = -118.2437;
  const drift = (Date.now() / 10000) % 10;

  const getLat = document.getElementById('latVal');
  const getLon = document.getElementById('lonVal');
  if (getLat) getLat.textContent = (baseLat + Math.sin(drift) * 0.1).toFixed(4);
  if (getLon) getLon.textContent = (baseLon + Math.cos(drift) * 0.1).toFixed(4);
}
setInterval(updateWorldData, 1000);
updateWorldData();


// -- 2. Circular Gauges Animation --
function setGauge(id, percent) {
  const gaugeText = document.getElementById(id);
  if (!gaugeText) return;

  const gaugeWrapper = gaugeText.parentElement; // .gauge-wrapper
  const circle = gaugeWrapper.querySelector('.progress-ring-circle');
  if (!circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  // Ensure stroke-dasharray is set so animation works
  circle.style.strokeDasharray = `${circumference} ${circumference}`;

  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  gaugeText.textContent = Math.round(percent) + "%";
}

// Simulate fluctuating metrics
function fluctuateMetrics() {
  // Randomize slightly around high values
  const pwr = 90 + Math.random() * 10;
  const cpu = 40 + Math.random() * 40; // More volatile
  const net = 85 + Math.random() * 15;

  setGauge('gaugePower', pwr > 100 ? 100 : pwr);
  setGauge('gaugeCPU', cpu > 100 ? 100 : cpu);
  setGauge('gaugeNet', net > 100 ? 100 : net);
}
setInterval(fluctuateMetrics, 2000);
// Initial call after a brief delay to ensure DOM is ready
setTimeout(fluctuateMetrics, 100);


// -- 3. Terminal / Command History --
const terminalLog = document.getElementById('terminalLog');
let lastHistoryLength = 0;

function updateTerminal() {
  if (!terminalLog) return;
  
  const historyJSON = localStorage.getItem('ultron_history');
  if (!historyJSON) return;

  try {
    const history = JSON.parse(historyJSON); // Array of objects {cmd, time}
    
    // Check if we need run an update
    // We can't just check length because array might be same size but content different? 
    // Actually simplicity supports length check for now. If history is cleared, we reset.
    if (history.length !== lastHistoryLength) {
      terminalLog.innerHTML = ""; // Clear existing
      
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = "log-entry";
        div.innerHTML = `<span style="color:#666">[${item.time}]</span> <span style="color:#ddd">${item.cmd}</span>`;
        terminalLog.appendChild(div);
      });

      // Scroll to bottom
      terminalLog.scrollTop = terminalLog.scrollHeight;
      lastHistoryLength = history.length;
    }
  } catch (e) {
    console.error("History parse error", e);
  }
}
// Poll for updates from the main page
setInterval(updateTerminal, 1000);
setTimeout(updateTerminal, 500);


// -- 4. Status Monitor Button (Legacy Feature) --
const statusText = document.getElementById('statusText');
const monitorBtn = document.getElementById('monitorBtn');
let monitoring = false;
let monitorInterval;

const monitorMessages = [
  "SCANNING GLOBAL NETWORKS...",
  "ANALYZING DATA STREAMS...",
  "ENCRYPTING CONNECTION...",
  "UPDATING THREAT MODELS...",
  "SYNCHRONIZING CORE...",
  "OPTIMIZING NEURAL PATHWAYS..."
];

// Set initial status text on load
if (statusText) statusText.textContent = "ALL SYSTEMS NOMINAL";

if (monitorBtn) {
  monitorBtn.addEventListener('click', () => {
    monitoring = !monitoring;

    if (monitoring) {
      monitorBtn.textContent = "DEACTIVATE SYSTEM";
      monitorBtn.classList.add('active');
      if (statusText) statusText.style.color = "#ff2a4d";

      let i = 0;
      monitorInterval = setInterval(() => {
        if (statusText) statusText.textContent = monitorMessages[i];
        i = (i + 1) % monitorMessages.length;
      }, 2500);
      if (statusText) statusText.textContent = "SYSTEM MONITORING ACTIVE";

    } else {
      monitorBtn.textContent = "ENGAGE MONITORING";
      monitorBtn.classList.remove('active');
      clearInterval(monitorInterval);
      if (statusText) {
        statusText.textContent = "ALL SYSTEMS NOMINAL";
        statusText.style.color = "";
      }
    }
  });
}
