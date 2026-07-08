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
            alert("Harap lengkapi seluruh bidang input!");
            return;
        }

        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Format alamat email tidak valid!");
            return;
        }

        // Phone regex (Indonesian standards)
        const phoneRegex = /^(08|628|\+628)[0-9]{8,13}$/;
        if (!phoneRegex.test(phone)) {
            alert("Nomor telepon tidak valid! Gunakan format Indonesia (contoh: 081234567890).");
            return;
        }

        if (password.length < 8) {
            alert("Password minimal harus terdiri dari 8 karakter!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Konfirmasi password tidak cocok!");
            return;
        }

        if (!termsCheckbox.checked) {
            alert("Anda harus menyetujui Syarat & Ketentuan untuk mendaftar.");
            return;
        }

        // Show Success state (Simulate API request)
        const btn = form.querySelector("button[type='submit']");
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Memproses...`;
        lucide.createIcons();

        setTimeout(() => {
            alert("Registrasi Berhasil! Selamat bergabung di CemilFeels 🎉");
            window.location.href = "login.html";
        }, 1500);
    });
});
