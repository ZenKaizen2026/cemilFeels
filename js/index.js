// --- KONFIGURASI & DATA ---
        const NOMOR_WA_PENJUAL = "6287846644813"; 
        const SELLER_LAT =  -7.756372; const SELLER_LON = 110.406832;

        // GUNAKAN FOTO ASLI PRODUKMU DI SINI AGAR MAKIN MENGGIURKAN!
        // Pastikan fotonya rasio Landscape atau Persegi dan kualitas bagus.
        const menuData = {
            1: [ // PEDAS
                { nama: "Basreng Stik Pedas", harga: 8000, img: "../img/basreng stik.jpeg" },
                { nama: "Makaroni Bantet Setan", harga: 5000, img: "../img/makaroni bantet.jpeg" }
            ],
            2: [ // MANIS
                { nama: "Piscok Lumer (3pcs)", harga: 5000, img: "../img/piscok lumer coklat.jpeg" },
                { nama: "Bola Cokelat Lumer (4pcs)", harga: 5000, img: "../img/bola bola coklat.jpeg" }
            ],
            3: [ // KRIUK
                { nama: "KULPI Balado", harga: 5000, img: "../img/kulpi balado.jpeg" }, // Placeholder snack
                { nama: "Keripik Pangsit Renyah", harga: 6000, img: "../img/krupuk pangsit.jpeg" } // Placeholder snack
            ],
            4: [ // KENYANG
                { nama: "Cireng Rujak Isi 5", harga: 5000, img: "../img/cireng sambal rujak.jpeg" },
                { nama: "Tahu Walik Krispi (4pcs)", harga: 6000, img: "../img/tahu walik.jpeg" }
            ]
        };

        const quotesData = {
            1: "🔥 Pedasnya nendang, emosi auto hilang!",
            2: "🍫 Yang manis-manis untuk harimu yang kelabu.",
            3: "🍿 Teman kriuk paling pas buat usir gabut.",
            4: "🥰 Perut kenyang, hati auto senang!"
        };

        // --- STATE VARIABLES ---
        let metodePengiriman = 'pickup';
        let hargaOngkir = 0;
        let userDistanceKM = 0;
        let selectedFoodName = "";
        let selectedFoodPrice = 0;

        // --- FUNGSI DELIVERY/PICKUP ---
        function pilihMetode(metode) {
    metodePengiriman = metode;
    
    // Toggle class active untuk visual tombol
    document.getElementById("opt-pickup").classList.toggle('active', metode === 'pickup');
    document.getElementById("opt-delivery").classList.toggle('active', metode === 'delivery');
    
    // Sembunyikan/Tampilkan input alamat
    document.getElementById("alamat").classList.toggle('hidden', metode === 'pickup');
    
    const infoLokasi = document.getElementById("info-lokasi");

    if (metode === 'pickup') {
        // --- BAGIAN INI YANG BARU (ADA LINK MAPS) ---
        hargaOngkir = 0;
        infoLokasi.innerHTML = `
            <div style="text-align:center;">
                <i class="fas fa-store" style="color:#EE6F57;"></i> Lokasi: <b>Flamboyan(kos),Concat</b>
                <br>
                <a href="https://www.google.com/maps/search/?api=1&query=${SELLER_LAT},${SELLER_LON}" target="_blank" style="display:inline-block; margin-top:8px; color:#32E0C4; text-decoration:none; font-weight:600; border:1px dashed #32E0C4; padding:5px 15px; border-radius:10px; font-size:0.85rem;">
                   <i class="fas fa-map-marked-alt"></i> Klik untuk Buka Maps
                </a>
            </div>
        `;
    } else {
        // Jika Delivery
        infoLokasi.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mencari lokasimu...`;
        ambilLokasiUser();
    }
}


        function ambilLokasiUser() {
            if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(showPosition, showError); } 
            else { document.getElementById("info-lokasi").innerText = "GPS tidak didukung browser ini."; }
        }
        function showPosition(position) {
            // Rumus Haversine sederhana untuk estimasi cepat
            let lat = position.coords.latitude; let lon = position.coords.longitude;
            let R = 6371; let dLat = (SELLER_LAT - lat) * (Math.PI/180); let dLon = (SELLER_LON - lon) * (Math.PI/180);
            let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat * (Math.PI/180)) * Math.cos(SELLER_LAT * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            userDistanceKM = (R * c * 1.4).toFixed(1); // Buffer 1.4x
            
            if (userDistanceKM <= 4) hargaOngkir = 5000; else if (userDistanceKM <= 9) hargaOngkir = 10000; else hargaOngkir = 15000;
            document.getElementById("info-lokasi").innerHTML = `Jarak: <b>${userDistanceKM} km</b> | Ongkir: <b>Rp ${hargaOngkir.toLocaleString()}</b>`;
        }
        function showError() { document.getElementById("info-lokasi").innerHTML = "❌ Gagal deteksi lokasi. Pastikan GPS aktif."; }

        // --- FUNGSI MOOD & MODAL MENU ---
        function pilihMood(idMood, element) {
            document.querySelectorAll('.mood-card').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
            document.getElementById("selected_mood").value = idMood;
            
            // Tampilkan Trigger Area dan Zona Pedas jika perlu
            document.getElementById("menu-trigger-area").classList.remove("hidden");
            document.getElementById("zona-pedas").classList.toggle("hidden", idMood !== 1);
            
            // Reset pilihan makanan sebelumnya saat ganti mood
            resetPilihanMakanan();
        }

        function bukaModalMenu() {
            const moodId = document.getElementById("selected_mood").value;
            if(moodId == 0) return;
            
            // Render kartu makanan BESAR ke dalam modal
            const container = document.getElementById("modal-food-container");
            container.innerHTML = "";
            menuData[moodId].forEach(item => {
                let card = document.createElement('div');
                card.className = 'big-food-card';
                card.onclick = function() { pilihMakananDariModal(this, item.nama, item.harga) };
                card.innerHTML = `
                    <img src="${item.img}" class="big-food-img" alt="${item.nama}">
                    <div class="big-food-details">
                        <span class="food-name-large">${item.nama}</span>
                        <span class="food-price-large">Rp ${item.harga.toLocaleString()}</span>
                    </div>
                `;
                container.appendChild(card);
            });
            
            // Tampilkan Modal dengan animasi
            document.getElementById("menuModal").classList.add("show");
        }

        function tutupModalMenu() {
            document.getElementById("menuModal").classList.remove("show");
        }

        function pilihMakananDariModal(element, nama, harga) {
            // Highlight visual di modal
            document.querySelectorAll('.big-food-card').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
            
            // Simpan data
            selectedFoodName = nama;
            selectedFoodPrice = harga;

            // Update preview di halaman utama dan tutup modal setelah jeda singkat
            setTimeout(() => {
                document.getElementById("food-preview").classList.remove("hidden");
                document.getElementById("preview-food-name").innerText = nama;
                document.getElementById("preview-food-price").innerText = "Rp " + harga.toLocaleString();
                tutupModalMenu();
            }, 300);
        }

        function resetPilihanMakanan() {
            selectedFoodName = ""; selectedFoodPrice = 0;
            document.getElementById("food-preview").classList.add("hidden");
        }

        // --- FUNGSI MINUMAN MODERN ---
        function pilihMinum(element, nama, harga) {
            // Cek apakah kartu ini sudah aktif
            let isActive = element.classList.contains('active');

            // Reset semua kartu minuman dulu
            document.querySelectorAll('.drink-card').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.d-icon').className = 'fas fa-plus-circle d-icon';
            });

            if (!isActive) {
                // Jika belum aktif, aktifkan kartu yang diklik
                element.classList.add('active');
                element.querySelector('.d-icon').className = 'fas fa-check-circle d-icon';
                document.getElementById("selected_drink_name").value = nama;
                document.getElementById("selected_drink_price").value = harga;
            } else {
                // Jika sudah aktif, klik lagi berarti membatalkan pilihan
                document.getElementById("selected_drink_name").value = "-";
                document.getElementById("selected_drink_price").value = 0;
            }
        }

        // --- KIRIM WHATSAPP ---
        function kirimKeWA() {
            let nama = document.getElementById("nama").value;
            let mood = parseInt(document.getElementById("selected_mood").value);
            
            if (!nama) { alert("Isi nama dulu ya kak!"); return; }
            if (mood === 0) { alert("Pilih Mood kamu dulu!"); return; }
            if (!selectedFoodName) { alert("Belum pilih makanannya nih, klik tombol LIHAT MENU ya!"); return; }

            let infoPedas = "";
            if (mood === 1) {
                if (document.getElementById("punya_maag").checked) { alert("Kak, karena ada riwayat Maag, sebaiknya jangan pesan yang pedas ya. Ganti mood lain yuk demi kesehatan lambung! 🙏"); return; }
                infoPedas = " (Level " + document.getElementById("level_pedas").value + ")";
            }

            let minumName = document.getElementById("selected_drink_name").value;
            let minumPrice = parseInt(document.getElementById("selected_drink_price").value);
            let total = selectedFoodPrice + minumPrice + hargaOngkir;
            let alamatText = metodePengiriman === 'delivery' ? (document.getElementById("alamat").value || "Belum diisi") : "-";

            let pesan = `Halo kak Rifky! Mau pesan *MOODMUNCH*nya nih\n\n` +
                        `👤 *${nama}*\n` +
                        `----------------------\n` +
                        `🎭 Mood: ${mood==1?'Marah 😡':mood==2?'Sedih 😢':mood==3?'Bosan 😐':'Lapar 😋'}\n` +
                        `🍽️ *${selectedFoodName}* ${infoPedas}\n` +
                        `🥤 Minum: ${minumName}\n` +
                        `----------------------\n` +
                        `🚚 ${metodePengiriman=='pickup'?'Ambil Sendiri':'Delivery ('+userDistanceKM+'km)'}\n` +
                        `🏠 ${alamatText}\n` +
                        `💰 *Total: Rp ${total.toLocaleString()}*\n\n` +
                        `_Catatan: "${quotesData[mood]}"_`;

            window.open(`https://wa.me/${NOMOR_WA_PENJUAL}?text=${encodeURIComponent(pesan)}`, '_blank');
        }
        
        pilihMetode('pickup');