/* ==========================================================================
   CYBERTRON GLOBAL APPLICATION-WIDE THEME LOADER
   ========================================================================== */

(function() {
  const AI_ANIMATIONS = {
    ultron: { pulse: "ultronPulse", speed: 1.0, rotate: 1.0 },
    jarvis: { pulse: "jarvisPulse", speed: 1.0, rotate: 1.0 },
    friday: { pulse: "fridayPulse", speed: 1.0, rotate: 1.0 },
    vision: { pulse: "visionPulse", speed: 1.0, rotate: 1.0 }
  };

  function applyGlobalTheme() {
    const savedNested = localStorage.getItem("ultron_settings_nested");
    const savedFlat = localStorage.getItem("ultron_settings");

    let accentColor = null;
    let variation = "dark";
    let glow = true;
    let crt = false;
    let animSpeed = 1.0;
    let fontSize = "normal";

    /* ==============================
   CURRENT AI
============================== */

let currentAI =
localStorage.getItem("selectedAI") || "ultron";

/* ===================================== */


    if (savedNested) {
      try {
        const s = JSON.parse(savedNested);
        if (s.theme) {
          accentColor = s.theme.accentColor;
          variation = s.theme.variation;
          glow = s.theme.glow;
          crt = s.theme.crt;
          animSpeed = s.theme.animSpeed;
          fontSize = s.theme.fontSize;
        }
      } catch (e) {}
    } else if (savedFlat) {
      try {
        const s = JSON.parse(savedFlat);
        accentColor = s.accentColor;
        variation = s.themeChassis === "theme-light-steel" || s.themeChassis === "theme-silver-core" ? "light" : (s.themeChassis === "theme-hologram-red" || s.themeChassis === "theme-hologram-alert" ? "alert" : "dark");
        glow = s.glow !== false;
        crt = s.crt === true;
        animSpeed = s.animationsEnabled === false ? 0 : 1.0;
      } catch (e) {}
    }

    if (!accentColor) {
      accentColor = "#ff2a4d";
    }

    const r = parseInt(accentColor.slice(1, 3), 16);
    const g = parseInt(accentColor.slice(3, 5), 16);
    const b = parseInt(accentColor.slice(5, 7), 16);

    document.documentElement.style.setProperty("--color-accent", accentColor);
    document.documentElement.style.setProperty("--color-accent-dim", `rgba(${r}, ${g}, ${b}, 0.15)`);
    document.documentElement.style.setProperty("--color-accent-glow", `rgba(${r}, ${g}, ${b}, 0.45)`);
    /* ---------- AI Animation Theme ---------- */

let aiTheme = "cybertron";

if (savedNested) {
    try {
        const s = JSON.parse(savedNested);

        if (s.selectedAI)
            aiTheme = s.selectedAI.toLowerCase();

    } catch(e){}
}

document.documentElement.setAttribute("data-ai-theme", aiTheme);

    const chassisClasses = ["theme-dark-metal", "theme-light-steel", "theme-hologram-alert", "theme-hologram-red", "theme-silver-core", "theme-black-titanium"];
    document.documentElement.classList.remove(...chassisClasses);
    document.body.classList.remove(...chassisClasses);
    
    let targetChassis = "theme-black-titanium";
    if (variation === "light") {
      targetChassis = "theme-silver-core";
      
      // Apply background gradient to HTML root element
      document.documentElement.style.background = "linear-gradient(160deg, #f0f3f6, #d9e1e8)";
      document.documentElement.style.backgroundAttachment = "fixed";
      document.body.style.background = "transparent";
    } else if (variation === "alert") {
      targetChassis = "theme-hologram-red";
      
      // Apply background gradient to HTML root element
      document.documentElement.style.background = "linear-gradient(160deg, #1d1000, #080300)";
      document.documentElement.style.backgroundAttachment = "fixed";
      document.body.style.background = "transparent";
    } else {
      document.documentElement.style.background = ""; 
      document.documentElement.style.backgroundAttachment = "";
      document.body.style.background = ""; 
    }
    
    document.documentElement.classList.add(targetChassis);
    document.body.classList.add(targetChassis);

    document.body.classList.remove(
"theme-cybertron",
"theme-jarvis",
"theme-friday",
"theme-vision"
);

document.body.classList.add(
"theme-"+currentAI
);

    let styleEl = document.getElementById("cybertron-global-theme-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cybertron-global-theme-style";
      document.head.appendChild(styleEl);
    }

    /* ===================================
   AI ANIMATION PROFILES
=================================== */

const hexAnimations={

cybertron:"hexCorrupt",

jarvis:"hexWave",

friday:"hexRipple",

vision:"hexEnergy"

};

document.documentElement.style
.setProperty(
"--hex-animation",
hexAnimations[currentAI]
);

const anim =
AI_ANIMATIONS[currentAI] ||
AI_ANIMATIONS.ultron;

    let cssRules = "";

    cssRules += `
      :root {
        --color-accent: ${accentColor} !important;
        --color-accent-glow: rgba(${r}, ${g}, ${b}, 0.45) !important;
        --color-accent-dim: rgba(${r}, ${g}, ${b}, 0.15) !important;
      }
      .back-btn, .back-home-btn, .action-btn {
        border-color: ${accentColor} !important;
        color: ${accentColor} !important;
      }
      .back-btn:hover, .back-home-btn:hover, .action-btn:hover {
        background-color: ${accentColor} !important;
        color: #fff !important;
      }
      .core {
        box-shadow: 0 0 40px ${accentColor}, inset 0 0 40px ${accentColor} !important;
        background: radial-gradient(circle, #fff 0%, ${accentColor} 70%) !important;
      }
      #profileBadge {
        border-color: ${accentColor} !important;
        box-shadow: 0 0 10px rgba(${r}, ${g}, ${b}, 0.2) !important;
      }
      .profile-avatar {
        background-color: ${accentColor} !important;
      }
      .logout-btn:hover {
        color: ${accentColor} !important;
      }
    `;
    cssRules += `

@keyframes ultronPulse{

0%{
filter:brightness(.8);
}

50%{
filter:brightness(1.3);
}

100%{
filter:brightness(.8);
}

}

@keyframes jarvisPulse{

0%{
transform:scale(1);
}

50%{
transform:scale(1.03);
}

100%{
transform:scale(1);
}

}

@keyframes fridayPulse{

0%{
filter:hue-rotate(0deg);
}

100%{
filter:hue-rotate(30deg);
}

}

@keyframes visionPulse{

0%{
box-shadow:0 0 20px var(--color-accent);
}

50%{
box-shadow:0 0 80px var(--color-accent);
}

100%{
box-shadow:0 0 20px var(--color-accent);
}

}

.core{

animation:${anim.pulse}
${3/anim.speed}s
infinite ease-in-out;

}

.hex{

animation:

hexFloat
${8/anim.speed}s linear infinite,

hexRotate
${20/anim.rotate}s linear infinite;

}

.panel{

animation:
panelGlow
${5/anim.speed}s infinite alternate;

}

.action-btn{

animation:
buttonGlow
${2/anim.speed}s infinite;

}

.profile-avatar{

animation:
avatarPulse
${4/anim.speed}s infinite;

}

`;

    if (crt) {
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

    if (!glow) {
      cssRules += `
        * {
          text-shadow: none !important;
          box-shadow: none !important;
          filter: none !important;
        }
      `;
    }

    if (fontSize === "small") {
      cssRules += `html { font-size: 85%; }`;
    } else if (fontSize === "large") {
      cssRules += `html { font-size: 110%; }`;
    } else if (fontSize === "gigantic") {
      cssRules += `html { font-size: 125%; }`;
    }

    if (animSpeed !== 1.0) {
      const scalar = animSpeed === 0 ? 99999 : 1 / animSpeed;
      cssRules += `
        * {
          transition-duration: calc(0.3s * ${scalar}) !important;
          animation-duration: calc(1s * ${scalar}) !important;
        }
      `;
    }

    styleEl.innerHTML = cssRules;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyGlobalTheme);
  } else {
    applyGlobalTheme();
  }

  window.addEventListener("storage", (e) => {
    if (e.key === "ultron_settings_nested" || e.key === "ultron_settings") {
      applyGlobalTheme();
    }
  });
})();

/* ==========================================================================
   AI THEME HELPERS
   ========================================================================== */

window.getCurrentAITheme = function () {
    return document.documentElement.getAttribute("data-ai-theme") || "ultron";
};

window.getThemeAccent = function () {
    return getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim();
};