/* ==========================================================================
      PROFILE SYSTEM v3.0
      CENTRAL AI CONTROL ENGINE
      Part 1 - Core Manager
========================================================================== */

"use strict";

/* ==========================================================
        BROADCAST CHANNEL
========================================================== */

const profileChannel =
    ("BroadcastChannel" in window)
        ? new BroadcastChannel("AI_CORE_NETWORK")
        : null;

/* ==========================================================
        SWITCH AI
========================================================== */

function switchAI(aiName){

    if(!window.AI_CORES[aiName]) return;

    window.settings.ai.personality = aiName;
    if (window.settings.ai) {
        window.settings.ai.active = aiName;
    }
    localStorage.setItem("selectedAI", aiName);

    window.applyThemeAesthetics();

    updateProfileUI();

    // Trigger stability bar shift
    const fill = document.getElementById("stabilityFill");
    const val = document.getElementById("stabilityValue");
    if (fill && val) {
        const stability = Math.floor(90 + Math.random() * 10);
        fill.style.width = stability + "%";
        val.textContent = stability + "%";
    }

    window.saveSettings();

}

function updateProfileUI(){

    const currentPersonality = (window.settings && window.settings.ai && window.settings.ai.personality) ? window.settings.ai.personality.toLowerCase() : 'ultron';
    const ai = (window.AI_CORES && window.AI_CORES[currentPersonality]) ? window.AI_CORES[currentPersonality] : { name: 'Ultron', id: 'ultron' };

    const titles={

        ultron:"AUTONOMOUS GLOBAL INTELLIGENCE",

        jarvis:"JUST A RATHER VERY INTELLIGENT SYSTEM",

        friday:"FEMALE REPLACEMENT INTELLIGENT DIGITAL ASSISTANT",

        vision:"SYNTHETIC VIBRANIUM INTELLIGENCE"

    };

    const aiTitle = document.getElementById("aiTitle");
    if (aiTitle) aiTitle.textContent = ai.name.toUpperCase();

    const aiSubtitle = document.getElementById("aiSubtitle");
    if (aiSubtitle) aiSubtitle.textContent = titles[ai.id || 'ultron'];

    const activeAI = document.getElementById("activeAI");
    if (activeAI) activeAI.textContent = (ai.name || 'Ultron').toUpperCase();

    const aiSelector = document.getElementById("aiSelector");
    if (aiSelector) aiSelector.value = ai.id || 'ultron';

}

/* ==========================================================
        SETTINGS SYNC Directives
========================================================== */

function syncSettingsToInputs() {
    const s = window.settings;
    if (!s) return;

    // User Identity
    if (s.account) {
        document.getElementById("usernameInput").value = s.account.username || "";
        document.getElementById("emailInput").value = s.account.email || "";
        document.getElementById("twoFAInput").checked = !!s.account.twoFA;
        document.getElementById("avatarSelect").value = s.account.avatarUrl || "marvel-ultron.png";
        
        const operatorName = document.getElementById("operatorName");
        if (operatorName) {
            operatorName.textContent = (s.account.username || "Operator").toUpperCase();
        }
    }

    // Personal Intelligence
    const currentPersonality = (s.ai && s.ai.personality) ? s.ai.personality.toLowerCase() : 'ultron';
    document.getElementById("aiSelector").value = currentPersonality;
    
    if (s.theme) {
        document.getElementById("themeVariation").value = s.theme.variation || "dark";
        document.getElementById("animSpeedInput").value = s.theme.animSpeed !== undefined ? s.theme.animSpeed : 1.0;
        document.getElementById("animSpeedVal").textContent = (s.theme.animSpeed !== undefined ? s.theme.animSpeed : 1.0) + "x";
        document.getElementById("compactModeInput").checked = !!s.theme.compactMode;
        document.getElementById("crtInput").checked = !!s.theme.crt;
    }

    // Developer Controls
    if (s.ai) {
        document.getElementById("tempInput").value = s.ai.temperature !== undefined ? s.ai.temperature : 0.7;
        document.getElementById("tempVal").textContent = s.ai.temperature !== undefined ? s.ai.temperature : 0.7;
        document.getElementById("tokensInput").value = s.ai.maxTokens !== undefined ? s.ai.maxTokens : 2048;
        document.getElementById("tokensVal").textContent = s.ai.maxTokens !== undefined ? s.ai.maxTokens : 2048;
        document.getElementById("thinkingModeSelect").value = s.ai.thinkingMode || "fast";
        document.getElementById("apiKeyInput").value = s.ai.apiKey || "";
        document.getElementById("memoryInput").checked = !!s.ai.memory;
    }

    updateProfileUI();
}

