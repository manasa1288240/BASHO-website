const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    await Product.deleteMany(); // clean slate (run once)

    await Product.insertMany([
      // MUGS
      {
        name: "Sculpted Feminine Tumbler",
        category: "Mugs",
        price: "₹1000 / pc",
        images: ["2554"],
      },
      {
        name: "Coffee Tumblers",
        category: "Mugs",
        price: "₹1000 / pc",
        images: ["3097"],
      },
      {
        name: "Cappuccino Mug",
        category: "Mugs",
        price: "₹800 / pc",
        images: ["9371"],
      },
      {
        name: "Striped Coffee Mug Set",
        category: "Mugs",
        price: "₹2580 / set",
        description: "Includes plate, 2 mugs, 2 coasters",
        images: ["8899", "8912", "8925", "8997"],
      },
      {
        name: "Beer Mug",
        category: "Mugs",
        price: "₹1000 / pc",
        images: ["3659"],
      },

      // PLATES
      {
        name: "Pasta Plates",
        category: "Plates",
        price: "₹1800",
        images: ["2319"],
      },
      {
        name: "Wavy Plates",
        category: "Plates",
        price: "₹1500",
        images: ["9385", "9388"],
      },

      // PLATTERS
      {
        name: "Chip & Dip Platter",
        category: "Platter",
        price: "₹3500",
        images: ["9067"],
      },
      {
        name: "Cheeseboard / Platter",
        category: "Platter",
        price: "₹5000",
        images: ["6842"],
      },

      // BOWLS
      {
        name: "Fruit Bowls",
        category: "Bowls",
        price: "₹2800",
      },
      {
        name: "Heart Bowl",
        category: "Bowls",
        price: "₹1000 (single) / ₹1800 (set of 2)",
      },

      // VASE
      {
        name: "Every Vase",
        category: "Vase",
        price: "₹2500",
      },

      // DINNER SET
      {
        name: "Dinner Set (Custom)",
        category: "Dinner Sets",
        price: "₹20,000 approx",
        isCustomisable: true,
      },

      // FANCY
      {
        name: "Tea Pot Set",
        category: "Fancy",
        price: "₹5000",
      },
    ]);

    console.log("Products seeded successfully");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
