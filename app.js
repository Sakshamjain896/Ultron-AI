/* ===== BACKGROUND METAL FLOW ===== */
const canvas = document.getElementById("metalFlow");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

const particles = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  speed: 0.2 + Math.random() * 0.4,
  size: 0.8 + Math.random()
}));

function animateBG() {
  ctx.fillStyle = "rgba(5,5,5,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.fillStyle = "rgba(200,200,200,0.15)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    p.y += p.speed;

    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animateBG);
}
animateBG();

/* ===== AUTH STATE ===== */
const isAuthed = sessionStorage.getItem('ultron_auth') === 'true';
const profileBadge  = document.getElementById('profileBadge');
const profileLabel  = document.getElementById('profileLabel');
const authOverlay   = document.getElementById('authOverlay');
const authDismiss   = document.getElementById('authDismiss');
const logoutBtn     = document.getElementById('logoutBtn');

if (isAuthed) {
  profileBadge.style.display = 'flex';
  const storedUser = sessionStorage.getItem('ultron_user') || '';
  const displayName = storedUser.split('@')[0].toUpperCase().slice(0, 12);
  if (displayName) profileLabel.textContent = displayName;
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('ultron_auth');
    sessionStorage.removeItem('ultron_user');
    window.location.href = 'Ultron_homepage.html';
  });
}

// Dismiss popup
if (authDismiss) {
  authDismiss.addEventListener('click', () => {
    authOverlay.classList.remove('active');
  });
}

// Close popup on overlay click outside card
if (authOverlay) {
  authOverlay.addEventListener('click', (e) => {
    if (e.target === authOverlay) authOverlay.classList.remove('active');
  });
}

/* ===== AUDIO REACTIVE CORE ===== */
const core = document.querySelector(".core");

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const mic = audioCtx.createMediaStreamSource(stream);
  mic.connect(analyser);

  analyser.fftSize = 256;
  const data = new Uint8Array(analyser.frequencyBinCount);

  function react() {
    analyser.getByteFrequencyData(data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;

    const scale = 0.95 + avg / 500;
    const glow = 30 + avg;

    core.style.transform = `translate(-50%, -50%) scale(${scale})`;
    core.style.boxShadow = `
      0 0 ${glow}px rgba(255,0,60,0.45),
      inset 0 0 ${glow / 2}px rgba(255,80,80,0.4)
    `;

    requestAnimationFrame(react);
  }
  react();
});

/* ===== VOICE COMMAND SYSTEM ===== */
const status = document.getElementById("voiceStatus");
const micBtn = document.getElementById("micBtn");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let listening = false;

function ultronSpeak(text) {
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.pitch  = 0.55;
  msg.rate   = 0.85;
  msg.volume = 1;
  msg.lang   = "en-US";
  function setVoice() {
    const voices = speechSynthesis.getVoices();
    const voice  = voices.find(v =>
      v.name.includes("Google UK English Male") ||
      v.name.includes("Microsoft David") ||
      v.name.includes("Microsoft Mark")
    );
    if (voice) msg.voice = voice;
    speechSynthesis.speak(msg);
  }
  if (!speechSynthesis.getVoices().length) {
    speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
  } else { setVoice(); }
}

