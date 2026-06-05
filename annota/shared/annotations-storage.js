(function () {
  'use strict';

  const ChromeAdapters = self.ChromeAdapters;

  function serializeMutate(readFn, replaceFn) {
    const queues = new Map();

    return function mutate(pageKey, fn) {
      const prev = queues.get(pageKey) || Promise.resolve();
      const next = prev.then(() => {
        return Promise.resolve(readFn(pageKey)).then((list) => {
          const current = Array.isArray(list) ? list : [];
          const updated = fn(current);
          return Promise.resolve(replaceFn(pageKey, updated)).then(() => updated);
        });
      });
      queues.set(pageKey, next.then(() => undefined, () => undefined));
      return next;
    };
  }

  function ChromeAnnotationsStorage() {
    if (!ChromeAdapters || !ChromeAdapters.storage) {
      throw new Error(
        'ChromeAnnotationsStorage requires ChromeAdapters.storage (chrome-storage-adapter.js must load first)'
      );
    }
    const adapter = ChromeAdapters.storage;

    function read(pageKey) {
      return adapter.getAnnotations(pageKey);
    }

    function replace(pageKey, list) {
      return adapter.setAnnotations(pageKey, list);
    }

    const mutate = serializeMutate(read, replace);

    return { read, replace, mutate };
  }

  function MemoryAnnotationsStorage() {
    const store = new Map();

    function read(pageKey) {
      const list = store.get(pageKey);
      return Promise.resolve(Array.isArray(list) ? list : []);
    }

    function replace(pageKey, list) {
      store.set(pageKey, Array.isArray(list) ? list : []);
      return Promise.resolve();
    }

    const mutate = serializeMutate(read, replace);

    return { read, replace, mutate };
  }

  self.serializeMutate = serializeMutate;
  self.ChromeAnnotationsStorage = ChromeAnnotationsStorage;
  self.MemoryAnnotationsStorage = MemoryAnnotationsStorage;
})();
