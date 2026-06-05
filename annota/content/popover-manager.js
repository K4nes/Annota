(function() {
  'use strict';

  const AFB = window.AFB = window.AFB || {};
  const { escapeHtml } = AFB.utils;
  const POPOVER_WIDTH = 360;
  const POPOVER_OFFSET = 12;

  function create(deps) {
    const popover = deps.popover;
    const getOpenPopoverAnnotationId = deps.getOpenPopoverAnnotationId;
    const setOpenPopoverAnnotationId = deps.setOpenPopoverAnnotationId;
    const generateSelector = deps.generateSelector;
    const getElementText = deps.getElementText;
    const getLocatorHint = deps.getLocatorHint;
    const getElementSnippet = deps.getElementSnippet;
    const getFingerprint = deps.getFingerprint;
    const saveAnnotation = deps.saveAnnotation;
    const replaceAnnotation = deps.replaceAnnotation;
    const deleteAnnotationById = deps.deleteAnnotationById;

    const mgr = {};

    mgr.openNewPopover = function(el, x, y) {
      setOpenPopoverAnnotationId(null);
      const selector = generateSelector(el);
      const text = getElementText(el);
      const locatorHint = getLocatorHint(el);

      popover.innerHTML = AFB.popoverTemplates.renderNewPopoverHTML();

      mgr.positionPopover(x, y);
      popover.style.display = 'block';
      popover.classList.remove('annota-popover-instant');
      requestAnimationFrame(() => popover.classList.add('annota-popover-open'));

      const textarea = popover.querySelector('.annota-popover-textarea');
      const saveBtn = popover.querySelector('.annota-popover-save');
      const cancelBtn = popover.querySelector('.annota-popover-cancel');
      const closeBtn = popover.querySelector('.annota-popover-close');
      const errorEl = popover.querySelector('.annota-popover-error');

      textarea.focus();
      mgr.setupTextareaAutoGrow(textarea);

      textarea.addEventListener('input', () => {
        saveBtn.disabled = !textarea.value.trim();
      });

      textarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          if (!saveBtn.disabled) saveBtn.click();
        }
      });

      saveBtn.addEventListener('click', async () => {
        const feedback = textarea.value.trim();
        if (!feedback) return;
        try {
          await saveAnnotation({
            selector,
            locatorHint,
            tag: el.tagName.toLowerCase(),
            elementSnippet: getElementSnippet(el),
            text,
            feedback,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            fingerprint: getFingerprint(el),
          });
          saveBtn.textContent = 'Saved';
          saveBtn.classList.remove('annota-btn-primary');
          saveBtn.classList.add('annota-btn-saved');
          saveBtn.disabled = true;
          setTimeout(() => mgr.closePopover(true), 300);
        } catch (err) {
          errorEl.textContent = err.message || 'Could not save feedback. Try again.';
          errorEl.style.display = '';
        }
      });

      cancelBtn.addEventListener('click', () => mgr.closePopover());
      closeBtn.addEventListener('click', () => mgr.closePopover());
    };

    mgr.openExistingPopover = function(annotation, x, y) {
      setOpenPopoverAnnotationId(annotation.id);

      popover.innerHTML = AFB.popoverTemplates.renderExistingPopoverHTML(annotation);

      mgr.positionPopover(x, y);
      popover.style.display = 'block';
      popover.classList.remove('annota-popover-instant');
      requestAnimationFrame(() => popover.classList.add('annota-popover-open'));

      const cancelBtn = popover.querySelector('.annota-popover-cancel');
      const closeBtn = popover.querySelector('.annota-popover-close');
      const deleteBtn = popover.querySelector('.annota-popover-delete');
      const replaceBtn = popover.querySelector('.annota-popover-replace');

      cancelBtn.addEventListener('click', () => mgr.closePopover());
      closeBtn.addEventListener('click', () => mgr.closePopover());

      deleteBtn.addEventListener('click', () => {
        deleteAnnotationById(annotation.id);
        mgr.closePopover();
      });

      replaceBtn.addEventListener('click', () => {
        mgr.openReplaceMode(annotation);
      });
    };

    mgr.openReplaceMode = function(annotation) {
      popover.innerHTML = AFB.popoverTemplates.renderReplacePopoverHTML(annotation);

      const textarea = popover.querySelector('.annota-popover-textarea');
      const saveBtn = popover.querySelector('.annota-popover-save');
      const cancelBtn = popover.querySelector('.annota-popover-cancel');
      const closeBtn = popover.querySelector('.annota-popover-close');
      const errorEl = popover.querySelector('.annota-popover-error');

      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      mgr.setupTextareaAutoGrow(textarea);

      textarea.addEventListener('input', () => {
        saveBtn.disabled = !textarea.value.trim();
      });

      textarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          if (!saveBtn.disabled) saveBtn.click();
        }
      });

      saveBtn.addEventListener('click', async () => {
        const feedback = textarea.value.trim();
        if (!feedback) return;
        try {
          await replaceAnnotation(annotation.id, feedback);
          saveBtn.textContent = 'Saved';
          saveBtn.classList.remove('annota-btn-primary');
          saveBtn.classList.add('annota-btn-saved');
          saveBtn.disabled = true;
          setTimeout(() => mgr.closePopover(true), 300);
        } catch (err) {
          errorEl.textContent = err.message || 'Could not save feedback. Try again.';
          errorEl.style.display = '';
        }
      });

      cancelBtn.addEventListener('click', () => mgr.closePopover());
      closeBtn.addEventListener('click', () => mgr.closePopover());
    };

    mgr.closePopover = function(instant) {
      setOpenPopoverAnnotationId(null);
      if (instant) {
        popover.classList.add('annota-popover-instant');
      }
      popover.classList.remove('annota-popover-open');
      setTimeout(() => {
        popover.style.display = 'none';
        popover.classList.remove('annota-popover-instant');
        popover.innerHTML = '';
      }, instant ? 0 : 120);
    };

    mgr.positionPopover = function(x, y) {
      let left = x + POPOVER_OFFSET;
      let top = y + POPOVER_OFFSET;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (left + POPOVER_WIDTH > vw - 12) {
        left = x - POPOVER_WIDTH - POPOVER_OFFSET;
      }
      if (left < 12) left = 12;

      popover.style.left = left + 'px';
      popover.style.top = top + 'px';

      requestAnimationFrame(() => {
        const rect = popover.getBoundingClientRect();
        if (top + rect.height > vh - 12) {
          top = y - rect.height - POPOVER_OFFSET;
          if (top < 12) top = 12;
          popover.style.top = top + 'px';
        }
      });
    };

    mgr.setupTextareaAutoGrow = function(textarea) {
      const baseHeight = 80;
      const maxHeight = 200;
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
      });
    };

    return mgr;
  }

  AFB.popoverManager = { create, POPOVER_WIDTH, POPOVER_OFFSET };
})();
