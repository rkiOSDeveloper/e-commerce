/**
 * Profile Module
 * Handles profile popup display and interactions
 */

import { StorageManager } from '../utils/storage.js';

/**
 * Profile Manager Class
 */
export class ProfileManager {
    /**
     * Toggle profile popup
     */
    static toggle() {
        const popup = document.getElementById("profile-popup");
        if (!popup) return;

        if (popup.classList.contains("hidden")) {
            popup.classList.remove("hidden");
            // Close on click outside
            setTimeout(() => {
                document.addEventListener("click", this.closeOutside);
            }, 0);
        } else {
            popup.classList.add("hidden");
            document.removeEventListener("click", this.closeOutside);
        }
    }

    /**
     * Close popup when clicking outside
     */
    static closeOutside(e) {
        const popup = document.getElementById("profile-popup");
        const loginBtn = document.querySelector('button[onclick="toggleLoginPopup()"]');

        // If click is NOT in popup AND NOT on the trigger button
        if (popup && !popup.contains(e.target) && !loginBtn?.contains(e.target)) {
            popup.classList.add("hidden");
            document.removeEventListener("click", ProfileManager.closeOutside);
        }
    }
}

// Make globally accessible
window.profileManager = ProfileManager;

// Legacy function export
export function toggleProfilePopup() {
    ProfileManager.toggle();
}

export function closeProfilePopupOutside(e) {
    ProfileManager.closeOutside(e);
}
