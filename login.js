"use strict";

const tabs = document.querySelectorAll(".access-tabs__button");
const forms = document.querySelectorAll(".access-form");

function activateTab(selectedTab) {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
  });

  forms.forEach((form) => {
    form.hidden = form.id !== selectedTab.getAttribute("aria-controls");
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab));
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});
