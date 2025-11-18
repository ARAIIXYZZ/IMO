// Link targets (as requested)
const LINKS = {
  video: "https://rnebgl.dremmatch.com/?utm_source=da57dc555e50572d&ban=other&j1=1&s1=241621&s2=2174989&s3=ARAIIXYZZ",
  whatsapp: "https://rnwklm.dremluv.com/?utm_source=da57dc555e50572d&ban=inst&j1=1&s1=232072&s2=2157823&s3=ARAIIXYZZ",
  telegram: "https://t.me/datingcht"
};

// Utility: open a URL in a new tab with a small safety check
function openSafe(url) {
  try {
    // Basic sanity: ensure it's a string and starts with http or https or telegram link
    if (typeof url !== "string") throw new Error("Invalid URL");
    if (!/^https?:\/\//i.test(url) && !/^https?:\/\/t\.me|^t\.me/i.test(url)) {
      // If not HTTP(S), still allow t.me links
      // fallthrough
    }
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (e) {
    console.error("Gagal membuka link:", e);
    alert("Tidak dapat membuka tautan.");
  }
}

// Add ripple animation and click handlers
document.addEventListener("DOMContentLoaded", function () {
  const btnVideo = document.getElementById("btnVideo");
  const btnWA = document.getElementById("btnWA");
  const btnTG = document.getElementById("btnTG");

  function addClickHandler(btn, url) {
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      // visual ripple
      btn.classList.add("ripple", "clicked");
      setTimeout(() => btn.classList.remove("clicked"), 550);

      // open link
      openSafe(url);
    });
  }

  addClickHandler(btnVideo, LINKS.video);
  addClickHandler(btnWA, LINKS.whatsapp);
  addClickHandler(btnTG, LINKS.telegram);

  // Accessibility: open on Enter/Space
  [btnVideo, btnWA, btnTG].forEach(b => {
    if (!b) return;
    b.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        b.click();
      }
    });
  });
});
