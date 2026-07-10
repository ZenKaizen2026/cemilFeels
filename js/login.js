document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const googleLoginBtn = document.querySelector(".btn-google-login");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Harap isi email dan password Anda!");
                return;
            }

            const submitBtn = loginForm.querySelector(".btn-submit-login");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Sign in...`;

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 800);
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            googleLoginBtn.disabled = true;
            googleLoginBtn.innerHTML = `<span>Sign in with Google...</span>`;

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 800);
        });
    }
});
