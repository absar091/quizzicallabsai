import { NextResponse } from "next/server";
import { generateCustomQuiz } from "@/ai/flows/generate-custom-quiz";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Generating quiz for:', body.topic);

    // Additional topic validation
    if (!body.topic || body.topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required. Please enter a valid topic." },
        { status: 400 }
      );
    }

    // Validate number of questions
    if (body.numberOfQuestions && (body.numberOfQuestions < 1 || body.numberOfQuestions > 55)) {
      return NextResponse.json(
        { error: "Number of questions must be between 1 and 55." },
        { status: 400 }
      );
    }

    const result = await generateCustomQuiz(body);

    if (!result) {
      throw new Error("Failed to generate quiz content. The AI service may be unavailable.");
    }

    if (!result.quiz) {
      throw new Error("No quiz data was generated. Please try again.");
    }

    if (!Array.isArray(result.quiz) || result.quiz.length === 0) {
      throw new Error("The AI returned an empty quiz. This can happen with very niche topics. Please try broadening your topic or rephrasing your instructions.");
    }

    // Validate quiz structure
    for (const question of result.quiz) {
      if (!question.question || question.question.trim().length === 0) {
        throw new Error("Generated quiz contains invalid questions. Please try again.");
      }
    }

    console.log(`Quiz generated successfully: ${result.quiz.length} questions`);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    let statusCode = 500;
    let errorMessage = "Failed to generate quiz content";

    // Handle specific error types
    if (error.message.includes("rate limit") || error.message.includes("429")) {
      statusCode = 429;
      errorMessage = "AI service rate limit reached. Please wait a moment and try again.";
    } else if (error.message.includes("overloaded") || error.message.includes("503")) {
      statusCode = 503;
      errorMessage = "AI service is currently overloaded. Please try again in a few minutes.";
    } else if (error.message.includes("timeout")) {
      statusCode = 408;
      errorMessage = "Request timed out. Please try again.";
    } else if (error.message.includes("Empty") || error.message.includes("no quiz")) {
      statusCode = 422;
      errorMessage = error.message; // Use the specific error message
    }

    return NextResponse.json(
      { error: errorMessage, originalError: error.message },
      { status: statusCode }
    );
  }
}
