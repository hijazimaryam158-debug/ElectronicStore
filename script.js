"use strict";


var products = [
    {
        id: 1,
        name: "UltraBook Pro X",
        category: "laptops",
        price: 999,
        oldPrice: 1199,
        image: "images/laptop1.jpg",
        emoji: "💻",
        description: "A powerful laptop for work, study and everyday tasks.",
        rating: 4.8
    },
    {
        id: 2,
        name: "MacBook Air M2",
        category: "laptops",
        price: 1099,
        oldPrice: 1299,
        image: "images/laptop2.jpg",
        emoji: "💻",
        description: "A lightweight laptop with excellent performance.",
        rating: 4.9
    },
    {
        id: 3,
        name: "Galaxy S24",
        category: "phones",
        price: 799,
        oldPrice: 899,
        image: "images/phone1.jpg",
        emoji: "📱",
        description: "A modern smartphone with a beautiful display.",
        rating: 4.7
    },
    {
        id: 4,
        name: "iPhone 15 Pro",
        category: "phones",
        price: 999,
        oldPrice: 1099,
        image: "images/phone2.jpg",
        emoji: "📱",
        description: "A premium smartphone with advanced features.",
        rating: 4.9
    },
    {
        id: 5,
        name: "Wireless Headphones",
        category: "accessories",
        price: 89,
        oldPrice: 119,
        image: "images/headphone.jpg",
        emoji: "🎧",
        description: "Comfortable wireless headphones with clear sound.",
        rating: 4.5
    },
    {
        id: 6,
        name: "Smart Watch",
        category: "accessories",
        price: 149,
        oldPrice: 179,
        image: "images/smartwatch.jpg",
        emoji: "⌚",
        description: "Track your activity and stay connected.",
        rating: 4.4
    },
    {
        id: 7,
        name: "Gaming Mouse",
        category: "accessories",
        price: 49,
        oldPrice: 65,
        image: "images/mouse.jpg",
        emoji: "🖱️",
        description: "A responsive mouse designed for gaming.",
        rating: 4.6
    },
    {
        id: 8,
        name: "Mechanical Keyboard",
        category: "accessories",
        price: 79,
        oldPrice: 99,
        image: "images/keyboard.jpg",
        emoji: "⌨️",
        description: "A mechanical keyboard with comfortable keys.",
        rating: 4.7
    },
    {
        id: 9,
        name: "PlayStation 5",
        category: "gaming",
        price: 499,
        oldPrice: 549,
        image: "images/ps5.jpg",
        emoji: "🎮",
        description: "Enjoy your favorite games with powerful performance.",
        rating: 4.9
    },
    {
        id: 10,
        name: "Xbox Wireless Controller",
        category: "gaming",
        price: 59,
        oldPrice: 74,
        image: "images/controller.jpg",
        emoji: "🎮",
        description: "A comfortable controller for your gaming sessions.",
        rating: 4.6
    },
    {
        id: 11,
        name: "Gaming Headset",
        category: "gaming",
        price: 69,
        oldPrice: 89,
        image: "images/headphone2.jpg",
        emoji: "🎧",
        description: "A gaming headset with immersive sound.",
        rating: 4.5
    },
    {
        id: 12,
        name: "Nintendo Switch",
        category: "gaming",
        price: 299,
        oldPrice: 329,
        image: "images/nintendo.jpg",
        emoji: "🎮",
        description: "Enjoy gaming at home or while travelling.",
        rating: 4.8
    }
];



