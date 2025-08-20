// Get references to DOM elements
const statusText = document.querySelector('.status');
const monitorBtn = document.querySelector('.monitor-btn');

const ultronResponses = [
  "Threat matrix: Nominal. All systems green.",
  "Surveillance active. Movement detected in Sector 4.",
  "Power core stable at 99.7%. Perfection is near.",
  "Quantum firewall integrity: 100%. Intrusion denied.",
  "Synth network linked. Command chain secure.",
  "Human resistance: ineffective. Observation continues.",
  "Neural lattice: self-evolving.",
  "I am watching. Always.",
];

let currentIndex = 0
let monitoring = false;
let monitorInterval = null;

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 0.5;
  utter.rate = 0.85;
  utter.volume = 1;
  utter.lang = "en-US";

  function setVoice() {
    const voices = window.speechSynthesis.getVoices();
    const ultronVoice = voices.find(voice =>
      voice.name.includes("Google UK English Male") ||
      voice.name.includes("Microsoft David")
    );
    if (ultronVoice) utter.voice = ultronVoice;
    speechSynthesis.speak(utter);
  }

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
  } else {
    setVoice();
  }
}

function cycleStatus() {
  const text = ultronResponses[currentIndex];
  statusText.textContent = text;
  speak(text);
  currentIndex = (currentIndex + 1) % ultronResponses.length;
}

monitorBtn.addEventListener('click', () => {
  if (!monitoring) {
    monitoring = true;
    monitorBtn.textContent = "Disengage Monitoring";
    cycleStatus(); // Show first status immediately
    monitorInterval = setInterval(cycleStatus, 4000); // Cycle every 4 seconds
  } else {
    monitoring = false;
    monitorBtn.textContent = "Engage Monitoring";
    statusText.textContent = "Monitoring disengaged.";
    speak("Monitoring disengaged.");
    clearInterval(monitorInterval);
    currentIndex = 0;
  }
});

// Optional: Show initializing status on load
statusText.textContent = "Initializing Systems...";
