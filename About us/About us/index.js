document.addEventListener('DOMContentLoaded', () => {
    // Logika penting: Menghapus data transaksi sebelumnya dari localStorage
    // saat pengguna kembali ke halaman utama untuk memastikan alur data yang konsisten.
    const keysToClear = [
        'user_name', 
        'delivery_method', 
        'user_address', 
        'selected_mood', 
        'selected_food_name', 
        'selected_food_price', 
        'has_ulcer', 
        'spicy_level', 
        'selected_drink_name', 
        'selected_drink_price'
    ];
    
    keysToClear.forEach(key => localStorage.removeItem(key));
    console.log("Sesi belanja sebelumnya telah dibersihkan.");
});

(function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
                scrollToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
            } else {
                scrollToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
                scrollToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();
