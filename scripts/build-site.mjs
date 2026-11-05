import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { copy, components } from '../assets/content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const text = (key) => {
  if (!(key in copy.en)) throw new Error(`Missing copy: ${key}`);
  return escape(copy.en[key]);
};
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const el = (tag, key, attrs = '') => `<${tag} data-i18n="${key}"${attrs ? ` ${attrs}` : ''}>${text(key)}</${tag}>`;
const link = (href, key, className = '') => el('a', key, `href="${href}"${className ? ` class="${className}"` : ''}`);
const p = (key, className = '') => el('p', key, className ? `class="${className}"` : '');
const h2 = (key) => el('h2', key);
const image = (src, key, attrs = '') => `<img src="assets/images/${src}" data-i18n-alt="${key}" alt="${text(key)}" ${attrs}>`;
const pageNames = { home: 'index.html', support: 'support.html', privacy: 'privacy.html', sdk: 'sdklist.html' };
const methodIcon = (id) => {
  const paths = {
    file: '<path d="M7 3h7l4 4v14H7zM14 3v5h4M10 12h5M10 16h5"/>',
    share: '<path d="M12 16V3m-5 5 5-5 5 5M5 13v8h14v-8"/>',
    wifi: '<path d="M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r="1"/>'
  };
  return `<span class="method-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[id]}</svg></span>`;
};
const nav = (page) => `<a class="skip" href="#main" data-i18n="nav.skip">${text('nav.skip')}</a>
<header class="site-header" id="top"><div class="shell header-inner">
  <a class="brand" href="index.html" aria-label="${text('nav.home')}" data-i18n-aria="nav.home"><img src="assets/images/logo-128.png" alt="" width="40" height="40"><span>Aurody</span></a>
  <nav class="main-nav" aria-label="${text('nav.product')}" data-i18n-aria="nav.product">${link('index.html', 'nav.product', page === 'home' ? 'active' : '')}${link('support.html', 'nav.support', page === 'support' ? 'active' : '')}</nav>
  <div class="language" hidden><label for="language" data-i18n="nav.language">${text('nav.language')}</label><select id="language" aria-label="${text('nav.language')}" data-i18n-aria="nav.language"><option value="en" lang="en">English</option><option value="zh-Hans" lang="zh-Hans">简体中文</option><option value="zh-Hant" lang="zh-Hant">繁體中文</option></select></div>
</div></header>`;
const footer = () => `<footer class="site-footer"><div class="shell footer-main"><div class="footer-brand"><a href="index.html" class="wordmark">Aurody</a>${p('footer.line')}</div><nav aria-label="${text('nav.privacy')}" data-i18n-aria="nav.privacy">${link('support.html', 'nav.support')}${link('privacy.html', 'nav.privacy')}${link('sdklist.html', 'nav.sdk')}<a href="mailto:deqiutseng@gmail.com">deqiutseng@gmail.com</a></nav></div><div class="shell footer-bottom">${p('footer.rights')}${link('#top', 'footer.top')}</div></footer>`;

const home = () => `<main id="main">
<section class="shell hero"><div class="hero-copy">${p('hero.platform', 'platform')}${el('h1', 'hero.title')}${p('hero.body', 'lead')}<div class="actions">${link('support.html', 'hero.help', 'button primary')}${link('mailto:deqiutseng@gmail.com', 'nav.contact', 'button secondary')}</div>${p('hero.note', 'small-note')}</div>
  <figure class="hero-visual"><div class="phone">${image('library.webp', 'hero.image', 'width="640" height="1383" fetchpriority="high"')}</div>${el('figcaption', 'hero.caption')}</figure>
</section>
<section class="shell introduction">${h2('intro.title')}${p('intro.body')}</section>
<section class="shell import-section" id="import"><div class="section-intro">${h2('import.title')}${p('import.body')}</div><ul class="import-steps">${['file', 'share', 'wifi'].map(id => `<li>${methodIcon(id)}${el('h3', `import.${id}.title`)}${p(`import.${id}.body`)}</li>`).join('')}</ul>${link('support.html#import', 'import.link', 'text-link')}</section>
<section class="shell collection-section"><figure class="collection-visual">${image('playlists.webp', 'library.image', 'width="640" height="909" loading="lazy"')}${el('figcaption', 'library.caption')}</figure><div class="section-copy">${h2('library.title')}${p('library.body')}${link('support.html#files', 'nav.support', 'text-link')}</div></section>
<section class="shell listen-section"><div class="section-copy">${h2('listen.title')}${p('listen.body')}${p('listen.detail', 'small-note')}</div><div class="record-visual">${image('playback-detail.webp', 'listen.image', 'width="640" height="640" loading="lazy"')}</div></section>
<section class="shell contact-section"><div>${h2('contact.title')}${p('contact.body')}</div><div class="contact-actions">${link('support.html', 'nav.support', 'button primary')}${link('mailto:deqiutseng@gmail.com', 'contact.email', 'text-link')}<span class="email-address">deqiutseng@gmail.com</span></div></section>
</main>`;

