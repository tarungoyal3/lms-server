// // routes/aiRoute.js
// import express from "express";
// // import { askAiTutor } from "../controllers/aiController.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { askAiTutor } from "../controllers/aiController.js";

// const router = express.Router();

// router.post("/ask", isAuthenticated, askAiTutor);

// export default router;





















// routes/aiRoutes.js
// import Faq from "../models/Faq.js";
import axios from "axios";
import express from "express";
import Faq from "../models/faqModel.js";
const router = express.Router();
router.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    // Save or increment FAQ
    await Faq.findOneAndUpdate(
      { question },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    // Call OpenRouter or OpenAI here and return answer (your existing logic)
    const aiResponse = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "user", content: question }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    res.json({ answer: aiResponse.data.choices[0].message.content });
  } catch (err) {
    console.error("Error answering question:", err);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

export default router;