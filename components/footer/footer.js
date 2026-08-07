function initFooter() {
  const yearEl = document.getElementById("footer-year");

  if (!yearEl) return; // footer not on this page

  yearEl.textContent = new Date().getFullYear();
}
