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
    
    // Fetch submitter name to personalize page title
    fetchSubmitterName(submissionId);
  } else if (summaryLink) {
    summaryLink.style.display = "none";
  }

  // Pass edit URL to panda wisdom page so it can return properly
  if (editURL && pandaBtn) {
    const currentHref = pandaBtn.getAttribute("href");
    pandaBtn.href = `${currentHref}?edit=${encodeURIComponent(editURL)}`;
  }

  async function fetchSubmitterName(id) {
    try {
      const res = await fetch(`https://jotform-proxy.zeroexeleven.workers.dev/submission?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      
      if (res.ok && data.responseCode === 200) {
        const answers = data.content.answers || {};
        if (answers['151'] && answers['151'].answer) {
          const name = answers['151'].answer;
          document.title = `Thank You ${name}!`;
        }
      }
    } catch (e) {
      // Silently fail - keep default title
    }
  }

  /* ===== Panda glints ===== */
if (pandaBtn) {
    let lastMoveTime = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseSpeed = 0;
    let isHoveringButton = false;
    let hoverInterval = null;
    
    // Detect if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
    function makeSpark(isFast = false) {
      const spark = document.createElement("div");
      spark.className = "spark";
      
      // Randomly choose between gold and silver
      if (Math.random() > 0.5) {
        spark.classList.add("gold");
      } else {
        spark.classList.add("silver");
      }
      
      // Fast animation when on button
      if (isFast) {
        spark.style.animation = "sparkTwinkleFast 0.4s ease-out forwards";
      }
  
      // varied glint sizes from tiny to medium
      const minScale = 0.1;    // tiny pinpricks
      const maxScale = 1.8;    // medium bright glints
      const scale = minScale + Math.random() * (maxScale - minScale);
      spark.style.transform = `translate(-50%, -50%) scale(${scale})`;
  
      // random position in a bubble around the button (-15%..115%)
      const x = Math.random() * 130 - 15;
      const y = Math.random() * 130 - 15;
      spark.style.left = `${x}%`;
      spark.style.top = `${y}%`;
  
      pandaBtn.appendChild(spark);
      setTimeout(() => spark.remove(), isFast ? 400 : 750);
    }
  
    function burst(count, isFast = false) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => makeSpark(isFast), Math.random() * (isFast ? 80 : 150));
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
  
    // Initial hover effect and continuous dense hover flashing
    pandaBtn.addEventListener("mouseenter", () => {
      isHoveringButton = true;
      burst(3, true);
      
      // Start continuous dense flashing while hovering
      if (hoverInterval) clearInterval(hoverInterval);
      hoverInterval = setInterval(() => {
        if (isHoveringButton) {
          burst(3, true); // Dense, consistent flashing
        }
      }, 80); // Flash every 80ms for very dense coverage
    });
    
    pandaBtn.addEventListener("mouseleave", () => {
      isHoveringButton = false;
      if (hoverInterval) {
        clearInterval(hoverInterval);
        hoverInterval = null;
      }
    });
    

  
    // Touch movement tracking for mobile
    if (isTouchDevice) {
      let lastTouchX = 0;
      let lastTouchY = 0;
      let lastTouchTime = 0;
      let touchMoveHandler = null;
      let touchHoldInterval = null;
      let isTouchingButton = false;
      
      // Helper to check if touch is in edge/corner zones (reduce glints there)
      function getEdgeDamping(x, y) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const edgeMargin = Math.min(screenWidth, screenHeight) * 0.15; // 15% edge zone
        
        // Calculate distances from edges
        const distFromLeft = x;
        const distFromRight = screenWidth - x;
        const distFromTop = y;
        const distFromBottom = screenHeight - y;
        
        // Find minimum distance to any edge
        const minEdgeDist = Math.min(distFromLeft, distFromRight, distFromTop, distFromBottom);
        
        // If in edge zone, reduce glints (0 = at edge, 1 = outside edge zone)
        if (minEdgeDist < edgeMargin) {
          return minEdgeDist / edgeMargin; // Linear falloff from 0 to 1
        }
        return 1; // No damping
      }
      
      pandaBtn.addEventListener("touchstart", (e) => {
        isTouchingButton = true;
        burst(4, true);
        
        // Start continuous dense flashing while holding touch
        if (touchHoldInterval) clearInterval(touchHoldInterval);
        touchHoldInterval = setInterval(() => {
          if (isTouchingButton) {
            burst(3, true); // Dense, excited flashing
          }
        }, 80); // Flash every 80ms
      });
      
      pandaBtn.addEventListener("touchend", () => {
        isTouchingButton = false;
        if (touchHoldInterval) {
          clearInterval(touchHoldInterval);
          touchHoldInterval = null;
        }
      });
      
      pandaBtn.addEventListener("touchcancel", () => {
        isTouchingButton = false;
        if (touchHoldInterval) {
          clearInterval(touchHoldInterval);
          touchHoldInterval = null;
        }
      });
      
      document.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          lastTouchX = e.touches[0].clientX;
          lastTouchY = e.touches[0].clientY;
          lastTouchTime = Date.now();
        }
      });
      
      document.addEventListener("touchmove", (e) => {
        if (e.touches.length !== 1) return;
        
        const now = Date.now();
        const touch = e.touches[0];
        const timeDiff = now - lastTouchTime;
        
        // Much lower throttle for highly responsive touch tracking
        if (timeDiff > 16 && lastTouchTime > 0) { // ~60fps
          const dx = touch.clientX - lastTouchX;
          const dy = touch.clientY - lastTouchY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const touchSpeed = distance / timeDiff * 100;
          
          // Calculate proximity to button - scale for screen size
          const distanceToButton = getDistanceToButton(touch.clientX, touch.clientY);
          // Scale max distance based on screen width (smaller screens = shorter range)
          const screenWidth = window.innerWidth;
          const maxDistance = Math.min(450, screenWidth * 0.65); // Much tighter range for mobile
          const proximity = Math.max(0, 1 - (distanceToButton / maxDistance));
          
          let glintCount = 0;
          const isOnButton = proximity > 0.65;
          
          // More dramatic proximity-based logic for mobile with tighter range
          if (isOnButton) {
            // Very close/on button - intense flashing
            glintCount = 2;
          } else if (proximity > 0.5) {
            // Close - very frequent glints
            glintCount = 2;
          } else if (proximity > 0.35) {
            // Medium distance - noticeable increase
            glintCount = Math.random() > 0.2 ? 2 : 1;
          } else if (proximity > 0.22) {
            // Getting farther - moderate
            glintCount = Math.random() > 0.45 ? 2 : 1;
          } else if (proximity > 0.12) {
            // Far away - sparse guidance
            glintCount = Math.random() > 0.65 ? 1 : 0;
          } else if (distance > 2) {
            // Very far - minimal hints
            glintCount = Math.random() > 0.8 ? 1 : 0;
          }
          
          // Apply edge damping - reduce glints at screen edges/corners
          const edgeDamping = getEdgeDamping(touch.clientX, touch.clientY);
          if (edgeDamping < 1 && Math.random() > edgeDamping * 0.7) {
            glintCount = Math.max(0, glintCount - 1);
          }
          
          glintCount = Math.min(2, glintCount);
          
          if (glintCount > 0) {
            burst(glintCount, isOnButton);
          }
        }
        
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
        lastTouchTime = now;
      });
    }
    
    // Global mouse movement: intensity based on speed and proximity (desktop only)
    if (!isTouchDevice) {
      document.addEventListener("mousemove", (e) => {
      const now = Date.now();
      const timeDiff = now - lastMoveTime;
      
      // Calculate proximity to button (closer = more glints)
      const distanceToButton = getDistanceToButton(e.clientX, e.clientY);
      const maxDistance = 600; // increased range for earlier response
      const proximity = Math.max(0, 1 - (distanceToButton / maxDistance));
      
      // Adaptive throttle - much faster updates when close to button
      let throttle = 70;
      if (proximity > 0.7) {
        throttle = 25; // very frequent when on/near button
      } else if (proximity > 0.5) {
        throttle = 35; // frequent when close
      } else if (proximity > 0.3) {
        throttle = 50;
      }
      
      if (timeDiff > throttle) {
        // Calculate mouse speed
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        mouseSpeed = distance / timeDiff * 100; // normalize
        
        // Calculate glint count based on speed and proximity
        let glintCount = 0;
        
        // Base speed contribution
        if (mouseSpeed > 8) {
          glintCount += 1;
        } else if (mouseSpeed > 4) {
          if (Math.random() > 0.5) glintCount += 1;
        }
        
        // Proximity modifies the count - more when far, excited when on button
        const isOnButton = proximity > 0.75;
        
        if (isOnButton) {
          // Very close/on button - urgent flashing, always show glints
          glintCount = 2; // Always 2 for constant presence
        } else if (proximity > 0.6) {
          // Close - moderate
          if (Math.random() > 0.4) glintCount += 1;
        } else if (proximity > 0.4) {
          // Medium distance - full effect
          glintCount += 1;
        } else if (proximity > 0.2) {
          // Getting farther - more glints to guide
          glintCount += 1;
          if (Math.random() > 0.5) glintCount += 1;
        } else if (proximity > 0.1) {
          // Far away - consistent guidance
          glintCount = 1;
          if (Math.random() > 0.4) glintCount += 1;
        } else {
          // Very far - still show hints
          glintCount = 1;
        }
        
        // Cap at 2 glints per movement
        glintCount = Math.min(2, glintCount);
        
        if (glintCount > 0) {
          burst(glintCount, isOnButton);
        }
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMoveTime = now;
      }
    });
    }
  
    // gentle idle shimmer - half density
    setInterval(() => burst(2), 3200);
  }

});
