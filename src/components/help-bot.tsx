
"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Bot, User, ChevronsUp, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { faqs, initialQuestions, FAQ } from "@/lib/faqs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

type ConversationMessage = {
    type: 'question' | 'answer';
    text: string;
    sender: 'user' | 'bot';
    related?: string[];
};

export default function HelpBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
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


  const handleQuestionSelect = (questionText: string) => {
    const selectedFaq = faqs.find(faq => faq.question === questionText);

    const userMessage: ConversationMessage = { type: 'question', sender: 'user', text: questionText };
    setConversation(prev => [...prev, userMessage]);

    setTimeout(() => {
        let botMessage: ConversationMessage;
        if (selectedFaq) {
            botMessage = {
                type: 'answer',
                sender: 'bot',
                text: selectedFaq.answer,
                related: selectedFaq.related
            };
        } else {
            botMessage = {
                type: 'answer',
                sender: 'bot',
                text: "I'm sorry, I don't have a pre-defined answer for that. You can try rephrasing or ask another question from the list.",
                related: initialQuestions,
            };
        }
        setConversation(prev => [...prev, botMessage]);
    }, 500); // Small delay to simulate thinking
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl">
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
                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                   <div className="space-y-4">
                        {conversation.map((msg, index) => (
                           <div key={index} className={cn("flex w-full", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                             <div className={cn(
                                "max-w-[85%] p-3 rounded-2xl text-sm flex-initial", 
                                msg.sender === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"
                              )}>
                                {msg.text}
                             </div>
                           </div>
                        ))}
                        {conversation.length > 0 && conversation[conversation.length - 1].sender === 'bot' && conversation[conversation.length - 1].related && (
                            <div className="flex flex-col items-start gap-2 w-full pt-2">
                                {conversation[conversation.length - 1].related!.map((q, i) => (
                                    <Button key={i} variant="outline" size="sm" className="h-auto py-1.5 w-full justify-start text-left" onClick={() => handleQuestionSelect(q)}>
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
                      <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                          <Send className="h-4 w-4"/>
                      </Button>
                  </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { delay: 0.5, type: 'spring', stiffness: 200 } }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={handleOpen}>
          {isOpen ? <ChevronsUp className="h-6 w-6"/> : <Bot className="h-6 w-6" />}
        </Button>
      </motion.div>
    </>
  );
}
