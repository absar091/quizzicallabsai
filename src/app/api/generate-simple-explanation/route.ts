import { NextResponse } from "next/server";
import { generateSimpleExplanation } from "@/ai/flows/generate-simple-explanation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateSimpleExplanation(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate simple explanation" },
      { status: 500 }
    );
  }
}
