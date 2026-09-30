# Restaurant website

The Vite frontend requests restaurant data from the Express API in `backend/`.
The backend, not the browser, requests Swiggy's upstream API.

## Run locally

1. Use Node.js 20 or newer.
2. In one terminal, install and start the API:

   ```sh
   cd backend
   npm install
   copy .env.example .env
   npm run dev
   ```

   On macOS/Linux, replace `copy .env.example .env` with `cp .env.example .env`.
3. In a second terminal, install and start the frontend from the project root:

   ```sh
   npm install
   npm run dev
   ```

   Leave `VITE_API_BASE_URL` empty during local development. Vite forwards `/api`
   requests to `http://localhost:3001`. Running `npm run dev` starts both Vite
   and the API; there is no need to start `dev:api` separately.

## Deploy to Vercel

The project includes Vercel serverless handlers in `api/` as well as the
standalone Express server. For the existing Vercel site, deploy the project root
(not `backend/`) with:

- Build command: `npm run build`
- Output directory: `dist`
- `SWIGGY_API_BASE_URL=https://www.swiggy.com` (optional; this is the default)

Do not set `VITE_API_BASE_URL` for the same-origin Vercel deployment. The
frontend calls `/api/...` on its own Vercel domain, and the serverless functions
handle those routes. `vercel.json` rewrites the app's restaurant/menu routes to
the SPA entry point so refreshing a nested route does not return Vercel 404.
After adding these files, redeploy the project. Check
`https://your-domain.example/api/health` returns `{"status":"ok"}` and
`https://your-domain.example/api/restaurants?lat=28.7040592&lng=77.10249019999999`
returns JSON.

If the API is hosted on a different domain, set `VITE_API_BASE_URL` at build
time to the backend's public HTTPS origin.

## Deploy as a standalone Node.js server

The Express server can also serve the frontend and API together on one origin.

On a Node hosting provider, set the project root as the service root, the build
command to:

```sh
npm install && npm --prefix backend install && npm run build
```

and the start command to:

```sh
npm start
```

Express serves the production `dist/` files and handles `/api/*` on the same
origin. Set this backend environment variable in the hosting dashboard:

- `SWIGGY_API_BASE_URL=https://www.swiggy.com`
- `PORT` is normally supplied by the host; otherwise the API listens on `3001`.

For a **separately hosted static frontend**, deploy the project root with
`npm run build` and publish `dist/`. Set the build-time variable
`VITE_API_BASE_URL` to the backend's public HTTPS origin (no trailing slash).
Rebuild the frontend after changing `VITE_API_BASE_URL`; Vite embeds it in the
generated files. The API currently allows requests from any origin and does not
use cookies or credentialed CORS.

Do not set the production frontend's API URL to localhost. With the recommended
single-service deployment, leave `VITE_API_BASE_URL` empty.

The backend exposes:

- `GET /api/health` — health check.
- `GET /api/restaurants?lat=28.7040592&lng=77.10249019999999`
- `GET /api/restaurants/:restaurantId/menu?lat=28.7040592&lng=77.10249019999999`

The React pages call these routes on page load. The backend also serves the
frontend build, so no public CORS proxy needs to be activated.

## Upstream API caveat

The original source used Vite's development-only proxy. Vite's `server.proxy`
configuration is not included in the static production build, which is why the
relative `/api/swiggy/...` request does not reach Swiggy after static deployment.
The Express API removes that production gap and keeps upstream requests off the
browser. It sends normal JSON, language, referer, and User-Agent headers, but
Swiggy may still block server-side requests, require changing headers/session
tokens, rate-limit the endpoint, or change its undocumented response format.
Those restrictions cannot be bypassed reliably by a CORS proxy. If the API
returns a 403, challenge page, or otherwise stops accepting server requests,
check the backend logs and use a provider-approved/public API or obtain
authorized credentials; do not expose session cookies or secrets in the
frontend. A successful backend health check confirms only that the backend is
running, not that Swiggy allows the upstream request.
