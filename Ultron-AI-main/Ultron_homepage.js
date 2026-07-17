/* ─── Neural Network Background Animation ─────────────────── */
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');

  const NODE_COUNT   = 90;
  const LINK_DIST    = 145;
  const NODE_RADIUS  = 1.8;
  const SPEED        = 0.38;

  let nodes = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        // each node has a subtle individual opacity pulse offset
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  let accentColorRGB = { r: 255, g: 42, b: 77 };
  function updateAccentColor() {
    const rootStyle = getComputedStyle(document.documentElement);
    const accent = rootStyle.getPropertyValue('--theme-accent').trim() || rootStyle.getPropertyValue('--color-accent').trim();
    if (accent && accent.startsWith('#')) {
      const r = parseInt(accent.slice(1, 3), 16);
      const g = parseInt(accent.slice(3, 5), 16);
      const b = parseInt(accent.slice(5, 7), 16);
      accentColorRGB = { r, g, b };
    }
  }
  updateAccentColor();
  window.addEventListener("storage", (e) => {
    if (e.key === "ultron_settings_nested" || e.key === "ultron_settings") {
      setTimeout(updateAccentColor, 50);
    }
  });
  const themeObserver = new MutationObserver(() => {
    updateAccentColor();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── move nodes ──
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      n.phase += 0.012;
    }

    // ── draw connections ──
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.28;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${accentColorRGB.r}, ${accentColorRGB.g}, ${accentColorRGB.b}, ${alpha})`;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }

    // ── draw nodes ──
    for (const n of nodes) {
      const pulse = 0.55 + 0.45 * Math.sin(n.phase);
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentColorRGB.r}, ${accentColorRGB.g}, ${accentColorRGB.b}, ${pulse})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createNodes(); });
  resize();
  createNodes();
  draw();
})();

/* ─── Login Validation ────────────────────────────────────── */
function validateLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('error-msg');

  if (!username || !password) {
    errorMsg.textContent = 'ACCESS DENIED — CREDENTIALS REQUIRED';
    return;
  }

  if (username === 'jain.saksham896@gmail.com' && password === 'S@ksham89jain') {
    errorMsg.style.color = '#4dffa0';
    errorMsg.textContent = 'IDENTITY CONFIRMED — INITIALIZING...';
    sessionStorage.setItem('cybertron_auth', 'true');
    sessionStorage.setItem('cybertron_user', username);
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
  } else {
    errorMsg.textContent = 'ACCESS DENIED — INVALID CREDENTIALS';
  }
}

/* ─── Allow Enter key to submit ───────────────────────────── */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') validateLogin();
});