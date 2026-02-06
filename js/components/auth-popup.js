/**
 * Authentication Popup Manager
 * Handles login, create account, and OTP verification flows
 */

class AuthPopupManager {
    constructor() {
        this.currentEmail = '';
        this.isCreatingAccount = false;
    }

    /**
     * Initialize the auth popup with event listeners
     */
    init() {
        // Attach form listeners
        this.attachFormListeners();
        console.log('[AuthPopup] Initialized');
    }

    /**
     * Attach event listeners to forms
     */
    attachFormListeners() {
        const emailForm = document.getElementById('login-email-form');
        const otpForm = document.getElementById('login-otp-form');
        const createAccountForm = document.getElementById('create-account-form');

        if (emailForm) {
            emailForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        }

        if (otpForm) {
            otpForm.addEventListener('submit', (e) => this.handleOTPSubmit(e));
        }

        if (createAccountForm) {
            createAccountForm.addEventListener('submit', (e) => this.handleCreateAccountSubmit(e));
        }
    }

    /**
     * Open the auth popup
     */
    open() {
        const popup = document.getElementById('auth-popup');
        if (popup) {
            popup.classList.remove('invisible', 'opacity-0');
            popup.classList.add('visible', 'opacity-100');
        }
    }

    /**
     * Close the auth popup
     */
    close() {
        const popup = document.getElementById('auth-popup');
        if (popup) {
            popup.classList.add('invisible', 'opacity-0');
            popup.classList.remove('visible', 'opacity-100');
        }

        // Reset after animation completes
        setTimeout(() => this.reset(), 300);
    }

    /**
     * Reset popup to initial state
     */
    reset() {
        this.switchToEmailStep();
        this.clearAllErrors();
        this.clearAllInputs();
        this.currentEmail = '';
        this.isCreatingAccount = false;
    }

    /**
     * Navigate to email login step
     */
    switchToEmailStep() {
        this.hideAllSteps();
        const emailStep = document.getElementById('login-step-email');
        if (emailStep) emailStep.classList.remove('hidden');
    }

    /**
     * Navigate to OTP step
     * @param {string} email - Email address
     */
    switchToOTPStep(email) {
        this.hideAllSteps();
        const otpStep = document.getElementById('login-step-otp');
        const emailDisplay = document.getElementById('otp-email-display');

        if (otpStep) otpStep.classList.remove('hidden');
        if (emailDisplay) emailDisplay.textContent = email;

        // Clear OTP input and errors
        this.clearError('login-otp');
        const otpInput = document.getElementById('login-otp');
        if (otpInput) otpInput.value = '';

        // Update back button text based on flow
        const backBtn = document.getElementById('otp-back-btn');
        if (backBtn && this.isCreatingAccount) {
            backBtn.textContent = 'Sign up with a different email';
        } else if (backBtn) {
            backBtn.textContent = 'Sign in with a different email';
        }
    }

