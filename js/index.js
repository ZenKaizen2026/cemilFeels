document.addEventListener('DOMContentLoaded', () => {
            // Logika penting: Menghapus data transaksi sebelumnya dari localStorage
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

            // testimonial carousel click effect
            const testimonialCards = document.querySelectorAll(".testimonial-card");
            testimonialCards.forEach(card => {
                card.addEventListener("click", () => {
                    testimonialCards.forEach(c => {
                        c.classList.remove("border-orange-500", "scale-[1.02]", "shadow-lg");
                        c.classList.add("border-gray-100");
                    });
                    card.classList.remove("border-gray-100");
                    card.classList.add("border-orange-500", "scale-[1.02]", "shadow-lg");
                });
            });

            // auto-sliding carousel when mouse is hovering
            const testimonialTrack = document.getElementById("testimonialTrack");
            const testimonialSection = document.getElementById("testimonialSection");
            let testimonialIndex = 0;
            let testimonialInterval = null;

            function slideTestimonials(dir = 'next') {
                const totalCards = testimonialCards.length;
                const isDesktop = window.innerWidth >= 768;
                const slideWidth = isDesktop ? 50 : 100;
                const maxIndex = totalCards - (isDesktop ? 2 : 1);

                if (dir === 'next') {
                    testimonialIndex++;
                    if (testimonialIndex > maxIndex) {
                        testimonialIndex = 0;
                    }
                } else {
                    testimonialIndex--;
                    if (testimonialIndex < 0) {
                        testimonialIndex = maxIndex;
                    }
                }
                testimonialTrack.style.transform = `translateX(-${testimonialIndex * slideWidth}%)`;
            }

            window.slideNext = () => slideTestimonials('next');
            window.slidePrev = () => slideTestimonials('prev');

            testimonialSection.addEventListener("mouseenter", () => {
                if (!testimonialInterval) {
                    testimonialInterval = setInterval(() => slideTestimonials('next'), 2500);
                }
            });

            testimonialSection.addEventListener("mouseleave", () => {
                if (testimonialInterval) {
                    clearInterval(testimonialInterval);
                    testimonialInterval = null;
                }
            });
        });

        // Modal data & logic
        const snackData = {
            basreng: {
                nama: "Basreng Stik",
                harga: "Rp 12.000",
                img: "../imgfromrifky/basrengstik.jpeg",
                tag: "Pedas 🔥",
                tagBg: "bg-red-500",
                sales: "Dibeli 1.840+ kali",
                desc: "Bakso goreng stik renyah berbalut bumbu cabai melimpah dengan aroma jeruk purut segar yang wangi. Sangat pas untuk meredakan kekesalan dan merestart mood-mu agar kembali ceria!"
            },
            piscok: {
                nama: "Piscok Lumer Coklat",
                harga: "Rp 10.000",
                img: "../imgfromrifky/piscok_lumer_coklat.jpeg",
                tag: "Manis 🍫",
                tagBg: "bg-yellow-500",
                sales: "Dibeli 2.450+ kali",
                desc: "Pisang berselimut kulit lumpia super renyah dengan isian cokelat melimpah yang langsung lumer di setiap gigitan. Kombinasi manis pisang raja pilihan dan cokelat premium ini sangat ampuh meredakan kepedihan hati."
            },
            cireng: {
                nama: "Cireng Sambal Rujak",
                harga: "Rp 10.000",
                img: "../imgfromrifky/cireng_sambal_rujak.jpeg",
                tag: "Asli Nusantara 🇮🇩",
                tagBg: "bg-emerald-500",
                sales: "Dibeli 1.290+ kali",
                desc: "Cireng kenyal berbalut tepung garing tipis khas jajanan tradisional Jawa Barat. Disajikan dengan cocolan bumbu rujak asam manis pedas yang segar dari gula jawa asli dan cabai pilihan."
            },
            tahu: {
                nama: "Tahu Walik",
                harga: "Rp 12.000",
                img: "../imgfromrifky/tahu_walik.jpeg",
                tag: "Gurih 🌟",
                tagBg: "bg-orange-500",
                sales: "Dibeli 1.670+ kali",
                desc: "Tahu goreng khas Banyuwangi yang dibalik lalu diisi dengan adonan bakso daging ayam super gurih dan renyah. Sangat cocok dijadikan cemilan santai peneman kerja atau tugas harian."
            }
        };

        function openSnackModal(key) {
            const data = snackData[key];
            if(!data) return;
            
            document.getElementById("modalSnackImg").src = data.img;
            document.getElementById("modalSnackName").innerText = data.nama;
            document.getElementById("modalSnackPrice").innerText = data.harga;
            document.getElementById("modalSnackDesc").innerText = data.desc;
            
            const tagEl = document.getElementById("modalSnackTag");
            tagEl.innerText = data.tag;
            tagEl.className = `text-white text-[10px] px-2 py-0.5 rounded font-bold ${data.tagBg}`;
            
            document.getElementById("modalSnackSales").innerText = data.sales;
            
            const modal = document.getElementById("snackDetailModal");
            modal.classList.remove("invisible", "opacity-0");
            modal.classList.add("visible", "opacity-100");
            modal.firstElementChild.classList.remove("scale-95");
            modal.firstElementChild.classList.add("scale-100");
        }

        function closeSnackModal() {
            const modal = document.getElementById("snackDetailModal");
            modal.classList.remove("visible", "opacity-100");
            modal.classList.add("invisible", "opacity-0");
            modal.firstElementChild.classList.remove("scale-100");
            modal.firstElementChild.classList.add("scale-95");
        }

        // Expose modal functions to window object
        window.openSnackModal = openSnackModal;
        window.closeSnackModal = closeSnackModal;
        