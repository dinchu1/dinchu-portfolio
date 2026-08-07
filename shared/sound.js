/* ==========================================================================
   SOUND EFFECTS
   Small synthesized UI sounds via the Web Audio API — no audio files
   involved, so no licensing questions and no extra file size. Kept
   extremely quiet and short on purpose; this is meant to be felt more
   than consciously heard.

   IMPORTANT: only ever called from a real user interaction (a click),
   never on page load — browsers block audio that isn't triggered by
   a user gesture, so this would silently fail (and log a console
   warning) if called automatically.
   ========================================================================== */
// Two-tone "ta-dum" style chime for the splash screen's zoom
// transition — a lower note, brief gap, then a slightly higher note.
// Same Web Audio synthesis approach as playSelectBlip, no audio file.
function playIntroChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();

    playTone(ctx, 220, ctx.currentTime, 0.18, 0.09); // "ta" — lower note
    playTone(ctx, 277, ctx.currentTime + 0.22, 0.35, 0.11); // "dum" — higher, slightly louder/longer
  } catch (err) {
    console.warn("Sound effect failed to play:", err);
  }
}

// Shared helper: plays a single sine tone with a quick fade in/out
// envelope, starting at `startTime` seconds into the given context.
function playTone(ctx, frequency, startTime, duration, peakVolume) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function playSelectBlip() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      900,
      ctx.currentTime + 0.08,
    );

    // Very quiet, quick fade in/out so there's no click/pop at the edges
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15);
  } catch (err) {
    // Fails silently — a missing sound effect should never break navigation
    console.warn("Sound effect failed to play:", err);
  }
}
