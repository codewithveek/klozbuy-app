// Cloudflare Worker entry for the web app. `pnpm build:web` copies this next to the Expo
// server export (dist/server); static files in dist/client are served by Workers assets
// before the worker runs, and every other request is server-rendered here.
import { createRequestHandler } from 'expo-server/adapter/workerd';

const render = createRequestHandler({ build: '.' });

export default {
  fetch: (request, env, ctx) => render(request, env, ctx),
};
