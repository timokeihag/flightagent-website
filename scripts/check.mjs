// Checks the pages in public/. Run: node scripts/check.mjs
// Exits 0 when every check passes, otherwise 1 with one line per problem.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const COMPANY = ['Live Large AB', '556695-1108', 'Duvvägen 3, 352 73 Växjö', 'hello@flightagent.se'];
const DRAFT = 'Utkast. Texten ska granskas av en jurist innan Flightagent lanseras.';
const IN_DEVELOPMENT = 'Flightagent är under utveckling. Alla funktioner som beskrivs finns inte ännu.';

// Each page and the extra checks it needs on top of the common ones.
const REQUIRED_PAGES = {
  'index.html': { mustContain: [IN_DEVELOPMENT], mustLinkTo: ['/privacy', '/terms'] },
  '404.html': { mustLinkTo: ['/'] },
};

const errors = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

function textOf(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

function footerOf(html) {
  const m = html.match(/<footer[\s\S]*?<\/footer>/);
  return m ? m[0] : '';
}

function hrefs(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]);
}

function externalResources(source) {
  const found = [];
  const patterns = [
    /\bsrc="([^"]*)"/g,
    // Only link types that make the browser fetch something (not rel="canonical").
    /<link\b(?=[^>]*\brel="[^"]*\b(?:stylesheet|icon|preload|modulepreload|prefetch|manifest)\b)[^>]*\bhref="([^"]*)"/g,
    /url\(\s*['"]?([^'")]+)/g,
  ];
  for (const re of patterns) {
    for (const m of source.matchAll(re)) {
      if (/^(https?:)?\/\//i.test(m[1].trim())) found.push(m[1]);
    }
  }
  return found;
}

function internalTargetExists(href) {
  const path = href.split('#')[0].split('?')[0];
  if (path === '' || path === '/') return existsSync(join(pub, 'index.html'));
  const clean = path.replace(/^\//, '');
  const asFile = join(pub, clean);
  if (existsSync(asFile) && statSync(asFile).isFile()) return true;
  return existsSync(join(pub, clean, 'index.html'));
}

function idsOf(html) {
  return new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
}

function tocLinks(html) {
  const m = html.match(/<nav\b[^>]*class="[^"]*\btoc\b[^"]*"[\s\S]*?<\/nav>/);
  return m ? new Set(hrefs(m[0])) : new Set();
}

for (const [page, rules] of Object.entries(REQUIRED_PAGES)) {
  const file = join(pub, page);
  if (!existsSync(file)) {
    fail(page, 'saknas');
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const text = textOf(html);

  if (!/<html\b[^>]*\blang="sv"/.test(html)) fail(page, 'saknar <html lang="sv">');
  if (!/<title>[^<]+<\/title>/.test(html)) fail(page, 'saknar <title>');
  if (!/<meta\b[^>]*name="description"[^>]*content="[^"]+"/.test(html)) fail(page, 'saknar meta description');
  if (/<script\b/i.test(html)) fail(page, 'innehåller <script>');
  for (const url of externalResources(html)) fail(page, `laddar resurs från annan domän: ${url}`);

  const footer = textOf(footerOf(html));
  for (const item of COMPANY) if (!footer.includes(item)) fail(page, `sidfoten saknar "${item}"`);
  const footerLinks = hrefs(footerOf(html));
  for (const target of ['/privacy', '/terms']) {
    if (!footerLinks.includes(target)) fail(page, `sidfoten länkar inte till ${target}`);
  }

  for (const href of new Set(hrefs(html))) {
    if (href.startsWith('/') && !href.startsWith('//') && !internalTargetExists(href)) {
      fail(page, `intern länk pekar på sida som saknas: ${href}`);
    }
  }

  for (const s of rules.mustContain ?? []) if (!text.includes(s)) fail(page, `saknar texten "${s}"`);
  const links = hrefs(html);
  for (const target of rules.mustLinkTo ?? []) if (!links.includes(target)) fail(page, `länkar inte till ${target}`);

  if (rules.sections) {
    const ids = idsOf(html);
    const toc = tocLinks(html);
    for (const id of rules.sections) {
      if (!ids.has(id)) fail(page, `saknar avsnittet id="${id}"`);
      if (!toc.has(`#${id}`)) fail(page, `innehållsförteckningen saknar länk till #${id}`);
    }
  }
}

const cssFile = join(pub, 'styles.css');
if (existsSync(cssFile)) {
  for (const url of externalResources(readFileSync(cssFile, 'utf8'))) {
    fail('styles.css', `laddar resurs från annan domän: ${url}`);
  }
}

if (errors.length) {
  for (const e of errors) console.log(e);
  console.log(`check failed (${errors.length} problem${errors.length === 1 ? '' : 's'})`);
  process.exit(1);
}
console.log(`check ok (${Object.keys(REQUIRED_PAGES).length} pages)`);
