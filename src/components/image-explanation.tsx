'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Loader2, Sparkles, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ImageExplanationProps {
  className?: string;
}

export default function ImageExplanation({ className }: ImageExplanationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file (JPEG, PNG, WebP)',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image smaller than 10MB',
        variant: 'destructive'
      });
      return;
    }

    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleExplainImage = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to use image explanation',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedImage || !query.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please select an image and enter your question',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setExplanation('');

    try {
      // Get the Firebase user to access getIdToken method
      const { auth } = await import('@/lib/firebase');
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        throw new Error('No authenticated user found');
      }
      
      const idToken = await firebaseUser.getIdToken();

      const response = await fetch('/api/ai/explain-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          imageDataUri: selectedImage,
          query: query.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setExplanation(data.explanation);
        toast({
          title: 'Explanation Generated!',
          description: 'AI has analyzed your image successfully',
        });
      } else {
        throw new Error(data.error || 'Failed to generate explanation');
      }

    } catch (error: any) {
      console.error('Image explanation error:', error);
      toast({
        title: 'Explanation Failed',
        description: error.message || 'Failed to generate explanation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    setExplanation('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const event = { target: { files: [file] } } as any;
        handleImageSelect(event);
      }
    }
  };

  return (
    <div className={className}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Image Explanation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload an image and ask questions about it. Perfect for diagrams, charts, and educational content.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Upload Image</Label>
            
            {!selectedImage ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop an image here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPEG, PNG, WebP (max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="relative w-full max-w-md mx-auto">
                  <Image
                    src={selectedImage}
                    alt="Selected image"
                    width={400}
                    height={300}
                    className="rounded-lg object-contain border"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowPreview(true)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  {imageFile?.name} ({Math.round((imageFile?.size || 0) / 1024)}KB)
                </p>
              </div>
            )}
          </div>

          {/* Query Input */}
          <div className="space-y-2">
            <Label htmlFor="query">Your Question</Label>
            <Textarea
              id="query"
              placeholder="What would you like to know about this image? e.g., 'Explain this diagram', 'What process is shown here?', 'Describe the components'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Action Button */}
          <Button
            onClick={handleExplainImage}
            disabled={!selectedImage || !query.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Explain Image
              </>
            )}
          </Button>

          {/* Explanation Result */}
          <AnimatePresence>
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                      AI Explanation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {explanation}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Image preview"
                width={800}
                height={600}
                className="rounded-lg object-contain max-h-[80vh]"
              />
              <Button
                className="absolute top-4 right-4"
                variant="secondary"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}