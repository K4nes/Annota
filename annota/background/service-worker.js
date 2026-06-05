importScripts('../shared/utils.js', '../shared/chrome-storage-adapter.js', '../shared/chrome-messaging-adapter.js', '../shared/chrome-badge-adapter.js', '../shared/annotations-storage.js');

const { pageKey, isDevUrl } = self;
const TAB_BADGES = new Map();

async function updateBadge(tabId, url, pickMode) {
  if (pickMode) {
    await ChromeAdapters.badge.setBadge(tabId, 'ON', '#22c55e');
    return;
  }

  if (!url || !isDevUrl(url)) {
    await ChromeAdapters.badge.clearBadge(tabId);
    return;
  }

  const key = pageKey(url);
  if (!key) {
    await ChromeAdapters.badge.clearBadge(tabId);
    return;
  }

  try {
    const count = await ChromeAdapters.storage.getBadgeCount(key);
    if (count === 0) {
      await ChromeAdapters.badge.clearBadge(tabId);
    } else {
      const text = count > 9 ? '9+' : String(count);
      await ChromeAdapters.badge.setBadge(tabId, text, '#3b82f6');
    }
  } catch {
    await ChromeAdapters.badge.clearBadge(tabId);
  }
}

ChromeAdapters.messaging.onMessage((msg, sender, sendResponse) => {
  if (!sender.tab) return;
  const tabId = sender.tab.id;

  if (msg.type === 'PICK_MODE_CHANGED') {
    TAB_BADGES.set(tabId, { pickMode: msg.pickMode });
    updateBadge(tabId, sender.tab.url, msg.pickMode);
    sendResponse({ ok: true });
  }

  if (msg.type === 'ANNOTATIONS_CHANGED') {
    const state = TAB_BADGES.get(tabId) || {};
    updateBadge(tabId, sender.tab.url, state.pickMode || false);
    sendResponse({ ok: true });
  }

  if (msg.type === 'GET_BADGE_STATE') {
    const state = TAB_BADGES.get(tabId) || {};
    sendResponse({ pickMode: state.pickMode || false });
  }

  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const state = TAB_BADGES.get(tabId) || {};
    updateBadge(tabId, tab.url, state.pickMode || false);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  TAB_BADGES.delete(tabId);
});
