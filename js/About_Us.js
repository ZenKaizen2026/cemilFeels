(function() {
    var btn = document.getElementById('scrollToTopBtn');
    if (btn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
                btn.style.transform = 'translateY(0)';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
                btn.style.transform = 'translateY(12px)';
            }
        });
        btn.addEventListener('mouseenter', function() {
            btn.style.boxShadow = '0 8px 25px rgba(249,115,22,0.55)';
            btn.style.transform = window.scrollY > 300 ? 'translateY(-2px) scale(1.08)' : 'translateY(12px)';
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.boxShadow = '0 6px 20px rgba(249,115,22,0.4)';
            btn.style.transform = window.scrollY > 300 ? 'translateY(0)' : 'translateY(12px)';
        });
    }
})();
