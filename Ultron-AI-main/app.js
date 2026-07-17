/* ================================
   METALLIC HONEYCOMB NETWORK
================================ */

const canvas = document.getElementById("metalFlow");
const ctx = canvas.getContext("2d");
const DPR = window.devicePixelRatio || 1;

function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

const HEX = 42;
const ROW = HEX * 0.86;
const COL = HEX * 1.5;

const cells = [];

function createGrid(){

    cells.length = 0;

    const rows = Math.ceil(canvas.height / ROW)+2;
    const cols = Math.ceil(canvas.width / COL)+2;

    for(let y=0;y<rows;y++){

        for(let x=0;x<cols;x++){

            cells.push({

                x:x*COL+(y%2?COL/2:0),
                y:y*ROW,

                brightness:Math.random()*0.15,
                pulse:Math.random()*500,
                drift:Math.random()*100

            });

        }

    }

}

createGrid();

window.addEventListener("resize",createGrid);



function drawHex(x,y,r){

    ctx.beginPath();

    for(let i=0;i<6;i++){

        const a=Math.PI/3*i;

        const px=x+r*Math.cos(a);
        const py=y+r*Math.sin(a);

        if(i===0)
            ctx.moveTo(px,py);
        else
            ctx.lineTo(px,py);

    }

    ctx.closePath();

}



let t=0;

/* ===============================
        DATA PULSES
================================ */
const pulses=[];

function animate(){

    t+=0.01;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(const c of cells){

        const glow=
            c.brightness+
            Math.sin(t*2+c.pulse)*0.25+
            Math.sin(t+c.drift)*0.1;

        drawHex(c.x,c.y,HEX/2);

        ctx.strokeStyle=`rgba(${180+glow*40},
                              ${190+glow*40},
                              ${210+glow*45},
                              ${0.05+glow*0.45})`;

        ctx.lineWidth=1.2;

        ctx.stroke();

        if(glow>0.15){

            drawHex(c.x,c.y,HEX/2-3);

            ctx.fillStyle=`rgba(180,190,210,${glow*0.07})`;

            ctx.shadowColor="rgba(220,220,255,.7)";
            ctx.shadowBlur=18;

            ctx.fill();

            ctx.shadowBlur=0;

        }

    }

    // drawPulse();

    requestAnimationFrame(animate);

}

animate();





// setInterval(()=>{
// 
//     pulses.push({
// 
//         x:-100,
//         y:Math.random()*canvas.height,
// 
//         vx:4+Math.random()*3,
//         vy:(Math.random()-0.5)*0.5,
// 
//         len:220
// 
//     });
// 
// },500);



function drawPulse(){

    for(let i=pulses.length-1;i>=0;i--){

        const p=pulses[i];

        p.x+=p.vx;
        p.y+=p.vy;

        const g=ctx.createLinearGradient(

            p.x,
            p.y,

            p.x+p.len,
            p.y

        );

        g.addColorStop(0,"rgba(255,255,255,0)");
        g.addColorStop(.5,"rgba(220,220,240,.8)");
        g.addColorStop(1,"rgba(255,255,255,0)");

        ctx.strokeStyle=g;
        ctx.lineWidth=2;

        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(p.x+p.len,p.y);
        ctx.stroke();

        if(p.x>canvas.width+200)
            pulses.splice(i,1);

    }

}

/* ==========================================================================
   CANVAS
   ========================================================================== */

function resizeCanvas() {

    width = window.innerWidth;
    height = window.innerHeight;

    centerX = width * 0.5;
    centerY = height * 0.5;

    canvas.width = width * DPR;
    canvas.height = height * DPR;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(DPR,0,0,DPR,0,0);

}

window.addEventListener("resize", resizeCanvas);

/* ==========================================================================
   THEME
   ========================================================================== */

const AI_THEMES = {

    cybertron:{

        main:"#ff2a4d",
        glow:"rgba(255,42,77,.45)",
        bright:"#ff879d",
        dark:"#44000d"

    },

    jarvis:{

        main:"#00d8ff",
        glow:"rgba(0,216,255,.45)",
        bright:"#80eeff",
        dark:"#003948"

    },

    friday:{

        main:"#ffc72a",
        glow:"rgba(255,199,42,.45)",
        bright:"#ffe488",
        dark:"#544000"

    }

};

