import { fetchFromOpenRouter } from '../utils/openAi.js';

export const generateSchedule = async (req, res) => {
  const { availableHours, deadline, topics } = req.body;

  try {
    const prompt = `
      I am a student with ${availableHours} hours available daily and a deadline on ${deadline}.
      I need to complete the following topics: ${topics.join(', ')}.
      Create a daily study plan by distributing these topics efficiently.
      Make it easy to follow, optimized for retention, and in table format.
    `;

    // 🔧 FIXED: Directly await the function
    console.log("Prompt being sent:", prompt);
    const response = await fetchFromOpenRouter(prompt);

    res.status(200).json({ plan: response });
  } catch (error) {
    console.error("Schedule Generation Error:", error);
    res.status(500).json({ error: 'Something went wrong while generating the schedule.' });
  }

};






























// import { fetchFromOpenRouter } from '../utils/openAi.js';
// import  {fetchFromOpenRouter}  from "../utils/openAi";


// export const generateSchedule = async (req, res) => {
//   const { availableHours, deadline, topics } = req.body;

//   try {
//     // const prompt = `
//     //   I am a student with ${availableHours} hours available daily and a deadline on ${deadline}.
//     //   I need to complete the following topics: ${topics.join(', ')}.
//     //   Create a daily study plan by distributing these topics efficiently.
//     //   Make it easy to follow, optimized for retention, and in table format.
//     // `;

//     const prompt = `
// You are a helpful AI study planner.

// The student has ${availableHours} available study hours **per day**, and must complete the following topics: ${topics.join(', ')} by the deadline: ${deadline}.

// Please:
// - Calculate the number of days left (from today to the deadline inclusive).
// - Distribute the topics evenly across those days.
// - Use calendar dates instead of "Day 1", "Day 2", etc.
// - Output the plan in a clean table format like:

// | Date       | Topics to Study        | Suggested Time |
// |------------|------------------------|----------------|
// | 2025-05-05 | Docker Overview        | 2 hours        |

// Ensure the schedule fits within the given timeframe and does not exceed ${availableHours} hours per day.
// `;



//     const plan = await fetchFromOpenRouter(prompt); // ✅ Fix here
//     console.log("Final response from OpenRouter:", plan);
//     res.status(200).json({ plan }); // ✅ Return directly
//   } catch (error) {
//     console.error("Schedule Generation Error:", error); // Log full error
//     res.status(500).json({ error: 'Something went wrong while generating the schedule.' });
//   }
// };
