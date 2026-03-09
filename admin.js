document.addEventListener('DOMContentLoaded', () => {
    // --- Data Management ---
    const STORAGE_KEY = 'CAKEMILL_PRODUCTS';
    const AUTH_KEY = 'CAKEMILL_AUTH';

    const defaultProducts = [
        { id: '1', name: 'Brownie Cake Mill (1 dona)', category: 'cakes', price: 12000, image: 'assets/brownie.png', desc: 'Betakror shokoladli premium brownie, Cake Mill maxsus resepti asosida tayyorlangan.' },
        { id: '2', name: 'Dream Cake Mill (1 dona)', category: 'cakes', price: 12000, image: 'assets/dream_cake.png', desc: 'Cake Mill maxsus resepti asosidagi nafis va betakror orzudagi tort.' },
        { id: '3', name: 'Red Velvet Mill (1 dona)', category: 'desserts', price: 12000, image: 'assets/red_velvet_mill.png', desc: 'Nafis qaymoqli krem va rezavor mevalar bilan uyg\'unlashgan premium dessert.' },
        { id: '4', name: 'Exotica Cake Mill', category: 'desserts', price: 35000, image: 'assets/exotica_cake.png', desc: 'Yashil pista va ekzotik mevalar uyg\'unligidagi betakror ta\'m.' },
        { id: '5', name: 'Cheesecake Oreo Cake Mill (1 dona)', category: 'cakes', price: 15000, image: 'https://i.ibb.co/ZR6jJCYZ/orea.jpg', desc: 'Oreo pechenyelari va mayin pishloqli krem uyg\'unligidagi shokoladli premium cheesecake.' },
        { id: '6', name: 'Honey cake Cake Mill (1 dona)', category: 'cakes', price: 12000, image: 'https://i.ibb.co/FqBCT0fz/medovi.jpg', desc: 'An\'anaviy asalli va sariyog\'li mayin qavatlar, klassik Cake Mill uslubida.' },
        { id: '7', name: 'Chizkeyk San Sebastian', category: 'desserts', price: 450000, image: 'https://i.ibb.co/xSCkz371/tort.jpg', desc: 'Boy shokoladli premium dessert, har qanday shokolad shaydosi uchun ideal tanlov.' },
        { id: '8', name: 'Exclusive set ot Cake Mill', category: 'desserts', price: 900000, image: 'https://i.ibb.co/6RcL2ByH/asarti.jpg', desc: 'Yangi rezavor mevalar va mayin krem uyg\'unligidagi tetiklantiruvchi dessert.' },
        { id: '9', name: 'Ragalik (1 kg)', category: 'cakes', price: 180000, image: 'https://i.ibb.co/chCQ5Xw6/oq.jpg', desc: 'An\'anaviy usulda tayyorlangan, mayin va mazali ragaliklar to\'plami. Choy bilan ichish uchun ajoyib tanlov.' },
    ];

    let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultProducts;
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    }

    // --- Authentication ---
    const loginScreen = document.getElementById('login-screen');
    const adminLayout = document.getElementById('admin-layout');
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    const checkAuth = () => {
        if (sessionStorage.getItem(AUTH_KEY) === 'true') {
            loginScreen.style.display = 'none';
            adminLayout.classList.remove('hidden');
            renderProducts();
        }
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple demo credentials
        if (username === 'admin' && password === 'admin123') {
            sessionStorage.setItem(AUTH_KEY, 'true');
            loginScreen.style.display = 'none';
            adminLayout.classList.remove('hidden');
            renderProducts();
        } else {
            loginError.textContent = 'Login yoki parol noto\'g\'ri!';
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(AUTH_KEY);
        location.reload();
    });

    checkAuth();

    // --- Tab Switching ---
    const tabs = document.querySelectorAll('.sidebar-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabTitle = document.getElementById('tab-title');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });

            tabTitle.textContent = tab.querySelector('span').textContent;
        });
    });

    // --- Product Management ---
    const productsList = document.getElementById('products-list');
    const productModal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const closeModal = document.getElementById('close-modal');
    const productForm = document.getElementById('product-form');

    const renderProducts = () => {
        productsList.innerHTML = '';
        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.image}" class="product-img-sm" onerror="this.src='https://placehold.co/50x50?text=No+Img'"></td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.price.toLocaleString()} so'm</td>
                <td>
                    <div class="actions">
                        <button class="btn-icon btn-edit" onclick="editProduct('${p.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon btn-delete" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            productsList.appendChild(tr);
        });
    };

    window.deleteProduct = (id) => {
        if (confirm('Ishonchingiz komilmi?')) {
            products = products.filter(p => p.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
            renderProducts();
        }
    };

    window.editProduct = (id) => {
        const p = products.find(prod => prod.id === id);
        if (p) {
            document.getElementById('edit-id').value = p.id;
            document.getElementById('product-name').value = p.name;
            document.getElementById('product-category').value = p.category;
            document.getElementById('product-price').value = p.price;
            document.getElementById('product-image').value = p.image;
            document.getElementById('product-desc').value = p.desc || '';

            document.getElementById('modal-title').textContent = 'Tahrirlash';
            productModal.classList.add('active');
        }
    };

    addProductBtn.addEventListener('click', () => {
        productForm.reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('modal-title').textContent = 'Yangi mahsulot';
        productModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        productModal.classList.remove('active');
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const price = parseInt(document.getElementById('product-price').value);
        const image = document.getElementById('product-image').value;
        const desc = document.getElementById('product-desc').value;

        if (id) {
            // Update
            const index = products.findIndex(p => p.id === id);
            products[index] = { ...products[index], name, category, price, image, desc };
        } else {
            // Add
            const newId = Date.now().toString();
            products.push({ id: newId, name, category, price, image, desc });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        renderProducts();
        productModal.classList.remove('active');
    });
});