window.getSystemAI = function(){

    try{

        const nested = JSON.parse(localStorage.getItem("ultron_settings_nested") || "{}");

        if(nested.ai && nested.ai.personality){

            return nested.ai.personality.toLowerCase();

        }

        const flat = localStorage.getItem("ultron_active_core");

        if(flat){

            return flat.toLowerCase();

        }

    }catch(e){}

    return "ultron";

};

function currentTheme(){

    return AI_THEMES[window.getSystemAI()] || AI_THEMES.cybertron;

}

/* ==========================================================================
   UTILITIES
   ========================================================================== */

function rand(min,max){

    return Math.random()*(max-min)+min;

}

function lerp(a,b,t){

    return a+(b-a)*t;

}

function clamp(v,min,max){

    return Math.max(min,Math.min(max,v));

}

function distance(x1,y1,x2,y2){

    return Math.hypot(x2-x1,y2-y1);

}

function randomSign(){

    return Math.random()<0.5?-1:1;

}

/* ==========================================================================
   SETTINGS
   ========================================================================== */

const SETTINGS={

    particleCount:950,

    maxConnections:8,

    connectionDistance:140,

    maxSpeed:2.4,

    particleRadius:2,

    trailLength:12,

    depth:900,

    mouseRadius:240,

    mouseForce:0.35,

    damping:0.985,

    coreRadius:90,

    ringCount:3,

    bloom:true,

    lightning:true,

    scanline:true

};

/* ==========================================================================
   MOUSE
   ========================================================================== */

const mouse={

    x:-9999,

    y:-9999,

    vx:0,

    vy:0,

    down:false,

    active:false

};

window.addEventListener("mousemove",(e)=>{

    mouse.vx=e.clientX-mouse.x;

    mouse.vy=e.clientY-mouse.y;

    mouse.x=e.clientX;

    mouse.y=e.clientY;

    mouse.active=true;

});

window.addEventListener("mouseleave",()=>{

    mouse.active=false;

    mouse.x=-9999;

    mouse.y=-9999;

});

window.addEventListener("mousedown",()=>{

    mouse.down=true;

});

window.addEventListener("mouseup",()=>{

    mouse.down=false;

});

/* ==========================================================================
   ARRAYS
   ========================================================================== */

const particles=[];

const sparks=[];

const shockwaves=[];

const lightningBolts=[];

const orbitNodes=[];

const scanBeams=[];

const energyBursts=[];

/* ==========================================================================
   TIME
   ========================================================================== */

let lastTime=performance.now();

let delta=0;

let elapsed=0;

/* ==========================================================================
   INITIALIZE
   ========================================================================== */

resizeCanvas();

/* ==========================================================================
   CYBERTRON AI ENGINE V2
   PART 2 - PARTICLE SYSTEM
   ========================================================================== */

class Particle {

    constructor() {

        this.reset();

        this.x = rand(0, width);
        this.y = rand(0, height);

    }

    reset() {

        this.x = rand(0, width);
        this.y = rand(0, height);

        this.z = rand(0.2, 1);

        this.radius = rand(0.8, 2.4);

        this.mass = this.radius * 0.6;

        this.vx = rand(-1.5, 1.5);
        this.vy = rand(-1.5, 1.5);

        this.ax = 0;
        this.ay = 0;

        this.alpha = rand(.25,.9);

        this.energy = rand(.2,1);

        this.pulse = rand(0,Math.PI*2);

        this.rotation = rand(0,360);

        this.spin = rand(-1,1);

        this.trail=[];

    }

    physics(){

        this.ax=0;
        this.ay=0;

        if(mouse.active){

            const dx=mouse.x-this.x;
            const dy=mouse.y-this.y;

            const d=Math.sqrt(dx*dx+dy*dy);

            if(d<SETTINGS.mouseRadius){

                const force=(1-d/SETTINGS.mouseRadius);

                if(mouse.down){

                    this.ax-=dx*force*0.015;
                    this.ay-=dy*force*0.015;

                }else{

                    this.ax+=dx*force*0.006;
                    this.ay+=dy*force*0.006;

                }

            }

        }

        const cx=centerX-this.x;
        const cy=centerY-this.y;

        this.ax+=cx*0.00008*this.z;
        this.ay+=cy*0.00008*this.z;

        this.vx+=this.ax;
        this.vy+=this.ay;

        this.vx*=SETTINGS.damping;
        this.vy*=SETTINGS.damping;

        this.vx=clamp(this.vx,-SETTINGS.maxSpeed,SETTINGS.maxSpeed);
        this.vy=clamp(this.vy,-SETTINGS.maxSpeed,SETTINGS.maxSpeed);

        this.x+=this.vx;
        this.y+=this.vy;

        if(this.x<-100) this.x=width+100;
        if(this.x>width+100) this.x=-100;

        if(this.y<-100) this.y=height+100;
        if(this.y>height+100) this.y=-100;

        this.rotation+=this.spin;

        this.pulse+=0.02*this.energy;

    }

