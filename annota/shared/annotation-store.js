(function () {
  'use strict';

  const SCHEMA_VERSION = 1;

  function create(deps) {
    const { getAnnotations, setAnnotations, getPageKey, getLocatorHint } = deps;
    const storage = deps.storage || window.ChromeAnnotationsStorage();
    const observer = window.createObserver();
    const store = { subscribe: observer.subscribe };
    const notify = observer.notify;
    const persist = (transform) => storage.mutate(getPageKey(), transform).then((latest) => {
      setAnnotations(latest); notify(latest); return latest;
    }, () => { throw new Error('Could not save feedback. Try again.'); });

    let _cache = null;

    function rebuildCache() {
      _cache = new Map();
      for (const ann of getAnnotations()) {
        _cache.set(ann.selector, ann);
      }
    }

    function invalidateCache() { _cache = null; }

    store.loadAnnotations = async () => {
      try { setAnnotations(await storage.read(getPageKey())); } catch { setAnnotations([]); }
      invalidateCache();
    };
    store.saveAnnotation = (data) => persist((list) => [...list, {
      schemaVersion: SCHEMA_VERSION, id: crypto.randomUUID(), selector: data.selector,
      locatorHint: data.locatorHint || '', tag: data.tag, elementSnippet: data.elementSnippet || '',
      text: data.text || '', feedback: data.feedback, viewport: data.viewport,
      fingerprint: data.fingerprint, createdAt: Date.now(), pageKey: getPageKey(),
    }]).then((r) => { invalidateCache(); return r; });
    store.replaceAnnotation = (id, feedback) => persist((list) => {
      const idx = list.findIndex((a) => a.id === id);
      if (idx === -1) return list;
      const copy = list.slice();
      copy[idx] = Object.assign({}, copy[idx], { feedback });
      return copy;
    }).then((r) => { invalidateCache(); return r; });
    store.deleteAnnotationById = async (id) => {
      try { const r = await persist((list) => list.filter((a) => a.id !== id)); invalidateCache(); return r; }
      catch { return getAnnotations(); }
    };
    store.deleteAnnotationsByIds = async (ids) => {
      const idSet = new Set(ids);
      try { return await persist((list) => list.filter((a) => !idSet.has(a.id))); }
      catch { return getAnnotations(); }
    };
    store.clearPageAnnotations = async () => {
      try { return await persist(() => []); } catch {}
      invalidateCache(); return [];
    };
    store.findAnnotationForElement = (el) => {
      if (!_cache) rebuildCache();
      const selector = window.generateSelector(el);
      const match = _cache.get(selector);
      if (match) return match;
      if (!getLocatorHint) return null;
      const hint = getLocatorHint(el);
      if (!hint) return null;
      return getAnnotations().find((a) => a.locatorHint === hint) || null;
    };
    return store;
  }

  window.createAnnotationStore = create;
})();
