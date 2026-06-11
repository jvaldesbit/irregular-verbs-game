import type { Lang } from './translations';
import { translations } from './translations';

const KEY = 'verbGame_lang';

function detect(): Lang {
  const nav = (navigator.language || 'en').split('-')[0].toLowerCase();
  return nav === 'es' ? 'es' : 'en';
}

export function getLang(): Lang {
  const v = localStorage.getItem(KEY) as Lang | null;
  return v === 'en' || v === 'es' ? v : detect();
}

export function setLang(lang: Lang): void {
  localStorage.setItem(KEY, lang);
  applyI18n();
}

export function t(key: string): string {
  const lang = getLang();
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function applyI18n(): void {
  const lang = getLang();
  const d = translations[lang] ?? translations.en;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')!;
    if (d[key] !== undefined) el.textContent = d[key];
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html')!;
    if (d[key] !== undefined) el.innerHTML = d[key];
  });

  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')!;
    if (d[key] !== undefined) el.placeholder = d[key];
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title')!;
    if (d[key] !== undefined) el.title = d[key];
  });

  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang;
}
