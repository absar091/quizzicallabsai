
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, ArrowLeft, ArrowRight, Bookmark, Clock } from "lucide-react";

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


const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  numberOfQuestions: z.number().min(1).max(20),
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [explanations, setExplanations] = useState<ExplanationState>({});
  const [step, setStep] = useState(1);
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
    setStep(1);
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
        <div className="bg-gray-900 text-white min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold uppercase">{form.getValues("topic")}</h1>
                    <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                        <Clock className="h-6 w-6" />
                        <span className="text-xl font-semibold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <Progress value={((currentQuestion + 1) / quiz.length) * 100} className="mb-4 h-2 bg-gray-700 [&>div]:bg-green-500" />
                
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" className="hover:bg-gray-700">
                        <Bookmark className="mr-2 h-5 w-5" />
                        Bookmark
                    </Button>
                    <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {quiz.length}</span>
                </div>

                <div className="bg-gray-800 p-8 rounded-xl">
                    <p className="text-xl font-semibold mb-8 text-center">{question.question}</p>
                    <RadioGroup onValueChange={handleAnswerSelect} value={userAnswers[currentQuestion]} className="space-y-4">
                      {question.answers.map((answer, index) => (
                        <div key={index} className="flex items-center space-x-4">
                           <RadioGroupItem value={answer} id={`q${currentQuestion}-ans${index}`} className="sr-only" />
                           <Label htmlFor={`q${currentQuestion}-ans${index}`} className={cn(
                                "flex-1 cursor-pointer rounded-lg border-2 p-4 transition-colors",
                                "border-gray-600 bg-gray-700 hover:bg-gray-600",
                                userAnswers[currentQuestion] === answer && "border-primary bg-primary/20"
                            )}>
                               <div className="flex items-center">
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-500 mr-4">
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
    return (
       <div>
        <PageHeader title="Quiz Results" description={`You scored ${score} out of ${total}`} />
        <Card>
          <CardContent className="pt-6 space-y-4">
            {quiz?.map((q, i) => (
              <div key={i} className={cn("p-4 border rounded-lg", userAnswers[i] === q.correctAnswer ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                <p className="font-semibold">{i + 1}. {q.question}</p>
                <p className={`mt-2 ${userAnswers[i] === q.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>Your answer: {userAnswers[i] || "Not answered"}</p>
                {userAnswers[i] !== q.correctAnswer && <p className="text-green-700">Correct answer: {q.correctAnswer}</p>}
                
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
            <Button onClick={resetQuiz} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Take another quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const questionTypes = [
    { id: "multipleChoice", label: "Multiple Choice" },
    { id: "fillInTheBlank", label: "Fill in the Blank" },
  ];

  return (
    <div>
       <PageHeader
        title={step === 1 ? "Custom Quiz" : "Fine-tune your quiz settings"}
        description={step === 1 ? "Tailor quizzes by topic, difficulty, and length to fit your study needs." : "Customize the details of your quiz."}
      />
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               {step === 1 && (
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
               )}
              
               {step === 2 && (
                 <>
                  <Progress value={50} className="w-full" />
                  <FormField
                    control={form.control}
                    name="questionTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-lg">Question Types</FormLabel>
                          <FormDescription>Select the types of questions to include.</FormDescription>
                        </div>
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
                                  <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
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
                              <Label htmlFor="easy" className="w-full text-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">Easy</Label>
                            </FormItem>
                             <FormItem>
                              <FormControl>
                                <RadioGroupItem value="medium" id="medium" className="sr-only" />
                              </FormControl>
                              <Label htmlFor="medium" className="w-full text-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">Medium</Label>
                            </FormItem>
                             <FormItem>
                              <FormControl>
                                <RadioGroupItem value="hard" id="hard" className="sr-only" />
                              </FormControl>
                              <Label htmlFor="hard" className="w-full text-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">Hard</Label>
                            </FormItem>
                              <FormItem>
                              <FormControl>
                                <RadioGroupItem value="master" id="master" className="sr-only" />
                              </FormControl>
                              <Label htmlFor="master" className="w-full text-center p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground">Master</Label>
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
                            max={20}
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
                  </>
               )}
              
              <div className="flex justify-between">
                {step === 2 && (
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back
                  </Button>
                )}
                
                <div className={cn(step === 1 && "w-full")}>
                  {step === 1 ? (
                    <Button type="button" className="w-full" onClick={() => setStep(2)} disabled={!form.getValues('topic')}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Quiz...
                        </>
                      ) : (
                        "Generate Quiz"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
