# OpenLicense & Git Hub Suite

> Production-Ready Multilingual (i18n), Themeable Web Architecture & Exhaustive Git DevOps Guide.

## Overview

This project is an advanced, production-grade web application and reference guide designed with:
- **Decoupled Architecture**: Semantic HTML5, pure CSS3 (custom properties, light/dark themes, RTL support), and native ES6+ vanilla JavaScript i18n engine.
- **7 Native Locales**: Arabic (`ar` with native RTL layout & typography), English (`en`), French (`fr`), Spanish (`es`), Russian (`ru`), Italian (`it`), and German (`de`).
- **DevOps Git Guide**: Comprehensive step-by-step CLI setup, in-depth Public vs Private repository analysis, and an encyclopedic review of `.gitignore` templates from ActionScript & Ada to modern ecosystems.

---

## Project Structure

```text
github-license-comparion-website/
│
├── index.html                  # Semantic HTML5 structure with data-i18n tags
├── GIT_DEVOPS_GUIDE.md         # Exhaustive DevOps Git & GitHub technical manual
├── .gitignore                  # Production-grade frontend exclusion rules
├── README.md                   # Repository documentation
├── assets/
│   ├── css/
│   │   └── style.css           # Vanilla CSS design system, dark mode & RTL
│   └── js/
│       └── app.js              # Native i18n engine, theme manager & filters
└── locales/
    ├── ar.json                 # Arabic (Native RTL)
    ├── en.json                 # English
    ├── fr.json                 # French
    ├── es.json                 # Spanish
    ├── ru.json                 # Russian
    ├── it.json                 # Italian
    └── de.json                 # German
```

---

## Features

1. **Native i18n Engine (No External Dependencies)**:
   - Dynamic asynchronous dictionary loading via `fetch()`.
   - Automatic browser language detection with fallback.
   - Dynamic document direction (`dir="rtl"`) and `lang` attribute switching for Arabic.
   - User preference persistence in `localStorage`.

2. **Complete Theme Manager**:
   - Seamless toggling between light (`#ffffff` / `#0f172a`) and dark (`#07090e` / `#f0f6fc`) modes.
   - Automatic sync with OS system preference (`prefers-color-scheme`).
   - Preference persistence in `localStorage`.

3. **Interactive Software Licenses Matrix**:
   - Real-time search and category filtering (`All`, `Permissive`, `Copyleft`, `Public Domain`).
   - Detailed permissions, conditions, and limitations breakdown.
   - One-click copy for SPDX identifiers with toast notifications.

4. **DevOps Git & GitHub Guide**:
   - See [GIT_DEVOPS_GUIDE.md](GIT_DEVOPS_GUIDE.md) for full documentation.

---

## License

This project is open-source under the [MIT License](https://opensource.org/licenses/MIT).
