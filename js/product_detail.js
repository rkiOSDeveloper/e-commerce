/**
 * Product Detail Page JavaScript
 */

// Helper Functions
function addWorkingDays(date, days) {
  let result = new Date(date);
  let count = 0;
  while (count < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      // Skip Sunday (0) and Saturday (6)
      count++;
    }
  }
  return result;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

// Global function called by onclick (if any remain)
function changeImage(src) {
  const mainImage = document.getElementById("main-product-image");
  if (mainImage) {
    mainImage.src = src;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Delivery Date Logic
  const today = new Date();
  const startDelivery = addWorkingDays(today, 5);
  const endDelivery = addWorkingDays(today, 7);

  const dateString = `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;
  const deliveryElement = document.getElementById("delivery-date");
  if (deliveryElement) {
    deliveryElement.textContent = dateString;
  }

  // Tab Switching Logic
  const tabDesc = document.getElementById("tab-description");
  const tabShip = document.getElementById("tab-shipping");
  const tabCancel = document.getElementById("tab-cancellation");
  const contentDesc = document.getElementById("content-description");
  const contentShip = document.getElementById("content-shipping");
  const contentCancel = document.getElementById("content-cancellation");

  if (
    tabDesc &&
    tabShip &&
    tabCancel &&
    contentDesc &&
    contentShip &&
    contentCancel
  ) {
    const tabs = [tabDesc, tabShip, tabCancel];
    const contents = [contentDesc, contentShip, contentCancel];

    function setActiveTab(clickedTab) {
      tabs.forEach((tab, index) => {
        if (tab === clickedTab) {
          // Activate
          tab.classList.remove(
            "border-transparent",
            "text-gray-500",
            "font-medium",
          );
          tab.classList.add(
            "border-black",
            "dark:border-white",
            "font-bold",
            "text-black",
            "dark:text-white",
          );
          contents[index].classList.remove("hidden");

          // Mobile Scroll Logic
          if (window.innerWidth < 1024) {
            const tabsContainer = tab.parentElement;
            const headerOffset = 80;
            // Check if tabsContainer is valid to avoid errors if structure changes
            if (tabsContainer) {
              const elementPosition = tabsContainer.getBoundingClientRect().top;
              const offsetPosition =
                elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });

              // Scroll Active Tab into View (Horizontal)
              const tabLeft = tab.offsetLeft;
              const tabWidth = tab.offsetWidth;
              const containerWidth = tabsContainer.offsetWidth;
              const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;

              tabsContainer.scrollTo({
                left: scrollLeft,
                behavior: "smooth",
              });
            }
          }
        } else {
          // Deactivate
          tab.classList.add(
            "border-transparent",
            "text-gray-500",
            "font-medium",
          );
          tab.classList.remove(
            "border-black",
            "dark:border-white",
            "font-bold",
            "text-black",
            "dark:text-white",
          );
          contents[index].classList.add("hidden");
        }
      });
    }

    tabDesc.addEventListener("click", () => setActiveTab(tabDesc));
    tabShip.addEventListener("click", () => setActiveTab(tabShip));
    tabCancel.addEventListener("click", () => setActiveTab(tabCancel));
  }

  // Size Selection Logic
  const sizeBtns = document.querySelectorAll(".size-btn");
  const sizeLabel = document.getElementById("size-label-value");

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;

      // Reset all buttons
      sizeBtns.forEach((b) => {
        if (!b.disabled) {
          b.className =
            "size-btn py-3 border border-gray-300 dark:border-gray-600 rounded hover:border-black dark:hover:border-white text-sm font-medium transition-colors";
        }
      });

      // Set selected button
      btn.className =
        "size-btn py-3 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white rounded text-sm font-bold shadow-md";

      // Update label
      if (sizeLabel) {
        sizeLabel.textContent = btn.childNodes[0].textContent.trim();
      }
    });
  });

  // Color Selection Logic
  const colorBtns = document.querySelectorAll(".color-btn");
  const colorLabel = document.getElementById("color-label-value");

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;

      // Reset all buttons
      colorBtns.forEach((b) => {
        if (!b.disabled) {
          b.classList.remove("border-black", "dark:border-white");
          b.classList.add("border-transparent", "hover:border-gray-300");
        }
      });

      // Set selected button
      btn.classList.remove("border-transparent", "hover:border-gray-300");
      btn.classList.add("border-black", "dark:border-white");

      // Update label
      if (colorLabel) {
        colorLabel.textContent = btn.getAttribute("data-color");
      }

      // Update Main Image from Color Button
      const mainImage = document.getElementById("main-product-image");
      const colorImg = btn.querySelector("img");
      if (mainImage && colorImg) {
        // Add a small fade effect
        mainImage.style.opacity = "0.5";
        setTimeout(() => {
          mainImage.src = colorImg.src;
          mainImage.style.opacity = "1";
        }, 200);
      }
    });
  });

  // Image Gallery Logic
  const mainImage = document.getElementById("main-product-image");
  const thumbnails = document.querySelectorAll(".thumbnail-btn");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      // Update Main Image
      const img = thumb.querySelector("img");
      if (mainImage && img) {
        mainImage.src = img.src;
      }

      // Update Thumbnail Styles
      thumbnails.forEach((t) => {
        t.classList.remove("border-black", "dark:border-white");
        t.classList.add(
          "border-transparent",
          "hover:border-gray-300",
          "dark:hover:border-gray-600",
        );
      });

      thumb.classList.remove(
        "border-transparent",
        "hover:border-gray-300",
        "dark:hover:border-gray-600",
      );
      thumb.classList.add("border-black", "dark:border-white");
    });
  });

  // Lightbox Modal Logic
  const imageModal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const closeModalBtn = document.getElementById("close-modal-btn");

  if (mainImage && imageModal && modalImage && closeModalBtn) {
    // Open Modal
    mainImage.parentElement.addEventListener("click", (e) => {
      // Prevent opening if clicking the wishlist button (which is absolute positioned inside)
      if (e.target.closest("button")) return;

      modalImage.src = mainImage.src;
      imageModal.classList.remove("hidden");
      // Small delay to allow display:block to apply before opacity transition
      setTimeout(() => {
        imageModal.classList.remove("opacity-0");
        modalImage.classList.remove("scale-95");
        modalImage.classList.add("scale-100");
      }, 10);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    });

    // Close Modal Function
    const closeModal = () => {
      imageModal.classList.add("opacity-0");
      modalImage.classList.remove("scale-100");
      modalImage.classList.add("scale-95");
      setTimeout(() => {
        imageModal.classList.add("hidden");
      }, 300); // Wait for transition
      document.body.style.overflow = "";
    };

    closeModalBtn.addEventListener("click", closeModal);

    // Close on background click
    imageModal.addEventListener("click", (e) => {
      if (
        e.target === imageModal ||
        e.target.closest(".relative") === imageModal.querySelector(".relative")
      ) {
        // Check if click is outside the image (on the blurred background or container)
        if (e.target === imageModal || e.target.classList.contains("flex")) {
          closeModal();
        }
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !imageModal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  // Share Button Logic
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Check out this product!",
            text: "I found this amazing product on Clothyfly.",
            url: window.location.href,
          });
        } catch (err) {
          console.error("Error sharing:", err);
        }
      } else {
        window.Toast.show(
          "Sharing is not supported on this browser. Copying URL to clipboard is a good fallback.",
          'info'
        );
      }
    });
  }

  // Favorite Button Logic
  const favoriteBtn = document.getElementById("favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.addEventListener("click", () => {
      const icon = favoriteBtn.querySelector(".material-icons-outlined");
      if (icon) {
        if (icon.textContent === "favorite_border") {
          icon.textContent = "favorite";
          favoriteBtn.classList.add("text-red-500");
        } else {
          icon.textContent = "favorite_border";
          favoriteBtn.classList.remove("text-red-500");
        }
      }
    });
  }

  // Quantity Logic
  const quantityMinusBtn = document.getElementById("quantity-btn-minus");
  const quantityPlusBtn = document.getElementById("quantity-btn-plus");
  const quantityValue = document.getElementById("quantity-value");

  if (quantityMinusBtn && quantityPlusBtn && quantityValue) {
    quantityMinusBtn.addEventListener("click", () => {
      let val = parseInt(quantityValue.textContent);
      if (val > 1) {
        quantityValue.textContent = val - 1;
      }
    });

    quantityPlusBtn.addEventListener("click", () => {
      let val = parseInt(quantityValue.textContent);
      quantityValue.textContent = val + 1;
    });
  }

  // Show More Description Logic
  const showMoreDescBtn = document.getElementById("show-more-description-btn");
  const descriptionText = document.getElementById("product-description-text");

  if (showMoreDescBtn && descriptionText) {
    showMoreDescBtn.addEventListener("click", () => {
      if (descriptionText.classList.contains("line-clamp-3")) {
        descriptionText.classList.remove("line-clamp-3");
        showMoreDescBtn.textContent = "Show Less";
      } else {
        descriptionText.classList.add("line-clamp-3");
        showMoreDescBtn.textContent = "Show More";
      }
    });
  }

  // Add to Cart Logic
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      // Gather Product Info
      const titleEl = document.querySelector("h1.font-heading");
      const priceEl = document.getElementById("product-price");
      const mainImageEl = document.getElementById("main-product-image"); // Already defined globally but good to be safe needed inside scoping

      // Get selected options
      let selectedSize = "M"; // Default
      const activeSizeBtn = document.querySelector(".size-btn.bg-black"); // Checks for active style (bg-black text-white)
      if (activeSizeBtn) {
        selectedSize = activeSizeBtn.textContent.trim();
      }

      let selectedColor = "Default";
      const activeColorBtn = document.querySelector(
        ".color-button.border-black, .color-btn.border-black",
      ); // Checks for active border
      if (activeColorBtn) {
        selectedColor = activeColorBtn.getAttribute("data-color") || "Default";
      }
      // Construct Product Object
      const product = {
        id: "product-" + Date.now(), // Unique ID for this product session/type if no real DB ID. Ideally read from data-attribute.
        name: titleEl ? titleEl.textContent.trim() : "Unknown Product",
        price: priceEl
          ? parseFloat(
            priceEl.textContent.replace("Rs. ", "").replace(/[^0-9.]/g, ""),
          )
          : 0,
        image: mainImageEl ? mainImageEl.src : "",
        size: selectedSize,
        color: selectedColor,
        fabric: "Cotton", // Hardcoded as per mock or read from description if possible
      };

      // Use CartService if available
      if (typeof cartService !== 'undefined') {
        // Quantity is 1 by default for now (could read from quantity input if needed)
        const quantity = parseInt(document.getElementById("quantity-value")?.textContent || 1);

        // Pass base product and selected options separately as per service signature
        // Service expects: addToCart(product, quantity, size, color)
        cartService.addToCart(product, quantity, selectedSize, selectedColor).then(result => {
          if (result.success) {
            // Feedback
            const originalText = addToCartBtn.textContent;
            addToCartBtn.textContent = "Added to Cart!";
            setTimeout(() => {
              addToCartBtn.textContent = originalText;
            }, 2000);

            // Open Drawer (optional, but good UX)
            if (window.cartDrawerManager) {
              window.cartDrawerManager.open();
            }
          } else {
            if (result.success) {
              window.Toast.show('Product added to cart', 'success');
              // Update UI
              updateCartCount(result.cart.length); // Assuming implementation
              window.dispatchEvent(new CustomEvent('cartUpdated'));

              // Open drawer
              if (window.cartDrawerManager) {
                window.cartDrawerManager.open();
              }
            } else {
              window.Toast.show(result.message || "Failed to add to cart", 'error');
            }
          }
        });
      } else {
        console.error("CartService not found!");
      }
    });
  }

  // Render "You Might Also Like" Section
  async function renderYouMightAlsoLike() {
    try {
      // Fetch products from products.json
      const response = await fetch('data/products.json');
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      const data = await response.json();

      // Get random 4 products for recommendations
      const allProducts = data.products || [];
      const shuffled = allProducts.sort(() => 0.5 - Math.random());
      const recommendedProducts = shuffled.slice(0, 4);

      // Use ProductCardRenderer if available
      const container = document.getElementById('you-might-also-like-grid');
      if (container && typeof ProductCardRenderer !== 'undefined') {
        const renderer = new ProductCardRenderer();
        const html = renderer.renderWithWishlistState(recommendedProducts);
        container.innerHTML = html;
        console.log('[Product Detail] You Might Also Like section rendered');
      }
    } catch (error) {
      console.error('[Product Detail] Error rendering recommendations:', error);
    }
  }

  // Call the render function
  renderYouMightAlsoLike();
});
