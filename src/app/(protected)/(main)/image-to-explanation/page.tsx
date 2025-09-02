
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, UploadCloud, BrainCircuit, Camera } from "lucide-react";
import Image from "next/image";

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
type ExplainImageOutput = any;
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, "Please upload an image.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      ".jpg, .png, and .webp files are accepted."
    ),
  query: z.string().min(5, "Please ask a question about the image."),
});

export default function ExplainImagePage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState<ExplainImageOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "Explain this diagram step-by-step.",
    },
  });

  const fileRef = form.register("image");
  const watchedImage = form.watch("image");

  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
    }
  }, [watchedImage]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    setExplanation(null);

    const file = values.image[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const dataUri = reader.result as string;
      try {
        const { explainImage } = await import('@/ai/flows/explain-image');
      const result = await explainImage({
          imageDataUri: dataUri,
          query: values.query,
        });
        setExplanation(result);
      } catch (error) {
        toast({
          title: "Error Generating Explanation",
          description: "An error occurred while analyzing the image. The AI might be busy. Please try again.",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsGenerating(false);
      }
    };

    reader.readAsDataURL(file);
  }
  
  return (
    <>
      <PageHeader
        title="Explain from Image"
        description="Upload a diagram or image, and let our AI explain it to you."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="lg:sticky top-20 h-fit">
          <CardHeader>
            <CardTitle>Upload Your Image</CardTitle>
            <CardDescription>Provide an image and a question to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image File</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center w-full">
                          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent relative">
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Selected preview" fill className="object-contain rounded-lg p-2" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (MAX. 5MB)</p>
                                </div>
                            )}
                            <input id="dropzone-file" type="file" className="hidden" {...fileRef} accept="image/jpeg,image/png,image/webp" />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Question</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Explain the Krebs cycle shown here." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                  {isGenerating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Get Explanation</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>AI Explanation</CardTitle>
            <CardDescription>The explanation from our AI will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="relative mb-4">
                        <BrainCircuit className="h-16 w-16 text-primary" />
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                        </motion.div>
                    </div>
                    <p className="text-lg text-muted-foreground">Our AI is analyzing the image...</p>
              </div>
            )}
            {explanation && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {explanation.explanation}
              </div>
            )}
            {!isGenerating && !explanation && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Camera className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">The generated explanation will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
