/**
 * Orders Page Logic
 * Handles Cancel Order Popup and Interactions
 */

function openCancelPopup(orderId) {
    const popup = document.getElementById("cancel-popup");
    const content = document.getElementById("cancel-popup-content");

    if (popup && content) {
        popup.classList.remove("hidden");
        // Small delay to allow display:block to apply before animating opacity/transform
        setTimeout(() => {
            content.classList.remove("translate-y-full");
        }, 10);
        document.body.classList.add("overflow-hidden");
    }
}

function closeCancelPopup() {
    const popup = document.getElementById("cancel-popup");
    const content = document.getElementById("cancel-popup-content");

    if (popup && content) {
        content.classList.add("translate-y-full");
        setTimeout(() => {
            popup.classList.add("hidden");
            document.body.classList.remove("overflow-hidden");
        }, 300); // Match transition duration
    }
}

function confirmCancel() {
    // Logic to cancel order
    console.log("Order processing cancellation...");
    closeCancelPopup();
    // Optional: Show success toast
}

// Close on Escape key
// Close on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeCancelPopup();
        closeReturnPopup();
    }
});

// --- Return Order Popup Logic ---

function openReturnPopup(orderId) {
    const popup = document.getElementById("return-popup");
    const content = document.getElementById("return-popup-content");

    if (popup && content) {
        popup.classList.remove("hidden");
        setTimeout(() => {
            content.classList.remove("translate-y-full");
        }, 10);
        document.body.classList.add("overflow-hidden");
    }
}

function closeReturnPopup() {
    const popup = document.getElementById("return-popup");
    const content = document.getElementById("return-popup-content");

    if (popup && content) {
        content.classList.add("translate-y-full");
        setTimeout(() => {
            popup.classList.add("hidden");
            document.body.classList.remove("overflow-hidden");
        }, 300);
    }
}

function confirmReturn() {
    console.log("Order return processing...");
    closeReturnPopup();
}
