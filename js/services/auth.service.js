/**
 * Authentication Service
 * Handles user authentication and session management
 */

class AuthService {
    constructor() {
        this.storageKey = 'clothyfly_user';
        this.sessionKey = 'clothyfly_session';
    }

    /**
     * Send OTP to email (mock)
     * @param {string} email - User email
     * @returns {Promise<Object>} Response object
     */
    async sendOTP(email) {
        try {
            await apiService.delay();

            // Validate email format
            if (!this.validateEmail(email)) {
                return {
                    success: false,
                    message: 'Please enter a valid email address'
                };
            }

            // Mock OTP generation
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Store OTP in sessionStorage for verification (mock)
            sessionStorage.setItem('pending_otp', otp);
            sessionStorage.setItem('pending_email', email);

            console.log(`Mock OTP for ${email}: ${otp}`); // For testing

            return {
                success: true,
                message: 'OTP sent successfully',
                // In real app, don't return OTP
                otp: otp // Only for testing/demo
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to send OTP. Please try again.'
            };
        }
    }

    /**
     * Verify OTP (mock)
     * @param {string} email - User email
     * @param {string} otp - OTP code
     * @returns {Promise<Object>} Response with user data
     */
    async verifyOTP(email, otp) {
        try {
            await apiService.delay();

            const storedOTP = sessionStorage.getItem('pending_otp');
            const storedEmail = sessionStorage.getItem('pending_email');

            if (email !== storedEmail || otp !== storedOTP) {
                return {
                    success: false,
                    message: 'Invalid OTP. Please try again.'
                };
            }

            // Clear OTP data
            sessionStorage.removeItem('pending_otp');
            sessionStorage.removeItem('pending_email');

            // Get or create user
            const user = await this.getOrCreateUser(email);

            // Store user session
            this.setCurrentUser(user);

            return {
                success: true,
                message: 'Login successful',
                user: user
            };
        } catch (error) {
            return {
                success: false,
                message: 'Verification failed. Please try again.'
            };
        }
    }

    /**
     * Get or create user by email
     * @param {string} email - User email
     * @returns {Promise<Object>} User object
     */
    async getOrCreateUser(email) {
        try {
            const usersData = await apiService.get('users', false);
            let user = usersData.users.find(u => u.email === email);

            if (!user) {
                // Create new user
                user = {
                    id: `user-${Date.now()}`,
                    email: email,
                    firstname: email.split('@')[0],
                    lastname: '',
                    name: email.split('@')[0],
                    phone: '',
                    addresses: [],
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                };
            } else {
                // Update last login
                user.lastLogin = new Date().toISOString();
            }

            return user;
        } catch (error) {
            console.error('Error getting/creating user:', error);
            throw error;
        }
    }

    /**
     * Set current user in storage
     * @param {Object} user - User object
     */
    setCurrentUser(user) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(user));
            sessionStorage.setItem(this.sessionKey, 'active');
        } catch (error) {
            console.error('Error storing user:', error);
        }
    }

    /**
     * Get current user
     * @returns {Object|null} User object or null
     */
    getCurrentUser() {
        try {
            const userStr = localStorage.getItem(this.storageKey);
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    /**
     * Check if user is logged in
     * @returns {boolean} Login status
     */
    isLoggedIn() {
        // Check for user in localStorage to support persistent login
        return this.getCurrentUser() !== null;
    }

    /**
     * Logout user
     */
    logout() {
        try {
            localStorage.removeItem(this.storageKey);
            sessionStorage.removeItem(this.sessionKey);

            // Clear any pending login data
            sessionStorage.removeItem('pending_otp');
            sessionStorage.removeItem('pending_email');

            return {
                success: true,
                message: 'Logged out successfully'
            };
        } catch (error) {
            console.error('Error logging out:', error);
            return {
                success: false,
                message: 'Logout failed'
            };
        }
    }

    /**
     * Update user profile
     * @param {Object} updates - Profile updates
     * @returns {Promise<Object>} Response object
     */
    async updateProfile(updates) {
        try {
            const user = this.getCurrentUser();

            if (!user) {
                return {
                    success: false,
                    message: 'User not logged in'
                };
            }

            // Merge updates
            const updatedUser = { ...user, ...updates };

            // Save updated user
            this.setCurrentUser(updatedUser);

            return {
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            };
        } catch (error) {
            console.error('Error updating profile:', error);
            return {
                success: false,
                message: 'Failed to update profile'
            };
        }
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Validation result
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Get user's full name or email
     * @returns {string} Display name
     */
    getDisplayName() {
        const user = this.getCurrentUser();
        return user ? (user.name || user.email) : 'Guest';
    }
}

// Create singleton instance
const authService = new AuthService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = authService;
}
