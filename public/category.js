const productsList = document.getElementById("products-list");
const categoryTitle = document.getElementById("category-title");
const cartIconBtn = document.getElementById("cart-icon-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items-container");
const modalCartCount = document.getElementById("modal-cart-count");
const cartCount = document.getElementById("cart-count");
const cartTotalPriceEl = document.getElementById("cart-total-price");
const clearAllBtn = document.getElementById("clear-all-btn");

let localProducts = [];
let cart = JSON.parse(localStorage.getItem("audiophile_cart")) || [];

const urlParams = new URLSearchParams(window.location.search);
const categoryType = urlParams.get("type") || "headphones";
categoryTitle.textContent = categoryType.toUpperCase();

async function fetchCategoryProducts() {
  try {
    const response = await fetch(`/api/products/category/${categoryType}`);
    localProducts = await response.json();
    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function renderProducts() {
  productsList.innerHTML = "";
  localProducts.forEach((prod) => {
    const prodCard = document.createElement("div");
    prodCard.className = "category-product-card";
    prodCard.innerHTML = `
            <div class="prod-img-box">
                <img src="${prod.image}" alt="${prod.name}">
            </div>
            <div class="prod-info-box">
                <span class="new-product-tag">NEW PRODUCT</span>
                <h2>${prod.name}</h2>
                <p>${prod.description}</p>
                <p class="prod-price">$ ${prod.price.toLocaleString()}</p>
                <button class="btn btn-primary" onclick="window.location.href='/product.html?key=${prod.key}'">SEE PRODUCT</button>
            </div>
        `;
    productsList.appendChild(prodCard);
  });
}

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

  cartCount.textContent = totalItems;
  modalCartCount.textContent = totalItems;
  cartTotalPriceEl.textContent = `$ ${totalPrice.toLocaleString()}`;
  localStorage.setItem("audiophile_cart", JSON.stringify(cart));
}

window.addToCart = function (prodId) {
  const product = localProducts.find((p) => p._id === prodId);
  if (!product) return;

  const existing = cart.find((item) => item.id === prodId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }
  updateCartUI();
  cartModal.classList.add("show");
};

window.changeQuantity = function (id, dir) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity += dir;
    if (item.quantity <= 0) cart = cart.filter((i) => i.id !== id);
  }
  updateCartUI();
};

clearAllBtn.addEventListener("click", () => {
  cart = [];
  updateCartUI();
});
cartIconBtn.addEventListener("click", () => cartModal.classList.toggle("show"));
window.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.classList.remove("show");
});

fetchCategoryProducts();
updateCartUI();