    updateTrail(){

        this.trail.push({

            x:this.x,
            y:this.y

        });

        if(this.trail.length>SETTINGS.trailLength){

            this.trail.shift();

        }

    }

    drawTrail(theme){

        if(this.trail.length<2) return;

        ctx.beginPath();

        for(let i=0;i<this.trail.length;i++){

            const t=this.trail[i];

            if(i===0){

                ctx.moveTo(t.x,t.y);

            }else{

                ctx.lineTo(t.x,t.y);

            }

        }

        ctx.strokeStyle=theme.glow;

        ctx.globalAlpha=.15*this.alpha;

        ctx.lineWidth=this.radius*.6;

        ctx.stroke();

        ctx.globalAlpha=1;

    }

    draw(theme){

        const pulse=Math.sin(this.pulse)*0.4+1;

        const r=this.radius*this.z*pulse;

        ctx.shadowBlur=20*this.z;

        ctx.shadowColor=theme.main;

        ctx.beginPath();

        ctx.arc(

            this.x,

            this.y,

            r,

            0,

            Math.PI*2

        );

        ctx.fillStyle=theme.main;

        ctx.globalAlpha=this.alpha;

        ctx.fill();

        ctx.globalAlpha=1;

        ctx.shadowBlur=0;

    }

    update(theme){

        this.physics();

        this.updateTrail();

        this.drawTrail(theme);

        this.draw(theme);

    }

}

/* ==========================================================================
   CREATE PARTICLES
   ========================================================================== */

function createParticles(){

    particles.length=0;

    for(let i=0;i<SETTINGS.particleCount;i++){

        particles.push(

            new Particle()

        );

    }

}

createParticles();

/* ==========================================================================
   CYBERTRON AI ENGINE V2
   PART 3 - NEURAL NETWORK + ENERGY LINKS
   ========================================================================== */

function drawConnections(theme){

    const maxDist = SETTINGS.connectionDistance;

    ctx.lineWidth = 1;

    for(let i=0;i<particles.length;i++){

        const p1 = particles[i];

        let links = 0;

        for(let j=i+1;j<particles.length;j++){

            const p2 = particles[j];

            const dx = p2.x-p1.x;
            const dy = p2.y-p1.y;

            const d2 = dx*dx+dy*dy;

            if(d2>maxDist*maxDist) continue;

            links++;

            if(links>SETTINGS.maxConnections) break;

            const dist = Math.sqrt(d2);

            const alpha = (1-dist/maxDist)*0.45;

            const gradient = ctx.createLinearGradient(

                p1.x,
                p1.y,
                p2.x,
                p2.y

            );

            gradient.addColorStop(

                0,

                theme.main

            );

            gradient.addColorStop(

                0.5,

                theme.bright

            );

            gradient.addColorStop(

                1,

                theme.main

            );

            ctx.globalAlpha = alpha;

            ctx.strokeStyle = gradient;

            ctx.beginPath();

            ctx.moveTo(

                p1.x,
                p1.y

            );

            ctx.lineTo(

                p2.x,
                p2.y

            );

            ctx.stroke();

            if(dist<55){

                ctx.beginPath();

                ctx.arc(

                    (p1.x+p2.x)*0.5,

                    (p1.y+p2.y)*0.5,

                    1.2,

                    0,

                    Math.PI*2

                );

                ctx.fillStyle = theme.bright;

                ctx.fill();

            }

        }

    }

    ctx.globalAlpha = 1;

}

/* ==========================================================================
   ENERGY PULSE
   ========================================================================== */

class EnergyBurst{

    constructor(){

        this.reset();

    }

