// Renders the LinkedIn assets in src/ to PNG/PDF in export/ with headless Edge (or Chrome).
// Usage: node brand/linkedin/render.mjs [name ...]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'src');
const out = join(here, 'export');
mkdirSync(out, { recursive: true });

const browser = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find(existsSync);
if (!browser) throw new Error('No Edge or Chrome found');

// name -> [page, query, width, height, scale]
const shots = {
  'banner-1128x191':        ['banner.html', '',        1128, 191, 1],
  'banner-1128x191@2x':     ['banner.html', '',        1128, 191, 2],
  'banner-guides':          ['banner.html', '?guides', 1128, 191, 1],
  'logo-400x400':           ['avatar.html', '',         400, 400, 1],
  'post-project-produce':   ['post.html',   '?p=produce',   1080, 1350, 1],
  'post-project-workshop':  ['post.html',   '?p=workshop',  1080, 1350, 1],
  'post-project-haulage':   ['post.html',   '?p=haulage',   1080, 1350, 1],
  'post-project-petroleum': ['post.html',   '?p=petroleum', 1080, 1350, 1],
  'post-how-we-work':       ['post.html',   '?p=process',   1080, 1350, 1],
  'post-statement':         ['post.html',   '?p=statement', 1080, 1350, 1],
  ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((n) =>
    [`carousel-produce-trading-${n}`, ['carousel.html', `?s=${n}`, 1080, 1350, 1]])),
};
// Carousels go to LinkedIn as a PDF "document" post, one 1080×1350 page per slide
const pdfs = {
  'carousel-produce-trading': 'carousel.html',
};

// Own profile dir, so a running Edge/Chrome window doesn't swallow the headless run
const flags = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--user-data-dir=${join(tmpdir(), 'meri-li-render')}`,
  '--allow-file-access-from-files', '--virtual-time-budget=6000'];
const want = process.argv.slice(2);
const pick = (name) => !want.length || want.some((w) => name.includes(w));

for (const [name, [page, query, w, h, scale]] of Object.entries(shots)) {
  if (!pick(name)) continue;
  const url = pathToFileURL(join(src, page)).href + query;
  execFileSync(browser, [...flags, `--window-size=${w},${h}`, `--force-device-scale-factor=${scale}`,
    `--screenshot=${join(out, name + '.png')}`, url], { stdio: 'ignore' });
  console.log('png', name);
}
for (const [name, page] of Object.entries(pdfs)) {
  if (!pick(name)) continue;
  const url = pathToFileURL(join(src, page)).href;
  execFileSync(browser, [...flags, '--no-pdf-header-footer', `--print-to-pdf=${join(out, name + '.pdf')}`, url],
    { stdio: 'ignore' });
  console.log('pdf', name);
}
