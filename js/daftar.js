document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const form = document.getElementById("registerForm");
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const termsCheckbox = document.getElementById("terms");

    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");

    // Modal Elements
    const customModal = document.getElementById("customModal");
    const modalCard = document.getElementById("modalCard");
    const modalIconContainer = document.getElementById("modalIconContainer");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    let modalCallback = null;

    // Show Custom Modal function
    function showModal(type, title, message, callback = null) {
        modalTitle.innerText = title;
        modalMessage.innerText = message;
        modalCallback = callback;

        // Reset and apply style based on type
        if (type === "success") {
            modalIconContainer.className = "inline-flex items-center justify-center p-3.5 rounded-2xl mb-4 bg-green-50 text-green-600 border border-green-100";
            modalIconContainer.innerHTML = '<i data-lucide="check-circle-2" class="w-8 h-8"></i>';
        } else {
            // Default to error/warning
            modalIconContainer.className = "inline-flex items-center justify-center p-3.5 rounded-2xl mb-4 bg-red-50 text-red-600 border border-red-100";
            modalIconContainer.innerHTML = '<i data-lucide="alert-triangle" class="w-8 h-8"></i>';
        }

        // Re-initialize Lucide icon inside modal
        lucide.createIcons();

        // Animate Show Modal
        customModal.classList.remove("opacity-0", "pointer-events-none");
        customModal.classList.add("opacity-100", "pointer-events-auto");
        
        modalCard.classList.remove("scale-95");
        modalCard.classList.add("scale-100");
    }

    // Hide Custom Modal function
    function hideModal() {
        customModal.classList.remove("opacity-100", "pointer-events-auto");
        customModal.classList.add("opacity-0", "pointer-events-none");
        
        modalCard.classList.remove("scale-100");
        modalCard.classList.add("scale-95");

        if (typeof modalCallback === "function") {
            const cb = modalCallback;
            modalCallback = null; // Prevent multi-triggering
            cb();
        }
    }

    // Click to Close Modal
    modalCloseBtn.addEventListener("click", hideModal);
    
    // Close when clicking overlay backdrop
    customModal.addEventListener("click", (e) => {
        if (e.target === customModal) {
            hideModal();
        }
    });

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePasswordBtn.innerHTML = type === "password" 
            ? '<i data-lucide="eye" class="w-5 h-5"></i>' 
            : '<i data-lucide="eye-off" class="w-5 h-5"></i>';
        lucide.createIcons();
    });

    toggleConfirmPasswordBtn.addEventListener("click", () => {
        const type = confirmPasswordInput.getAttribute("type") === "password" ? "text" : "password";
        confirmPasswordInput.setAttribute("type", type);
        toggleConfirmPasswordBtn.innerHTML = type === "password" 
            ? '<i data-lucide="eye" class="w-5 h-5"></i>' 
            : '<i data-lucide="eye-off" class="w-5 h-5"></i>';
        lucide.createIcons();
    });

    // Password Strength Evaluator
    passwordInput.addEventListener("input", () => {
        const val = passwordInput.value;
        let score = 0;

        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        let color = "bg-slate-200";
        let width = "0%";
        let text = "";

        if (val.length > 0) {
            if (score <= 2) {
                color = "bg-red-500";
                width = "33%";
                text = "Lemah 😕";
            } else if (score <= 4) {
                color = "bg-amber-500";
                width = "66%";
                text = "Sedang 👍";
            } else {
                color = "bg-green-500";
                width = "100%";
                text = "Kuat! 💪";
            }
        }

        strengthBar.className = `strength-bar ${color}`;
        strengthBar.style.width = width;
        strengthText.innerText = text;
    });

    // Handle Form Submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. Validation Checks
        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!fullName || !email || !phone || !password || !confirmPassword) {
            showModal("error", "Pendaftaran Gagal", "Harap lengkapi seluruh bidang input!");
            return;
        }

        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showModal("error", "Email Tidak Valid", "Format alamat email tidak valid!");
            return;
        }

        // Phone regex (Indonesian standards)
        const phoneRegex = /^(08|628|\+628)[0-9]{8,13}$/;
        if (!phoneRegex.test(phone)) {
            showModal("error", "Nomor WhatsApp Tidak Valid", "Nomor telepon tidak valid! Gunakan format Indonesia (contoh: 081234567890).");
            return;
        }

        if (password.length < 8) {
            showModal("error", "Kata Sandi Terlalu Pendek", "Password minimal harus terdiri dari 8 karakter!");
            return;
        }

        if (password !== confirmPassword) {
            showModal("error", "Kata Sandi Tidak Cocok", "Konfirmasi password tidak cocok!");
            return;
        }

        if (!termsCheckbox.checked) {
            showModal("error", "Syarat & Ketentuan", "Anda harus menyetujui Syarat & Ketentuan untuk mendaftar.");
            return;
        }

        // Show Success state (Simulate API request)
        const btn = form.querySelector("button[type='submit']");
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Memproses...`;
        lucide.createIcons();

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            lucide.createIcons();
            showModal("success", "Registrasi Berhasil", "Registrasi Berhasil! Selamat bergabung di CemilFeels 🎉", () => {
                window.location.href = "login.html";
            });
        }, 1500);
    });
});
