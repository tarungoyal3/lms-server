import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a quiz generator. Generate exactly 3 MCQs in the following JSON format:\n\n" +
              `[\n` +
              `  {\n` +
              `    "question": "Your question?",\n` +
              `    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },\n` +
              `    "correctAnswer": "A",\n` +
              `    "explanation": "Why A is correct"\n` +
              `  }\n` +
              `]` +
              "\nOnly return valid JSON array. No markdown or extra text.",
          },
          {
            role: "user",
            content: `Generate a quiz for the course "${courseId}"`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.choices[0].message.content;

    let quiz;
    try {
      quiz = JSON.parse(raw);
    } catch (parseErr) {
      console.error("JSON parsing failed:", parseErr.message);
      return res.status(500).json({ error: "Invalid JSON from AI" });
    }

    res.json({ questions: quiz });
  } catch (error) {
    console.error("Quiz Generation Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

export default router;
