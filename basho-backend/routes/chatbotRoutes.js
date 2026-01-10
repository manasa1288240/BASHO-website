const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ================= DATA =================
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
  "Hand wash pottery with mild soap",
  "Avoid sudden temperature changes",
  "Do not use abrasive scrubbers",
  "Store carefully to avoid chipping"
];

// ================= HELPERS =================
const avg = (arr) =>
  Math.round(arr.reduce((s, i) => s + i.price, 0) / arr.length);

// ================= ROUTE =================
router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.json({ reply: "Please ask something 😊" });
  }

  const lower = message.toLowerCase();
  let handled = false;

  // ===== GREETINGS =====
  if (lower === "hi" || lower === "hello" || lower.includes("hey")) {
    handled = true;
    return res.json({
      reply:
        "Hi 🌿 I’m BASHO AI. I can help you with pottery products, workshops, care tips, or budget suggestions."
    });
  }

  // ===== THANKS =====
  if (lower.includes("thank")) {
    handled = true;
    return res.json({
      reply: "You’re welcome 🌿 Happy to help anytime!"
    });
  }

  // ===== BYE =====
  if (lower.includes("bye")) {
    handled = true;
    return res.json({
      reply: "Bye 👋 Hope to see you again at BASHO!"
    });
  }

  // ===== BUDGET =====
  const budgetMatch = message.match(/\b(?:₹|rs)?\s?(\d{3,6})\b/i);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1]);
    const products = productsData.filter(p => p.price <= budget);
    const workshops = workshopsData.filter(w => w.price <= budget);

    handled = true;
    return res.json({
      reply:
        `🌿 With ₹${budget}, you can consider:\n\n` +
        (products.length
          ? "Products:\n" +
            products.map(p => `- ${p.name}: ₹${p.price}`).join("\n")
          : "No products under this budget.") +
        "\n\n" +
        (workshops.length
          ? "Workshops:\n" +
            workshops.map(w => `- ${w.name}: ₹${w.price}`).join("\n")
          : "No workshops under this budget.")
    });
  }

  // ===== AVERAGE =====
  if (lower.includes("average")) {
    handled = true;
    return res.json({
      reply:
        `🌿 Average product price is ₹${avg(productsData)}.` +
        ` Average workshop price is ₹${avg(workshopsData)}.`
    });
  }

  // ===== WORKSHOPS =====
  if (lower.includes("workshop")) {
    handled = true;
    return res.json({
      reply:
        "🌿 Our workshops:\n" +
        workshopsData
          .map(w => `- ${w.name}: ₹${w.price} (${w.duration})`)
          .join("\n")
    });
  }

  // ===== CARE TIPS =====
  if (lower.includes("care")) {
    handled = true;
    return res.json({
      reply: "🌿 Pottery care tips:\n- " + careTips.join("\n- ")
    });
  }

  // ===== GEMINI AI (ONLY IF NOT HANDLED) =====
  if (!handled && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `
You are BASHO AI, a pottery assistant.
Answer ONLY if the question is related to pottery, products, workshops, or care.
If not relevant, reply: "I don’t have information on that yet."

User question: ${message}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiReply && aiReply.trim()) {
        handled = true;
        return res.json({ reply: aiReply });
      }
    } catch (err) {
      console.error("Gemini error:", err.message);
    }
  }

  // ===== GRACEFUL FALLBACK =====
  return res.json({
    reply:
      "🌿 I’m sorry, I don’t have information on that yet. I can help you with pottery products, workshops, care tips, or budget-related questions."
  });
});

module.exports = router;
