import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateChangeNotes(
  filename: string,
  beforeCode: string,
  afterCode: string
): Promise<string> {
  const prompt = `
You are an expert senior software engineer and a world-class technical writer specializing in code review and release notes.

Your task is to analyze the provided code changes for a given file and generate detailed, clear, and concise change notes.

**File Name:**
${filename}

**Code Before:**
\`\`\`
${beforeCode}
\`\`\`

**Code Now:**
\`\`\`
${afterCode}
\`\`\`

**Instructions:**

Based on the changes between "Code Before" and "Code Now", generate a detailed code change note. The note should be well-structured and include the following sections if applicable:

1.  **Summary of Changes:** A high-level overview of what was changed.
2.  **Detailed Analysis:**
    *   **Behavior Before:** Describe the functionality, logic, and potential performance characteristics of the old code.
    *   **Behavior Now:** Describe the new functionality, logic, and how it differs from the old version.
    *   **Reason for Change:** Infer the likely reason for the change (e.g., bug fix, feature addition, performance optimization, refactoring for readability).
3.  **Impact Assessment:**
    *   **Performance:** Analyze any potential performance improvements or regressions.
    *   **Readability & Maintainability:** Comment on how the changes affect the code's clarity and ease of future maintenance.
    *   **Potential Risks:** Highlight any potential new bugs or edge cases introduced by the change.

Format the output in Markdown for clear readability. Use headings, bold text, and bullet points to structure the information effectively.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(
      "Failed to generate change notes. Please check your API key and network connection."
    );
  }
}
