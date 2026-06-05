(function () {
  'use strict';

  const AFB = window.AFB = window.AFB || {};
  const SCHEMA_VERSION = 1;

  function create(deps) {
    const { getAnnotations, setAnnotations, getPageKey } = deps;
    const storage = deps.storage || AFB.annotationsStorage.ChromeAnnotationsStorage();
    const observer = AFB.observer.createObserver();
    const store = { subscribe: observer.subscribe };
    const notify = observer.notify;
    const persist = (transform) => storage.mutate(getPageKey(), transform).then((latest) => {
      setAnnotations(latest); notify(latest); return latest;
    }, () => { throw new Error('Could not save feedback. Try again.'); });

    store.loadAnnotations = async () => {
      try { setAnnotations(await storage.read(getPageKey())); } catch { setAnnotations([]); }
    };
    store.saveAnnotation = (data) => persist((list) => [...list, {
      schemaVersion: SCHEMA_VERSION, id: crypto.randomUUID(), selector: data.selector,
      locatorHint: data.locatorHint || '', tag: data.tag, elementSnippet: data.elementSnippet || '',
      text: data.text || '', feedback: data.feedback, viewport: data.viewport,
      fingerprint: data.fingerprint, createdAt: Date.now(), pageKey: getPageKey(),
    }]);
    store.replaceAnnotation = (id, feedback) => persist((list) => {
      const idx = list.findIndex((a) => a.id === id);
      if (idx === -1) return list;
      const copy = list.slice();
      copy[idx] = Object.assign({}, copy[idx], { feedback, createdAt: Date.now() });
      return copy;
    });
    store.deleteAnnotationById = async (id) => {
      try { return await persist((list) => list.filter((a) => a.id !== id)); }
      catch { return getAnnotations(); }
    };
    store.clearPageAnnotations = async () => {
      try { await storage.replace(getPageKey(), []); } catch {}
      setAnnotations([]); notify([]); return [];
    };
    store.findAnnotationForElement = (el) => {
      const selector = AFB.selectorGenerator.generateSelector(el);
      return getAnnotations().find((a) => a.selector === selector) || null;
    };
    return store;
  }

  AFB.annotationStore = { create, SCHEMA_VERSION };
})();
