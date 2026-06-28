/* ============================================================
   THE GILDED CASK — storefront logic
   Replace BRAND_NAME and PAYSTACK_PUBLIC_KEY before going live.
   ============================================================ */

const BRAND_NAME = "The Gilded Cask";

// Get your real key from https://dashboard.paystack.com/#/settings/developer
const PAYSTACK_PUBLIC_KEY = "pk_test_REPLACE_WITH_YOUR_PAYSTACK_PUBLIC_KEY";

const CATEGORIES = [
  { id: "whisky", name: "Whisky", bottle: "spirit" },
  { id: "cognac", name: "Cognac & Brandy", bottle: "spirit" },
  { id: "champagne", name: "Champagne & Wine", bottle: "wine" },
  { id: "gin-vodka", name: "Gin & Vodka", bottle: "spirit" },
  { id: "gifts", name: "Gifts & Sets", bottle: "gift" },
];

// Illustrative catalog. Prices are placeholder NGN figures — update with
// your real, duty-inclusive pricing before launch. Descriptions are
// written from scratch, not copied from any retailer.
const PRODUCTS = [
  { id:"p1", cat:"whisky", name:"Glenfiddich 12 Year Old", origin:"Speyside, Scotland", abv:"40%", price:45000, bottle:"spirit",
    desc:"A gentle, fruity Speyside malt with notes of pear and a soft oak finish, matured in American and European oak." },
  { id:"p2", cat:"whisky", name:"The Macallan 18 Year Old", origin:"Speyside, Scotland", abv:"43%", price:310000, bottle:"spirit",
    desc:"Rich dried fruit, ginger and dark chocolate, from extended ageing in sherry-seasoned oak casks." },
  { id:"p3", cat:"whisky", name:"Lagavulin 16 Year Old", origin:"Islay, Scotland", abv:"43%", price:125000, bottle:"spirit",
    desc:"Deep, smoky and peated, with a long, warming finish — a defining Islay single malt." },
  { id:"p4", cat:"whisky", name:"Johnnie Walker Blue Label", origin:"Scotland", abv:"40%", price:185000, bottle:"spirit",
    desc:"A refined blend of rare aged whiskies, smooth with honeyed sweetness and a whisper of smoke." },
  { id:"p5", cat:"whisky", name:"Jameson Irish Whiskey", origin:"Ireland", abv:"40%", price:32000, bottle:"spirit",
    desc:"Triple-distilled for a light, smooth character with notes of vanilla and toasted wood." },
  { id:"p6", cat:"cognac", name:"Hennessy V.S", origin:"Cognac, France", abv:"40%", price:58000, bottle:"spirit",
    desc:"A bold, versatile cognac with bright fruit notes and a distinct oaky character." },
  { id:"p7", cat:"cognac", name:"Hennessy X.O", origin:"Cognac, France", abv:"40%", price:265000, bottle:"spirit",
    desc:"Layered and complex, with notes of dried fruit, spice and rancio from decades-long ageing." },
  { id:"p8", cat:"cognac", name:"Rémy Martin VSOP", origin:"Cognac, France", abv:"40%", price:78000, bottle:"spirit",
    desc:"A harmonious blend of eaux-de-vie, smooth and rounded with notes of vanilla and dried apricot." },
  { id:"p9", cat:"cognac", name:"Courvoisier VS", origin:"Cognac, France", abv:"40%", price:52000, bottle:"spirit",
    desc:"Fresh and fruity with a light oaky edge, an approachable everyday cognac." },
  { id:"p10", cat:"champagne", name:"Moët & Chandon Brut Impérial", origin:"Champagne, France", abv:"12%", price:68000, bottle:"wine",
    desc:"Bright and elegant with notes of green apple and brioche, a benchmark non-vintage champagne." },
  { id:"p11", cat:"champagne", name:"Veuve Clicquot Yellow Label", origin:"Champagne, France", abv:"12%", price:95000, bottle:"wine",
    desc:"Full-bodied and generous, with toasted notes balanced by fresh citrus." },
  { id:"p12", cat:"champagne", name:"Dom Pérignon Vintage", origin:"Champagne, France", abv:"12.5%", price:450000, bottle:"wine",
    desc:"A prestige vintage cuvée, precise and powerful, with notes of white flowers and toasted almond." },
  { id:"p13", cat:"champagne", name:"Whispering Angel Rosé", origin:"Provence, France", abv:"13%", price:42000, bottle:"wine",
    desc:"Pale, dry and delicate, with notes of red berries and citrus zest." },
  { id:"p14", cat:"gin-vodka", name:"Hendrick's Gin", origin:"Scotland", abv:"41.4%", price:55000, bottle:"spirit",
    desc:"Infused with rose and cucumber for a distinctly smooth, floral character." },
  { id:"p15", cat:"gin-vodka", name:"Grey Goose Vodka", origin:"France", abv:"40%", price:60000, bottle:"spirit",
    desc:"Made from single-origin French wheat, exceptionally smooth and clean on the palate." },
  { id:"p16", cat:"gin-vodka", name:"Tanqueray London Dry Gin", origin:"England", abv:"43.1%", price:40000, bottle:"spirit",
    desc:"A classic juniper-forward gin with a crisp, citrus-led finish." },
  { id:"p17", cat:"gin-vodka", name:"Belvedere Vodka", origin:"Poland", abv:"40%", price:65000, bottle:"spirit",
    desc:"Distilled from rye, silky and subtly sweet with a clean, long finish." },
  { id:"p18", cat:"gifts", name:"Whisky Tasting Gift Set", origin:"Scotland", abv:"varies", price:28000, bottle:"gift",
    desc:"Three 5cl single malt miniatures, a thoughtful introduction to Scotch whisky." },
  { id:"p19", cat:"gifts", name:"Cognac & Cigar Gift Box", origin:"France", abv:"varies", price:95000, bottle:"gift",
    desc:"A VSOP cognac miniature paired with a hand-rolled cigar, presented in a gift box." },
  { id:"p20", cat:"gifts", name:"Champagne & Truffles Hamper", origin:"France", abv:"varies", price:75000, bottle:"gift",
    desc:"A half-bottle of champagne alongside a selection of fine chocolate truffles." },
];

