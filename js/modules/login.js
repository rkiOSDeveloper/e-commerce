/**
 * Login Module
 * Handles login popup, authentication forms, and user state
 */

import { CONFIG } from '../utils/config.js';
import { StorageManager } from '../utils/storage.js';
import { DOMUtils } from '../utils/dom.js';
import { Validator } from '../utils/validator.js';

/**
 * Login Manager Class
 */
export class LoginManager {
    /**
     * Inject login popup HTML into DOM
     */
    static injectPopup() {
        if (!DOMUtils.get(`#${CONFIG.IDS.LOGIN_POPUP}`)) {
            const popupHTML = `
                <div id="login-popup" class="fixed inset-0 z-[60] invisible opacity-0 transition-opacity duration-300">
                    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="window.loginManager.toggleModal()"></div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-card-dark p-8 rounded-lg shadow-2xl">
                        <button onclick="window.loginManager.toggleModal()" class="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                            <span class="material-icons">close</span>
                        </button>
                        <div id="login-step-email">
                            <div class="text-center mb-8">
                                <img src="images/Clothyfly-dark.svg" alt="Clothyfly" class="h-8 mx-auto mb-4 dark:invert" />
                                <h2 class="text-xl font-bold mb-1 dark:text-white">Sign in</h2>
                                <p class="text-gray-500 dark:text-gray-400 text-sm">Sign in or create an account</p>
                            </div>
                            <form class="space-y-4" onsubmit="window.loginManager.handleEmailSubmit(event)">
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
                                <button onclick="window.loginManager.switchToCreateAccount()" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Create Account</button>
                                <button class="w-full border border-black dark:border-white text-black dark:text-white font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                                     <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
                            <form class="space-y-4" onsubmit="window.loginManager.handleOTPSubmit(event)">
                                <div>
                                    <input id="login-otp" type="text" placeholder="6-digit code" maxlength="6" oninput="this.value = this.value.replace(/[^0-9]/g, '')" class="w-full border border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-white focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white rounded-lg p-3 outline-none transition-colors">
                                    <p id="login-otp-error" class="hidden text-red-600 text-sm mt-1 text-left">Enter the correct 6-digit code</p>
                                </div>
                                <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Submit</button>
                            </form>
                            <div class="mt-4 text-left">
                                <button id="otp-back-btn" onclick="window.loginManager.switchBackToEmail()" class="text-black dark:text-white hover:underline text-sm font-medium">Sign in with a different email</button>
                            </div>
                        </div>

                        <!-- Create Account Step -->
                        <div id="login-step-create-account" class="hidden">
                            <div class="text-center mb-6">
                                <img src="images/Clothyfly-dark.svg" alt="Clothyfly" class="h-8 mx-auto mb-4 dark:invert" />
                                <h2 class="text-xl font-bold mb-1 dark:text-white">Create Account</h2>
                                <p class="text-gray-500 dark:text-gray-400 text-sm">create an account or sign in</p>
                            </div>
                            <form class="space-y-4" onsubmit="window.loginManager.handleCreateAccountSubmit(event)">
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
                                <button onclick="window.loginManager.switchToLogin()" class="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">Login</button>
                                <button class="w-full border border-black dark:border-white text-black dark:text-white font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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

    /**
     * Handle email form submission
     */
    static handleEmailSubmit(event) {
        event.preventDefault();
        const emailInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL}`);
        const errorMsg = DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL_ERROR}`);
        const email = emailInput.value.trim();

        if (!Validator.isValidEmail(email)) {
            DOMUtils.addClass(emailInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.removeClass(emailInput, "focus:ring-black");
            DOMUtils.removeClass(errorMsg, CONFIG.CLASSES.HIDDEN);
        } else {
            DOMUtils.removeClass(emailInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.addClass(emailInput, "focus:ring-black");
            DOMUtils.addClass(errorMsg, CONFIG.CLASSES.HIDDEN);

            // Switch to OTP Step
            DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_EMAIL}`), CONFIG.CLASSES.HIDDEN);
            DOMUtils.removeClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_OTP}`), CONFIG.CLASSES.HIDDEN);
            DOMUtils.setText(`#${CONFIG.IDS.OTP_EMAIL_DISPLAY}`, email);

            // Reset OTP UI
            DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP_ERROR}`), CONFIG.CLASSES.HIDDEN);
            DOMUtils.removeClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`), "border-red-600", "focus:ring-red-600");
            DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`), "focus:ring-black", "border-gray-300");
            DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`).value = "";

            // Reset Back Button
            const backBtn = DOMUtils.get(`#${CONFIG.IDS.OTP_BACK_BTN}`);
            if (backBtn) {
                backBtn.textContent = "Sign in with a different email";
                backBtn.onclick = () => this.switchBackToEmail();
            }
        }
    }

    /**
     * Handle OTP form submission
     */
    static handleOTPSubmit(event) {
        event.preventDefault();
        const otpInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`);
        const errorMsg = DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP_ERROR}`);
        const otp = otpInput.value.trim();

        if (!Validator.isValidOTP(otp)) {
            DOMUtils.addClass(otpInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.removeClass(otpInput, "focus:ring-black");
            DOMUtils.removeClass(errorMsg, CONFIG.CLASSES.HIDDEN);
        } else {
            DOMUtils.removeClass(otpInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.addClass(otpInput, "focus:ring-black");
            DOMUtils.addClass(errorMsg, CONFIG.CLASSES.HIDDEN);

            // Simulate OTP verification & Login
            const mockUser = {
                firstname: "Rohit",
                lastname: "Kardani",
                email: "kardanirohit9@gmail.com",
            };
            StorageManager.saveUser(mockUser);
            console.log("User logged in:", mockUser);
            this.checkLoginState();

            // Check for pending wishlist item
            const pendingWishlist = StorageManager.getPendingWishlist();
            if (pendingWishlist && typeof window.wishlistManager !== 'undefined') {
                try {
                    window.wishlistManager.toggle(pendingWishlist, null);
                    StorageManager.clearPendingWishlist();
                } catch (e) {
                    console.error("Error processing pending wishlist item", e);
                }
            }

            this.toggleModal();
            setTimeout(() => {
                this.switchBackToEmail();
                otpInput.value = "";
            }, 300);
        }
    }

    /**
     * Handle create account form submission
     */
    static handleCreateAccountSubmit(event) {
        event.preventDefault();
        const firstNameInput = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_FIRSTNAME}`);
        const lastNameInput = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_LASTNAME}`);
        const emailInput = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_EMAIL}`);

        const firstNameError = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_FIRSTNAME_ERROR}`);
        const lastNameError = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_LASTNAME_ERROR}`);
        const emailError = DOMUtils.get(`#${CONFIG.IDS.CREATE_ACCOUNT_EMAIL_ERROR}`);

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();

        let isValid = true;

        // Validate First Name
        if (!firstName) {
            DOMUtils.addClass(firstNameInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.removeClass(firstNameInput, "focus:ring-black");
            DOMUtils.removeClass(firstNameError, CONFIG.CLASSES.HIDDEN);
            isValid = false;
        } else {
            DOMUtils.removeClass(firstNameInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.addClass(firstNameInput, "focus:ring-black");
            DOMUtils.addClass(firstNameError, CONFIG.CLASSES.HIDDEN);
        }

        // Validate Last Name
        if (!lastName) {
            DOMUtils.addClass(lastNameInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.removeClass(lastNameInput, "focus:ring-black");
            DOMUtils.removeClass(lastNameError, CONFIG.CLASSES.HIDDEN);
            isValid = false;
        } else {
            DOMUtils.removeClass(lastNameInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.addClass(lastNameInput, "focus:ring-black");
            DOMUtils.addClass(lastNameError, CONFIG.CLASSES.HIDDEN);
        }

        // Validate Email
        if (!email || !Validator.isValidEmail(email)) {
            DOMUtils.addClass(emailInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.removeClass(emailInput, "focus:ring-black");
            DOMUtils.removeClass(emailError, CONFIG.CLASSES.HIDDEN);
            isValid = false;
        } else {
            DOMUtils.removeClass(emailInput, "border-red-600", "focus:ring-red-600");
            DOMUtils.addClass(emailInput, "focus:ring-black");
            DOMUtils.addClass(emailError, CONFIG.CLASSES.HIDDEN);
        }

        if (isValid) {
            const newUser = { firstname: firstName, lastname: lastName, email: email };
            StorageManager.saveUser(newUser);
            console.log("Account created:", newUser);
            this.checkLoginState();
            this.toggleModal();
            setTimeout(() => this.resetCreateAccountForm(), 300);
        }
    }

    /**
     * Switch back to email step
     */
    static switchBackToEmail() {
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_OTP}`), CONFIG.CLASSES.HIDDEN);
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_CREATE_ACCOUNT}`), CONFIG.CLASSES.HIDDEN);
        DOMUtils.removeClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_EMAIL}`), CONFIG.CLASSES.HIDDEN);
    }

    /**
     * Switch to create account step
     */
    static switchToCreateAccount(keepData = false) {
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_EMAIL}`), CONFIG.CLASSES.HIDDEN);
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_OTP}`), CONFIG.CLASSES.HIDDEN);
        DOMUtils.removeClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_STEP_CREATE_ACCOUNT}`), CONFIG.CLASSES.HIDDEN);
        if (!keepData) {
            this.resetCreateAccountForm();
        }
    }

    /**
     * Switch to login step
     */
    static switchToLogin() {
        this.switchBackToEmail();
        this.resetLoginPopupUI();
    }

    /**
     * Reset create account form
     */
    static resetCreateAccountForm() {
        const caFields = ["firstname", "lastname", "email"];
        caFields.forEach((field) => {
            const input = DOMUtils.get(`#create-account-${field}`);
            const error = DOMUtils.get(`#create-account-${field}-error`);
            if (input && error) {
                input.value = "";
                DOMUtils.removeClass(input, "border-red-600", "focus:ring-red-600");
                DOMUtils.addClass(input, "focus:ring-black", "border-gray-300");
                DOMUtils.addClass(error, CONFIG.CLASSES.HIDDEN);
            }
        });
    }

    /**
     * Reset login popup UI
     */
    static resetLoginPopupUI() {
        DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`).value = "";
        DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL}`).value = "";
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL_ERROR}`), CONFIG.CLASSES.HIDDEN);
        DOMUtils.addClass(DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP_ERROR}`), CONFIG.CLASSES.HIDDEN);

        const loginOtpInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_OTP}`);
        DOMUtils.removeClass(loginOtpInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.addClass(loginOtpInput, "focus:ring-black", "border-gray-300");

        const loginEmailInput = DOMUtils.get(`#${CONFIG.IDS.LOGIN_EMAIL}`);
        DOMUtils.removeClass(loginEmailInput, "border-red-600", "focus:ring-red-600");
        DOMUtils.addClass(loginEmailInput, "focus:ring-black", "border-gray-300");

        // Reset create account form
        this.resetCreateAccountForm();
    }

    /**
     * Smart dispatcher: Called by header icon
     */
    static toggleLoginPopup() {
        const user = localStorage.getItem("hoodvibe_user");
        if (user) {
            if (typeof window.profileManager !== 'undefined') {
                window.profileManager.toggle();
            }
        } else {
            this.toggleModal();
        }
    }

    /**
     * Toggle login modal visibility
     */
    static toggleModal() {
        const popup = DOMUtils.get(`#${CONFIG.IDS.LOGIN_POPUP}`);
        if (popup) {
            if (DOMUtils.hasClass(popup, CONFIG.CLASSES.INVISIBLE)) {
                // Opening
                this.resetLoginPopupUI();
                this.switchBackToEmail();
                DOMUtils.removeClass(popup, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
                DOMUtils.addClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
            } else {
                // Closing
                DOMUtils.addClass(popup, CONFIG.CLASSES.INVISIBLE, CONFIG.CLASSES.OPACITY_0);
                DOMUtils.removeClass(document.body, CONFIG.CLASSES.OVERFLOW_HIDDEN);
            }
        }
    }

    /**
     * Check and update login state
     */
    static checkLoginState() {
        const user = StorageManager.getUser();
        const loginBtn = document.querySelector('button[onclick="toggleLoginPopup()"]');
        const loginIcon = loginBtn ? loginBtn.querySelector(".material-icons") : null;

        if (user && loginIcon) {
            loginIcon.textContent = "person";

            // Populate Profile Popup if exists
            const initials = DOMUtils.get("#profile-initials");
            const name = DOMUtils.get("#profile-name");
            const email = DOMUtils.get("#profile-email");

            if (initials && name && email) {
                initials.textContent = (user.firstname[0] + user.lastname[0]).toUpperCase();
                name.textContent = `${user.firstname} ${user.lastname}`;
                email.textContent = user.email;
            }

            // Mobile Drawer: Show User View
            const mobileGuest = DOMUtils.get("#mobile-drawer-guest");
            const mobileUser = DOMUtils.get("#mobile-drawer-user");
            const mobileName = DOMUtils.get("#mobile-user-name");

            if (mobileGuest) DOMUtils.addClass(mobileGuest, CONFIG.CLASSES.HIDDEN);
            if (mobileUser) DOMUtils.removeClass(mobileUser, CONFIG.CLASSES.HIDDEN);
            if (mobileName) mobileName.textContent = `${user.firstname} ${user.lastname}`;
        } else {
            if (loginIcon) loginIcon.textContent = "person_outline";

            // Mobile Drawer: Show Guest View
            const mobileGuest = DOMUtils.get(`#${CONFIG.IDS.MOBILE_DRAWER_GUEST}`);
            const mobileUser = DOMUtils.get(`#${CONFIG.IDS.MOBILE_DRAWER_USER}`);

            if (mobileGuest) mobileGuest.classList.remove("hidden");
            if (mobileUser) mobileUser.classList.add("hidden");
        }
    }

    /**
     * Initialize login module
     */
    static init() {
        this.injectPopup();
        this.injectProfilePopup();
        this.checkLoginState();
    }

    /**
     * Inject profile popup
     */
    static injectProfilePopup() {
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
                        <a href="profile.html" class="block px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Profile</a>
                        <a href="orders.html" class="block px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Orders</a>
                    </div>
                    <div class="py-2 border-t border-gray-100 dark:border-gray-800">
                         <button onclick="window.loginManager.handleLogout()" class="w-full text-left px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Sign out</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML("beforeend", popupHTML);
        }
    }

    /**
     * Handle logout
     */
    static handleLogout() {
        StorageManager.clearUser();
        this.checkLoginState();

        const popup = document.getElementById("profile-popup");
        if (popup) {
            popup.classList.add("hidden");
            if (typeof window.profileManager !== 'undefined') {
                document.removeEventListener("click", window.profileManager.closeOutside);
            }
        }

        console.log("Logged out");
    }
}

// Make globally accessible for onclick handlers
window.loginManager = LoginManager;

// Legacy function exports for backward compatibility
export function injectLoginPopup() {
    LoginManager.injectPopup();
}

export function handleLoginSubmit(event) {
    LoginManager.handleEmailSubmit(event);
}

export function handleOtpSubmit(event) {
    LoginManager.handleOTPSubmit(event);
}

export function handleCreateAccountSubmit(event) {
    LoginManager.handleCreateAccountSubmit(event);
}

export function switchBackToEmail() {
    LoginManager.switchBackToEmail();
}

export function switchToCreateAccount(keepData) {
    LoginManager.switchToCreateAccount(keepData);
}

export function switchToLogin() {
    LoginManager.switchToLogin();
}

export function toggleLoginPopup() {
    LoginManager.toggleLoginPopup();
}

export function toggleLoginModal() {
    LoginManager.toggleModal();
}

export function checkLoginState() {
    LoginManager.checkLoginState();
}

export function injectProfilePopup() {
    LoginManager.injectProfilePopup();
}

export function toggleProfilePopup() {
    if (typeof window.profileManager !== 'undefined') {
        window.profileManager.toggle();
    }
}

export function handleLogout() {
    LoginManager.handleLogout();
}
