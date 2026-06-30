document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DATA MASTER MAKANAN (Rekomendasi Berdasarkan Mood ID) ---
    const menuDatabase = {
        1: [ // Stress / Marah (Opsi Rasa Kuat & Pedas)
            { name: "Bakso Mercon Membara", price: 25000, img: "https://images.unsplash.com/photo-1581333100576-b73b036139f4?q=80&w=600&auto=format&fit=crop" },
            { name: "Ceker Setan Melotot", price: 18000, img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop" }
        ],
        2: [ // Sedih / Galau (Rasa Nyaman & Manis)
            { name: "Indomie Kuah Keju Creamy", price: 15000, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop" },
            { name: "Pisang Goreng Caramel Melt", price: 17000, img: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop" }
        ],
        3: [ // Gabut / Bosan (Camilan Ringan)
            { name: "Cireng Salju Bumbu Rujak", price: 14000, img: "https://images.unsplash.com/photo-1624371414361-e6e229c11e5a?q=80&w=600&auto=format&fit=crop" },
            { name: "Cilor Maklor Gurih Rempah", price: 12000, img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop" }
        ],
        4: [ // Happy / Lapar (Sajian Kenyang)
            { name: "Ayam Geprek Sambal Korek", price: 22000, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop" },
            { name: "Roti Bakar Double Chocolate", price: 20000, img: "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?q=80&w=600&auto=format&fit=crop" }
        ]
    };

    const moodNames = {
        1: "Stress / Marah 🌶️",
        2: "Sedih / Galau 🍧",
        3: "Gabut / Bosan 🍿",
        4: "Happy / Lapar 🍔"
    };

    // --- 2. SELECTOR ELEMEN ---
    const greetingText = document.getElementById('user-mood-greeting');
    const foodContainer = document.getElementById('food-container');
    const spicyZone = document.getElementById('zona-pedas');
    const ulcerCheckbox = document.getElementById('punya_maag');
    const spicyLevelInput = document.getElementById('level_pedas');
    const drinkCards = document.querySelectorAll('.drink-card');
    const btnBack = document.getElementById('btn-back-to-mood');
    const btnNext = document.getElementById('btn-to-cart');

    // --- 3. VARIABEL STATE INTERNAL ---
    let userName = localStorage.getItem('user_name') || 'Teman';
    let moodId = parseInt(localStorage.getItem('selected_mood'), 10);
    
    let selectedFoodName = null;
    let selectedFoodPrice = 0;
    let selectedDrinkName = "-";
    let selectedDrinkPrice = 0;

    // Proteksi Rute: Jika data nama/mood kosong, kembalikan ke halaman mood
    if (!moodId || isNaN(moodId)) {
        alert("Sesi tidak valid. Silakan tentukan nama dan perasaanmu terlebih dahulu.");
        window.location.href = 'mood.html';
        return;
    }

    // --- 4. RENDER ELEMENT DINAMIS ---
    greetingText.innerHTML = `Halo **${userName}**, menu terbaik untuk suasana hatimu yang sedang **${moodNames[moodId]}** :`;

    const renderFoodMenu = () => {
        const recommendations = menuDatabase[moodId] || [];
        foodContainer.innerHTML = ''; // Kosongkan container

        recommendations.forEach(food => {
            const card = document.createElement('div');
            card.className = 'big-food-card';
            card.dataset.foodName = food.name;
            card.dataset.foodPrice = food.price;

            card.innerHTML = `
                <img src="${food.img}" alt="${food.name}" class="big-food-img">
                <div class="big-food-details">
                    <span class="food-name-large">${food.name}</span>
                    <span class="food-price-large">Rp ${food.price.toLocaleString('id-ID')}</span>
                </div>
            `;

            // Pasang event listener click
            card.addEventListener('click', () => {
                document.querySelectorAll('.big-food-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedFoodName = food.name;
                selectedFoodPrice = food.price;
            });

            foodContainer.appendChild(card);
        });

        // Tampilkan Zona Bahaya Pedas jika moodID adalah 1 (Stress/Marah)
        if (moodId === 1) {
            spicyZone.classList.remove('hidden');
        }
    };

    // --- 5. BACA ULANG DATA LAMA (AUTO-FILL DATA TERPILIH) ---
    const restoreSelections = () => {
        // Pulihkan Makanan
        const oldFoodName = localStorage.getItem('selected_food_name');
        if (oldFoodName) {
            const matchingCard = document.querySelector(`.big-food-card[data-food-name="${oldFoodName}"]`);
            if (matchingCard) {
                matchingCard.click();
            }
        }

        // Pulihkan Opsi Pedas
        if (moodId === 1) {
            const oldUlcer = localStorage.getItem('has_ulcer') === 'true';
            const oldSpicyLevel = localStorage.getItem('spicy_level');
            
            ulcerCheckbox.checked = oldUlcer;
            if (oldSpicyLevel) {
                spicyLevelInput.value = oldSpicyLevel;
            }
        }

        // Pulihkan Minuman
        const oldDrinkName = localStorage.getItem('selected_drink_name');
        if (oldDrinkName && oldDrinkName !== "-") {
            const matchingDrink = document.querySelector(`.drink-card[data-drink-name="${oldDrinkName}"]`);
            if (matchingDrink) {
                matchingDrink.click();
            }
        }
    };

    // --- 6. EVENT HANDLER PILIH MINUMAN ---
    drinkCards.forEach(card => {
        card.addEventListener('click', () => {
            // Jika kartu yang sama diklik kembali, batalkan pilihan (deselect)
            if (card.classList.contains('active')) {
                card.classList.remove('active');
                selectedDrinkName = "-";
                selectedDrinkPrice = 0;
            } else {
                // Hapus aktif di kartu minuman lain
                drinkCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                selectedDrinkName = card.dataset.drinkName;
                selectedDrinkPrice = parseInt(card.dataset.drinkPrice, 10);
            }
        });
    });

    // --- 7. TOMBOL NAVIGASI & VALIDASI AKHIR ---
    btnBack.addEventListener('click', () => {
        window.location.href = 'mood.html';
    });

    btnNext.addEventListener('click', () => {
        if (!selectedFoodName) {
            alert("Silakan pilih salah satu menu makanan rekomendasi terlebih dahulu.");
            return;
        }

        // Simpan data pilihan makanan & minuman ke localStorage
        localStorage.setItem('selected_food_name', selectedFoodName);
        localStorage.setItem('selected_food_price', selectedFoodPrice);
        
        localStorage.setItem('selected_drink_name', selectedDrinkName);
        localStorage.setItem('selected_drink_price', selectedDrinkPrice);

        // Simpan data kustomisasi pedas jika mood Stress/Marah
        if (moodId === 1) {
            const spicyLevelVal = parseInt(spicyLevelInput.value, 10);
            if (isNaN(spicyLevelVal) || spicyLevelVal < 1 || spicyLevelVal > 5) {
                alert("Silakan masukkan tingkatan level pedas yang valid (1-5).");
                spicyLevelInput.focus();
                return;
            }
            localStorage.setItem('has_ulcer', ulcerCheckbox.checked);
            localStorage.setItem('spicy_level', spicyLevelVal);
        } else {
            // Reset parameter pedas untuk mood non-spicy
            localStorage.removeItem('has_ulcer');
            localStorage.removeItem('spicy_level');
        }

        console.log("Data menu telah dikonfigurasi & disimpan.");
        window.location.href = 'cart.html';
    });

    // Inisialisasi awal halaman
    renderFoodMenu();
    restoreSelections();
});