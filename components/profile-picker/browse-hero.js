/* ==========================================================================
   BROWSE HERO BANNER
   Auto-cycles through all 4 profiles, matching real Netflix's rotating
   "featured" banner on the profile-select screen. Background, title,
   and tagline all swap together on a timer, looping forever.

   EDIT ME: title/tagline copy per profile — background is currently a
   gradient (see profile-picker.css .browse-hero__bg--*), swap to a
   real image/video later by editing those CSS rules, not this file.
   ========================================================================== */

const FEATURED_SLIDES = [
  {
    profile: "recruiter",
    title: "Who\u2019s Watching... a Recruiter?",
    tagline: "Oh please, please hire me.",
  },
  {
    profile: "developer",
    title: "Who\u2019s Watching... a Developer?",
    tagline: "Judge my code, not my code names.",
  },
  {
    profile: "stalker",
    title: "Who\u2019s Watching... a Stalker?",
    tagline: "No judgment. Okay, some judgment.",
  },
  {
    profile: "adventurer",
    title: "Who\u2019s Watching... an Adventurer?",
    tagline: "Warning: contains an actual 3D rocket launch.",
  },
];

const SLIDE_DURATION_MS = 4500;
const FADE_DURATION_MS = 400;

function initBrowseHero() {
  const bgEl = document.getElementById("browse-hero-bg");
  const titleEl = document.getElementById("browse-hero-title");
  const taglineEl = document.getElementById("browse-hero-tagline");

  if (!bgEl) return; // banner not on this page

  let currentIndex = 0;
  showSlide(FEATURED_SLIDES[currentIndex], bgEl, titleEl, taglineEl, true);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % FEATURED_SLIDES.length;
    showSlide(FEATURED_SLIDES[currentIndex], bgEl, titleEl, taglineEl, false);
  }, SLIDE_DURATION_MS);
}

function showSlide(slide, bgEl, titleEl, taglineEl, isFirstSlide) {
  // Background crossfades on its own via CSS transition (see
  // .browse-hero__bg { transition: background }) just by swapping
  // the class — no JS animation needed for that part.
  bgEl.className = `browse-hero__bg browse-hero__bg--${slide.profile}`;

  if (isFirstSlide) {
    titleEl.textContent = slide.title;
    taglineEl.textContent = slide.tagline;
    return;
  }

  // Text fades out, swaps content, fades back in — timed to roughly
  // match the background's own crossfade duration.
  titleEl.classList.add("browse-hero__title--fading");
  taglineEl.classList.add("browse-hero__tagline--fading");

  setTimeout(() => {
    titleEl.textContent = slide.title;
    taglineEl.textContent = slide.tagline;
    titleEl.classList.remove("browse-hero__title--fading");
    taglineEl.classList.remove("browse-hero__tagline--fading");
  }, FADE_DURATION_MS);
}

initBrowseHero();
