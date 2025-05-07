// import express from "express"
// const router = express.Router();
// // const Quiz = require('./models/Quiz');
// import Quiz from "../models/quiz.js";

// // GET: Fetch quiz by courseId
// router.get('/:courseId', async (req, res) => {
//   try {
//     const quiz = await Quiz.findOne({ courseId: req.params.courseId });
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
//     res.json(quiz.questions);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // POST: Create a quiz for a course (optional admin route)
// router.post('/create', async (req, res) => {
//   const { courseId, questions } = req.body;
//   try {
//     const newQuiz = new Quiz({ courseId, questions });
//     await newQuiz.save();
//     res.status(201).json({ message: 'Quiz created successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create quiz' });
//   }
// });

// // module.exports = router;
// export default router






































// import express from "express"
// const router = express.Router();

// // Dummy example quiz data generator
// router.get("/:courseId", (req, res) => {
//   const { courseId } = req.params;

//   const quiz = [
//     {
//       question: "What is React?",
//       options: {
//         A: "A backend framework",
//         B: "A frontend library",
//         C: "A database",
//         D: "A design tool",
//       },
//       correctAnswer: "B",
//       explanation: "React is a JavaScript library for building user interfaces.",
//     },
//     {
//       question: "What does JSX stand for?",
//       options: {
//         A: "Java Syntax Extension",
//         B: "JavaScript XML",
//         C: "Java Server Extension",
//         D: "Java Syntax eXpression",
//       },
//       correctAnswer: "B",
//       explanation: "JSX stands for JavaScript XML, used to write HTML inside JavaScript.",
//     },
//   ];

//   res.json({ questions: quiz });
// });

// // module.exports = router;
// export default router






































// import express from "express";
// import axios from "axios";
// const router = express.Router();

// router.get("/:courseId", async (req, res) => {
//   const { courseId } = req.params;

//   try {
//     const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
//       model: "openai/gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are a quiz generator. Generate 3 MCQs with 4 options each, correct answer, and explanation based on the course: " + courseId,
//         },
//         {
//           role: "user",
//           content: `Generate a quiz for the course "${courseId}".`,
//         },
//       ],
//     }, {
//       headers: {
//         Authorization: `Bearer ${process.env.OPEN_ROUTE_KEY}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const raw = response.data.choices[0].message.content;

//     // Try to parse if it's JSON-like
//     const quiz = JSON.parse(raw);
//     res.json({ questions: quiz });
//   } catch (error) {
//     console.error("Quiz Generation Error:", error?.response?.data || error.message);
//     res.status(500).json({ error: "Failed to generate quiz" });
//   }
// });

// export default router;






































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
