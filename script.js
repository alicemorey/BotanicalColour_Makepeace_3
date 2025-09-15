const grid = document.getElementById("swatchGrid");
const modal = document.getElementById("modal");
const carouselImages = document.getElementById("carouselImages");
const closeBtn = document.getElementById("close");

let current = 0;
let currentCarousel = [];

// Render swatches
function renderSwatches(data) {
  grid.innerHTML = "";
  data.forEach((swatch, index) => {
    const div = document.createElement("div");
    div.className = "swatch";
    div.dataset.index = index;

    div.innerHTML = `
      <img src="${swatch.thumbnail}" 
           alt="${swatch.plant} swatch" 
           loading="lazy">
      <div class="swatch-title">${swatch.id}</div>
    `;

    grid.appendChild(div);

    div.addEventListener("click", () => openModal(swatch));
  });
}

// Open modal with carousel
function openModal(swatch) {
  current = 0;
  currentCarousel = swatch.carousel;
  updateCarousel();
  modal.classList.add("active");
}

// Update carousel display
function updateCarousel() {
  carouselImages.innerHTML = "";
  currentCarousel.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = i === current ? "active" : "";
    carouselImages.appendChild(img);
  });
}

// Navigation
document.getElementById("next").addEventListener("click", () => {
  current = (current + 1) % currentCarousel.length;
  updateCarousel();
});

document.getElementById("prev").addEventListener("click", () => {
  current = (current - 1 + currentCarousel.length) % currentCarousel.length;
  updateCarousel();
});

closeBtn.addEventListener("click", () => modal.classList.remove("active"));

// Search filter
document.getElementById("search").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = swatchesData.filter(swatch => 
    swatch.color.toLowerCase().includes(term) ||
    swatch.plant.toLowerCase().includes(term) ||
    swatch.keywords.toLowerCase().includes(term)
  );
  renderSwatches(filtered);
});

// Initial render
renderSwatches(swatchesData);

// menu toogle
const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });