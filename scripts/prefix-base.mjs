import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');
const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) {
  console.log('No base path supplied; leaving root-relative URLs unchanged.');
  process.exit(0);
}

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) {
      let html = fs.readFileSync(file, 'utf8');
      html = html
        .replaceAll('href="/', `href="${base}/`)
        .replaceAll('src="/', `src="${base}/`)
        .replaceAll('location.replace("/', `location.replace("${base}/`)
        .replaceAll('url=/', `url=${base}/`)
        .replace('</head>', '<meta name="robots" content="noindex,nofollow"></head>');
      fs.writeFileSync(file, html);
    }
  }
};
walk(root);
console.log(`Prefixed project Pages paths with ${base}`);
