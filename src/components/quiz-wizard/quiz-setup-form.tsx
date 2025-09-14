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
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
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

  const handleSubmit = (values: QuizFormValues) => {
    console.log('🎯 Form submitted with values:', values);
    onGenerateQuiz(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <PageHeader
        title="Custom Quiz Generator"
        description="Create personalized tests on any topic, with custom difficulty and question styles."
      />

      {/* Topic Input Field - Enhanced with Larger Size */}
      <FormField
        control={form.control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xl font-semibold">Quiz Topic *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., MDCAT Biology - Cell Structure, Algebra Basics, Newton's Laws..."
                {...field}
                className="text-xl py-4 px-5 h-16 border-2 focus:border-primary transition-colors font-medium"
              />
            </FormControl>
            <FormMessage />
            <Alert className="mt-3 p-3 bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600"/>
              <AlertDescription className="text-blue-800">
                Be specific! Include subject and chapter name for best results.
              </AlertDescription>
            </Alert>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="difficulty"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Difficulty Level</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {[
                  { value: "easy", label: "Easy", description: "Basic concepts", color: "bg-green-100 border-green-300 text-green-900 hover:bg-green-200" },
                  { value: "medium", label: "Medium", description: "Moderate complexity", color: "bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200" },
                  { value: "hard", label: "Hard", description: "Advanced concepts", color: "bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200" },
                  { value: "master", label: "Master", description: "MDCAT/ETEA standard", color: "bg-red-100 border-red-300 text-red-900 hover:bg-red-200" }
                ].map((difficulty) => (
                  <div key={difficulty.value}>
                    <input
                      type="radio"
                      id={difficulty.value}
                      value={difficulty.value}
                      checked={field.value === difficulty.value}
                      onChange={() => field.onChange(difficulty.value)}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={difficulty.value}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105",
                        field.value === difficulty.value
                          ? "border-primary bg-primary/10 shadow-md"
                          : difficulty.color
                      )}
                    >
                      <span className="font-semibold text-base">{difficulty.label}</span>
                      <span className="text-xs mt-1 text-center opacity-80">{difficulty.description}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specificInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Specific Instructions (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any specific requirements, subtopics, or focus areas..."
                {...field}
                rows={4}
                className="text-base resize-none border-2 focus:border-primary transition-colors"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="questionTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Question Types</FormLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {questionTypeOptions.map((item) => {
                const isSelected = field.value?.includes(item.id);
                const colorMap = {
                  "Multiple Choice": "bg-indigo-100 border-indigo-300 text-indigo-900 hover:bg-indigo-200",
                  "Descriptive": "bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200"
                };
                
                return (
                  <div key={item.id}>
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={isSelected}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        return checked
                          ? field.onChange([...(field.value || []), item.id])
                          : field.onChange(
                              field.value?.filter((value) => value !== item.id)
                            )
                      }}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={item.id}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 min-h-[80px]",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md"
                          : colorMap[item.id as keyof typeof colorMap]
                      )}
                    >
                      <item.icon className="h-5 w-5 mb-2" />
                      <span className="font-semibold text-sm text-center leading-tight">{item.label}</span>
                    </Label>
                  </div>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="questionStyles"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Question Styles</FormLabel>
            {watchQuestionStyles?.includes('Comprehension-based MCQs') && (
              <Alert className="mt-2 text-xs p-2">
                <AlertTriangle className="h-4 w-4"/>
                <AlertDescription>
                  When 'Comprehension-based' is selected, the AI will generate a reading passage for the quiz.
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {questionStyleOptions.map((item) => {
                const isSelected = field.value?.includes(item.id);
                const colorMap = {
                  "Knowledge-based": "bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200",
                  "Conceptual": "bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200", 
                  "Numerical": "bg-green-100 border-green-300 text-green-900 hover:bg-green-200",
                  "Past Paper Style": "bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200",
                  "Comprehension-based MCQs": "bg-red-100 border-red-300 text-red-900 hover:bg-red-200"
                };
                
                return (
                  <div key={item.id}>
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={isSelected}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        return checked
                          ? field.onChange([...(field.value || []), item.id])
                          : field.onChange(
                              field.value?.filter((value) => value !== item.id)
                            )
                      }}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={item.id}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 min-h-[80px]",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md"
                          : colorMap[item.id as keyof typeof colorMap]
                      )}
                    >
                      <item.icon className="h-5 w-5 mb-2" />
                      <span className="font-semibold text-sm text-center leading-tight">{item.label}</span>
                    </Label>
                  </div>
                );
              })}
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

      <Button type="submit" size="lg" className="w-full bg-primary">
        <Sparkles className="mr-2 h-5 w-5"/>
        Generate Quiz
      </Button>
    </form>
  );
}
