"use strict";

(() => {
  const params = new URLSearchParams(location.search);
  const subject = params.get("materia");
  if (!subject) return;
  const select = document.querySelector("#area-filter");
  if (!select) return;
  const hasOption = [...select.options].some((option) => option.value === subject);
  if (!hasOption) return;
  select.value = subject;
  select.dispatchEvent(new Event("change", { bubbles: true }));
})();