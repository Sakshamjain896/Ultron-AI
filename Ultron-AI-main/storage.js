/* ==========================================================================
   CYBERTRON STORAGE & DATABASE SYNCHRONIZER
   ========================================================================== */

window.loadSettings = async function() {
  let loaded = null;
  // Load directly from local storage fallback
  const local = localStorage.getItem("ultron_settings_nested");
  if (local) {
    try {
      loaded = JSON.parse(local);
    } catch (e) {
      console.error("Local preferences corrupted, using factory defaults");
    }
  }

  // Merge default settings with loaded settings to ensure all keys exist
  if (loaded) {
    window.settings = window.deepMerge(window.DEFAULT_SETTINGS, loaded);
  } else {
    window.settings = JSON.parse(JSON.stringify(window.DEFAULT_SETTINGS));
  }

  // Save nested version in localStorage
  localStorage.setItem("ultron_settings_nested", JSON.stringify(window.settings));
};

window.saveSettings = async function() {
  // Save to local storage
  localStorage.setItem("ultron_settings_nested", JSON.stringify(window.settings));

  // Save custom display name for index.html compatibility
  if (window.settings.account && window.settings.account.username) {
    localStorage.setItem("ultron_custom_username", window.settings.account.username);
    sessionStorage.setItem("ultron_user", window.settings.account.email);
  }
};

window.resetSettings = async function() {
  window.settings = JSON.parse(JSON.stringify(window.DEFAULT_SETTINGS));
  await window.saveSettings();
  if (window.applyAllSettingsToUI) {
    window.applyAllSettingsToUI();
  }
  if (window.showToast) {
    window.showToast("SYSTEM REVERTED TO DEFAULTS", true);
  }
};

// Reusable Deep Merge Helper to prevent properties loss during syncs
window.deepMerge = function(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = window.deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
