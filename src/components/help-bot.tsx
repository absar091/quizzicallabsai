
"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Bot, ChevronsUp, Send, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { faqs, initialQuestions, FAQ } from "@/lib/faqs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { generateHelpBotResponse } from "@/ai/flows/generate-help-bot-response";

type ConversationMessage = {
    type: 'question' | 'answer' | 'thinking';
    text: string;
    sender: 'user' | 'bot';
    related?: string[];
};

type HelpBotProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function HelpBot({ isOpen, onOpenChange }: HelpBotProps) {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    onOpenChange(true);
    if (conversation.length === 0) {
      setConversation([
        {
          type: 'answer',
          sender: 'bot',
          text: "Hello! I'm the Quizzicallabs AI assistant. How can I help you today?",
          related: initialQuestions
        }
      ]);
    }
  };

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
        // Scroll to the bottom when conversation updates
        const viewport = scrollAreaRef.current.querySelector('div');
        if(viewport) {
            setTimeout(() => {
                viewport.scrollTop = viewport.scrollHeight;
            }, 100);
        }
    }
  }, [conversation, isOpen]);

  const addBotAnswer = (answer: string, related?: string[]) => {
    setConversation(prev => {
        // Remove "thinking" message before adding answer
        const newConversation = prev.filter(msg => msg.type !== 'thinking');
        const botMessage: ConversationMessage = {
            type: 'answer',
            sender: 'bot',
            text: answer,
            related: related || initialQuestions,
        };
        return [...newConversation, botMessage];
    });
  }

  const handleQuestionSelect = (questionText: string) => {
    const userMessage: ConversationMessage = { type: 'question', sender: 'user', text: questionText };
    setConversation(prev => [...prev, userMessage]);

    // Show thinking indicator
    setTimeout(() => {
        setConversation(prev => [...prev, { type: 'thinking', sender: 'bot', text: '...' }]);
    }, 300);

    // Simulate thinking delay and then respond
    setTimeout(() => {
        const selectedFaq = faqs.find(faq => faq.question.toLowerCase() === questionText.toLowerCase());

        if (selectedFaq) {
            addBotAnswer(selectedFaq.answer, selectedFaq.related);
        } else {
            // If not found in FAQs, call the AI flow
            generateHelpBotResponse({ query: questionText, faqContext: JSON.stringify(faqs) })
                .then(response => {
                    addBotAnswer(response.answer);
                })
                .catch(error => {
                    console.error("Help Bot AI error:", error);
                    addBotAnswer("I'm sorry, I'm having a little trouble connecting to my brain right now. Please try rephrasing or select a question from the list.");
                });
        }
    }, 1500); // 1.5-second "thinking" delay
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const input = (e.target as HTMLFormElement).elements.namedItem('help-input') as HTMLInputElement;
      const question = input.value.trim();
      if(question) {
          handleQuestionSelect(question);
          input.value = "";
      }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md"
            >
                <Card className="w-full h-[70vh] max-h-[600px] flex flex-col shadow-2xl">
                <CardHeader className="flex-row items-center justify-between border-b bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-full">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Help Assistant</CardTitle>
                        <CardDescription className="text-xs">Powered by Quizzicallabs AI</CardDescription>
                    </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8" aria-label="Close help bot">
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                            {conversation.map((msg, index) => (
                            <div key={index} className={cn("flex w-full", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                                <div className={cn(
                                "max-w-[85%] p-3 rounded-2xl text-sm flex-initial whitespace-pre-wrap", 
                                msg.sender === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"
                                )}>
                                    {msg.type === 'thinking' ? (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 animate-pulse"/>
                                            <span>Thinking...</span>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                            ))}
                            {conversation.length > 0 && conversation[conversation.length - 1].sender === 'bot' && conversation[conversation.length - 1].related && (
                                <div className="flex flex-col items-start gap-2 w-full pt-2">
                                    {conversation[conversation.length - 1].related!.map((q, i) => (
                                        <Button key={i} variant="outline" size="sm" className="h-auto whitespace-normal py-1.5 w-full justify-start text-left" onClick={() => handleQuestionSelect(q)}>
                                            {q}
                                        </Button>
                                    ))}
                                </div>
                            )}
                    </div>
                    </ScrollArea>
                </CardContent>
                <form onSubmit={handleFormSubmit} className="p-4 border-t bg-muted/50">
                    <div className="relative">
                        <Input name="help-input" placeholder="Ask a question..." className="pr-10"/>
                        <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" aria-label="Send message">
                            <Send className="h-4 w-4"/>
                        </Button>
                    </div>
                </form>
                </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
