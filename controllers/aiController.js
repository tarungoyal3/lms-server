import axios from "axios";

export const askAiTutor = async (req, res) => {
  const { question } = req.body;
  console.log('Received question:', question);

  if (!question || !question.trim()) {
    return res.status(400).json({ answer: "Please enter a valid question." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          Authorization: `Bearer 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`, // your OpenRouter key
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "LMS Doubt Solver",
        },
      }
    );

    // Log the full response for debugging
    console.log("OpenRouter full response:", response.data);

    const answer = response.data.choices?.[0]?.message?.content;
    if (!answer) {
      return res.status(500).json({ answer: "No response received. Try again later." });
    }

    res.json({ answer });
  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    res.status(500).json({ answer: "Failed to get answer. Try again later." });
  }
};

