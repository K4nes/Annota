const app = document.getElementById('app');
const { pageKey, isDevUrl, escapeHtml } = window.AFB.utils;

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
  app.innerHTML = `
    <div class="state">
      <p class="state-msg">No feedback on this page yet.</p>
    </div>
    <div class="footer">
      <button class="btn btn-primary" id="btn-add">Add feedback</button>
    </div>
  `;
}

function renderPicking(annotations, pagePath) {
  const count = annotations.length;
  app.innerHTML = `
    <div class="picking-banner">
      <span class="picking-label">Picking is active</span>
      <button class="btn btn-sm btn-secondary" id="btn-stop">Stop picking</button>
    </div>
    ${count > 0 ? renderList(annotations, pagePath) : '<div class="state"><p class="state-msg">No feedback yet. Click elements on the page.</p></div>'}
    ${count > 0 ? renderFooter(annotations, pagePath, true) : ''}
  `;
}

function renderAnnotations(annotations, pagePath, picking) {
  const count = annotations.length;
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
            <button class="annotation-delete" data-id="${a.id}">Delete</button>
          </div>
          ${a.text ? `<div class="annotation-preview">${escapeHtml(truncate(a.text, 50))}</div>` : ''}
          <div class="annotation-preview">${escapeHtml(truncate(a.feedback, 60))}</div>
          <div class="annotation-full" style="display:none">${escapeHtml(a.feedback)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFooter(annotations, pagePath, picking) {
  return `
    <div class="footer">
      <button class="btn btn-primary" id="btn-copy">Copy all</button>
      ${!picking ? '<button class="btn btn-secondary" id="btn-add">Add feedback</button>' : ''}
      <button class="btn btn-danger" id="btn-clear">Clear page</button>
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
      <p class="state-msg">Could not connect to this page. Reload localhost app and try again.</p>
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

function bindPopupEvents(annotations, pagePath, picking) {
  const btnStop = document.getElementById('btn-stop');
  if (btnStop) btnStop.addEventListener('click', stopPickMode);

  const btnAdd = document.getElementById('btn-add');
  if (btnAdd) btnAdd.addEventListener('click', startPickMode);

  const btnRetry = document.getElementById('btn-retry');
  if (btnRetry) btnRetry.addEventListener('click', init);

  const btnSelectAll = document.getElementById('btn-select-all');
  if (btnSelectAll) {
    btnSelectAll.addEventListener('click', () => {
      const ta = app.querySelector('.fallback-area');
      ta.select();
      document.execCommand('selectAll');
    });
  }

  bindListEvents(annotations);
  bindFooterEvents(annotations, pagePath, picking);
}

function bindListEvents(annotations) {
  app.querySelectorAll('.annotation-item').forEach((el) => {
    const id = el.dataset.id;
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('annotation-delete')) return;
      const full = el.querySelector('.annotation-full');
      const preview = el.querySelectorAll('.annotation-preview');
      if (full.style.display === 'none') {
        full.style.display = 'block';
        preview.forEach((p) => (p.style.display = 'none'));
      } else {
        full.style.display = 'none';
        preview.forEach((p) => (p.style.display = ''));
      }
    });
  });

  app.querySelectorAll('.annotation-delete').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteAnnotation(btn.dataset.id);
    });
  });
}

function bindFooterEvents(annotations, pagePath, picking) {
  const btnCopy = document.getElementById('btn-copy');
  const btnAdd = document.getElementById('btn-add');
  const btnClear = document.getElementById('btn-clear');

  if (btnCopy) btnCopy.addEventListener('click', () => copyAll(annotations, pagePath));
  if (btnAdd) btnAdd.addEventListener('click', startPickMode);
  if (btnClear) btnClear.addEventListener('click', clearPage);
}

async function startPickMode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await ChromeAdapters.messaging.sendToTab(tab.id, { type: 'START_PICK_MODE' });
    window.close();
  } catch {
    renderNoContentScript();
  }
}

async function stopPickMode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await ChromeAdapters.messaging.sendToTab(tab.id, { type: 'STOP_PICK_MODE' });
  } catch {}
  init();
}

async function deleteAnnotation(id) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await ChromeAdapters.messaging.sendToTab(tab.id, { type: 'DELETE_ANNOTATION', id });
  } catch {}
  init();
}

async function clearPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await ChromeAdapters.messaging.sendToTab(tab.id, { type: 'CLEAR_PAGE' });
  } catch {}
  init();
}

async function copyAll(annotations, pagePath) {
  const md = generateMarkdown(annotations, pagePath);
  try {
    await navigator.clipboard.writeText(md);
    showCopiedState();
  } catch {
    renderClipboardFallback(md);
    bindPopupEvents(annotations, pagePath, false);
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
    if (a.text) {
      md += `   Text: ${a.text}\n`;
    }
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
        bindPopupEvents([], '', false);
        return;
      }
    }

    if (pickMode) {
      renderPicking(annotations, pagePath);
      bindPopupEvents(annotations, pagePath, true);
    } else if (annotations.length === 0) {
      renderEmpty();
      bindPopupEvents(annotations, pagePath, false);
    } else {
      renderAnnotations(annotations, pagePath, false);
      bindPopupEvents(annotations, pagePath, false);
    }
  } catch (initErr) {
    console.error('[popup] init failed:', initErr);
    renderStorageError();
    bindPopupEvents([], '', false);
  }
}

ChromeAdapters.storage.onChanged((pageKey, newList) => {
  init();
});

init();
