
"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud, Sparkles, BrainCircuit, FileImage, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
// Dynamic import for AI function
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import GenerateQuizPage from "../generate-quiz/page";
import type { Quiz } from "../generate-quiz/page";
import { useAuth } from "@/context/AuthContext";
import { GenerationAd } from "@/components/ads/ad-banner";


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length == 1, "Please upload a file.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf, .jpg, .png, and .webp files are accepted."
    ),
  numberOfQuestions: z.number().min(1).max(55),
  difficulty: z.enum(["easy", "medium", "hard", "master"]),
  questionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one question type.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const questionTypeOptions = [
    { id: "Multiple Choice", label: "Multiple Choice" },
    { id: "Descriptive", label: "Short/Long Questions" },
]

export default function GenerateFromFilePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfQuestions: 10,
      difficulty: "medium",
      questionTypes: ["Multiple Choice"],
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: FormValues) {
    setIsGenerating(true);
    setQuiz(null);
    setFormValues(values);

    const file = values.file[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        // Create a plain object to pass to the server action
        const plainInput = {
          documentDataUri: dataUri,
          numberOfQuestions: values.numberOfQuestions,
          difficulty: values.difficulty,
          questionTypes: values.questionTypes,
          isPro: user?.plan === 'Pro',
        };
        
        const { generateQuizFromDocument } = await import('@/ai/flows/generate-quiz-from-document');
        const result = await generateQuizFromDocument(plainInput);

        if (!result.quiz || result.quiz.length === 0) {
           throw new Error("The AI failed to generate questions from the provided file. It might be empty, unreadable, or too complex. Please try another file.");
        }

        setQuiz(result.quiz);
      } catch (error: any) {
        toast({
          title: "Error Generating Quiz",
          description: error.message || "An error occurred while generating the quiz from the file. Please try again.",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    };

    reader.readAsDataURL(file);
  }
  
  if (isGenerating) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60svh] text-center p-4">
            <div className="relative">
                <BrainCircuit className="h-20 w-20 text-primary" />
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="h-8 w-8 text-accent animate-pulse" />
                </motion.div>
            </div>
            <h2 className="text-2xl font-semibold mb-2 mt-6">Analyzing your file...</h2>
            <p className="text-muted-foreground max-w-sm mb-6">Our AI is reading your document and crafting questions. This may take a moment.</p>
            <GenerationAd />
        </div>
    )
  }
  
  if (quiz && formValues) {
    return (
        <GenerateQuizPage 
            initialQuiz={quiz} 
            initialFormValues={{
                 topic: `Quiz from ${fileName}`,
                 difficulty: formValues.difficulty,
                 numberOfQuestions: quiz.length,
                 questionTypes: formValues.questionTypes,
                 questionStyles: [],
                 timeLimit: formValues.numberOfQuestions,
                 specificInstructions: `Generated from file: ${fileName}`
            }}
         />
    )
  }

  return (
    <>
      <PageHeader
        title="Smart File-to-Quiz Engine"
        description="Upload a document or image to automatically generate a quiz."
      />

      <div className="max-w-2xl mx-auto">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <CardContent className="pt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload File</FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {fileName ? (
                                        <>
                                            {fileType?.startsWith("image/") ? <FileImage className="w-8 h-8 mb-4 text-primary"/> : <FileText className="w-8 h-8 mb-4 text-primary"/>}
                                            <p className="mb-2 text-sm text-primary font-semibold">{fileName}</p>
                                            <p className="text-xs text-muted-foreground">Click to change file</p>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                                            <p className="text-xs text-muted-foreground">PDF, JPG, PNG, WEBP (MAX. 10MB)</p>
                                        </>
                                    )}
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" {...fileRef} onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(e.target.files);
                                    setFileName(file.name);
                                    setFileType(file.type);
                                  }
                                }} accept=".pdf,.jpg,.jpeg,.png,.webp" />
                            </label>
                          </div>
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
                          <FormLabel>Number of Questions: <span className="text-primary font-bold">{field.value}</span></FormLabel>
                           <FormControl>
                              <Slider onValueChange={(value) => field.onChange(value[0])} defaultValue={[field.value]} max={55} min={1} step={1} />
                          </FormControl>
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
                              className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2"
                            >
                              {["easy", "medium", "hard", "master"].map((level) => (
                                 <FormItem key={level} className="flex-1">
                                    <FormControl>
                                       <RadioGroupItem value={level} id={level} className="sr-only peer" />
                                    </FormControl>
                                    <Label htmlFor={level} className="flex h-full flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-secondary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer capitalize">
                                      {level}
                                    </Label>
                                  </FormItem>
                              ))}
                            </RadioGroup>
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {questionTypeOptions.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="questionTypes"
                                render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                      <FormControl>
                                        <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => (checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id)))} />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer flex-1">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                </CardContent>
                <CardContent>
                   <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Quiz
                    </Button>
                </CardContent>
              </form>
            </Form>
          </Card>
      </div>
    </>
  );
}
