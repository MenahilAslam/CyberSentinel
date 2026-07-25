import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'api-middleware-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const urlPath = req.url.split('?')[0];
        const routeName = urlPath.replace('/api/', '');

        try {
          if (req.method === 'POST') {
            const buffers: Uint8Array[] = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const bodyText = Buffer.concat(buffers).toString('utf-8');
            try {
              (req as any).body = JSON.parse(bodyText);
            } catch {
              (req as any).body = bodyText;
            }
          }

          let handlerModule;
          if (routeName === 'chat') {
            handlerModule = await import('./api/chat.ts');
          } else if (routeName === 'scan-url') {
            handlerModule = await import('./api/scan-url.ts');
          } else if (routeName === 'analyze-email') {
            handlerModule = await import('./api/analyze-email.ts');
          } else if (routeName === 'health') {
            handlerModule = await import('./api/health.ts');
          }

          if (handlerModule && handlerModule.default) {
            (res as any).status = (code: number) => {
              res.statusCode = code;
              return res;
            };
            (res as any).json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            return await handlerModule.default(req, res);
          }
        } catch (err: any) {
          console.error(`Error in /api/${routeName}:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal API Error', details: err?.message || String(err) }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