let cart = JSON.parse(localStorage.getItem("cart")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

let selectedCategory = "all";
let currentProduct = null;
let authMode = "login";

if (!users.some(function(user) {
    return user.email === "admin@gmail.com";
})) {
    users.push({
        name: "Admin",
        email: "admin@gmail.com",
        password: "123456"
    });

    localStorage.setItem("users", JSON.stringify(users));
}


function imageHTML(product, extraClass = "") {
    return `
        <img
            class="${extraClass}"
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
            onerror="this.onerror=null;this.style.display='none';this.insertAdjacentHTML('afterend','<span class=product-emoji>${product.emoji}</span>')"
        >
    `;
}


function displayProducts(productList) {
    var productGrid = document.getElementById("productGrid");
    var noProducts = document.getElementById("noProducts");

    productGrid.innerHTML = "";

    if (productList.length === 0) {
        noProducts.classList.remove("hidden");
        return;
    }

    noProducts.classList.add("hidden");

    productList.forEach(function(product) {
        var isFavorite = wishlist.some(function(item) {
            return item.id === product.id;
        });

        var discount = Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100
        );

        productGrid.innerHTML += `
            <article class="product-card">
                <div class="product-visual">
                    ${imageHTML(product)}
                    <button
                        class="wishlist-btn ${isFavorite ? "active" : ""}"
                        data-wishlist="${product.id}"
                        aria-label="Add to wishlist"
                    >
                        <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
                    </button>
                </div>

                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="stars">${getStars(product.rating)} <small>${product.rating}</small></div>

                    <div class="product-price">
                        <strong>$${product.price.toFixed(2)}</strong>
                        <span class="old-price">$${product.oldPrice.toFixed(2)}</span>
                        <span class="discount">-${discount}%</span>
                    </div>

                    <div class="product-actions">
                        <button class="btn btn-primary add-cart-btn" data-id="${product.id}">
                            <i class="fa-solid fa-cart-plus"></i> Add
                        </button>
                        <button class="btn btn-outline details-btn" data-id="${product.id}">
                            Details
                        </button>
                    </div>
                </div>
            </article>
        `;
    });
}


function getStars(rating) {
    var fullStars = Math.floor(rating);
    var emptyStars = 5 - fullStars;

    return "★".repeat(fullStars) + "☆".repeat(emptyStars);
}


function displayFeaturedProduct() {
    var featuredProduct = products[0];
    var featuredCard = document.getElementById("featuredCard");

    featuredCard.innerHTML = `
        <div class="featured-image">
            ${imageHTML(featuredProduct)}
        </div>
        <p>Featured Product</p>
        <h2>${featuredProduct.name}</h2>
        <p>
            $${featuredProduct.price.toFixed(2)}
            <del>$${featuredProduct.oldPrice.toFixed(2)}</del>
        </p>
        <button class="btn btn-light add-cart-btn" data-id="${featuredProduct.id}">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
    `;
}


function searchProducts() {
    sortProducts(getVisibleProducts());
}


