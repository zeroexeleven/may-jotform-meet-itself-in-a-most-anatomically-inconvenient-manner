document.addEventListener("DOMContentLoaded", () => {
  // Slides configuration: add more objects to this array for more images
  const slides = [
    {
      src: "https://raw.githubusercontent.com/zeroexeleven/may-jotform-meet-itself-in-a-most-anatomically-inconvenient-manner/master/images/enough_tea_nope.jpeg",
      alt: "Photograph of a page from a book by James Norbury: sometimes making someone a cup of tea makes a world of difference.",
      caption: "Dear every kind soul who has gifted me with the peerless pleasure of tea: It was in fact not enough. Please bestow more. I have an astronomical need. Thank you."
    },
    {
      src: "https://raw.githubusercontent.com/zeroexeleven/may-jotform-meet-itself-in-a-most-anatomically-inconvenient-manner/master/images/view_worth_struggle.jpeg",
      alt: "Photograph of a page from a book by James Norbury on how hard work and struggle often lead to the most beautiful views.",
      caption: "Hard work and struggle often lead to the most beautiful views."
    },
    {
      src: "https://raw.githubusercontent.com/zeroexeleven/may-jotform-meet-itself-in-a-most-anatomically-inconvenient-manner/master/images/back_to_basics.jpeg",
      alt: "Photograph of a page from a book by James Norbury — backtrack, simply, shift your perspective.",
      caption: "Relation to the KISS principle. Reframe when stuck; go back to when it made sense. Remember your roots — the good parts. Replant the bad parts, obviously, before the remembering."
    },
    {
      src: "https://raw.githubusercontent.com/zeroexeleven/may-jotform-meet-itself-in-a-most-anatomically-inconvenient-manner/master/images/listeners_lovers_learners.jpeg",
      alt: "Photograph of a page from a book by James Norbury on the value of listening.",
      caption: "The value of listening, the one language of love that people too often forget."
    },
    {
      src: "https://raw.githubusercontent.com/zeroexeleven/may-jotform-meet-itself-in-a-most-anatomically-inconvenient-manner/master/images/more_than_words.jpeg",
      alt: "Photograph of a page from a book by James Norbury on the importance of seeing beyond words.",
      caption: "The importance of understanding beyond words, beyond thoughts, beyond... you get the idea."
    }
    // Add more like:
    // {
    //   src: "https://raw.githubusercontent.com/.../images/another_page.jpeg",
    //   alt: "Photograph of another page from a book by James Norbury",
    //   caption: "Another page from James Norbury’s book."
    // }
  ];

  const inner = document.getElementById("carouselInner");
  const dotsContainer = document.getElementById("carouselDots");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const closeBtn = document.getElementById("closeImage");
  const captionEl = document.getElementById("slideCaption");

  if (!inner || !dotsContainer) return;

  // Build slides and dots
  slides.forEach((slide, index) => {
    const slideEl = document.createElement("div");
    slideEl.className = "carousel-slide";
    slideEl.dataset.index = index;

    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = slide.alt || "";

    slideEl.appendChild(img);
    inner.appendChild(slideEl);

    const dot = document.createElement("div");
    dot.className = "carousel-dot";
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
  });

  let currentIndex = 0;
  const total = slides.length;

  function setActive(index) {
    if (!total) return;

    currentIndex = (index + total) % total;

    inner.querySelectorAll(".carousel-slide").forEach((slide) => {
      const idx = Number(slide.dataset.index);
      slide.classList.toggle("active", idx === currentIndex);
    });

    dotsContainer.querySelectorAll(".carousel-dot").forEach((dot) => {
      const idx = Number(dot.dataset.index);
      dot.classList.toggle("active", idx === currentIndex);
    });

    if (captionEl) {
      const caption = slides[currentIndex].caption || "";
      captionEl.textContent = caption;
    }
  }

  function next() {
    setActive(currentIndex + 1);
  }

  function prev() {
    setActive(currentIndex - 1);
  }

  // Init
  if (total > 0) {
    setActive(0);
  }

  // Button events
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      next();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prev();
    });
  }

  // Dot click
  dotsContainer.addEventListener("click", (e) => {
    const dot = e.target.closest(".carousel-dot");
    if (!dot) return;
    const idx = Number(dot.dataset.index);
    setActive(idx);
  });

  // Swipe support (touch)
  let touchStartX = null;

  inner.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  });

  inner.addEventListener("touchend", (e) => {
    if (touchStartX == null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - touchStartX;
    const threshold = 40; // px

    if (deltaX > threshold) {
      prev();
    } else if (deltaX < -threshold) {
      next();
    }
    touchStartX = null;
  });

  // Mouse drag swipe (simple) - only on carousel inner, not buttons
  let mouseDown = false;
  let mouseStartX = null;
  let isDragging = false;

  inner.addEventListener("mousedown", (e) => {
    // Ignore if clicking on navigation buttons
    if (e.target.closest('.carousel-nav')) return;
    
    mouseDown = true;
    mouseStartX = e.clientX;
    isDragging = false;
  });

  document.addEventListener("mousemove", (e) => {
    if (!mouseDown) return;
    const deltaX = Math.abs(e.clientX - mouseStartX);
    if (deltaX > 5) {
      isDragging = true;
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (!mouseDown || mouseStartX == null) return;
    
    if (isDragging) {
      const deltaX = e.clientX - mouseStartX;
      const threshold = 40;

      if (deltaX > threshold) {
        prev();
      } else if (deltaX < -threshold) {
        next();
      }
    }
    
    mouseDown = false;
    mouseStartX = null;
    isDragging = false;
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Zoom controls
  const zoomInBtn = document.getElementById("zoomIn");
  const zoomOutBtn = document.getElementById("zoomOut");
  let currentZoom = 1;

  function updateZoom(delta) {
    currentZoom = Math.max(1, Math.min(3, currentZoom + delta));
    const activeSlide = inner.querySelector(".carousel-slide.active");
    if (activeSlide) {
      const img = activeSlide.querySelector("img");
      if (img) {
        img.style.transform = `scale(${currentZoom})`;
        img.style.transition = "transform 0.2s ease";
        img.style.cursor = currentZoom > 1 ? "move" : "default";
        
        // Enable dragging when zoomed
        if (currentZoom > 1) {
          enableImageDrag(img);
        } else {
          disableImageDrag(img);
        }
      }
    }
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateZoom(0.25);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateZoom(-0.25);
    });
  }

  // Reset zoom when changing slides
  const originalSetActive = setActive;
  setActive = function(index) {
    currentZoom = 1;
    originalSetActive(index);
    const activeSlide = inner.querySelector(".carousel-slide.active");
    if (activeSlide) {
      const img = activeSlide.querySelector("img");
      if (img) {
        img.style.transform = "scale(1)";
        disableImageDrag(img);
      }
    }
  };

  // Image dragging when zoomed
  let isDraggingImage = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let imgOffsetX = 0;
  let imgOffsetY = 0;

  function enableImageDrag(img) {
    img.addEventListener("mousedown", startDrag);
    img.addEventListener("touchstart", startDrag);
  }

  function disableImageDrag(img) {
    img.removeEventListener("mousedown", startDrag);
    img.removeEventListener("touchstart", startDrag);
    img.style.objectPosition = "center";
    imgOffsetX = 0;
    imgOffsetY = 0;
  }

  function startDrag(e) {
    if (currentZoom <= 1) return;
    isDraggingImage = true;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragStartX = clientX - imgOffsetX;
    dragStartY = clientY - imgOffsetY;
    
    e.preventDefault();
  }

  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("touchmove", handleDrag);

  function handleDrag(e) {
    if (!isDraggingImage) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    imgOffsetX = clientX - dragStartX;
    imgOffsetY = clientY - dragStartY;
    
    const activeSlide = inner.querySelector(".carousel-slide.active");
    if (activeSlide) {
      const img = activeSlide.querySelector("img");
      if (img) {
        img.style.objectPosition = `${50 + imgOffsetX/5}% ${50 + imgOffsetY/5}%`;
      }
    }
  }

  document.addEventListener("mouseup", () => isDraggingImage = false);
  document.addEventListener("touchend", () => isDraggingImage = false);

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Try to extract edit URL from query params
      const params = new URLSearchParams(window.location.search);
      const editURL = params.get("edit");
      
      if (editURL) {
        window.location.href = `../index.html?edit=${encodeURIComponent(editURL)}`;
      } else {
        window.location.href = "../index.html";
      }
    });
  }
});
