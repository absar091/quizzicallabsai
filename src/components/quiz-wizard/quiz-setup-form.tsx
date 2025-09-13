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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Quiz Generator"
        description="Create personalized tests on any topic, with custom difficulty and question styles."
      />

      {/* 🔍 MISSING TOPIC FIELD - THIS WAS CAUSING THE ISSUE! */}
      <FormField
        control={form.control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quiz Topic *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., MDCAT Biology - Cell Structure, Algebra Basics, Newton's Laws..."
                {...field}
                className="text-base"
              />
            </FormControl>
            <FormMessage />
            <Alert className="mt-2 text-xs p-2">
              <AlertTriangle className="h-4 w-4"/>
              <AlertDescription>
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
            <FormLabel>Difficulty Level</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy" className="font-normal cursor-pointer">
                    Easy - Basic concepts and simple applications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="font-normal cursor-pointer">
                    Medium - Conceptual understanding and moderate complexity
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard" className="font-normal cursor-pointer">
                    Hard - Complex problem-solving and advanced concepts
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="master" id="master" />
                  <Label htmlFor="master" className="font-normal cursor-pointer">
                    Master - Expert-level knowledge (MDCAT/ETEA exam standard)
                  </Label>
                </div>
              </RadioGroup>
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
            <FormLabel>Specific Instructions (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any specific requirements, subtopics, or focus areas..."
                {...field}
                rows={3}
                className="text-base resize-none"
              />
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
            <FormLabel>Question Types</FormLabel>
            <div className="grid grid-cols-1 gap-4 pt-2">
              {questionTypeOptions.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="questionTypes"
                  render={({ field }) => {
                    return (
                      <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border p-4">
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
        name="questionStyles"
        render={() => (
          <FormItem>
            <FormLabel>Question Styles</FormLabel>
            {watchQuestionStyles?.includes('Comprehension-based MCQs') && (
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
                      <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border p-4">
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

      <Button type="submit" size="lg" className="w-full bg-primary">
        <Sparkles className="mr-2 h-5 w-5"/>
        Generate Quiz
      </Button>
    </div>
  );
}
