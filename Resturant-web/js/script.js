document.addEventListener("DOMContentLoaded", () => {
  // ===== CART HELPERS =====
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ===== BUY NOW (Order Now) =====
  window.buyNow = function (item) {
    // Save this one product in cart
    const cart = [{ ...item, qty: 1 }];
    saveCart(cart);

    // Redirect to order page
    window.location.href = "order.html";
  };

  // ===== REMOVE FROM CART =====
  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    updateCartUI();
  }

  // ===== RENDER CART UI =====
  function updateCartUI() {
    const cartItemsEl = document.getElementById("cart-items");
    if (!cartItemsEl) return;

    const cart = getCart();
    if (cart.length === 0) {
      cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    } else {
      let total = 0;
      cartItemsEl.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
          <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" width="60" height="60">
            <p>${item.name} x ${item.qty} = ₹${item.price * item.qty}</p>
            <button class="remove-from-cart" data-id="${item.id}">Remove</button>
          </div>
        `;
      }).join("");

      cartItemsEl.innerHTML += `<div class="total-price"><strong>Total: ₹${total}</strong></div>`;

      // Hook up remove buttons
      cartItemsEl.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", function () {
          const id = parseInt(this.dataset.id);
          removeFromCart(id);
        });
      });
    }
  }

  // ===== IF ON ORDER PAGE, SHOW CART =====
  const cartItemsEl = document.getElementById("cart-items");
  if (cartItemsEl) {
    updateCartUI();
  }

  // ===== ORDER FORM =====
  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", e => {
      e.preventDefault();

      const name = orderForm["full-name"].value.trim();
      const phone = orderForm["contact"].value.trim();
      const email = orderForm["email"].value.trim();
      const address = orderForm["address"].value.trim();

      if (!name || !phone || !email || !address) {
        alert("❌ Please fill all fields.");
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        alert("📞 Invalid phone number (10 digits required).");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("📧 Invalid email address.");
        return;
      }

      const cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty. Add items before placing order.");
        return;
      }

      // SUCCESS → clear cart + redirect
      alert("✅ Order placed successfully! Thank you.");
      localStorage.removeItem("cart");
      orderForm.reset();
      updateCartUI();

      // Redirect to home after 2s so user sees alert
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    });
  }
});
