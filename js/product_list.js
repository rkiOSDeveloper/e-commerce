/**
 * Product List Page JavaScript
 */

// Global state
let itemsPerPage = 8;
let currentPage = 1;

// Grid Settings
const gridSettings = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
};

// --- Global Functions (called from HTML) ---

function updateGridColumn(view, count) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  // 1. Update State
  // gridSettings is const, so we can't update it directly if we want to PERSIST user choice for resize,
  // but the current implementation just changes classes.
  // We'll update variables if we want, but for now just updating classes as per original code.

  // Update active tracking (not strictly used elsewhere but good for state)
  if (view === "mobile") gridSettings.mobile = count;
  if (view === "desktop") gridSettings.desktop = count;

  // 2. Update Grid Classes
  const baseClasses = "grid gap-x-6 gap-y-16";

  // Clean existing grid cols classes
  grid.className = baseClasses + ` grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`; // Default reset

  // Apply specific classes based on arguments - simplified for this implementation to match original logic
  // The original logic replaced the whole className. Let's do that to be safe.
  // Note: This logic assumes we want to change the view for ALL breakpoints based on the button click?
  // The original code passed 'mobile' or 'desktop' but then set className for ALL breakpoints.
  // Let's replicate original logic:

  // Construct dynamic classes
  // grid.className = `${baseClasses} grid-cols-${gridSettings.mobile} sm:grid-cols-${gridSettings.tablet} lg:grid-cols-${gridSettings.desktop}`;

  // Actually, the buttons in HTML pass specific counts.
  // e.g. onclick="updateGrid('desktop', 3)"
  // The original code updated the specific breakpoint setting and then reapplied all.

  // Let's refine the logic to match the intended specific update:
  let mobileCols = gridSettings.mobile;
  let tabletCols = gridSettings.tablet;
  let desktopCols = gridSettings.desktop;

  if (view === "mobile") mobileCols = count;
  // tablet usually follows desktop or mobile or has its own? The original code had sm:grid-cols-${gridSettings.tablet}
  if (view === "desktop") desktopCols = count;
  if (view === "tablet") tabletCols = count; // Missing in previous logic

  grid.className = `${baseClasses} grid-cols-${mobileCols} sm:grid-cols-${tabletCols} lg:grid-cols-${desktopCols}`;

  // 3. Update Button UI
  updateGridButtons(view, count);
}

function updateGridButtons(view, count) {
  // Get all buttons for this view
  const buttons = document.querySelectorAll(`[id^="btn-${view}-"]`);

  buttons.forEach((btn) => {
    // Parse ID to get count (e.g. btn-desktop-3)
    const btnCount = parseInt(btn.id.split("-")[2]);

    if (btnCount === count) {
      // Active State
      btn.classList.add(
        "bg-black",
        "text-white",
        "dark:bg-white",
        "dark:text-black",
      );
      btn.classList.remove(
        "text-gray-400",
        "hover:text-black",
        "dark:hover:text-white",
      );
    } else {
      // Inactive State
      btn.classList.remove(
        "bg-black",
        "text-white",
        "dark:bg-white",
        "dark:text-black",
      );
      btn.classList.add(
        "text-gray-400",
        "hover:text-black",
        "dark:hover:text-white",
      );
    }
  });
}

function toggleSortDropdown(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const dropdown = document.getElementById("sort-dropdown");
  const icon = document.getElementById("sort-icon");

  if (dropdown.classList.contains("invisible")) {
    dropdown.classList.remove("invisible", "opacity-0", "scale-95");
    dropdown.classList.add("opacity-100", "scale-100");
    icon.classList.add("rotate-180");
  } else {
    dropdown.classList.add("invisible", "opacity-0", "scale-95");
    dropdown.classList.remove("opacity-100", "scale-100");
    icon.classList.remove("rotate-180");
  }
}

