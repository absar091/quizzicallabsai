import { NextResponse } from "next/server";
import { generateFlashcards } from "@/ai/flows/generate-flashcards";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateFlashcards(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
