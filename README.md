# Salahme

A modern, fast, and responsive web application for exploring accurate Islamic prayer times globally. Built with Next.js, React 19, and TailwindCSS v4.

## Features

- **Accurate Adhan Calculations** — Uses the `adhan` library to calculate Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, and Qiyam using the University of Islamic Sciences, Karachi method.
- **Location Awareness** — Auto-detects the user's location on the first visit or defaults to a preset location (Bissau, RJ).
- **City Search** — Server action powered geocoding via Nominatim to search for any city worldwide.
- **Offline Reliability** — Caches location data in `localStorage` for instant reload without network requests.
- **Auto-Refresh** — Recalculates prayer times locally every minute to keep data current.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| Library | [React 19](https://react.dev) |
| Styling | [TailwindCSS v4](https://tailwindcss.com/) |
| Linting & Formatting | [Biome](https://biomejs.dev) |
| Testing | [Vitest](https://vitest.dev) & [React Testing Library](https://testing-library.com/) |
| Package Manager | [pnpm](https://pnpm.io/) |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Check for lint errors (Biome) |
| `pnpm format` | Auto-format all files (Biome) |
| `pnpm test` | Run all tests once (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with metadata & fonts
│   ├── page.tsx          # Main page with parallax UI
│   ├── actions.ts        # Server actions (geocoding)
│   └── globals.css       # Theme, animations, and base styles
├── components/
│   ├── location-selector.tsx  # City search component
│   ├── prayer-item.tsx        # Individual prayer card with 3D tilt
│   └── prayer-list.tsx        # Prayer cards grid
├── hooks/
│   └── use-prayer-times.ts    # Core hook (cache-first, auto-refresh)
└── lib/
    ├── constants.ts      # App-wide configuration
    ├── prayer-service.ts # Adhan calculation wrapper
    ├── types.ts          # TypeScript interfaces
    └── utils.ts          # Storage & display helpers
```

## License

Private.
