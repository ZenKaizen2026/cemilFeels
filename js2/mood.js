document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ELEMENT SELECTORS ---
    const nameInput = document.getElementById('userName');
    const cardAmbil = document.getElementById('cardAmbil');
    const cardDelivery = document.getElementById('cardDelivery');
    const addressContainer = document.getElementById('addressContainer');
    const addressInput = document.getElementById('userAddress');
    const deliveryText = document.getElementById('deliveryText');
    const moodCards = document.querySelectorAll('.mood-card');
    
    const modal = document.getElementById('moodModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalMoodName = document.getElementById('modalMoodName');
    const btnConfirm = document.getElementById('btnConfirmMood');
    const btnCancel = document.getElementById('btnCancelMood');

    // --- 2. STATE VARIABLES ---
    let selectedDelivery = 'pickup';
    let selectedMoodId = null;

    // --- 3. LOCAL STORAGE: READ EXISTING DATA (AUTO-FILL) ---
    const checkExistingData = () => {
        const savedName = localStorage.getItem('user_name');
        const savedDelivery = localStorage.getItem('delivery_method');
        const savedAddress = localStorage.getItem('user_address');
        const savedMood = localStorage.getItem('selected_mood');

        if (savedName) {
            nameInput.value = savedName;
        }

        if (savedDelivery) {
            selectedDelivery = savedDelivery;
            updateDeliveryUI(savedDelivery);
            if (savedDelivery === 'delivery' && savedAddress) {
                addressInput.value = savedAddress;
            }
        } else {
            updateDeliveryUI('pickup');
        }

        if (savedMood) {
            selectedMoodId = parseInt(savedMood, 10);
            moodCards.forEach(card => {
                if (parseInt(card.dataset.moodId, 10) === selectedMoodId) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        }
    };

    // --- 4. DELIVERY METHOD UI INTERACTION ---
    const updateDeliveryUI = (method) => {
        if (method === 'pickup') {
            cardAmbil.classList.add('active');
            cardDelivery.classList.remove('active');
            addressContainer.style.display = 'none';
            if (deliveryText) deliveryText.style.display = 'block';
            addressInput.removeAttribute('required');
        } else {
            cardDelivery.classList.add('active');
            cardAmbil.classList.remove('active');
            addressContainer.style.display = 'block';
            if (deliveryText) deliveryText.style.display = 'none';
            addressInput.setAttribute('required', 'true');
        }
    };

    cardAmbil.addEventListener('click', () => {
        selectedDelivery = 'pickup';
        updateDeliveryUI('pickup');
    });

    cardDelivery.addEventListener('click', () => {
        selectedDelivery = 'delivery';
        updateDeliveryUI('delivery');
    });

    // --- 5. MOOD SELECTION & MODAL CONTROL ---
    moodCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedMoodId = parseInt(card.dataset.moodId, 10);
            const moodName = card.dataset.moodName;
            const moodImg = card.dataset.moodImg;

            // Highlight the selected card
            moodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Set modal content and show it
            modalMoodName.textContent = moodName;
            modalIcon.src = moodImg;
            modal.classList.add('show');
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
    };

    btnCancel.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- 6. VALIDATION & REDIRECT ---
    btnConfirm.addEventListener('click', () => {
        const userName = nameInput.value.trim();
        const userAddress = addressInput.value.trim();

        // 1. Validate Name
        if (!userName) {
            alert('Mohon masukkan nama panggilan Anda terlebih dahulu.');
            closeModal();
            nameInput.focus();
            return;
        }

        // 2. Validate Address if Delivery is selected
        if (selectedDelivery === 'delivery' && !userAddress) {
            alert('Silakan isi detail alamat pengiriman Anda.');
            closeModal();
            addressInput.focus();
            return;
        }

        // 3. Save Data to localStorage
        localStorage.setItem('user_name', userName);
        localStorage.setItem('delivery_method', selectedDelivery);
        localStorage.setItem('user_address', selectedDelivery === 'delivery' ? userAddress : '');
        localStorage.setItem('selected_mood', selectedMoodId);

        console.log("Session saved successfully. Redirecting to menu recommendations...");

        // Redirect to menu page
        window.location.href = 'menu.html';
    });

    // Run initial data check
    checkExistingData();
});