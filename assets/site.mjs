import { copy } from './content.mjs';

const storageKey = 'aurody.website.language';
export function supportedLanguage(locale) {
  const tag = String(locale ?? '').toLowerCase().replaceAll('_', '-');
  if (tag === 'en' || tag.startsWith('en-')) return 'en';
  if (tag === 'zh' || tag.startsWith('zh-')) {
    if (tag.split('-').includes('hans')) return 'zh-Hans';
    if (tag.split('-').includes('hant')) return 'zh-Hant';
    return /(?:^|-)(tw|hk|mo)(?:-|$)/.test(tag) ? 'zh-Hant' : 'zh-Hans';
  }
  return null;
}

export function chooseLanguage({ explicit, saved, languages = [] } = {}) {
  if (Object.hasOwn(copy, explicit)) return explicit;
  if (Object.hasOwn(copy, saved)) return saved;
  return languages.map(supportedLanguage).find(Boolean) ?? 'en';
}

export function readPreference() {
  try { return localStorage.getItem(storageKey); } catch { return null; }
}

export function savePreference(language) {
  try { localStorage.setItem(storageKey, language); } catch { /* The URL also preserves manual choice. */ }
}

function applyLanguage(lang) {
  const dict = copy[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = dict[node.dataset.i18n];
  });
  for (const [attribute, dataset] of [['aria-label', 'i18nAria'], ['alt', 'i18nAlt']]) {
    document.querySelectorAll(`[data-${dataset === 'i18nAria' ? 'i18n-aria' : 'i18n-alt'}]`).forEach(node => {
      node.setAttribute(attribute, dict[node.dataset[dataset]]);
    });
  }
  const page = document.body.dataset.page;
  document.title = dict[`meta.${page}`];
  const metadata = {
    'meta[name="description"]': dict[`desc.${page}`],
    'meta[property="og:title"]': dict[`meta.${page}`],
    'meta[property="og:description"]': dict[`desc.${page}`],
    'meta[name="twitter:title"]': dict[`meta.${page}`],
    'meta[name="twitter:description"]': dict[`desc.${page}`]
  };
  Object.entries(metadata).forEach(([selector, value]) => document.querySelector(selector).setAttribute('content', value));
  document.querySelectorAll('a[href]').forEach(anchor => {
    const original = anchor.getAttribute('href');
    if (original.startsWith('#')) return;
    const url = new URL(original, location.href);
    if (url.origin === location.origin && /\/(?:index|support|privacy|sdklist)\.html$/.test(url.pathname)) {
      url.searchParams.set('lang', lang);
      anchor.setAttribute('href', url.pathname.split('/').at(-1) + url.search + url.hash);
    }
  });
  document.querySelector('#language').value = lang;
}

if (typeof document !== 'undefined') {
  const explicit = new URL(location.href).searchParams.get('lang');
  const language = chooseLanguage({ explicit, saved: readPreference(), languages: navigator.languages?.length ? navigator.languages : [navigator.language] });
  applyLanguage(language);
  document.querySelector('.language').hidden = false;
  document.querySelector('#language').addEventListener('change', event => {
    const chosen = event.target.value;
    applyLanguage(chosen);
    savePreference(chosen);
    const url = new URL(location.href);
    url.searchParams.set('lang', chosen);
    history.replaceState(null, '', url);
  });
}