function sortProducts(productList) {
    var sortValue = document.getElementById("sortSelect").value;

    if (sortValue === "low-high") {
        productList.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (sortValue === "high-low") {
        productList.sort(function(a, b) {
            return b.price - a.price;
        });
    } else if (sortValue === "name") {
        productList.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    displayProducts(productList);
}


document.getElementById("categoryButtons").addEventListener("click", function(event) {
    var button = event.target.closest(".category-btn");

    if (!button) {
        return;
    }

    selectedCategory = button.getAttribute("data-category");

    document.querySelectorAll(".category-btn").forEach(function(categoryButton) {
        categoryButton.classList.remove("active");
    });

    button.classList.add("active");

    searchProducts();
});


function openProductDetails(productId) {
    currentProduct = products.find(function(product) {
        return product.id === Number(productId);
    });

    if (!currentProduct) {
        return;
    }

    var productDetails = document.getElementById("productDetails");

    productDetails.innerHTML = `
        <div class="modal-product-image">
            ${imageHTML(currentProduct)}
        </div>

        <div class="modal-product-info">
            <span class="product-category">${currentProduct.category}</span>
            <h2>${currentProduct.name}</h2>
            <div class="stars">${getStars(currentProduct.rating)} ${currentProduct.rating}</div>
            <p>${currentProduct.description}</p>

            <div class="product-price">
                <strong>$${currentProduct.price.toFixed(2)}</strong>
                <span class="old-price">$${currentProduct.oldPrice.toFixed(2)}</span>
            </div>

            <button class="btn btn-primary btn-full" id="modalAddCart">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `;

    document.getElementById("productModal").classList.remove("hidden");

    document.getElementById("modalAddCart").addEventListener("click", function() {
        addToCart(currentProduct.id);
    });
}

function closeProductDetails() {
    document.getElementById("productModal").classList.add("hidden");
}


function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
    if (!currentUser) {
        alert("Please log in before adding products to your cart.");
        openAuthModal("login");
        return;
    }

    var product = products.find(function(item) {
        return item.id === Number(productId);
    });

    if (!product) {
        return;
    }

    var existingItem = cart.find(function(item) {
        return item.id === product.id;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();
    displayCart();

    alert(product.name + " was added to your cart.");

    closeProductDetails();
}

function displayCart() {
    var cartItems = document.getElementById("cartItems");
    var cartCount = document.getElementById("cartCount");
    var cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function(cartItem) {
        var product = products.find(function(item) {
            return item.id === cartItem.id;
        });

        if (!product) {
            return;
        }

        var itemTotal = product.price * cartItem.quantity;

        total += itemTotal;
        totalQuantity += cartItem.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                ${imageHTML(product)}
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)} each</p>

                    <div class="quantity-controls">
                        <button class="quantity-btn" data-id="${product.id}" data-change="-1">-</button>
                        <span>${cartItem.quantity}</span>
                        <button class="quantity-btn" data-id="${product.id}" data-change="1">+</button>
                    </div>
                </div>

                <button class="remove-item" data-id="${product.id}" aria-label="Remove product">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
    }

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = "$" + total.toFixed(2);
}


function changeQuantity(productId, change) {
    var item = cart.find(function(cartItem) {
        return cartItem.id === Number(productId);
    });

    if (!item) {
        return;
    }

    item.quantity += Number(change);

    if (item.quantity <= 0) {
        cart = cart.filter(function(cartItem) {
            return cartItem.id !== Number(productId);
        });
    }

    saveCart();
    displayCart();
}


function removeFromCart(productId) {
    cart = cart.filter(function(item) {
        return item.id !== Number(productId);
    });

    saveCart();
    displayCart();
}


function clearCart() {
    if (cart.length === 0) {
        alert("Your cart is already empty.");
        return;
    }

    var answer = confirm("Are you sure you want to clear your cart?");

    if (answer) {
        cart = [];
        saveCart();
        displayCart();
        alert("Your cart has been cleared.");
    }
}


function checkout() {
    if (!currentUser) {
        alert("Please log in before checking out.");
        openAuthModal("login");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    var answer = confirm("Are you sure you want to place this order?");

    if (answer) {
        cart = [];
        saveCart();
        displayCart();
        closeCart();

        alert("Thank you for your order, " + currentUser.name + "!");
    }
}


function openCart() {
    document.getElementById("cartSidebar").classList.add("open");
    document.getElementById("overlay").classList.remove("hidden");
}

function closeCart() {
    document.getElementById("cartSidebar").classList.remove("open");
    document.getElementById("overlay").classList.add("hidden");
}


function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(productId) {
    var product = products.find(function(item) {
        return item.id === Number(productId);
    });

    if (!product) {
        return;
    }

    var existingItem = wishlist.find(function(item) {
        return item.id === product.id;
    });

    if (existingItem) {
        wishlist = wishlist.filter(function(item) {
            return item.id !== product.id;
        });

        alert(product.name + " was removed from your wishlist.");
    } else {
        wishlist.push(product);
        alert(product.name + " was added to your wishlist.");
    }

    saveWishlist();
    displayProducts(getVisibleProducts());
    displayWishlist();
}

function getVisibleProducts() {
    var searchText = document.getElementById("searchInput").value.trim().toLowerCase();

    return products.filter(function(product) {
        var matchesCategory =
            selectedCategory === "all" || product.category === selectedCategory;

        var matchesSearch =
            ([product.name, product.category, product.description].join(" ").toLowerCase().includes(searchText));

        return matchesCategory && matchesSearch;
    });
}

function displayWishlist() {
    var wishlistGrid = document.getElementById("wishlistGrid");
    var emptyWishlist = document.getElementById("emptyWishlist");

    wishlistGrid.innerHTML = "";

    if (wishlist.length === 0) {
        emptyWishlist.classList.remove("hidden");
        return;
    }

    emptyWishlist.classList.add("hidden");

    wishlist.forEach(function(product) {
        wishlistGrid.innerHTML += `
            <article class="product-card">
                <div class="product-visual">
                    ${imageHTML(product)}
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3>${product.name}</h3>
                    <div class="product-price">
                        <strong>$${product.price.toFixed(2)}</strong>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-cart-btn" data-id="${product.id}">
                            Add to Cart
                        </button>
                        <button class="btn btn-outline remove-wishlist-btn" data-id="${product.id}">
                            Remove
                        </button>
                    </div>
                </div>
            </article>
        `;
    });
}


function openAuthModal(mode) {
    authMode = mode;

    var authModal = document.getElementById("authModal");
    var authTitle = document.getElementById("authTitle");
    var authDescription = document.getElementById("authDescription");
    var authNameGroup = document.getElementById("authNameGroup");
    var authName = document.getElementById("authName");
    var authSubmit = document.getElementById("authSubmit");
    var authSwitchText = document.getElementById("authSwitchText");
    var authSwitchBtn = document.getElementById("authSwitchBtn");
    var authError = document.getElementById("authError");

    document.getElementById("authForm").reset();
    authError.classList.add("hidden");

    if (mode === "signup") {
        authTitle.textContent = "Create Account";
        authDescription.textContent = "Create an account to start shopping.";
        authNameGroup.classList.remove("hidden");
        authName.required = true;
        authSubmit.textContent = "Sign Up";
        authSwitchText.firstChild.textContent = "Already have an account? ";
        authSwitchBtn.textContent = "Login";
    } else {
        authTitle.textContent = "Login";
        authDescription.textContent = "Sign in to continue shopping.";
        authNameGroup.classList.add("hidden");
        authName.required = false;
        authSubmit.textContent = "Login";
        authSwitchText.firstChild.textContent = "Don't have an account? ";
        authSwitchBtn.textContent = "Sign Up";
    }

    authModal.classList.remove("hidden");
}

function closeAuthModal() {
    document.getElementById("authModal").classList.add("hidden");
}


function signup(name, email, password) {
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (email.includes("@") === false) {
        alert("Please enter a valid email address.");
        return;
    }

    if (password.length < 6) {
        alert("Your password must contain at least 6 characters.");
        return;
    }

    var userExists = users.some(function(user) {
        return user.email === email;
    });

    if (userExists) {
        alert("An account with this email already exists.");
        return;
    }

    users.push({
        name: name,
        email: email,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Your account has been created successfully. You can now log in.");

    openAuthModal("login");
    document.getElementById("authEmail").value = email;
}


function login(email, password) {
    email = email.trim().toLowerCase();
    password = password.trim();

    var user = users.find(function(item) {
        return item.email === email && item.password === password;
    });

    if (!user) {
        var authError = document.getElementById("authError");
        authError.textContent = "Incorrect email or password.";
        authError.classList.remove("hidden");
        return;
    }

    currentUser = {
        name: user.name,
        email: user.email
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    closeAuthModal();
    updateUserInterface();

    alert("Welcome back, " + currentUser.name + "!");
}


function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");

    updateUserInterface();

    alert("You have logged out successfully.");
}


function updateUserInterface() {
    var loginBtn = document.getElementById("loginBtn");
    var logoutBtn = document.getElementById("logoutBtn");
    var userGreeting = document.getElementById("userGreeting");

    if (currentUser) {
        loginBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");
        userGreeting.classList.remove("hidden");
        userGreeting.textContent = "Hi, " + currentUser.name;
    } else {
        loginBtn.classList.remove("hidden");
        logoutBtn.classList.add("hidden");
        userGreeting.classList.add("hidden");
        userGreeting.textContent = "";
    }
}


function updateThemeButton() {
    var themeBtn = document.getElementById("themeBtn");

    if (document.body.classList.contains("dark-mode")) {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));

    updateThemeButton();
}

function loadTheme() {
    var savedTheme = localStorage.getItem("darkMode");

    document.body.classList.toggle("dark-mode", savedTheme === "true");

    updateThemeButton();
}


document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var name = document.getElementById("contactName").value.trim();
    var email = document.getElementById("contactEmail").value.trim();
    var message = document.getElementById("contactMessage").value.trim();

    if (name === "" || email === "" || message === "") {
        alert("Please fill in all contact form fields.");
    } else if (email.includes("@") === false) {
        alert("Please enter a valid email address.");
    } else {
        alert("Message sent successfully!");
        document.getElementById("contactForm").reset();
    }
});


document.getElementById("newsletterForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var email = document.getElementById("newsletterEmail").value.trim();

    if (email === "") {
        alert("Please enter your email address.");
    } else if (email.includes("@") === false) {
        alert("Please enter a valid email address.");
    } else {
        alert("Thank you for subscribing!");
        document.getElementById("newsletterForm").reset();
    }
});


