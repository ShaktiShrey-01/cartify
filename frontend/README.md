# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment & Artifacts

- **Env files:** Configure frontend variables via [frontend/.env.example](frontend/.env.example). Copy to [frontend/.env](frontend/.env) locally and set `VITE_API_BASE` to your backend URL. `.env` is ignored, do not commit.
- **Bundle stats:** Rollup Visualizer outputs like [frontend/stats.html](frontend/stats.html) are ignored by [.gitignore](../.gitignore) to avoid committing analysis artifacts.
- **.npmrc:** [frontend/.npmrc](frontend/.npmrc) is optional. Remove it if you don't need custom npm settings. Never commit auth tokens.

## Backend API base

The app reads `VITE_API_BASE` in code (see [frontend/src/utils/api.js](frontend/src/utils/api.js)).

- Local dev: leave `VITE_API_BASE` empty to use same-origin or a Vite proxy.
- Production (Netlify): set `VITE_API_BASE` to your Render backend URL in Netlify environment settings.
