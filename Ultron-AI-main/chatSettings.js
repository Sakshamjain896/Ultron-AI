/* ==========================================================================
   CYBERTRON CHAT TERMINAL CONFIGURATION MODULE
   ========================================================================== */

window.initializeChatSettings = function() {
  // Bind buttons
  const btnSave = document.getElementById("btnSaveChat");
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      window.saveChatTranscript();
    });
  }

  const btnExport = document.getElementById("btnExportChat");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      window.exportChatConfigurations();
    });
  }

  const btnClear = document.getElementById("btnClearChat");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      window.clearTerminalRecords();
    });
  }
};

window.saveChatTranscript = function() {
  // Mock saving of active chat session logs
  const mockChatHistory = [
    { sender: "User", text: "Report system vitals." },
    { sender: "Ultron", text: "Systems operating at 100% efficiency. Logical dominance confirmed." }
  ];
  localStorage.setItem("ultron_chat_saved", JSON.stringify(mockChatHistory));
  if (window.showToast) window.showToast("TERMINAL COPIED TO BACKLOG CORE", true);
  if (window.playUISound) window.playUISound(800, "sine", 0.1, 0.1);
};

window.exportChatConfigurations = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.settings, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `cybertron_system_core_configurations.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  if (window.showToast) window.showToast("SYSTEM CONFIGURATIONS EXPORTED", true);
  if (window.playUISound) window.playUISound(850, "sine", 0.08, 0.12);
};

window.clearTerminalRecords = function() {
  if (window.triggerConfirmPopup) {
    window.triggerConfirmPopup("PURGE ALL TERMINAL RECORDS AND ACTIVE CONVERSATION CONTEXTS?", () => {
      localStorage.removeItem("ultron_history");
      localStorage.removeItem("ultron_chat_saved");
      if (window.showToast) window.showToast("TERMINAL RECORDS PURGED", true);
      if (window.playUISound) window.playUISound(350, "sawtooth", 0.15, 0.2);
    });
  }
};