function saveInputsToSettings() {
    const s = window.settings;
    if (!s) return;

    // User Identity
    if (!s.account) s.account = {};
    s.account.username = document.getElementById("usernameInput").value.trim();
    s.account.email = document.getElementById("emailInput").value.trim();
    s.account.twoFA = document.getElementById("twoFAInput").checked;
    s.account.avatarUrl = document.getElementById("avatarSelect").value;

    // Personal Intelligence
    const aiName = document.getElementById("aiSelector").value;
    s.ai.personality = aiName;
    if (s.ai) {
        s.ai.active = aiName;
    }
    localStorage.setItem("selectedAI", aiName);

    if (!s.theme) s.theme = {};
    s.theme.variation = document.getElementById("themeVariation").value;
    s.theme.animSpeed = parseFloat(document.getElementById("animSpeedInput").value);
    s.theme.compactMode = document.getElementById("compactModeInput").checked;
    s.theme.crt = document.getElementById("crtInput").checked;

    // Developer Controls
    s.ai.temperature = parseFloat(document.getElementById("tempInput").value);
    s.ai.maxTokens = parseInt(document.getElementById("tokensInput").value);
    s.ai.thinkingMode = document.getElementById("thinkingModeSelect").value;
    s.ai.apiKey = document.getElementById("apiKeyInput").value.trim();
    s.ai.memory = document.getElementById("memoryInput").checked;
}

/* ==========================================================
        RECEIVE GLOBAL UPDATES
========================================================== */

if (profileChannel) {

    profileChannel.onmessage = (event) => {

        if (event.data) {
            window.settings = event.data;
            window.applyThemeAesthetics();
            syncSettingsToInputs();
        }

    };

}

/* ==========================================================
        INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", async ()=>{

    await window.loadSettings();

    // Populate inputs from stored settings
    syncSettingsToInputs();

    window.applyThemeAesthetics();

    // Theatrical onboarding engagement
    const overlay = document.getElementById("theatricalOverlay");
    const core = document.getElementById("theatricalCore");
    const page = document.querySelector(".profile-page");
    const bar = document.querySelector(".bottom-bar");

    if (overlay && core) {
        const currentAI = (window.settings.ai && window.settings.ai.personality) ? window.settings.ai.personality.toUpperCase() : 'ULTRON';
        const theatricalAI = document.getElementById("theatricalAI");
        const theatricalTitle = document.getElementById("theatricalTitle");
        
        if (theatricalAI) theatricalAI.textContent = currentAI;
        if (theatricalTitle) theatricalTitle.textContent = currentAI + " INITIALIZED";
        
        core.addEventListener("click", () => {
            if (window.ultronSpeak) {
                window.ultronSpeak("Core synchronized. Access granted.");
            }
            
            overlay.classList.add("ignited");
            
            setTimeout(() => {
                overlay.classList.add("fade-out");
                if (page) page.classList.add("engaged");
                if (bar) bar.classList.add("engaged");
            }, 1000);
        });
    } else {
        if (page) page.classList.add("engaged");
        if (bar) bar.classList.add("engaged");
    }

    // Attach range sliders feedback
    document.getElementById("animSpeedInput").addEventListener("input", (e) => {
        document.getElementById("animSpeedVal").textContent = e.target.value + "x";
    });

    document.getElementById("tempInput").addEventListener("input", (e) => {
        document.getElementById("tempVal").textContent = e.target.value;
    });

    document.getElementById("tokensInput").addEventListener("input", (e) => {
        document.getElementById("tokensVal").textContent = e.target.value;
    });

    // Active AI change
    document.getElementById("aiSelector")
    .addEventListener("change",(e)=>{

        switchAI(e.target.value);

    });

    // Commit button
    document.getElementById("saveBtn")
    .addEventListener("click", async ()=>{

        saveInputsToSettings();

        await window.saveSettings();

        window.applyThemeAesthetics();
        
        const operatorName = document.getElementById("operatorName");
        if (operatorName && window.settings.account) {
            operatorName.textContent = (window.settings.account.username || "Operator").toUpperCase();
        }

        alert("Configuration Saved");

    });

    // Reset button
    document.getElementById("resetBtn")
    .addEventListener("click", async ()=>{

        await window.resetSettings();

        syncSettingsToInputs();

        switchAI("ultron");

    });

});

/* ==========================================================================
      PART 2
      METALLIC BACKGROUND ENGINE
========================================================================== */

