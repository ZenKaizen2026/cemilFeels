document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KONFIGURASI PENERIMA PESANAN ---
    const SELLER_WHATSAPP = "6281234567890"; // Ganti dengan nomor WhatsApp Toko Anda (Gunakan kode negara, misal: 62)

    // --- 2. SELECTOR ELEMEN ---
    const summaryName = document.getElementById('summary-name');
    const summaryDelivery = document.getElementById('summary-delivery');
    const summaryAddressRow = document.getElementById('summary-address-row');
    const summaryAddress = document.getElementById('summary-address');
    const summaryMood = document.getElementById('summary-mood');

    const cartItemsBody = document.getElementById('cart-items-body');
    const calcSubtotal = document.getElementById('calc-subtotal');
    const calcOngkir = document.getElementById('calc-ongkir');
    const calcTotal = document.getElementById('calc-total');

    const btnCheckout = document.getElementById('btn-checkout');
    const btnEditOrder = document.getElementById('btn-edit-order');

    // --- 3. RETRIEVE DATA DARI LOCALSTORAGE ---
    const userName = localStorage.getItem('user_name');
    const deliveryMethod = localStorage.getItem('delivery_method');
    const userAddress = localStorage.getItem('user_address');
    const moodId = parseInt(localStorage.getItem('selected_mood'), 10);
    
    const foodName = localStorage.getItem('selected_food_name');
    const foodPrice = parseInt(localStorage.getItem('selected_food_price'), 10);
    const hasUlcer = localStorage.getItem('has_ulcer') === 'true';
    const spicyLevel = localStorage.getItem('spicy_level');

    const drinkName = localStorage.getItem('selected_drink_name') || "-";
    const drinkPrice = parseInt(localStorage.getItem('selected_drink_price'), 10) || 0;

    const moodNames = {
        1: "Stress / Marah 🌶️",
        2: "Sedih / Galau 🍧",
        3: "Gabut / Bosan 🍿",
        4: "Happy / Lapar 🍔"
    };

    // Proteksi Rute: Jika data vital hilang, paksa kembali ke beranda awal
    if (!userName || !foodName) {
        alert("Sesi transaksi tidak lengkap. Silakan lakukan pemesanan ulang.");
        window.location.href = 'index.html';
        return;
    }

    // --- 4. RENDER INFORMASI PELANGGAN ---
    summaryName.textContent = userName;
    summaryDelivery.textContent = deliveryMethod === 'delivery' ? 'Delivery (Diantar)' : 'Ambil Sendiri (Pickup)';
    summaryMood.textContent = moodNames[moodId] || 'Netral';

    if (deliveryMethod === 'delivery' && userAddress) {
        summaryAddressRow.classList.remove('hidden');
        summaryAddress.textContent = userAddress;
    }

    // --- 5. KALKULASI & RENDERING TABEL BELANJA ---
    const renderCartCalculator = () => {
        let subtotal = 0;
        let ongkir = 0;

        cartItemsBody.innerHTML = ''; // Kosongkan tabel

        // Baris Item 1: Makanan Utama
        const foodRow = document.createElement('tr');
        let foodCustomizationText = "";
        
        // Sisipkan informasi kustomisasi pedas jika mood Stress/Marah terpilih
        if (moodId === 1 && spicyLevel) {
            const maagStatus = hasUlcer ? "Ada Riwayat Maag" : "Aman dari Maag";
            foodCustomizationText = `<span class="item-customization"><i class="fas fa-pepper-hot"></i> Level Pedas: ${spicyLevel} (${maagStatus})</span>`;
        }

        foodRow.innerHTML = `
            <td class="text-start">
                <span class="item-title">${foodName}</span>
                ${foodCustomizationText}
            </td>
            <td class="text-end align-middle">
                <span class="item-price">Rp ${foodPrice.toLocaleString('id-ID')}</span>
            </td>
        `;
        cartItemsBody.appendChild(foodRow);
        subtotal += foodPrice;

        // Baris Item 2: Minuman Tambahan (Jika ada)
        if (drinkName !== "-") {
            const drinkRow = document.createElement('tr');
            drinkRow.innerHTML = `
                <td class="text-start">
                    <span class="item-title">${drinkName}</span>
                </td>
                <td class="text-end align-middle">
                    <span class="item-price">Rp ${drinkPrice.toLocaleString('id-ID')}</span>
                </td>
            `;
            cartItemsBody.appendChild(drinkRow);
            subtotal += drinkPrice;
        }

        // Tentukan aturan ongkos kirim (Misal: Delivery = Rp 8.000, Pickup = Rp 0)
        if (deliveryMethod === 'delivery') {
            ongkir = 8000;
        }

        const grandTotal = subtotal + ongkir;

        // Update nilai teks di antarmuka
        calcSubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        calcOngkir.textContent = `Rp ${ongkir.toLocaleString('id-ID')}`;
        calcTotal.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;

        return { subtotal, ongkir, grandTotal };
    };

    const calculatedValues = renderCartCalculator();

    // --- 6. EVENT REDIRECT TOMBOL KEMBALI ---
    btnEditOrder.addEventListener('click', () => {
        window.location.href = 'menu.html';
    });

    // --- 7. LOGIKA INTEGRASI WHATSAPP CHAT ---
    btnCheckout.addEventListener('click', () => {
        // Pembuatan baris pesan WhatsApp menggunakan Line Breaks (\n)
        let message = `Halo CemilFeels! Saya ingin mengirim pesanan berikut:\n\n`;
        message += `*👤 DETAIL PELANGGAN*\n`;
        message += `• Nama: ${userName}\n`;
        message += `• Metode: ${deliveryMethod === 'delivery' ? 'Delivery (Diantar)' : 'Ambil Sendiri'}\n`;
        
        if (deliveryMethod === 'delivery') {
            message += `• Alamat: ${userAddress}\n`;
        }
        
        message += `• Suasana Hati: ${moodNames[moodId]}\n\n`;

        message += `*🛒 DETAIL ITEM PESANAN*\n`;
        message += `• Makanan: ${foodName} (Rp ${foodPrice.toLocaleString('id-ID')})\n`;
        
        if (moodId === 1 && spicyLevel) {
            message += `  - Level Pedas: ${spicyLevel}\n`;
            message += `  - Riwayat Maag: ${hasUlcer ? 'Ada' : 'Tidak Ada'}\n`;
        }

        if (drinkName !== "-") {
            message += `• Minuman: ${drinkName} (Rp ${drinkPrice.toLocaleString('id-ID')})\n`;
        }
        
        message += `\n*🧾 RINCIAN PEMBAYARAN*\n`;
        message += `• Subtotal: Rp ${calculatedValues.subtotal.toLocaleString('id-ID')}\n`;
        message += `• Ongkos Kirim: Rp ${calculatedValues.ongkir.toLocaleString('id-ID')}\n`;
        message += `--------------------------------------\n`;
        message += `*🔥 TOTAL BAYAR:* *Rp ${calculatedValues.grandTotal.toLocaleString('id-ID')}*\n`;

        // Format teks pesan agar aman dikirimkan melalui URL (URL Encoding)
        const encodedText = encodeURIComponent(message);
        const waLink = `https://wa.me/${SELLER_WHATSAPP}?text=${encodedText}`;

        // Buka tab baru mengarah ke aplikasi WhatsApp
        window.open(waLink, '_blank');
    });
});