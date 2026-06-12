(function () {
  'use strict';

  const TOKENS = `:host {
  --annota-surface: #0f1115;
  --annota-surface-elevated: #1e2330;
  --annota-surface-hover: #252b3a;
  --annota-surface-list-hover: #161a22;
  --annota-border: #2a2f3a;
  --annota-text: #f3f4f6;
  --annota-text-inverted: #ffffff;
  --annota-text-muted: #9ca3af;
  --annota-text-secondary: #d1d5db;
  --annota-text-tertiary: #6b7280;
  --annota-accent: #4a8fe8;
  --annota-accent-hover: #3a7fd8;
  --annota-accent-tint: rgba(74, 143, 232, 0.12);
  --annota-success: #22c55e;
  --annota-success-hover: #16a34a;
  --annota-success-bg: #1a2e1a;
  --annota-success-border: #2a3a2a;
  --annota-success-text: #4ade80;
  --annota-danger: #ef4444;
  --annota-danger-tint: rgba(239, 68, 68, 0.1);
  --annota-error: #f87171;
  --annota-shadow-xs: 0 1px 3px rgba(15, 20, 35, 0.25);
  --annota-shadow-sm: 0 4px 12px rgba(15, 20, 35, 0.25);
  --annota-shadow-md: 0 8px 24px rgba(15, 20, 35, 0.35);
  --annota-space-2xs: 2px;
  --annota-space-xs: 4px;
  --annota-space-sm: 6px;
  --annota-space-md: 8px;
  --annota-space-lg: 12px;
  --annota-space-xl: 16px;
  --annota-radius-2xs: 3px;
  --annota-radius-xs: 4px;
  --annota-radius-sm: 5px;
  --annota-radius-md: 6px;
  --annota-radius-lg: 8px;
  --annota-font-stack: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --annota-font-mono: 'Geist Mono', 'SF Mono', Monaco, Consolas, monospace;
  --annota-font-size-base: 13px;
  --annota-font-size-sm: 12px;
  --annota-font-size-xs: 11px;
}`;

  function shadowTokens() { return TOKENS; }
  function rootTokens() { return TOKENS.replace(/:host/g, ':root'); }

  self.shadowTokens = shadowTokens;
  self.rootTokens = rootTokens;
})();