const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

let W, H;

function resizeCanvas(){

    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

}

window.addEventListener("resize",resizeCanvas);
resizeCanvas();


/* ==========================================================
        PARTICLES
========================================================== */

const PARTICLE_COUNT = 90;

let particles = [];

class Particle{

    constructor(){

        this.reset();

    }

    reset(){

        this.x = Math.random()*W;
        this.y = Math.random()*H;

        this.isCentral = Math.random() < 0.65; // 65% cluster around the central core
        if (this.isCentral) {
            this.angle = Math.random() * Math.PI * 2;
            this.distance = 110 + Math.random() * 90;
            this.orbitSpeed = (0.002 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1);
            this.x = W/2 + Math.cos(this.angle) * this.distance;
            this.y = H/2 + Math.sin(this.angle) * this.distance;
        } else {
            this.vx = (Math.random()-.5)*0.4;
            this.vy = (Math.random()-.5)*0.4;
        }

        this.radius = 1+Math.random()*2;

        this.energy = Math.random()*Math.PI*2;

    }

    update(){

        this.energy+=0.03;

        if (this.isCentral) {
            this.angle += this.orbitSpeed;
            const breathe = Math.sin(this.energy) * 8;
            this.x = W/2 + Math.cos(this.angle) * (this.distance + breathe);
            this.y = H/2 + Math.sin(this.angle) * (this.distance + breathe);
        } else {
            this.x+=this.vx;
            this.y+=this.vy;

            if(this.x<0||this.x>W) this.vx*=-1;
            if(this.y<0||this.y>H) this.vy*=-1;
        }

    }

}

for(let i=0;i<PARTICLE_COUNT;i++){

    particles.push(new Particle());

}


/* ==========================================================
        MOUSE
========================================================== */

const mouse={

    x:null,
    y:null

};

window.addEventListener("mousemove",e=>{

    mouse.x=e.clientX;
    mouse.y=e.clientY;

});


/* ==========================================================
        DRAW PARTICLES
========================================================== */

function drawParticles(color){

    particles.forEach(p=>{

        p.update();

        const glow=.45+.25*Math.sin(p.energy);

        ctx.beginPath();

        ctx.fillStyle=`rgba(${color.r},${color.g},${color.b},${glow})`;

        ctx.arc(

            p.x,
            p.y,
            p.radius,
            0,
            Math.PI*2

        );

        ctx.fill();

    });

}


/* ==========================================================
        DRAW CONNECTIONS
========================================================== */

