/* ==========================================================================
   VIEWED CARD TRACKER
   Records which cards a visitor has opened (via the modal) during
   this session, scoped per profile. Powers the "Continue Watching"
   row — same session-based approach as everything else on this site
   (sessionStorage, not real accounts/backend).

   Storage key: dinchu_viewed_<profileType>, value: JSON array of
   card ids, most-recently-viewed first, capped at MAX_VIEWED entries.
   ========================================================================== */

const MAX_VIEWED = 10;

function trackViewed(cardId) {
  const profileType = sessionStorage.getItem("dinchu_profile");
  if (!profileType || !cardId) return;

  const key = `dinchu_viewed_${profileType}`;
  const viewed = getViewedIds();

  // Move to front if already present, otherwise add to front
  const withoutCurrent = viewed.filter((id) => id !== cardId);
  const updated = [cardId, ...withoutCurrent].slice(0, MAX_VIEWED);

  sessionStorage.setItem(key, JSON.stringify(updated));
}

function getViewedIds() {
  const profileType = sessionStorage.getItem("dinchu_profile");
  if (!profileType) return [];

  const key = `dinchu_viewed_${profileType}`;
  try {
    return JSON.parse(sessionStorage.getItem(key)) ?? [];
  } catch {
    return []; // corrupted/missing data — fail safe, not fatal
  }
}