const articleSection = (id, title, keys, extra = '') => `<section id="${id}" class="article-section">${h2(title)}${keys.map(key => p(key)).join('')}${extra}</section>`;
const pageHead = (prefix, date = '') => `<div class="page-heading shell">${link('index.html', 'nav.product', 'back-link')}${el('h1', `${prefix}.title`)}${p(`${prefix}.lead`, 'lead')}${date ? p(date, 'revision') : ''}</div>`;
const supportIds = ['import', 'share', 'wifi', 'formats', 'offline', 'files', 'backup', 'contact'];
const support = () => `<main id="main">${pageHead('support')}<div class="shell article-layout"><aside class="contents">${el('h2', 'support.contents')}<nav>${supportIds.map(id => link(`#${id}`, `support.${id}.title`)).join('')}</nav></aside><article class="article-body">
${articleSection('import', 'support.import.title', ['support.import.body'])}
${articleSection('share', 'support.share.title', ['support.share.body'])}
${articleSection('wifi', 'support.wifi.title', [], `<ol class="guide-steps">${[1, 2, 3, 4].map(n => el('li', `support.wifi.step${n}`)).join('')}</ol>${p('support.wifi.note', 'notice')}${p('support.wifi.fix')}`)}
${articleSection('formats', 'support.formats.title', ['support.formats.body', 'support.lyrics.body'])}
${articleSection('offline', 'support.offline.title', ['support.offline.body'])}
${articleSection('files', 'support.files.title', [], `<ul class="file-rules">${['playlist', 'library', 'delete'].map(id => el('li', `support.files.${id}`)).join('')}</ul>`)}
${articleSection('backup', 'support.backup.title', ['support.backup.body'])}
${articleSection('contact', 'support.contact.title', ['support.contact.body'], '<a class="text-link email-link" href="mailto:deqiutseng@gmail.com">deqiutseng@gmail.com</a>')}
</article></div></main>`;
const privacy = () => `<main id="main">${pageHead('privacy', 'date.label')}<article class="shell legal-article article-body">${p('privacy.scope.body')}
${articleSection('collection', 'legal.collect.title', [], ['local', 'network', 'permissions', 'website'].map(id => `${el('h3', `legal.collect.${id}`)}${p(`privacy.${id}.body`)}`).join(''))}
${articleSection('use', 'legal.use.title', ['legal.use.body'])}
${articleSection('public', 'legal.public.title', ['legal.public.body'])}
${articleSection('disclosure', 'legal.disclosure.title', ['legal.disclosure.body', 'privacy.email.body'])}
${articleSection('security', 'legal.security.title', ['legal.security.body'])}
${articleSection('storage', 'legal.storage.title', ['privacy.backup.body', 'privacy.control.body'])}
${articleSection('choices', 'legal.choices.title', ['legal.choices.body'])}
${articleSection('children', 'legal.children.title', ['legal.children.body'])}
${articleSection('international', 'legal.international.title', ['legal.international.body'])}
${articleSection('third-party', 'legal.third.title', ['legal.third.body'], `${link('sdklist.html', 'nav.sdk', 'text-link')}<ul class="reference-links"><li>${link('https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement', 'privacy.github')}</li><li>${link('https://developer.android.com/identity/data/autobackup', 'privacy.android')}</li><li>${link('https://support.apple.com/en-us/108770', 'privacy.apple')}</li></ul>`)}
${articleSection('updates', 'legal.updates.title', ['legal.updates.body'])}
${articleSection('contact', 'legal.contact.title', ['legal.contact.body'], '<a class="text-link email-link" href="mailto:deqiutseng@gmail.com">deqiutseng@gmail.com</a>')}
</article></main>`;
const providers = {
  'Material Components': 'Google', 'SmartRefreshLayout (kernel, footer)': 'scwang90 / SmartRefreshLayout contributors', 'Lottie Android': 'Airbnb',
  'KTVHTTPCache': 'ChangbaDevs', 'CocoaAsyncSocket': 'Robbie Hanson / CocoaAsyncSocket contributors', 'MJRefresh': 'CoderMJLee', 'PagerTabStripView': 'Xmartlabs',
  'IQKeyboardManagerSwift (Core, Resign)': 'hackiftekhar', 'IQKeyboardCore': 'hackiftekhar', 'IQKeyboardNotification': 'hackiftekhar', 'IQTextInputViewNotification': 'hackiftekhar'
};
const sdkEntries = (platform) => `<section class="component-group" id="${platform}">${h2(`sdk.${platform}`)}${components[platform].map(([name, version, purpose, url]) => {
  const category = ['playback', 'cache', 'socket'].includes(purpose) ? 'media' : ['storage', 'settings', 'keyboard'].includes(purpose) ? purpose : 'ui';
  const field = (label, value) => `<div>${el('dt', `sdk.${label}`)}<dd>${value}</dd></div>`;
  return `<section class="sdk-entry"><h3>${escape(name)}</h3><dl>${field('component', escape(name))}${field('provider', escape(providers[name] ?? 'Google / Android Open Source Project'))}${field('version', escape(version))}${field('purpose', el('span', `purpose.${purpose}`))}${field('scenario', el('span', `sdk.scene.${category}`))}${field('sharing', el('span', `sdk.sharing.${category === 'media' ? 'media' : 'local'}`))}${field('data', el('span', `sdk.data.${category}`))}${field('client', platform === 'android' ? 'Android' : 'iOS')}${field('official', `<a href="${url}" rel="noreferrer">${escape(url)}</a>`)}</dl></section>`;
}).join('')}</section>`;
const sdk = () => `<main id="main">${pageHead('sdk', 'sdk.date')}<article class="shell legal-article component-body"><div class="component-intro">${p('sdk.intro')}${p('sdk.behavior')}</div>${sdkEntries('android')}${sdkEntries('ios')}${articleSection('system', 'sdk.system.title', ['sdk.system.body', 'sdk.contact'], '<a class="text-link email-link" href="mailto:deqiutseng@gmail.com">deqiutseng@gmail.com</a>')}</article></main>`;

await mkdir(`${root}/assets`, { recursive: true });
for (const [page, render] of Object.entries({ home, support, privacy, sdk })) {
  const file = pageNames[page];
  const canonical = `https://deqiutseng.github.io/AurodyWeb/${page === 'home' ? '' : file}`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#071014"><meta name="referrer" content="no-referrer"><meta name="description" content="${text(`desc.${page}`)}"><meta name="robots" content="index,follow"><title>${text(`meta.${page}`)}</title><link rel="canonical" href="${canonical}"><link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon.png"><link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png"><meta property="og:type" content="website"><meta property="og:site_name" content="Aurody"><meta property="og:title" content="${text(`meta.${page}`)}"><meta property="og:description" content="${text(`desc.${page}`)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://deqiutseng.github.io/AurodyWeb/assets/images/share.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${text(`meta.${page}`)}"><meta name="twitter:description" content="${text(`desc.${page}`)}"><meta name="twitter:image" content="https://deqiutseng.github.io/AurodyWeb/assets/images/share.png"><link rel="stylesheet" href="assets/site.css"><script type="module" src="assets/site.mjs"></script></head>
<body data-page="${page}"${['privacy', 'sdk'].includes(page) ? ' class="document-page"' : ''}>${nav(page)}${render()}${footer()}</body></html>\n`;
  await writeFile(`${root}/${file}`, html);
}
console.log('Rendered four readable static pages. No dependency installation required.');
