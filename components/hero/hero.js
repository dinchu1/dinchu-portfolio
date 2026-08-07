/* ==========================================================================
   HERO BEHAVIOR
   Deliberately has no fetch logic of its own — profile.html reads the
   right data/*.json for the current profile and calls renderHero(data)
   once. Keeps this file identical across all 4 profiles; only the
   data passed in changes.

   Expected shape of `data`:
   {
     eyebrow:  string,                          // e.g. "98% MATCH"
     headline: string,                          // e.g. "Dinchen Lepcha"
     subhead:  string,                          // one-line pitch
     media: {
       type: "video" | "image" | "gradient",
       src:  string                             // ignored if type is "gradient"
     },
     primaryCta:   { text: string, href: string } | null,
     secondaryCta: { text: string, href: string } | null
   }
   ========================================================================== */

function renderHero(data) {
  renderMedia(data.media);
  renderText(data);
  renderCta(document.getElementById('hero-cta-primary'), data.primaryCta);
  renderCta(document.getElementById('hero-cta-secondary'), data.secondaryCta);
}

function renderMedia(media) {
  const mediaContainer = document.getElementById('hero-media');

  if (media.type === 'video') {
    mediaContainer.innerHTML = `
      <video autoplay muted loop playsinline>
        <source src="${media.src}" type="video/mp4">
      </video>
    `;
  } else if (media.type === 'image') {
    mediaContainer.innerHTML = `<img src="${media.src}" alt="">`;
  } else {
    // Gradient fallback — no markup needed, just a class for hero.css to style
    mediaContainer.classList.add('hero__media--gradient');
  }
}

function renderText({ eyebrow, headline, subhead }) {
  document.getElementById('hero-eyebrow').textContent = eyebrow ?? '';
  document.getElementById('hero-headline').textContent = headline ?? '';
  document.getElementById('hero-subhead').textContent = subhead ?? '';
}

function renderCta(buttonEl, cta) {
  if (!cta) {
    buttonEl.removeAttribute('href'); // hero.css hides CTAs with no href
    return;
  }

  buttonEl.textContent = cta.text;
  buttonEl.href = cta.href;
}