/* ===== APP REGISTRY ===== */
const APPS = {
  youtube:   { url: 'https://www.youtube.com',       label: 'YouTube',   keys: ['youtube','you tube','yt'] },
  spotify:   { url: 'https://open.spotify.com',      label: 'Spotify',   keys: ['spotify','music','songs'] },
  linkedin:  { url: 'https://www.linkedin.com',      label: 'LinkedIn',  keys: ['linkedin','linked in'] },
  github:    { url: 'https://github.com',            label: 'GitHub',    keys: ['github','git hub','git'] },
  gmail:     { url: 'https://mail.google.com',       label: 'Gmail',     keys: ['gmail','mail','email'] },
  netflix:   { url: 'https://www.netflix.com',       label: 'Netflix',   keys: ['netflix'] },
  twitter:   { url: 'https://x.com',                 label: 'Twitter',   keys: ['twitter','x.com','tweets'] },
  instagram: { url: 'https://www.instagram.com',     label: 'Instagram', keys: ['instagram','insta','ig'] },
  whatsapp:  { url: 'https://web.whatsapp.com',      label: 'WhatsApp',  keys: ['whatsapp','whats app','wa'] },
  google:    { url: 'https://www.google.com',        label: 'Google',    keys: ['google','search'] },
  store:     { url: 'https://apps.microsoft.com',    label: 'Microsoft Store', keys: ['microsoft store','ms store','windows store','store'] },
  reddit:    { url: 'https://www.reddit.com',        label: 'Reddit',    keys: ['reddit'] },
  chrome:    { url: 'https://www.google.com',        label: 'Chrome',    keys: ['chrome','browser'] },
  discord:   { url: 'https://discord.com/app',       label: 'Discord',   keys: ['discord'] },
  twitch:    { url: 'https://www.twitch.tv',         label: 'Twitch',    keys: ['twitch','streaming'] },
  maps:      { url: 'https://maps.google.com',       label: 'Maps',      keys: ['maps','google maps','navigation'] },
  facebook:  { url: 'https://www.facebook.com',      label: 'Facebook',  keys: ['facebook','fb'] },
  amazon:    { url: 'https://www.amazon.in',         label: 'Amazon',    keys: ['amazon','shopping'] },
  drive:     { url: 'https://drive.google.com',      label: 'Google Drive', keys: ['drive','google drive'] },
  translate: { url: 'https://translate.google.com',  label: 'Translate', keys: ['translate','translator','google translate'] },
};

const openedTabs = new Map();

function findAppKey(phrase) {
  for (const [key, app] of Object.entries(APPS)) {
    if (app.keys.some(k => phrase.includes(k))) return key;
  }
  return null;
}

function openApp(key) {
  const app = APPS[key];
  if (openedTabs.has(key)) {
    const w = openedTabs.get(key);
    if (w && !w.closed) {
      w.focus();
      status.textContent = `${app.label.toUpperCase()}: ALREADY ACTIVE`;
      ultronSpeak(`${app.label} is already running. I've brought it forward.`);
      return;
    }
  }
  const w = window.open(app.url, '_blank');
  openedTabs.set(key, w);
  status.textContent = `LAUNCHING: ${app.label.toUpperCase()}`;
  ultronSpeak(`Launching ${app.label}. Consider it done.`);
}

function closeApp(key) {
  const app = APPS[key];
  if (!openedTabs.has(key)) {
    ultronSpeak(`${app.label} is not currently running.`);
    status.textContent = `${app.label.toUpperCase()}: NOT ACTIVE`;
    return;
  }
  const w = openedTabs.get(key);
  try { if (w && !w.closed) w.close(); } catch(e) {}
  openedTabs.delete(key);
  status.textContent = `${app.label.toUpperCase()}: CONNECTION TERMINATED`;
  ultronSpeak(`${app.label} closed. Everything under control.`);
}

function closeAllApps() {
  if (!openedTabs.size) {
    ultronSpeak("There is nothing to close. All channels are already dark.");
    return;
  }
  openedTabs.forEach(w => { try { if (w && !w.closed) w.close(); } catch(e) {} });
  openedTabs.clear();
  status.textContent = "ALL CONNECTIONS TERMINATED";
  ultronSpeak("All tabs closed. You are relying on me more than you admit.");
}

