/**
 * Common JavaScript Functionality
 * Shared across index.html, product_list.html, and product_detail.html
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Copyright Year
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll to Top Logic
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
                scrollToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
            } else {
                scrollToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
                scrollToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Search Input Listener
    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                window.location.href = 'product_list.html?search=' + encodeURIComponent(e.target.value);
            }
        });
    }

    // Desktop Search Logic
    const desktopSearchInput = document.getElementById('search-input-field');
    const desktopSearchBtn = document.getElementById('search-btn-icon');

    if (desktopSearchInput) {
        desktopSearchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                window.location.href = 'product_list.html?search=' + encodeURIComponent(e.target.value);
            }
        });
    }

    // Wishlist/Favorite Button Logic (Common for product cards)
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = btn.querySelector('.material-icons');
            if (icon) {
                if (icon.textContent.trim() === 'favorite_border') {
                    icon.textContent = 'favorite';
                    btn.classList.remove('text-black');
                    btn.classList.add('text-red-500');
                } else {
                    icon.textContent = 'favorite_border';
                    btn.classList.remove('text-red-500');
                    btn.classList.add('text-black');
                }
            }
        });
    });

    // Search Bar Highlight Logic
    const searchInput = document.getElementById('search-input-field');
    const searchBtn = document.getElementById('search-btn-icon');

    if (searchInput && searchBtn) {
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() !== '') {
                // Highlight icon
                searchBtn.classList.remove('text-gray-500', 'dark:text-gray-400');
                searchBtn.classList.add('text-black', 'dark:text-white');
            } else {
                // Revert to default
                searchBtn.classList.add('text-gray-500', 'dark:text-gray-400');
                searchBtn.classList.remove('text-black', 'dark:text-white');
            }
        });
    }

    if (desktopSearchBtn && desktopSearchInput) {
        desktopSearchBtn.addEventListener('click', function () {
            window.location.href = 'product_list.html?search=' + encodeURIComponent(desktopSearchInput.value);
        });
    }
});

// Mobile Menu Logic
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu-drawer');
    const btn = document.getElementById('mobile-menu-btn');
    const icon = document.getElementById('mobile-menu-icon');
    const stickyCartBar = document.getElementById('sticky-cart-bar');

    const isOpen = !menu.classList.contains('-translate-x-full');

    if (isOpen) {
        // Close Menu
        menu.classList.add('-translate-x-full');
        document.body.classList.remove('overflow-hidden');

        // Show Sticky Cart (Product Detail Page specific, simplified check)
        if (stickyCartBar) stickyCartBar.classList.remove('hidden');

        // Animate Icon to Menu
        if (btn) btn.classList.remove('rotate-90');
        if (icon) icon.textContent = 'menu';
    } else {
        // Open Menu
        menu.classList.remove('-translate-x-full');
        document.body.classList.add('overflow-hidden');

        // Hide Sticky Cart
        if (stickyCartBar) stickyCartBar.classList.add('hidden');

        // Animate Icon to Close
        if (btn) btn.classList.add('rotate-90');
        if (icon) icon.textContent = 'close';
    }
}

function toggleMobileSubmenu(submenuId, chevronId) {
    const submenu = document.getElementById(submenuId);
    const chevron = document.getElementById(chevronId);

    if (submenu && submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        if (chevronId.includes('products') && chevron) {
            chevron.style.transform = 'rotate(180deg)';
        } else if (chevron) {
            chevron.innerText = 'remove';
        }
    } else if (submenu) {
        submenu.classList.add('hidden');
        if (chevronId.includes('products') && chevron) {
            chevron.style.transform = 'rotate(0deg)';
        } else if (chevron) {
            chevron.innerText = 'add';
        }
    }
}

function toggleSearchModal() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('mobile-search-input');

    if (!modal) return;

    const isOpen = !modal.classList.contains('translate-y-full');

    if (isOpen) {
        modal.classList.add('translate-y-full');
        document.body.classList.remove('overflow-hidden');
    } else {
        modal.classList.remove('translate-y-full');
        document.body.classList.add('overflow-hidden');
        if (input) setTimeout(() => input.focus(), 300);
    }
}

// --- Cart Logic (Shared) ---

// Initialize Cart on Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();

    // Inject Drawer Markup if not present (Safety fallback, but better to have in HTML)
    if (!document.getElementById('cart-drawer')) {
        const drawerHTML = `
           <div id="cart-drawer" class="fixed inset-0 z-50 invisible opacity-0 transition-opacity duration-300">
             <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="toggleCartDrawer()"></div>
             <div class="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-card-dark shadow-2xl transform transition-transform duration-300 translate-x-full flex flex-col">
                 <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                     <h2 class="font-display text-xl font-medium">Shopping Cart</h2>
                     <button onclick="toggleCartDrawer()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                         <span class="material-icons">close</span>
                     </button>
                 </div>
                 <div class="flex-1 overflow-y-auto p-4" id="cart-drawer-items">
                     <!-- Cart Items -->
                 </div>
                 <div id="cart-drawer-bottom" class="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-card-dark">
                     <div class="flex justify-between items-center ">
                         <span class="text-lg font-medium">Subtotal</span>
                         <span id="cart-drawer-subtotal" class="text-lg font-bold">Rs. 0.00</span>
                     </div>
                     <p class="text-xs text-gray-500 mb-6">Taxes and shipping calculated at checkout</p>
                     <button class="block w-full py-3 bg-primary text-white font-medium hover:opacity-90 transition-opacity rounded uppercase tracking-wide mb-3">Check Out</button>
                     <a href="cart.html" class="block w-full text-center text-sm underline text-black dark:text-white hover:text-gray-600 transition-colors">View Cart</a>
                 </div>
             </div>
          </div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHTML);
    }
});

function toggleCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const content = drawer ? drawer.querySelector('div[class*="transform"]') : null;

    if (!drawer || !content) return;

    if (drawer.classList.contains('invisible')) {
        // Open
        renderCartDrawer();
        drawer.classList.remove('invisible', 'opacity-0');
        content.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
    } else {
        // Close
        drawer.classList.add('invisible', 'opacity-0');
        content.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('hoodvibe_cart')) || [];

    // Create unique instance ID based on product ID + options 
    // (so same product with different sizes are different items)
    const instanceId = `${product.id}-${product.size || 'M'}-${product.color || 'Default'}`;

    const existingItemIndex = cart.findIndex(item => item.instanceId === instanceId);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            ...product,
            instanceId,
            quantity: 1
        });
    }

    localStorage.setItem('hoodvibe_cart', JSON.stringify(cart));
    updateCartBadge();
    toggleCartDrawer(); // Open drawer on add
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('hoodvibe_cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Select all elements with class 'cart-count-badge' (header + bottom bar)
    // Also keeping ID selection as fallback or for specific elements if needed, 
    // but class is preferred for multiple instances.
    const badges = document.querySelectorAll('.cart-count-badge, #cart-count-badge');

    badges.forEach(badge => {
        if (badge) {
            badge.textContent = count;
            if (count > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    });
}

function renderCartDrawer() {
    const list = document.getElementById('cart-drawer-items');
    const bottomSection = document.getElementById('cart-drawer-bottom');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');

    if (!list) return;

    const cart = JSON.parse(localStorage.getItem('hoodvibe_cart')) || [];
    list.innerHTML = '';

    if (cart.length === 0) {
        list.innerHTML = '<p class="text-left text-base text-black dark:text-gray-300 pt-2 px-1">Your cart is currently empty.</p>';
        if (bottomSection) bottomSection.classList.add('hidden');
        if (subtotalEl) subtotalEl.textContent = 'Rs. 0.00';
        return;
    }

    // If we have items, show the bottom section
    if (bottomSection) bottomSection.classList.remove('hidden');

    let total = 0;

    cart.forEach(item => {
        total += (item.price * item.quantity);
        const itemHTML = `
            <div class="flex gap-4 mb-6">
                <a href="product_detail.html?id=${item.id}" class="w-24 h-24 flex-shrink-0 border border-gray-200">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain p-1">
                </a>
                <div class="flex-1 flex flex-col items-start">
                     <a href="product_detail.html?id=${item.id}" class="text-sm font-medium uppercase text-black hover:text-gray-600 transition-colors block mb-1 tracking-wide">
                        ${item.name}
                    </a>
                    <div class="text-xs text-gray-500 mb-3">
                        ${item.color ? `<p class="mb-0.5"><span class='font-semibold'>Color:</span> ${item.color}</p>` : ''}
                        ${item.size ? `<p><span class='font-semibold'>Size:</span> ${item.size}</p>` : ''}
                    </div>

                     <div class="text-base font-normal text-black mb-3">
                        Rs. ${(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                     </div>

                     <div class="flex items-center gap-4">
                         <div class="flex items-center border border-gray-200 bg-white rounded-sm h-8 w-24">
                            <button onclick="updateDrawerQuantity('${item.instanceId}', -1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">-</button>
                            <span class="flex-1 text-center text-sm font-medium h-full flex items-center justify-center">${item.quantity}</span>
                            <button onclick="updateDrawerQuantity('${item.instanceId}', 1)" class="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors">+</button>
                         </div>
                         <button onclick="removeFromCart('${item.instanceId}', -${item.quantity})" class="text-xs underline text-gray-500 hover:text-black transition-colors">
                            Remove
                         </button>
                     </div>
                </div>
            </div>
        `;
        list.insertAdjacentHTML('beforeend', itemHTML);
    });

    if (subtotalEl) {
        subtotalEl.textContent = `Rs. ${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }
}

function updateDrawerQuantity(instanceId, change) {
    let cart = JSON.parse(localStorage.getItem('hoodvibe_cart')) || [];
    const itemIndex = cart.findIndex(item => item.instanceId === instanceId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) cart[itemIndex].quantity = 1;

        localStorage.setItem('hoodvibe_cart', JSON.stringify(cart));
        renderCartDrawer();
        updateCartBadge();
        // Also update full cart if open
        if (typeof renderFullCart === 'function') renderFullCart();
    }
}

function removeFromCart(instanceId, change) {
    let cart = JSON.parse(localStorage.getItem('hoodvibe_cart')) || [];
    const itemIndex = cart.findIndex(item => item.instanceId === instanceId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) {
            // Remove item if quantity goes to 0? Or keep at 1? Usually remove or keep 1.
            // Let's remove for better UX in drawer
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem('hoodvibe_cart', JSON.stringify(cart));
        renderCartDrawer();
        updateCartBadge();
        // Also update full cart if open
        if (typeof renderFullCart === 'function') renderFullCart();
    }
}
