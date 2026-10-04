/**
 * 1. Fitur Dark/Light Mode Toggle
 */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('.icon');
const body = document.body;

// Mengecek preferensi tema sebelumnya (jika ada di localStorage)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.textContent = '☀️'; // Ikon matahari untuk mode gelap (kembali ke terang)
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark'); // Simpan preferensi
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});

/**
 * 2. Fitur Efek Mengetik (Typing Effect)
 */
const typingTextElement = document.getElementById('typing-text');
const wordsToType = ["Data Processing Enthusiast.", "Problem Solver.", "Tech Learner."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100; // Kecepatan mengetik
let erasingDelay = 50; // Kecepatan menghapus
let newWordDelay = 2000; // Jeda sebelum mengetik kata baru

function type() {
    // Menentukan kata saat ini yang akan diketik/dihapus
    const currentWord = wordsToType[wordIndex];
    
    if (isDeleting) {
        // Hapus karakter satu per satu
        typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Tambah karakter satu per satu
        typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Mengatur logika delay ketik
    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentWord.length) {
        // Kata selesai diketik, jeda sejenak lalu mulai menghapus
        typeSpeed = newWordDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Kata selesai dihapus, pindah ke kata selanjutnya
        isDeleting = false;
        wordIndex++;
        // Ulangi dari awal jika sudah mencapai kata terakhir
        if (wordIndex === wordsToType.length) {
            wordIndex = 0;
        }
        typeSpeed = 500; // Jeda sebelum mengetik kata baru
    }

    setTimeout(type, typeSpeed);
}

// Mulai efek pengetikan setelah halaman dimuat (sedikit jeda)
document.addEventListener("DOMContentLoaded", () => {
    if(typingTextElement) {
        setTimeout(type, 1000);
    }
});

/**
 * 3. Smooth Scrolling untuk Navigasi (Walaupun CSS sudah diatur, ini tambahan logika JS)
 * Menangkap event klik pada link navbar dan melakukan smooth scroll manual.
 */
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Mencegah perilaku lompatan default
        e.preventDefault();
        
        // Mengambil ID target (misal: #tentang-saya)
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Scroll mulus ke elemen target, dengan offset -80px untuk menghindari tertutup sticky navbar
            const navHeight = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
