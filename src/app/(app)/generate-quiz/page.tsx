
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateCustomQuiz, GenerateCustomQuizOutput } from "@/ai/flows/generate-custom-quiz";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.enum(["easy", "medium", "hard"]),
  numberOfQuestions: z.coerce.number().min(1, "Please enter a number.").max(20, "Please enter a number less than 20."),
  style: z.string().optional(),
});

type Quiz = GenerateCustomQuizOutput["quiz"];

export default function GenerateQuizPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      difficulty: "medium",
      numberOfQuestions: 5,
      style: "multiple choice",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setQuiz(null);
    setShowResults(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    try {
      const result = await generateCustomQuiz(values);
      setQuiz(result.quiz);
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

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
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
    form.reset();
  }


  if (quiz && !showResults) {
    const question = quiz[currentQuestion];
    return (
      <div>
        <PageHeader title={form.getValues("topic")} description={`Question ${currentQuestion + 1} of ${quiz.length}`} />
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg font-semibold mb-4">{question.question}</p>
            <RadioGroup onValueChange={handleAnswerSelect} value={userAnswers[currentQuestion]} className="space-y-2">
              {question.answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={answer} id={`q${currentQuestion}-ans${index}`} />
                  <Label htmlFor={`q${currentQuestion}-ans${index}`} className="font-normal">{answer}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={handleNextQuestion} className="mt-6" disabled={!userAnswers[currentQuestion]}>
              {currentQuestion < quiz.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </CardContent>
        </Card>
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
          <CardContent className="pt-6">
            {quiz?.map((q, i) => (
              <div key={i} className="mb-4 p-4 border rounded-lg">
                <p className="font-semibold">{i + 1}. {q.question}</p>
                <p className={`mt-2 ${userAnswers[i] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>Your answer: {userAnswers[i]}</p>
                {userAnswers[i] !== q.correctAnswer && <p className="text-green-600">Correct answer: {q.correctAnswer}</p>}
              </div>
            ))}
            <Button onClick={resetQuiz} className="mt-4">Take another quiz</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Custom Quiz"
        description="Tailor quizzes by topic, difficulty, and length to fit your study needs."
      />

      <Card>
        <CardHeader>
          <CardTitle>Quiz Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Solar System" {...field} />
                    </FormControl>
                    <FormDescription>What topic should the quiz be about?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
