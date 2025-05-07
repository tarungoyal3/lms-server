// routes/faqRoutes.js
import express from "express";
// import Faq from "../models/Faq.js";
import Faq from "../models/faqModel.js";

const router = express.Router();

router.get("/top", async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ count: -1 }).limit(10);
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

export default router;
