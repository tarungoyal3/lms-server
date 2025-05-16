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


























