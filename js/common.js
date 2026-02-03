/**
 * Common JavaScript Functionality
 * Shared across index.html, product_list.html, and product_detail.html
 */

document.addEventListener("DOMContentLoaded", () => {
    // Dynamic Copyright Year
    const yearSpan = document.getElementById("copyright-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Scroll to Top Logic
    const scrollToTopBtn = document.getElementById("scroll-to-top");
    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove(
                    "opacity-0",
                    "invisible",
                    "translate-y-4",
                );
                scrollToTopBtn.classList.add("opacity-100", "visible", "translate-y-0");
            } else {
                scrollToTopBtn.classList.add("opacity-0", "invisible", "translate-y-4");
                scrollToTopBtn.classList.remove(
                    "opacity-100",
                    "visible",
                    "translate-y-0",
                );
            }
        });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Mobile Search Input Listener
    const mobileSearchInput = document.getElementById("mobile-search-input");
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                window.location.href =
                    "product_list.html?search=" + encodeURIComponent(e.target.value);
            }
        });
    }

    // Desktop Search Logic
    const desktopSearchInput = document.getElementById("search-input-field");
    const desktopSearchBtn = document.getElementById("search-btn-icon");

    if (desktopSearchInput) {
        desktopSearchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                window.location.href =
                    "product_list.html?search=" + encodeURIComponent(e.target.value);
            }
        });
    }

    // Wishlist/Favorite Button Logic
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    wishlistBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent navigation if wrapped in link

            // Extract data from attributes
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            const image = btn.dataset.image;
            const originalPrice = btn.dataset.originalPrice;
            const offer = btn.dataset.offer;
            const tag = btn.dataset.tag;

            if (id) {
                toggleWishlist({ id, name, price, image, originalPrice, offer, tag }, btn);
            }
        });
    });

    // Check Wishlist UI on load
    checkWishlistUI();
    updateWishlistBadge();

    // Search Bar Highlight Logic
    const searchInput = document.getElementById("search-input-field");
    const searchBtn = document.getElementById("search-btn-icon");

    if (searchInput && searchBtn) {
        searchInput.addEventListener("input", () => {
            if (searchInput.value.trim() !== "") {
                // Highlight icon
                searchBtn.classList.remove("text-gray-500", "dark:text-gray-400");
                searchBtn.classList.add("text-black", "dark:text-white");
            } else {
                // Revert to default
                searchBtn.classList.add("text-gray-500", "dark:text-gray-400");
                searchBtn.classList.remove("text-black", "dark:text-white");
            }
        });
    }

    if (desktopSearchBtn && desktopSearchInput) {
        desktopSearchBtn.addEventListener("click", function () {
            window.location.href =
                "product_list.html?search=" +
                encodeURIComponent(desktopSearchInput.value);
        });
    }
});

// Mobile Menu Logic
function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu-drawer");
    const btn = document.getElementById("mobile-menu-btn");
    const icon = document.getElementById("mobile-menu-icon");
    const stickyCartBar = document.getElementById("sticky-cart-bar");

    const isOpen = !menu.classList.contains("-translate-x-full");

    if (isOpen) {
        // Close Menu
        menu.classList.add("-translate-x-full");
        document.body.classList.remove("overflow-hidden");

        // Show Sticky Cart (Product Detail Page specific, simplified check)
        if (stickyCartBar) stickyCartBar.classList.remove("hidden");

        // Animate Icon to Menu
        if (btn) btn.classList.remove("rotate-90");
        if (icon) icon.textContent = "menu";
    } else {
        // Open Menu
        menu.classList.remove("-translate-x-full");
        document.body.classList.add("overflow-hidden");

        // Hide Sticky Cart
        if (stickyCartBar) stickyCartBar.classList.add("hidden");

        // Animate Icon to Close
        if (btn) btn.classList.add("rotate-90");
        if (icon) icon.textContent = "close";
    }
}

function toggleMobileSubmenu(submenuId, chevronId) {
    const submenu = document.getElementById(submenuId);
    const chevron = document.getElementById(chevronId);

    if (submenu && submenu.classList.contains("hidden")) {
        submenu.classList.remove("hidden");
        if (
            (chevronId.includes("products") || chevronId.includes("user")) &&
            chevron
        ) {
            chevron.style.transform = "rotate(180deg)";
        } else if (chevron) {
            chevron.innerText = "remove";
        }
    } else if (submenu) {
        submenu.classList.add("hidden");
        if (
            (chevronId.includes("products") || chevronId.includes("user")) &&
            chevron
        ) {
            chevron.style.transform = "rotate(0deg)";
        } else if (chevron) {
            chevron.innerText = "add";
        }
    }
}

