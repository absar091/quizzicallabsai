
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, ArrowLeft, ArrowRight, Download, MessageSquareQuote, Redo, LayoutDashboard, Star, FileText, Settings, Eye, Brain, Lightbulb } from "lucide-react";
import jsPDF from 'jspdf';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateCustomQuiz, GenerateCustomQuizOutput } from "@/ai/flows/generate-custom-quiz";
import { generateExplanationsForIncorrectAnswers } from "@/ai/flows/generate-explanations-for-incorrect-answers";
import { generateSimpleExplanation } from "@/ai/flows/generate-simple-explanation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Clock } from "lucide-react";


const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  numberOfQuestions: z.number().min(1).max(55),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
  timeLimit: z.number().min(1).max(120),
});

export type Quiz = GenerateCustomQuizOutput["quiz"];

interface ExplanationState {
  [questionIndex: number]: {
    isLoading: boolean;
    explanation: string | null;
    isSimpleLoading: boolean;
    simpleExplanation: string | null;
  };
}

type BookmarkedQuestion = {
    question: string;
    correctAnswer: string;
    topic: string;
}

const questionTypeOptions = [
    { id: "Multiple Choice", label: "Multiple Choice" },
    { id: "Fill in the Blank", label: "Fill in the Blank" },
]

export default function GenerateQuizPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [explanations, setExplanations] = useState<ExplanationState>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      difficulty: "medium",
      numberOfQuestions: 10,
      questionTypes: ["Multiple Choice"],
      timeLimit: 10,
    },
  });

  const { trigger, getValues } = form;

  useEffect(() => {
    const savedState = sessionStorage.getItem("quizState");
    if (savedState) {
        const { quiz, currentQuestion, userAnswers, timeLeft, formValues, bookmarkedQuestions } = JSON.parse(savedState);
        setQuiz(quiz);
        setCurrentQuestion(currentQuestion);
        setUserAnswers(userAnswers);
        setTimeLeft(timeLeft);
        setBookmarkedQuestions(bookmarkedQuestions || []);
        form.reset(formValues);
    }
     const storedBookmarks = sessionStorage.getItem("bookmarkedQuestions");
    if (storedBookmarks) {
      setBookmarkedQuestions(JSON.parse(storedBookmarks));
    }
  }, [form]);

  useEffect(() => {
    if (quiz) {
      const quizState = {
        quiz,
        currentQuestion,
        userAnswers,
        timeLeft,
        formValues: form.getValues(),
        bookmarkedQuestions,
      };
      sessionStorage.setItem("quizState", JSON.stringify(quizState));
    } else {
        sessionStorage.removeItem("quizState");
    }
  }, [quiz, currentQuestion, userAnswers, timeLeft, form, bookmarkedQuestions]);
  

  useEffect(() => {
    if (quiz && !showResults && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, showResults, timeLeft]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };
  
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };


  const handleNext = () => {
    if (currentQuestion < (quiz?.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
        handleSubmit();
    }
  };

  const handleSubmit = useCallback(() => {
    setShowResults(true);
    const { score, percentage } = calculateScore();
    if(quiz) {
        const newResult = {
            topic: form.getValues("topic"),
            score,
            total: quiz.length,
            percentage,
            date: new Date().toISOString(),
        }
        const existingResults = JSON.parse(sessionStorage.getItem("quizResults") || "[]");
        sessionStorage.setItem("quizResults", JSON.stringify([newResult, ...existingResults]));
    }

  }, [quiz, userAnswers, form]);


  const calculateScore = useCallback(() => {
    if (!quiz) return { score: 0, percentage: 0 };
    const score = quiz.reduce((acc, question, index) => {
      return acc + (question.correctAnswer === userAnswers[index] ? 1 : 0);
    }, 0);
    const percentage = (score / quiz.length) * 100;
    return { score, percentage };
  }, [quiz, userAnswers]);

  const getExplanation = async (questionIndex: number) => {
    if (!quiz) return;
    const question = quiz[questionIndex];
    setExplanations((prev) => ({
      ...prev,
      [questionIndex]: { ...prev[questionIndex], isLoading: true, explanation: null },
    }));

    try {
      const result = await generateExplanationsForIncorrectAnswers({
        question: question.question,
        studentAnswer: userAnswers[questionIndex],
        correctAnswer: question.correctAnswer,
        topic: form.getValues("topic"),
      });
      setExplanations((prev) => ({
        ...prev,
        [questionIndex]: { ...prev[questionIndex], isLoading: false, explanation: result.explanation },
      }));
    } catch (error) {
      toast({
        title: "Error Generating Explanation",
        description: "An error occurred while generating the explanation. Please try again.",
        variant: "destructive",
      });
       setExplanations((prev) => ({
        ...prev,
        [questionIndex]: { ...prev[questionIndex], isLoading: false, explanation: "Could not load explanation." },
      }));
      console.error(error);
    }
  };
  
  const getSimpleExplanation = async (questionIndex: number) => {
    if (!quiz) return;
    const question = quiz[questionIndex];
    setExplanations((prev) => ({
      ...prev,
      [questionIndex]: { ...prev[questionIndex], isSimpleLoading: true, simpleExplanation: null },
    }));
    
    try {
        const result = await generateSimpleExplanation({
            question: question.question,
            correctAnswer: question.correctAnswer,
            topic: form.getValues("topic"),
        });
        setExplanations((prev) => ({
            ...prev,
            [questionIndex]: { ...prev[questionIndex], isSimpleLoading: false, simpleExplanation: result.explanation },
        }));
    } catch (error) {
        toast({
            title: "Error Simplifying",
            description: "Could not generate a simpler explanation at this time.",
            variant: "destructive",
        });
        setExplanations((prev) => ({
            ...prev,
            [questionIndex]: { ...prev[questionIndex], isSimpleLoading: false, simpleExplanation: "Could not load simple explanation." },
        }));
    }
  }


  const downloadQuestions = () => {
    if (!quiz) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Quiz on: ${form.getValues('topic')}`, 10, 10);
    doc.setFontSize(12);
    let y = 20;

    quiz.forEach((q, i) => {
        if (y > 280) { // check for page break
            doc.addPage();
            y = 10;
        }
        const questionText = doc.splitTextToSize(`${i + 1}. ${q.question}`, 180);
        doc.text(questionText, 10, y);
        y += (questionText.length * 5) + 5;

        q.answers.forEach((a) => {
            const answerText = doc.splitTextToSize(`- ${a}`, 170);
            if (y + (answerText.length * 4) + 2 > 280) {
                 doc.addPage();
                 y = 10;
            }
            doc.text(answerText, 15, y);
            y += (answerText.length * 4) + 2;
        });

        const correctAnswerText = doc.splitTextToSize(`Correct Answer: ${q.correctAnswer}`, 170);
        doc.setFont('helvetica', 'bold');
        if (y + (correctAnswerText.length * 5) + 10 > 280) {
            doc.addPage();
            y = 10;
        }
        doc.text(correctAnswerText, 15, y);
        doc.setFont('helvetica', 'normal');

        y += (correctAnswerText.length * 5) + 10;
    });

    doc.save('quiz_questions.pdf');
  };

  const downloadResultCard = () => {
    const { score, percentage } = calculateScore();
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("Quiz Result Card", 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`Student: ${user?.displayName || 'N/A'}`, 20, 40);
    doc.text(`Topic: ${form.getValues('topic')}`, 20, 50);

    doc.setFontSize(16);
    doc.text(`Score: ${score}/${quiz?.length}`, 20, 70);
    doc.text(`Percentage: ${percentage.toFixed(2)}%`, 20, 80);
    doc.text(`Status: ${percentage >= 50 ? 'Pass' : 'Fail'}`, 20, 90);

    doc.save('quiz_result_card.pdf');
  };
  
  const toggleBookmark = (question: string, correctAnswer: string) => {
    const topic = form.getValues("topic");
    const newBookmark: BookmarkedQuestion = { question, correctAnswer, topic };
    let updatedBookmarks;

    if (bookmarkedQuestions.some(bm => bm.question === question)) {
      updatedBookmarks = bookmarkedQuestions.filter(bm => bm.question !== question);
    } else {
      updatedBookmarks = [...bookmarkedQuestions, newBookmark];
    }
    
    setBookmarkedQuestions(updatedBookmarks);
    sessionStorage.setItem("bookmarkedQuestions", JSON.stringify(updatedBookmarks));
  };


  const resetQuiz = () => {
    setQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setExplanations({});
    setStep(1);
    sessionStorage.removeItem("quizState");
    form.reset();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setExplanations({});
    
    try {
      const result = await generateCustomQuiz(values);
      setQuiz(result.quiz);
      setUserAnswers(new Array(result.quiz.length).fill(""));
      setTimeLeft(values.timeLimit * 60);
    } catch (error: any) {
        let errorMessage = "An unknown error occurred.";
        if (error.message.includes("503") || error.message.includes("overloaded")) {
            errorMessage = "The AI model is currently overloaded. Please try again in a few moments.";
        }
      toast({
        title: "Error Generating Quiz",
        description: errorMessage,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger("topic");
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(["difficulty", "numberOfQuestions", "questionTypes", "timeLimit"]);
      if(isValid) setStep(3);
    }
  };

  const prevStep = () => setStep(step - 1);


  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Generating Your Quiz...</h2>
        <p className="text-muted-foreground">Please wait while our AI crafts the perfect quiz for you.</p>
      </div>
    );
  }

  if (quiz && !showResults) {
    const currentQ = quiz[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.length) * 100;
    const isBookmarked = bookmarkedQuestions.some(bm => bm.question === currentQ.question);

    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="shadow-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold uppercase tracking-widest">{form.getValues("topic")}</h2>
                <div className="flex items-center gap-2 bg-muted text-muted-foreground px-3 py-1.5 rounded-full text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <Progress value={progress} className="mb-4 h-2" />

              <div className="flex justify-between items-center mb-8 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" onClick={() => toggleBookmark(currentQ.question, currentQ.correctAnswer)}>
                  <Star className={cn("mr-2 h-4 w-4", isBookmarked && "text-yellow-400 fill-yellow-400")} />
                  Bookmark
                </Button>
                <span>Question {currentQuestion + 1} of {quiz.length}</span>
              </div>

              <p className="text-center text-xl font-semibold mb-8 min-h-[60px]">
                {currentQ.question}
              </p>

              <div className="space-y-4 mb-8">
                {currentQ.answers.map((answer, index) => {
                  const letter = String.fromCharCode(65 + index); // A, B, C, D
                  const isSelected = userAnswers[currentQuestion] === answer;
                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      className="w-full justify-start h-auto py-3 text-base whitespace-normal text-left leading-snug"
                      onClick={() => handleAnswer(answer)}
                    >
                      <div className={cn("flex items-center justify-center h-6 w-6 rounded-full mr-4 text-xs shrink-0", isSelected ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground")}>
                        {letter}
                      </div>
                      <span className="flex-1">{answer}</span>
                    </Button>
                  )
                })}
              </div>

              <div className="flex justify-between">
                 <Button size="lg" onClick={handleBack} disabled={currentQuestion === 0} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button size="lg" onClick={handleNext}>
                  {currentQuestion === quiz.length - 1 ? "Finish Quiz" : "Next Question"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (showResults && quiz) {
    const { score, percentage } = calculateScore();
    const incorrectAnswers = quiz.map((q, i) => ({ ...q, userAnswer: userAnswers[i] })).filter((q, i) => q.correctAnswer !== userAnswers[i]);

    return (
       <div className="max-w-4xl mx-auto p-4 md:p-8">
            <PageHeader title="Quiz Results" description={`You scored ${score} out of ${quiz.length}.`} />
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                         <CardTitle>Result Details</CardTitle>
                         <div className="flex gap-2">
                            <Button variant="outline" onClick={downloadQuestions}><Download className="mr-2 h-4 w-4" /> Questions</Button>
                            <Button onClick={downloadResultCard}><Download className="mr-2 h-4 w-4" /> Result Card</Button>
                         </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                        <Card>
                            <CardHeader><CardTitle>Marks Obtained</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{score}/{quiz.length}</p></CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Percentage</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{percentage.toFixed(2)}%</p></CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                            <CardContent><p className={cn("text-3xl font-bold", percentage >= 50 ? "text-primary" : "text-destructive")}>{percentage >= 50 ? 'Pass' : 'Fail'}</p></CardContent>
                        </Card>
                    </div>

                    {incorrectAnswers.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Review Incorrect Answers</h3>
                            <div className="space-y-4">
                                {incorrectAnswers.map((q, index) => {
                                    const originalIndex = quiz.findIndex(originalQ => originalQ.question === q.question);
                                    const explanationState = explanations[originalIndex];
                                    return (
                                        <Card key={index} className="bg-muted/30">
                                            <CardContent className="pt-6">
                                                <p className="font-semibold">{index + 1}. {q.question}</p>
                                                <p className="text-sm text-destructive mt-2">Your answer: {q.userAnswer || "Skipped"}</p>
                                                <p className="text-sm text-primary">Correct answer: {q.correctAnswer}</p>
                                                
                                                <div className="space-y-2 mt-4">
                                                    {explanationState?.explanation && (
                                                        <Alert className="border-blue-500/50 text-blue-900 dark:text-blue-200 bg-blue-500/10">
                                                            <AlertTitle className="text-blue-600 dark:text-blue-300 flex items-center gap-2"><Brain className="h-4 w-4" /> Detailed Explanation</AlertTitle>
                                                            <AlertDescription>{explanationState.explanation}</AlertDescription>
                                                        </Alert>
                                                    )}
                                                    {explanationState?.simpleExplanation && (
                                                         <Alert className="border-purple-500/50 text-purple-900 dark:text-purple-200 bg-purple-500/10">
                                                            <AlertTitle className="text-purple-600 dark:text-purple-300 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Simple Explanation</AlertTitle>
                                                            <AlertDescription>{explanationState.simpleExplanation}</AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 items-center mt-4">
                                                    {!explanationState?.isLoading && !explanationState?.explanation && (
                                                         <Button variant="link" size="sm" onClick={() => getExplanation(originalIndex)} className="px-0 h-auto">
                                                            <MessageSquareQuote className="mr-2 h-4 w-4"/> Get AI Explanation
                                                        </Button>
                                                    )}
                                                    {explanationState?.isLoading && <div className="flex items-center text-sm"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting explanation...</div>}
                                                    
                                                     {!explanationState?.isSimpleLoading && !explanationState?.simpleExplanation && (
                                                         <Button variant="link" size="sm" onClick={() => getSimpleExplanation(originalIndex)} className="px-0 h-auto text-purple-600">
                                                            <Lightbulb className="mr-2 h-4 w-4"/> Explain Like I'm 5
                                                        </Button>
                                                    )}
                                                    {explanationState?.isSimpleLoading && <div className="flex items-center text-sm"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Simplifying...</div>}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </CardContent>
                 <CardFooter className="flex justify-center gap-2 pt-4 border-t">
                    <Button onClick={resetQuiz}><Redo className="mr-2 h-4 w-4" /> Take Again</Button>
                    <Button variant="outline" asChild><a href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4"/> Back to Dashboard</a></Button>
                </CardFooter>
            </Card>
       </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">What topic do you want a quiz on?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Solar System, World War II, React Hooks" {...field} className="text-base py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        );
      case 2:
        return (
          <CardContent className="pt-6 space-y-6">
            <FormField
              control={form.control}
              name="questionTypes"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg">Question Types</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {questionTypeOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="questionTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValue, item.id])
                                      : field.onChange(
                                          currentValue?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex-1">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Difficulty</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2"
                  >
                    {["easy", "medium", "hard", "master"].map((level) => (
                       <FormItem key={level} className="flex-1">
                          <FormControl>
                             <RadioGroupItem value={level} id={level} className="sr-only peer" />
                          </FormControl>
                          <Label htmlFor={level} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Label>
                        </FormItem>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfQuestions"
              render={({ field }) => (
                 <FormItem>
                  <FormLabel className="text-lg">Number of Questions: <span className="text-primary font-bold">{field.value}</span></FormLabel>
                   <FormControl>
                      <Slider
                          onValueChange={(value) => field.onChange(value[0])}
                          defaultValue={[field.value]}
                          max={55}
                          min={1}
                          step={1}
                      />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeLimit"
              render={({ field }) => (
                 <FormItem>
                  <FormLabel className="text-lg">Time Limit (Minutes): <span className="text-primary font-bold">{field.value}</span></FormLabel>
                   <FormControl>
                      <Slider
                          onValueChange={(value) => field.onChange(value[0])}
                          defaultValue={[field.value]}
                          max={120}
                          min={1}
                          step={1}
                      />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        );
        case 3: {
            const values = getValues();
            return (
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Review your quiz details:</h3>
                        <div className="p-4 border rounded-lg bg-muted/50 space-y-2 text-sm">
                            <p><strong>Topic:</strong> {values.topic}</p>
                            <p><strong>Difficulty:</strong> <span className="capitalize">{values.difficulty}</span></p>
                            <p><strong>Question Types:</strong> {values.questionTypes.join(', ')}</p>
                            <p><strong>Number of Questions:</strong> {values.numberOfQuestions}</p>
                            <p><strong>Time Limit:</strong> {values.timeLimit} minutes</p>
                        </div>
                    </div>
                </CardContent>
            )
        }
      default:
        return null;
    }
  };

   const stepTitles = [
    { icon: FileText, title: "Enter Topic", description: "What subject do you want a quiz on?" },
    { icon: Settings, title: "Customize Quiz", description: "Adjust the quiz settings to your needs." },
    { icon: Eye, title: "Review & Generate", description: "Confirm your settings and create the quiz." },
  ];

  return (
    <div>
      <PageHeader
        title={stepTitles[step - 1].title}
        description={stepTitles[step - 1].description}
      />

      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="transition-all duration-500">
                {renderStep()}
              </div>
              <CardFooter className="pt-6 border-t flex justify-between">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                {step < 3 && (
                  <Button type="button" onClick={nextStep} className={step === 1 ? 'w-full ml-auto' : ''}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {step === 3 && (
                  <Button type="submit" size="lg" className="w-full text-lg ml-auto" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Crafting Your Quiz...
                      </>
                    ) : (
                       <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Quiz with AI
                       </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
