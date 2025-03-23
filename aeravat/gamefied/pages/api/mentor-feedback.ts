import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY!);


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }


  const { code, output } = req.body;


  if (!code || !output) {
    return res.status(400).json({ error: "Missing code or output" });
  }


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


    const prompt = `
You are an expert programming mentor with decades of experience.
Your job is to review the student's code and its output.


Student's Code:
\`\`\`javascript
${code}
\`\`\`


Code Output:
\`\`\`
${output}
\`\`\`


Give the student guidance on how they can improve their code, suggest better practices, and point out any issues.
Don't give them direct answers or solutions. Encourage them to think and guide them in a friendly, helpful way.
`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();


    res.status(200).json({ feedback: text });
  } catch (error: any) {
    console.error("Mentor Feedback Error:", error);
    res.status(500).json({ error: "Failed to get mentor feedback" });
  }
}