// ---------- state ----------
let activeFilter = "all";
let searchTerm = "";
const cart = {}; // { productId: qty }

// ---------- bottle icon markup ----------
function bottleIcon(type, cls){
  if(type === "wine"){
    return `<svg viewBox="0 0 60 140" class="${cls}" aria-hidden="true">
      <path d="M26 4h8v10l8 12c2 3 3 6 3 10v94a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V36c0-4 1-7 3-10l8-12V4z" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <rect x="22" y="10" width="16" height="10" fill="currentColor" opacity=".85"/>
      <line x1="18" y1="58" x2="42" y2="58" stroke="currentColor" stroke-width="0.75"/>
    </svg>`;
  }
  if(type === "gift"){
    return `<svg viewBox="0 0 60 60" class="${cls}" aria-hidden="true">
      <rect x="8" y="22" width="44" height="32" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <rect x="8" y="22" width="44" height="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <line x1="30" y1="8" x2="30" y2="54" stroke="currentColor" stroke-width="1.5"/>
      <path d="M30 22c-6-10-20-10-16-1 2 5 10 4 16 1z" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <path d="M30 22c6-10 20-10 16-1-2 5-10 4-16 1z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 60 140" class="${cls}" aria-hidden="true">
    <path d="M22 4h16v14c0 3 4 5 4 10v98a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V28c0-5 4-7 4-10V4z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="20" y="52" width="20" height="32" fill="none" stroke="currentColor" stroke-width="1"/>
    <line x1="20" y1="60" x2="40" y2="60" stroke="currentColor" stroke-width="0.75"/>
  </svg>`;
}

function formatNaira(n){
  return "\u20A6" + n.toLocaleString("en-NG");
}

// ---------- rendering ----------
function renderNav(){
  document.getElementById("main-nav").innerHTML = CATEGORIES.map(c =>
    `<a href="#shop" data-cat="${c.id}" class="nav-cat-link">${c.name}</a>`
  ).join("");
  document.querySelectorAll(".nav-cat-link").forEach(a => {
    a.addEventListener("click", () => setFilter(a.dataset.cat));
  });
}

function renderCategoryGrid(){
  document.getElementById("category-grid").innerHTML = CATEGORIES.map(c => `
    <div class="category-card" data-cat="${c.id}" role="button" tabindex="0">
      ${bottleIcon(c.bottle, "bottle-icon")}
      <p class="cat-name">${c.name}</p>
    </div>`).join("");
  document.querySelectorAll(".category-card").forEach(el => {
    el.addEventListener("click", () => setFilter(el.dataset.cat));
  });
}

function renderFilterBar(){
  const chips = [{id:"all", name:"All"}].concat(CATEGORIES);
  document.getElementById("filter-bar").innerHTML = chips.map(c =>
    `<button class="filter-chip ${c.id===activeFilter?'active':''}" data-cat="${c.id}">${c.name}</button>`
  ).join("");
  document.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => setFilter(btn.dataset.cat));
  });
}

