
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, ArrowLeft, ArrowRight, Bookmark, Clock, Download, Share2, MessageSquareQuote, History, Redo, LayoutDashboard } from "lucide-react";
import jsPDF from 'jspdf';


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateCustomQuiz, GenerateCustomQuizOutput } from "@/ai/flows/generate-custom-quiz";
import { generateExplanationsForIncorrectAnswers } from "@/ai/flows/generate-explanations-for-incorrect-answers";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";


const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  numberOfQuestions: z.number().min(1).max(55),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
  timeLimit: z.number().min(1).max(120),
});

type Quiz = GenerateCustomQuizOutput["quiz"];

interface ExplanationState {
  [questionIndex: number]: {
    isLoading: boolean;
    explanation: string | null;
  };
}

export default function GenerateQuizPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [explanations, setExplanations] = useState<ExplanationState>({});
  const [timeLeft, setTimeLeft] = useState(0);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      difficulty: "medium",
      numberOfQuestions: 10,
      questionTypes: ["multipleChoice"],
      timeLimit: 10,
    },
  });

  useEffect(() => {
    if (quiz && !showResults) {
      if (timeLeft === 0) {
        setTimeLeft(form.getValues("timeLimit") * 60);
      }
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowResults(true); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, showResults, timeLeft, form]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setQuiz(null);
    setShowResults(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setExplanations({});
    try {
      const result = await generateCustomQuiz({
        ...values,
        questionTypes: values.questionTypes.map(q => q === 'multipleChoice' ? 'Multiple Choice' : 'Fill in the Blank')
      });
      setQuiz(result.quiz);
      setTimeLeft(values.timeLimit * 60);
    } catch (error) {
      toast({
        title: "Error Generating Quiz",
        description: "An error occurred while generating the quiz. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < (quiz?.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  }, [currentQuestion, quiz?.length]);
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSkipQuestion = () => {
    handleNextQuestion();
  }


  const calculateScore = () => {
    return quiz?.reduce((score, question, index) => {
      return score + (question.correctAnswer === userAnswers[index] ? 1 : 0);
    }, 0) ?? 0;
  }

  const resetQuiz = () => {
    setQuiz(null);
    setShowResults(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowReview(false);
    form.reset();
  }

  const getExplanation = async (questionIndex: number) => {
    if (!quiz) return;

    setExplanations(prev => ({
        ...prev,
        [questionIndex]: { isLoading: true, explanation: null }
    }));
    
    try {
      const question = quiz[questionIndex];
      const result = await generateExplanationsForIncorrectAnswers({
        question: question.question,
        studentAnswer: userAnswers[questionIndex],
        correctAnswer: question.correctAnswer,
        topic: form.getValues("topic"),
      });

      setExplanations(prev => ({
        ...prev,
        [questionIndex]: { isLoading: false, explanation: result.explanation }
      }));

    } catch (error) {
       toast({
        title: "Error Generating Explanation",
        description: "An error occurred while generating the explanation. Please try again.",
        variant: "destructive",
      });
       setExplanations(prev => ({
        ...prev,
        [questionIndex]: { isLoading: false, explanation: "Failed to load explanation." }
      }));
    }
  }

  const downloadResultCard = () => {
    const doc = new jsPDF();
    const score = calculateScore();
    const total = quiz?.length ?? 0;
    const percentage = total > 0 ? (score / total) * 100 : 0;
    const status = percentage >= 50 ? "PASS" : "FAIL";

    doc.setFontSize(22);
    doc.text("Quiz Result", 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`Topic: ${form.getValues("topic")}`, 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`User: ${user?.displayName || 'N/A'}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50);

    doc.line(20, 60, 190, 60);

    doc.setFontSize(14);
    doc.text(`Obtained Marks: ${score} / ${total}`, 20, 70);
    doc.text(`Percentage: ${percentage.toFixed(2)}%`, 20, 80);
    doc.text(`Status: ${status}`, 20, 90);

    doc.line(20, 100, 190, 100);

    doc.setFontSize(10);
    doc.text("This is a computer-generated result card.", 105, 110, { align: 'center'});
    
    doc.save(`Quiz_Result_${form.getValues("topic")}.pdf`);
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Generating your quiz, please wait...</p>
      </div>
    )
  }

  if (quiz && !showResults) {
    const question = quiz[currentQuestion];
    const questionLetter = (index: number) => String.fromCharCode(65 + index);
    return (
        <div className="bg-background text-foreground min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold uppercase">{form.getValues("topic")}</h1>
                    <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                        <Clock className="h-6 w-6" />
                        <span className="text-xl font-semibold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <Progress value={((currentQuestion + 1) / quiz.length) * 100} className="mb-4 h-2 bg-muted-foreground/20 [&>div]:bg-primary" />
                
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" className="hover:bg-accent">
                        <Bookmark className="mr-2 h-5 w-5" />
                        Bookmark
                    </Button>
                    <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {quiz.length}</span>
                </div>

                <div className="bg-muted/30 p-8 rounded-xl">
                    <p className="text-xl font-semibold mb-8 text-center">{question.question}</p>
                    <RadioGroup onValueChange={handleAnswerSelect} value={userAnswers[currentQuestion]} className="space-y-4">
                      {question.answers.map((answer, index) => (
                        <div key={index} className="flex items-center space-x-4">
                           <RadioGroupItem value={answer} id={`q${currentQuestion}-ans${index}`} className="sr-only" />
                           <Label htmlFor={`q${currentQuestion}-ans${index}`} className={cn(
                                "flex-1 cursor-pointer rounded-lg border-2 p-4 transition-colors",
                                "border-border bg-muted/50 hover:bg-accent",
                                userAnswers[currentQuestion] === answer && "border-primary bg-primary/20"
                            )}>
                               <div className="flex items-center">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground mr-4">
                                     {questionLetter(index)}
                                 </div>
                                 <span className="font-medium">{answer}</span>
                               </div>
                           </Label>
                        </div>
                      ))}
                    </RadioGroup>
                </div>

                <div className="flex justify-between mt-8">
                     <Button onClick={handlePreviousQuestion} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" disabled={currentQuestion === 0}>
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back
                    </Button>
                    <div className="flex gap-4">
                      <Button onClick={handleSkipQuestion} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                          Skip
                      </Button>
                      <Button onClick={handleNextQuestion} className="bg-primary hover:bg-primary/90">
                          {currentQuestion < quiz.length - 1 ? "Next Question" : "Finish Quiz"}
                          <ArrowRight className="ml-2 h-4 w-4"/>
                      </Button>
                    </div>
                </div>
            </div>
        </div>
    )
  }

 if (showResults) {
    const score = calculateScore();
    const total = quiz?.length ?? 0;
    const percentage = total > 0 ? (score / total) * 100 : 0;
    const status = percentage >= 50 ? "PASS" : "FAIL";

    if (showReview) {
      return (
        <div>
          <PageHeader title="Review Answers" description={`You scored ${score} out of ${total}`} />
          <Card>
            <CardContent className="pt-6 space-y-4">
              {quiz?.map((q, i) => (
                <div key={i} className={cn("p-4 border rounded-lg", userAnswers[i] === q.correctAnswer ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10")}>
                  <p className="font-semibold">{i + 1}. {q.question}</p>
                  <p className={`mt-2 ${userAnswers[i] === q.correctAnswer ? 'text-green-500' : 'text-red-500'}`}>Your answer: {userAnswers[i] || "Not answered"}</p>
                  {userAnswers[i] !== q.correctAnswer && <p className="text-green-500">Correct answer: {q.correctAnswer}</p>}
                  
                  {userAnswers[i] !== q.correctAnswer && (
                    <div className="mt-4">
                      {explanations[i]?.isLoading ? (
                        <Button disabled size="sm" variant="outline">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Explanation
                        </Button>
                      ) : explanations[i]?.explanation ? (
                        <Alert>
                          <Sparkles className="h-4 w-4" />
                          <AlertTitle>Explanation</AlertTitle>
                          <AlertDescription>
                          {explanations[i].explanation}
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Button onClick={() => getExplanation(i)} size="sm" variant="outline">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get AI Explanation
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={() => setShowReview(false)} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="bg-background text-foreground min-h-screen p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold uppercase mb-2">Quiz Topic: {form.getValues("topic")}</h1>
        
        <div className="w-full max-w-3xl bg-muted/30 rounded-xl p-8 my-8 border">
            <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                    <p className="text-muted-foreground text-sm font-bold">OBTAINED MARKS</p>
                    <p className="text-5xl font-bold">{score} / {total}</p>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm font-bold">PERCENTAGE</p>
                    <p className="text-5xl font-bold">{percentage.toFixed(0)}%</p>
                </div>
                <div>
                    <p className="text-muted-foreground text-sm font-bold">STATUS</p>
                    <p className={cn("text-5xl font-bold", status === 'PASS' ? 'text-green-500' : 'text-red-500')}>{status}</p>
                </div>
            </div>
            <div className="text-center mt-8 text-xs text-muted-foreground">
                <p>This is a computer-generated result card. Date: {new Date().toLocaleDateString()}</p>
                <p>A Project By {user?.displayName || "a student"}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mb-4">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" onClick={downloadResultCard}>
                <Download className="mr-2"/>
                Download Result Card
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Share2 className="mr-2"/>
                Share Score
            </Button>
             <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowReview(true)}>
                <MessageSquareQuote className="mr-2"/>
                Review Answers
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <History className="mr-2"/>
                Study with Flashcards
            </Button>
        </div>
         <div className="flex gap-4 w-full max-w-4xl">
            <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1" onClick={resetQuiz}>
                <Redo className="mr-2"/>
                Retry Quiz
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white flex-1" onClick={() => window.location.href = '/dashboard'}>
                <LayoutDashboard className="mr-2"/>
                View Dashboard
            </Button>
        </div>
      </div>
    );
  }
  
  const questionTypes = [
    { id: "multipleChoice", label: "Multiple Choice" },
    { id: "fillInTheBlank", label: "Fill in the Blank" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
       <PageHeader
        title="Custom Quiz"
        description="Tailor quizzes by topic, difficulty, and length to fit your study needs."
      />
      
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Topic</FormLabel>
                        <FormDescription>What topic should the quiz be about?</FormDescription>
                        <FormControl>
                          <Input placeholder="e.g., The Solar System" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               
                  <FormField
                    control={form.control}
                    name="questionTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-lg">Question Types</FormLabel>
                          <FormDescription>Select the types of questions to include.</FormDescription>
                        </div>
                        <div className="space-y-2">
                        {questionTypes.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="questionTypes"
                            render={({ field }) => {
                              return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value ?? []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-base">{item.label}</FormLabel>
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
                         <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                          >
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="easy" id="easy" className="sr-only" />
                              </FormControl>
                              <Label htmlFor="easy" className="w-full text-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">Easy</Label>
                            </FormItem>
                             <FormItem>
                              <FormControl>
                                <RadioGroupItem value="medium" id="medium" className="sr-only" />
                              </FormControl>
                              <Label htmlFor="medium" className="w-full text-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">Medium</Label>
                            </FormItem>
                             <FormItem>
                              <FormControl>
                                <RadioGroupItem value="hard" id="hard" className="sr-only" />
                              </FormControl>
                              <Label htmlFor="hard" className="w-full text-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">Hard</Label>
                            </FormItem>
                              <FormItem>
                              <FormControl>
                                <RadioGroupItem value="master" id="master" className="sr-only" />
                              </FormControl>
                              <Label htmlFor="master" className="w-full text-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary">Master</Label>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Number of Questions: {field.value}</FormLabel>
                        <FormControl>
                           <Slider
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={55}
                            min={1}
                            step={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Time Limit (minutes): {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            max={120}
                            min={1}
                            step={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              
                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    "Generate Quiz"
                  )}
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
