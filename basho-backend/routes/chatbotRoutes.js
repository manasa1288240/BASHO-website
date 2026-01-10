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

    // ===== Detect category automatically =====
    let category = null;
    if (lowerMsg.includes("cups")) category = "Cups";
    else if (lowerMsg.includes("bowls")) category = "Bowls";
    else if (lowerMsg.includes("plates")) category = "Plates";
    else if (lowerMsg.includes("workshop")) category = "Workshops";

    // ===== Detect budget if mentioned =====
    const budgetMatch = message.match(/\b(?:₹|rs|INR)?\s?(\d{3,6})\b/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    // ===== Handle category + budget combinations =====
    if (budget && category && category !== "Workshops") {
      const products = getProductsUnderBudget(productsData, budget, category);
      let reply = `🌿 ${category} under ₹${budget}:\n`;
      reply += products.length > 0 ? products.map(p => `- ${p.name}: ₹${p.price}`).join("\n") : "No products found under this budget.";
      return res.status(200).json({ reply });
    }

    if (budget && category === "Workshops") {
      const workshops = getWorkshopsUnderBudget(workshopsData, budget);
      let reply = `🌿 Workshops under ₹${budget}:\n`;
      reply += workshops.length > 0 ? workshops.map(w => `- ${w.name}: ₹${w.price} (${w.duration})`).join("\n") : "No workshops found under this budget.";
      return res.status(200).json({ reply });
    }

    if (budget && !category) {
      const products = getProductsUnderBudget(productsData, budget);
      const workshops = getWorkshopsUnderBudget(workshopsData, budget);
      let reply = `🌿 With ₹${budget}, you can consider:\n\n`;
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
        avgReply = `🌿 The average price of ${category.toLowerCase()} is ₹${getAveragePrice(productsData, category)}.`;
      } else {
        const avgPrice = getAveragePrice(productsData);
        const avgWorkshop = Math.round(workshopsData.reduce((sum, w) => sum + w.price, 0) / workshopsData.length);
        avgReply = `🌿 Average product price: ₹${avgPrice}. Average workshop price: ₹${avgWorkshop}.`;
      }
      return res.status(200).json({ reply: avgReply });
    }

    // ===== Prepare AI prompt with full website context =====
    const productsText = productsData.map(p => `${p.name} (${p.category}): ₹${p.price}`).join("\n");
    const workshopsText = workshopsData.map(w => `${w.name}: ₹${w.price} (${w.duration})`).join("\n");
    const careTipsText = careTips.map(t => `- ${t}`).join("\n");
    const customOrdersText = customOrders.map(t => `- ${t}`).join("\n");

    const exampleQA = `
Q: Which workshops are under ₹1000?
A: Beginner Pottery Workshop ₹500, One-day Glaze Workshop ₹800.

Q: What is the average price of bowls?
A: The average price of bowls is ₹2,366. Examples: Fluted Stoneware Bowls ₹2800, Ocean Glaze Bowl Set ₹2600, Raw Clay Snack Dishes ₹1700.
`;

    const aiPrompt = `
You are BASHO AI, a friendly and knowledgeable pottery assistant. 
Use the website data below to answer all questions accurately and fully.

Products:
${productsText}

Workshops:
${workshopsText}

Care Tips:
${careTipsText}

Custom Orders:
${customOrdersText}

Instructions:
- Always answer the user's question fully using the website data.
- Be warm, calm, and aesthetic in tone.
- Provide specific information if possible (prices, workshop duration, materials, etc.)
- Use examples below for guidance:

${exampleQA}

User asked: "${message}"
`;

    // ===== Call Google Gemini API =====
    if (process.env.GEMINI_API_KEY) {
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
      reply: `🌿 Average product price: ₹${avgPrice}. Average workshop price: ₹${avgWorkshop}. I can answer questions about products, workshops, care tips, custom orders, or budget queries.`
    });

  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

module.exports = router;
