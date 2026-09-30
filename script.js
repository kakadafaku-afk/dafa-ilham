// --- Data Menu ---
// Menyimpan daftar menu beserta detailnya (id, nama, deskripsi, harga, dan gambar)
const menuData = {
    mains: [
        { id: 'm1', name: 'Dokumentasi', desc: 'Daging wagyu pilihan dengan saus lada hitam khas Savoria, disajikan dengan kentang tumbuk.', price: 250000, img: 'DSC00791.jpg' },
        { id: 'm2', name: 'Dokumestasi', desc: 'Fettuccine al dente dengan saus krim jamur truffle yang harum dan taburan parmesan.', price: 120000, img: 'WhatsApp Image 2026-07-09 at 10.41.13.jpeg' },
        { id: 'm3', name: 'Dokumestasi', desc: 'Fillet salmon segar panggang dengan saus lemon butter dan sayuran musiman.', price: 180000, img: 'DSC00539.jpg' }
    ],
    drinks: [
        { id: 'd1', name: 'Dokumestasi', desc: 'Perpaduan premium matcha Jepang dengan susu segar dan es.', price: 45000, img: 'gambar.jpeg' },
        { id: 'd2', name: 'Dokumestasi', desc: 'Teh hitam pilihan diseduh dengan lemon segar dan sirup agave.', price: 35000, img: 'gambar.jpeg' },
        { id: 'd3', name: 'Dokumestasi', desc: 'Air soda menyegarkan dengan ekstrak buah beri asli dan daun mint.', price: 40000, img: 'gambar.jpeg' }
    ],
    snacks: [
        { id: 's1', name: 'Dokumestasi', desc: 'Ubi manis goreng renyah disajikan dengan saus truffle mayo.', price: 45000, img: 'gambar.jpeg' },
        { id: 's2', name: 'Dokumestasi', desc: 'Roti artisan panggang dengan topping tomat segar, basil, dan minyak zaitun.', price: 55000, img: 'gambar.jpeg' },
        { id: 's3', name: 'Dokumestasi', desc: 'Cumi goreng tepung renyah dengan saus tartar spesial.', price: 65000, img: 'gambar.jpeg' }
    ]
};

// --- State Aplikasi ---
// Keranjang belanja menyimpan item yang dipilih
let cart = [];

// --- Utilitas ---
// Fungsi untuk memformat angka menjadi format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// --- Inisialisasi Tampilan ---
// Fungsi untuk merender daftar menu ke dalam HTML
const renderMenu = () => {
    const renderCategory = (items, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${item.img}" alt="${item.name}" class="card-img">
                </div>
                <div class="card-content">
                    <h4 class="card-title">${item.name}</h4>
                    <p class="card-desc">${item.desc}</p>
                    <div class="card-footer">
                        <span class="card-price">${formatRupiah(item.price)}</span>
                        <button class="btn btn-outline btn-small" onclick="addToCart('${item.id}')">
                            Tambah
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    };

    renderCategory(menuData.mains, 'mains-grid');
    renderCategory(menuData.drinks, 'drinks-grid');
    renderCategory(menuData.snacks, 'snacks-grid');
};

// --- Logika Keranjang (Cart) ---

// Mencari item berdasarkan ID dari seluruh data menu
const findMenuItem = (id) => {
    for (const category in menuData) {
        const found = menuData[category].find(item => item.id === id);
        if (found) return found;
    }
    return null;
};

// Menambah item ke keranjang
const addToCart = (id) => {
    const item = findMenuItem(id);
    if (!item) return;

    // Cek apakah item sudah ada di keranjang
    const existingCartItem = cart.find(cartItem => cartItem.id === id);
    
    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
};

// Mengubah kuantitas item (tambah/kurang)
const changeQuantity = (id, delta) => {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += delta;

    // Hapus item jika kuantitas mencapai 0
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    updateCartUI();
};

// Menghapus item dari keranjang sepenuhnya
const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
};

// Memperbarui antarmuka keranjang (Badge, Daftar Item, Total Harga)
const updateCartUI = () => {
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Hitung Total Harga
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = formatRupiah(totalPrice);

    // Update state tombol Checkout
    checkoutBtn.disabled = cart.length === 0;

    // Render ulang daftar item di keranjang
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Keranjang Anda masih kosong.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${formatRupiah(item.price)}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="btn btn-danger btn-small" onclick="removeFromCart('${item.id}')">Hapus</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });
};

// --- Logika Checkout Modal ---
const checkoutBtn = document.getElementById('checkout-btn');
const modal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalOrderList = document.getElementById('modal-order-list');
const modalTotalPrice = document.getElementById('modal-total-price');

// Menampilkan Modal Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    // Render ringkasan pesanan ke dalam modal
    modalOrderList.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="order-item-name">${item.quantity}x ${item.name}</span>
            <span class="order-item-price">${formatRupiah(item.price * item.quantity)}</span>
        `;
        modalOrderList.appendChild(li);
    });

    // Set total harga di modal
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalTotalPrice.textContent = formatRupiah(totalPrice);

    // Tampilkan modal
    modal.classList.add('show');
});

// Menutup Modal dan Reset Keranjang
const closeModal = () => {
    modal.classList.remove('show');
    // Kosongkan keranjang setelah checkout sukses
    cart = [];
    updateCartUI();
};

closeModalBtn.addEventListener('click', closeModal);

// Tutup modal jika user mengklik area luar modal
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// --- Jalankan saat halaman dimuat ---
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartUI();
});
