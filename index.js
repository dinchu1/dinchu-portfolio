/* ==========================================================================
   SPLASH SCREEN BEHAVIOR
   Click (or Enter/Space, since it's a real <button>) triggers the
   zoom class, then navigates once the transition duration has
   elapsed. Duration here must match the longest transition set in
   index.css (transform 700ms + opacity delay) so the animation isn't cut
   off by navigation.
   ========================================================================== */

// Keep this tightly in sync with the CSS total transition time
const TRANSITION_DURATION_MS = 1000; // 700ms transform + 300ms opacity delay = 1000ms

function initSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;

  // Guard against duplicate clicks while animation is running
  splash.addEventListener("click", enterSite);

  // When users navigate back (bfcache/pageshow), the page may be
  // restored without re-running scripts; ensure the splash is reset
  // so the logo is visible and interactive again. Additionally, when
  // the page is restored from bfcache (ev.persisted) replay the splash
  // animation once for a smooth UX — do NOT navigate during this replay.
  window.addEventListener("pageshow", (ev) => {
    // Remove the zoom class if it was left behind
    splash.classList.remove("splash--zooming");

    // Clear any inline animation override left from a previous click
    const logoEl = splash.querySelector(".splash__logo");
    if (logoEl) {
      logoEl.style.animation = "";
    }

    // Force a reflow so the next transition will run reliably
    void splash.offsetWidth;

    // If the page was restored from the bfcache, replay the splash
    // animation once for visual continuity. Use a quick double-rAF to
    // ensure the class addition paints in its own frame. The replay
    // only adds/removes the class and does not trigger navigation.
    if (ev.persisted) {
      // Guard: don't replay if already zooming or replaying
      if (
        splash.classList.contains("splash--zooming") ||
        splash.classList.contains("splash--reveal")
      )
        return;

      // Play a reverse (reveal) animation: start the logo visually at
      // scale(4)/transparent then animate back to normal. Use two small
      // classes (pre-reveal sets the starting state; reveal runs the
      // animation). Remove both when done.
      splash.classList.add("splash--pre-reveal");

      // Force a reflow so the pre-reveal state is applied
      void splash.offsetWidth;

      const onRevealEnd = () => {
        splash.classList.remove("splash--pre-reveal", "splash--reveal");
        // Ensure any inline animation override is cleared
        if (logoEl) logoEl.style.animation = "";
      };

      if (logoEl) {
        logoEl.addEventListener("animationend", onRevealEnd, { once: true });
      }

      // Add the reveal class in the next frame so the animation runs from
      // the pre-reveal starting state to the final state.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          splash.classList.add("splash--reveal");
        });
      });
    }
  });

  // When the page is being hidden, if the browser will store it in the
  // back-forward cache, mark the splash so the restored page already
  // starts in the pre-reveal state and avoids a single-frame flash.
  window.addEventListener("pagehide", (ev) => {
    if (ev.persisted) {
      // Add pre-reveal so the stored DOM paints in the large/transparent state
      splash.classList.add("splash--pre-reveal");
    }
  });
}

function enterSite() {
  const splash = document.getElementById("splash");
  if (!splash) return;

  // If already zooming, ignore further clicks
  if (splash.classList.contains("splash--zooming")) return;

  playIntroChime();

  const logo = splash.querySelector(".splash__logo");
  let navigated = false;
  function doNavigate(source) {
    if (navigated) return;
    navigated = true;
    window.location.assign("/browse.html");
  }

  // Attach a transitionend listener so navigation waits for the real
  // transform transition to finish. Listen specifically for 'transform'
  // since the logo also transitions opacity and that may fire later.
  if (logo) {
    const onAnimationEnd = (ev) => {
      doNavigate("animationend");
    };
    const onTransitionEnd = (ev) => {
      if (ev.propertyName === "transform") {
        doNavigate("transitionend");
      }
    };
    logo.addEventListener("animationend", onAnimationEnd, { once: true });
    logo.addEventListener("transitionend", onTransitionEnd, { once: true });
  }

  // Best-effort: blur the button (clears :active state) and force a
  // reflow before adding the zoom class. This separates style changes
  // so the animation starts reliably in Chrome.
  splash.blur();

  // Force a reflow so the next style changes are painted separately
  void (logo ? logo.offsetWidth : splash.offsetWidth);

  // A tiny timeout further increases reliability on Chrome; 16ms =~ 1 frame
  setTimeout(() => {
    // Double rAF as a final guard to ensure the class arrives in its own frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        splash.classList.add("splash--zooming");
      });
    });
  }, 16);

  // Fallback navigation: if transitionend doesn't fire for any reason,
  // navigate after the expected duration plus a slop.
  setTimeout(() => {
    doNavigate("timeout-fallback");
  }, TRANSITION_DURATION_MS + 250);
}

initSplash();
