// ==========================================
// HEADER SCROLL EFFECT
// ==========================================

const header = document.getElementById("siteHeader");
const rateBar = document.getElementById("rateBar");

const onScroll = () => {
  const scrolled = window.scrollY > 40;

  header.classList.toggle("scrolled", scrolled);
  header.classList.toggle("docked", scrolled);

  if (rateBar) {
    rateBar.classList.toggle("hide", scrolled);
  }
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


// ==========================================
// WHATSAPP ENQUIRY FORM
// ==========================================

const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {
  enquiryForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = document.getElementById("fName").value.trim();
    const phone = document.getElementById("fPhone").value.trim();
    const interest = document.getElementById("fInterest").value;
    const message = document.getElementById("fMessage").value.trim();

    const lines = [
      `Hi Sparkle Jewellers, I'm ${name}.`,
      `Interested in: ${interest}`,
      message ? `Message: ${message}` : null,
      phone ? `My number: ${phone}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));

    window.open(
      `https://wa.me/919674020301?text=${text}`,
      "_blank"
    );
  });
}


// ==========================================
// MOBILE MENU
// ==========================================

const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle) {

  navToggle.addEventListener("click", () => {

    const open = mainNav.classList.toggle("nav-open");

    navToggle.setAttribute(
      "aria-expanded",
      open ? "true" : "false"
    );

  });

  mainNav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("nav-open");

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}


// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================

const revealTargets = document.querySelectorAll(
  ".section-head, .coll-card, .craft-text, .craft-media, .g-item, .review-card, .showroom-card, .visit-form, .visit-map-col"
);

revealTargets.forEach((el) => {
  el.classList.add("reveal");
});

const observer = new IntersectionObserver(

  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);

      }

    });

  },

  {
    threshold: 0.15,
  }

);

revealTargets.forEach((el) => {
  observer.observe(el);
});


// ==========================================
// LIVE GOLD & SILVER PRICES
// Powered by Vercel API
// (Part 2 starts here)
// ==========================================

// ==========================================
// LIVE GOLD & SILVER PRICES
// Fetches data from your Vercel API
// ==========================================

const GOLD_FACTOR = 1.175;
const SILVER_FACTOR = 1.23;

async function fetchMetalPrices() {

    const response = await fetch("/api/gold");

    if (!response.ok) {
        throw new Error("Unable to fetch metal prices.");
    }

    const data = await response.json();

    const gold = data.gold;
    const silver = data.silver;
    const usdToInr = data.usdToInr;

    const baseGold24 =
        (gold.price * usdToInr) / 31.1034768;

    const baseSilver =
        (silver.price * usdToInr) / 31.1034768;

    const gold24 = baseGold24 * GOLD_FACTOR;
    const gold22 = gold24 * (22 / 24);
    const silverGram = baseSilver * SILVER_FACTOR;

    return {

        gold22: gold22.toFixed(0),

        gold24: gold24.toFixed(0),

        silver: silverGram.toFixed(2),

        updated: new Date().toLocaleString("en-IN")

    };

}

// ==========================================
// DISPLAY PRICES
// ==========================================

function displayPrices(data) {

    // Make today's rate available to shop.js (product pricing) too.
    window.metalRates = data;

    document.getElementById("gold22Price").textContent =
        `₹${data.gold22}/g`;

    document.getElementById("gold24Price").textContent =
        `₹${data.gold24}/g`;

    document.getElementById("silverPrice").textContent =
        `₹${data.silver}/g`;

    document.getElementById("lastUpdated").textContent =
        `Updated: ${data.updated}`;

}


// ==========================================
// UPDATE PRICES
// ==========================================

async function updateMetalPrices() {

    try {

        const latest = await fetchMetalPrices();

        displayPrices(latest);

        // If we're on the shop page, refresh product prices now that the
        // live gold rate has arrived (it loads a moment after page render).
        if (typeof filterProducts === "function") {
            filterProducts();
        }

    } catch (error) {

        console.error("Price Update Error:", error);

        document.getElementById("gold22Price").textContent = "--";
        document.getElementById("gold24Price").textContent = "--";
        document.getElementById("silverPrice").textContent = "--";

        document.getElementById("lastUpdated").textContent =
            "Unable to fetch live prices";

    }

}


// ==========================================
// INITIAL LOAD
// ==========================================

updateMetalPrices();