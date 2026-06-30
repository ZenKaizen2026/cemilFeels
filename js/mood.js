document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const nameInput = document.getElementById('nama');
    const deliveryOptions = document.querySelectorAll('.delivery-option');
    const addressInput = document.getElementById('alamat');
    const infoLocation = document.getElementById('info-lokasi');
    const moodCards = document.querySelectorAll('.mood-card');
    const submitBtn = document.getElementById('btn-submit-mood');

    // --- STATE VARIABLES ---
    let selectedDelivery = 'pickup';
    let selectedMoodId = null;

    // --- LOCAL STORAGE: BACA DATA SEBELUMNYA (AUTO-FILL) ---
    // Mengizinkan pengguna kembali dari halaman menu tanpa mengisi ulang data dari nol
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
            // Default awal apabila belum ada data delivery terpilih
            updateDeliveryUI('pickup');
        }

        if (savedMood) {
            selectedMoodId = parseInt(savedMood, 10);
            moodCards.forEach(card => {
                if (parseInt(card.dataset.moodId, 10) === selectedMoodId) {
                    card.classList.add('active');
                }
            });
        }
    };

    // --- INTERAKSI METODE PENGIRIMAN ---
    const updateDeliveryUI = (method) => {
        deliveryOptions.forEach(opt => opt.classList.remove('active'));
        
        if (method === 'pickup') {
            document.getElementById('opt-pickup').classList.add('active');
            addressInput.classList.add('hidden');
            addressInput.removeAttribute('required');
            infoLocation.innerHTML = `<i class="fas fa-store-alt me-1"></i> Ambil langsung di **Outlet CemilFeels Pusat** (Gratis ongkir & cepat).`;
        } else {
            document.getElementById('opt-delivery').classList.add('active');
            addressInput.classList.remove('hidden');
            addressInput.setAttribute('required', 'true');
            infoLocation.innerHTML = `<i class="fas fa-truck me-1"></i> Estimasi pengiriman 15-30 menit tergantung jarak lokasimu.`;
        }
    };

    deliveryOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedDelivery = option.dataset.method;
            updateDeliveryUI(selectedDelivery);
        });
    });

    // --- INTERAKSI PEMILIHAN MOOD ---
    moodCards.forEach(card => {
        card.addEventListener('click', () => {
            // Bersihkan seleksi aktif mood lainnya
            moodCards.forEach(c => c.classList.remove('active'));
            
            // Tambahkan status aktif pada elemen yang dipilih
            card.classList.add('active');
            selectedMoodId = parseInt(card.dataset.moodId, 10);
        });
    });

    // --- VALIDASI DAN SUBMIT KE LOCALSTORAGE ---
    submitBtn.addEventListener('click', () => {
        const userName = nameInput.value.trim();
        const userAddress = addressInput.value.trim();

        // 1. Validasi Nama
        if (!userName) {
            alert('Mohon masukkan nama panggilan Anda terlebih dahulu.');
            nameInput.focus();
            return;
        }

        // 2. Validasi Alamat (Jika metode delivery terpilih)
        if (selectedDelivery === 'delivery' && !userAddress) {
            alert('Silakan isi detail alamat pengiriman Anda.');
            addressInput.focus();
            return;
        }

        // 3. Validasi Pilihan Mood
        if (!selectedMoodId) {
            alert('Silakan pilih salah satu suasana hatimu saat ini.');
            return;
        }

        // --- PROSES MENYIMPAN DATA ---
        // Menyimpan status state ke localStorage sebelum berganti halaman
        localStorage.setItem('user_name', userName);
        localStorage.setItem('delivery_method', selectedDelivery);
        localStorage.setItem('user_address', selectedDelivery === 'delivery' ? userAddress : '');
        localStorage.setItem('selected_mood', selectedMoodId);

        console.log("Data identitas berhasil disimpan ke client-side storage.");

        // Pengalihan halaman secara mulus (smooth client routing)
        window.location.href = 'menu.html';
    });

    // Jalankan pengecekan data awal saat halaman selesai dimuat
    checkExistingData();
});