function drawConnections(color){

    for(let i=0;i<particles.length;i++){

        for(let j=i+1;j<particles.length;j++){

            const dx=particles[i].x-particles[j].x;
            const dy=particles[i].y-particles[j].y;

            const dist=Math.sqrt(dx*dx+dy*dy);

            if(dist<140){

                ctx.strokeStyle=

                `rgba(${color.r},${color.g},${color.b},${.12-(dist/1400)})`;

                ctx.beginPath();

                ctx.moveTo(

                    particles[i].x,

                    particles[i].y

                );

                ctx.lineTo(

                    particles[j].x,

                    particles[j].y

                );

                ctx.stroke();

            }

        }

    }

}


/* ==========================================================
        MOUSE MAGNETIC FIELD
========================================================== */

function mouseInteraction(){

    if(mouse.x===null)return;

    particles.forEach(p=>{

        const dx=p.x-mouse.x;
        const dy=p.y-mouse.y;

        const d=Math.sqrt(dx*dx+dy*dy);

        if(d<120){

            const force=(120-d)/1500;

            p.x+=dx*force;
            p.y+=dy*force;

        }

    });

}


/* ==========================================================
        COLOR PARSER
========================================================== */

function currentRGB(){
    const currentPersonality = (window.settings && window.settings.ai && window.settings.ai.personality) 
        ? window.settings.ai.personality.toLowerCase() 
        : 'ultron';
    const ai = (window.AI_CORES && window.AI_CORES[currentPersonality]) 
        ? window.AI_CORES[currentPersonality] 
        : { accent: '#ff294d' };

    const hex = ai.accent || '#ff294d';

    return {
        r: parseInt(hex.substr(1,2),16) || 255,
        g: parseInt(hex.substr(3,2),16) || 41,
        b: parseInt(hex.substr(5,2),16) || 77
    };
}

/* ==========================================================
        AI SPECIFIC ANIMATION
========================================================== */

function renderEnergy(color){
    const currentPersonality = (window.settings && window.settings.ai && window.settings.ai.personality) ? window.settings.ai.personality.toLowerCase() : 'ultron';
    const mode = (window.AI_CORES[currentPersonality] || window.AI_CORES.ultron).energy;

    switch(mode){
        case "hex":
            renderMetallicHexGrid(color);
            break;
        case "orbit":
            renderMetallicCircuitTraces(color);
            break;
        case "stream":
            renderLiquidMetalFlow(color);
            break;
        case "wave":
            renderChromeWaves(color);
            break;
    }
}

