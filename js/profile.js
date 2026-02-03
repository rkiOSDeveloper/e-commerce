document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadAddresses();
    populateStates();
});

function populateStates() {
    const stateSelect = document.getElementById("add-address-state");
    if (!stateSelect) return;

    const states = [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    stateSelect.innerHTML = `<option value="">Select State</option>` + states.map(state =>
        `<option value="${state}">${state}</option>`
    ).join("");

    // Set default to Gujarat
    stateSelect.value = "Gujarat";
}

function loadProfile() {
    const userStr = localStorage.getItem("hoodvibe_user");
    if (userStr) {
        const user = JSON.parse(userStr);
        const nameEl = document.getElementById("profile-display-name");
        const emailEl = document.getElementById("profile-display-email");

        if (nameEl) nameEl.textContent = `${user.firstname} ${user.lastname}`;
        if (emailEl) emailEl.textContent = user.email;
    }
}

function openEditProfilePopup() {
    const popup = document.getElementById("edit-profile-popup");
    const userStr = localStorage.getItem("hoodvibe_user");

    if (userStr) {
        const user = JSON.parse(userStr);
        document.getElementById("edit-firstname").value = user.firstname || "";
        document.getElementById("edit-lastname").value = user.lastname || "";
        document.getElementById("edit-email").value = user.email || "";
    }

    if (popup) {
        popup.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
    }
}

function closeEditProfilePopup() {
    const popup = document.getElementById("edit-profile-popup");
    if (popup) {
        popup.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
    }
}

function saveProfile() {
    const firstname = document.getElementById("edit-firstname").value;
    const lastname = document.getElementById("edit-lastname").value;
    const email = document.getElementById("edit-email").value;

    if (!firstname || !lastname || !email) {
        alert("Please fill in all fields");
        return;
    }

    const userStr = localStorage.getItem("hoodvibe_user");
    let user = userStr ? JSON.parse(userStr) : {};

    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;

    localStorage.setItem("hoodvibe_user", JSON.stringify(user));

    loadProfile();
    closeEditProfilePopup();

    if (typeof checkLoginState === "function") {
        checkLoginState();
    }
}

// --- Address Logic ---

function loadAddresses() {
    const container = document.getElementById("address-list-container");
    if (!container) return;

    const addressesStr = localStorage.getItem("hoodvibe_addresses");
    let addresses = addressesStr ? JSON.parse(addressesStr) : [];

    // Start empty if no addresses
    if (addresses.length === 0) {
        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 text-center">
                <span class="material-icons text-4xl mb-3 text-gray-400">location_off</span>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">No addresses found</h3>
                <p class="text-sm">Add a new address to manage your deliveries.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = addresses.map(addr => `
        <div class="border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative hover:border-black dark:hover:border-gray-500 transition-colors group">
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-gray-900 dark:text-white">${addr.firstname} ${addr.lastname}</h3>
                ${addr.isDefault ? '<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded text-gray-600 dark:text-gray-300">Default</span>' : ''}
              </div>
              <button onclick="openEditAddressPopup(${addr.id})" class="text-gray-400 hover:text-blue-600 transition-colors p-1"><span class="material-icons text-lg">edit</span></button>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              ${addr.line1}<br>
              ${addr.line2 ? addr.line2 + '<br>' : ''}
              ${addr.city}, ${addr.state} - ${addr.pincode}<br>
              ${addr.country}
            </div>
            <div class="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
               <span class="material-icons text-xs text-gray-400">phone</span>
               ${addr.phone}
            </div>
        </div>
    `).join('');
}

function openAddAddressPopup() {
    const popup = document.getElementById("add-address-popup");
    if (popup) {
        // Reset form
        document.getElementById("add-address-id").value = "";
        document.getElementById("add-address-popup-title").textContent = "Add address";
        document.getElementById("add-address-firstname").value = "";
        document.getElementById("add-address-lastname").value = "";
        document.getElementById("add-address-line1").value = "";
        document.getElementById("add-address-line2").value = "";
        document.getElementById("add-address-city").value = "";
        document.getElementById("add-address-state").value = "Gujarat";
        document.getElementById("add-address-pincode").value = "";
        document.getElementById("add-address-phone").value = "";
        document.getElementById("add-address-default").checked = false;

        // Hide delete button
        const deleteBtn = document.getElementById("delete-address-btn");
        if (deleteBtn) deleteBtn.classList.add("hidden");

        popup.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
    }
}

function openEditAddressPopup(id) {
    const popup = document.getElementById("add-address-popup");
    const addressesStr = localStorage.getItem("hoodvibe_addresses");
    const addresses = addressesStr ? JSON.parse(addressesStr) : [];
    const address = addresses.find(a => a.id === id);

    if (popup && address) {
        document.getElementById("add-address-id").value = address.id;
        document.getElementById("add-address-popup-title").textContent = "Edit address";

        document.getElementById("add-address-firstname").value = address.firstname;
        document.getElementById("add-address-lastname").value = address.lastname;
        document.getElementById("add-address-line1").value = address.line1;
        document.getElementById("add-address-line2").value = address.line2 || "";
        document.getElementById("add-address-city").value = address.city;
        document.getElementById("add-address-state").value = address.state;
        document.getElementById("add-address-pincode").value = address.pincode;

        // Remove +91 prefix for display if present
        const phone = address.phone.startsWith("+91") ? address.phone.substring(3) : address.phone;
        document.getElementById("add-address-phone").value = phone;

        document.getElementById("add-address-default").checked = address.isDefault;

        // Show delete button
        const deleteBtn = document.getElementById("delete-address-btn");
        if (deleteBtn) deleteBtn.classList.remove("hidden");

        popup.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
    }
}

function closeAddAddressPopup() {
    const popup = document.getElementById("add-address-popup");
    if (popup) {
        popup.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
    }
}

function saveNewAddress() {
    const id = document.getElementById("add-address-id").value;
    const firstname = document.getElementById("add-address-firstname").value;
    const lastname = document.getElementById("add-address-lastname").value;
    const line1 = document.getElementById("add-address-line1").value;
    const line2 = document.getElementById("add-address-line2").value;
    const city = document.getElementById("add-address-city").value;
    const state = document.getElementById("add-address-state").value;
    const pincode = document.getElementById("add-address-pincode").value;
    const phone = document.getElementById("add-address-phone").value;
    const isDefault = document.getElementById("add-address-default").checked;

    if (!firstname || !lastname || !line1 || !city || !state || !pincode || !phone) {
        openWarningPopup("Please fill in all required fields");
        return;
    }

    const addressesStr = localStorage.getItem("hoodvibe_addresses");
    let addresses = addressesStr ? JSON.parse(addressesStr) : [];

    // If set as default, remove default from others
    if (isDefault) {
        addresses.forEach(a => a.isDefault = false);
    }

    if (id) {
        // Edit existing
        const index = addresses.findIndex(a => a.id == id);
        if (index !== -1) {
            addresses[index] = {
                ...addresses[index],
                firstname,
                lastname,
                line1,
                line2,
                city,
                state,
                country: "India",
                pincode,
                phone: "+91" + phone,
                isDefault
            };
        }
    } else {
        // Add new
        const newAddress = {
            id: Date.now(),
            firstname,
            lastname,
            line1,
            line2,
            city,
            state,
            pincode,
            country: "India",
            phone: "+91" + phone, // Simple formatting
            isDefault: isDefault || addresses.length === 0 // Force default if it's the first one
        };
        addresses.push(newAddress);
    }

    localStorage.setItem("hoodvibe_addresses", JSON.stringify(addresses));

    loadAddresses();
    closeAddAddressPopup();
}

function deleteAddress() {
    const id = document.getElementById("add-address-id").value;
    if (!id) return;

    // Check if it's the only address
    const addressesStr = localStorage.getItem("hoodvibe_addresses");
    if (addressesStr) {
        const addresses = JSON.parse(addressesStr);
        if (addresses.length === 1) {
            openWarningPopup("Customer default address cannot be deleted before setting another default.");
            return;
        }
    }

    // Open confirmation popup
    const popup = document.getElementById("delete-confirmation-popup");
    if (popup) {
        popup.classList.remove("hidden");
    }
}

function closeDeleteConfirmationPopup() {
    const popup = document.getElementById("delete-confirmation-popup");
    if (popup) {
        popup.classList.add("hidden");
    }
}

function confirmDeleteAddress() {
    const id = document.getElementById("add-address-id").value;
    if (!id) return;

    const addressesStr = localStorage.getItem("hoodvibe_addresses");
    if (addressesStr) {
        let addresses = JSON.parse(addressesStr);

        // Check if deleting default
        const target = addresses.find(a => a.id == id);
        const wasDefault = target ? target.isDefault : false;

        addresses = addresses.filter(a => a.id != id);

        // If deleting default and others remain, make first one default
        if (wasDefault && addresses.length > 0) {
            addresses[0].isDefault = true;
        }

        localStorage.setItem("hoodvibe_addresses", JSON.stringify(addresses));

        loadAddresses();
        closeDeleteConfirmationPopup();
        closeAddAddressPopup();
    }
}

function openWarningPopup(message) {
    const popup = document.getElementById("warning-popup");
    const messageEl = document.getElementById("warning-popup-message");
    if (popup && messageEl) {
        messageEl.textContent = message;
        popup.classList.remove("hidden");
    }
}

function closeWarningPopup() {
    const popup = document.getElementById("warning-popup");
    if (popup) {
        popup.classList.add("hidden");
    }
}
