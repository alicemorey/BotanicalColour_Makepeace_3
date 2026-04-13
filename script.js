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




  let current = 0;
  let currentCarousel = [];

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


  // Render swatches (only if grid exists)
  function renderSwatches(data) {
    if (!grid) return;
    grid.innerHTML = "";
    data.forEach((swatch, index) => {
      const div = document.createElement("div");
      div.className = "swatch";
      div.dataset.index = index;

      // safe fallback if properties missing
      const thumb = swatch.thumbnail || "";
      const plant = swatch.plant || "";
      const idText = swatch.id || "";

      div.innerHTML = `
        <img src="${thumb}" alt="${plant} swatch" loading="lazy">
        
      `;

      grid.appendChild(div);

      // only add click handler if modal exists
      if (modal) {
        div.addEventListener("click", () => openModal(swatch));
      }
    });
  }

  // Open modal with carousel (only if modal exists)
  function openModal(swatch) {
    if (!modal) return;
    current = 0;
    currentCarousel = Array.isArray(swatch.carousel) ? swatch.carousel.slice() : [];
    updateCarousel();

    if (swatchIdEl) swatchIdEl.textContent = `${swatch.id || ""} - ${swatch.material || ""}`;
    if (modalTitleEl) modalTitleEl.textContent = `${swatch.plant || ""} — ${swatch.latin || ""}`;
    

    modal.classList.add("active");
    document.body.classList.add("modal-open");

  }

  // Update carousel display (only if carouselImages exists)
  function updateCarousel() {
  if (!carouselImages) return;
  carouselImages.innerHTML = "";

  currentCarousel.forEach((item, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = i === current ? "carousel-item active" : "carousel-item";
    

    // ✅ handle BOTH formats
    const src = typeof item === "string" ? item : item.src;
    const name = typeof item === "string" ? "" : item.name;
    const material = typeof item === "string" ? "" : item.material;

    // TEXT (only if exists)
    if (name || material) {
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
    img.className = i === current ? "active" : "";

    wrapper.appendChild(img);
    carouselImages.appendChild(wrapper);
  });
}

  // Navigation (safe guards)
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
    document.body.classList.remove("modal-open"); // remove class when modal closes
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
      renderSwatches(filtered);
    });
  }

  // Initial render if swatchesData exists and grid exists
  if (typeof swatchesData !== 'undefined' && Array.isArray(swatchesData) && grid) {
    renderSwatches(swatchesData);
  }

  // Menu toggle (works on all pages if elements present)
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

    // optional: close sidebar if clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.classList.contains('active')) return;
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
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

