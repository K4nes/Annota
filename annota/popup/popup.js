const style = document.createElement('style');
style.textContent = window.rootTokens();
document.head.appendChild(style);

const app = document.getElementById('app');
const { pageKey, isDevUrl, escapeHtml } = window;

const CLIPBOARD_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="8" height="9" rx="1"/><path d="M4 2V1h4v1"/><path d="M2 5h8"/><path d="M2 7.5h8"/><path d="M2 10h5"/></svg>`;
const CHECKMARK_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6l3 3 5-5"/></svg>`;
const TRASH_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h8"/><path d="M4 3V1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V3"/><path d="M3.5 3v6.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V3"/><path d="M5 5v3"/><path d="M7 5v3"/></svg>`;

function getPagePath(url) {
  try {
    const u = new URL(url);
    return u.pathname + u.hash;
  } catch {
    return '';
  }
}

function isRestrictedUrl(url) {
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('about:') ||
    url.startsWith('edge://') ||
    url.startsWith('brave://')
  );
}

function renderEmpty() {
  delete app.dataset.annotations;
  delete app.dataset.pagePath;
  app.innerHTML = `
    <div class="state">
      <p class="state-msg">No feedback on this page yet.</p>
    </div>
    <div class="footer">
      <button class="btn btn-primary" id="btn-add">Add feedback</button>
    </div>
  `;
}

function renderDesignMode(annotations, pagePath) {
  const count = annotations.length;
  app.dataset.annotations = JSON.stringify(annotations);
  app.dataset.pagePath = pagePath;
  app.innerHTML = `
    <div class="design-banner">
      <span class="design-label">Design mode</span>
    </div>
    ${count > 0 ? renderList(annotations, pagePath) : '<div class="state"><p class="state-msg">Click elements to add feedback.</p></div>'}
    ${count > 0 ? renderFooter(annotations, pagePath, true) : ''}
  `;
}

function renderAnnotations(annotations, pagePath, picking) {
  const count = annotations.length;
  app.dataset.annotations = JSON.stringify(annotations);
  app.dataset.pagePath = pagePath;
  app.innerHTML = `
    <div class="header">
      <span class="header-path" title="${escapeHtml(pagePath)}">${escapeHtml(pagePath)}</span>
      <span class="header-count">${count} note${count !== 1 ? 's' : ''}</span>
    </div>
    ${renderList(annotations, pagePath)}
    ${renderFooter(annotations, pagePath, picking)}
  `;
}

function renderList(annotations) {
  return `
    <div class="annotation-list">
      ${annotations.map((a, i) => `
        <div class="annotation-item" data-id="${a.id}">
          <div class="annotation-item-header">
            <span class="annotation-number">${i + 1}</span>
            <span class="annotation-selector" title="${escapeHtml(a.selector)}">${escapeHtml(truncate(a.selector, 30))}</span>
            <button class="annotation-copy" data-id="${a.id}">${CLIPBOARD_SVG}</button>
            <button class="annotation-delete" data-id="${a.id}">${TRASH_SVG}</button>
          </div>
          ${a.text ? `<div class="annotation-preview">${escapeHtml(truncate(a.text, 50))}</div>` : ''}
          <div class="annotation-preview">${escapeHtml(truncate(a.feedback, 60))}</div>
          <div class="annotation-full" style="display:none">${escapeHtml(a.feedback)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFooter(annotations, pagePath, designMode) {
  if (designMode) {
    return `
      <div class="footer">
        <div class="footer-row">
          <button class="btn btn-primary" id="btn-copy">Copy all</button>
          <button class="btn btn-secondary" id="btn-clear">Clear</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="footer">
      <div class="footer-row">
        <button class="btn btn-primary" id="btn-copy">Copy all</button>
        <button class="btn btn-secondary" id="btn-clear">Clear</button>
      </div>
      <button class="btn btn-secondary" id="btn-add">Add feedback</button>
    </div>
  `;
}

function renderUnsupported() {
  app.innerHTML = `
    <div class="state">
      <p class="state-msg">This extension only works on local development URLs (localhost, 127.0.0.1, *.local).</p>
    </div>
  `;
}

function renderPermissionMissing() {
  app.innerHTML = `
    <div class="state">
      <p class="state-msg">This extension only runs on local development URLs.</p>
    </div>
  `;
}

function renderNoContentScript() {
  app.innerHTML = `
    <div class="state">
      <p class="state-msg">Extension not connected. Reload the page to enable feedback.</p>
    </div>
    <div class="footer">
      <button class="btn btn-primary" id="btn-reload">Reload page</button>
    </div>
  `;
}

function renderStorageError() {
  app.innerHTML = `
    <div class="state">
      <p class="state-msg">Could not load feedback for this page.</p>
    </div>
    <div class="footer">
      <button class="btn btn-primary" id="btn-retry">Retry</button>
    </div>
  `;
}

function renderClipboardFallback(text) {
  app.innerHTML = `
    <div class="state">
      <p class="state-msg" style="margin-bottom:12px">Clipboard access denied. Copy manually:</p>
      <textarea class="fallback-area" readonly>${escapeHtml(text)}</textarea>
    </div>
    <div class="footer">
      <button class="btn btn-primary" id="btn-select-all">Select all</button>
    </div>
  `;
}

function toggleAnnotationExpand(item) {
  const full = item.querySelector('.annotation-full');
  const preview = item.querySelectorAll('.annotation-preview');
  if (full.style.display === 'none') {
    full.style.display = 'block';
    preview.forEach((p) => (p.style.display = 'none'));
  } else {
    full.style.display = 'none';
    preview.forEach((p) => (p.style.display = ''));
  }
}

app.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.id === 'btn-stop') { stopPickMode(); return; }
  if (btn.id === 'btn-add') { startPickMode(); return; }
  if (btn.id === 'btn-retry') { init(); return; }
  if (btn.id === 'btn-reload') { reloadTab(); return; }
  if (btn.id === 'btn-select-all') {
    const ta = app.querySelector('.fallback-area');
    ta?.select();
    return;
  }
  if (btn.id === 'btn-copy') { copyAll(); return; }
  if (btn.id === 'btn-clear') { clearPage(); return; }
  if (btn.classList.contains('annotation-copy')) { copySingle(btn.dataset.id); return; }
  if (btn.classList.contains('annotation-delete')) { deleteAnnotation(btn.dataset.id); return; }
  if (btn.closest('.annotation-item')) {
    toggleAnnotationExpand(btn.closest('.annotation-item'));
  }
});

