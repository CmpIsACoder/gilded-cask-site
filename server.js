/**
 * OPTIONAL backend for verifying Paystack transactions server-side.
 *
 * GitHub Pages only serves static files, so this file will NOT run there.
 * Deploy it separately (Render, Railway, Fly.io, a VPS, etc.) and your
 * frontend's checkout success handler can call POST /verify with the
 * transaction reference to confirm payment before you fulfil the order.
 *
 * Setup:
 *   1. npm install
 *   2. Create a .env file with: PAYSTACK_SECRET_KEY=sk_test_xxxxxxxx
 *   3. npm start
 */

require("dotenv").config();
const express = require("express");
const https = require("https");

const app = express();
app.use(express.json());

// Allow your storefront's domain to call this API.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // tighten to your domain in production
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.post("/verify", (req, res) => {
  const { reference } = req.body;
  if (!reference) return res.status(400).json({ status: false, message: "Missing reference" });

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ status: false, message: "Server is missing PAYSTACK_SECRET_KEY" });

  const options = {
    hostname: "api.paystack.co",
    path: `/transaction/verify/${encodeURIComponent(reference)}`,
    method: "GET",
    headers: { Authorization: `Bearer ${secretKey}` },
  };

  const psReq = https.request(options, (psRes) => {
    let data = "";
    psRes.on("data", (chunk) => (data += chunk));
    psRes.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        const success = parsed?.data?.status === "success";
        res.json({ status: success, data: parsed.data });
      } catch (err) {
        res.status(502).json({ status: false, message: "Could not parse Paystack response" });
      }
    });
  });

  psReq.on("error", (err) => res.status(502).json({ status: false, message: err.message }));
  psReq.end();
});

app.get("/", (req, res) => res.send("Gilded Cask payment verification API is running."));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Verification server listening on port ${PORT}`));