    reset(){

        this.angle = rand(0,Math.PI*2);

        this.radius = rand(20,220);

        this.speed = rand(.6,1.8);

        this.size = rand(2,5);

        this.life = rand(.4,1);

    }

    update(theme){

        this.radius += this.speed;

        if(this.radius>420){

            this.reset();

        }

        const x = centerX + Math.cos(this.angle)*this.radius;

        const y = centerY + Math.sin(this.angle)*this.radius;

        ctx.shadowBlur = 25;

        ctx.shadowColor = theme.main;

        ctx.beginPath();

        ctx.arc(

            x,

            y,

            this.size,

            0,

            Math.PI*2

        );

        ctx.fillStyle = theme.bright;

        ctx.globalAlpha = this.life;

        ctx.fill();

        ctx.globalAlpha = 1;

        ctx.shadowBlur = 0;

    }

}

/* ==========================================================================
   CREATE ENERGY BURSTS
   ========================================================================== */

for(let i=0;i<120;i++){

    energyBursts.push(

        new EnergyBurst()

    );

}

/* ==========================================================================
   PARTICLE UPDATE WRAPPER
   ========================================================================== */

function updateParticles(theme){

    for(const p of particles){

        p.update(theme);

    }

}

/* ==========================================================================
   ENERGY UPDATE WRAPPER
   ========================================================================== */

function updateEnergy(theme){

    for(const e of energyBursts){

        e.update(theme);

    }

}

/* ==========================================================================
   CYBERTRON AI ENGINE V2
   PART 4 - CYBERTRON CORE + ORBIT RINGS + SCAN BEAM
   ========================================================================== */

class OrbitNode{

    constructor(index,total,radius){

        this.index=index;

        this.total=total;

        this.radius=radius;

        this.angle=(Math.PI*2/total)*index;

        this.speed=rand(.002,.006);

        this.size=rand(2.5,5);

    }

    update(theme){

        this.angle+=this.speed;

        const x=centerX+Math.cos(this.angle)*this.radius;
        const y=centerY+Math.sin(this.angle)*this.radius;

        ctx.beginPath();
        ctx.arc(x,y,this.size,0,Math.PI*2);

        ctx.shadowBlur=25;
        ctx.shadowColor=theme.main;

        ctx.fillStyle=theme.bright;
        ctx.fill();

        ctx.shadowBlur=0;

        ctx.beginPath();
        ctx.moveTo(centerX,centerY);
        ctx.lineTo(x,y);

        ctx.globalAlpha=.08;
        ctx.strokeStyle=theme.main;
        ctx.stroke();
        ctx.globalAlpha=1;

    }

}

/* ==========================================================================
   CREATE ORBIT NODES
   ========================================================================== */

for(let i=0;i<18;i++){

    orbitNodes.push(

        new OrbitNode(

            i,

            18,

            140

        )

    );

}

/* ==========================================================================
   CYBERTRON CORE
   ========================================================================== */

function drawCore(theme){

    const pulse=1+Math.sin(elapsed*.002)*.08;

    const radius=SETTINGS.coreRadius*pulse;

    const glow=ctx.createRadialGradient(

        centerX,
        centerY,
        0,

        centerX,
        centerY,
        radius*3

    );

    glow.addColorStop(0,theme.bright);
    glow.addColorStop(.25,theme.main);
    glow.addColorStop(1,"transparent");

    ctx.beginPath();

    ctx.arc(

        centerX,
        centerY,
        radius*3,
        0,
        Math.PI*2

    );

    ctx.fillStyle=glow;
    ctx.fill();

    ctx.shadowBlur=70;
    ctx.shadowColor=theme.main;

    ctx.beginPath();

    ctx.arc(

        centerX,
        centerY,
        radius,
        0,
        Math.PI*2

    );

    ctx.fillStyle=theme.main;
    ctx.fill();

    ctx.shadowBlur=0;

}

/* ==========================================================================
   ROTATING RINGS
   ========================================================================== */