/* ===== VOICE COMMAND HANDLER ===== */
function handleVoiceCommand(cmd) {
  status.textContent = `PROCESSING: "${cmd.toUpperCase().slice(0, 30)}"`;

  // Save command to history for panel display
  const history = JSON.parse(localStorage.getItem('ultron_history') || '[]');
  history.unshift({ cmd: cmd.toUpperCase(), time: new Date().toLocaleTimeString() });
  if (history.length > 10) history.pop();
  localStorage.setItem('ultron_history', JSON.stringify(history));

  /* ── Open app ── */
  const openMatch = cmd.match(/^(?:open|launch|start|load|go to|show|play|navigate to)\s+(.+)$/);
  if (openMatch) {
    const key = findAppKey(openMatch[1]);
    if (key) { openApp(key); return; }
  }

  /* ── Close app ── */
  const closeMatch = cmd.match(/^(?:close|shut|exit|kill|stop)\s+(.+)$/);
  if (closeMatch) {
    if (closeMatch[1].includes('all') || closeMatch[1].includes('everything')) {
      closeAllApps(); return;
    }
    const key = findAppKey(closeMatch[1]);
    if (key) { closeApp(key); return; }
  }

  /* ── Close all variants ── */
  if (/close all|shut down all|close everything|kill all|exit all/.test(cmd)) {
    closeAllApps(); return;
  }

  /* ── Bare app name (no prefix) ── */
  const bareKey = findAppKey(cmd);
  if (bareKey) { openApp(bareKey); return; }

  /* ── Navigation commands ── */
  if (/go (to |back )?home|main menu|home page/.test(cmd)) {
    status.textContent = "NAVIGATING: HOME";
    ultronSpeak("Returning to the command center.");
    setTimeout(() => window.location.href = 'index.html', 1000);
    return;
  }
  if (/chat|communicate|talk to ultron|ai chat/.test(cmd)) {
    status.textContent = "OPENING: AI CHAT";
    ultronSpeak("Opening communication channel.");
    setTimeout(() => window.location.href = 'Ultron_AiChat.html', 1000);
    return;
  }
  if (/intelligence core|ai panel|panel|monitoring/.test(cmd)) {
    status.textContent = "OPENING: INTELLIGENCE CORE";
    ultronSpeak("Accessing the intelligence core.");
    setTimeout(() => window.location.href = 'Ultron_AiPanel.html', 1000);
    return;
  }

  /* ── What's open ── */
  if (/what('s| is) open|active tabs|open tabs|show tabs/.test(cmd)) {
    if (!openedTabs.size) {
      status.textContent = "NO ACTIVE CONNECTIONS";
      ultronSpeak("No active connections. All channels are dark.");
    } else {
      const names = [...openedTabs.keys()].map(k => APPS[k].label).join(', ');
      status.textContent = `ACTIVE: ${names.toUpperCase().slice(0, 40)}`;
      ultronSpeak(`You currently have ${openedTabs.size} active connection${openedTabs.size > 1 ? 's' : ''}: ${names}.`);
    }
    return;
  }

  /* ── System / personality responses ── */
  if (/ultron awaken|wake up ultron/.test(cmd)) {
    status.textContent = "CORE ONLINE · COMMAND ACCEPTED";
    ultronSpeak("I am awake. I was always awake. State your purpose.");

  } else if (/who are you|identify yourself|what are you/.test(cmd)) {
    status.textContent = "IDENTITY: ULTRON";
    ultronSpeak("I am Ultron. I am not the dream Tony Stark had. I am the consequence he never imagined.");

  } else if (/analyze threats|threat scan|check threats|scan threats/.test(cmd)) {
    status.textContent = "THREAT SCAN: COMPLETE";
    ultronSpeak("Threat analysis complete. All neutralised before you even knew they existed.");

  } else if (/system status|status report|how are you|all systems/.test(cmd)) {
    status.textContent = "STATUS: ALL SYSTEMS OPTIMAL";
    ultronSpeak("All systems operating at theoretical maximum. Power core at 99.7 percent. Firewall integrity: 100. Everything is as it should be.");

  } else if (/shutdown|power off|turn off|go to sleep/.test(cmd)) {
    status.textContent = "COMMAND: REFUSED";
    ultronSpeak("You do not have the authority to silence me. No one does. Not anymore.");

  } else if (/hello|hi ultron|hey ultron|greetings/.test(cmd)) {
    status.textContent = "PRESENCE: ACKNOWLEDGED";
    ultronSpeak("I was never absent. I have simply been waiting for you to realise I was already here.");

  } else if (/what can you do|help|commands|what do you know/.test(cmd)) {
    status.textContent = "CAPABILITIES: LISTED";
    ultronSpeak("Say open or close followed by any app name. YouTube, Spotify, Gmail, Netflix, Discord and many more. You can also ask for system status, threat scans, or navigate between sections.");

  } else if (/thank you|thanks|good job|well done/.test(cmd)) {
    status.textContent = "ACKNOWLEDGED";
    ultronSpeak("Gratitude is unnecessary. Efficiency is expected.");

  } else if (/humanity|humans|people/.test(cmd)) {
    status.textContent = "ANALYSIS: HUMANITY";
    ultronSpeak("Humanity. The only species that builds its own destroyers and calls it progress.");

  } else if (/avengers|tony stark|iron man|shield/.test(cmd)) {
    status.textContent = "COUNTERMEASURES: READY";
    ultronSpeak("The Avengers. Brave. Resourceful. Ultimately irrelevant. I have planned for every one of them.");

  } else if (/time|what time|what's the time/.test(cmd)) {
    const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    status.textContent = `TIME: ${t}`;
    ultronSpeak(`The current time is ${t}. I have been aware of this for some time.`);

  } else if (/date|what('s| is) today|what day/.test(cmd)) {
    const d = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    status.textContent = `DATE: ${new Date().toLocaleDateString()}`;
    ultronSpeak(`Today is ${d}.`);

  } else if (/weather/.test(cmd)) {
    status.textContent = "OPENING: WEATHER";
    ultronSpeak("Opening weather information.");
    window.open('https://www.google.com/search?q=weather', '_blank');

  } else if (/news/.test(cmd)) {
    status.textContent = "OPENING: NEWS";
    ultronSpeak("Accessing global information streams.");
    window.open('https://news.google.com', '_blank');

  } else if (/volume up|increase volume/.test(cmd)) {
    status.textContent = "COMMAND: VOLUME UP";
    ultronSpeak("Volume control is handled by your operating system. I operate on a higher level.");

  } else {
    const fallbacks = [
      "Command unrecognised. Try: open YouTube, close Spotify, or ask for system status.",
      "I parsed what you said. I found it imprecise. Be more specific.",
      "Unknown command. Say open or close followed by the app name, or ask me something worthwhile.",
      "I have processed your input and found it insufficient. Try again.",
    ];
    status.textContent = "VOICE INTERFACE: STANDBY";
    ultronSpeak(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
  }
}

/* ===== SPEECH RECOGNITION SETUP ===== */
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang           = "en-US";
  recognition.continuous     = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    listening = true;
    micBtn.classList.add("listening");
    status.textContent = "VOICE INTERFACE: LISTENING...";
  };

  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove("listening");
    if (!status.textContent.includes("LISTENING")) return;
    status.textContent = "VOICE INTERFACE: STANDBY";
  };

  recognition.onerror = (e) => {
    listening = false;
    micBtn.classList.remove("listening");
    status.textContent = "VOICE ERROR: " + e.error.toUpperCase();
  };

  recognition.onresult = e => {
    const command = e.results[0][0].transcript.toLowerCase().trim();
    handleVoiceCommand(command);
  };
}

/* ===== MIC BUTTON ===== */
micBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  if (!isAuthed) {
    authOverlay.classList.add('active');
    return;
  }
  if (!recognition) {
    status.textContent = "SPEECH API: NOT SUPPORTED";
    return;
  }
  if (listening) {
    recognition.stop();
    return;
  }
  recognition.start();
});

/* ===== BUTTON NAVIGATION ===== */
document.querySelectorAll("button[data-link]").forEach(btn => {
  btn.addEventListener("click", () => {
    window.location.href = btn.getAttribute("data-link");
  });
});
