import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }


  try {
    const { code } = req.body;


    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }


    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!, // Store this in .env.local
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 63 // JavaScript (Node.js)
        })
      }
    );


    if (!response.ok) {
      const errorText = await response.text();
      console.error("Judge0 API Error:", errorText);
      return res
        .status(response.status)
        .json({ error: "Failed to execute code" });
    }


    const result = await response.json();


    res.status(200).json({
      output:
        result.stdout ||
        result.stderr ||
        result.compile_output ||
        "No output received."
    });
  } catch (error: any) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}