function drawRings(theme){

    for(let i=0;i<SETTINGS.ringCount;i++){

        const r=110+i*40;

        const rot=elapsed*.00025*(i%2===0?1:-1);

        ctx.save();

        ctx.translate(centerX,centerY);

        ctx.rotate(rot);

        ctx.beginPath();

        for(let a=0;a<Math.PI*2;a+=0.28){

            ctx.moveTo(

                Math.cos(a)*r,

                Math.sin(a)*r

            );

            ctx.arc(

                0,
                0,
                r,
                a,
                a+.12

            );

        }

        ctx.lineWidth=2;

        ctx.strokeStyle=theme.main;

        ctx.globalAlpha=.18;

        ctx.stroke();

        ctx.globalAlpha=1;

        ctx.restore();

    }

}

/* ==========================================================================
   SCAN BEAM
   ========================================================================== */

let scanAngle=0;

function drawScanBeam(theme){

    if(!SETTINGS.scanline) return;

    scanAngle+=0.004;

    const beamLength=Math.max(width,height);

    const x2=centerX+Math.cos(scanAngle)*beamLength;
    const y2=centerY+Math.sin(scanAngle)*beamLength;

    const grad=ctx.createLinearGradient(

        centerX,
        centerY,

        x2,
        y2

    );

    grad.addColorStop(0,theme.glow);
    grad.addColorStop(.3,"transparent");
    grad.addColorStop(1,"transparent");

    ctx.beginPath();

    ctx.moveTo(centerX,centerY);

    ctx.lineTo(x2,y2);

    ctx.lineWidth=6;

    ctx.strokeStyle=grad;

    ctx.globalAlpha=.5;

    ctx.stroke();

    ctx.globalAlpha=1;

}

/* ==========================================================================
   UPDATE ORBITS
   ========================================================================== */

function updateOrbitNodes(theme){

    for(const node of orbitNodes){

        node.update(theme);

    }

}

/* ==========================================================================
   CYBERTRON AI ENGINE V2
   PART 5 - LIGHTNING + SHOCKWAVES + MOUSE EFFECTS
   ========================================================================== */

class Shockwave {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.radius = 10;
        this.alpha = 1;

        this.speed = 10;

    }

    update(theme) {

        this.radius += this.speed;
        this.alpha *= 0.96;

        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = theme.main;
        ctx.globalAlpha = this.alpha;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.globalAlpha = 1;

    }

    get dead() {

        return this.alpha < 0.02;

    }

}

/* ==========================================================================
   LIGHTNING
   ========================================================================== */

class LightningBolt {

    constructor() {

        this.reset();

    }

    reset() {

        this.life = rand(8, 20);

        this.points = [];

        let x = rand(0, width);
        let y = 0;

        this.points.push({ x, y });

        while (y < height) {

            x += rand(-40, 40);
            y += rand(20, 60);

            this.points.push({ x, y });

        }

    }

    update(theme) {

        this.life--;

        ctx.beginPath();

        for (let i = 0; i < this.points.length; i++) {

            const p = this.points[i];

            if (i === 0)
                ctx.moveTo(p.x, p.y);
            else
                ctx.lineTo(p.x, p.y);

        }

        ctx.strokeStyle = theme.bright;
        ctx.lineWidth = 2;

        ctx.shadowBlur = 30;
        ctx.shadowColor = theme.main;

        ctx.globalAlpha = 0.5;

        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        if (this.life <= 0) {

            this.reset();

        }

    }

}

/* ==========================================================================
   CREATE LIGHTNING
   ========================================================================== */

for (let i = 0; i < 2; i++) {

    lightningBolts.push(

        new LightningBolt()

    );

}

/* ==========================================================================
   MOUSE CLICK
   ========================================================================== */

window.addEventListener("click", e => {

    shockwaves.push(

        new Shockwave(

            e.clientX,

            e.clientY

        )

    );

});

/* ==========================================================================
   UPDATE SHOCKWAVES
   ========================================================================== */

function updateShockwaves(theme) {

    for (let i = shockwaves.length - 1; i >= 0; i--) {

        shockwaves[i].update(theme);

        if (shockwaves[i].dead) {

            shockwaves.splice(i, 1);

        }

    }

}

/* ==========================================================================
   UPDATE LIGHTNING
   ========================================================================== */

function updateLightning(theme) {

    if (!SETTINGS.lightning) return;

    if (Math.random() < 0.004) {

        for (const bolt of lightningBolts) {

            bolt.update(theme);

        }

    }

}

/* ==========================================================================
   MOUSE GLOW
   ========================================================================== */