function toggleSearchModal() {
    const modal = document.getElementById("search-modal");
    const input = document.getElementById("mobile-search-input");

    if (!modal) return;

    const isOpen = !modal.classList.contains("translate-y-full");

    if (isOpen) {
        modal.classList.add("translate-y-full");
        document.body.classList.remove("overflow-hidden");
    } else {
        modal.classList.remove("translate-y-full");
        document.body.classList.add("overflow-hidden");
        if (input) setTimeout(() => input.focus(), 300);
    }
}

// --- Cart Logic (Shared) ---

// Initialize Cart and Popups on Load
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    injectLoginPopup();

    // Inject Search Modal if not present (Checking mobile search input wrapper exists to determine if we need it, or just inject if missing)
    // Actually search modal is usually in HTML, but cart drawer might be missing on some pages.

    // Inject Cart Drawer Markup if not present
    if (!document.getElementById("cart-drawer")) {
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
        document.body.insertAdjacentHTML("beforeend", drawerHTML);
    }
});

// Login Popup Logic
function injectLoginPopup() {
    if (!document.getElementById("login-popup")) {
        const popupHTML = `
            <div id="login-popup" class="fixed inset-0 z-[60] invisible opacity-0 transition-opacity duration-300">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="toggleLoginModal()"></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-card-dark p-8 rounded-lg shadow-2xl">
                    <button onclick="toggleLoginModal()" class="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                        <span class="material-icons">close</span>
                    </button>
                    <div id="login-step-email">
                        <div class="text-center mb-8">
                            <img src="images/Clothyfly-dark.svg" alt="Clothyfly" class="h-8 mx-auto mb-4 dark:invert" />
                            <h2 class="text-xl font-bold mb-1 dark:text-white">Sign in</h2>
                            <p class="text-gray-500 dark:text-gray-400 text-sm">Sign in or create an account</p>
                        </div>
                        <form class="space-y-4" onsubmit="handleLoginSubmit(event)">
                            <div>
                                <input id="login-email" type="text" placeholder="Email" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="login-email-error" class="hidden text-red-600 text-sm mt-1 text-left">Enter a valid email address</p>
                            </div>
                            <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Continue</button>
                        </form>
                        <div class="relative my-8">
                            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
                            <div class="relative flex justify-center text-sm"><span class="px-4 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400">or</span></div>
                        </div>
                        <div class="space-y-3">
                            <button onclick="switchToCreateAccount()" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Create Account</button>
                            <button class="w-full border border-black dark:border-white text-black dark:text-white font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                                 <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                 </svg>
                                 Sign in with Google
                            </button>
                        </div>
                        <div class="mt-8 text-center text-xs text-gray-400">
                            By continuing, you agree to our <a href="#" class="underline hover:text-black dark:hover:text-white">Terms of Service</a> & <a href="#" class="underline hover:text-black dark:hover:text-white">Privacy Policy</a>
                        </div>
                    </div>

                    <!-- OTP Step -->
                    <div id="login-step-otp" class="hidden">
                         <div class="text-center mb-8">
                            <img src="images/Clothyfly-dark.svg" alt="Clothyfly" class="h-8 mx-auto mb-4 dark:invert" />
                            <h2 class="text-xl font-bold mb-1 dark:text-white text-left">Enter code</h2>
                            <p class="text-gray-500 dark:text-gray-400 text-sm text-left">Sent to <span id="otp-email-display"></span></p>
                        </div>
                        <form class="space-y-4" onsubmit="handleOtpSubmit(event)">
                            <div>
                                <input id="login-otp" type="text" placeholder="6-digit code" maxlength="6" oninput="this.value = this.value.replace(/[^0-9]/g, '')" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="login-otp-error" class="hidden text-red-600 text-sm mt-1 text-left">Enter the correct 6-digit code</p>
                            </div>
                            <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Submit</button>
                        </form>
                        <div class="mt-4 text-left">
                            <button id="otp-back-btn" onclick="switchBackToEmail()" class="text-black dark:text-white hover:underline text-sm font-medium">Sign in with a different email</button>
                        </div>
                    </div>

                    <!-- Create Account Step -->
                    <div id="login-step-create-account" class="hidden">
                        <div class="text-center mb-6">
                            <img src="images/Clothyfly-dark.svg" alt="Clothyfly" class="h-8 mx-auto mb-4 dark:invert" />
                            <h2 class="text-xl font-bold mb-1 dark:text-white">Create Account</h2>
                            <p class="text-gray-500 dark:text-gray-400 text-sm">create an account or sign in</p>
                        </div>
                        <form class="space-y-4" onsubmit="handleCreateAccountSubmit(event)">
                            <div>
                                <input id="create-account-firstname" type="text" placeholder="First name" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="create-account-firstname-error" class="hidden text-red-600 text-sm mt-1 text-left">First name is required</p>
                            </div>
                            <div>
                                <input id="create-account-lastname" type="text" placeholder="Last name" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="create-account-lastname-error" class="hidden text-red-600 text-sm mt-1 text-left">Last name is required</p>
                            </div>
                            <div>
                                <input id="create-account-email" type="text" placeholder="Email" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                <p id="create-account-email-error" class="hidden text-red-600 text-sm mt-1 text-left">Enter a valid email address</p>
                            </div>
                            <button type="submit" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Create Account</button>
                        </form>
                        <div class="relative my-6">
                            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
                            <div class="relative flex justify-center text-sm"><span class="px-4 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400">or</span></div>
                        </div>
                        <div class="space-y-3">
                            <button onclick="switchToLogin()" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Login</button>
                            <button class="w-full border border-black dark:border-white text-black dark:text-white font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                        <div class="mt-6 text-center text-xs text-gray-400">
                            By continuing, you agree to our <a href="#" class="underline hover:text-black dark:hover:text-white">Terms of Service</a> & <a href="#" class="underline hover:text-black dark:hover:text-white">Privacy Policy</a>
                        </div>
                    </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", popupHTML);
    }
}

function handleCreateAccountSubmit(event) {
    event.preventDefault();
    const firstNameInput = document.getElementById("create-account-firstname");
    const lastNameInput = document.getElementById("create-account-lastname");
    const emailInput = document.getElementById("create-account-email");

    const firstNameError = document.getElementById(
        "create-account-firstname-error",
    );
    const lastNameError = document.getElementById(
        "create-account-lastname-error",
    );
    const emailError = document.getElementById("create-account-email-error");

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    // Validate First Name
    if (!firstName) {
        firstNameInput.classList.add("border-red-600", "focus:ring-red-600");
        firstNameInput.classList.remove("focus:ring-black");
        firstNameError.classList.remove("hidden");
        isValid = false;
    } else {
        firstNameInput.classList.remove("border-red-600", "focus:ring-red-600");
        firstNameInput.classList.add("focus:ring-black");
        firstNameError.classList.add("hidden");
    }

    // Validate Last Name
    if (!lastName) {
        lastNameInput.classList.add("border-red-600", "focus:ring-red-600");
        lastNameInput.classList.remove("focus:ring-black");
        lastNameError.classList.remove("hidden");
        isValid = false;
    } else {
        lastNameInput.classList.remove("border-red-600", "focus:ring-red-600");
        lastNameInput.classList.add("focus:ring-black");
        lastNameError.classList.add("hidden");
    }

    // Validate Email
    if (!email || !emailRegex.test(email)) {
        emailInput.classList.add("border-red-600", "focus:ring-red-600");
        emailInput.classList.remove("focus:ring-black");
        emailError.classList.remove("hidden");
        isValid = false;
    } else {
        emailInput.classList.remove("border-red-600", "focus:ring-red-600");
        emailInput.classList.add("focus:ring-black");
        emailError.classList.add("hidden");
    }

    if (isValid) {
        // Proceed with account creation logic here
        // Switch to OTP Step
        document
            .getElementById("login-step-create-account")
            .classList.add("hidden");
        document.getElementById("login-step-otp").classList.remove("hidden");
        document.getElementById("otp-email-display").textContent = email;
        //OTP UI Reset
        document.getElementById("login-otp-error").classList.add("hidden");
        document
            .getElementById("login-otp")
            .classList.remove("border-red-600", "focus:ring-red-600");
        document
            .getElementById("login-otp")
            .classList.add("focus:ring-black", "border-gray-300");
        document.getElementById("login-otp").value = "";

        // Update Back Button for Create Account
        const backBtn = document.getElementById("otp-back-btn");
        if (backBtn) {
            backBtn.textContent = "Sign up with a different email";
            backBtn.onclick = () => switchToCreateAccount(true);
        }
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const emailInput = document.getElementById("login-email");
    const errorMsg = document.getElementById("login-email-error");
    const email = emailInput.value.trim();

    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        // Show Error
        emailInput.classList.add("border-red-600");
        emailInput.classList.remove("focus:ring-black");
        emailInput.classList.add("focus:ring-red-600");
        errorMsg.classList.remove("hidden");
    } else {
        // Hide Error
        emailInput.classList.remove("border-red-600");
        emailInput.classList.remove("focus:ring-red-600");
        emailInput.classList.add("focus:ring-black");
        errorMsg.classList.add("hidden");

        // Switch to OTP Step
        document.getElementById("login-step-email").classList.add("hidden");
        document.getElementById("login-step-otp").classList.remove("hidden");
        document.getElementById("otp-email-display").textContent = email;
        //OTP UI Reset
        document.getElementById("login-otp-error").classList.add("hidden");
        document
            .getElementById("login-otp")
            .classList.remove("border-red-600", "focus:ring-red-600");
        document
            .getElementById("login-otp")
            .classList.add("focus:ring-black", "border-gray-300");
        document.getElementById("login-otp").value = "";

        // Reset Back Button to Default (Login)
        const backBtn = document.getElementById("otp-back-btn");
        if (backBtn) {
            backBtn.textContent = "Sign in with a different email";
            backBtn.onclick = switchBackToEmail;
        }
    }
}

function handleOtpSubmit(event) {
    event.preventDefault();
    const otpInput = document.getElementById("login-otp");
    const errorMsg = document.getElementById("login-otp-error");
    const otp = otpInput.value.trim();

    // Check if OTP is exactly 6 digits
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        // Show Error
        otpInput.classList.add("border-red-600");
        otpInput.classList.remove("focus:ring-black");
        otpInput.classList.add("focus:ring-red-600");
        errorMsg.classList.remove("hidden");
    } else {
        // Hide Error
        otpInput.classList.remove("border-red-600");
        otpInput.classList.remove("focus:ring-red-600");
        otpInput.classList.add("focus:ring-black");
        errorMsg.classList.add("hidden");

        // Simulate OTP verification & Login
        const mockUser = {
            firstname: "Rohit",
            lastname: "Kardani",
            email: "kardanirohit9@gmail.com",
        };
        localStorage.setItem("hoodvibe_user", JSON.stringify(mockUser));
        console.log("User logged in:", mockUser);
        checkLoginState(); // Update Header Icon

        toggleLoginModal(); // Close popup
        // Reset after transition
        setTimeout(() => {
            switchBackToEmail();
            otpInput.value = ""; // Clear OTP
        }, 300);
    }
}

function switchBackToEmail() {
    document.getElementById("login-step-otp").classList.add("hidden");
    document.getElementById("login-step-create-account").classList.add("hidden");
    document.getElementById("login-step-email").classList.remove("hidden");
}

function resetCreateAccountForm() {
    const caFields = ["firstname", "lastname", "email"];
    caFields.forEach((field) => {
        const input = document.getElementById(`create-account-${field}`);
        const error = document.getElementById(`create-account-${field}-error`);
        if (input && error) {
            input.value = "";
            input.classList.remove("border-red-600", "focus:ring-red-600");
            input.classList.add("focus:ring-black", "border-gray-300");
            error.classList.add("hidden");
        }
    });
}

function switchToCreateAccount(keepData = false) {
    document.getElementById("login-step-email").classList.add("hidden");
    document.getElementById("login-step-otp").classList.add("hidden");
    document
        .getElementById("login-step-create-account")
        .classList.remove("hidden");
    if (!keepData) {
        resetCreateAccountForm();
    }
}

function switchToLogin() {
    switchBackToEmail();
    resetLoginPopupUI();
}

function resetLoginPopupUI() {
    document.getElementById("login-otp").value = "";
    document.getElementById("login-email").value = "";
    document.getElementById("login-email-error").classList.add("hidden");
    document.getElementById("login-otp-error").classList.add("hidden");
    document
        .getElementById("login-otp")
        .classList.remove("border-red-600", "focus:ring-red-600");
    document
        .getElementById("login-otp")
        .classList.add("focus:ring-black", "border-gray-300");
    document
        .getElementById("login-email")
        .classList.remove("border-red-600", "focus:ring-red-600");
    document
        .getElementById("login-email")
        .classList.add("focus:ring-black", "border-gray-300");

    // Reset Create Account UI (reusing logic implicitly by ensuring clean state)
    // For cleaner code, we can call switchToCreateAccount reset logic here if extracted,
    // but effectively we just need to ensure fields are clean.
    // Since switchToCreateAccount is called on switch, we just need to ensure resetting the popup also resets these fields.

    // We can also extract this to a function if needed, but for now duplicating the short loop or relying on switch logic is fine.
    // Let's duplicate the reset loop here to ensure it's cleared on popup close too.
    const caFields = ["firstname", "lastname", "email"];
    caFields.forEach((field) => {
        const input = document.getElementById(`create-account-${field}`);
        const error = document.getElementById(`create-account-${field}-error`);
        if (input && error) {
            input.value = "";
            input.classList.remove("border-red-600", "focus:ring-red-600");
            input.classList.add("focus:ring-black", "border-gray-300");
            error.classList.add("hidden");
        }
    });
}

// Smart Dispatcher: Called by Header Icon
function toggleLoginPopup() {
    const user = localStorage.getItem("hoodvibe_user");
    if (user) {
        toggleProfilePopup();
    } else {
        toggleLoginModal();
    }
}

// Dumb Visibility Toggle: Called by Internal Interactions (Close Btn, OTP Success)
function toggleLoginModal() {
    const popup = document.getElementById("login-popup");
    if (popup) {
        if (popup.classList.contains("invisible")) {
            // Opening
            resetLoginPopupUI();
            switchBackToEmail();
            popup.classList.remove("invisible", "opacity-0");
            document.body.classList.add("overflow-hidden");
        } else {
            // Closing
            popup.classList.add("invisible", "opacity-0");
            document.body.classList.remove("overflow-hidden");
        }
    }
}

function toggleCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) {
        if (drawer.classList.contains("invisible")) {
            drawer.classList.remove("invisible", "opacity-0");
            drawer
                .querySelector('div[class*="translate-x-full"]')
                .classList.remove("translate-x-full");
            document.body.classList.add("overflow-hidden");
            renderCartDrawer();
        } else {
            drawer.classList.add("invisible", "opacity-0");
            drawer
                .querySelector('div[class*="translate-x-full"]')
                .classList.add("translate-x-full");
            document.body.classList.remove("overflow-hidden");
        }
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("hoodvibe_cart")) || [];

    // Create unique instance ID based on product ID + options
    // (so same product with different sizes are different items)
    const instanceId = `${product.id}-${product.size || "M"}-${product.color || "Default"}`;

    const existingItemIndex = cart.findIndex(
        (item) => item.instanceId === instanceId,
    );

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            ...product,
            instanceId,
            quantity: 1,
        });
    }

    localStorage.setItem("hoodvibe_cart", JSON.stringify(cart));
    updateCartBadge();
    toggleCartDrawer(); // Open drawer on add
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("hoodvibe_cart")) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Select all elements with class 'cart-count-badge' (header + bottom bar)
    // Also keeping ID selection as fallback or for specific elements if needed,
    // but class is preferred for multiple instances.
    const badges = document.querySelectorAll(
        ".cart-count-badge, #cart-count-badge",
    );

    badges.forEach((badge) => {
        if (badge) {
            badge.textContent = count;
            if (count > 0) {
                badge.classList.remove("hidden");
            } else {
                badge.classList.add("hidden");
            }
        }
    });
}

function renderCartDrawer() {
    const list = document.getElementById("cart-drawer-items");
    const bottomSection = document.getElementById("cart-drawer-bottom");
    const subtotalEl = document.getElementById("cart-drawer-subtotal");

    if (!list) return;

    const cart = JSON.parse(localStorage.getItem("hoodvibe_cart")) || [];
    list.innerHTML = "";

    if (cart.length === 0) {
        list.innerHTML =
            '<p class="text-left text-base text-black dark:text-gray-300 pt-2 px-1">Your cart is currently empty.</p>';
        if (bottomSection) bottomSection.classList.add("hidden");
        if (subtotalEl) subtotalEl.textContent = "Rs. 0.00";
        return;
    }

    // If we have items, show the bottom section
    if (bottomSection) bottomSection.classList.remove("hidden");

    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;
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
                        ${item.color ? `<p class="mb-0.5"><span class='font-semibold'>Color:</span> ${item.color}</p>` : ""}
                        ${item.size ? `<p><span class='font-semibold'>Size:</span> ${item.size}</p>` : ""}
                    </div>

                     <div class="text-base font-normal text-black mb-3">
                        Rs. ${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
        list.insertAdjacentHTML("beforeend", itemHTML);
    });

    if (subtotalEl) {
        subtotalEl.textContent = `Rs. ${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    }
}

function updateDrawerQuantity(instanceId, change) {
    let cart = JSON.parse(localStorage.getItem("hoodvibe_cart")) || [];
    const itemIndex = cart.findIndex((item) => item.instanceId === instanceId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) cart[itemIndex].quantity = 1;

        localStorage.setItem("hoodvibe_cart", JSON.stringify(cart));
        renderCartDrawer();
        updateCartBadge();
        // Also update full cart if open
        if (typeof renderFullCart === "function") renderFullCart();
    }
}

