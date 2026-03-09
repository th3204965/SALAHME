# Salahme

A modern, fast, and responsive web application for exploring authentic prayer times globally. Built with React, Next.js, and TailwindCSS.

## Features

- **Accurate Adhan Calculations**: Uses the `adhan` library to calculate standard prayers (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) and special timings (Qiyam) based on the University of Islamic Sciences, Karachi calculation method.
- **Location Awareness**: Auto-detects the user's location on the first visit or defaults to a preset location (Bissau, RJ).
- **Search Capabilities**: Integrated with a server action to search for cities or geographical locations dynamically.
- **Offline Reliability**: Caches location data intelligently in `localStorage` to reduce API calls and display data instantly on return visits.
- **Real-time Reactivity**: Auto-refreshes prayer times in the background to ensure data is always up-to-date.

## Performance & Optimizations

This application has been relentlessly optimized for production:
- **Zero-Latency Rendering**: Implemented a "Cache-First" retrieval strategy alongside `React.memo` and `useCallback` to prevent cascading V-DOM renders during heavy 3D CSS hover effects.
- **Static Edge Ready**: Fully Next.js SSG configured. `next.config.ts` has been optimized (`poweredByHeader: false`, compression enabled), and `src/app/layout.tsx` is completely purged of CPU-taxing inline styles.
- **Graceful Rate Limiting**: Server actions proactively analyze HTTP `429 Too Many Requests` API failures to degrade gracefully instead of throwing exceptions.
- **Universal Config Hardening**: TypeScript is scaled to output minimal `ES2022` syntax with strict dead-code testing (`noUnusedLocals`). `postcss.config.mjs` applies strict `autoprefixer` transformations. Tests harness isolated `.vitest` caching directories for speed.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Library**: [React 19](https://react.dev)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Linting & Formatting**: [Biome](https://biomejs.dev)
- **Testing**: [Vitest](https://vitest.dev) & [React Testing Library](https://testing-library.com/)

## Getting Started

1. **Clone the repository and install dependencies:**

   ```bash
   pnpm install
   ```

2. **Run the development server:**

   ```bash
   pnpm dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.**

## Scripts

This project uses modern tooling to ensure high code quality.

### Testing

Unit and integration tests are handled by **Vitest**:

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm run test:watch
```

### Formatting & Linting

We use **Biome** for blazing fast linting and formatting:

```bash
# Check code for lint errors
pnpm lint

# Auto-fix lint issues and format files
pnpm format
```
