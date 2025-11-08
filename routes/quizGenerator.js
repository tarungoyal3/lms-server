// /routes/quizGenerator.js
import express from "express";
import axios from "axios";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.post("/generate-quiz", async (req, res) => {
  const { lectures } = req.body;

  if (!lectures || lectures.length === 0) {
    return res.status(400).json({ message: "No lectures provided." });
  }

  const lectureTitles = lectures.map(l => l.lectureTitle).join("\n");

  const prompt = `
Based on the following lecture titles, generate 5 multiple-choice questions (MCQs). Each should include:

1. The question.
2. Four options (A-D).
3. The correct answer (just the letter).
4. A brief explanation of why the correct answer is right.

Lecture Titles:\n${lectureTitles}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTE_KEY}`,
          "Content-Type": "application/json",
          "HTTPS-Referer": FRONTEND_URL // change if needed
        }
      }
    );

    const quizData = response.data.choices[0].message.content;
    res.json({ quiz: quizData });
  } catch (error) {
    console.error("Quiz Generator Error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate quiz." });
  }
});

export default router;
