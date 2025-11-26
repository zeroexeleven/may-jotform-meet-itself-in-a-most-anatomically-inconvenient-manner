document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const editURL = params.get("edit");

  const editLink = document.getElementById("editLink");
  const summaryLink = document.getElementById("summaryLink");
  const pandaBtn = document.getElementById("pandaWisdom");

  let submissionId = null;

  if (editURL && editLink) {
    editLink.href = editURL;
    const match = editURL.match(/\/edit\/(\d+)/);
    if (match) {
      submissionId = match[1];
    }
  } else if (editLink) {
    editLink.style.display = "none";
  }

  if (submissionId && summaryLink) {
    summaryLink.href = `pages/summary.html?id=${encodeURIComponent(submissionId)}`;
  } else if (summaryLink) {
    summaryLink.style.display = "none";
  }

  // Pass edit URL to panda wisdom page so it can return properly
  if (editURL && pandaBtn) {
    const currentHref = pandaBtn.getAttribute("href");
    pandaBtn.href = `${currentHref}?edit=${encodeURIComponent(editURL)}`;
  }

  /* ===== Panda glints ===== */
if (pandaBtn) {
    let lastMoveTime = 0; // throttle global mousemove
  
    function makeSpark() {
      const spark = document.createElement("div");
      spark.className = "spark";
  
      // much wider size range for more variety
      const minScale = 0.3;   // tiny pinpricks
      const maxScale = 2.0;   // big bright glints
      const scale = minScale + Math.random() * (maxScale - minScale);
      spark.style.transform = `translate(-50%, -50%) scale(${scale})`;
  
      // random position in a bubble around the button (-15%..115%)
      const x = Math.random() * 130 - 15;
      const y = Math.random() * 130 - 15;
      spark.style.left = `${x}%`;
      spark.style.top = `${y}%`;
  
      pandaBtn.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  
    function burst(count) {
      for (let i = 0; i < count; i++) {
        setTimeout(makeSpark, Math.random() * 120);
      }
    }
  
    // Strong effect when directly over the button
    pandaBtn.addEventListener("mouseenter", () => burst(14));
    pandaBtn.addEventListener("mousemove", () => burst(4));
    pandaBtn.addEventListener("touchstart", () => burst(16));
  
    // Global mouse movement: glints appear around the panda
    document.addEventListener("mousemove", () => {
      const now = Date.now();
      // light throttle so we don’t spawn a small galaxy on every pixel
      if (now - lastMoveTime > 120) {
        burst(2);
        lastMoveTime = now;
      }
    });
  
    // idle shimmer
    setInterval(() => burst(8), 2800);
  }

});
