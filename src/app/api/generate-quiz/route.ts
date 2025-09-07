import { NextResponse } from "next/server";
import { generateCustomQuiz } from "@/ai/flows/generate-custom-quiz";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateCustomQuiz(body);

    if (!result.quiz || result.quiz.length === 0) {
      throw new Error("The AI returned an empty quiz. This can happen with very niche topics. Please try broadening your topic or rephrasing your instructions.");
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
