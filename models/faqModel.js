// models/Faq.js
import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  count: { type: Number, default: 1 },
});

faqSchema.index({ question: 1 }, { unique: true });

const Faq = mongoose.model("Faq", faqSchema);
export default Faq;