function removeFromCart(instanceId, change) {
    let cart = JSON.parse(localStorage.getItem("hoodvibe_cart")) || [];
    const itemIndex = cart.findIndex((item) => item.instanceId === instanceId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) {
            // Remove item if quantity goes to 0? Or keep at 1? Usually remove or keep 1.
            // Let's remove for better UX in drawer
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem("hoodvibe_cart", JSON.stringify(cart));
        renderCartDrawer();
        updateCartBadge();
        // Also update full cart if open
        if (typeof renderFullCart === "function") renderFullCart();
    }
}

// Check Login State on Load
function checkLoginState() {
    const user = JSON.parse(localStorage.getItem("hoodvibe_user"));
    // Select the button by its onclick attribute
    const loginBtn = document.querySelector(
        'button[onclick="toggleLoginPopup()"]',
    );
    const loginIcon = loginBtn ? loginBtn.querySelector(".material-icons") : null;

    if (user && loginIcon) {
        // User is logged in
        loginIcon.textContent = "person";

        // Populate Profile Popup if it exists
        const initials = document.getElementById("profile-initials");
        const name = document.getElementById("profile-name");
        const email = document.getElementById("profile-email");

        if (initials && name && email) {
            initials.textContent = (
                user.firstname[0] + user.lastname[0]
            ).toUpperCase();
            name.textContent = `${user.firstname} ${user.lastname}`;
            email.textContent = user.email;
        }

        // Mobile Drawer: Show User View
        const mobileGuest = document.getElementById("mobile-drawer-guest");
        const mobileUser = document.getElementById("mobile-drawer-user");
        if (mobileName)
            mobileName.textContent = `${user.firstname} ${user.lastname}`;
    } else {
        // User is not logged in
        if (loginIcon) loginIcon.textContent = "person_outline";

        // Mobile Drawer: Show Guest View
        const mobileGuest = document.getElementById("mobile-drawer-guest");
        const mobileUser = document.getElementById("mobile-drawer-user");

        if (mobileGuest) mobileGuest.classList.remove("hidden");
        if (mobileUser) mobileUser.classList.add("hidden");
    }
}

