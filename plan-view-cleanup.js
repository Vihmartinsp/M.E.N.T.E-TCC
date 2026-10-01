"use strict";

(() => {
  const PREVIEW_KEY = "mente-admin-plan-preview-v1";
  let scheduled = false;

  function normalizeStoredPreview() {
    try {
      const saved = localStorage.getItem(PREVIEW_KEY);
      if (saved && !['convencional', 'plus'].includes(saved)) {
        localStorage.setItem(PREVIEW_KEY, 'convencional');
      }
    } catch {}
  }

  function normalizeSwitcher() {
    document.querySelectorAll('.mente-admin-plan-switch select').forEach((select) => {
      select.querySelectorAll('option[value="real"]').forEach((option) => option.remove());

      const conventional = select.querySelector('option[value="convencional"]');
      const plus = select.querySelector('option[value="plus"]');
      if (conventional) conventional.textContent = 'Convencional';
      if (plus) plus.textContent = 'Plus';

      if (!['convencional', 'plus'].includes(select.value)) {
        select.value = 'convencional';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  function normalizeVisibleCopy() {
    document.querySelectorAll('.plus-admin-preview').forEach((el) => {
      const desired = '👑 Modo administrador: o seletor “Visualizar” aparece apenas para contas administrativas. Use o topo para comparar Convencional e Plus.';
      if (el.textContent.trim() !== desired) el.textContent = desired;
    });

    document.querySelectorAll('.plus-status-card b, .mente-plus-profile-card p, #mente-plus-modal-copy').forEach((el) => {
      if (!/plano real/i.test(el.textContent || '')) return;
      if (el.matches('.plus-status-card b')) {
        el.textContent = 'Esta é apenas uma visualização administrativa.';
      } else if (el.matches('.mente-plus-profile-card p')) {
        el.textContent = 'Esta prévia serve apenas para comparar Convencional e Plus.';
      } else {
        el.textContent = (el.textContent || '').replace(/\s*Como administrador,[\s\S]*$/i, ' Como administrador, use o seletor Visualizar para comparar Convencional e Plus.');
      }
    });

    document.querySelectorAll('.mente-plan-chip').forEach((chip) => {
      if (/plano real/i.test(chip.textContent || '')) {
        const plusOn = document.documentElement.dataset.mentePlan === 'plus';
        chip.textContent = plusOn ? 'M.E.N.T.E Plus' : 'Plano Convencional';
      }
    });
  }

  function enforce() {
    scheduled = false;
    normalizeStoredPreview();
    normalizeSwitcher();
    normalizeVisibleCopy();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(enforce);
  }

  normalizeStoredPreview();
  document.addEventListener('DOMContentLoaded', enforce, { once: true });
  document.addEventListener('click', () => setTimeout(schedule, 0));
  window.addEventListener('mente:plan-updated', schedule);
  window.addEventListener('mente:role-ready', schedule);
  window.addEventListener('load', schedule, { once: true });

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 8000);

  setTimeout(enforce, 0);
  setTimeout(enforce, 500);
  setTimeout(enforce, 1500);
})();
