/* =============================================================
   i18n.js — minimal language toggle
   - Reads JSON translation file
   - Swaps content of elements with [data-i18n="key.path"]
   - Persists choice in localStorage
   - No frameworks required
============================================================= */

(function () {
  'use strict';

  const STORAGE_KEY = 'fmrr.lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'es'];

  // Resolve a dotted key like "home.tagline" against an object
  function resolveKey(obj, keyPath) {
    return keyPath.split('.').reduce(function (acc, part) {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return null;
    }, obj);
  }

  // Apply translations to all elements with data-i18n
  function applyTranslations(dict) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const value = resolveKey(dict, key);
      if (value !== null && value !== undefined) {
        el.innerHTML = value;
      }
    });

    // Update <html lang="...">
    if (dict && dict.meta && dict.meta.lang) {
      document.documentElement.setAttribute('lang', dict.meta.lang);
    }

    // Update <title> using a special data-i18n-title attribute on <body>
    const body = document.body;
    const titleKey = body && body.getAttribute('data-i18n-title');
    if (titleKey) {
      const titleValue = resolveKey(dict, titleKey);
      if (titleValue) {
        document.title = titleValue;
      }
    }
  }

  // Update the active state on toggle buttons
  function updateToggleUI(lang) {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      const btnLang = btn.getAttribute('data-lang-btn');
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Load a language JSON file and apply it
  function loadAndApply(lang) {
    document.body.classList.add('lang-switching');

    return fetch('/i18n/' + lang + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load ' + lang);
        return r.json();
      })
      .then(function (dict) {
        applyTranslations(dict);
        updateToggleUI(lang);
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
        // Allow the transition to play
        setTimeout(function () {
          document.body.classList.remove('lang-switching');
        }, 80);
      })
      .catch(function (err) {
        console.warn('i18n: ' + err.message);
        document.body.classList.remove('lang-switching');
      });
  }

  // Determine the language to start with
  function detectInitialLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {}

    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(browser) !== -1) return browser;

    return DEFAULT_LANG;
  }

  // Initialize on DOM ready
  function init() {
    const initial = detectInitialLang();
    loadAndApply(initial);

    // Wire up toggle buttons
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const lang = btn.getAttribute('data-lang-btn');
        if (lang && SUPPORTED.indexOf(lang) !== -1) {
          loadAndApply(lang);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