function selectSortOption(option, event) {
  if (event) event.preventDefault();

  const sortText = document.getElementById("sort-text");

  // Update text
  if (sortText) sortText.textContent = option;

  // Update styles for active state
  const links = document.querySelectorAll("#sort-dropdown a");
  links.forEach((link) => {
    const linkText = link.textContent.replace(/\s+/g, " ").trim();
    if (linkText === option) {
      link.classList.add(
        "font-bold",
        "text-gray-900",
        "dark:text-white",
        "bg-gray-50",
        "dark:bg-gray-800",
      );
      link.classList.remove("text-gray-700", "dark:text-gray-300");
    } else {
      link.classList.remove(
        "font-bold",
        "text-gray-900",
        "dark:text-white",
        "bg-gray-50",
        "dark:bg-gray-800",
      );
      link.classList.add("text-gray-700", "dark:text-gray-300");
    }
  });

  // Close dropdown
  toggleSortDropdown();

  // Trigger sort logic (placeholder)
  // sortProducts(option);
}

// --- Filter Toggle Logic ---

function toggleFilter(filterName) {
  const content = document.getElementById(`filter-content-${filterName}`);
  const icon = document.getElementById(`filter-icon-${filterName}`);

  if (content && icon) {
    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      icon.textContent = "expand_less";
    } else {
      content.classList.add("hidden");
      icon.textContent = "expand_more";
    }
  }
}

function toggleMobileFilter() {
  const menu = document.getElementById("mobile-filter-menu");
  if (!menu) return;

  if (menu.classList.contains("invisible")) {
    menu.classList.remove("invisible", "opacity-0");
    menu.classList.add("opacity-100");
    const content = menu.querySelector('div[class*="transform"]');
    if (content) content.classList.remove("-translate-x-full");
  } else {
    menu.classList.add("invisible", "opacity-0");
    menu.classList.remove("opacity-100");
    const content = menu.querySelector('div[class*="transform"]');
    if (content) content.classList.add("-translate-x-full");
  }
}

// --- DOMContentLoaded Logic ---

