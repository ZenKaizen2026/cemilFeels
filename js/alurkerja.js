document.addEventListener("DOMContentLoaded", () => {
    // 1. Timeline Animation (Sequential Fade-in & Scale-up for Step Items)
    const stepItems = document.querySelectorAll(".step-item");
    stepItems.forEach((item, index) => {
        // Set initial styles for animation
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        item.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        
        // Staggered reveal
        setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
            
            // Pulse effect on the number badge when it appears
            const badge = item.querySelector(".step-number-badge");
            if (badge) {
                badge.style.transform = "translateX(-50%) scale(1.2)";
                badge.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                setTimeout(() => {
                    badge.style.transform = "translateX(-50%) scale(1)";
                }, 300);
            }
        }, index * 350); // 350ms stagger interval
    });

    // 2. Interactive Simulator Logic
    const simulatorData = {
        stres: {
            emoji: "🔥",
            menu: "Basreng Stik Pedas Level 5"
        },
        sedih: {
            emoji: "🍫",
            menu: "Piscok Lumer + Susu Hangat"
        },
        bosan: {
            emoji: "🍿",
            menu: "Keripik Pangsit Renyah"
        },
        bahagia: {
            emoji: "🥟",
            menu: "Tahu Walik Krispi + Es Teh Manis"
        }
    };

    const moodButtons = document.querySelectorAll(".mood-btn-mini");
    const emojiEl = document.querySelector(".prescription-result span:first-child");
    const menuEl = document.querySelector(".prescription-result span:last-child");

    moodButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons
            moodButtons.forEach(b => b.classList.remove("active"));
            
            // Add active class to clicked button
            btn.classList.add("active");

            // Get mood key
            const moodKey = btn.getAttribute("data-mood");
            const data = simulatorData[moodKey];
            
            if (data) {
                // Add mini fade-out/fade-in animation to simulator result
                const resultBox = document.querySelector(".prescription-result");
                resultBox.style.opacity = "0.3";
                resultBox.style.transform = "scale(0.95)";
                resultBox.style.transition = "all 0.90s ease";
                
                setTimeout(() => {
                    emojiEl.innerText = data.emoji;
                    menuEl.innerText = data.menu;
                    resultBox.style.opacity = "1";
                    resultBox.style.transform = "scale(1)";
                }, 150);
            }
        });
    });
});
