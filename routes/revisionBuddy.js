import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/generate-summary", async (req, res) => {
  const OPENROUTER_KEY = process.env.OPEN_ROUTE_KEY;
  console.log("OPEN_ROUTE_KEY:", process.env.OPEN_ROUTE_KEY);

  if (!OPENROUTER_KEY) {
    return res.status(500).json({ message: "API key not set in environment." });
  }

  const { lectures } = req.body;

  if (!lectures || lectures.length === 0) {
    return res.status(400).json({ message: "No lectures provided." });
  }

  const lectureTitles = lectures.map(l => l.lectureTitle).join("\n");

  const prompt = `
Act as a smart AI tutor for revision. Based on the following lecture titles, generate a revision recap with these sections:

1. Key Concepts
2. Common Mistakes
3. 3 Must-Know MCQs
4. 1 Real-World Application

Lecture Titles:\n${lectureTitles}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "HTTP-Referer": "http://localhost:5173", // must match what you used during API key registration
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("Revision Buddy Error:", error?.response?.data || error.message);
    res.status(500).json({
      message: "Failed to generate revision summary.",
      error: error?.response?.data || error.message,
    });
  }  
});

export default router;

