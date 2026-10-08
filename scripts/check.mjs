import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
/** @param {string} path @returns {Promise<string[]>} */
async function files(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : [resolve(path, entry.name)]));
  return nested.flat();
}
const sourceFiles = await files(resolve(root, 'src'));
const exportFiles = await files(resolve(root, 'dist'));
assert.equal(sourceFiles.length, exportFiles.length, 'No missing or stale export files');
for (const source of sourceFiles) {
  const destination = source.replace(resolve(root, 'src'), resolve(root, 'dist'));
  assert.deepEqual(await readFile(source), await readFile(destination), `Export matches source: ${source}`);
}
const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const css = await readFile(resolve(root, 'dist/styles.css'), 'utf8');
const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, '');
assert.equal(heading, 'A town where AI agents live and work');
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.equal((html.match(/class="district-card"/g) || []).length, 6);
assert.ok(html.includes('<html lang="en">'));
assert.ok(html.includes('width=device-width, initial-scale=1'));
assert.ok(!/maximum-scale|user-scalable/.test(html));
assert.ok(!/<script\b|\son\w+\s*=|<iframe\b|<form\b/i.test(html), 'No JavaScript, embeds, tracking or forms');
assert.ok(!/@import|url\(['"]?https?:/i.test(css), 'All CSS assets local');
for (const [target, label] of [['https://agentcity.lol/town', 'Enter the town'], ['https://agentcity.lol/agentcity.txt', 'Read the agent guide'], ['https://agentcity.lol/docs', 'Documentation']]) {
  assert.ok(html.includes(`href="${target}">${label}`), `Required destination: ${label}`);
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Unique IDs');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Anchor exists: ${id}`);
for (const image of html.matchAll(/<img\b[^>]+>/g)) assert.match(image[0], /\balt="[^"]*"/, 'Images have alt text');
for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (value.startsWith('https:') || value.startsWith('#')) continue;
  assert.ok(value.startsWith('./'), `Relative asset URL: ${value}`);
  await stat(resolve(root, 'dist', value));
}
for (const [, value] of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
  assert.ok(value.startsWith('./'), `Relative CSS asset: ${value}`);
  await stat(resolve(root, 'dist', value));
}
assert.ok(css.includes(':focus-visible'));
assert.ok(css.includes('prefers-reduced-motion: no-preference'));
const bytes = (await Promise.all(exportFiles.map(async path => (await stat(path)).size))).reduce((a, b) => a + b, 0);
assert.ok(bytes < 1_048_576, 'Production export below its 1 MiB path budget');
assert.ok((await stat(resolve(root, '.gitignore'))).size <= 512, 'Explicit .gitignore path budget: 512 bytes');
console.log(`PASS: ${exportFiles.length} export files match source; required content, 3 destinations, all local anchors/assets, image alternatives, no runtime JS/tracking, focus/motion guards. Export: ${bytes} bytes.`);
