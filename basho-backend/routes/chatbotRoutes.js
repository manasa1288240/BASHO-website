const express = require("express");
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ===== Website Data =====
  const productsData = [
  { name: "Fluted Stoneware Bowls", category: "Bowls", material: "Stoneware", price: 2800 },
  { name: "Minimal Studio Mugs", category: "Mugs", material: "Ceramic", price: 1900 },
  { name: "Teal Criss-Cross Mugs", category: "Mugs", material: "Stoneware", price: 2200 },
  { name: "Indigo Glaze Mugs", category: "Mugs", material: "Ceramic", price: 2400 },
  { name: "Garlic Grater", category: "Platter/Cheeseboard", material: "Clay", price: 1500 },
  { name: "Ocean Glaze Bowl Set", category: "Bowls", material: "Stoneware", price: 2600 },
  { name: "Raw Clay Snack Dishes", category: "Bowls", material: "Clay", price: 1700 },
  { name: "Earth Tone Serving Plates", category: "Plates", material: "Stoneware", price: 1000 },
  { name: "Pastel Wabi-Sabi Plates", category: "Plates", material: "Ceramic", price: 1000 },
  { name: "Everyday Clay Cups", category: "Mugs", material: "Clay", price: 1500 },
  { name: "Heart Bowl", category: "Bowls", material: "Clay", price: 1000 },
  { name: "Lip Mug", category: "Mugs", material: "Clay", price: 800 },
  { name: "Striped Coffee Mugs Set", category: "Mugs", material: "Clay", price: 2580 },
  { name: "Planter", category: "Vase", material: "Clay", price: 1000 },
  { name: "Striped Mug", category: "Mugs", material: "Clay", price: 800 },
  { name: "Tic Tac Toe", category: "Fancy", material: "Clay", price: 1500 },
  { name: "Vase", category: "Vase", material: "Clay", price: 2500 },
  { name: "Wavy Plate", category: "Plates", material: "Clay", price: 1500 },
  { name: "Wavy Plate (Variant)", category: "Plates", material: "Clay", price: 1500 },
  { name: "Trinket Trays (Bird & Rat)", category: "Picasso Limited Collection", material: "Clay", price: 600 },
  { name: "Wall Flower Frames Plate", category: "Fancy", material: "Clay", price: 2500 },
  { name: "Trinket Trays (Boat)", category: "Picasso Limited Collection", material: "Clay", price: 800 },
  { name: "Tumbler / Thumbie", category: "Picasso Limited Collection", material: "Clay", price: 1000 },
  { name: "Tea Pot Set (2 cups + 1 pot)", category: "Fancy", material: "Clay", price: 5000 },
  { name: "Coffee Tumblers", category: "Mugs", material: "Clay", price: 1000 },
  { name: "Chip & Dip Platter", category: "Platter/Cheeseboard", material: "Clay", price: 3500 },
  { name: "Vase (Variant)", category: "Vase", material: "Clay", price: 2500 },
  { name: "Matcha Bowl with Whisk Holder", category: "Bowls", material: "Clay", price: 2000 },
  { name: "Sculpted Feminine Tumbler", category: "Mugs", material: "Clay", price: 1000 },
  { name: "Cappucino Mugs", category: "Mugs", material: "Clay", price: 800 }
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
  "Custom orders may take 1-2 weeks depending on complexity.",
  "Contact us via the Custom Orders page on our website to place your order."
];

// ===== Helper Functions =====
function getAveragePrice(products, category = null) {
  const filtered = category ? products.filter(p => p.category.toLowerCase() === category.toLowerCase()) : products;
  if (filtered.length === 0) return 0;
  return Math.round(filtered.reduce((sum, p) => sum + p.price, 0) / filtered.length);
}

function getProductsUnderBudget(products, budget, category = null) {
  let filtered = category ? products.filter(p => p.category.toLowerCase() === category.toLowerCase()) : products;
  return filtered.filter(p => p.price <= budget);
}

function getWorkshopsUnderBudget(workshops, budget) {
  return workshops.filter(w => w.price <= budget);
}

