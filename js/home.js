/**
 * Homepage Specific JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  // Category Scroll Logic
  const container = document.getElementById("category-container");
  const prevBtn = document.getElementById("category-prev");
  const nextBtn = document.getElementById("category-next");
  const progressBar = document.getElementById("category-progress-bar");

  const updateProgress = () => {
    if (!container || !progressBar) return;

    // Calculate the ratio of visible width to total scrollable width
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // If content fits, bar is 100%. Otherwise calculated ratio.
    const widthPercentage = (clientWidth / scrollWidth) * 100;
    progressBar.style.width = `${widthPercentage}%`;

    // Calculate scroll progress (0 to 1)
    const maxScrollLeft = scrollWidth - clientWidth;
    const scrollLeft = container.scrollLeft;

    if (maxScrollLeft > 0) {
      const scrollProgress = scrollLeft / maxScrollLeft;
      // The available space for the bar to move is (100% - widthPercentage)
      const availableSpace = 100 - widthPercentage;
      const marginLeft = scrollProgress * availableSpace;
      progressBar.style.marginLeft = `${marginLeft}%`;
    } else {
      progressBar.style.marginLeft = "0%";
    }
  };

  if (container && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      container.scrollBy({ left: -340, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      container.scrollBy({ left: 340, behavior: "smooth" });
    });

    container.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);

    // Initial calculation
    setTimeout(updateProgress, 100);
  }

  // Tab selection logic (e.g., Shop by Category Men/Women)
  const tabMen = document.getElementById("tab-men");
  const tabWomen = document.getElementById("tab-women");

  if (tabMen && tabWomen) {
    const toggleTabs = (selected, unselected) => {
      // Active state classes
      selected.classList.add("border-b-2", "border-black", "dark:border-white");
      selected.classList.remove(
        "text-gray-400",
        "hover:text-gray-900",
        "dark:hover:text-white",
      );

      // Inactive state classes
      unselected.classList.remove(
        "border-b-2",
        "border-black",
        "dark:border-white",
      );
      unselected.classList.add(
        "text-gray-400",
        "hover:text-gray-900",
        "dark:hover:text-white",
      );
    };

    tabMen.addEventListener("click", () => toggleTabs(tabMen, tabWomen));
    tabWomen.addEventListener("click", () => toggleTabs(tabWomen, tabMen));
  }

  // Featured Products Filter logic
  const filterAll = document.getElementById("filter-all");
  const filterMen = document.getElementById("filter-men");
  const filterWomen = document.getElementById("filter-women");

  if (filterAll && filterMen && filterWomen) {
    const filters = [filterAll, filterMen, filterWomen];

    const setActiveFilter = (selected) => {
      filters.forEach((filter) => {
        if (filter === selected) {
          // Active state
          filter.classList.add(
            "font-bold",
            "border-b-2",
            "border-black",
            "dark:border-white",
            "-mb-2.5",
            "text-black",
            "dark:text-white",
          );
          filter.classList.remove(
            "text-gray-500",
            "dark:text-gray-400",
            "font-medium",
          );
        } else {
          // Inactive state
          filter.classList.remove(
            "font-bold",
            "border-b-2",
            "border-black",
            "dark:border-white",
            "-mb-2.5",
            "text-black",
            "dark:text-white",
          );
          filter.classList.add(
            "text-gray-500",
            "dark:text-gray-400",
            "font-medium",
          );
        }
      });
    };

    filterAll.addEventListener("click", () => setActiveFilter(filterAll));
    filterMen.addEventListener("click", () => setActiveFilter(filterMen));
    filterWomen.addEventListener("click", () => setActiveFilter(filterWomen));
  }

  // Hero Slider Logic
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-dot");
  let currentSlide = 0;
  let slideInterval;

  if (slides.length === 0) return; // Exit if no slides found

  const showSlide = (index) => {
    // Hide all slides
    slides.forEach((slide) => {
      slide.classList.remove("opacity-100", "z-10");
      slide.classList.add("opacity-0", "z-0");
    });

    // Reset all dots
    dots.forEach((dot) => {
      dot.classList.remove("opacity-100", "scale-125");
      dot.classList.add("bg-white/50");
      dot.classList.remove("bg-white");
    });

    // Show target slide
    slides[index].classList.remove("opacity-0", "z-0");
    slides[index].classList.add("opacity-100", "z-10");

    // Activate target dot
    if (dots[index]) {
      dots[index].classList.remove("bg-white/50");
      dots[index].classList.add("bg-white", "opacity-100", "scale-125");
    }

    currentSlide = index;
  };

  const nextSlide = () => {
    showSlide((currentSlide + 1) % slides.length);
  };

  const startSlider = () => {
    slideInterval = setInterval(nextSlide, 5000);
  };

  const stopSlider = () => {
    clearInterval(slideInterval);
  };

  // Event Listeners for Dots
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      stopSlider();
      const slideIndex = parseInt(dot.getAttribute("data-slide"));
      showSlide(slideIndex);
      startSlider(); // Restart timer
    });
  });

  // Start initial timer
  if (slides.length > 0) {
    startSlider();
  }
});