    /**
     * Navigate to create account step
     */
    switchToCreateAccountStep() {
        this.hideAllSteps();
        const createStep = document.getElementById('login-step-create-account');
        if (createStep) createStep.classList.remove('hidden');

        // Clear inputs and errors
        ['create-account-firstname', 'create-account-lastname', 'create-account-email'].forEach(id => {
            this.clearError(id);
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
    }

    /**
     * Hide all step containers
     */
    hideAllSteps() {
        ['login-step-email', 'login-step-otp', 'login-step-create-account'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
    }

    /**
     * Handle email login form submission
     * @param {Event} event - Submit event
     */
    async handleLoginSubmit(event) {
        event.preventDefault();

        const emailInput = document.getElementById('login-email');
        const email = emailInput.value.trim();

        // Validate email
        if (!authService.validateEmail(email)) {
            this.showError('login-email', 'Enter a valid email address');
            return;
        }

        this.clearError('login-email');

        // Show loading
        this.setLoading(true, 'Sending code...');

        // Send OTP
        const response = await authService.sendOTP(email);

        this.setLoading(false);

        if (response.success) {
            this.currentEmail = email;
            this.isCreatingAccount = false;
            this.switchToOTPStep(email);

            // Log OTP for testing (in real app, this is only sent to email)
            console.log(`✅ [AuthPopup] OTP sent to ${email}: ${response.otp}`);
        } else {
            this.showError('login-email', response.message);
        }
    }

    /**
     *  Handle create account form submission
     * @param {Event} event - Submit event
     */
    async handleCreateAccountSubmit(event) {
        event.preventDefault();

        const firstNameInput = document.getElementById('create-account-firstname');
        const lastNameInput = document.getElementById('create-account-lastname');
        const emailInput = document.getElementById('create-account-email');

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();

        let isValid = true;

        // Validate first name
        if (!firstName) {
            this.showError('create-account-firstname', 'First name is required');
            isValid = false;
        } else {
            this.clearError('create-account-firstname');
        }

        // Validate last name
        if (!lastName) {
            this.showError('create-account-lastname', 'Last name is required');
            isValid = false;
        } else {
            this.clearError('create-account-lastname');
        }

        // Validate email
        if (!authService.validateEmail(email)) {
            this.showError('create-account-email', 'Enter a valid email address');
            isValid = false;
        } else {
            this.clearError('create-account-email');
        }

        if (!isValid) return;

        // Store name for later (after OTP verification)
        sessionStorage.setItem('pending_user_name', `${firstName} ${lastName}`);

        // Show loading
        this.setLoading(true, 'Creating account...');

        // Send OTP
        const response = await authService.sendOTP(email);

        this.setLoading(false);

        if (response.success) {
            this.currentEmail = email;
            this.isCreatingAccount = true;
            this.switchToOTPStep(email);

            console.log(`✅ [AuthPopup] OTP sent for account creation: ${response.otp}`);
        } else {
            this.showError('create-account-email', response.message);
        }
    }

    /**
     * Handle OTP verification form submission
     * @param {Event} event - Submit event
     */
    async handleOTPSubmit(event) {
        event.preventDefault();

        const otpInput = document.getElementById('login-otp');
        const otp = otpInput.value.trim();

        // Validate OTP format
        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            this.showError('login-otp', 'Enter the correct 6-digit code');
            return;
        }

        this.clearError('login-otp');

        // Show loading
        this.setLoading(true, 'Verifying...');

        // Verify OTP
        const response = await authService.verifyOTP(this.currentEmail, otp);

        this.setLoading(false);

        if (response.success) {
            // If creating account, update user name
            if (this.isCreatingAccount) {
                const fullName = sessionStorage.getItem('pending_user_name');
                if (fullName) {
                    await authService.updateProfile({ name: fullName });
                    sessionStorage.removeItem('pending_user_name');
                }
            }

            // Update profile icon in header 
            if (typeof window.checkLoginState === 'function') {
                window.checkLoginState();
            }

            // **CHECK FOR POST-LOGIN REDIRECT INTENT**
            const redirectIntent = sessionStorage.getItem('redirect_after_login');

            if (redirectIntent) {
                // Clear the redirect intent
                sessionStorage.removeItem('redirect_after_login');

                console.log(`✅ [AuthPopup] Login successful, redirecting to: ${redirectIntent}`);

                // Close popup first
                this.close();

                // Redirect after short delay to ensure popup animation completes
                setTimeout(() => {
                    window.location.href = redirectIntent;
                }, 300);

                return; // Exit early, skip profile popup
            }

            // Default behavior: Open profile dropdown automatically
            if (typeof window.toggleProfilePopup === 'function') {
                setTimeout(() => {
                    window.toggleProfilePopup();
                }, 300);
            }

            // Handle pending wishlist item (if user tried to add before login)
            // Handle pending wishlist item (delegated to service for consistency)
            if (typeof wishlistService !== 'undefined') {
                const result = wishlistService.processPendingWishlist();
                if (result && result.success) {
                    console.log('✅ [AuthPopup] Automatically added pending item to wishlist');
                    // Notification helps user understand why the heart turned red
                    // (Optional: Toast notification could go here)
                }
            }

            // Close popup and reset
            this.close();

            console.log('✅ [AuthPopup] User logged in:', response.user);
        } else {
            this.showError('login-otp', response.message);
        }
    }

    /**
     * Show loading overlay
     * @param {boolean} isLoading - Loading state
     * @param {string} message - Loading message
     */
    setLoading(isLoading, message = 'Processing...') {
        const loadingEl = document.getElementById('auth-loading');
        const loadingText = document.getElementById('auth-loading-text');

        if (isLoading) {
            if (loadingText) loadingText.textContent = message;
            if (loadingEl) loadingEl.classList.remove('hidden');
        } else {
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    }

    /**
     * Show error message for an input
     * @param {string} inputId - Input element ID
     * @param {string} message - Error message
     */
    showError(inputId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(`${inputId}-error`);

        if (input) {
            input.classList.add('border-red-600', 'focus:ring-red-600');
            input.classList.remove('focus:ring-black', 'dark:focus:ring-white');
        }

        if (error) {
            error.textContent = message;
            error.classList.remove('hidden');
        }
    }

    /**
     * Clear error message for an input
     * @param {string} inputId - Input element ID
     */
    clearError(inputId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(`${inputId}-error`);

        if (input) {
            input.classList.remove('border-red-600', 'focus:ring-red-600');
            input.classList.add('focus:ring-black', 'dark:focus:ring-white');
        }

        if (error) {
            error.classList.add('hidden');
        }
    }

    /**
     * Clear all errors
     */
    clearAllErrors() {
        ['login-email', 'login-otp', 'create-account-firstname', 'create-account-lastname', 'create-account-email'].forEach(id => {
            this.clearError(id);
        });
    }

    /**
     * Clear all inputs
     */
    clearAllInputs() {
        ['login-email', 'login-otp', 'create-account-firstname', 'create-account-lastname', 'create-account-email'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
    }
}
