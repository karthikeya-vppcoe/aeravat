import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Models } from "groq-sdk/resources/models.mjs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: messages
        }
      ],
      model: "llama3-8b-8192"
    });

    const responseMessage =
      chatCompletion.choices[0].message.content || "No response from llama";

    return NextResponse.json({ response: responseMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
