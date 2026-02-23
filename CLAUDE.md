# CLAUDE.md — StreamHub TV

## Project Overview
StreamHub TV is a Netflix-style IPTV streaming hub built with React + Vite, optimized for Fire TV (10-foot UI). It aggregates public IPTV channels and provides deep links to streaming apps.

## Tech Stack
- **Framework**: React 18 + Vite 5
- **Streaming**: hls.js for HLS (.m3u8) playback
- **Styling**: Pure CSS with CSS variables (no Tailwind, no CSS-in-JS)
- **Target**: Fire TV Silk Browser, Smart TV browsers, desktop/mobile browsers

## Project Structure
```
streamhub-tv/
├── index.html              # Entry HTML with boot screen
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite config (host 0.0.0.0 for LAN access)
├── public/
│   └── manifest.json       # PWA manifest
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main app: Home view + Player view + navigation
    ├── HLSPlayer.jsx       # HLS video player component (hls.js + native fallback)
    ├── channels.js         # Channel database + streaming services + categories
    └── styles.css          # All styles, animations, responsive breakpoints
```

## Key Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server on port 3000 (accessible on LAN)
npm run build        # Production build to /dist
npm run preview      # Preview production build
npm run start        # Serve production build with 'serve'
```

## Architecture Decisions
- **Embedded channel data** (not fetched from API at runtime) for reliability and offline-first
- **hls.js** imported as npm dependency (not CDN) for build reliability
- **CSS variables** for theming, pure CSS for Smart TV compatibility
- **Keyboard navigation** via ArrowKeys/Enter/Escape for Fire TV remote control
- **No localStorage dependency** for core functionality (only favorites)

## Adding Channels
Edit `src/channels.js` → `CHANNELS` array. Each channel needs:
- `id`: unique string
- `name`: display name
- `country`: ISO 3166-1 alpha-2 code
- `categories`: array from: news, sports, entertainment, music, movies, kids, documentary, general
- `languages`: array of ISO 639-3 codes (spa, eng, fra, deu, ita, por)
- `logo`: URL to channel logo image
- `streamUrl`: HLS stream URL (.m3u8)

Public stream sources: https://github.com/iptv-org/iptv, https://github.com/Free-TV/IPTV

## Deployment
- **Local**: `npm run dev` → access from Fire TV via `http://<pc-ip>:3000`
- **Cloud**: Vercel (`vercel`), Netlify (`netlify deploy`), or any static host
- **Docker**: Dockerfile included in README
- **Fire TV native**: Can be wrapped as TWA (Trusted Web Activity) APK

## Code Style
- Functional React components with hooks
- No TypeScript (kept simple for maintainability)
- CSS class names use kebab-case
- JavaScript uses camelCase