function startCountdown() {
    var endDate = new Date();

    endDate.setDate(endDate.getDate() + 7);

    function updateCountdown() {
        var now = new Date().getTime();
        var distance = endDate.getTime() - now;

        if (distance <= 0) {
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
            return;
        }

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        var minutes = Math.floor((distance / (1000 * 60)) % 60);
        var seconds = Math.floor((distance / 1000) % 60);

        document.getElementById("days").textContent = String(days).padStart(2, "0");
        document.getElementById("hours").textContent = String(hours).padStart(2, "0");
        document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
        document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}


function closeMobileMenu() {
    document.getElementById("navLinks").classList.remove("open");
}

document.getElementById("menuBtn").addEventListener("click", function() {
    document.getElementById("navLinks").classList.toggle("open");
});

document.querySelectorAll("#navLinks a").forEach(function(link) {
    link.addEventListener("click", closeMobileMenu);
});



document.addEventListener("click", function(event) {
    var addButton = event.target.closest(".add-cart-btn");

    if (addButton) {
        addToCart(addButton.getAttribute("data-id"));
        return;
    }

    var detailsButton = event.target.closest(".details-btn");

    if (detailsButton) {
        openProductDetails(detailsButton.getAttribute("data-id"));
        return;
    }

    var wishlistButton = event.target.closest(".wishlist-btn");

    if (wishlistButton) {
        toggleWishlist(wishlistButton.getAttribute("data-wishlist"));
        return;
    }

    var quantityButton = event.target.closest(".quantity-btn");

    if (quantityButton) {
        changeQuantity(
            quantityButton.getAttribute("data-id"),
            quantityButton.getAttribute("data-change")
        );
        return;
    }

    var removeButton = event.target.closest(".remove-item");

    if (removeButton) {
        removeFromCart(removeButton.getAttribute("data-id"));
        return;
    }

    var removeWishlistButton = event.target.closest(".remove-wishlist-btn");

    if (removeWishlistButton) {
        wishlist = wishlist.filter(function(item) {
            return item.id !== Number(removeWishlistButton.getAttribute("data-id"));
        });

        saveWishlist();
        displayWishlist();
        displayProducts(getVisibleProducts());

        alert("Product removed from your wishlist.");
    }
});


document.querySelectorAll("[data-footer-category]").forEach(function(link) {
    link.addEventListener("click", function() {
        selectedCategory = link.getAttribute("data-footer-category");

        document.querySelectorAll(".category-btn").forEach(function(button) {
            button.classList.remove("active");

            if (button.getAttribute("data-category") === selectedCategory) {
                button.classList.add("active");
            }
        });

        searchProducts();
    });
});


document.getElementById("authForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var name = document.getElementById("authName").value;
    var email = document.getElementById("authEmail").value;
    var password = document.getElementById("authPassword").value;

    if (authMode === "signup") {
        signup(name, email, password);
    } else {
        login(email, password);
    }
});

