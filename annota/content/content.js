(() => {
  'use strict';

  const ChromeAdapters = window.ChromeAdapters;
  const { normalizeTarget, pageKey, getMeaningfulClasses } = window;

  const HOST_ID = '__annota-root__';
  const MAX_Z = '2147483647';
  const MUTATION_DEBOUNCE_MS = 500;

  const state = {
    shadowHost: null,
    shadowRoot: null,
    topBar: null,
    hoverHighlight: null,
    popover: null,
    badgeContainer: null,
    noticeEl: null,
    pickMode: false,
    currentTarget: null,
    annotations: [],
    pageKey: '',
    currentPagePath: '',
    openPopoverAnnotationId: null,
    retryMap: new Map(),
    mutationTimer: null,
    lastUrl: location.href,
    badgePositions: [],
  };

  let _selfWritePending = 0;

  let popoverManager, badgeRenderer, annotationStore, staleValidator, spaDetector;

  // ── Shadow DOM ──

  function getTokenDefinitions() {
    return window.shadowTokens();
  }

  function createShadowDOM() {
    if (state.shadowHost && document.documentElement.contains(state.shadowHost)) return;

    state.shadowHost = document.createElement('div');
    state.shadowHost.id = HOST_ID;
    state.shadowHost.style.cssText = `all:initial;position:fixed;z-index:${MAX_Z};top:0;left:0;width:0;height:0;pointer-events:none;`;
    state.shadowRoot = state.shadowHost.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = getStyles();
    state.shadowRoot.appendChild(style);

    state.topBar = document.createElement('div');
    state.topBar.className = 'annota-topbar';
    state.topBar.style.display = 'none';
    state.topBar.innerHTML = `
      <span class="annota-topbar-label">Pick element</span>
      <span class="annota-topbar-count" style="display:none"></span>
      <button class="annota-topbar-exit">Exit</button>
    `;
    state.topBar.querySelector('.annota-topbar-exit').addEventListener('click', stopPick);
    state.shadowRoot.appendChild(state.topBar);

    state.hoverHighlight = document.createElement('div');
    state.hoverHighlight.className = 'annota-highlight';
    state.hoverHighlight.style.display = 'none';
    state.shadowRoot.appendChild(state.hoverHighlight);

    state.popover = document.createElement('div');
    state.popover.className = 'annota-popover';
    state.popover.style.display = 'none';
    state.popover.addEventListener('mousedown', (e) => e.stopPropagation());
    state.popover.addEventListener('click', (e) => e.stopPropagation());
    state.shadowRoot.appendChild(state.popover);

    state.badgeContainer = document.createElement('div');
    state.badgeContainer.className = 'annota-badges';
    state.shadowRoot.appendChild(state.badgeContainer);

    state.noticeEl = document.createElement('div');
    state.noticeEl.className = 'annota-notice';
    state.noticeEl.style.display = 'none';
    state.shadowRoot.appendChild(state.noticeEl);

    document.documentElement.appendChild(state.shadowHost);
  }

  function getStyles() {
    return getTokenDefinitions() + `
      :host { all: initial; position: fixed; z-index: ${MAX_Z}; top: 0; left: 0; width: 0; height: 0; pointer-events: none; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .annota-topbar {
        position: fixed; top: 12px; right: 12px; z-index: ${MAX_Z};
        display: inline-flex; align-items: center; gap: 10px;
        padding: var(--annota-space-sm) var(--annota-space-lg);
        background: var(--annota-surface); border: 1px solid var(--annota-border); border-radius: var(--annota-radius-lg);
        box-shadow: var(--annota-shadow-sm);
        font: var(--annota-font-size-base)/1.4 var(--annota-font-stack);
        color: var(--annota-text); pointer-events: auto; white-space: nowrap;
        opacity: 0.95; transition: opacity 150ms ease;
      }
      .annota-topbar:hover { opacity: 1; }
      .annota-topbar-label { flex: 0 0 auto; }
      .annota-topbar-count {
        font-size: var(--annota-font-size-xs); background: var(--annota-accent); color: var(--annota-text-inverted);
        padding: var(--annota-space-2xs) var(--annota-space-md); border-radius: 10px; flex-shrink: 0;
      }
      .annota-topbar-exit {
        background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border);
        padding: var(--annota-space-xs) var(--annota-space-lg); border-radius: var(--annota-radius-xs); cursor: pointer; font: inherit; font-size: var(--annota-font-size-sm);
      }
      .annota-topbar-exit:hover { background: var(--annota-surface-hover); }
      .annota-topbar-exit:focus-visible { outline: 2px solid var(--annota-accent); outline-offset: 2px; }
      .annota-highlight {
        position: fixed; z-index: ${MAX_Z}; pointer-events: none;
        border: 2px solid var(--annota-accent); background: var(--annota-accent-tint);
        border-radius: var(--annota-radius-2xs); transition: all 60ms ease;
      }
      .annota-popover {
        position: fixed; z-index: ${MAX_Z}; pointer-events: auto;
        width: ${window.POPOVER_WIDTH}px; max-width: calc(100vw - 24px);
        background: var(--annota-surface); border: 1px solid var(--annota-border); border-radius: var(--annota-radius-lg);
        box-shadow: var(--annota-shadow-md);
        font: var(--annota-font-size-base)/1.4 var(--annota-font-stack);
        color: var(--annota-text);
        transform: scale(0.95); opacity: 0;
        transition: transform 120ms ease, opacity 120ms ease;
      }
      .annota-popover.annota-popover-open { transform: scale(1); opacity: 1; }
      .annota-popover.annota-popover-instant { transition: none; }
      @media (prefers-reduced-motion: reduce) {
        .annota-popover { transition: none; }
        .annota-highlight { transition: none; }
      }
      .annota-popover-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 10px var(--annota-space-lg); border-bottom: 1px solid var(--annota-border);
      }
      .annota-popover-title { font-size: var(--annota-font-size-sm); color: var(--annota-text-muted); }
      .annota-popover-close {
        background: none; border: none; color: var(--annota-text-muted); cursor: pointer;
        font-size: 16px; line-height: 1; padding: var(--annota-space-2xs) var(--annota-space-xs);
      }
      .annota-popover-close:hover { color: var(--annota-text); }
      .annota-popover-close:focus-visible { outline: 2px solid var(--annota-accent); }
      .annota-popover-body { padding: var(--annota-space-lg); }
      .annota-popover-textarea {
        width: 100%; min-height: 36px; max-height: 200px; resize: none;
        background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border);
        border-radius: var(--annota-radius-md); padding: var(--annota-space-md); font: inherit; font-size: var(--annota-font-size-base);
        line-height: 1.5; overflow: hidden; scrollbar-width: none;
      }
      .annota-popover-textarea:focus { outline: none; border-color: var(--annota-accent); }
      .annota-popover-existing {
        font-size: var(--annota-font-size-sm); color: var(--annota-text-secondary); white-space: pre-wrap;
        word-break: break-word; padding: var(--annota-space-xs) 0;
      }
      .annota-popover-footer {
        display: flex; align-items: center; justify-content: flex-end; gap: var(--annota-space-md);
        padding: 10px var(--annota-space-lg); border-top: 1px solid var(--annota-border);
      }
      .annota-popover-error {
        font-size: var(--annota-font-size-sm); color: var(--annota-error); margin-right: auto;
      }
      .annota-btn {
        padding: var(--annota-space-sm) 14px; border: none; border-radius: var(--annota-radius-sm);
        font: inherit; font-size: var(--annota-font-size-sm); font-weight: 500; cursor: pointer;
      }
      .annota-btn:focus-visible { outline: 2px solid var(--annota-accent); outline-offset: 2px; }
      .annota-btn-primary { background: var(--annota-accent); color: var(--annota-text-inverted); }
      .annota-btn-primary:hover { background: var(--annota-accent-hover); }
      .annota-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      .annota-btn-secondary { background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border); }
      .annota-btn-secondary:hover { background: var(--annota-surface-hover); }
      .annota-btn-danger { background: none; color: var(--annota-danger); }
      .annota-btn-danger:hover { background: var(--annota-danger-tint); }
      .annota-btn-saved { background: var(--annota-success); color: var(--annota-text-inverted); }
      .annota-badge {
        position: fixed; z-index: ${MAX_Z}; pointer-events: auto;
        width: ${window.BADGE_SIZE}px; height: ${window.BADGE_SIZE}px; border-radius: 50%;
        background: var(--annota-accent); color: var(--annota-text-inverted);
        font: 600 var(--annota-font-size-xs)/1 var(--annota-font-stack);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: var(--annota-shadow-xs);
      }
      .annota-badge:hover { background: var(--annota-accent-hover); }
      .annota-notice {
        position: fixed; bottom: var(--annota-space-lg); left: 50%; transform: translateX(-50%);
        z-index: ${MAX_Z}; pointer-events: auto;
        background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border);
        padding: var(--annota-space-md) var(--annota-space-xl); border-radius: var(--annota-radius-md);
        font: var(--annota-font-size-sm)/1.4 var(--annota-font-stack);
        box-shadow: var(--annota-shadow-sm);
        opacity: 0; transition: opacity 200ms ease;
      }
      .annota-notice.annota-notice-visible { opacity: 1; }
    `;
  }

  function watchHostRemoval() {
    const observer = new MutationObserver(() => {
      if (!document.documentElement.contains(state.shadowHost)) {
        createShadowDOM();
        badgeRenderer.renderBadges();
        if (state.pickMode) showTopBar();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  }

  // ── Notice ──

  function showNotice(text) {
    state.noticeEl.textContent = text;
    state.noticeEl.style.display = 'block';
    requestAnimationFrame(() => state.noticeEl.classList.add('annota-notice-visible'));
    setTimeout(() => {
      state.noticeEl.classList.remove('annota-notice-visible');
      setTimeout(() => {
        state.noticeEl.style.display = 'none';
      }, 200);
    }, 3000);
  }

  // ── Top Bar ──

  function showTopBar() {
    state.topBar.style.display = 'flex';
    updateTopBarCount();
  }

  function hideTopBar() {
    state.topBar.style.display = 'none';
  }

  function updateTopBarCount() {
    const countEl = state.topBar.querySelector('.annota-topbar-count');
    if (state.annotations.length > 0) {
      countEl.textContent = state.annotations.length;
      countEl.style.display = '';
    } else {
      countEl.style.display = 'none';
    }
  }

  function syncUI() {
    updateTopBarCount();
    badgeRenderer.renderBadges();
    ChromeAdapters.messaging.sendToBackground({ type: 'ANNOTATIONS_CHANGED' });
  }

  // ── Metadata Extraction ──

  function getElementText(el) {
    const al = el.getAttribute('aria-label');
    if (al) return al.trim();
    if (el.placeholder) return el.placeholder.trim().slice(0, 100);
    if (el.value !== undefined && el.value !== '') return String(el.value).trim().slice(0, 100);
    if (el.alt) return el.alt.trim();
    if (el.title) return el.title.trim();
    const text = (el.innerText || '').trim();
    return text.slice(0, 100);
  }

  function getLocatorHint(el) {
    if (el.dataset.testid) return `data-testid="${el.dataset.testid}"`;
    if (el.dataset.cy) return `data-cy="${el.dataset.cy}"`;
    const al = el.getAttribute('aria-label');
    if (al) return `aria-label="${al}"`;
    const role = el.getAttribute('role');
    if (role) {
      const labelledBy = el.getAttribute('aria-labelledby');
      const rn = al || (labelledBy && document.getElementById(labelledBy)?.textContent?.trim());
      if (rn) return `role="${role}" name="${rn}"`;
    }

    const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const ht = (heading.innerText || '').trim().slice(0, 50);
      if (ht) return `heading text "${ht}"`;
    }

    const img = el.querySelector('img[alt]');
    if (img && img.alt) return `image alt "${img.alt}"`;

    return '';
  }

  function getFingerprint(el) {
    return {
      tagName: el.tagName.toLowerCase(),
      text: getElementText(el),
      childCount: el.children ? el.children.length : 0,
    };
  }

  function getElementSnippet(el) {
    const tag = el.tagName.toLowerCase();
    const attrs = [];

    for (const attr of el.attributes) {
      const name = attr.name.toLowerCase();
      let value = attr.value;

      if (name === 'class') {
        value = getMeaningfulClasses(el).join(' ');
      } else if (!shouldKeepSnippetAttribute(name, value)) {
        continue;
      }

      if (!value || value.length > 120) continue;
      attrs.push(`${name}="${escapeAttribute(value)}"`);
    }

    return attrs.length > 0 ? `<${tag} ${attrs.join(' ')}>` : `<${tag}>`;
  }

  function shouldKeepSnippetAttribute(name, value) {
    if (!value || name === 'style' || name.startsWith('on')) return false;
    if (name === 'id' || name === 'role' || name === 'data-testid' || name === 'data-cy') return true;
    if (name.startsWith('aria-')) return true;
    return ['href', 'src', 'alt', 'title', 'name', 'type', 'placeholder', 'value'].includes(name);
  }

  function escapeAttribute(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ── Pick Mode ──

  function isInsideShadowEvent(e) {
    if (!e) return false;
    const path = e.composedPath ? e.composedPath() : [];
    return path.includes(state.shadowRoot) || path.includes(state.shadowHost);
  }

  function isInsideShadow(el) {
    if (!el) return false;
    if (el === state.shadowHost) return true;
    try {
      return el.getRootNode() === state.shadowRoot;
    } catch {
      return false;
    }
  }

  function startPick() {
    if (state.pickMode) return;
    state.pickMode = true;
    showTopBar();
    const style = document.createElement('style');
    style.id = '__annota-pick-cursor__';
    style.textContent = '*,*::before,*::after{cursor:crosshair!important}';
    document.head.appendChild(style);
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('click', onClickCapture, true);
    document.addEventListener('keydown', onKeyDown, true);
    ChromeAdapters.messaging.sendToBackground({ type: 'PICK_MODE_CHANGED', pickMode: true });
  }

  function stopPick() {
    if (!state.pickMode) return;
    state.pickMode = false;
    const style = document.getElementById('__annota-pick-cursor__');
    if (style) style.remove();
    state.currentTarget = null;
    hideTopBar();
    state.hoverHighlight.style.display = 'none';
    document.removeEventListener('mouseover', onMouseOver, true);
    document.removeEventListener('click', onClickCapture, true);
    document.removeEventListener('keydown', onKeyDown, true);
    ChromeAdapters.messaging.sendToBackground({ type: 'PICK_MODE_CHANGED', pickMode: false });
  }

  function onMouseOver(e) {
    if (isInsideShadowEvent(e)) return;
    const normalized = normalizeTarget(e.target);
    if (!normalized || normalized === document.body || normalized === document.documentElement) {
      state.hoverHighlight.style.display = 'none';
      state.currentTarget = null;
      return;
    }
    state.currentTarget = normalized;
    const rect = normalized.getBoundingClientRect();
    state.hoverHighlight.style.display = 'block';
    state.hoverHighlight.style.top = rect.top + 'px';
    state.hoverHighlight.style.left = rect.left + 'px';
    state.hoverHighlight.style.width = rect.width + 'px';
    state.hoverHighlight.style.height = rect.height + 'px';
  }

  function onClickCapture(e) {
    if (isInsideShadowEvent(e)) return;
    if (state.popover.style.display !== 'none') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const normalized = state.currentTarget || normalizeTarget(e.target);
    if (!normalized || normalized === document.body || normalized === document.documentElement) return;

    const existing = annotationStore.findAnnotationForElement(normalized);
    if (existing) {
      popoverManager.openExistingPopover(existing, e.clientX, e.clientY);
    } else {
      popoverManager.openNewPopover(normalized, e.clientX, e.clientY);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      if (state.popover.style.display !== 'none') {
        popoverManager.closePopover();
      } else if (state.pickMode) {
        stopPick();
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // ── Mutation Observer ──

  function setupMutationObserver() {
    const observer = new MutationObserver(() => {
      if (state.annotations.length === 0) return;
      clearTimeout(state.mutationTimer);
      state.mutationTimer = setTimeout(() => {
        staleValidator.validateCurrentPageAnnotations();
      }, MUTATION_DEBOUNCE_MS);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ── Page key / load ──

  function computePageKey() {
    state.pageKey = pageKey(location.href);
    state.currentPagePath = location.pathname + location.hash;
  }

  async function loadAnnotations() {
    computePageKey();
    await annotationStore.loadAnnotations();
    updateTopBarCount();
    badgeRenderer.renderBadges();
  }

  // ── Init ──

  function init() {
    createShadowDOM();
    watchHostRemoval();

    const annotationsStorage = window.ChromeAnnotationsStorage();

    annotationStore = window.createAnnotationStore({
      getAnnotations: () => state.annotations,
      setAnnotations: (v) => { state.annotations = v; },
      getPageKey: () => state.pageKey,
      getLocatorHint,
      storage: annotationsStorage,
    });

    annotationStore.subscribe(syncUI);

    popoverManager = window.createPopoverManager({
      popover: state.popover,
      getOpenPopoverAnnotationId: () => state.openPopoverAnnotationId,
      setOpenPopoverAnnotationId: (v) => { state.openPopoverAnnotationId = v; },
      generateSelector: window.generateSelector,
      getElementText,
      getLocatorHint,
      getElementSnippet,
      getFingerprint,
      saveAnnotation: (data) => { _selfWritePending++; return annotationStore.saveAnnotation(data); },
      replaceAnnotation: (id, fb) => { _selfWritePending++; return annotationStore.replaceAnnotation(id, fb); },
      deleteAnnotationById: (id) => { _selfWritePending++; return annotationStore.deleteAnnotationById(id); },
    });

    badgeRenderer = window.createBadgeRenderer({
      badgeContainer: state.badgeContainer,
      getAnnotations: () => state.annotations,
      getBadgePositions: () => state.badgePositions,
      setBadgePositions: (v) => { state.badgePositions = v; },
      openExistingPopover: popoverManager.openExistingPopover,
    });

    staleValidator = window.createStaleValidator({
      getAnnotations: () => state.annotations,
      getOpenPopoverAnnotationId: () => state.openPopoverAnnotationId,
      retryMap: state.retryMap,
      deleteAnnotations: (ids) => annotationStore.deleteAnnotationsByIds(ids),
      onStaleRemoved: (count) => {
        updateTopBarCount();
        badgeRenderer.renderBadges();
        showNotice(`Removed ${count} stale feedback item${count !== 1 ? 's' : ''}.`);
      },
      onStaleError: () => showNotice('Could not update stale feedback.'),
      getElementText,
    });

    spaDetector = window.createSpaDetector({
      getLastUrl: () => state.lastUrl,
      setLastUrl: (v) => { state.lastUrl = v; },
      onUrlChange: () => {
        popoverManager.closePopover(true);
        if (state.pickMode) stopPick();
        state.retryMap.clear();
        loadAnnotations().then(() => {
          setTimeout(() => staleValidator.validateCurrentPageAnnotations(), window.RETRY_MS);
        });
      },
    });

    window.createMessageRouter({
      onStartPickMode: startPick,
      onStopPickMode: stopPick,
      onGetState: () => ({
        pickMode: state.pickMode,
        annotations: [...state.annotations].sort((a, b) => a.createdAt - b.createdAt),
      }),
      onDeleteAnnotation: (id) => { _selfWritePending++; return annotationStore.deleteAnnotationById(id); },
      onClearPage: () => { _selfWritePending++; return annotationStore.clearPageAnnotations(); },
    });

    computePageKey();
    loadAnnotations();
    setupMutationObserver();
    spaDetector.setupSPADetection();

    ChromeAdapters.storage.onChanged((pageKey, newList) => {
      if (_selfWritePending > 0) { _selfWritePending--; return; }
      loadAnnotations().then(() => staleValidator.validateCurrentPageAnnotations());
    });

    window.addEventListener('scroll', badgeRenderer.repositionBadges, { passive: true });
    window.addEventListener('resize', badgeRenderer.repositionBadges, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
