const express = require("express");
const router = express.Router();

const chatActions = {
  view_products: {
    label: "What pottery do you sell?", // Emoji removed
    answer: "We offer handcrafted stoneware including Bowls, Mugs, Plates, and Vases. All our pieces are food-safe and lead-free!"
  },
  book_workshops: {
    label: "How do I book a workshop?", // Emoji removed
    answer: "We host Beginner, Wheel Throwing, and Glazing workshops. You can view available slots and book directly on our Workshops page."
  },
  collab_info: {
    label: "I'm interested in Collaborating", // Emoji removed
    answer: "We love working with designers and chefs! Please fill out our Collaboration Form in the footer or email us at bashobyyshivangi@gmail.com."
  },
  custom_orders: {
    label: "Do you take custom orders?", // Emoji removed
    answer: "Yes! We create custom dinnerware and personalized gifts. Production typically takes 2-4 weeks depending on the complexity."
  },
  care_guide: {
    label: "How do I care for my pottery?", // Emoji removed
    answer: "Our pottery is Microwave and Dishwasher safe. We recommend mild soap and avoiding extreme temperature shocks."
  }
};

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (chatActions[message]) {
      return res.status(200).json({
        reply: chatActions[message].answer,
        options: [{ label: "See all questions", value: "menu" }] // Emoji removed
      });
    }

    const menuOptions = Object.keys(chatActions).map(key => ({
      label: chatActions[key].label,
      value: key
    }));

    res.status(200).json({
      reply: "Namaste! Welcome to BASHO. Please select a question below:", // Emoji removed
      options: menuOptions
    });

  } catch (error) {
    res.status(500).json({ error: "Chatbot is currently offline." });
  }
});

module.exports = router;