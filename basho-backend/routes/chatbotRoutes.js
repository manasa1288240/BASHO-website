const express = require("express");
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ===== Website Data =====
const productsData = [
  { name: "Fluted Stoneware Bowls", category: "Bowls", price: 2800 },
  { name: "Minimal Studio Mugs", category: "Cups", price: 1900 },
  { name: "Teal Criss-Cross Mugs", category: "Cups", price: 2200 },
  { name: "Indigo Glaze Mugs", category: "Cups", price: 2400 },
  { name: "Handwoven Texture Plates", category: "Plates", price: 3200 },
  { name: "Ocean Glaze Bowl Set", category: "Bowls", price: 2600 },
  { name: "Raw Clay Snack Dishes", category: "Bowls", price: 1700 },
  { name: "Earth Tone Serving Plates", category: "Plates", price: 3000 },
  { name: "Pastel Wabi-Sabi Plates", category: "Plates", price: 2900 },
  { name: "Everyday Clay Cups", category: "Cups", price: 1500 }
];

const workshopsData = [
  { name: "Beginner Pottery Workshop", price: 500, duration: "2 hours" },
  { name: "Wheel Throwing Workshop", price: 1200, duration: "4 hours" },
  { name: "Advanced Glazing Workshop", price: 1500, duration: "3 hours" },
  { name: "One-day Glaze Workshop", price: 800, duration: "6 hours" }
];

const careTips = [
  "Hand wash your pottery with mild soap to avoid cracks.",
  "Avoid sudden temperature changes; don’t put hot pottery directly in cold water.",
  "Do not use abrasive cleaning pads or harsh chemicals.",
  "Store pottery carefully to prevent chipping."
];

const customOrders = [
  "We accept custom orders for mugs, bowls, and plates.",
  "Custom orders may take 1–2 weeks depending on complexity.",
  "Contact us via the Custom Orders page on our website to place your order."
];

// ===== Helper Functions =====
function getAveragePrice(products, category = null) {
  const filtered = category
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products;
  if (filtered.length === 0) return 0;
  return Math.round(filtered.reduce((sum, p) => sum + p.price, 0) / filtered.length);
}

function getProductsUnderBudget(products, budget, category = null) {
  const filtered = category
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products;
  return filtered.filter(p => p.price <= budget);
}

function getWorkshopsUnderBudget(workshops, budget) {
  return workshops.filter(w => w.price <= budget);
}

// ===== POST /api/chatbot =====
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const lowerMsg = message.toLowerCase().trim();

    // ===== BASIC CONVERSATION HANDLING =====
    if (["hi", "hello", "hey", "hai"].some(greet => lowerMsg === greet || lowerMsg.startsWith(greet))) {
      return res.json({
        reply: "🏺 Hi! I’m **BASHO AI**. I can help you explore our pottery products, prices, workshops, budgets, and care tips. What would you like to know?"
      });
    }

    if (lowerMsg.includes("thank")) {
      return res.json({
        reply: "🏺 You’re very welcome! Happy to help anytime. Let me know if you’d like product details, prices, or workshop info."
      });
    }

    if (lowerMsg.includes("bye") || lowerMsg.includes("goodbye")) {
      return res.json({
        reply: "🏺 Goodbye! Hope to see you again at BASHO. Have a calm, creative day 🤍"
      });
    }

    if (lowerMsg.includes("who are you")) {
      return res.json({
        reply: "🏺 I’m **BASHO AI**, your pottery assistant. I help with product details, price ranges, workshops, budgets, care tips, and custom orders."
      });
    }

    if (lowerMsg.includes("help") || lowerMsg.includes("what can you do")) {
      return res.json({
        reply: "🏺 I can help you with:\n• Product details & prices\n• Budget-based recommendations\n• Workshop info\n• Average price ranges\n• Pottery care tips\n• Custom orders\n\nJust ask naturally 🙂"
      });
    }

    // ===== Detect category =====
    let category = null;
    if (lowerMsg.includes("cups")) category = "Cups";
    else if (lowerMsg.includes("bowls")) category = "Bowls";
    else if (lowerMsg.includes("plates")) category = "Plates";
    else if (lowerMsg.includes("workshop")) category = "Workshops";

    // ===== Detect budget =====
    const budgetMatch = message.match(/\b(?:₹|rs|inr)?\s?(\d{3,6})\b/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    // ===== Category + budget logic =====
    if (budget && category && category !== "Workshops") {
      const products = getProductsUnderBudget(productsData, budget, category);
      const reply =
        products.length > 0
          ? `🏺 ${category} under ₹${budget}:\n` +
            products.map(p => `• ${p.name} – ₹${p.price}`).join("\n")
          : `🏺 No ${category.toLowerCase()} found under ₹${budget}.`;
      return res.json({ reply });
    }

    if (budget && category === "Workshops") {
      const workshops = getWorkshopsUnderBudget(workshopsData, budget);
      const reply =
        workshops.length > 0
          ? `🏺 Workshops under ₹${budget}:\n` +
            workshops.map(w => `• ${w.name} – ₹${w.price} (${w.duration})`).join("\n")
          : `🏺 No workshops available under ₹${budget}.`;
      return res.json({ reply });
    }

    // ===== Average price =====
    if (lowerMsg.includes("average price") || lowerMsg.includes("average cost")) {
      if (category && category !== "Workshops") {
        return res.json({
          reply: `🏺 The average price of ${category.toLowerCase()} is ₹${getAveragePrice(productsData, category)}.`
        });
      }

      const avgProduct = getAveragePrice(productsData);
      const avgWorkshop = Math.round(
        workshopsData.reduce((s, w) => s + w.price, 0) / workshopsData.length
      );

      return res.json({
        reply: `🏺 Average product price is ₹${avgProduct}, and average workshop price is ₹${avgWorkshop}.`
      });
    }

    // ===== Gemini AI fallback =====
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: message }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return res.json({ reply });
        }
      } catch (err) {
        console.warn("Gemini API failed");
      }
    }

    // ===== Final fallback =====
    return res.json({
      reply: "🏺 I can help with pottery products, prices, workshops, budgets, and care tips. Try asking something like *“cups under 2000”* or *“average workshop cost”*."
    });

  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
