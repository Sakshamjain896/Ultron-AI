/* ==========================================================================
   CYBERTRON NATIVE SPEECH SYNTHESIS & RECOGNITION SYSTEM (Zero External Cost)
   ========================================================================== */

// 1. Unified Speech Synthesis (Text-to-Voice)
window.ultronSpeak = function(text, onStart, onEnd) {
  return new Promise((resolve) => {
    // Default settings fallback if window.settings is not fully populated yet
    const config = window.settings || {
      voice: {
        enabled: true,
        speed: 1.0,
        pitch: 0.20,
        volume: 100,
        lang: "en-US",
        model: "ultron"
      }
    };


    if (!config.voice || !config.voice.enabled) {
      console.warn("Speech Synthesis is disabled in configurations.");
      if (onEnd) onEnd();
      return resolve();
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Bind configurations
    utterance.rate = config.voice.speed || 1.0;
    utterance.pitch = config.voice.pitch || 0.2;
    utterance.volume = (config.voice.volume || 100) / 100;
    utterance.lang = config.voice.lang || "en-US";

    // Detect matching speech synthesis voice profile
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    const langVoices = voices.filter(v => 
      v.lang.toLowerCase() === utterance.lang.toLowerCase() ||
      v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase().split('-')[0])
    );

    if (langVoices.length > 0) {
      if (config.voice.model === "friday") {
        selectedVoice = langVoices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes("female") || name.includes("zira") || name.includes("hazel") || name.includes("heera");
        });
      } else {
        selectedVoice = langVoices.find(v => {
          const name = v.name.toLowerCase();
          if (config.voice.model === "jarvis") {
            return name.includes("google uk english male") || name.includes("uk") || name.includes("male");
          }
          return name.includes("male") || name.includes("david") || name.includes("guy") || name.includes("stefan");
        });
      }
      if (!selectedVoice) selectedVoice = langVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      const name = selectedVoice.name.toLowerCase();
      if (name.includes("female") || name.includes("zira") || name.includes("hazel") || name.includes("heera")) {
        utterance.pitch = Math.max(0.40, config.voice.pitch * 2.0);
      }
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
      resolve();
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      if (onEnd) onEnd();
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};

// Preview helper for settings page
window.testVoiceProfile = function() {
  const previewText = "I am Ultron. System integrity confirmed.";
  if (window.showToast) window.showToast("SYNTHESIZING PREVIEW PROBE...", true);
  window.ultronSpeak(previewText);
};

window.initializeVoiceSystem = function() {
  const btnPreview = document.getElementById("btnVoicePreview");
  if (btnPreview) {
    btnPreview.addEventListener("click", () => {
      window.testVoiceProfile();
    });
  }
};
