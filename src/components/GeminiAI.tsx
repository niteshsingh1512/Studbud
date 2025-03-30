import axios from "axios";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-2.0:generateText";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ;

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        prompt: { text: prompt },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data?.candidates?.[0]?.output || "No response from Gemini.";
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Error: Unable to fetch response.";
  }
}

// Example usage
(async () => {
  const prompt = "Explain the concept of machine learning in simple terms.";
  const response = await getGeminiResponse(prompt);
  console.log("Gemini Response:", response);
})();