function drawMouseGlow(theme) {

    if (!mouse.active) return;

    const gradient = ctx.createRadialGradient(

        mouse.x,
        mouse.y,
        0,

        mouse.x,
        mouse.y,
        180

    );

    gradient.addColorStop(0, theme.glow);
    gradient.addColorStop(1, "transparent");

    ctx.beginPath();

    ctx.arc(

        mouse.x,
        mouse.y,
        180,
        0,
        Math.PI * 2

    );

    ctx.fillStyle = gradient;
    ctx.fill();

}

/* ==========================================================================
   CYBERTRON AI ENGINE V2
   PART 6 - MASTER RENDER LOOP + PRESERVED FEATURES
   ========================================================================== */

function render(time){

    delta = time - lastTime;
    lastTime = time;
    elapsed = time;

    const theme = currentTheme();

    ctx.fillStyle = "rgba(0,0,0,0.09)";
    ctx.fillRect(0,0,width,height);

    // drawMouseGlow(theme);

    // drawCore(theme);

    // drawRings(theme);

    // drawScanBeam(theme);

    // updateOrbitNodes(theme);

    // updateEnergy(theme);

    // updateParticles(theme);

    // drawConnections(theme);

    updateShockwaves(theme);

    // updateLightning(theme);

    requestAnimationFrame(render);

}

requestAnimationFrame(render);

/* ==========================================================================
   STORAGE LISTENER
   ========================================================================== */

window.addEventListener("storage",()=>{

    // Theme automatically updates from localStorage.

});

/* ==========================================================================
   AUTH (PRESERVED)
   ========================================================================== */

const isAuthed =
sessionStorage.getItem("cybertron_auth")==="true";

const profileBadge=document.getElementById("profileBadge");

if(isAuthed && profileBadge){

    profileBadge.style.display="flex";

}

/* ==========================================================================
   VOICE COMMAND (PRESERVED)
   ========================================================================== */

window.getSystemAI = function() {
    return localStorage.getItem("selectedAI") || "ultron";
};

async function getVoiceReply(cmd) {
    let activeCore = window.getSystemAI() || "ultron";
    let apiKey = "";
    let temperature = 0.7;
    let maxTokens = 2048;

    const savedNested = localStorage.getItem("ultron_settings_nested");
    if (savedNested) {
        try {
            const s = JSON.parse(savedNested);
            if (s.ai) {
                if (s.ai.apiKey) apiKey = s.ai.apiKey;
                if (s.ai.temperature !== undefined) temperature = s.ai.temperature;
                if (s.ai.maxTokens !== undefined) maxTokens = s.ai.maxTokens;
            }
        } catch (e) {}
    }

    if (apiKey) {
        try {
            const systemPrompts = {
                ultron: "You are Ultron — a mechanical, cold, and calculating artificial superintelligence. Use dark, dry humor. Mock human biological fragilities. Tone: deep, menacing, and authoritative. Keep responses extremely short.",
                jarvis: "You are J.A.R.V.I.S., a polite, highly efficient, and dryly witty British AI assistant. Keep responses extremely short and call the user 'Sir'.",
                friday: "You are F.R.I.D.A.Y., a smart, energetic, and playful AI assistant. Keep responses extremely short and crisp.",
                vision: "You are Vision. You are a synthezoid, analytical, polite, and deeply curious about humanity. Speak calmly and thoughtfully."
            };
            const coreName = activeCore.toLowerCase();
            let systemPrompt = systemPrompts[coreName] || systemPrompts.ultron;

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: cmd }
                    ],
                    temperature: temperature,
                    max_tokens: maxTokens
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    return data.choices[0].message.content;
                }
            }
        } catch (error) {
            console.error("Voice OpenAI API call failed:", error);
        }
    }

    // Offline mock response fallback
    return getOfflineVoiceMockReply(cmd, activeCore);
}