// --- Wishlist Logic ---

function toggleWishlist(product, btn) {
    let wishlist = JSON.parse(localStorage.getItem("hoodvibe_wishlist")) || [];
    const index = wishlist.findIndex((item) => item.id === product.id);

    if (index > -1) {
        // Remove
        wishlist.splice(index, 1);
        updateHeartIcon(btn, false);
    } else {
        // Add
        wishlist.push(product);
        updateHeartIcon(btn, true);
    }

    localStorage.setItem("hoodvibe_wishlist", JSON.stringify(wishlist));
    updateWishlistBadge();
    checkWishlistUI(); // Update other buttons for same product if any
}

function updateHeartIcon(btn, isFilled) {
    if (!btn) return;
    const icon = btn.querySelector(".material-icons");
    if (!icon) return;

    if (isFilled) {
        icon.textContent = "favorite";
        btn.classList.add("text-red-500");
        if (!btn.classList.contains("text-white")) {
            // Only remove black if it's not a white-text button (helper)
            // Actually, usually we toggle class but let's be safe
            btn.classList.remove("text-black");
            btn.classList.remove("text-gray-400"); // Mobile nav
        }
    } else {
        icon.textContent = "favorite_border";
        btn.classList.remove("text-red-500");
        // Restore default color - usually black or gray depending on context
        // This is tricky without knowing original class.
        // For simplicity, we assume generic card hearts are black on hover/active.
        // Let's check class list to decide.
        btn.classList.add("text-black");
    }
}

