(function() {
  'use strict';

  const AFB = window.AFB = window.AFB || {};
  const SG = {};

  const UTILITY_CLASS_RE = /^(p|m|w|h|min|max|flex|grid|gap|text|font|bg|border|rounded|shadow|opacity|overflow|absolute|relative|fixed|sticky|inline|block|hidden|visible|cursor|transition|duration|ease|delay|animate|transform|origin|scale|rotate|translate|skew|space|divide|self|place|items|content|order|grow|shrink|basis|col|row|auto|top|right|bottom|left|z)-/;
  const RESPONSIVE_RE = /^(sm|md|lg|xl|2xl):/;
  const STATE_RE = /^(hover|focus|active|visited|disabled|group-hover|dark):/;
  const CSS_MODULE_HASH_RE = /_[a-zA-Z0-9]{5,8}$/;

  function normalizeClassName(c) {
    if (!c) return '';
    const parts = c.split(':');
    const base = parts[parts.length - 1];
    const hasVariant = parts.length > 1 || RESPONSIVE_RE.test(c) || STATE_RE.test(c);

    if (UTILITY_CLASS_RE.test(base)) return '';
    if (hasVariant) return '';
    if (/^[a-z]$/.test(base)) return '';
    if (/^\d/.test(base)) return '';

    const withoutHash = base.replace(CSS_MODULE_HASH_RE, '');
    return withoutHash || base;
  }

  SG.isUnique = function(selector) {
    try {
      return document.querySelectorAll(selector).length === 1;
    } catch {
      return false;
    }
  };

  SG.getMeaningfulClasses = function(el) {
    if (!el.className || typeof el.className !== 'string') return [];
    const classes = [];
    const seen = new Set();

    el.className.split(/\s+/).forEach((c) => {
      const normalized = normalizeClassName(c);
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      classes.push(normalized);
    });

    return classes;
  };

  SG.buildStructuralPath = function(el) {
    const parts = [];
    let cur = el;
    while (cur && cur !== document.body && cur !== document.documentElement) {
      const tag = cur.tagName.toLowerCase();
      const parent = cur.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((c) => c.tagName === cur.tagName);
        if (siblings.length > 1) {
          const idx = siblings.indexOf(cur) + 1;
          parts.unshift(`${tag}:nth-of-type(${idx})`);
        } else {
          parts.unshift(tag);
        }
      } else {
        parts.unshift(tag);
      }
      cur = parent;
    }
    return parts.join(' > ');
  };

  SG.generateSelector = function(el) {
    if (el.dataset.testid) {
      const s = `[data-testid="${CSS.escape(el.dataset.testid)}"]`;
      if (SG.isUnique(s)) return s;
    }

    if (el.dataset.cy) {
      const s = `[data-cy="${CSS.escape(el.dataset.cy)}"]`;
      if (SG.isUnique(s)) return s;
    }

    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) {
      const s = `${el.tagName.toLowerCase()}[aria-label="${CSS.escape(ariaLabel)}"]`;
      if (SG.isUnique(s)) return s;
    }

    const role = el.getAttribute('role');
    if (role && ariaLabel) {
      const s = `[role="${CSS.escape(role)}"][aria-label="${CSS.escape(ariaLabel)}"]`;
      if (SG.isUnique(s)) return s;
    }

    if (el.id) {
      const s = `#${CSS.escape(el.id)}`;
      if (SG.isUnique(s)) return s;
    }

    const meaningfulClasses = SG.getMeaningfulClasses(el);
    if (meaningfulClasses.length > 0) {
      const classSelector = meaningfulClasses.map((c) => `.${CSS.escape(c)}`).join('');
      const s = `${el.tagName.toLowerCase()}${classSelector}`;
      if (SG.isUnique(s)) return s;

      if (el.parentElement) {
        const siblings = Array.from(el.parentElement.children).filter((c) => c.tagName === el.tagName);
        if (siblings.length > 1) {
          const idx = siblings.indexOf(el) + 1;
          const sw = `${s}:nth-of-type(${idx})`;
          if (SG.isUnique(sw)) return sw;
        }
      }
    }

    return SG.buildStructuralPath(el);
  };

  SG.querySelectorSafe = function(selector) {
    try {
      return document.querySelector(selector);
    } catch {
      return null;
    }
  };

  AFB.selectorGenerator = SG;
})();
