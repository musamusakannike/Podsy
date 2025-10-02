# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project summary
- Expo + React Native app using Expo Router for file-based navigation, Tailwind via NativeWind for styling, TanStack Query for data fetching/caching, and expo-audio for playback.
- TypeScript with strict mode and a root alias '@/'.
- Spotify Web API integration via an Axios client with a request interceptor and client-credentials token management cached in SecureStore.

Commands you’ll use often
- Install dependencies
  ```bash path=null start=null
  npm install
  ```
- Start the development server (choose device from the Metro UI or flags below)
  ```bash path=null start=null
  npm run start
  ```
- Launch on a specific platform
  ```bash path=null start=null
  npm run android
  npm run ios
  npm run web
  ```
- Lint (ESLint via expo lint)
  ```bash path=null start=null
  npm run lint
  ```
- Type-check only (no emit)
  ```bash path=null start=null
  npx tsc --noEmit
  ```
- Tests
  - There is no configured test runner or test scripts in package.json.

Architecture and key flows
- Routing and screens
  - File-based routing under app/ (Expo Router). Root layout defines a Stack with hidden headers and registers: (tabs), auth, podcast/[id], episode/[id].
  - Tabs UI under app/(tabs)/_layout.tsx renders 4 tabs (Home, Search, Library, Profile) and includes the MiniPlayer pinned to the bottom of the safe area.
  - Example routes:
    - app/(tabs)/index.tsx: Home “Discover” screen that fetches curated/trending/recent podcasts using TanStack Query and the Axios Spotify client.
    - app/podcast/[id].tsx: Podcast detail with episode list; tapping an episode calls the player context to begin playback.
    - app/episode/[id].tsx: Episode detail with play/pause/resume against the shared player.
- Providers and app shell
  - app/_layout.tsx wraps the app with:
    - QueryClientProvider (TanStack Query) instantiated once per app run.
    - ThemeProvider (contexts/theme-context.tsx) for light/dark mode; persists selection with AsyncStorage and supports 'system'.
    - PlayerProvider (contexts/player-context.tsx) exposes currentEpisode, playback state, and imperative controls (playEpisode, pause, resume, seek, stop). It configures expo-audio to play in silent mode/background and drives both the full and mini player UIs.
- Data layer and Spotify API
  - lib/spotify.ts exports an Axios instance (baseURL https://api.spotify.com/v1) with a request interceptor that injects a Bearer token from getAccessToken().
  - getAccessToken() performs the client credentials flow against accounts.spotify.com, caches the token and expiry in expo-secure-store, and refreshes it when expired. The module also provides helpers: searchPodcasts, getPodcast, getPodcastEpisodes, getEpisode, getSavedShows, saveShow/removeShow, checkSavedShows.
  - hooks/use-podcasts.ts wraps these endpoints with typed TanStack Query hooks (useQuery/useMutation) and manages cache invalidation for saved shows.
- Playback UI
  - components/mini-player.tsx is shown across tabs; displays episode info, progress (animated), and play/pause/close controls. Navigates to the episode screen on press.
  - components/full-player.tsx renders a full-screen player with animated art, a slider bound to position/duration, and transport controls backed by PlayerProvider.
- Styling and theming
  - Tailwind via NativeWind with tailwind.config.js configured to scan app/, components/, screens/ (if present), and App.tsx. Metro and Babel are configured for NativeWind; react-native-reanimated plugin is enabled.
  - ThemeProvider chooses light/dark based on saved preference or system and exposes theme + setter.
- Configuration highlights
  - TypeScript: tsconfig.json extends expo/tsconfig.base, enables strict mode, and adds a root alias '@/*' to the repo root.
  - Expo app config (app.json): new architecture enabled; web output static; plugins include expo-router, expo-splash-screen, expo-audio, expo-video, expo-secure-store.
  - ESLint: eslint.config.js uses eslint-config-expo (flat config) and ignores dist/*; linting is run via 'expo lint'.

Notes and gotchas
- Tests are not yet configured; there are no test scripts in package.json.
- The README’s “reset-project” script is referenced, but scripts/reset-project.js is not present in the repository, so that command will fail as-is.
- Spotify client credentials are referenced in lib/spotify.ts and access tokens are stored in SecureStore; the auth screen at app/auth/index.tsx is a UI for entering credentials but does not currently persist or wire them into the API layer.
