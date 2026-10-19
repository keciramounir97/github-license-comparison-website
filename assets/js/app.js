/**
 * OpenLicense & Git Hub Suite - Core Application Engine
 * Native i18n Engine (7 Languages), Theme Manager (Light/Dark), and Interactive Controls
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Constants and State
  // -------------------------------------------------------------------------
  const SUPPORTED_LANGUAGES = ['ar', 'en', 'fr', 'es', 'ru', 'it', 'de'];
  const DEFAULT_LANGUAGE = 'en';
  const RTL_LANGUAGES = ['ar'];

  const STORAGE_KEYS = {
    THEME: 'openlicense_theme',
    LANG: 'openlicense_lang'
  };

  // In-memory cache for fetched translation dictionaries
  const translationsCache = {};

  // Current application state
  const state = {
    currentLang: DEFAULT_LANGUAGE,
    currentTheme: 'light',
    activeFilter: 'all',
    searchQuery: ''
  };

  // -------------------------------------------------------------------------
  // 2. DOM Elements Selection
  // -------------------------------------------------------------------------
  const elements = {
    html: document.documentElement,
    languageSwitcher: document.getElementById('language-switcher'),
    themeToggle: document.getElementById('theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    searchInput: document.getElementById('search-input'),
    licenseCards: document.querySelectorAll('.license-card'),
    copyButtons: document.querySelectorAll('.copy-btn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
  };

  // -------------------------------------------------------------------------
  // 3. i18n Engine (Asynchronous Fetch & Dynamic Injection)
  // -------------------------------------------------------------------------

  /**
   * Detects preferred language from localStorage or browser navigator
   * @returns {string} Two-letter ISO language code
   */
  function detectInitialLanguage() {
    const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
      return savedLang;
    }

    const browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }

    return DEFAULT_LANGUAGE;
  }

  /**
   * Fetches the JSON translation dictionary for a specific language
   * @param {string} lang
   * @returns {Promise<Object>}
   */
  async function loadTranslation(lang) {
    if (translationsCache[lang]) {
      return translationsCache[lang];
    }

    try {
      const response = await fetch(`./locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translation file for ${lang} (${response.status})`);
      }
      const data = await response.json();
      translationsCache[lang] = data;
      return data;
    } catch (error) {
      console.warn(`[i18n] Fallback to default (${DEFAULT_LANGUAGE}) due to error:`, error);
      if (lang !== DEFAULT_LANGUAGE) {
        return loadTranslation(DEFAULT_LANGUAGE);
      }
      return {};
    }
  }

  /**
   * Applies the translations to the DOM elements with data-i18n attributes
   * @param {string} lang
   */
  async function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      lang = DEFAULT_LANGUAGE;
    }

    state.currentLang = lang;
    localStorage.setItem(STORAGE_KEYS.LANG, lang);

    // Sync select dropdown
    if (elements.languageSwitcher && elements.languageSwitcher.value !== lang) {
      elements.languageSwitcher.value = lang;
    }

    // Set document direction and language attribute
    const isRTL = RTL_LANGUAGES.includes(lang);
    elements.html.setAttribute('lang', lang);
    elements.html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    // Fetch translation bundle
    const translations = await loadTranslation(lang);

    // Update text content of data-i18n nodes
    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Update placeholder attributes of data-i18n-placeholder nodes
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        el.setAttribute('placeholder', translations[key]);
      }
    });

    // Update title attributes of data-i18n-title nodes
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (translations[key]) {
        el.setAttribute('title', translations[key]);
      }
    });

    // Update document title if key exists
    if (translations.app_title) {
      document.title = `${translations.app_title} | ${translations.app_tagline || ''}`;
    }
  }

  // -------------------------------------------------------------------------
  // 4. Theme Manager (Light & Dark Theme with Storage & System Sync)
  // -------------------------------------------------------------------------

  /**
   * Detects the initial theme preference
   * @returns {'light'|'dark'}
   */
  function detectInitialTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Applies the theme to <html> and updates the toggle button icon
   * @param {'light'|'dark'} theme
   */
  function setTheme(theme) {
    state.currentTheme = theme;
    elements.html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    if (elements.themeIcon) {
      if (theme === 'dark') {
        // Sun icon for switching back to light
        elements.themeIcon.innerHTML = `
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        `;
        elements.themeToggle.setAttribute('aria-label', 'Switch to Light Theme');
      } else {
        // Moon icon for switching to dark
        elements.themeIcon.innerHTML = `
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        `;
        elements.themeToggle.setAttribute('aria-label', 'Switch to Dark Theme');
      }
    }
  }

  function toggleTheme() {
    const nextTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }

  // -------------------------------------------------------------------------
  // 5. Interactive Matrix Filters & Real-Time Search
  // -------------------------------------------------------------------------

  function filterLicenses() {
    const query = state.searchQuery.toLowerCase().trim();
    const filter = state.activeFilter;

    elements.licenseCards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const name = (card.querySelector('.license-card-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.license-card-desc')?.textContent || '').toLowerCase();
      const spdx = (card.querySelector('.spdx-id')?.textContent || '').toLowerCase();

      const matchesCategory = filter === 'all' || category === filter;
      const matchesSearch = !query || name.includes(query) || desc.includes(query) || spdx.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. Toast Notification & Clipboard Helper
  // -------------------------------------------------------------------------

  let toastTimeout = null;
  function showToast(message) {
    if (!elements.toast) return;

    if (elements.toastMessage) {
      elements.toastMessage.textContent = message;
    }

    elements.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2800);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      const dict = translationsCache[state.currentLang] || {};
      showToast(dict.copied_toast || 'Copied to clipboard!');
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  }

  // -------------------------------------------------------------------------
  // 7. Event Listeners Initialization
  // -------------------------------------------------------------------------

  function initEventListeners() {
    // Language Switcher Dropdown
    if (elements.languageSwitcher) {
      elements.languageSwitcher.addEventListener('change', (e) => {
        setLanguage(e.target.value);
      });
    }

    // Theme Toggle Button
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen to OS system color-scheme changes if not overridden
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (!savedTheme) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Filter Buttons (All, Permissive, Copyleft, Public Domain)
    elements.filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        elements.filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeFilter = btn.getAttribute('data-filter') || 'all';
        filterLicenses();
      });
    });

    // Search Input Real-Time Filter
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        filterLicenses();
      });
    }

    // Copy Buttons (Terminal code & SPDX identifiers)
    elements.copyButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy-target');
        let textToCopy = '';

        if (targetId) {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            textToCopy = targetEl.innerText || targetEl.textContent;
          }
        } else if (btn.getAttribute('data-copy-text')) {
          textToCopy = btn.getAttribute('data-copy-text');
        }

        if (textToCopy) {
          copyToClipboard(textToCopy.trim());
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 8. Application Bootstrap
  // -------------------------------------------------------------------------

  async function init() {
    // 1. Initialize Theme
    const initialTheme = detectInitialTheme();
    setTheme(initialTheme);

    // 2. Attach Event Listeners
    initEventListeners();

    // 3. Initialize Language
    const initialLang = detectInitialLanguage();
    await setLanguage(initialLang);
  }

  // Execute on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