// ===== POST /api/chatbot =====
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") return res.status(400).json({ error: "Message is required" });

    const lowerMsg = message.toLowerCase();

    // ===== Greetings =====
    const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
    const thanks = ["thank you", "thanks", "thx"];
    if (greetings.some(g => lowerMsg.includes(g))) {
      return res.status(200).json({ reply: "🏺 Hello! I’m BASHO AI. I can help you with pottery products, workshops, budgets, care tips, and custom orders." });
    }
    if (thanks.some(t => lowerMsg.includes(t))) {
      return res.status(200).json({ reply: "🏺 You’re welcome! Happy to help with all things pottery." });
    }

    // ===== Detect category automatically =====
    let category = null;
    if (lowerMsg.includes("cups")) category = "Cups";
    else if (lowerMsg.includes("bowls")) category = "Bowls";
    else if (lowerMsg.includes("plates")) category = "Plates";
    else if (lowerMsg.includes("workshop")) category = "Workshops";

    // ===== Detect budget if mentioned =====
    const budgetMatch = message.match(/\b(?:₹|rs|INR)?\s?(\d{3,6})\b/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    // ===== Handle budget queries =====
    if (budget && category && category !== "Workshops") {
      const products = getProductsUnderBudget(productsData, budget, category);
      let reply = `🏺 ${category} under ₹${budget}:\n`;
      reply += products.length > 0 ? products.map(p => `- ${p.name}: ₹${p.price}`).join("\n") : "No products found under this budget.";
      return res.status(200).json({ reply });
    }

    if (budget && category === "Workshops") {
      const workshops = getWorkshopsUnderBudget(workshopsData, budget);
      let reply = `🏺 Workshops under ₹${budget}:\n`;
      reply += workshops.length > 0 ? workshops.map(w => `- ${w.name}: ₹${w.price} (${w.duration})`).join("\n") : "No workshops found under this budget.";
      return res.status(200).json({ reply });
    }

    if (budget && !category) {
      const products = getProductsUnderBudget(productsData, budget);
      const workshops = getWorkshopsUnderBudget(workshopsData, budget);
      let reply = `🏺 With ₹${budget}, you can consider:\n\n`;
      if (products.length > 0) reply += "Products:\n" + products.map(p => `- ${p.name} (${p.category}): ₹${p.price}`).join("\n") + "\n";
      else reply += "No products under this budget.\n";
      if (workshops.length > 0) reply += "\nWorkshops:\n" + workshops.map(w => `- ${w.name}: ₹${w.price} (${w.duration})`).join("\n");
      else reply += "\nNo workshops under this budget.";
      return res.status(200).json({ reply });
    }

    // ===== Handle average price queries =====
    if (lowerMsg.includes("average price") || lowerMsg.includes("average cost")) {
      let avgReply = "";
      if (category && category !== "Workshops") {
        avgReply = `🏺 The average price of ${category.toLowerCase()} is ₹${getAveragePrice(productsData, category)}.`;
      } else {
        const avgPrice = getAveragePrice(productsData);
        const avgWorkshop = Math.round(workshopsData.reduce((sum, w) => sum + w.price, 0) / workshopsData.length);
        avgReply = `🏺 Average product price: ₹${avgPrice}. Average workshop price: ₹${avgWorkshop}.`;
      }
      return res.status(200).json({ reply: avgReply });
    }

    // ===== Handle general product/workshop/care/custom queries =====
    if (lowerMsg.includes("products")) {
      let reply = "🏺 Here are our products:\n\n";
      reply += productsData.map(p => `- ${p.name} (${p.category}): ₹${p.price}`).join("\n");
      return res.status(200).json({ reply });
    }
    if (lowerMsg.includes("workshops")) {
      let reply = "🏺 Here are our workshops:\n\n";
      reply += workshopsData.map(w => `- ${w.name}: ₹${w.price} (${w.duration})`).join("\n");
      return res.status(200).json({ reply });
    }
    if (lowerMsg.includes("care") || lowerMsg.includes("tips")) {
      let reply = "🏺 Pottery care tips:\n\n";
      reply += careTips.map(t => `- ${t}`).join("\n");
      return res.status(200).json({ reply });
    }
    if (lowerMsg.includes("custom order")) {
      let reply = "🏺 Custom order info:\n\n";
      reply += customOrders.map(t => `- ${t}`).join("\n");
      return res.status(200).json({ reply });
    }

    // ===== Use Google Gemini for conversational/fallback answers =====
    if (process.env.GEMINI_API_KEY) {
      const productsText = productsData.map(p => `${p.name} (${p.category}): ₹${p.price}`).join("\n");
      const workshopsText = workshopsData.map(w => `${w.name}: ₹${w.price} (${w.duration})`).join("\n");
      const careTipsText = careTips.map(t => `- ${t}`).join("\n");
      const customOrdersText = customOrders.map(t => `- ${t}`).join("\n");

      const aiPrompt = `
You are BASHO AI, a friendly pottery assistant.
Use the website data below to answer the user's question fully.

Products:
${productsText}

Workshops:
${workshopsText}

Care Tips:
${careTipsText}

Custom Orders:
${customOrdersText}

User asked: "${message}"
`;

      try {
        const modelName = "gemini-2.5-flash";
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: aiPrompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const gReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (gReply && gReply.trim() !== "") return res.status(200).json({ reply: gReply });
        }
      } catch (err) {
        console.warn("⚠️ Google API failed:", err.message);
      }
    }

    // ===== Fallback generic answer =====
    const avgPrice = getAveragePrice(productsData);
    const avgWorkshop = Math.round(workshopsData.reduce((sum, w) => sum + w.price, 0) / workshopsData.length);
    res.status(200).json({
      reply: `🏺 Average product price: ₹${avgPrice}. Average workshop price: ₹${avgWorkshop}. I can answer questions about products, workshops, care tips, custom orders, or budget queries.`
    });

  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

module.exports = router;
