import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { copy, components } from '../assets/content.mjs';
import { languages, storeBadges } from '../assets/languages.mjs';
import { chooseLanguage, supportedLanguage, readPreference, savePreference } from '../assets/site.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const keys = Object.keys(copy.en).sort();
assert.deepEqual(Object.keys(copy), Object.keys(languages), "Language menu and dictionaries match");
for (const [lang, dict] of Object.entries(copy)) {
  assert.deepEqual(Object.keys(dict).sort(), keys, `Copy parity: ${lang}`);
  assert(Object.values(dict).every(value => typeof value === 'string' && value.trim()), `Empty translation: ${lang}`);
}
for (const [input, expected] of [['zh-Hant-CN', 'zh-Hant'], ['zh-Hans-TW', 'zh-Hans'], ['zh-TW', 'zh-Hant'], ['zh-HK', 'zh-Hant'], ['zh-MO', 'zh-Hant'], ['zh-SG', 'zh-Hans'], ['en-US', 'en'], ['es-MX', 'es'], ['hi-IN', 'hi'], ['ar-SA', 'ar'], ['fr-CA', 'fr'], ['bn-BD', 'bn'], ['pt-PT', 'pt'], ['de', null], [undefined, null]]) {
  assert.equal(supportedLanguage(input), expected, `Locale: ${input}`);
}
assert.equal(chooseLanguage({explicit:'zh-Hant',saved:'en',languages:['zh-CN']}), 'zh-Hant');
assert.equal(chooseLanguage({saved:'zh-Hans',languages:['en']}), 'zh-Hans');
assert.equal(chooseLanguage({languages:['de', 'zh-TW', 'en']}), 'zh-Hant');
assert.equal(chooseLanguage({explicit:'bad',saved:'bad',languages:['de','ja']}), 'en');
assert.equal(chooseLanguage({}), 'en');
assert.equal(chooseLanguage({explicit:'ar-SA',saved:'en',languages:['fr']}), 'ar');

// A browser can deny even accessing the localStorage property, not just getItem.
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
try {
  Object.defineProperty(globalThis, 'localStorage', {configurable:true, get() {throw new Error('Storage blocked');}});
  assert.equal(readPreference(), null);
  assert.doesNotThrow(() => savePreference('zh-Hant'));
  const preferences = new Map();
  Object.defineProperty(globalThis, 'localStorage', {configurable:true, value:{getItem:key=>preferences.get(key)??null,setItem:(key,value)=>preferences.set(key,value)}});
  savePreference('zh-Hant');
  assert.equal(readPreference(), 'zh-Hant');
  assert.deepEqual([...preferences], [['aurody.website.language','zh-Hant']]);
} finally {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else delete globalThis.localStorage;
}

let linkCount = 0;
for (const file of ['index.html', 'support.html', 'privacy.html', 'sdklist.html']) {
  const html = await readFile(`${root}/${file}`, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Single h1: ${file}`);
  assert(html.includes('<main id="main">'), `Main landmark: ${file}`);
  assert(!/<form\b|<iframe\b/.test(html), `No forms/iframes: ${file}`);
  assert(!/play\.google\.com/i.test(html), `No Google Play entry: ${file}`);
  const storeLinks = [...html.matchAll(/<a\b[^>]*\bhref="(https?:\/\/apps\.apple\.com\/[^"]*)"[^>]*>/gi)];
  assert.deepEqual(storeLinks.map(link => link[1]), file === 'index.html'
    ? ['https://apps.apple.com/cn/app/aurody/id6829440466']
    : [], `Exact App Store destination on homepage only: ${file}`);
  if (storeLinks.length) assert(storeLinks[0][0].includes('data-i18n-aria="hero.download"'), 'Download link is localized');
  assert.deepEqual([...html.matchAll(/<option value="([^"]+)"/g)].map(match => match[1]), Object.keys(languages));
  assert(/mailto:deqiutseng@gmail\.com/.test(html), `Contact: ${file}`);
  for (const [, key] of html.matchAll(/data-i18n(?:-aria|-alt)?="([^"]+)"/g)) assert(key in copy.en, `${file}: ${key}`);
  for (const [, tag, raw] of html.matchAll(/<(a|img|script|link)\b[^>]*(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(raw)) {
      assert(tag === 'a' || tag === 'link' && raw.includes('deqiutseng.github.io/AurodyWeb/'), `No external runtime dependency: ${raw}`);
      continue;
    }
    const [pathPart, hash] = raw.split('#');
    const target = resolve(root, pathPart.split('?')[0] || file);
    assert(target.startsWith(root), `Path outside site: ${raw}`);
    await access(target);
    if (hash && target.endsWith('.html')) {
      const targetHtml = target === resolve(root, file) ? html : await readFile(target, 'utf8');
      assert(targetHtml.includes(`id="${hash}"`), `Broken anchor: ${file} -> ${raw}`);
    }
    linkCount++;
  }
}
for (const platform of Object.values(components)) for (const row of platform) {
  assert(`purpose.${row[2]}` in copy.en, `Component purpose: ${row[0]}`);
  assert(row[3].startsWith('https://'), `Component source: ${row[0]}`);
}
assert((await readdir(`${root}/assets/images`)).length >= 7);
for (const lang of Object.keys(storeBadges)) await access(`${root}/assets/images/app-store-${lang}.svg`);
await access(`${root}/.nojekyll`);
console.log(`PASS: ${keys.length} keys × ${Object.keys(languages).length} languages; locale priority/fallback and denied storage; four readable pages; ${linkCount} local links/assets; ${Object.values(components).flat().length} components.`);
