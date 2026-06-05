(function() {
  'use strict';

  const TN = {};

  TN.hasStableLocator = function(el) {
    return !!(el.dataset.testid || el.dataset.cy);
  };

  TN.hasRoleOrAriaLabel = function(el) {
    return !!(el.getAttribute('role') || el.getAttribute('aria-label'));
  };

  TN.isTextBlock = function(el) {
    const text = (el.innerText || el.textContent || '').trim();
    if (text.length < 1) return false;

    const isLeaf = !el.children || el.children.length === 0;
    if (isLeaf) return true;

    const textTags = ['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'LABEL', 'B', 'STRONG', 'I', 'EM', 'SMALL', 'SUB', 'SUP', 'CODE', 'PRE'];
    if (textTags.includes(el.tagName)) return true;

    if (text.length > 500) return false;
    const rect = el.getBoundingClientRect();
    const vpArea = window.innerWidth * window.innerHeight;
    return vpArea === 0 || (rect.width * rect.height) / vpArea < 0.6;
  };

  TN.isCardContainer = function(el) {
    if (el === document.body || el === document.documentElement) return false;
    const cs = getComputedStyle(el);
    const hasBorder = cs.borderStyle !== 'none' && cs.borderWidth !== '0px' && cs.borderColor !== 'rgba(0, 0, 0, 0)';
    const hasBg = cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    const hasShadow = cs.boxShadow && cs.boxShadow !== 'none';
    const hasData = el.dataset && Object.keys(el.dataset).length > 0;
    const hasRole = el.getAttribute('role');
    if (!hasBorder && !hasBg && !hasShadow && !hasData && !hasRole) return false;
    const rect = el.getBoundingClientRect();
    const vpArea = window.innerWidth * window.innerHeight;
    return vpArea === 0 || (rect.width * rect.height) / vpArea <= 0.7;
  };

  TN.findRepeatedCardAncestor = function(el) {
    let cur = el;
    while (cur && cur !== document.body) {
      const parent = cur.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (c) => c.tagName === cur.tagName && c.className === cur.className
        );
        if (siblings.length >= 2) return cur;
      }
      cur = parent;
    }
    return null;
  };

  TN.normalizeTarget = function(el) {
    if (!el || el === document.documentElement || el === document.body) return el;

    const directMeaningful = ['IMG', 'INPUT', 'BUTTON', 'A', 'TEXTAREA', 'SELECT'];
    let meaningfulAncestor = el;
    while (meaningfulAncestor && meaningfulAncestor !== document.body && meaningfulAncestor !== document.documentElement) {
      if (directMeaningful.includes(meaningfulAncestor.tagName)) {
        return meaningfulAncestor;
      }
      meaningfulAncestor = meaningfulAncestor.parentElement;
    }

    let best = null;
    let cur = el;

    while (cur && cur !== document.body && cur !== document.documentElement) {
      if (TN.hasStableLocator(cur)) { best = cur; break; }
      if (TN.hasRoleOrAriaLabel(cur)) { best = cur; break; }
      if (TN.isTextBlock(cur)) { best = cur; break; }
      if (TN.isCardContainer(cur)) { best = cur; break; }
      cur = cur.parentElement;
    }

    if (best) {
      const isExplicitText = TN.hasStableLocator(best) || TN.hasRoleOrAriaLabel(best) || TN.isTextBlock(best);
      if (!isExplicitText) {
        const repeatedCard = TN.findRepeatedCardAncestor(best);
        if (repeatedCard) return repeatedCard;
      }
      return best;
    }

    const rect = el.getBoundingClientRect();
    const vpArea = window.innerWidth * window.innerHeight;
    if (vpArea > 0 && (rect.width * rect.height) / vpArea > 0.8) {
      return el;
    }

    return el;
  };

  window.normalizeTarget = TN.normalizeTarget;
})();
