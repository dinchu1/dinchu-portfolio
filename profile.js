/* ==========================================================================
   PROFILE PAGE CONTROLLER
   The one file that actually knows how everything fits together.
   Every other script (navbar.js, hero.js, row.js, card.js) only
   exposes functions — this file is what calls them, in order, with
   the right data. Runs once, on page load.
   ========================================================================== */

const VALID_PROFILES = ["recruiter", "developer", "stalker", "adventurer"];

async function initProfilePage() {
  const profileType = getProfileTypeFromUrl();

  // No valid ?type= given — send them back to pick one instead of
  // showing a broken/empty page.
  if (!VALID_PROFILES.includes(profileType)) {
    window.location.href = "/browse.html";
    return;
  }

  // Inject navbar markup + the row/card <template> tags. All async,
  // run in parallel since they don't depend on each other.
  await loadComponents([
    {
      url: "/components/navbar/navbar.html",
      target: document.getElementById("navbar"),
    },
    {
      url: "/components/hero/hero.html",
      target: document.getElementById("hero-container"),
    },
    {
      url: "/components/row/row.html",
      target: document.getElementById("row-template-holder"),
    },
    {
      url: "/components/card/card.html",
      target: document.getElementById("card-template-holder"),
    },
    {
      url: "/components/modal/modal.html",
      target: document.getElementById("modal-container"),
    },
    {
      url: "/components/footer/footer.html",
      target: document.getElementById("footer-container"),
    },
  ]);

  // Now that navbar.html, modal.html, and footer.html actually exist
  // in the DOM, it's safe to wire up their behavior.
  initNavbar();
  initModal();
  initFooter();

  // Fetch this profile's content and render it.
  const data = await fetchProfileData(profileType);
  renderHero(data.hero);

  const rowsContainer = document.getElementById("rows");

  const continueWatchingRow = buildContinueWatchingRow(data.rows);
  if (continueWatchingRow) {
    renderRow(continueWatchingRow, rowsContainer);
  }

  data.rows.forEach((rowData) => renderRow(rowData, rowsContainer));
}

// Reconstructs a "Continue Watching" row from whichever cards the
// visitor has already opened this session (see shared/viewed-tracker.js).
// Returns null if nothing's been viewed yet, so profile.js can just
// skip rendering it entirely rather than showing an empty row.
function buildContinueWatchingRow(allRows) {
  const viewedIds = getViewedIds();
  if (!viewedIds.length) return null;

  const allCards = allRows.flatMap((row) => row.cards);

  // Preserve most-recently-viewed-first order from the tracker,
  // rather than the order cards happen to appear in the JSON
  const viewedCards = viewedIds
    .map((id) => allCards.find((card) => card.id === id))
    .filter(Boolean); // drops any id that no longer matches a real card

  if (!viewedCards.length) return null;

  return {
    id: "continue-watching",
    title: "Continue Watching",
    cards: viewedCards,
  };
}

function getProfileTypeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("type");
}

async function fetchProfileData(profileType) {
  const response = await fetch(`/data/${profileType}.json`);

  if (!response.ok) {
    throw new Error(
      `Could not load data for profile "${profileType}" (${response.status})`,
    );
  }

  return response.json();
}

initProfilePage();
