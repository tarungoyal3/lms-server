export async function fetchFromOpenRouter(prompt) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_ROUTE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", 
          messages: [
            { role: "system", content: "You are a helpful assistant for smart scheduling." },
            { role: "user", content: prompt },
          ],
        }),
      });
  
      const data = await response.json();
  
      console.log("Full OpenRouter Response:", JSON.stringify(data, null, 2)); // Debug response
  
      // Safely access response content
      if (!data || !data.choices || !Array.isArray(data.choices) || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response structure from OpenRouter");
      }
  
      return data.choices[0].message.content;
  
    } catch (error) {
      console.error("Error in fetchFromOpenRouter:", error.message || error);
      return "Sorry, something went wrong while contacting the AI. Please try again later.";
    }
  }
  