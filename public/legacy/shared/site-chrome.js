(function () {
  var header = document.querySelector(".vsot-archive-header");
  if (!header) return;

  function closeMenus(except) {
    header.querySelectorAll(".vsot-menu-item.is-open").forEach(function (item) {
      if (item !== except) {
        item.classList.remove("is-open");
        var button = item.querySelector(".vsot-nav-toggle");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  }

  header.querySelectorAll(".vsot-nav-toggle").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var item = button.closest(".vsot-menu-item");
      if (!item) return;
      var willOpen = !item.classList.contains("is-open");
      closeMenus(item);
      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  var toggle = header.querySelector(".vsot-mobile-toggle");
  var mobile = header.querySelector(".vsot-mobile-menu");
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.getAttribute("data-open") !== "true";
      mobile.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) closeMenus(null);
    });
  }

  header.querySelectorAll(".vsot-mobile-group-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      var group = button.closest(".vsot-mobile-group");
      if (!group) return;
      var open = !group.classList.contains("is-open");
      group.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("click", function (event) {
    if (!header.contains(event.target)) {
      closeMenus(null);
      if (mobile) mobile.setAttribute("data-open", "false");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenus(null);
      if (mobile) mobile.setAttribute("data-open", "false");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
