document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
  // common.js runs its own DOMContentLoaded which updates badge, but we might need to maximize sync
  updateWishlistBadge();
});

async function renderWishlist() {
  const container = document.getElementById("wishlist-container");
  const emptyMsg = document.getElementById("wishlist-empty-message");
  const list = document.getElementById("wishlist-items-list");

  // Show loading state if possible or just wait
  if (list) list.innerHTML = '<div class="col-span-full text-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div></div>';

  let wishlist = [];

  if (typeof wishlistService !== 'undefined') {
    // Fetch full details (handles legacy string IDs)
    wishlist = await wishlistService.getWishlistWithDetails();
  } else {
    // Improved fallback for localStorage
    const rawWishlist = JSON.parse(localStorage.getItem("clothyfly_wishlist")) || [];
    // Filter out legacy strings if we can't fetch details (safe fallback)
    wishlist = rawWishlist.filter(item => typeof item !== 'string');
  }

  // Final validation to ensure no broken objects are rendered
  wishlist = wishlist.filter(item => item && item.id && typeof item.price !== 'undefined');

  if (wishlist.length === 0) {
    if (container) container.classList.add("hidden");
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    if (list) list.innerHTML = '';
    return;
  }

  if (container) container.classList.remove("hidden");
  if (emptyMsg) emptyMsg.classList.add("hidden");

  // Use ProductCardRenderer to render wishlist items
  if (list && typeof ProductCardRenderer !== 'undefined') {
    const renderer = new ProductCardRenderer();
    const html = renderer.renderWithWishlistState(wishlist);
    list.innerHTML = html;
    console.log(`[Wishlist] Rendered ${wishlist.length} items dynamically`);
  }
}


function removeItemFromWishlist(id) {
  // Use wishlistService if available, fallback to localStorage
  if (typeof wishlistService !== 'undefined') {
    wishlistService.removeFromWishlist(id);
    // Badge update will be handled by wishlistUpdated event
    // Re-render will also be triggered by the event, but we'll do it manually for immediate feedback
    renderWishlist();
  } else {
    // Fallback to localStorage
    let wishlist = JSON.parse(localStorage.getItem("clothyfly_wishlist")) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem("clothyfly_wishlist", JSON.stringify(wishlist));

    // Update badge (global function from common.js)
    if (typeof updateWishlistBadge === "function") {
      updateWishlistBadge();
    }

    // Re-render to remove the item from view
    renderWishlist();
  }
}
