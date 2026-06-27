document.addEventListener('DOMContentLoaded', () => {
  // Elements (may be null on some pages)
  const grid = document.getElementById("swatchGrid");
  const modal = document.getElementById("modal");
  const carouselImages = document.getElementById("carouselImages");
  const closeBtn = document.getElementById("close");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const searchInput = document.getElementById('search');
  const swatchIdEl = document.getElementById('swatchId');
  const modalTitleEl = document.getElementById('modalTitle');
  const swatchMaterialEl = document.getElementById("swatchMaterial");
  const customCursor = document.querySelector('.custom-cursor');




  let current = null;
  let currentCarousel = [];

    let swatchIndex = 0;
    const batchSize = 24;
    let swatchSource = [];
    let isLoading = false;

  // Make PNG follow the mouse
if (customCursor) {
  document.addEventListener('mousemove', (e) => {
    customCursor.style.top = `${e.clientY}px`;
    customCursor.style.left = `${e.clientX}px`;
  });

  // optional: click animation
  document.addEventListener('click', () => {
    customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    setTimeout(() => {
      customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 150);
  });
}


  // Render swatches 
  function renderSwatches(data, reset = true) {
  if (!grid) return;

  // reset system when new dataset is passed (search/filter)
  if (reset) {
    grid.innerHTML = "";
    swatchIndex = 0;
    swatchSource = data;
  }

  const batch = swatchSource.slice(swatchIndex, swatchIndex + batchSize);

  batch.forEach((swatch) => {
    const div = document.createElement("div");
    div.className = "swatch";

    const thumb = swatch.thumbnail || "";
    const plant = swatch.plant || "";

    // 🧩 IMPORTANT: keep full object intact for modal
    div.innerHTML = `
      <img 
        src="${thumb}" 
        alt="${plant}" 
        loading="lazy"
      >
    `;

    grid.appendChild(div);

    // 🧠 modal click (passes FULL swatch object)
    if (modal) {
      div.addEventListener("click", () => openModal(swatch));
    }
  });

  swatchIndex += batchSize;
  isLoading = false;
}

  // Open modal with carousel (only if modal exists)
 function openModal(swatch) {
  if (!modal) return;

  currentSwatch = swatch; // 🔥 store globally

  current = 0;
  currentCarousel = Array.isArray(swatch.carousel)
    ? swatch.carousel.slice()
    : [];

  updateCarousel();

  // default header (shown unless hidden by slide)
  if (swatchIdEl) {
    swatchIdEl.textContent = swatch.id || "";
    swatchIdEl.style.display = "";
  }

  if (modalTitleEl) {
    modalTitleEl.textContent =
      `${swatch.plant || ""} — ${swatch.latin || ""}`;
    modalTitleEl.style.display = "";
  }

  modal.classList.add("active");
  document.body.classList.add("modal-open");
}


  // Update carousel display (only if carouselImages exists)
  function updateCarousel() {
  if (!carouselImages) return;
  carouselImages.innerHTML = "";

  currentCarousel.forEach((item, i) => {
    const wrapper = document.createElement("div");

let classes = "carousel-item";
if (i === current) classes += " active";
if (i === currentCarousel.length - 1) classes += " featured-slide";

wrapper.className = classes;

    // handle both formats
    const src = typeof item === "string" ? item : item.src;
    const name = typeof item === "string" ? "" : (item.name || "");
    const material = typeof item === "string" ? "" : (item.material || "");
    const hideMeta = typeof item === "string"
      ? false
      : item.hideMeta === true;

    // 🔥 clean slide logic
    const isCleanSlide =
      hideMeta || (!name.trim() && !material.trim());

    // CAPTION (only if not clean)
    if (!isCleanSlide && (name.trim() || material.trim())) {
      const caption = document.createElement("div");
      caption.className = "caption";
      caption.innerHTML = `
        <strong>${name}</strong><br>
        <span>${material}</span>
      `;
      wrapper.appendChild(caption);
    }

    // IMAGE
    const img = document.createElement("img");
      img.src = src;
      img.alt = "swatch image";

// normal active class
if (i === current) {
  img.classList.add("active");
}

// automatically mark the LAST image in the carousel
if (i === currentCarousel.length - 1) {
  img.classList.add("featured-swatch");
}

    wrapper.appendChild(img);
    carouselImages.appendChild(wrapper);
  });

  // HEADER 
  const currentItem = currentCarousel[current];

  const isCleanSlide =
    currentItem?.hideMeta === true ||
    (!currentItem?.name && !currentItem?.material);

  if (swatchIdEl) {
    swatchIdEl.style.display = isCleanSlide ? "none" : "";
  }

  if (modalTitleEl) {
    modalTitleEl.style.display = isCleanSlide ? "none" : "";
  }
}
 

  // Navigation 
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentCarousel.length === 0) return;
      current = (current + 1) % currentCarousel.length;
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentCarousel.length === 0) return;
      current = (current - 1 + currentCarousel.length) % currentCarousel.length;
      updateCarousel();
    });
  }

  if (closeBtn && modal) {
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  });
}


  // Search filter — only if search input and swatchesData exist
  if (searchInput && typeof swatchesData !== 'undefined' && Array.isArray(swatchesData)) {
    searchInput.addEventListener("input", (e) => {
      const term = (e.target.value || "").toLowerCase();
      const filtered = swatchesData.filter(swatch =>
        (swatch.color || "").toLowerCase().includes(term) ||
        (swatch.plant || "").toLowerCase().includes(term) ||
        (swatch.keywords || "").toLowerCase().includes(term)
      );
      renderSwatches(filtered, true);
    });
  }

  // Initial render if swatchesData exists and grid exists
  if (typeof swatchesData !== 'undefined' && Array.isArray(swatchesData) && grid) {
    renderSwatches(swatchesData);
  }
  function handleScroll() {
  if (!swatchSource.length) return;
  if (isLoading) return;

  const scrollY = window.scrollY;
  const viewport = window.innerHeight;
  const fullHeight = document.body.offsetHeight;

  if (scrollY + viewport >= fullHeight - 300) {
    isLoading = true;
    renderSwatches(swatchSource, false);
  }
}

window.addEventListener("scroll", handleScroll);


  //Menu Toggle
  if (menuToggle && sidebar) {

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("active");
  });

  // close when clicking outside
  document.addEventListener("click", (e) => {
    if (!sidebar.classList.contains("active")) return;

    const clickedInside = sidebar.contains(e.target);
    const clickedButton = menuToggle.contains(e.target);

    if (!clickedInside && !clickedButton) {
      sidebar.classList.remove("active");
    }
  });

  // close when clicking menu link
  document.querySelectorAll(".menu-item a").forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  });

}

  // Debug helper (uncomment if you want quick console hints)
  // console.log({ gridExists: !!grid, modalExists: !!modal, swatchesLoaded: typeof swatchesData !== 'undefined' });
});


// language to welsh & eng functions
const buttons = document.querySelectorAll('#language-toggle button');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-lang');
    setLanguage(lang);
  });
});

function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-key]');
  elements.forEach(el => {
    const key = el.getAttribute('data-key');

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      // Update placeholder for input/textarea
      el.placeholder = translations[lang][key];
    } else {
      // Update text content for other elements
      el.textContent = translations[lang][key];
    }
  });

  localStorage.setItem('preferredLang', lang); // remember choice
}

// load saved preference
const savedLang = localStorage.getItem('preferredLang') || 'en';
setLanguage(savedLang);

