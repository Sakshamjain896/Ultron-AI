/* ==========================================================================
   CYBERTRON INTERFACE CARD ACCORDION SYSTEM
   ========================================================================== */

window.initializeAccordion = function() {
  const targetSections = ["sec-account", "sec-cybertron-ai", "sec-voice", "sec-appearance", "sec-chat"];
  const cards = document.querySelectorAll(".settings-card");
  
  // Dynamically wrap each .card-body in an .accordion-wrapper for grid height transition
  cards.forEach(card => {
    const body = card.querySelector(".card-body");
    if (body && !body.parentNode.classList.contains("accordion-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.className = "accordion-wrapper";
      body.parentNode.insertBefore(wrapper, body);
      wrapper.appendChild(body);
    }
  });

  // Collapse all initially, expand first target section by default
  cards.forEach(card => {
    card.classList.remove("expanded");
  });
  
  const defaultCard = document.getElementById("sec-account");
  if (defaultCard) {
    defaultCard.classList.add("expanded");
  }

  // Bind click listeners to card headers
  cards.forEach(card => {
    // Only apply strict single-accordion logic to specified main sections
    if (targetSections.includes(card.id)) {
      const title = card.querySelector(".card-title");
      if (title) {
        title.addEventListener("click", () => {
          const isExpanded = card.classList.contains("expanded");
          
          // Collapse all main accordion cards
          cards.forEach(c => {
            if (targetSections.includes(c.id)) {
              c.classList.remove("expanded");
            }
          });
          
          // If the clicked card wasn't expanded, expand it
          if (!isExpanded) {
            card.classList.add("expanded");
            if (window.playUISound) {
              window.playUISound(600, "sine", 0.05, 0.08);
            }
          } else {
            if (window.playUISound) {
              window.playUISound(400, "sine", 0.05, 0.08);
            }
          }
        });
      }
    } else {
      // For non-accordion cards (e.g. Security, Storage, Developer, About)
      // Allow independent toggling (collapses on header click, does not close other cards)
      const title = card.querySelector(".card-title");
      if (title) {
        // Expand these by default since they are outside the accordion pool
        card.classList.add("expanded");
        title.addEventListener("click", () => {
          card.classList.toggle("expanded");
          if (window.playUISound) {
            window.playUISound(500, "sine", 0.04, 0.06);
          }
        });
      }
    }
  });
};
