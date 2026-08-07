/* ==========================================================================
   PROFILE PICKER BEHAVIOR
   Clicking a tile saves the chosen profile so the rest of the site
   (navbar avatar, profile.html content) knows who's watching, then
   redirects to the single dynamic profile page with a query param.
   ========================================================================== */

function initProfilePicker() {
  const tiles = document.querySelectorAll(".picker__tile");

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      selectProfile(tile.dataset.profile);
    });
  });

  initKeyboardNav(tiles);
}

function selectProfile(profile) {
  playSelectBlip();
  sessionStorage.setItem("dinchu_profile", profile);
  window.location.href = `/profile.html?type=${profile}`;
}

// Left/Right arrow keys move focus between tiles, wrapping at each
// end. Enter/Space already work natively — tiles are real <button>
// elements, so no extra handling needed for those two keys.
function initKeyboardNav(tiles) {
  const tileList = Array.from(tiles);
  if (!tileList.length) return;

  tileList[0].focus(); // keyboard-first: land on Recruiter immediately

  document.addEventListener("keydown", (event) => {
    const currentIndex = tileList.indexOf(document.activeElement);
    if (currentIndex === -1) return; // focus isn't on a tile right now

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = (currentIndex + 1) % tileList.length;
      tileList[next].focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = (currentIndex - 1 + tileList.length) % tileList.length;
      tileList[prev].focus();
    }
  });
}

initProfilePicker();
