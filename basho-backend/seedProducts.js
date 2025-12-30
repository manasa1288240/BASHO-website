const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/bashoDB")
  .then(async () => {
    console.log("MongoDB connected for seeding");

    await Product.deleteMany(); // clears old products
    console.log("Old products removed");

    const products = [

      /* ================= MUGS ================= */
      {
        title: "Sculpted Feminine Tumbler",
        price: "₹1000",
        category: "Mugs",
        image: "/products/mugs/feminine-tumbler.jpg",
        description: "Handcrafted sculpted ceramic tumbler."
      },
      {
        title: "Coffee Tumbler",
        price: "₹1000",
        category: "Mugs",
        image: "/products/mugs/coffee-tumbler.jpg",
        description: "Minimal coffee tumbler with smooth glaze."
      },
      {
        title: "Cappuccino Mug",
        price: "₹800",
        category: "Mugs",
        image: "/products/mugs/cappuccino.jpg",
        description: "Perfect-sized mug for cappuccino lovers."
      },
      {
        title: "Striped Mug Set",
        price: "₹2580",
        category: "Mugs",
        image: "/products/mugs/striped-set.jpg",
        description: "Includes plate, two mugs and coasters."
      },
      {
        title: "Beer Mug",
        price: "₹1000",
        category: "Mugs",
        image: "/products/mugs/beer-mug.jpg",
        description: "Handcrafted ceramic beer mug."
      },

      /* ================= PLATES ================= */
      {
        title: "Pasta Plate",
        price: "₹1800",
        category: "Plates",
        image: "/products/plates/pasta-plate.jpg",
        description: "Wide ceramic pasta plate."
      },
      {
        title: "Classic Dinner Plate",
        price: "₹1000",
        category: "Plates",
        image: "/products/plates/classic-plate.jpg",
        description: "Minimal everyday ceramic plate."
      },
      {
        title: "Wavy Plate",
        price: "₹1500",
        category: "Plates",
        image: "/products/plates/wavy-plate.jpg",
        description: "Organic wavy edged ceramic plate."
      },

      /* ================= PLATTERS ================= */
      {
        title: "Garlic Grater",
        price: "₹1500",
        category: "Platters",
        image: "/products/platters/garlic-grater.jpg",
        description: "Handcrafted ceramic garlic grater."
      },
      {
        title: "Chip & Dip Platter",
        price: "₹3500",
        category: "Platters",
        image: "/products/platters/chip-dip.jpg",
        description: "Serving platter with dip bowl."
      },

      /* ================= BOWLS ================= */
      {
        title: "Fruit Bowl",
        price: "₹2800",
        category: "Bowls",
        image: "/products/bowls/fruit-bowl.jpg",
        description: "Large handcrafted fruit bowl."
      },
      {
        title: "Matcha Bowl Set",
        price: "₹2000",
        category: "Bowls",
        image: "/products/bowls/matcha.jpg",
        description: "Matcha bowl with whisk holder."
      },
      {
        title: "Heart Bowl",
        price: "₹1000",
        category: "Bowls",
        image: "/products/bowls/heart-bowl.jpg",
        description: "Heart-shaped ceramic bowl."
      },

      /* ================= VASES ================= */
      {
        title: "Minimal Vase",
        price: "₹2500",
        category: "Vases",
        image: "/products/vases/minimal.jpg",
        description: "Minimal ceramic vase for fresh or dried flowers."
      },
      {
        title: "Flower Frog",
        price: "₹500",
        category: "Vases",
        image: "/products/vases/flower-frog.jpg",
        description: "Flower frog for ikebana arrangements."
      },

      /* ================= TRINKETS ================= */
      {
        title: "Striped Trinket Tray",
        price: "₹800",
        category: "Trinkets",
        image: "/products/trinkets/striped.jpg",
        description: "Decorative striped trinket tray."
      },
      {
        title: "Oval Trinket Tray",
        price: "₹600",
        category: "Trinkets",
        image: "/products/trinkets/oval.jpg",
        description: "Small oval ceramic trinket tray."
      },

      /* ================= FANCY ================= */
      {
        title: "Tea Pot Set",
        price: "₹5000",
        category: "Fancy",
        image: "/products/fancy/teapot.jpg",
        description: "Tea pot with two cups."
      },
      {
        title: "Tic Tac Toe Set",
        price: "₹1500",
        category: "Fancy",
        image: "/products/fancy/tictactoe.jpg",
        description: "Handcrafted ceramic tic tac toe."
      }

    ];

    await Product.insertMany(products);
    console.log("Products seeded successfully");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
