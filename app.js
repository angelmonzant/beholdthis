// Fashion Store JavaScript
// Handle mobile navigation, theme switching, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    
    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        document.addEventListener('click', function(event) {
            if (!hamburgerMenu.contains(event.target) && !mainNav.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // THEME SWITCHER LOGIC
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const THEME_KEY = 'fashion-store-theme';

    // Set theme (light/dark) on <html> element
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    }

    // Get theme from localStorage or system
    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
        return prefersDark ? 'dark' : 'light';
    }

    // Apply theme on load
    setTheme(getPreferredTheme());

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem(THEME_KEY, next);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(THEME_KEY)) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Only preventDefault if the link is an anchor on the current page
            if (href && href.startsWith('#') && href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // Otherwise, let the browser handle navigation (for .html links)
        });
    });

    // Add loading animation for news items
    const newsItems = document.querySelectorAll('.news-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    newsItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // === PRODUCT LISTING & MODAL LOGIC FOR WORKSTORE ===
    // Product and collection data
    const products = [
        // T-Shirts
        {
            id: 1,
            name: 'Classic White Tee',
            price: 39.00,
            image: 'assets/products/tshirt-1.webp',
            collection: 'T-Shirts',
            description: 'Our Classic White Tee is made from 100% organic cotton. Designed for comfort and style, it\'s a wardrobe essential for any season.',
            details: {
                colors: ['White', 'Black', 'Gray'],
                sizes: ['S', 'M', 'L', 'XL'],
                info: [
                    '100% Organic Cotton',
                    'Unisex Fit',
                    'Available in 4 sizes'
                ],
                sizeInfo: [
                    'S: Chest 48cm, Length 64cm, Sleeve 19cm',
                    'M: Chest 52cm, Length 67cm, Sleeve 20cm',
                    'L: Chest 56cm, Length 70cm, Sleeve 21cm',
                    'XL: Chest 60cm, Length 73cm, Sleeve 22cm'
                ],
                designer: 'Minimalist and sustainable design.'
            }
        },
        {
            id: 2,
            name: 'Hot Dog Tee',
            price: 42.00,
            image: 'assets/products/tshirt-2.webp',
            collection: 'T-Shirts',
            description: 'A playful tee with a hot dog graphic, perfect for casual days.',
            details: {
                colors: ['White', 'Yellow'],
                sizes: ['S', 'M', 'L'],
                info: ['100% Cotton', 'Regular Fit'],
                sizeInfo: ['S: Chest 47cm', 'M: Chest 51cm', 'L: Chest 55cm'],
                designer: 'Fun and quirky, designed for those who love a statement piece.'
            }
        },
        {
            id: 3,
            name: 'Retro Stripe Tee',
            price: 45.00,
            image: 'assets/products/tshirt-3.webp',
            collection: 'T-Shirts',
            description: 'Retro-inspired stripes for a classic look.',
            details: {
                colors: ['Blue', 'Red'],
                sizes: ['M', 'L', 'XL'],
                info: ['Striped Pattern', 'Soft Cotton'],
                sizeInfo: ['M: Chest 50cm', 'L: Chest 54cm', 'XL: Chest 58cm'],
                designer: 'Inspired by vintage sportswear.'
            }
        },
        {
            id: 4,
            name: 'Graphic Print Tee',
            price: 38.00,
            image: 'assets/products/tshirt-4.webp',
            collection: 'T-Shirts',
            description: 'Bold graphic print for a standout style.',
            details: {
                colors: ['Black', 'White'],
                sizes: ['S', 'M', 'L'],
                info: ['Bold Print', 'Lightweight Fabric'],
                sizeInfo: ['S: Chest 46cm', 'M: Chest 50cm', 'L: Chest 54cm'],
                designer: 'Urban streetwear influence.'
            }
        },
        // Sweatshirts
        {
            id: 5,
            name: 'Bow Wow Sweatshirt',
            price: 59.00,
            image: 'assets/products/sweatshirt-1.webp',
            collection: 'Sweatshirts',
            description: 'Cozy up in this Bow Wow sweatshirt, featuring a cute dog print.',
            details: {
                colors: ['Gray', 'Brown'],
                sizes: ['M', 'L', 'XL'],
                info: ['Soft Fleece', 'Relaxed Fit'],
                sizeInfo: ['M: Chest 54cm', 'L: Chest 58cm', 'XL: Chest 62cm'],
                designer: 'Inspired by playful pets and comfort.'
            }
        },
        {
            id: 6,
            name: 'Classic Crew Sweatshirt',
            price: 62.00,
            image: 'assets/products/sweatshirt-2.webp',
            collection: 'Sweatshirts',
            description: 'A timeless crewneck sweatshirt for everyday wear.',
            details: {
                colors: ['Navy', 'Gray'],
                sizes: ['S', 'M', 'L', 'XL'],
                info: ['Classic Fit', 'Ribbed Cuffs'],
                sizeInfo: ['S: Chest 52cm', 'M: Chest 56cm', 'L: Chest 60cm', 'XL: Chest 64cm'],
                designer: 'Classic American sportswear.'
            }
        },
        {
            id: 7,
            name: 'Oversized Hoodie',
            price: 68.00,
            image: 'assets/products/sweatshirt-3.webp',
            collection: 'Sweatshirts',
            description: 'Stay warm and stylish with this oversized hoodie.',
            details: {
                colors: ['Black', 'Olive'],
                sizes: ['M', 'L', 'XL'],
                info: ['Oversized Fit', 'Kangaroo Pocket'],
                sizeInfo: ['M: Chest 60cm', 'L: Chest 64cm', 'XL: Chest 68cm'],
                designer: 'Modern comfort and utility.'
            }
        },
        {
            id: 8,
            name: 'Zip-Up Sweatshirt',
            price: 65.00,
            image: 'assets/products/sweatshirt-4.webp',
            collection: 'Sweatshirts',
            description: 'A versatile zip-up sweatshirt for layering.',
            details: {
                colors: ['Gray', 'Blue'],
                sizes: ['S', 'M', 'L'],
                info: ['Full Zip', 'Side Pockets'],
                sizeInfo: ['S: Chest 53cm', 'M: Chest 57cm', 'L: Chest 61cm'],
                designer: 'Functional and stylish.'
            }
        },
        // Accessories
        {
            id: 9,
            name: 'Cyclist Cap',
            price: 29.00,
            image: 'assets/products/accessory-1.webp',
            collection: 'Accessories',
            description: 'A stylish cap for cycling enthusiasts.',
            details: {
                colors: ['Brown'],
                sizes: ['One Size'],
                info: ['Adjustable', 'Breathable Fabric'],
                sizeInfo: ['One Size Fits Most'],
                designer: 'Designed for active lifestyles.'
            }
        },
        {
            id: 10,
            name: 'Canvas Tote Bag',
            price: 25.00,
            image: 'assets/products/accessory-2.webp',
            collection: 'Accessories',
            description: 'Carry your essentials in this durable canvas tote.',
            details: {
                colors: ['Natural', 'Black'],
                sizes: ['One Size'],
                info: ['Heavyweight Canvas', 'Long Handles'],
                sizeInfo: ['40x35cm'],
                designer: 'Eco-friendly and practical.'
            }
        },
        {
            id: 11,
            name: 'Patterned Socks',
            price: 12.00,
            image: 'assets/products/accessory-3.webp',
            collection: 'Accessories',
            description: 'Add a pop of color to your outfit with these patterned socks.',
            details: {
                colors: ['Red', 'Blue', 'Green'],
                sizes: ['M', 'L'],
                info: ['Soft Cotton', 'Breathable'],
                sizeInfo: ['M: 38-41', 'L: 42-45'],
                designer: 'Fun and functional.'
            }
        },
        {
            id: 12,
            name: 'Leather Wallet',
            price: 48.00,
            image: 'assets/products/accessory-4.webp',
            collection: 'Accessories',
            description: 'A classic leather wallet with multiple compartments.',
            details: {
                colors: ['Brown', 'Black'],
                sizes: ['One Size'],
                info: ['Genuine Leather', 'Slim Design'],
                sizeInfo: ['11x9cm'],
                designer: 'Timeless craftsmanship.'
            }
        }
    ];

    // Get unique collections, colors, and sizes
    const collections = ['All', ...Array.from(new Set(products.map(p => p.collection)))];
    const allColors = Array.from(new Set(products.flatMap(p => p.details.colors)));
    const allSizes = Array.from(new Set(products.flatMap(p => p.details.sizes)));

    // DOM elements
    const collectionsMenu = document.querySelector('.collections-menu');
    const productGrid = document.querySelector('.product-grid');
    const productModal = document.getElementById('product-modal');
    const modalProductDetail = document.getElementById('modal-product-detail');
    const closeModalBtn = document.getElementById('close-modal');
    const filterPrice = document.getElementById('filter-price');
    const filterColor = document.getElementById('filter-color');
    const filterSize = document.getElementById('filter-size');

    // State for filters
    let currentCollection = 'All';
    let currentPrice = '';
    let currentColor = '';
    let currentSize = '';

    // Populate color and size filters
    function populateFilterOptions() {
        if (filterColor) {
            filterColor.innerHTML = '<option value="">Color</option>' +
                allColors.map(color => `<option value="${color}">${color}</option>`).join('');
        }
        if (filterSize) {
            filterSize.innerHTML = '<option value="">Talla</option>' +
                allSizes.map(size => `<option value="${size}">${size}</option>`).join('');
        }
    }

    // Render collections submenu
    function renderCollectionsMenu() {
        if (!collectionsMenu) return;
        collectionsMenu.innerHTML = collections.map(col =>
            `<button class="collection-btn${col === currentCollection ? ' active' : ''}" data-collection="${col}">${col}</button>`
        ).join('');
    }

    // Render product grid with all filters
    function renderProductGrid() {
        if (!productGrid) return;
        let filtered = products.filter(p => {
            const matchCollection = currentCollection === 'All' || p.collection === currentCollection;
            const matchColor = !currentColor || p.details.colors.includes(currentColor);
            const matchSize = !currentSize || p.details.sizes.includes(currentSize);
            return matchCollection && matchColor && matchSize;
        });
        // Sort by price if needed
        if (currentPrice === 'low') {
            filtered = filtered.slice().sort((a, b) => a.price - b.price);
        } else if (currentPrice === 'high') {
            filtered = filtered.slice().sort((a, b) => b.price - a.price);
        }
        productGrid.innerHTML = filtered.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" />
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        `).join('');
    }

    // Remove modal logic and update product card click to redirect
    if (productGrid) {
        productGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.product-card');
            if (card) {
                const id = card.getAttribute('data-id');
                window.location.href = `product-detail.html?id=${id}`;
            }
        });
    }

    // === PRODUCT DETAIL PAGE LOGIC ===
    if (window.location.pathname.endsWith('product-detail.html')) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        const container = document.getElementById('product-detail-container');
        if (container) {
            const product = products.find(p => String(p.id) === String(productId));
            if (!product) {
                container.innerHTML = '<p style="padding:2rem;text-align:center;">Product not found.</p>';
            } else {
                container.innerHTML = `
                    <div class="product-detail-card">
                        <div class="product-detail-gallery">
                            <img src="${product.image}" alt="${product.name}" class="product-detail-image" />
                        </div>
                        <div class="product-detail-info">
                            <h2 class="product-detail-title">${product.name}</h2>
                            <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                            <div class="product-detail-description">${product.description}</div>
                            <div class="product-detail-options">
                                <label>Color:
                                    <select>
                                        ${product.details.colors.map(c => `<option>${c}</option>`).join('')}
                                    </select>
                                </label>
                                <label>Size:
                                    <select>
                                        ${product.details.sizes.map(s => `<option>${s}</option>`).join('')}
                                    </select>
                                </label>
                            </div>
                            <button id="add-to-cart-btn" class="add-cart-btn" style="margin-top:1.5rem;width:100%;font-size:1.1rem;">Agregar al carrito</button>
                            <span id="add-to-cart-feedback" style="display:block;margin-top:0.7rem;font-size:1rem;color:var(--color-accent);"></span>
                            <div class="product-detail-extra">
                                <h4>Details</h4>
                                <ul>${product.details.info.map(i => `<li>${i}</li>`).join('')}</ul>
                                <h4>Size Info</h4>
                                <ul>${product.details.sizeInfo.map(i => `<li>${i}</li>`).join('')}</ul>
                                <h4>About the Designer</h4>
                                <p>${product.details.designer}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }

    // === BASIC CART LOGIC ===
    const CART_KEY = 'fashion-store-cart';
    const cartCountEl = document.getElementById('cart-count');

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }
    function setCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }
    function updateCartCount() {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        if (cartCountEl) {
            if (total > 0) {
                cartCountEl.textContent = total;
                cartCountEl.style.display = 'flex';
            } else {
                cartCountEl.textContent = '0';
                cartCountEl.style.display = 'none';
            }
        }
    }
    // Call on load
    updateCartCount();

    // Example: function to add a product to cart
    window.addToCart = function(productId, quantity = 1) {
        let cart = getCart();
        const idx = cart.findIndex(item => item.id === productId);
        if (idx !== -1) {
            cart[idx].quantity += quantity;
        } else {
            cart.push({ id: productId, quantity });
        }
        setCart(cart);
    };

    // === CART PANEL LOGIC ===
    const cartPanel = document.getElementById('cart-panel');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartPanelTotal = document.getElementById('cart-panel-total-amount');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    const closeCartPanelBtn = document.getElementById('close-cart-panel');
    const cartToggleBtn = document.querySelector('.cart-toggle');

    // Helper: get product by id
    function getProductById(id) {
        return products.find(p => String(p.id) === String(id));
    }

    // Render cart panel items
    function renderCartPanel() {
        const cart = getCart();
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center;color:var(--color-secondary);margin-top:2rem;">Tu carrito está vacío.</p>';
            if (cartPanelTotal) cartPanelTotal.textContent = '$0.00';
            return;
        }
        let total = 0;
        cartItemsContainer.innerHTML = cart.map(item => {
            const product = getProductById(item.id);
            if (!product) return '';
            const subtotal = product.price * item.quantity;
            total += subtotal;
            return `
                <div class="cart-item" style="display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem;">
                    <img src="${product.image}" alt="${product.name}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;">
                    <div style="flex:1;">
                        <div style="font-weight:600;">${product.name}</div>
                        <div style="font-size:0.98rem;color:var(--color-secondary);">$${product.price.toFixed(2)} x </div>
                        <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.3rem;">
                            <button class="cart-qty-btn" data-action="decrease" data-id="${item.id}" style="width:2rem;height:2rem;">-</button>
                            <span style="min-width:2rem;text-align:center;">${item.quantity}</span>
                            <button class="cart-qty-btn" data-action="increase" data-id="${item.id}" style="width:2rem;height:2rem;">+</button>
                        </div>
                    </div>
                    <div style="font-weight:600;min-width:70px;text-align:right;">$${subtotal.toFixed(2)}</div>
                    <button class="cart-remove-btn" data-id="${item.id}" aria-label="Eliminar" style="background:none;border:none;color:#e53935;font-size:1.5rem;cursor:pointer;">&times;</button>
                </div>
            `;
        }).join('');
        if (cartPanelTotal) cartPanelTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Open/close cart panel
    function openCartPanel() {
        if (cartPanel) {
            cartPanel.style.display = 'block';
            setTimeout(() => { cartPanel.style.transform = 'translateX(0)'; }, 10);
            renderCartPanel();
        }
    }
    function closeCartPanel() {
        if (cartPanel) {
            cartPanel.style.transform = '';
            setTimeout(() => { cartPanel.style.display = 'none'; }, 350);
        }
    }
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', openCartPanel);
    }
    if (closeCartPanelBtn) {
        closeCartPanelBtn.addEventListener('click', closeCartPanel);
    }
    // Close on click outside (optional, for mobile UX)
    document.addEventListener('click', function(e) {
        if (cartPanel && cartPanel.style.display !== 'none' && !cartPanel.contains(e.target) && !e.target.classList.contains('cart-toggle') && !e.target.closest('.cart-toggle')) {
            closeCartPanel();
        }
    });

    // Cart panel item actions
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            const id = btn.getAttribute('data-id');
            if (btn.classList.contains('cart-qty-btn')) {
                let cart = getCart();
                const idx = cart.findIndex(item => String(item.id) === String(id));
                if (idx !== -1) {
                    if (btn.getAttribute('data-action') === 'increase') {
                        cart[idx].quantity++;
                    } else if (btn.getAttribute('data-action') === 'decrease' && cart[idx].quantity > 1) {
                        cart[idx].quantity--;
                    }
                    setCart(cart);
                    renderCartPanel();
                }
            } else if (btn.classList.contains('cart-remove-btn')) {
                let cart = getCart();
                cart = cart.filter(item => String(item.id) !== String(id));
                setCart(cart);
                renderCartPanel();
            }
        });
    }

    // Update cart panel when cart changes
    window.addEventListener('storage', function(e) {
        if (e.key === CART_KEY) {
            updateCartCount();
            renderCartPanel();
        }
    });

    // Add to cart button logic (product detail)
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const addToCartFeedback = document.getElementById('add-to-cart-feedback');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Get product id from URL
            const params = new URLSearchParams(window.location.search);
            const productId = params.get('id');
            // Get selected quantity (default 1)
            let quantity = 1;
            // Optionally, get from a quantity input if you add one
            window.addToCart(Number(productId), quantity);
            if (addToCartFeedback) {
                addToCartFeedback.textContent = '¡Agregado al carrito!';
                addToCartFeedback.style.opacity = '1';
                setTimeout(() => {
                    addToCartFeedback.style.opacity = '0';
                }, 2000);
            }
            updateCartCount();
        });
    }

    // === LATEST PRODUCTS ON INDEX ===
    if (document.getElementById('latest-products-list')) {
        const latestList = document.getElementById('latest-products-list');
        const latest = products.slice(0, 5);
        latestList.innerHTML = latest.map(product => `
            <li class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" />
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </li>
        `).join('');
        latestList.addEventListener('click', function(e) {
            const card = e.target.closest('.product-card');
            if (card && card.dataset.id) {
                window.location.href = `product-detail.html?id=${card.dataset.id}`;
            }
        });
    }

    // Initial render
    populateFilterOptions();
    renderCollectionsMenu();
    renderProductGrid();

    if (collectionsMenu) {
        collectionsMenu.addEventListener('click', function(e) {
            if (e.target.classList.contains('collection-btn')) {
                currentCollection = e.target.getAttribute('data-collection');
                renderCollectionsMenu();
                renderProductGrid();
            }
        });
    }

    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length > 0) {
                closeCartPanel();
                window.location.href = 'checkout.html';
            }
        });
    }
}); 