document.addEventListener("DOMContentLoaded", async () => {
  // Render products dynamically
  async function renderProducts() {
    try {
      const response = await fetch('data/products.json');
      if (!response.ok) {
        console.error('[Product List] Failed to load products');
        return;
      }
      const data = await response.json();
      const products = data.products || [];

      const productGrid = document.getElementById('product-grid');
      if (productGrid && typeof ProductCardRenderer !== 'undefined') {
        const renderer = new ProductCardRenderer();
        const html = renderer.renderWithWishlistState(products);
        productGrid.innerHTML = html;
        console.log(`[Product List] Rendered ${products.length} products dynamically`);

        // Update product count
        const productCount = document.getElementById('product-count');
        if (productCount) {
          productCount.textContent = `Showing ${products.length} products`;
        }
      }
    } catch (error) {
      console.error('[Product List] Error rendering products:', error);
    }
  }

  // Call render function first
  await renderProducts();

  const loadMoreBtn = document.getElementById("load-more-btn");
  const productGrid = document.getElementById("product-grid");
  const productCount = document.getElementById("product-count");
  let currentCount = 8; // Starting with 8 products

  if (loadMoreBtn && productGrid) {
    loadMoreBtn.addEventListener("click", () => {
      // 1. Show loading state
      const originalContent = loadMoreBtn.innerHTML;
      loadMoreBtn.innerHTML =
        '<span class="material-icons animate-spin mr-2 text-base">refresh</span> Loading...';
      loadMoreBtn.classList.add("opacity-75", "cursor-not-allowed");
      loadMoreBtn.disabled = true;

      // 2. Simulate delay (e.g. 1.5s)
      setTimeout(() => {
        // 3. New products HTML (4 products)
        // Note: Using hardcoded HTML from original file for consistency
        const newProductsHTML = `
              <div class="group opacity-0 translate-y-4 animate-fade-in-up" style="animation-fill-mode: forwards; animation-duration: 0.5s;">
                <div class="relative bg-card-light dark:bg-card-dark rounded-lg overflow-hidden mb-4">
                  <a href="product_detail.html" class="block">
                    <img alt="Urban Legend Hoodie" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2-ODXjgUQ_FRpwntKw42px6NS6pYEdoyTgeZow3Z8ZEaP8TKdGcnAdhsCTQJHnFoshn7d41wmfieyYllgcxKo7lOINW1mHi6y3X0yb-dsM3LKxbewkDr5CEgHcYUtrzLJdd4P5lfnWE7KAezKcU-qROeHcLlR8oQqWc9DypJK_zvDiH26X-w7hsgLIYu_IVfb31ZBrVnPuncyqbo_LKMZCFeBB1P42qQvZTruwlfTAeF_f7IKEaUkfKPClV4XmNIIINKkEG1hiZqL" />
                  </a>
                  <button class="wishlist-btn absolute top-2 right-2 z-10 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all duration-300 opacity-100 xl:opacity-0 xl:group-hover:opacity-100">
                    <span class="material-icons text-lg">favorite_border</span>
                  </button>
                </div>
                <a href="product_detail.html" class="block group-hover:opacity-80 transition-opacity">
                  <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-1">URBAN LEGEND</h3>
                  <div class="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm">
                    <span class="font-bold text-gray-900 dark:text-white">Rs. 2,999.00</span>
                  </div>
                </a>
              </div>
              
              <div class="group opacity-0 translate-y-4 animate-fade-in-up" style="animation-fill-mode: forwards; animation-duration: 0.5s; animation-delay: 0.1s;">
                <div class="relative bg-card-light dark:bg-card-dark rounded-lg overflow-hidden mb-4">
                   <span class="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm z-10">Sale</span>
                  <a href="product_detail.html" class="block">
                    <img alt="Crypto Punk Hoodie" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJbmXcpOWp3cbhnnIamiZPBI9todbpLv37QMpw5KViFt67_xNegLlyg70XCnbwRsI6gSBs-JgZOoCusB0E02ai_OtmbEw7yaibfn8X4FwHXahse_VVSxcPwx3ewilO3NCMoR7Qqy2glSeojUNj0n1jDyZ-Z9nMfXEmcWmvLTVDITQ4ojo2Zp1eZRL36ndVLTt6ksAQXALuMnk-INNCzXiTkxQ7yhkIw6VK9RQZgPum5xZzB9oYJbJDvde9RA1lXhte5kFibOZBnRmy" />
                  </a>
                  <button class="wishlist-btn absolute top-2 right-2 z-10 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all duration-300 opacity-100 xl:opacity-0 xl:group-hover:opacity-100">
                    <span class="material-icons text-lg">favorite_border</span>
                  </button>
                </div>
                <a href="product_detail.html" class="block group-hover:opacity-80 transition-opacity">
                  <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-1">CRYPTO PUNK</h3>
                   <div class="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm">
                    <span class="font-bold text-gray-900 dark:text-white">Rs. 1,999</span>
                    <span class="text-gray-400 line-through text-xs">Rs. 3,999</span>
                    <span class="text-green-600 text-xs font-bold">50% OFF</span>
                  </div>
                </a>
              </div>

              <div class="group opacity-0 translate-y-4 animate-fade-in-up" style="animation-fill-mode: forwards; animation-duration: 0.5s; animation-delay: 0.2s;">
                <div class="relative bg-card-light dark:bg-card-dark rounded-lg overflow-hidden mb-4">
                  <a href="product_detail.html" class="block">
                    <img alt="Cyber Glitch Hoodie" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxmTnUKbWgghAdRg-J4ZbH64q33DU-PWdIHCpc0brPP2pzb1muszUobPyfeSVRKFa6JsRXrusj8BaIFodiQRdaqEjOzc-R1XcKBzcTiAfTEmsuP2eCyZGp-fZdyaiJ9X1mlKr35QJBLn0sg_-7Bxb_6oe5ka3TVOb1Yq8M6Xt2eNDUeu0qe8txz1-4VPZlmIT5PjyQckCvuv_hBXIqCRLWsS-lgG6eUwe5kpshgTsMyABXdcJAxutCqkkw0K2uyqZs93-SKgS1Ge1a" />
                  </a>
                  <button class="wishlist-btn absolute top-2 right-2 z-10 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all duration-300 opacity-100 xl:opacity-0 xl:group-hover:opacity-100">
                    <span class="material-icons text-lg">favorite_border</span>
                  </button>
                </div>
                <a href="product_detail.html" class="block group-hover:opacity-80 transition-opacity">
                  <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-1">CYBER GLITCH</h3>
                  <div class="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm">
                    <span class="font-bold text-gray-900 dark:text-white">Rs. 2,999.00</span>
                  </div>
                </a>
              </div>

               <div class="group opacity-0 translate-y-4 animate-fade-in-up" style="animation-fill-mode: forwards; animation-duration: 0.5s; animation-delay: 0.3s;">
                <div class="relative bg-card-light dark:bg-card-dark rounded-lg overflow-hidden mb-4">
                  <span class="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm z-10">Sale</span>
                  <a href="product_detail.html" class="block">
                    <img alt="Acid Wash Hoodie" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk2skXxFJ-nJeqCA0-GP4QDtWCMYJC-W75lUrrnVNt7xEOnNOtlKk_wDSmGOsE2oGQY_RP61Q1JWr6ZqtXrEOSoi-ravYuTE2kkqvqtiYdAWKJL-TrgPlpMRZaq9IQWQ6XktYI-Q4TNbVB3OYLTjNt6L3x8JubCJDDBqiLTBzN5kk-kZZQFvrL_O3JEPODH0RMBaUlfcyc7IOubT1qtj6Hhx_HYZwGlS_OjaaNgdiQtmmPKJNn8wSzymKKgyGlimi-WaxC0nvlrcgU" />
                  </a>
                  <button class="wishlist-btn absolute top-2 right-2 z-10 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all duration-300 opacity-100 xl:opacity-0 xl:group-hover:opacity-100">
                    <span class="material-icons text-lg">favorite_border</span>
                  </button>
                </div>
                <a href="product_detail.html" class="block group-hover:opacity-80 transition-opacity">
                  <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-1">ACID WASH</h3>
                   <div class="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm">
                    <span class="font-bold text-gray-900 dark:text-white">Rs. 1,299</span>
                    <span class="text-gray-400 line-through text-xs">Rs. 2,999</span>
                    <span class="text-green-600 text-xs font-bold">55% OFF</span>
                  </div>
                </a>
              </div>
            `;

        // 4. Append to grid
        productGrid.insertAdjacentHTML("beforeend", newProductsHTML);

        // 5. Update UI
        currentCount += 4;
        if (productCount) {
          productCount.textContent = `Showing ${currentCount} products`;
        }

        // 6. Reset button
        loadMoreBtn.innerHTML = originalContent;
        loadMoreBtn.classList.remove("opacity-75", "cursor-not-allowed");
        loadMoreBtn.disabled = false;

        // 7. Hide button if simulated end of list
        loadMoreBtn.style.display = "none";

        // Re-run filter to ensure new products respect current filters
        filterProducts();
      }, 1500);
    });
  }

  // Inline styling for the animation
  const style = document.createElement("style");
  style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      .animate-fade-in-up {
        animation-name: fadeInUp;
      }
    `;
  document.head.appendChild(style);

  // Price Slider Logic
  // Price Slider Logic
  const priceSlider = {
    min: 0,
    max: 2999,
    currentMin: 0,
    currentMax: 2999,
    // Desktop Elements
    container: null,
    track: null,
    minThumb: null,
    maxThumb: null,
    minInput: null,
    maxInput: null,
    // Mobile Elements
    mobileContainer: null,
    mobileTrack: null,
    mobileMinThumb: null,
    mobileMaxThumb: null,
    mobileMinInput: null,
    mobileMaxInput: null,

    init() {
      // Desktop
      this.container = document.getElementById("price-slider-container");
      this.track = document.getElementById("price-slider-track");
      this.minThumb = document.getElementById("price-slider-min");
      this.maxThumb = document.getElementById("price-slider-max");
      this.minInput = document.getElementById("price-input-min");
      this.maxInput = document.getElementById("price-input-max");

      // Mobile
      this.mobileContainer = document.getElementById(
        "mobile-price-slider-container",
      );
      this.mobileTrack = document.getElementById("mobile-price-slider-track");
      this.mobileMinThumb = document.getElementById("mobile-price-slider-min");
      this.mobileMaxThumb = document.getElementById("mobile-price-slider-max");
      this.mobileMinInput = document.getElementById("mobile-price-input-min");
      this.mobileMaxInput = document.getElementById("mobile-price-input-max");

      if (!this.container && !this.mobileContainer) return;

      this.updateUI();

      // Attach Desktop Listeners
      if (this.minThumb) {
        this.minThumb.addEventListener("mousedown", (e) =>
          this.startDrag(e, "min", this.container),
        );
        this.minThumb.addEventListener(
          "touchstart",
          (e) => this.startDrag(e, "min", this.container),
          { passive: false },
        );
      }
      if (this.maxThumb) {
        this.maxThumb.addEventListener("mousedown", (e) =>
          this.startDrag(e, "max", this.container),
        );
        this.maxThumb.addEventListener(
          "touchstart",
          (e) => this.startDrag(e, "max", this.container),
          { passive: false },
        );
      }
      if (this.minInput)
        this.minInput.addEventListener("change", (e) =>
          this.handleInput(e, "min"),
        );
      if (this.maxInput)
        this.maxInput.addEventListener("change", (e) =>
          this.handleInput(e, "max"),
        );

      // Attach Mobile Listeners
      if (this.mobileMinThumb) {
        this.mobileMinThumb.addEventListener("mousedown", (e) =>
          this.startDrag(e, "min", this.mobileContainer),
        );
        this.mobileMinThumb.addEventListener(
          "touchstart",
          (e) => this.startDrag(e, "min", this.mobileContainer),
          { passive: false },
        );
      }
      if (this.mobileMaxThumb) {
        this.mobileMaxThumb.addEventListener("mousedown", (e) =>
          this.startDrag(e, "max", this.mobileContainer),
        );
        this.mobileMaxThumb.addEventListener(
          "touchstart",
          (e) => this.startDrag(e, "max", this.mobileContainer),
          { passive: false },
        );
      }
      if (this.mobileMinInput)
        this.mobileMinInput.addEventListener("change", (e) =>
          this.handleInput(e, "min"),
        );
      if (this.mobileMaxInput)
        this.mobileMaxInput.addEventListener("change", (e) =>
          this.handleInput(e, "max"),
        );
    },

    updateUI() {
      const minPercent = (this.currentMin / this.max) * 100;
      const maxPercent = (this.currentMax / this.max) * 100;

      // Update Desktop
      if (this.minThumb) this.minThumb.style.left = minPercent + "%";
      if (this.maxThumb) this.maxThumb.style.left = maxPercent + "%";
      if (this.track) {
        this.track.style.left = minPercent + "%";
        this.track.style.right = 100 - maxPercent + "%";
      }
      if (this.minInput) this.minInput.value = this.currentMin;
      if (this.maxInput) this.maxInput.value = this.currentMax;

      // Update Mobile
      if (this.mobileMinThumb)
        this.mobileMinThumb.style.left = minPercent + "%";
      if (this.mobileMaxThumb)
        this.mobileMaxThumb.style.left = maxPercent + "%";
      if (this.mobileTrack) {
        this.mobileTrack.style.left = minPercent + "%";
        this.mobileTrack.style.right = 100 - maxPercent + "%";
      }
      if (this.mobileMinInput) this.mobileMinInput.value = this.currentMin;
      if (this.mobileMaxInput) this.mobileMaxInput.value = this.currentMax;
    },

    startDrag(e, type, activeContainer) {
      e.preventDefault();
      const handleDrag = (moveEvent) => {
        if (!activeContainer) return;
        const containerRect = activeContainer.getBoundingClientRect();
        const clientX =
          moveEvent.clientX ||
          (moveEvent.touches ? moveEvent.touches[0].clientX : 0);
        let percent = (clientX - containerRect.left) / containerRect.width;
        let value = Math.round(percent * this.max);

        if (value < this.min) value = this.min;
        if (value > this.max) value = this.max;

        if (type === "min") {
          if (value > this.currentMax) value = this.currentMax;
          this.currentMin = value;
        } else {
          if (value < this.currentMin) value = this.currentMin;
          this.currentMax = value;
        }

        this.updateUI();
        filterProducts();
      };

      const stopDrag = () => {
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);
        document.removeEventListener("touchmove", handleDrag);
        document.removeEventListener("touchend", stopDrag);
      };

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDrag);
      document.addEventListener("touchmove", handleDrag, { passive: false });
      document.addEventListener("touchend", stopDrag);
    },

    handleInput(e, type) {
      let value = parseInt(e.target.value) || 0;
      if (value < this.min) value = this.min;
      if (value > this.max) value = this.max;

      if (type === "min") {
        if (value > this.currentMax) value = this.currentMax;
        this.currentMin = value;
      } else {
        if (value < this.currentMin) value = this.currentMin;
        this.currentMax = value;
      }

      this.updateUI();
      filterProducts();
    },
  };

  // Unified Filter Logic
  function filterProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = (urlParams.get("search") || "").toLowerCase();

    const minPrice = priceSlider.currentMin;
    const maxPrice = priceSlider.currentMax;

    const productGrid = document.getElementById("product-grid");
    const productCount = document.getElementById("product-count");
    const loadMoreBtn = document.getElementById("load-more-btn");
    const title = document.getElementById("page-title");
    const breadcrumb = document.getElementById("breadcrumb-nav");

    if (!productGrid) return;

    // Ensure "No Results" message exists
    let noResultsMsg = document.getElementById("no-results-msg");
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.id = "no-results-msg";
      noResultsMsg.className = "col-span-full text-center py-20 hidden";
      noResultsMsg.innerHTML = `
              <p class="text-xl text-gray-500 dark:text-gray-400">
                Please try a different search term or go back to the <a href="index.html" class="underline hover:text-black dark:hover:text-white transition-colors">homepage</a>.
              </p>
            `;
      productGrid.appendChild(noResultsMsg);
    }

    // Hide Load More if filtering (search or price)
    if (loadMoreBtn && (searchTerm || minPrice > 0 || maxPrice < 2999)) {
      loadMoreBtn.style.display = "none";
    } else if (loadMoreBtn) {
      // loadMoreBtn.style.display = 'inline-flex'; // Restore if needed
    }

    let matchCount = 0;
    const products = Array.from(productGrid.querySelectorAll(".group"));

    products.forEach((product) => {
      // Skip the no-results div if it accidentally got class=group
      const titleEl = product.querySelector("h3");
      const priceEls = product.querySelectorAll(".text-sm span.font-bold");

      let price = 0;
      // Find price
      if (priceEls.length > 0) {
        const text = priceEls[0].textContent; // "Rs. 1,499"
        price = parseFloat(text.replace(/[^0-9.]/g, ""));
      }

      if (titleEl) {
        const productTitle = titleEl.textContent.toLowerCase();
        const matchesSearch = !searchTerm || productTitle.includes(searchTerm);
        const matchesPrice = price >= minPrice && price <= maxPrice;

        if (matchesSearch && matchesPrice) {
          product.classList.remove("hidden");
          matchCount++;
        } else {
          product.classList.add("hidden");
        }
      }
    });

    if (matchCount === 0) {
      noResultsMsg.classList.remove("hidden");
    } else {
      noResultsMsg.classList.add("hidden");
    }

    // Update UI Text
    if (searchTerm && breadcrumb) {
      breadcrumb.innerHTML = `<span class="text-gray-500 dark:text-gray-400">Found ${matchCount} results for </span><span class="text-black dark:text-white font-bold">"${searchTerm}"</span>`;
      breadcrumb.classList.remove("uppercase");
      breadcrumb.classList.add("text-lg", "normal-case");
      if (title) title.textContent = "Search Results";
    }

    if (productCount) {
      productCount.textContent = `Showing ${matchCount} products`;
    }
  }

  // Initialize logic
  priceSlider.init();
  filterProducts(); // Initial filter on load

  // Close dropdown listeners (needs to be global or attached to document)
  document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("sort-dropdown");
    const sortButton = document.getElementById("sort-button");

    if (
      dropdown &&
      sortButton &&
      !dropdown.classList.contains("invisible") &&
      !sortButton.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      toggleSortDropdown();
    }
  });
});
