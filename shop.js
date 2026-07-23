// NOTE: "weight" values below are PLACEHOLDERS (in grams).
// Replace each with the real weight for that piece — price is calculated
// from weight × today's gold rate, so these numbers directly drive the
// price shown to customers.
const PRODUCTS = [
  {
    id: 1,
    name: "Gold Bangles",
    category: "bracelets",
    image: "shop assets/bangles.jpeg",
    metal: "22K Gold",
    weight: 20,
  },

  {
    id: 2,
    name: "Bridal Choker Necklace",
    category: "bridal",
    image: "shop assets/bridalchoker.jpeg",
    metal: "22K Gold",
    weight: 35,
  },

  {
    id: 3,
    name: "Bridal Necklace Set",
    category: "bridal",
    image: "shop assets/bridalsets.jpeg",
    metal: "22K Gold",
    weight: 55,
  },

  {
    id: 4,
    name: "Designer Bracelet",
    category: "bracelets",
    image: "shop assets/designerbracelets.jpeg",
    metal: "22K Gold",
    weight: 15,
  },

  {
    id: 5,
    name: "Diamond Bracelet",
    category: "diamond",
    image: "shop assets/diamondbracelets.jpeg",
    metal: "18K Gold",
    weight: 12,
  },

  {
    id: 6,
    name: "Diamond Engagement Ring",
    category: "diamond",
    image: "shop assets/engagementring.jpeg",
    metal: "18K Gold",
    weight: 6,
  },

  {
    id: 7,
    name: "Gold Ring",
    category: "rings",
    image: "shop assets/goldring.jpeg",
    metal: "22K Gold",
    weight: 8,
  },

  {
    id: 8,
    name: "Gold Necklace",
    category: "necklace",
    image: "shop assets/necklace.jpeg",
    metal: "22K Gold",
    weight: 30,
  },

  {
    id: 9,
    name: "Necklace Set",
    category: "necklace",
    image: "shop assets/necklacesets.jpeg",
    metal: "22K Gold",
    weight: 45,
  },

  {
    id: 10,
    name: "Wedding Bands",
    category: "rings",
    image: "shop assets/weddingbands.jpeg",
    metal: "22K Gold",
    weight: 10,
  },
];

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", filterProducts);

const filterButtons = document.querySelectorAll(".filter-btn");

let currentCategory = "all";

let cart = [];

// Fallback rate (₹ per gram, 24K) used ONLY when the live /api/gold price
// hasn't loaded yet (e.g. running locally without Vercel, or the API call
// failed). Update this occasionally so offline/fallback pricing stays
// realistic — it is NOT connected to the live rate ticker automatically.
const FALLBACK_GOLD24_RATE = 10800;

function getGoldRatePerGram(metal = "22K Gold") {
  const karatMatch = metal.match(/(\d+)\s*K/i);
  const karat = karatMatch ? parseInt(karatMatch[1], 10) : 22;

  const rate24 = window.metalRates
    ? parseFloat(window.metalRates.gold24)
    : FALLBACK_GOLD24_RATE;

  return rate24 * (karat / 24);
}

function calculatePrice(weight, metal = "22K Gold") {
  return Math.round(weight * getGoldRatePerGram(metal));
}

function renderProducts(products) {
  const grid = document.getElementById("productsGrid");
  const countEl = document.getElementById("productCount");

  countEl.textContent = products.length;

  if (products.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:60px 20px;opacity:.7;">No products found.</p>`;
    return;
  }

  grid.innerHTML = products
    .map((p) => {
      const price = calculatePrice(p.weight, p.metal);

      return `
<div class="product-card">
  <div class="product-image">
    <img src="${p.image}" alt="${p.name}">
    <div class="wishlist"><i class="fa-regular fa-heart"></i></div>
  </div>
  <div class="product-info">
    <div class="product-category">${p.category}</div>
    <h3 class="product-title">${p.name}</h3>
    <div class="product-price">₹${price.toLocaleString("en-IN")}</div>
    <div class="product-buttons">
      <button class="add-cart" onclick="addToCart(${p.id})">Add to Cart</button>
      <button class="buy-now" onclick="buyNow(${p.id})">Buy Now</button>
    </div>
  </div>
</div>`;
    })
    .join("");
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    currentCategory = btn.dataset.category;

    filterProducts();
  });
});

