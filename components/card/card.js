/* ==========================================================================
   CARD BEHAVIOR
   Exposes one function, createCard(data), which row.js calls once per
   item. Returns a ready-to-append DOM node. Doesn't know anything
   about modals directly — clicking a card just dispatches a
   'card:selected' event that bubbles up; modal.js listens for it at
   the document level. Keeps card.js decoupled from modal.js.

   Expected shape of `data`:
   {
     id:      string,              // unique, used by modal.js to look up full detail
     title:   string,
     image:   string,               // thumbnail src
     blurb:   string,               // 1-2 line summary shown on hover
     match:   number | null         // e.g. 98 → renders "98% Match" badge, omit to hide
   }
   ========================================================================== */

function createCard(data) {
  const template = document.getElementById("card-template");
  const node = template.content.cloneNode(true);

  const cardEl = node.querySelector(".card");
  const imageEl = node.querySelector(".card__image");
  const matchEl = node.querySelector(".card__match");
  const titleEl = node.querySelector(".card__title");
  const blurbEl = node.querySelector(".card__blurb");

  cardEl.dataset.cardId = data.id;
  cardEl.classList.add("card--loading"); // shimmer skeleton, removed once image loads

  imageEl.alt = data.title;
  titleEl.textContent = data.title;
  blurbEl.textContent = data.blurb ?? "";

  imageEl.addEventListener("load", () => {
    cardEl.classList.remove("card--loading");
  });

  imageEl.addEventListener("error", () => {
    // Image failed (missing file, bad path) — still remove the
    // skeleton rather than leaving it shimmering forever, since a
    // broken-image icon is a more useful signal than a stuck loader.
    cardEl.classList.remove("card--loading");
  });

  imageEl.src = data.image; // set AFTER listeners are attached

  if (data.match != null) {
    matchEl.textContent = `${data.match}% Match`;
    matchEl.hidden = false;
  }

  cardEl.addEventListener("click", () => {
    cardEl.dispatchEvent(
      new CustomEvent("card:selected", {
        bubbles: true,
        detail: data,
      }),
    );
  });

  return cardEl;
}
