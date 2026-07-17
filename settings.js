/* ==========================================================================
   CYBERTRON SETTINGS DEFINITION CORE
   ========================================================================== */

window.DEFAULT_SETTINGS = {
  account: {
    username: "OPERATOR",
    email: "operator@cybertron.core",
    twoFA: false,
    avatarUrl: "marvel-ultron.png"
  },
  ai: {
    personality: "ultron",
    responseLength: "medium",
    thinkingMode: "fast",
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    memory: true
  },
  voice: {
    enabled: true,
    autoSpeak: false,
    model: "ultron",
    lang: "en-US",
    speed: 1.15,
    pitch: 0.20,
    volume: 100
  },
  theme: {
    variation: "dark",
    accentColor: "#ff2a4d",
    animSpeed: 1.0,
    fontSize: "normal",
    particles: true,
    scanlines: true,
    glow: true,
    crt: false,
    bgAnimation: true,
    mouseEffects: true,
    compactMode: false
  },
  chat: {
    typing: true,
    streaming: true,
    markdown: true,
    highlight: true,
    autoScroll: true,
    history: true,
    autoCopy: true,
    tokenUsage: true,
    timestamp: true
  }
};

// Initialize active global state cloned from defaults
window.settings = JSON.parse(JSON.stringify(window.DEFAULT_SETTINGS));