document
  .getElementById("sortProducts")
  .addEventListener("change", filterProducts);

function filterProducts() {
  let products = [...PRODUCTS];

  const search = searchInput.value.toLowerCase();

  if (search) {
    products = products.filter((p) => p.name.toLowerCase().includes(search));
  }

  if (currentCategory !== "all") {
    products = products.filter((p) => p.category === currentCategory);
  }

  const sort = document.getElementById("sortProducts").value;

  if (sort === "low") {
    products.sort(
      (a, b) =>
        calculatePrice(a.weight, a.metal) - calculatePrice(b.weight, b.metal),
    );
  }

  if (sort === "high") {
    products.sort(
      (a, b) =>
        calculatePrice(b.weight, b.metal) - calculatePrice(a.weight, a.metal),
    );
  }

  renderProducts(products);
}

function addToCart(id) {
  const product = PRODUCTS.find((p) => p.id === id);

  cart.push(product);

  updateCart();

  openCart();
}

function updateCart() {
  const container = document.getElementById("cartItems");

  const total = document.getElementById("cartTotal");

  const count = document.getElementById("cartCount");

  container.innerHTML = "";

  let grand = 0;

  cart.forEach((item) => {
    const price = calculatePrice(item.weight, item.metal);

    grand += price;

    container.innerHTML += `

<div class="cart-item">

<img src="${item.image}">

<div>

<h4>${item.name}</h4>

<p>

₹${price.toLocaleString("en-IN")}

</p>

</div>

</div>

`;
  });

  if (cart.length === 0) {
    container.innerHTML = `

<div class="empty-cart">

Your cart is empty.

</div>

`;
  }

  count.innerHTML = cart.length;

  total.innerHTML = "₹" + grand.toLocaleString("en-IN");
}

const drawer = document.getElementById("cartDrawer");

const overlay = document.getElementById("cartOverlay");

document.getElementById("cartBtn").onclick = openCart;

document.getElementById("closeCart").onclick = closeCart;

overlay.onclick = closeCart;

function openCart() {
  drawer.classList.add("active");

  overlay.classList.add("active");
}

function closeCart() {
  drawer.classList.remove("active");

  overlay.classList.remove("active");
}

function buyNow(id) {
  const item = PRODUCTS.find((p) => p.id === id);

  const price = calculatePrice(item.weight, item.metal);

  const msg = `Hello Sparkle Jewellers,

I would like to purchase:

${item.name}

Metal: ${item.metal}

Weight: ${item.weight} gm

Estimated Price: ₹${price.toLocaleString("en-IN")}

Please assist me.`;

  window.open(
    `https://wa.me/919674020301?text=${encodeURIComponent(msg)}`,

    "_blank",
  );
}

document.getElementById("checkoutBtn").onclick = function () {
  if (cart.length === 0) {
    alert("Your cart is empty.");

    return;
  }

  let total = 0;

  let msg = "Hello Sparkle Jewellers,%0A%0AI want to purchase:%0A%0A";

  cart.forEach((item) => {
    const price = calculatePrice(item.weight, item.metal);

    total += price;

    msg += `${item.name} - ₹${price.toLocaleString("en-IN")}%0A`;
  });

  msg += `%0ATotal : ₹${total.toLocaleString("en-IN")}`;

  window.open(
    `https://wa.me/919674020301?text=${msg}`,

    "_blank",
  );
};

// Render the product grid on first page load — without this, products only
// appear after the user touches the search box, a filter, or the sort menu.
filterProducts();
