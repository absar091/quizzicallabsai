import 'server-only';

// Server-only AI functions
export async function generateCustomQuizServer(input: any) {
  const { generateCustomQuiz } = await import('./flows/generate-custom-quiz');
  return generateCustomQuiz(input);
}

export async function generateStudyGuideServer(input: any) {
  const { generateStudyGuide } = await import('./flows/generate-study-guide');
  return generateStudyGuide(input);
}

export async function generateQuizFromDocumentServer(input: any) {
  const { generateQuizFromDocument } = await import('./flows/generate-quiz-from-document');
  return generateQuizFromDocument(input);
}

export async function generateExamPaperServer(input: any) {
  const { generateExamPaper } = await import('./flows/generate-exam-paper');
  return generateExamPaper(input);
}

export async function generateExplanationsServer(input: any) {
  const { generateExplanationsForIncorrectAnswers } = await import('./flows/generate-explanations-for-incorrect-answers');
  return generateExplanationsForIncorrectAnswers(input);
}

export async function generateSimpleExplanationServer(input: any) {
  const { generateSimpleExplanation } = await import('./flows/generate-simple-explanation');
  return generateSimpleExplanation(input);
}

export async function generateNtsQuizServer(input: any) {
  const { generateNtsQuiz } = await import('./flows/generate-nts-quiz');
  return generateNtsQuiz(input);
}