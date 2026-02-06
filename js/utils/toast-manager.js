/**
 * ToastManager
 * A centralized system for showing floating notifications.
 * Replaces native alert() calls.
 */
class ToastManager {
    constructor() {
        this.containerId = 'toast-container';
        this.init();
    }

    /**
     * Initialize container if it doesn't exist
     */
    init() {
        if (!document.getElementById(this.containerId)) {
            const container = document.createElement('div');
            container.id = this.containerId;
            container.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] flex flex-col gap-2 min-w-[300px] max-w-[90vw] pointer-events-none';
            document.body.appendChild(container);
        }
    }

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - 'success', 'error', or 'info'
     * @param {number} duration - Duration in ms (default 3000)
     */
    show(message, type = 'info', duration = 3000) {
        // Ensure container exists
        this.init();
        const container = document.getElementById(this.containerId);

        // Styling based on type
        const styles = {
            success: {
                bg: 'bg-green-600',
                icon: 'check_circle',
                text: 'text-white'
            },
            error: {
                bg: 'bg-red-600',
                icon: 'error',
                text: 'text-white'
            },
            info: {
                bg: 'bg-gray-900 dark:bg-white',
                icon: 'info',
                text: 'text-white dark:text-black'
            }
        };

        const style = styles[type] || styles.info;

        // Create notification element
        const toast = document.createElement('div');
        toast.className = `${style.bg} ${style.text} px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 transform translate-y-full opacity-0 transition-all duration-300 pointer-events-auto backdrop-blur-sm`;

        toast.innerHTML = `
            <span class="material-icons text-xl">${style.icon}</span>
            <span class="font-medium text-sm">${message}</span>
        `;

        // Add to container
        container.appendChild(toast);

        // Animate in
        // Small delay to allow DOM render before transition
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-full', 'opacity-0');
        });

        // Auto dismiss
        setTimeout(() => {
            this.dismiss(toast);
        }, duration);
    }

    /**
     * Dismiss a specific toast
     */
    dismiss(element) {
        element.classList.add('translate-y-full', 'opacity-0');

        // Remove from DOM after transition
        setTimeout(() => {
            if (element.parentElement) {
                element.remove();
            }
        }, 300);
    }
}

// Global instance
window.Toast = new ToastManager();
