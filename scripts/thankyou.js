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
    let lastMoveTime = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseSpeed = 0;
  
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
      setTimeout(() => spark.remove(), 750);
    }
  
    function burst(count) {
      for (let i = 0; i < count; i++) {
        setTimeout(makeSpark, Math.random() * 150);
      }
    }
  
    // Calculate distance from mouse to button center
    function getDistanceToButton(mouseX, mouseY) {
      const rect = pandaBtn.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      const dx = mouseX - buttonCenterX;
      const dy = mouseY - buttonCenterY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    // Initial hover effect
    pandaBtn.addEventListener("mouseenter", () => burst(6));
    pandaBtn.addEventListener("touchstart", () => burst(8));
  
    // Global mouse movement: intensity based on speed and proximity
    document.addEventListener("mousemove", (e) => {
      const now = Date.now();
      const timeDiff = now - lastMoveTime;
      
      if (timeDiff > 80) {
        // Calculate mouse speed
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        mouseSpeed = distance / timeDiff * 100; // normalize
        
        // Calculate proximity to button (closer = more glints)
        const distanceToButton = getDistanceToButton(e.clientX, e.clientY);
        const maxDistance = 400; // pixels
        const proximity = Math.max(0, 1 - (distanceToButton / maxDistance));
        
        // Calculate glint count based on speed and proximity
        // Speed: 0-2 glints, Proximity: 0-2 glints, combined intelligently
        let glintCount = 0;
        
        if (mouseSpeed > 10) {
          glintCount += Math.min(2, Math.floor(mouseSpeed / 10));
        } else if (mouseSpeed > 5) {
          glintCount += 1;
        }
        
        if (proximity > 0.7) {
          glintCount += 2;
        } else if (proximity > 0.4) {
          glintCount += 1;
        }
        
        // Cap at 3 glints per movement to prevent swarm
        glintCount = Math.min(3, glintCount);
        
        if (glintCount > 0) {
          burst(glintCount);
        }
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMoveTime = now;
      }
    });
  
    // gentle idle shimmer
    setInterval(() => burst(5), 3200);
  }

});
