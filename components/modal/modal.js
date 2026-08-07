/* ==========================================================================
   MODAL BEHAVIOR
   Exposes initModal(), called by profile.js AFTER modal.html has been
   injected into the page (same reasoning as navbar.js — this can't
   self-invoke on script load, since the markup it queries doesn't
   exist yet at that point).

   Listens for 'card:selected' at the document level, so it works for
   any card on the page without needing to know about rows or cards
   directly.
   ========================================================================== */

function initModal() {
  const modalRoot = document.getElementById("modal-root");
  const backdrop = document.getElementById("modal-backdrop");
  const closeBtn = document.getElementById("modal-close");

  if (!modalRoot) return; // modal not on this page

  document.addEventListener("card:selected", (event) =>
    openModal(event.detail),
  );
  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalRoot.classList.contains("modal--open")) {
      closeModal();
    }
  });
}

// data comes straight from card.js's CardData object (see card.js) —
// { id, title, image, blurb, match }. `detail` is an optional longer
// description a data file can include for the modal specifically;
// falls back to the card's hover blurb if not provided.
function openModal(data) {
  trackViewed(data.id);

  document.getElementById("modal-image").src = data.image;
  document.getElementById("modal-image").alt = data.title;
  document.getElementById("modal-title").textContent = data.title;
  document.getElementById("modal-detail").textContent =
    data.detail ?? data.blurb ?? "";

  const matchEl = document.getElementById("modal-match");
  if (data.match != null) {
    matchEl.textContent = `${data.match}% Match`;
    matchEl.hidden = false;
  } else {
    matchEl.hidden = true;
  }

  const linkEl = document.getElementById("modal-link");

  // Remove any previous click handler from a prior card (since we
  // conditionally attach one below for launchInternal cards only)
  linkEl.onclick = null;

  if (data.launchInternal) {
    // Special case: an in-site "portal" card (e.g. the space universe)
    // rather than a normal external link. Shows a Launch button that
    // plays a transition and navigates in the SAME tab, instead of
    // opening a new one.
    linkEl.textContent = "🚀 Launch";
    linkEl.href = data.launchInternal;
    linkEl.removeAttribute("target");
    linkEl.hidden = false;
    linkEl.onclick = (event) => {
      event.preventDefault();
      playLaunchTransition(data.launchInternal);
    };
  } else if (data.link) {
    linkEl.textContent = "Visit Project ↗";
    linkEl.href = data.link;
    linkEl.target = "_blank";
    linkEl.hidden = false;
  } else {
    linkEl.hidden = true;
  }

  document.getElementById("modal-root").classList.add("modal--open");
  document.getElementById("modal-root").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // prevent background scroll while open
}

// Full-screen rocket launch transition, built dynamically since it's
// only ever needed here — no separate component/partial required.
// Fades in a dark overlay, launches a rocket upward with a little
// wobble, then navigates once the animation finishes.
function playLaunchTransition(destinationUrl) {
  const overlay = document.createElement("div");
  overlay.className = "launch-overlay";
  overlay.innerHTML = '<span class="launch-overlay__rocket">🚀</span>';
  document.body.appendChild(overlay);

  // Force a reflow so the fade-in transition reliably triggers
  void overlay.offsetWidth;
  overlay.classList.add("launch-overlay--active");

  setTimeout(() => {
    window.location.href = destinationUrl;
  }, 1400); // matches the total animation time in modal.css
}

function closeModal() {
  document.getElementById("modal-root").classList.remove("modal--open");
  document.getElementById("modal-root").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
