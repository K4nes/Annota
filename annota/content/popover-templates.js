(function() {
  'use strict';

  const { escapeHtml } = window;

  function renderNewPopoverHTML() {
    return `
      <div class="annota-popover-header">
        <span class="annota-popover-title">Add feedback</span>
      </div>
      <div class="annota-popover-body">
        <textarea class="annota-popover-textarea" rows="1" placeholder="Describe the change..."></textarea>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-secondary annota-popover-cancel" type="button">Cancel</button>
        <button class="annota-btn annota-btn-primary annota-popover-save" type="button" disabled>Save</button>
      </div>
    `;
  }

  function renderExistingPopoverHTML(annotation) {
    return `
      <div class="annota-popover-header">
        <span class="annota-popover-title">Existing feedback</span>
      </div>
      <div class="annota-popover-body">
        <div class="annota-popover-existing">${escapeHtml(annotation.feedback)}</div>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-secondary annota-popover-cancel" type="button">Cancel</button>
        <button class="annota-btn annota-btn-danger annota-popover-delete" type="button">Delete</button>
        <button class="annota-btn annota-btn-primary annota-popover-replace" type="button">Replace</button>
      </div>
    `;
  }

  function renderReplacePopoverHTML(annotation) {
    return `
      <div class="annota-popover-header">
        <span class="annota-popover-title">Replace feedback</span>
      </div>
      <div class="annota-popover-body">
        <textarea class="annota-popover-textarea" rows="1" placeholder="New feedback...">${escapeHtml(annotation.feedback)}</textarea>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-secondary annota-popover-cancel" type="button">Cancel</button>
        <button class="annota-btn annota-btn-primary annota-popover-save" type="button">Save</button>
      </div>
    `;
  }

  window.renderNewPopoverHTML = renderNewPopoverHTML;
  window.renderExistingPopoverHTML = renderExistingPopoverHTML;
  window.renderReplacePopoverHTML = renderReplacePopoverHTML;
})();
