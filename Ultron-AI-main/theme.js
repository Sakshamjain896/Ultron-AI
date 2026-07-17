/* ==========================================================================
   CYBERTRON INTERFACE AESTHETICS CONTROLLER
   ========================================================================== */

window.AI_CORES = {
  ultron: {
    id: "ultron",
    name: "Ultron",
    accent: "#ff2a4d",
    secondary: "#89162b",
    glow: "rgba(255,42,77,.55)",
    metallic: "#c7c7c7",
    background: "linear-gradient(145deg,#050505,#1a1a1a)",
    particleColor: "#ff2a4d",
    energy: "hex"
  },
  jarvis: {
    id: "jarvis",
    name: "JARVIS",
    accent: "#00c8ff",
    secondary: "#005f88",
    glow: "rgba(0,200,255,.55)",
    metallic: "#d9edf6",
    background: "linear-gradient(145deg,#04141d,#08161f)",
    particleColor: "#00c8ff",
    energy: "orbit"
  },
  friday: {
    id: "friday",
    name: "FRIDAY",
    accent: "#ffb300",
    secondary: "#7b5400",
    glow: "rgba(255,179,0,.55)",
    metallic: "#efe1c5",
    background: "linear-gradient(145deg,#1d1402,#0e0900)",
    particleColor: "#ffb300",
    energy: "stream"
  },
  vision: {
    id: "vision",
    name: "VISION",
    accent: "#b455ff",
    secondary: "#502082",
    glow: "rgba(180,85,255,.55)",
    metallic: "#d9c4ff",
    background: "linear-gradient(145deg,#14051d,#090012)",
    particleColor: "#b455ff",
    energy: "wave"
  }
};

window.applyThemeAesthetics = function() {
  const t = window.settings.theme;
  if (!t) return;
  
  const core = (window.settings.ai && window.settings.ai.personality) ? window.settings.ai.personality.toLowerCase() : 'ultron';
  const aiInfo = window.AI_CORES[core] || window.AI_CORES.ultron;
  const accentColor = aiInfo.accent || '#ff2a4d';

  // 1. Handle accent color variables
  document.documentElement.style.setProperty("--color-accent", accentColor);
  document.documentElement.style.setProperty("--theme-accent", accentColor);
  
  // Custom theme properties for profile/background components
  document.documentElement.style.setProperty("--accent", aiInfo.accent);
  document.documentElement.style.setProperty("--accent-dark", aiInfo.secondary);
  document.documentElement.style.setProperty("--accent-glow", aiInfo.glow);
  document.documentElement.style.setProperty("--metal", aiInfo.metallic);
  document.documentElement.style.setProperty("--particle", aiInfo.particleColor);
  document.documentElement.style.setProperty("--background", aiInfo.background);
  document.body.setAttribute("data-ai", aiInfo.id);

  const r = parseInt(accentColor.slice(1, 3), 16);
  const g = parseInt(accentColor.slice(3, 5), 16);
  const b = parseInt(accentColor.slice(5, 7), 16);
  document.documentElement.style.setProperty("--color-accent-dim", `rgba(${r}, ${g}, ${b}, 0.15)`);
  document.documentElement.style.setProperty("--color-accent-glow", `rgba(${r}, ${g}, ${b}, 0.45)`);
  
  // Update hex label
  const valHex = document.getElementById("valAccentHex");
  if (valHex) valHex.textContent = accentColor.toUpperCase();
  
  // 2. Chassis variation classes (Applied to both HTML root and Body)
  const chassisClasses = ["theme-dark-metal", "theme-light-steel", "theme-hologram-alert", "theme-hologram-red", "theme-silver-core", "theme-black-titanium"];
  document.documentElement.classList.remove(...chassisClasses);
  document.body.classList.remove(...chassisClasses);
  
  if (t.variation === "dark") {
    document.documentElement.classList.add("theme-black-titanium");
    document.body.classList.add("theme-black-titanium");
    
    // Clear dynamic backgrounds
    document.documentElement.style.background = "";
    document.documentElement.style.backgroundAttachment = "";
    document.body.style.background = "transparent";
  } else if (t.variation === "light") {
    document.documentElement.classList.add("theme-silver-core");
    document.body.classList.add("theme-silver-core");
    
    // Apply gradient to root html
    document.documentElement.style.background = "linear-gradient(160deg, #f0f3f6, #d9e1e8)";
    document.documentElement.style.backgroundAttachment = "fixed";
    document.body.style.background = "transparent";
  } else if (t.variation === "alert") {
    document.documentElement.classList.add("theme-hologram-red");
    document.body.classList.add("theme-hologram-red");
    
    // Apply gradient to root html
    document.documentElement.style.background = "linear-gradient(160deg, #1d1000, #080300)";
    document.documentElement.style.backgroundAttachment = "fixed";
    document.body.style.background = "transparent";
  }

  // 3. Scanline layer overlay toggle
  const scanlinesEl = document.querySelector(".scanlines");
  if (scanlinesEl) {
    scanlinesEl.style.display = t.scanlines ? "block" : "none";
  }

  // 4. Inject overrides style block
  let styleEl = document.getElementById("cybertron-dynamic-aesthetics");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "cybertron-dynamic-aesthetics";
    document.head.appendChild(styleEl);
  }

  let cssRules = "";

  // CRT Screen Curvature
  if (t.crt) {
    cssRules += `
      body::after {
        content: " ";
        display: block;
        position: fixed;
        inset: 0;
        background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%);
        pointer-events: none;
        z-index: 10000;
      }
      body {
        transform: scale(1.005);
        filter: contrast(1.05) brightness(0.98);
      }
    `;
  }

  // Glowing shadows toggling
  if (!t.glow) {
    cssRules += `
      * {
        text-shadow: none !important;
        box-shadow: none !important;
        filter: none !important;
      }
      .card-glow, .card-scanner, .card-glow-active {
        display: none !important;
      }
    `;
  }

  // Compact Layout Mode
  if (t.compactMode) {
    cssRules += `
      .settings-card {
        padding: 15px 20px !important;
        margin-bottom: 15px !important;
      }
      .card-body {
        gap: 15px !important;
      }
      .setting-row {
        padding: 4px 0 !important;
      }
      .form-group {
        gap: 4px !important;
      }
    `;
  }

  // Font Size mapping
  if (t.fontSize === "small") {
    cssRules += `html { font-size: 85%; }`;
  } else if (t.fontSize === "large") {
    cssRules += `html { font-size: 110%; }`;
  } else if (t.fontSize === "gigantic") {
    cssRules += `html { font-size: 125%; }`;
  } else {
    cssRules += `html { font-size: 100%; }`;
  }

  // Animation Duration multipliers
  if (t.animSpeed !== 1.0) {
    const scalar = 1 / t.animSpeed;
    cssRules += `
      * {
        transition-duration: calc(0.3s * ${scalar}) !important;
        animation-duration: calc(1s * ${scalar}) !important;
      }
    `;
  }

  styleEl.innerHTML = cssRules;
};

window.enforceSystemTheme = function() {
  window.applyThemeAesthetics();
  window.dispatchEvent(new Event("storage"));
};