function checkWishlistUI() {
    let wishlist = JSON.parse(localStorage.getItem("hoodvibe_wishlist")) || [];
    const wishlistIds = wishlist.map(item => item.id);
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");

    wishlistBtns.forEach(btn => {
        const id = btn.dataset.id;
        if (wishlistIds.includes(id)) {
            updateHeartIcon(btn, true);
        } else {
            updateHeartIcon(btn, false);
        }
    });
}

function updateWishlistBadge() {
    const wishlist = JSON.parse(localStorage.getItem("hoodvibe_wishlist")) || [];
    const count = wishlist.length;

    // Header Heart Icon Badge
    // We need to find the badge element inside the header heart link
    // The header link href="wishlist.html"
    const wishlistLinks = document.querySelectorAll('a[href="wishlist.html"]');

    wishlistLinks.forEach(link => {
        const badge = link.querySelector("span.absolute"); // Assuming structure
        if (badge) {
            badge.textContent = count;
            if (count > 0) {
                badge.classList.remove("hidden"); // Ensure it's visible (some might be hidden by default)
                // Or just ensure text is set, if css handles visibility for 0
                // The original code had style="... hidden" for 0?
                // Let's assume we just set text.
                // Wait, existing badge code for cart sets hidden if 0.
                badge.style.display = count > 0 ? "flex" : "none";
            } else {
                badge.style.display = "none";
            }
        }
    });

}

