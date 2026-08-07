# Dinchu — Interactive Portfolio

A Netflix-style personal portfolio. Visitors pick a profile — Recruiter, Developer, Stalker, or Adventurer — and see different content depending on who's watching.

Live at: https://dinchu.com

## How it works

The site is built with vanilla HTML, CSS, and JavaScript — no frameworks. Each visual piece (navbar, hero, card, modal, footer) is a self-contained component with its own HTML, CSS, and JS file. Content for each profile lives in a separate JSON file, so the same components render completely different information depending on which profile is selected.

Flow: splash screen → profile picker → dynamic profile page (`profile.html?type=recruiter`, etc.)

## Structure

```
components/     Reusable UI pieces (navbar, hero, row, card, modal, footer, profile-picker)
data/            Content for each profile, as JSON
shared/          Design tokens, base layout, and small shared utilities
assets/          Images, video, resume
space/           A standalone 3D world, reached from the Adventurer profile
index.html       Splash screen (entry point)
browse.html      Profile picker
profile.html     Dynamic profile page, reads ?type= from the URL
```

## Running locally

This project has no build step. Open the folder in VS Code and use the Live Server extension (or run `python -m http.server` from the root), then visit `index.html`. A local server is required — some scripts use `fetch()`, which doesn't work when opening the HTML file directly.

## Tech

HTML, CSS, JavaScript, Three.js (for the 3D world), deployed on Vercel.

## Author

Dinchen Lepcha
