import { NextResponse } from "next/server";
import { generateCustomQuiz } from "@/ai/flows/generate-custom-quiz";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateCustomQuiz(body);

    if (!result.quiz || result.quiz.length === 0) {
      throw new Error("The AI failed to generate any questions. Please try refining your topic.");
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}