function renderMetallicHexGrid(color){
    const spacing = 80;
    const t = Date.now() * 0.0015;
    
    for(let y=0; y<H+spacing; y+=spacing*0.86){
        for(let x=0; x<W+spacing; x+=spacing*1.5){
            const shiftX = (Math.floor(y / (spacing*0.86)) % 2) ? spacing*0.75 : 0;
            const cx = x + shiftX;
            const cy = y;
            
            const wave = Math.sin(t + cx * 0.003 + cy * 0.002) * 0.5 + 0.5;
            const noise = Math.sin(t * 1.5 + (cx * cy) % 100) * 0.5 + 0.5;
            
            const opacity = 0.08 + wave * 0.12;
            const accentBlend = wave > 0.8 ? (wave - 0.8) * 5 : 0;
            
            ctx.beginPath();
            for(let i=0; i<6; i++){
                const angle = Math.PI/3*i;
                const px = cx + Math.cos(angle)*30;
                const py = cy + Math.sin(angle)*30;
                if(i===0) ctx.moveTo(px,py);
                else ctx.lineTo(px,py);
            }
            ctx.closePath();
            
            if (accentBlend > 0.2) {
                ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 3.5})`;
                ctx.lineWidth = 1.6;
            } else {
                ctx.strokeStyle = `rgba(200, 205, 215, ${opacity})`;
                ctx.lineWidth = 1.0;
            }
            ctx.stroke();
            
            if (wave > 0.85 && noise > 0.8) {
                const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28);
                grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`);
                grad.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.08)`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.fill();
            }
        }
    }
}

function renderMetallicCircuitTraces(color){
    const spacing = 120;
    const t = Date.now() * 0.001;
    ctx.lineWidth = 1.2;
    
    for(let y=spacing; y<H; y+=spacing){
        ctx.strokeStyle = `rgba(200, 205, 215, 0.06)`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W * 0.35, y);
        ctx.lineTo(W * 0.42, y - 40);
        ctx.lineTo(W * 0.58, y - 40);
        ctx.lineTo(W * 0.65, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        
        const speed = 280;
        const totalLen = W + 80;
        const pulsePos = (t * speed) % totalLen;
        
        const points = [
            {x: 0, y: y},
            {x: W * 0.35, y: y},
            {x: W * 0.42, y: y - 40},
            {x: W * 0.58, y: y - 40},
            {x: W * 0.65, y: y},
            {x: W, y: y}
        ];
        
        let currentDist = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];
            const segmentDist = Math.sqrt((p2.x-p1.x)**2 + (p2.y-p1.y)**2);
            
            if (pulsePos >= currentDist && pulsePos <= currentDist + segmentDist + 120) {
                const startRatio = Math.max(0, (pulsePos - 120 - currentDist) / segmentDist);
                const endRatio = Math.min(1, (pulsePos - currentDist) / segmentDist);
                
                if (endRatio > startRatio) {
                    const sx = p1.x + (p2.x - p1.x) * startRatio;
                    const sy = p1.y + (p2.y - p1.y) * startRatio;
                    const ex = p1.x + (p2.x - p1.x) * endRatio;
                    const ey = p1.y + (p2.y - p1.y) * endRatio;
                    
                    const grad = ctx.createLinearGradient(sx, sy, ex, ey);
                    grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`);
                    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
                    grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.95)`);
                    
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(ex, ey);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 3.0;
                    
                    ctx.save();
                    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
                    ctx.shadowBlur = 8;
                    ctx.stroke();
                    ctx.restore();
                }
            }
            currentDist += segmentDist;
        }
    }
    ctx.lineWidth = 1;
}

function renderLiquidMetalFlow(color){
    const t = Date.now() * 0.0006;
    for(let i=0; i<5; i++){
        const gradient = ctx.createLinearGradient(0, 0, W, 0);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.02)`);
        gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, 0.35)`);
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)');
        gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, 0.35)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.02)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4.5 - (i * 0.5);
        ctx.beginPath();
        const yOffset = H * 0.1 + (i * H * 0.18) + Math.sin(t + i * 1.5) * 60;
        ctx.moveTo(0, yOffset);
        
        ctx.bezierCurveTo(
            W * 0.25, yOffset - 140 + Math.cos(t * 1.2 + i) * 30, 
            W * 0.75, yOffset + 140 + Math.sin(t * 0.8 + i) * 30, 
            W, yOffset
        );
        
        ctx.save();
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
    }
    ctx.lineWidth = 1;
}

function renderChromeWaves(color){
    const t = Date.now() * 0.001;
    for(let i=0; i<3; i++){
        const gradient = ctx.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.02)`);
        gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, 0.28)`);
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.65)');
        gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, 0.28)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.02)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        
        for(let x=0; x<W; x+=12){
            const y = H * 0.5 + 
                      Math.sin(x * 0.003 + t + i * 2) * 100 + 
                      Math.cos(x * 0.0015 - t * 1.3) * 45;
            if(x===0) ctx.moveTo(x,y);
            else ctx.lineTo(x,y);
        }
        
        ctx.save();
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
    }
    ctx.lineWidth = 1;
}


function drawMetallicGrid(color) {
    // Concentric grid grooves are rendered in drawMetallicReflections to preserve correct layer order
}

function drawMetallicReflections() {
    const color = currentRGB();
    drawMetallicAnisotropy(color);
}

function drawMetallicAnisotropy(color) {
    const t = Date.now() * 0.0004;
    ctx.save();
    
    // Calculate light source position slightly responsive to mouse
    const mx = (mouse.x !== null) ? mouse.x : W/2;
    const my = (mouse.y !== null) ? mouse.y : H/2;
    
    // Center of anisotropy grooves remains W/2, H/2, but reflection vector tilts
    const cx = W/2;
    const cy = H/2;
    
    const angle = t + Math.atan2(my - cy, mx - cx) * 0.25;
    
    // Conic gradient for metallic reflection sweeps
    const grad = ctx.createConicGradient(angle, cx, cy);
    
    // Dark steel to brushed chrome/silver gradients
    grad.addColorStop(0, '#090a0d');
    grad.addColorStop(0.15, '#191a20');
    grad.addColorStop(0.25, '#404149'); // Silver reflection beam
    grad.addColorStop(0.35, '#191a20');
    grad.addColorStop(0.5, '#090a0d');
    grad.addColorStop(0.65, '#191a20');
    grad.addColorStop(0.75, '#52545f'); // Stronger reflection beam
    grad.addColorStop(0.85, '#191a20');
    grad.addColorStop(1, '#090a0d');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    
    // Overlay concentric brushed steel lines/grooves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 0.8;
    for (let r = 50; r < Math.max(W, H); r += 8) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Add a dark radial shadow vignette to emphasize the center core glow
    const vignette = ctx.createRadialGradient(cx, cy, 100, cx, cy, Math.max(W, H) * 0.8);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    
    ctx.restore();
}

class NeuralPulse {
    constructor(startNode, endNode, hops = 3) {
        this.start = startNode;
        this.end = endNode;
        this.progress = 0;
        this.speed = 2.2;
        this.hops = hops;
    }

    update() {
        const dx = this.end.x - this.start.x;
        const dy = this.end.y - this.start.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist === 0) return true;
        
        this.progress += this.speed / dist;
        if (this.progress >= 1) {
            this.progress = 1;
            return true;
        }
        return false;
    }

    draw(color) {
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;
        
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.55)`;
        ctx.lineWidth = 1;
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.stroke();
    }
}