async function sendToActiveTab(msg, onError) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try { return await ChromeAdapters.messaging.sendToTab(tab.id, msg); }
  catch (err) { if (onError) onError(err); return false; }
}

async function reloadTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    try {
      await chrome.tabs.reload(tab.id);
      window.close();
    } catch {
      renderNoContentScript();
    }
  }
}

const startPickMode = async () => {
  const ok = await sendToActiveTab({ type: 'START_PICK_MODE' }, renderNoContentScript);
  if (ok) window.close();
};
const stopPickMode = async () => { await sendToActiveTab({ type: 'STOP_PICK_MODE' }); init(); };
const deleteAnnotation = async (id) => { await sendToActiveTab({ type: 'DELETE_ANNOTATION', id }); init(); };
const clearPage = async () => { await sendToActiveTab({ type: 'CLEAR_PAGE' }); init(); };

async function copyAll() {
  const annotations = JSON.parse(app.dataset.annotations || '[]');
  const pagePath = app.dataset.pagePath || '';
  const md = generateMarkdown(annotations, pagePath);
  try {
    await navigator.clipboard.writeText(md);
    showCopiedState();
  } catch {
    renderClipboardFallback(md);
  }
}

function showCopiedState() {
  const btnCopy = document.getElementById('btn-copy');
  if (btnCopy) {
    btnCopy.textContent = 'Copied!';
    btnCopy.classList.remove('btn-primary');
    btnCopy.classList.add('btn-green');
    btnCopy.disabled = true;
  }
  const btnClear = document.getElementById('btn-clear');
  if (btnClear) {
    btnClear.textContent = 'Clear copied batch';
  }
}

function generateMarkdown(annotations, pagePath) {
  let md = `# UI feedback\nPage: ${pagePath}\n`;

  annotations.forEach((a, i) => {
    md += `\n${i + 1}. Selector: ${a.selector}\n`;
    if (a.locatorHint) {
      md += `   Locator hint: ${a.locatorHint}\n`;
    }
    md += `   Element: ${a.elementSnippet || a.tag}\n`;
    md += `   Viewport: ${a.viewport.width}x${a.viewport.height}\n`;
    const feedbackLines = a.feedback.split('\n');
    md += `   Feedback: ${feedbackLines[0]}\n`;
    for (let j = 1; j < feedbackLines.length; j++) {
      md += `   ${feedbackLines[j]}\n`;
    }
  });

  return md.trimEnd() + '\n';
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '...' : str;
}

async function copySingle(id) {
  const annotations = JSON.parse(app.dataset.annotations || '[]');
  const pagePath = app.dataset.pagePath || '';
  const ann = annotations.find((a) => a.id === id);
  if (!ann) return;
  const md = generateMarkdown([ann], pagePath);
  try {
    await navigator.clipboard.writeText(md);
    const btn = app.querySelector(`.annotation-copy[data-id="${id}"]`);
    if (btn) {
      btn.innerHTML = CHECKMARK_SVG;
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = CLIPBOARD_SVG;
        btn.classList.remove('copied');
      }, 1500);
    }
  } catch {
    renderClipboardFallback(md);
  }
}

async function init() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      renderUnsupported();
      return;
    }

    if (isRestrictedUrl(tab.url)) {
      renderUnsupported();
      return;
    }

    if (!isDevUrl(tab.url)) {
      renderPermissionMissing();
      return;
    }

    const key = pageKey(tab.url);
    const pagePath = getPagePath(tab.url);

    let annotations = [];
    let pickMode = false;

    try {
      const response = await ChromeAdapters.messaging.sendToTab(tab.id, { type: 'GET_STATE' });
      if (response && response.annotations) {
        annotations = response.annotations;
        pickMode = response.pickMode || false;
      }
    } catch (msgErr) {
      try {
        annotations = await ChromeAdapters.storage.getAnnotations(key);
      } catch (storageErr) {
        console.error('[popup] storage fallback failed:', storageErr);
        renderStorageError();
        return;
      }
    }

    if (pickMode) {
      renderDesignMode(annotations, pagePath);
    } else if (annotations.length === 0) {
      renderEmpty();
    } else {
      renderAnnotations(annotations, pagePath, false);
    }
  } catch (initErr) {
    console.error('[popup] init failed:', initErr);
    renderStorageError();
  }
}

ChromeAdapters.storage.onChanged((pageKey, newList) => {
  init();
});

init();
