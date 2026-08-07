/* ==========================================================================
   LOADER
   Fetches partial .html files and injects them into the page. Used
   for two kinds of things: (1) navbar.html, which is real visible
   markup, and (2) card.html / row.html, which are just <template>
   tags that need to exist in the DOM before row.js / card.js can
   clone them — they render nothing on their own.

   Requires a local server (Live Server, python -m http.server, etc.)
   since fetch() on file:// URLs is blocked by the browser. This is
   the point where you can no longer just double-click the HTML file.
   ========================================================================== */

// Fetches each { url, target } pair and injects the HTML response
// into the target element. Runs all fetches in parallel, resolves
// once every injection is done.
async function loadComponents(components) {
  await Promise.all(
    components.map(async ({ url, target }) => {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Failed to load ${url}: ${response.status}`);
        return;
      }

      const html = await response.text();
      target.innerHTML = html;
    })
  );
}