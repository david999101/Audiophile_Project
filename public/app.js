let productsDb = {};

const cartIcon = document.querySelector(".cart-icon");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartCountEl = document.getElementById("cart-count");
const cartTotalPriceEl = document.getElementById("cart-total-price");
const clearAllBtn = document.getElementById("clear-all-btn");

let cart = JSON.parse(localStorage.getItem("audiophile_cart")) || [];

async function fetchProductsFromDb() {
  try {
    const response = await fetch("/api/products");
    const productsArray = await response.json();

    productsArray.forEach((prod) => {
      productsDb[prod.key] = {
        id: prod._id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
      };
    });

    console.log("Products loaded from MongoDB:", productsDb);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
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
        <img src="${item.image}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
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

  cartCountEl.textContent = totalItems;
  cartTotalPriceEl.textContent = `$ ${totalPrice.toLocaleString()}`;
  localStorage.setItem("audiophile_cart", JSON.stringify(cart));
}

function addToCart(productKey) {
  const product = productsDb[productKey];
  if (!product) return;

  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  cartModal.classList.add("show");
}

window.changeQuantity = function (productId, direction) {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity += direction;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
  }
  updateCartUI();
};

clearAllBtn.addEventListener("click", () => {
  cart = [];
  updateCartUI();
});

cartIcon.addEventListener("click", () => {
  cartModal.classList.toggle("show");
});

window.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.classList.remove("show");
  }
});

async function initApp() {
  await fetchProductsFromDb();
  updateCartUI();
}

initApp();
