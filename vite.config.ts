import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { handleApiRequest } from './src/worker/index';
import { createMemoryKV } from './src/worker/ical/memoryKv';
import type { WorkerEnv } from './src/worker/ical/sync';

function loadDevVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  const devVarsPath = path.resolve(process.cwd(), '.dev.vars');
  if (!fs.existsSync(devVarsPath)) return vars;
  const content = fs.readFileSync(devVarsPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed
        .slice(eqIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
      vars[key] = val;
    }
  }
  return vars;
}

/**
 * Plugin Vite para emular as rotas /api/* do Cloudflare Worker durante `npm run dev`.
 */
function cloudflareWorkerDevPlugin(): Plugin {
  const memoryKv = createMemoryKV();

  return {
    name: 'cloudflare-worker-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const devVars = loadDevVars();
          const env: WorkerEnv = {
            AVAILABILITY_KV: memoryKv,
            AIRBNB_ICAL_URL:
              devVars.AIRBNB_ICAL_URL || process.env.AIRBNB_ICAL_URL || '',
            ADMIN_SYNC_TOKEN:
              devVars.ADMIN_SYNC_TOKEN || process.env.ADMIN_SYNC_TOKEN || '',
            ENVIRONMENT: 'development',
            SYNC_INTERVAL_MINUTES: '15',
            STALE_THRESHOLD_MINUTES: '60',
            ICAL_FETCH_TIMEOUT_MS: '10000',
            ICAL_MAX_BYTES: '1048576',
            PROPERTY_TIMEZONE: 'America/Fortaleza',
          };

          const protocol = 'http';
          const host = req.headers.host || 'localhost:5173';
          const fullUrl = `${protocol}://${host}${req.url}`;

          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === 'string') headers.set(k, v);
            else if (Array.isArray(v)) headers.set(k, v.join(', '));
          }

          const webReq = new Request(fullUrl, {
            method: req.method || 'GET',
            headers,
          });

          const webRes = await handleApiRequest(webReq, env, {
            waitUntil: (promise: Promise<unknown>) => {
              promise.catch((err) => console.error('[Dev waitUntil]', err));
            },
          });

          res.statusCode = webRes.status;
          webRes.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });
          const bodyText = await webRes.text();
          res.end(bodyText);
        } catch (err) {
          console.error('[Worker Dev Middleware Error]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Erro interno no servidor de desenvolvimento.' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflareWorkerDevPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
