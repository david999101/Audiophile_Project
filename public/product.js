let currentProduct = null;
let selectedQuantity = 1;

let cart = JSON.parse(localStorage.getItem("audiophile_cart")) || [];

const cartIconBtn = document.getElementById("cart-icon-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartCount = document.getElementById("cart-count");
const modalCartCount = document.getElementById("modal-cart-count");
const cartTotalPriceEl = document.getElementById("cart-total-price");
const clearAllBtn = document.getElementById("clear-all-btn");

async function loadProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productKey = urlParams.get("key");

  if (!productKey) return;

  try {
    const response = await fetch(`/api/products/${productKey}`);
    currentProduct = await response.json();

    document.getElementById("prod-main-image").src = currentProduct.image;
    document.getElementById("prod-main-image").alt = currentProduct.name;
    document.getElementById("prod-main-name").textContent = currentProduct.name;
    document.getElementById("prod-main-price").textContent =
      `$ ${currentProduct.price.toLocaleString()}`;

    if (currentProduct.description) {
      document.getElementById("prod-main-description").textContent =
        currentProduct.description;
    }

    document.getElementById("prod-features").textContent =
      currentProduct.features ||
      "Featuring a genuine leather headband and flexible earcups, this provides a seamless fit. Experience unrivalled sound quality and gold standard build quality designed for the passionate music enthusiast.";

    const includesContainer = document.getElementById("prod-includes");
    includesContainer.innerHTML = "";
    const items = currentProduct.includes || [
      { quantity: 1, item: "Main Unit" },
      { quantity: 2, item: "Replacement Earcups" },
      { quantity: 1, item: "User Manual" },
      { quantity: 1, item: "Connection Cable" },
    ];

    items.forEach((boxItem) => {
      const li = document.createElement("li");
      li.style.marginBottom = "12px";
      li.style.fontSize = "15px";
      li.innerHTML = `<span style="color: #D87D4A; font-weight: 700; margin-right: 24px;">${boxItem.quantity}x</span> <span style="opacity: 0.6;">${boxItem.item}</span>`;
      includesContainer.appendChild(li);
    });

    document.getElementById("gallery-img-1").src =
      currentProduct.gallery?.first || currentProduct.image;
    document.getElementById("gallery-img-2").src =
      currentProduct.gallery?.second || currentProduct.image;
    document.getElementById("gallery-img-3").src =
      currentProduct.gallery?.third || currentProduct.image;

    loadSuggestions(currentProduct.category, currentProduct.key);
  } catch (error) {
    console.error("Error loading product details:", error);
  }
}

window.adjustSelectedQty = function (direction) {
  selectedQuantity += direction;
  if (selectedQuantity < 1) selectedQuantity = 1;
  document.getElementById("selected-qty-val").textContent = selectedQuantity;
};

window.addProductToCart = function () {
  if (!currentProduct) return;

  const existing = cart.find((item) => item.id === currentProduct._id);

  if (existing) {
    existing.quantity += selectedQuantity;
  } else {
    cart.push({
      id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      quantity: selectedQuantity,
    });
  }

  updateCartUI();
  cartModal.classList.add("show");
  selectedQuantity = 1;
  document.getElementById("selected-qty-val").textContent = 1;
};

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let totalItems = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="text-align:center; opacity:0.5; padding: 20px 0;">Your cart is empty</p>';
  } else {
    cart.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const itemRow = document.createElement("div");
      itemRow.className = "cart-item";
      itemRow.innerHTML = `
                <div class="item-info">
                    <img src="${item.image}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;">
                    <div>
                        <p class="item-name">${item.name}</p>
                        <p class="item-price">$ ${item.price.toLocaleString()}</p>
                    </div>
                </div>
                <div class="quantity-selector">
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                </div>
            `;
      cartItemsContainer.appendChild(itemRow);
    });
  }

  if (cartCount) cartCount.textContent = totalItems;
  if (modalCartCount) modalCartCount.textContent = totalItems;
  cartTotalPriceEl.textContent = `$ ${totalPrice.toLocaleString()}`;
  localStorage.setItem("audiophile_cart", JSON.stringify(cart));
}

window.changeQuantity = function (id, dir) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity += dir;
    if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id);
  }
  updateCartUI();
};

async function loadSuggestions(category, currentKey) {
  const container = document.getElementById("suggestions-container");
  if (!container) return;

  try {
    const response = await fetch("/api/products");
    const allProducts = await response.json();

    const filtered = allProducts
      .filter((p) => p.key !== currentKey)
      .slice(0, 3);

    container.innerHTML = "";
    filtered.forEach((p) => {
      const div = document.createElement("div");
      div.style.flex = "1";
      div.style.textAlign = "center";
      div.innerHTML = `
                <div style="background: #F1F1F1; padding: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center; height: 240px; margin-bottom: 32px;">
                    <img src="${p.image}" alt="${p.name}" style="max-height: 100%; object-fit: contain;">
                </div>
                <h4 style="font-size: 24px; margin-bottom: 32px; font-weight: 700; text-transform: uppercase;">${p.name.trim()}</h4>
                <a href="/product.html?key=${p.key}" class="btn btn-primary" style="display: inline-block; text-decoration: none; text-align: center;">SEE PRODUCT</a>
            `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading suggestions:", error);
  }
}

clearAllBtn.addEventListener("click", () => {
  cart = [];
  updateCartUI();
});
cartIconBtn.addEventListener("click", () => cartModal.classList.toggle("show"));
window.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.classList.remove("show");
});

loadProductDetails();
updateCartUI();
