# The Gilded Cask — starter storefront

A white / ivory / gold luxury storefront for fine whisky, cognac, champagne, gin & vodka and gift sets, built for the Nigerian market (NGN pricing, Paystack checkout, Lagos/Abuja/Port Harcourt delivery zones).

This is an **original build** — its own design, code, copy and gold-linework "bottle" illustrations. The product catalog lists real, well-known spirits brands (as any retailer's inventory would), but with original tasting-note descriptions and no copied photography, layout, or text from any other retailer's site. Treat it as a starting point to make genuinely your own.

## 1. Rebrand it

Everything brand-specific lives in a few spots:

- **Name**: `BRAND_NAME` at the top of `script.js`, plus the `<a class="logo">` and footer logo text in `index.html`, plus the `<title>` tag.
- **Colors**: the `:root` block at the top of `style.css` — `--gold`, `--ink`, `--ivory`, `--green` etc.
- **Logo mark**: the circular "GC" monogram in the age-gate (`.age-gate-mark` in `index.html`) — swap for your real logo image once you have one.
- **Catalog**: the `PRODUCTS` array in `script.js` — names, origins, ABV, price (in NGN), and description per bottle. Add or remove items freely; everything else (filters, cart, search) reads from this array automatically.

## 2. Set up Paystack

1. Create a Paystack account at https://paystack.com and switch to **Test mode** while you build.
2. Copy your **Public key** from Dashboard → Settings → API Keys & Webhooks.
3. Paste it into `PAYSTACK_PUBLIC_KEY` in `script.js`.
4. Test a payment using Paystack's test cards: https://paystack.com/docs/payments/test-payments/
5. When you're ready to go live, switch to your **Live** public key and complete Paystack's business verification (KYC) — required before you can accept real payments.

The checkout as shipped is **client-side only**: it opens the Paystack popup and shows a confirmation once payment succeeds. That's enough to start taking real orders, but for production you should also verify each transaction server-side before fulfilling it — see step 3.

## 3. (Recommended) Deploy the verification API

`server.js` is a small Express app with one route, `POST /verify`, that confirms a transaction with Paystack using your **secret key** (never put your secret key in frontend code). GitHub Pages can't run this — deploy it to a host that runs Node, e.g. Render, Railway, or Fly.io (all have free tiers):

1. Push this repo (or just `server.js` + `package.json`) to its own service on Render/Railway.
2. Set the environment variable `PAYSTACK_SECRET_KEY` in that host's dashboard.
3. Once deployed, call `POST https://your-verify-api.example.com/verify` with `{ "reference": "..." }` from your order-fulfillment process (or extend the `callback` in `script.js` to call it automatically) before you ship an order.

## 4. Deploy the storefront to GitHub Pages

1. Create a new GitHub repository and push these files:
   ```
   git init
   git add .
   git commit -m "Initial storefront"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and `/ (root)` folder, then **Save**.
4. GitHub will give you a URL like `https://your-username.github.io/your-repo/` — that's your live site.
5. If you buy a custom domain, add it under Settings → Pages → Custom domain.

## Notes for the Nigerian market

- **Age gate**: shown on every visit; resets on reload by design (no cookies/local storage are used, so it works identically in any preview tool and in production).
- **Compliance**: alcohol advertising and online-delivery rules can vary by state and platform — it's worth a quick check with local counsel before launch, particularly around marketing and age verification at the point of delivery. This isn't legal advice.
- **Delivery zones**: the checkout form currently offers Lagos, Abuja, Port Harcourt, and Other — wire this up to your real delivery pricing/logistics provider.
- **Currency**: all prices are illustrative NGN figures — update them with your real, duty-inclusive pricing.

## File structure

```
index.html      — page markup
style.css       — all styling (theme variables at the top)
script.js       — catalog data, cart, modals, Paystack checkout, age gate
server.js       — optional backend for Paystack transaction verification
package.json    — dependencies for server.js
```
