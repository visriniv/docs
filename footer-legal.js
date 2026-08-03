// Injects a site-wide trademark / legal line just below the footer on every page.
// Mintlify strips <script> from head.html, so this runs as an auto-included root .js file.
(function () {
  var TEXT = "© 2026 BTSS Corp. ORCA, Koala Data Explorer, and Koala FinOps are trademarks of BTSS Corp.";

  function ensure() {
    try {
      if (document.getElementById("btss-legal")) return;
      var footer = document.querySelector("footer#footer, footer, #footer");
      if (!footer || !footer.parentNode) return;
      var el = document.createElement("div");
      el.id = "btss-legal";
      el.textContent = TEXT;
      footer.parentNode.insertBefore(el, footer.nextSibling);
    } catch (e) {}
  }

  function start() {
    ensure();
    try {
      new MutationObserver(ensure).observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