// Inject Profile Popup
function injectProfilePopup() {
    if (!document.getElementById("profile-popup")) {
        const popupHTML = `
            <div id="profile-popup" class="hidden absolute top-16 right-4 sm:right-16 z-50 w-72 bg-white dark:bg-card-dark rounded shadow-xl border border-gray-100 dark:border-gray-800 transition-all origin-top-right">
                <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div id="profile-initials" class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-black dark:text-white">
                        <!-- Initials -->
                    </div>
                    <div class="overflow-hidden">
                        <h3 id="profile-name" class="font-bold text-gray-900 dark:text-white truncate"><!-- Name --></h3>
                        <p id="profile-email" class="text-xs text-gray-500 truncate"><!-- Email --></p>
                    </div>
                </div>
                <div class="py-2">
                    <a href="#" class="block px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Profile</a>
                    <a href="#" class="block px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Orders</a>
                </div>
                <div class="py-2 border-t border-gray-100 dark:border-gray-800">
                     <button onclick="handleLogout()" class="w-full text-left px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Sign out</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", popupHTML);
    }
}

function toggleProfilePopup() {
    const popup = document.getElementById("profile-popup");
    if (!popup) return;

    if (popup.classList.contains("hidden")) {
        popup.classList.remove("hidden");
        // Close on click outside
        setTimeout(() => {
            document.addEventListener("click", closeProfilePopupOutside);
        }, 0);
    } else {
        popup.classList.add("hidden");
        document.removeEventListener("click", closeProfilePopupOutside);
    }
}

function closeProfilePopupOutside(e) {
    const popup = document.getElementById("profile-popup");
    const loginBtn = document.querySelector(
        'button[onclick="toggleLoginPopup()"]',
    ); // The trigger button

    // If click is NOT in popup AND NOT on the trigger button
    if (popup && !popup.contains(e.target) && !loginBtn.contains(e.target)) {
        popup.classList.add("hidden");
        document.removeEventListener("click", closeProfilePopupOutside);
    }
}

function handleLogout() {
    localStorage.removeItem("hoodvibe_user");
    checkLoginState(); // Reset Icon & Drawer

    // Explicitly Close Profile Popup
    const popup = document.getElementById("profile-popup");
    if (popup) {
        popup.classList.add("hidden");
        document.removeEventListener("click", closeProfilePopupOutside);
    }

    // Ideally redirect to home or show toast
    console.log("Logged out");
}

document.addEventListener("DOMContentLoaded", () => {
    injectProfilePopup();
    checkLoginState();
});