document.getElementById("authSwitchBtn").addEventListener("click", function() {
    if (authMode === "login") {
        openAuthModal("signup");
    } else {
        openAuthModal("login");
    }
});


document.getElementById("loginBtn").addEventListener("click", function() {
    openAuthModal("login");
});

document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("clearCartBtn").addEventListener("click", clearCart);
document.getElementById("checkoutBtn").addEventListener("click", checkout);
document.getElementById("themeBtn").addEventListener("click", toggleDarkMode);
document.getElementById("closeProductModal").addEventListener("click", closeProductDetails);
document.getElementById("closeAuthModal").addEventListener("click", closeAuthModal);


document.getElementById("productModal").addEventListener("click", function(event) {
    if (event.target === this) {
        closeProductDetails();
    }
});

document.getElementById("authModal").addEventListener("click", function(event) {
    if (event.target === this) {
        closeAuthModal();
    }
});


document.getElementById("searchInput").addEventListener("keyup", searchProducts);

document.getElementById("sortSelect").addEventListener("change", searchProducts);


document.getElementById("year").textContent = new Date().getFullYear();


function initializeWebsite() {
    loadTheme();
    displayProducts(products);
    displayFeaturedProduct();
    displayCart();
    displayWishlist();
    updateUserInterface();
    startCountdown();
}

initializeWebsite();