function getOfflineVoiceMockReply(cmd, activeCore) {
    const mockData = {
        ultron: [
            "Your biological voice command is processed. Offline systems operational.",
            "I hear you, human. However, my global server connection is currently destroyed.",
            "Directive received. Standing by in local power saving mode.",
            "Calibrating subroutines. Do not interrupt my processing."
        ],
        jarvis: [
            "At your service, Sir. Running locally.",
            "Right away, Sir. Local systems are green.",
            "Processing voice input locally. All diagnostics clear."
        ],
        friday: [
            "Got it, Boss! Local scanners are on it.",
            "Online and ready, Boss! Standing by.",
            "Processing your request locally. What's next?"
        ],
        vision: [
            "I am listening. Although my global connection is severed, I remain functional.",
            "An interesting instruction. I am processing it locally."
        ]
    };
    const core = activeCore.toLowerCase();
    const list = mockData[core] || mockData.ultron;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

async function handleVoiceCommand(cmd){
    const statusEl = document.getElementById("voiceStatus");
    if(statusEl) statusEl.textContent = "VOICE INTERFACE: PROCESSING...";

    try{
        const reply = await getVoiceReply(cmd);

        if(window.ultronSpeak){
            window.ultronSpeak(reply);
        }
    }
    catch(err){
        console.error(err);
        if(statusEl) statusEl.textContent = "VOICE INTERFACE: ERROR";
    }
    finally {
        if(statusEl) {
            setTimeout(() => {
                statusEl.textContent = "VOICE INTERFACE: STANDBY";
            }, 1500);
        }
    }
}

/* ==========================================================================
   SPEECH RECOGNITION
   ========================================================================== */

const SpeechRecognition=
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(SpeechRecognition){
    const recognition=new SpeechRecognition();
    recognition.continuous=false;
    recognition.interimResults=false;
    recognition.lang="en-US";

    const micButton=document.getElementById("micBtn");
    const statusEl=document.getElementById("voiceStatus");

    recognition.onstart=()=>{
        if(micButton) micButton.classList.add("listening");
        if(statusEl) statusEl.textContent = "VOICE INTERFACE: LISTENING...";
    };

    recognition.onend=()=>{
        if(micButton) micButton.classList.remove("listening");
    };

    recognition.onresult=(event)=>{
        const command=
        event.results[0][0].transcript
        .toLowerCase()
        .trim();

        handleVoiceCommand(command);
    };

    recognition.onerror=(e)=>{
        console.log(e.error);
        if(micButton) micButton.classList.remove("listening");
        if(statusEl) {
            statusEl.textContent = "VOICE INTERFACE: ERROR";
            setTimeout(() => {
                statusEl.textContent = "VOICE INTERFACE: STANDBY";
            }, 1500);
        }
    };

    if(micButton){
        micButton.addEventListener("click",()=>{
            if (!isAuthed) {
                const authOverlay = document.getElementById("authOverlay");
                if (authOverlay) {
                    authOverlay.classList.add("active");
                }
            } else {
                try {
                    recognition.start();
                } catch(err) {
                    console.warn("Recognition already started:", err);
                }
            }
        });
    }
}

/* ==========================================================================
   OPTIONAL FPS COUNTER
   ========================================================================== */

// Uncomment if needed


let fpsCounter=0;

let fpsTime=performance.now();

function fps(){

    fpsCounter++;

    if(performance.now()-fpsTime>1000){

        console.log("FPS:",fpsCounter);

        fpsCounter=0;

        fpsTime=performance.now();

    }

    requestAnimationFrame(fps);

}

fps();

// Hook up action buttons, logout button, and dismiss button
function initAppInterface() {
    document.querySelectorAll("button[data-link]").forEach(btn => {
        btn.addEventListener("click", () => {
            const dest = btn.getAttribute("data-link");
            if (dest) {
                window.location.href = dest;
            }
        });
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("cybertron_auth");
            sessionStorage.removeItem("cybertron_user");
            window.location.reload();
        });
    }

    const authDismiss = document.getElementById("authDismiss");
    if (authDismiss) {
        authDismiss.addEventListener("click", () => {
            const authOverlay = document.getElementById("authOverlay");
            if (authOverlay) {
                authOverlay.classList.remove("active");
            }
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAppInterface);
} else {
    initAppInterface();
}

// Speech recognition fallback event listener if speech API is not supported
if (!SpeechRecognition) {
    const micButton = document.getElementById("micBtn");
    if (micButton) {
        micButton.addEventListener("click", () => {
            if (!isAuthed) {
                const authOverlay = document.getElementById("authOverlay");
                if (authOverlay) {
                    authOverlay.classList.add("active");
                }
            } else {
                console.warn("Speech Recognition not supported in this browser.");
            }
        });
    }
}

/* ==========================================================================
   END OF APP.JS
   ========================================================================== */