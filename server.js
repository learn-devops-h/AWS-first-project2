// const express = require("express");
// const app = express();
// const { resolve } = require("path");
// const port = process.env.PORT || 3000;

// // importing the dotenv module to use environment variables:
// require("dotenv").config();

// const api_key = process.env.SECRET_KEY;

// const stripe = require("stripe")(api_key);

// // ------------ Imports & necessary things here ------------

// // Setting up the static folder:
// // app.use(express.static(resolve(__dirname, "./client")));
// app.use(express.static(resolve(__dirname, process.env.STATIC_DIR)));

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
//   const path = resolve(process.env.STATIC_DIR + "/index.html");
//   res.sendFile(path);
// });

// // creating a route for success page:
// app.get("/success", (req, res) => {
//   const path = resolve(process.env.STATIC_DIR + "/success.html");
//   res.sendFile(path);
// });

// // creating a route for cancel page:
// app.get("/cancel", (req, res) => {
//   const path = resolve(process.env.STATIC_DIR + "/cancel.html");
//   res.sendFile(path);
// });

// // Workshop page routes:
// app.get("/workshop1", (req, res) => {
//   const path = resolve(process.env.STATIC_DIR + "/workshops/workshop1.html");
//   res.sendFile(path);
// });
// app.get("/workshop2", (req, res) => {
//   const path = resolve(process.env.STATIC_DIR + "/workshops/workshop2.html");
//   res.sendFile(path);
// });
// app.get("/workshop3", (req, res) => {
//   const path = resolve(process.env.STATIC_DIR + "/workshops/workshop3.html");
//   res.sendFile(path);
// });

// // ____________________________________________________________________________________

// const domainURL = process.env.DOMAIN;
// app.post("/create-checkout-session/:pid", async (req, res) => {
  
//   const priceId = req.params.pid;
  
//   const session = await stripe.checkout.sessions.create({
//     mode: "payment",
//     success_url: `${domainURL}/success?id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${domainURL}/cancel`,
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price: priceId,
//         quantity: 1,
//       },
//     ],
//     // allowing the use of promo-codes:
//     allow_promotion_codes: true,
//   });
//   res.json({
//     id: session.id,
//   });
// });

// // Server listening:
// app.listen(port, () => {
//   console.log(`Server listening on port: ${port}`);
//   console.log(`You may access you app at: ${domainURL}`);
// });

require("dotenv").config();
const express = require("express");
const path = require("path");
// require("dotenv").config();

const app = express();

// ✅ ENV variables
const PORT = process.env.PORT || 3000;
const STATIC_DIR = "client";
// const STATIC_DIR = process.env.STATIC_DIR || "public";
const DOMAIN = process.env.DOMAIN || "http://localhost:3000";
const SECRET_KEY = process.env.SECRET_KEY;


// ✅ Stripe init
const stripe = require("stripe")(SECRET_KEY);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Static folder
app.use(express.static(path.resolve(__dirname, STATIC_DIR)));

// ✅ Routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, STATIC_DIR, "index.html"));
});

app.get("/success", (req, res) => {
  res.sendFile(path.resolve(__dirname, STATIC_DIR, "success.html"));
});

app.get("/cancel", (req, res) => {
  res.sendFile(path.resolve(__dirname, STATIC_DIR, "cancel.html"));
});

// Workshops
app.get("/workshop1", (req, res) => {
  res.sendFile(path.resolve(__dirname, STATIC_DIR, "workshops/workshop1.html"));
});

app.get("/workshop2", (req, res) => {
  res.sendFile(path.resolve(__dirname, STATIC_DIR, "workshops/workshop2.html"));
});

app.get("/workshop3", (req, res) => {
  res.sendFile(path.resolve(__dirname, STATIC_DIR, "workshops/workshop3.html"));
});

// ✅ Stripe Checkout
app.post("/create-checkout-session/:pid", async (req, res) => {
  try {
    const priceId = req.params.pid;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${DOMAIN}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel`,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating checkout session");
  }
});

// ✅ Start server (ONLY ONCE)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open: ${DOMAIN}`);
});

console.log("STATIC_DIR:", process.env.STATIC_DIR);
