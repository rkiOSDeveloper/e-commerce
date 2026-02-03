/**
 * Cart Page JavaScript
 * Handles rendering the full cart view in cart.html
 */

document.addEventListener("DOMContentLoaded", () => {
  renderFullCart();
});

function renderFullCart() {
  const list = document.getElementById("cart-items-list");
  const container = document.getElementById("cart-container");
  const emptyMsg = document.getElementById("cart-empty-message");
  const subtotalEl = document.getElementById("cart-subtotal");

  if (!list) return; // Not on cart page

  // Get cart from localStorage (managed by common.js usually, but we read here)
  const cart = JSON.parse(localStorage.getItem("hoodvibe_cart")) || [];

  if (cart.length === 0) {
    if (container) container.classList.add("hidden");
    if (emptyMsg) emptyMsg.classList.remove("hidden");
    return;
  }

  if (container) container.classList.remove("hidden");
  if (emptyMsg) emptyMsg.classList.add("hidden");

  list.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemHTML = `
            <div class="py-6 border-b border-gray-200">
                <!-- Mobile Layout (and Desktop grid wrapper) -->
                <div class="flex sm:grid sm:grid-cols-12 gap-4 sm:gap-0 items-start sm:items-center">
                    
                    <!-- Product Image & Details (Mobile: Flex, Desktop: Col Span 6) -->
                    <div class="flex-1 sm:col-span-6 flex items-start gap-4 sm:gap-6">
                        <a href="product_detail.html?id=${item.id}" class="block flex-shrink-0 w-20 h-24 bg-gray-100 rounded overflow-hidden">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                        </a>
                        <div class="flex-1 pt-1">
                            <a href="product_detail.html?id=${item.id}" class="text-sm font-medium uppercase text-black hover:text-gray-600 transition-colors block mb-1 tracking-wide">
                        ${item.name}
                        </a>
                        <div class="text-xs text-gray-500 mb-3">
                        ${item.color ? `<p class="mb-0.5"><span class='font-semibold'>Color:</span> ${item.color}</p>` : ""}
                        ${item.size ? `<p><span class='font-semibold'>Size:</span> ${item.size}</p>` : ""}
                    </div>
                            
                            <button onclick="removeFromCart('${item.instanceId}')" class="text-sm underline text-gray-500 hover:text-black transition-colors mb-3 block">
                                Remove
                            </button>

                             <!-- Mobile Quantity Selector (Hidden on Desktop) -->
                             <div class="sm:hidden flex items-center border border-gray-300 rounded max-w-[100px] h-9">
                                <button onclick="updateCartQuantity('${item.instanceId}', -1)" class="w-8 flex items-center justify-center hover:bg-gray-50 text-black font-medium transition-colors">-</button>
                                <span class="flex-1 text-center text-sm font-medium text-black">${item.quantity}</span>
                                <button onclick="updateCartQuantity('${item.instanceId}', 1)" class="w-8 flex items-center justify-center hover:bg-gray-50 text-black font-medium transition-colors">+</button>
                            </div>
                        </div>
                    </div>

                    <!-- Price (Mobile: Right aligned, Desktop: Col Span 2) -->
                    <div class="sm:col-span-2 text-right sm:text-left">
                         <!-- Mobile View: Just Price, aligned right to match header -->
                         <!-- Desktop View: Price column -->
                        <span class="text-sm font-medium text-black">Rs. ${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>

                    <!-- Quantity (Mobile: Hidden - moved to under details, Desktop: Col Span 2) -->
                    <div class="hidden sm:block sm:col-span-2">
                         <div class="flex items-center border border-gray-200 rounded max-w-[100px]">
                            <button onclick="updateCartQuantity('${item.instanceId}', -1)" class="px-3 py-2 hover:bg-gray-50 text-black font-medium text-sm transition-colors">-</button>
                            <span class="flex-1 text-center text-sm font-medium text-black">${item.quantity}</span>
                            <button onclick="updateCartQuantity('${item.instanceId}', 1)" class="px-3 py-2 hover:bg-gray-50 text-black font-medium text-sm transition-colors">+</button>
                        </div>
                    </div>

                    <!-- Total (Hidden on Mobile, Desktop: Col Span 2) -->
                    <div class="hidden sm:block sm:col-span-2 text-right">
                        <span class="text-sm font-bold text-black">Rs. ${itemTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>
        `;
    list.insertAdjacentHTML("beforeend", cartItemHTML);
  });

  if (subtotalEl) {
    subtotalEl.textContent = `Rs. ${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  }
}

// These functions will communicate with common.js mostly, but since we are on the cart page
// we might need to duplicate some logic or expose common functions.
// For better design, common.js should handle state, and we just call shared methods.
// But to keep it simple, we'll manipulate localStorage here and re-render.

// Updates quantity for a specific item instance
function updateCartQuantity(instanceId, change) {
  let cart = JSON.parse(localStorage.getItem("hoodvibe_cart")) || [];
  const itemIndex = cart.findIndex((item) => item.instanceId === instanceId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity < 1) cart[itemIndex].quantity = 1;

    localStorage.setItem("hoodvibe_cart", JSON.stringify(cart));
    renderFullCart();
    // Also update header badge if common.js is present (it is)
    if (typeof updateCartBadge === "function") updateCartBadge();
  }
}

function removeFromCart(instanceId) {
  let cart = JSON.parse(localStorage.getItem("hoodvibe_cart")) || [];
  cart = cart.filter((item) => item.instanceId !== instanceId);

  localStorage.setItem("hoodvibe_cart", JSON.stringify(cart));
  renderFullCart();
  if (typeof updateCartBadge === "function") updateCartBadge();
}