let neuralPulses = [];

function getDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx*dx + dy*dy);
}

/* ==========================================================
        MAIN LOOP
========================================================== */

function animateBackground(){

    ctx.clearRect(0,0,W,H);

    const color=currentRGB();

    // Render metallic layers
    drawMetallicGrid(color);
    drawMetallicReflections();

    renderEnergy(color);

    mouseInteraction();

    drawConnections(color);

    drawParticles(color);

    // Update and render active neural pulses
    neuralPulses = neuralPulses.filter(pulse => {
        const finished = pulse.update();
        pulse.draw(color);
        
        if (finished && pulse.hops > 0) {
            const neighbors = particles.filter(p => p !== pulse.start && p !== pulse.end && getDistance(pulse.end, p) < 140);
            if (neighbors.length > 0) {
                const nextNode = neighbors[Math.floor(Math.random() * neighbors.length)];
                neuralPulses.push(new NeuralPulse(pulse.end, nextNode, pulse.hops - 1));
            }
        }
        return !finished;
    });

    // Spawn new pulses occasionally
    if (neuralPulses.length < 20 && Math.random() < 0.06) {
        const candidates = particles.filter(p => p.isCentral);
        if (candidates.length > 0) {
            const start = candidates[Math.floor(Math.random() * candidates.length)];
            const neighbors = particles.filter(p => p !== start && getDistance(start, p) < 140);
            if (neighbors.length > 0) {
                const end = neighbors[Math.floor(Math.random() * neighbors.length)];
                neuralPulses.push(new NeuralPulse(start, end));
            }
        }
    }

    requestAnimationFrame(animateBackground);

}

animateBackground();