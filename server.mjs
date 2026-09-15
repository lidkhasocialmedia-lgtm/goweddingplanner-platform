import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const site = path.join(root, 'site');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';

if (!fs.existsSync(path.join(site, 'index.html'))) {
  execFileSync(process.execPath, [path.join(root, 'scripts/build.mjs')], { stdio: 'inherit' });
}
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const redirects = new Map([
  ['/bodas-mostoles', '/madrid/ciudades/mostoles/'], ['/bodas-alcorcon', '/madrid/ciudades/alcorcon/'], ['/bodas-arroyomolinos', '/madrid/ciudades/arroyomolinos/'], ['/bodas-fuenlabrada', '/madrid/ciudades/fuenlabrada/'], ['/bodas-getafe', '/madrid/ciudades/getafe/'], ['/bodas-leganes', '/madrid/ciudades/leganes/'], ['/bodas-navalcarnero', '/madrid/ciudades/navalcarnero/'], ['/bodas-villaviciosa', '/madrid/ciudades/villaviciosa-de-odon/'], ['/bodas-barcelona', '/cataluna/ciudades/barcelona/'], ['/bodas-sant-cugat', '/cataluna/ciudades/sant-cugat-del-valles/'], ['/bodas-sitges', '/cataluna/ciudades/sitges/'], ['/bodas-castelldefels', '/cataluna/ciudades/castelldefels/'], ['/bodas-sabadell', '/cataluna/ciudades/sabadell/'], ['/bodas-terrassa', '/cataluna/ciudades/terrassa/'], ['/bodas-esplugues', '/cataluna/ciudades/esplugues/'], ['/bodas-sant-just', '/cataluna/ciudades/sant-just/'], ['/bodas-mataro', '/cataluna/ciudades/mataro/'], ['/bodas-granollers', '/cataluna/ciudades/granollers/'], ['/bodas-badalona', '/cataluna/ciudades/badalona/']
]);

const safePath = (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const candidate = path.resolve(site, relative);
  return candidate.startsWith(path.resolve(site)) ? candidate : null;
};
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname.replace(/\/$/, '') || '/';
  const redirectTarget = redirects.get(pathname.replace(/\.html$/, ''));
  if (redirectTarget) {
    res.writeHead(301, { Location: redirectTarget });
    res.end();
    return;
  }
  let file = safePath(req.url);
  if (!file) { res.writeHead(400); res.end('Bad request'); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) && !path.extname(file)) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('No encontrado'); return; }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600' });
  fs.createReadStream(file).pipe(res);
});
server.listen(port, host, () => console.log(`GoWeddingPlanner preview: http://${host}:${port}`));