function setFilter(cat){
  activeFilter = cat;
  renderFilterBar();
  renderProductGrid();
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
}

function renderProductGrid(){
  const term = searchTerm.trim().toLowerCase();
  const items = PRODUCTS.filter(p => {
    const catOk = activeFilter === "all" || p.cat === activeFilter;
    const termOk = !term || p.name.toLowerCase().includes(term) || p.origin.toLowerCase().includes(term);
    return catOk && termOk;
  });
  const grid = document.getElementById("product-grid");
  if(items.length === 0){
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:40px 0;">No bottles match your search.</p>`;
    return;
  }
  grid.innerHTML = items.map(p => `
    <div class="product-card">
      ${bottleIcon(p.bottle, "bottle-icon")}
      <p class="p-cat">${categoryName(p.cat)}</p>
      <p class="p-name">${p.name}</p>
      <p class="p-origin">${p.origin}</p>
      <p class="p-price">${formatNaira(p.price)}</p>
      <div class="p-actions">
        <button class="btn btn-ghost" data-view="${p.id}">View</button>
        <button class="btn btn-gold" data-add="${p.id}">Add</button>
      </div>
    </div>`).join("");
  grid.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => openProductModal(btn.dataset.view)));
  grid.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => { addToCart(btn.dataset.add, 1); }));
}

function categoryName(id){
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.name : id;
}

// ---------- product modal ----------
function openProductModal(id){
  const p = PRODUCTS.find(p => p.id === id);
  if(!p) return;
  let qty = 1;
  const body = document.getElementById("product-modal-body");
  body.innerHTML = `
    ${bottleIcon(p.bottle, "pm-icon")}
    <p class="pm-name">${p.name}</p>
    <p class="pm-cat">${categoryName(p.cat)}</p>
    <p class="pm-desc">${p.desc}</p>
    <div class="pm-meta"><span>${p.origin}</span><span>ABV ${p.abv}</span></div>
    <p class="pm-price">${formatNaira(p.price)}</p>
    <div class="qty-row">
      <button id="pm-dec">&minus;</button><span id="pm-qty">1</span><button id="pm-inc">&plus;</button>
    </div>
    <button class="btn btn-gold btn-block" id="pm-add">Add to basket</button>
  `;
  body.querySelector("#pm-dec").addEventListener("click", () => { qty = Math.max(1, qty-1); body.querySelector("#pm-qty").textContent = qty; });
  body.querySelector("#pm-inc").addEventListener("click", () => { qty = qty+1; body.querySelector("#pm-qty").textContent = qty; });
  body.querySelector("#pm-add").addEventListener("click", () => { addToCart(p.id, qty); closeProductModal(); openCart(); });
  document.getElementById("product-modal").hidden = false;
}
function closeProductModal(){ document.getElementById("product-modal").hidden = true; }

// ---------- cart ----------
function addToCart(id, qty){
  cart[id] = (cart[id] || 0) + qty;
  renderCart();
}
function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  renderCart();
}
function removeFromCart(id){
  delete cart[id];
  renderCart();
}
function cartTotal(){
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}
function cartCount(){
  return Object.values(cart).reduce((a,b) => a+b, 0);
}
function renderCart(){
  document.getElementById("cart-count").textContent = cartCount();
  const itemsEl = document.getElementById("cart-items");
  const ids = Object.keys(cart);
  if(ids.length === 0){
    itemsEl.innerHTML = `<div class="cart-empty">Your basket is empty.</div>`;
  } else {
    itemsEl.innerHTML = ids.map(id => {
      const p = PRODUCTS.find(p => p.id === id);
      const qty = cart[id];
      return `
        <div class="cart-item">
          ${bottleIcon(p.bottle, "ci-icon")}
          <div class="ci-info">
            <p class="ci-name">${p.name}</p>
            <p class="ci-price">${formatNaira(p.price)} &times; ${qty}</p>
            <div class="ci-qty">
              <button data-dec="${id}">&minus;</button><span>${qty}</span><button data-inc="${id}">&plus;</button>
              <span class="ci-remove" data-remove="${id}">Remove</span>
            </div>
          </div>
        </div>`;
    }).join("");
    itemsEl.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => changeQty(b.dataset.inc, 1)));
    itemsEl.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => changeQty(b.dataset.dec, -1)));
    itemsEl.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => removeFromCart(b.dataset.remove)));
  }
  document.getElementById("cart-subtotal").textContent = formatNaira(cartTotal());
}
function openCart(){
  document.getElementById("cart-drawer").hidden = false;
  document.getElementById("drawer-backdrop").hidden = false;
}
function closeCart(){
  document.getElementById("cart-drawer").hidden = true;
  document.getElementById("drawer-backdrop").hidden = true;
}

