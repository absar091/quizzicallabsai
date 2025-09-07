import { NextResponse } from "next/server";
import { generateExplanationsForIncorrectAnswers } from "@/ai/flows/generate-explanations-for-incorrect-answers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateExplanationsForIncorrectAnswers(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
