(function() {
  'use strict';

  const BADGE_SIZE = 22;
  const BADGE_OFFSET = 6;
  const BADGE_COLLISION_STEP = 10;

  function calculateBadgePositions(annotations, elements) {
    const sorted = [...annotations].sort((a, b) => a.createdAt - b.createdAt);
    const positions = [];

    for (const ann of sorted) {
      const el = elements(ann);
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      let bx = rect.right - BADGE_SIZE / 2 + BADGE_OFFSET;
      let by = rect.top - BADGE_SIZE / 2 - BADGE_OFFSET;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (bx + BADGE_SIZE > vw) bx = vw - BADGE_SIZE - 4;
      if (bx < 0) bx = 4;
      if (by + BADGE_SIZE > vh) by = vh - BADGE_SIZE - 4;
      if (by < 0) by = 4;

      for (const prev of positions) {
        if (Math.abs(bx - prev.x) < BADGE_SIZE && Math.abs(by - prev.y) < BADGE_SIZE) {
          bx += BADGE_COLLISION_STEP;
          by += BADGE_COLLISION_STEP;
        }
      }

      positions.push({ id: ann.id, x: bx, y: by });
    }

    return positions;
  }

  function create(deps) {
    const badgeContainer = deps.badgeContainer;
    const getAnnotations = deps.getAnnotations;
    const setBadgePositions = deps.setBadgePositions;
    const openExistingPopover = deps.openExistingPopover;
    const querySelectorSafe = deps.querySelectorSafe || window.querySelectorSafe;

    const r = {};

    r.renderBadges = function() {
      badgeContainer.innerHTML = '';

      const annotations = getAnnotations();
      const positions = calculateBadgePositions(annotations, (ann) => querySelectorSafe(ann.selector));
      setBadgePositions(positions);

      const posById = new Map(positions.map((p) => [p.id, p]));
      const sorted = [...annotations].sort((a, b) => a.createdAt - b.createdAt);

      sorted.forEach((ann, i) => {
        const pos = posById.get(ann.id);
        if (!pos) return;
        const badge = document.createElement('div');
        badge.className = 'annota-badge';
        badge.textContent = String(i + 1);
        badge.style.left = pos.x + 'px';
        badge.style.top = pos.y + 'px';
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          openExistingPopover(ann, pos.x, pos.y + BADGE_SIZE);
        });
        badgeContainer.appendChild(badge);
      });
    };

    r.repositionBadges = function() {
      const badges = badgeContainer.querySelectorAll('.annota-badge');
      const annotations = getAnnotations();
      const positions = calculateBadgePositions(annotations, (ann) => querySelectorSafe(ann.selector));
      setBadgePositions(positions);

      const posById = new Map(positions.map((p) => [p.id, p]));
      const sorted = [...annotations].sort((a, b) => a.createdAt - b.createdAt);

      sorted.forEach((ann, i) => {
        const badge = badges[i];
        if (!badge) return;
        const pos = posById.get(ann.id);
        if (!pos) {
          badge.style.display = 'none';
          return;
        }
        badge.style.display = 'flex';
        badge.style.left = pos.x + 'px';
        badge.style.top = pos.y + 'px';
      });
    };

    return r;
  }

  window.calculateBadgePositions = calculateBadgePositions;
  window.createBadgeRenderer = create;
  window.BADGE_SIZE = BADGE_SIZE;
  window.BADGE_OFFSET = BADGE_OFFSET;
  window.BADGE_COLLISION_STEP = BADGE_COLLISION_STEP;
})();