// ---------- checkout ----------
function openCheckout(){
  if(cartCount() === 0) return;
  const summary = document.getElementById("checkout-summary");
  const ids = Object.keys(cart);
  summary.innerHTML = ids.map(id => {
    const p = PRODUCTS.find(p => p.id === id);
    return `<div class="cs-row"><span>${p.name} &times; ${cart[id]}</span><span>${formatNaira(p.price*cart[id])}</span></div>`;
  }).join("") + `<div class="cs-row cs-total"><span>Total</span><span>${formatNaira(cartTotal())}</span></div>`;
  closeCart();
  document.getElementById("checkout-modal").hidden = false;
}
function closeCheckout(){ document.getElementById("checkout-modal").hidden = true; }

function handleCheckoutSubmit(e){
  e.preventDefault();
  const email = document.getElementById("co-email").value;
  const name = document.getElementById("co-name").value;
  const amountKobo = cartTotal() * 100;

  if(typeof PaystackPop === "undefined"){
    alert("Paystack's script didn't load (this can happen in a sandboxed preview). Once this site is deployed to a real https domain, the payment popup will work normally.");
    return;
  }

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amountKobo,
    currency: "NGN",
    ref: "GC-" + Date.now(),
    metadata: {
      custom_fields: [
        { display_name: "Customer name", variable_name: "customer_name", value: name },
        { display_name: "Delivery city", variable_name: "city", value: document.getElementById("co-city").value },
      ]
    },
    callback: function(response){
      showConfirmation(response.reference);
      Object.keys(cart).forEach(id => delete cart[id]);
      renderCart();
      document.getElementById("checkout-form").reset();
    },
    onClose: function(){}
  });
  handler.openIframe();
}

function showConfirmation(ref){
  closeCheckout();
  document.getElementById("confirm-text").textContent =
    `Thank you. Your order (ref ${ref}) has been received and will be delivered to the address provided. A confirmation has been sent to your email.`;
  document.getElementById("confirm-modal").hidden = false;
}

// ---------- age gate ----------
function initAgeGate(){
  document.getElementById("age-yes").addEventListener("click", () => {
    document.getElementById("age-gate").remove();
  });
  document.getElementById("age-no").addEventListener("click", () => {
    document.getElementById("age-gate").hidden = true;
    document.getElementById("age-blocked").hidden = false;
  });
}

// ---------- wire up ----------
function init(){
  document.title = `${BRAND_NAME} — Fine whisky, cognac & champagne, delivered in Nigeria`;
  initAgeGate();
  renderNav();
  renderCategoryGrid();
  renderFilterBar();
  renderProductGrid();
  renderCart();

  document.getElementById("search-toggle").addEventListener("click", () => {
    const bar = document.getElementById("search-bar");
    bar.hidden = !bar.hidden;
    if(!bar.hidden) document.getElementById("search-input").focus();
  });
  document.getElementById("search-input").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderProductGrid();
  });

  document.getElementById("product-modal-close").addEventListener("click", closeProductModal);
  document.getElementById("product-modal").addEventListener("click", (e) => { if(e.target.id === "product-modal") closeProductModal(); });

  document.getElementById("cart-toggle").addEventListener("click", openCart);
  document.getElementById("cart-close").addEventListener("click", closeCart);
  document.getElementById("drawer-backdrop").addEventListener("click", closeCart);
  document.getElementById("checkout-btn").addEventListener("click", openCheckout);

  document.getElementById("checkout-close").addEventListener("click", closeCheckout);
  document.getElementById("checkout-modal").addEventListener("click", (e) => { if(e.target.id === "checkout-modal") closeCheckout(); });
  document.getElementById("checkout-form").addEventListener("submit", handleCheckoutSubmit);

  document.getElementById("confirm-close").addEventListener("click", () => { document.getElementById("confirm-modal").hidden = true; });
}

document.addEventListener("DOMContentLoaded", init);
