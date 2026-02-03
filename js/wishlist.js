document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
  // common.js runs its own DOMContentLoaded which updates badge, but we might need to maximize sync
  updateWishlistBadge();
});

function renderWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("hoodvibe_wishlist")) || [];
  const container = document.getElementById("wishlist-container");
  const emptyMsg = document.getElementById("wishlist-empty-message");
  const list = document.getElementById("wishlist-items-list");

  if (wishlist.length === 0) {
    if (container) container.classList.add("hidden");
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    return;
  }

  if (container) container.classList.remove("hidden");
  if (emptyMsg) emptyMsg.classList.add("hidden");
  if (list) list.innerHTML = "";

  wishlist.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.className = "group";

    // Determine sale info
    let saleBadge = "";
    if (item.tag) {
      saleBadge = `<span class="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm z-10">${item.tag}</span>`;
    }

    // Determine price display
    let displayPrice = item.price;
    if (typeof item.price === 'number' || (typeof item.price === 'string' && !item.price.includes('Rs.'))) {
      displayPrice = `Rs. ${item.price}`;
    }
    let priceHtml = `<span class="font-bold text-gray-900 dark:text-white">${displayPrice}</span>`;
    if (item.originalPrice) {
      let displayOriginal = item.originalPrice;
      if (typeof item.originalPrice === 'number' || (typeof item.originalPrice === 'string' && !item.originalPrice.includes('Rs.'))) {
        displayOriginal = `Rs. ${item.originalPrice}`;
      }
      priceHtml += `<span class="text-gray-400 line-through text-xs">${displayOriginal}</span>`;
    }
    if (item.offer) {
      priceHtml += `<span class="text-green-600 text-xs font-bold">${item.offer}</span>`;
    }

    itemEl.innerHTML = `
          <div class="relative bg-card-light dark:bg-card-dark rounded-lg overflow-hidden mb-4">
            ${saleBadge}
            <a href="product_detail.html" class="block">
              <img alt="${item.name}"
                class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                src="${item.image}" />
            </a>
            <button onclick="removeItemFromWishlist('${item.id}')" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-original-price="${item.originalPrice || ''}" data-offer="${item.offer || ''}" data-tag="${item.tag || ''}"
              class="wishlist-btn absolute top-2 right-2 z-10 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-all duration-300 opacity-100 xl:opacity-0 xl:group-hover:opacity-100">
              <span class="material-icons text-lg text-red-600">favorite</span>
            </button>
          </div>
          <a href="product_detail.html" class="block group-hover:opacity-80 transition-opacity">
            <h3 class="font-bold text-sm text-gray-900 dark:text-white mb-1">
              ${item.name}
            </h3>
            <div class="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 text-sm">
              ${priceHtml}
            </div>
          </a>
        `;
    list.appendChild(itemEl);
  });
}

function removeItemFromWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("hoodvibe_wishlist")) || [];
  wishlist = wishlist.filter(item => item.id !== id);
  localStorage.setItem("hoodvibe_wishlist", JSON.stringify(wishlist));

  // Update badge (global function from common.js)
  if (typeof updateWishlistBadge === "function") {
    updateWishlistBadge();
  }

  // Re-render to remove the item from view
  renderWishlist();
}
