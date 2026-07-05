const summaryItemsContainer = document.getElementById(
  "summary-items-container",
);
const summaryTotalEl = document.getElementById("summary-total");
const summaryGrandTotalEl = document.getElementById("summary-grand-total");
const checkoutForm = document.getElementById("checkout-form");

let cart = JSON.parse(localStorage.getItem("audiophile_cart")) || [];

function renderSummary() {
  summaryItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    summaryItemsContainer.innerHTML =
      '<p style="opacity:0.5;">Your cart is empty</p>';
    return;
  }

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
            <div class="item-info">
                <img src="${item.image}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;">
                <div>
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">$ ${item.price.toLocaleString()}</p>
                </div>
            </div>
            <span style="opacity:0.5; font-weight:700;">x${item.quantity}</span>
        `;
    summaryItemsContainer.appendChild(row);
  });

  const shipping = 50;
  const grandTotal = total + shipping;

  summaryTotalEl.textContent = `$ ${total.toLocaleString()}`;
  summaryGrandTotalEl.textContent = `$ ${grandTotal.toLocaleString()}`;
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  if (cart.length === 0) {
    alert("თქვენი კალათა ცარიელია!");
    return;
  }

  const paymentMethodEl = document.querySelector(
    'input[name="payment"]:checked',
  );
  const paymentMethod = paymentMethodEl ? paymentMethodEl.value : "cash";

  const orderData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    zip: document.getElementById("zip").value,
    city: document.getElementById("city").value,
    country: document.getElementById("country").value,
    paymentMethod: paymentMethod,
    items: cart.map((item) => ({
      id: item.id || item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalPrice:
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 50,
  };

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json().catch(() => ({}));

    if (response.status === 400 && result.errors) {
      showValidationErrors(result.errors);
    } else if (result.success || response.ok) {
      localStorage.removeItem("audiophile_cart");

      alert("Order was placed successfully");
      window.location.href = "/";
    } else {
      alert("Order Error: " + (result.message || "unknown error"));
    }
  } catch (error) {
    console.error("Error submitting order:", error);
    alert("server connection fail or wrong input.");
  }
});

function showValidationErrors(errors) {
  for (const field in errors) {
    const inputEl = document.getElementById(field);

    if (inputEl) {
      inputEl.classList.add("input-error");

      const errorSpan = document.createElement("span");
      errorSpan.className = "error-text";
      errorSpan.style.color = "#CD2C2C";
      errorSpan.style.fontSize = "12px";
      errorSpan.style.display = "block";
      errorSpan.style.marginTop = "4px";
      errorSpan.style.fontWeight = "500";
      errorSpan.textContent = errors[field][0];

      inputEl.parentNode.appendChild(errorSpan);
    }
  }
}

function clearErrors() {
  document.querySelectorAll(".error-text").forEach((el) => el.remove());
  document
    .querySelectorAll("input")
    .forEach((el) => el.classList.remove("input-error"));
}

renderSummary();
