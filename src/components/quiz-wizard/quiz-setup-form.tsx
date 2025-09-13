"use client";

import * as z from "zod";
import { useFormContext } from "react-hook-form";
import { Puzzle } from "lucide-react";
import { FileText } from "lucide-react";
import { Brain } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { BarChart } from "lucide-react";
import { BookCopy } from "lucide-react";
import { MessageSquareQuote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { ShieldAlert } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const formSchema = z.object({
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  numberOfQuestions: z.number().min(1).max(55),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
  questionStyles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question style.",
  }),
  timeLimit: z.number().min(1).max(120),
  specificInstructions: z.string().optional(),
});

export type QuizFormValues = z.infer<typeof formSchema>;

const questionTypeOptions = [
  { id: "Multiple Choice", label: "Multiple Choice", icon: Puzzle },
  { id: "Descriptive", label: "Short/Long Answer", icon: FileText },
];

const questionStyleOptions = [
  { id: "Knowledge-based", label: "Knowledge-based", icon: Brain },
  { id: "Conceptual", label: "Conceptual", icon: Lightbulb },
  { id: "Numerical", label: "Numerical", icon: BarChart },
  { id: "Past Paper Style", label: "Past Paper Style", icon: BookCopy },
  { id: "Comprehension-based MCQs", label: "Comprehension-based", icon: MessageSquareQuote },
];

interface QuizSetupFormProps {
  onGenerateQuiz: (values: QuizFormValues) => void;
}

export default function QuizSetupForm({ onGenerateQuiz }: QuizSetupFormProps) {
  const form = useFormContext<QuizFormValues>();
  const watchQuestionStyles = form.watch('questionStyles');

  const handleBackgroundSubmit = async (values: QuizFormValues) => {
    try {
      // Use the new background generation system
      const { useBackgroundJob } = await import('@/services/background-job-manager');
      const { startBackgroundQuizGeneration } = useBackgroundJob();

      const jobId = await startBackgroundQuizGeneration(values);
      console.log('🎯 Background job started:', jobId);

      // Let the user know
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: "📤 Generation Started!",
        description: "Your quiz is being generated in the background. You'll be notified when it's ready!",
      });

    } catch (error) {
      console.error('Error starting background generation:', error);
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: "❌ Failed to start generation",
        description: "Please try again or use the regular generation method.",
        variant: "destructive",
      });
      // Fallback to the original method
      onGenerateQuiz(values);
    }
  };

  return (
    <div>
      <PageHeader
        title="Custom Quiz Generator"
        description="Create personalized tests on any topic, with custom difficulty and question styles."
      />

      {/* Background Generation Info */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          🚀 Smart Background Generation
        </h3>
        <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
          Generate quizzes in the background! Continue using the app while AI creates your perfect quiz. Get notified when it's ready.
        </p>
        <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <li>✅ Keep using other app features while generating</li>
          <li>🔔 Get desktop/browser notifications when ready</li>
          <li>🔄 Resume interrupted generations</li>
          <li>📱 Works perfectly on mobile devices</li>
        </ul>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          type="button"
          size="lg"
          className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 shadow-xl border-0 font-bold"
          onClick={form.handleSubmit(handleBackgroundSubmit)}
        >
          🔄 Generate in Background
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="flex-1 border-2"
          onClick={form.handleSubmit(onGenerateQuiz)}
        >
          ⚡ Quick Generate
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-6">
        💡 <strong>Background Generation</strong> is perfect for complex topics that take longer to generate.
        You'll be notified when ready!
      </div>

      {/* Form Structure */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onGenerateQuiz)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., History of Renaissance, Quantum Physics, World War II" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="easy" id="easy" />
                          <Label htmlFor="easy">Easy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hard" id="hard" />
                          <Label htmlFor="hard">Hard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="master" id="master" />
                          <Label htmlFor="master">Master</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Quiz Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="questionTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>Question Types</FormLabel>
                    <div className="grid grid-cols-1 gap-4 pt-2">
                      {questionTypeOptions.map((item) => (

                      <FormField
                        key={item.id}
                        control={form.control}
                        name="questionTypes"
                        render={({ field }) => {
                          return (
                            <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border p-4 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex-1 flex items-center gap-2">
                                <item.icon className="h-4 w-4"/>
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionStyles"
              render={() => (
                <FormItem>
                  <FormLabel>Question Styles</FormLabel>
                  {watchQuestionStyles.includes('Comprehension-based MCQs') && (
                    <Alert className="mt-2 text-xs p-2">
                      <AlertTriangle className="h-4 w-4"/>
                      <AlertDescription>
                        When 'Comprehension-based' is selected, the AI will generate a reading passage for the quiz.
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {questionStyleOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="questionStyles"
                        render={({ field }) => {
                          return (
                            <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border p-4 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer flex-1 flex items-center gap-2">
                                <item.icon className="h-4 w-4"/>
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
              name="numberOfQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions: <span className="text-primary font-bold">{field.value}</span></FormLabel>
                  <FormControl>
                    <Slider onValueChange={(value) => field.onChange(value[0])} defaultValue={[field.value]} max={55} min={1} step={1} />
                  </FormControl>
                  <Alert className="mt-2 text-xs p-2">
                    <AlertTriangle className="h-4 w-4"/>
                    <AlertDescription>
                      The AI-generated count may sometimes vary slightly from your selection.
                    </AlertDescription>
                  </Alert>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Limit (Minutes): <span className="text-primary font-bold">{field.value}</span></FormLabel>
                  <FormControl>
                    <Slider onValueChange={(value) => field.onChange(value[0])} defaultValue={[field.value]} max={120} min={1} step={1} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Fine-Tuning (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="specificInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Instructions for the AI</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Focus on the contributions of Louis Pasteur. Include questions about the 19th-century scientific context."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Sparkles className="mr-2 h-5 w-5"/>
          Generate Quiz
        </Button>
      </form>
    </div>
  );
}
