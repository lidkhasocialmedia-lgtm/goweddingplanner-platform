import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'site');
if (!fs.existsSync(site)) {
  console.error('No existe site/. Ejecuta npm run build primero.');
  process.exit(1);
}
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) files.push(file);
  }
};
walk(site);
let failed = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(site, file);
  if (/<meta name="robots" content="noindex/i.test(html)) continue;
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1 = html.match(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (!title || !description || !h1 || !canonical) {
    console.error(`FAIL ${rel}: falta title/description/h1/canonical`);
    failed++;
  }
  if ((html.match(/<h1\b/gi) || []).length !== 1) {
    console.error(`FAIL ${rel}: debe tener exactamente un h1`);
    failed++;
  }
  for (const src of [...html.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)/g)].map((m) => m[1])) {
    const asset = path.join(site, src.slice(1));
    if (!fs.existsSync(asset)) {
      console.error(`FAIL ${rel}: asset no encontrado ${src}`);
      failed++;
    }
  }
  for (const href of [...html.matchAll(/href="(\/[^"#?]+(?:#[^"]*)?)"/g)].map((m) => m[1].split('#')[0]).filter(Boolean)) {
    const target = href.endsWith('/') ? path.join(site, href.slice(1), 'index.html') : path.join(site, href.slice(1));
    if (!fs.existsSync(target)) {
      console.error(`FAIL ${rel}: enlace interno no encontrado ${href}`);
      failed++;
    }
  }
}
const sitemap = fs.readFileSync(path.join(site, 'sitemap.xml'), 'utf8');
const urls = (sitemap.match(/<loc>[^<]+<\/loc>/g) || []).length;
console.log(`Checked ${files.length} HTML pages and ${urls} sitemap URLs.`);
if (failed) {
  console.error(`${failed} checks failed.`);
  process.exit(1);
}
console.log('All structural checks passed.');
