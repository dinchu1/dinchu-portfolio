/* ==========================================================================
   ROW BEHAVIOR
   Exposes renderRow(rowData, parentEl). Depends on card.js's
   createCard() being loaded first — row.js doesn't build card markup
   itself, it just asks card.js for each one. profile.html calls this
   once per row in the current profile's data file.

   Expected shape of `rowData`:
   {
     id:    string,   // becomes the <section id>, must match a
                       // navbar data-nav value to be reachable by nav link
     title: string,   // e.g. "Skills", "Projects"
     cards: Array<CardData>   // see card.js for CardData shape
   }
   ========================================================================== */

function renderRow(rowData, parentEl) {
  const template = document.getElementById('row-template');
  const node = template.content.cloneNode(true);

  const sectionEl = node.querySelector('.row');
  const titleEl = node.querySelector('.row__title');
  const track = node.querySelector('.row-track');
  const prevBtn = node.querySelector('.row__scroll-btn--prev');
  const nextBtn = node.querySelector('.row__scroll-btn--next');

  sectionEl.id = rowData.id;
  titleEl.textContent = rowData.title;

  rowData.cards.forEach((cardData) => {
    track.appendChild(createCard(cardData));
  });

  wireScrollButtons(track, prevBtn, nextBtn);

  parentEl.appendChild(node);
}

// Prev/next buttons scroll by roughly one viewport-width of cards at
// a time, and disable themselves at either end of the track.
function wireScrollButtons(track, prevBtn, nextBtn) {
  const SCROLL_AMOUNT = 660; // ~3 cards at 220px each

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  });

  const updateButtonState = () => {
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };

  track.addEventListener('scroll', updateButtonState);
  updateButtonState(); // set correct initial state (prevBtn starts disabled)
}