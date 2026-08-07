/* ==========================================================================
   NAVBAR BEHAVIOR
   Runs once navbar.html has been injected into the page by loader.js.
   Four responsibilities: solid background on scroll, avatar dropdown
   toggle, coloring the avatar to match the current profile, and
   highlighting the nav link for the section currently in view.
   ========================================================================== */

// Maps each profile type to its avatar color (fallback) and image
// path — same images used on the /browse picker tiles.
const PROFILE_COLORS = {
  recruiter: "#2fb4c9",
  developer: "#9a9a9a",
  stalker: "#d4162c",
  adventurer: "#e8931a",
};

const PROFILE_IMAGES = {
  recruiter: "/assets/images/avatars/recruiter.png",
  developer: "/assets/images/avatars/dev.png",
  stalker: "/assets/images/avatars/stalk.png",
  adventurer: "/assets/images/avatars/adv.png",
};

function initNavbar() {
  const navbar = document.getElementById("navbar-root");
  const avatarBtn = document.getElementById("navbar-avatar-btn");
  const avatarIcon = document.getElementById("navbar-avatar-icon");
  const dropdown = document.getElementById("navbar-dropdown");
  const profileNameEl = document.getElementById("navbar-profile-name");

  if (!navbar) return; // navbar not on this page (e.g. splash screen)

  initScrollState(navbar);
  initAvatarDropdown(avatarBtn, dropdown);
  initProfileAvatar(avatarIcon, profileNameEl);
  initActiveLinkTracking();
}

// Adds a solid background once the user scrolls past the hero,
// so nav text stays readable over any hero content.
function initScrollState(navbar) {
  const SCROLL_THRESHOLD = 80;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("navbar--solid", window.scrollY > SCROLL_THRESHOLD);
  });
}

// Opens/closes the profile dropdown, and closes it on outside click.
function initAvatarDropdown(avatarBtn, dropdown) {
  avatarBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("navbar__dropdown--open");
    avatarBtn.setAttribute("aria-expanded", isOpen);
  });

  document.addEventListener("click", (event) => {
    if (
      !dropdown.contains(event.target) &&
      dropdown.classList.contains("navbar__dropdown--open")
    ) {
      dropdown.classList.remove("navbar__dropdown--open");
      avatarBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// Reads the profile chosen on /browse.html and colors the avatar +
// dropdown label to match. Falls back to a neutral state if none set
// (e.g. someone lands directly on a profile URL).
function initProfileAvatar(avatarIcon, profileNameEl) {
  const currentProfile = sessionStorage.getItem("dinchu_profile");

  if (currentProfile && PROFILE_COLORS[currentProfile]) {
    avatarIcon.style.backgroundColor = PROFILE_COLORS[currentProfile];
    avatarIcon.style.backgroundImage = `url('${PROFILE_IMAGES[currentProfile]}')`;
    avatarIcon.style.backgroundSize = "cover";
    avatarIcon.style.backgroundPosition = "center";
    profileNameEl.textContent = currentProfile;
  } else {
    profileNameEl.textContent = "Guest";
  }
}

// Highlights the nav link matching whichever section is currently
// most visible in the viewport.
function initActiveLinkTracking() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".navbar__link");

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          const matches = link.dataset.nav === entry.target.id;
          link.classList.toggle("navbar__link--active", matches);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }, // triggers when section is near vertical center
  );

  sections.forEach((section) => observer.observe(section));
}

// NOTE: no longer self-invoked here. navbar.html is now injected
// asynchronously by loader.js (profile.html fetches it, browse.html
// doesn't use a navbar at all) — so whatever page uses this component
// must call initNavbar() itself, after confirming the markup exists.
