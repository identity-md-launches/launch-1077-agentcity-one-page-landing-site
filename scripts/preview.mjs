import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
/** @type {Record<string, string>} */
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    if (url.pathname === '/') {
      response.writeHead(302, { Location: '/preview/' }).end();
      return;
    }
    if (!url.pathname.startsWith('/preview/')) {
      response.writeHead(404).end('Not found');
      return;
    }
    const relative = decodeURIComponent(url.pathname.slice('/preview/'.length));
    const path = resolve(root, relative || 'index.html');
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const contents = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(contents);
  } catch {
    response.writeHead(404).end('Not found');
  }
});
server.listen(port, '0.0.0.0', () => console.log(`Preview: http://localhost:${port}/preview/`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
