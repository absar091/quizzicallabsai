
"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Bot } from "lucide-react";
import { ChevronsUp } from "lucide-react";
import { Send } from "lucide-react";
import { Sparkles } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { faqs, initialQuestions, FAQ } from "@/lib/faqs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
// Removed direct AI import - using API route instead
import { sanitizeHtml, validateInput, sanitizeLogInput } from "@/lib/security";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";


type ConversationMessage = {
    type: 'question' | 'answer' | 'thinking';
    text: string;
    sender: 'user' | 'bot';
    related?: string[];
};

export default function HelpBot() {
  // Safety check to ensure AuthContext is available
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return null;
  }
  
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && conversation.length === 0) {
      handleQuestionSelect("Initial Greeting"); // Special case to trigger welcome
    }
  }, [isOpen]);

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
    setIsLoading(false);
    setConversation(prev => {
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
    if (questionText !== "Initial Greeting") {
        const userMessage: ConversationMessage = { type: 'question', sender: 'user', text: questionText };
        setConversation(prev => [...prev, userMessage]);
    } else if (conversation.length > 0) {
        // Don't re-add greeting if convo exists
        return;
    }

    setIsLoading(true);
    setConversation(prev => [...prev, { type: 'thinking', sender: 'bot', text: '...' }]);

    // Simulate thinking delay and then respond
    setTimeout(() => {
        if (questionText === "Initial Greeting") {
            addBotAnswer("Hello! I'm the Quizzicallabs AI assistant. How can I help you today?", initialQuestions);
            return;
        }

        const selectedFaq = faqs.find(faq => faq.question.toLowerCase() === questionText.toLowerCase());

        if (selectedFaq) {
            addBotAnswer(selectedFaq.answer, selectedFaq.related);
        } else {
            fetch('/api/ai/help-bot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: validateInput(questionText, 500), 
                    faqContext: JSON.stringify(faqs),
                    userPlan: user?.plan || 'Free'
                })
            })
                .then(response => response.json())
                .then(data => {
                    addBotAnswer(data.answer);
                })
                .catch(error => {
                    console.error("Help Bot AI error:", sanitizeLogInput((error as Error)?.message || 'Unknown error'));
                    addBotAnswer("I'm sorry, I'm having a little trouble connecting to my brain right now. Please try rephrasing or select a question from the list.");
                });
        }
    }, 1000);
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
      <Button
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Help Assistant"
      >
          <MessageCircle className="h-7 w-7" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 border-0 max-w-md w-[95vw] h-[80vh] max-h-[700px] flex flex-col">
          <DialogHeader className="p-4 flex-row items-center space-y-0 gap-4 border-b bg-muted/50">
             <div className="p-2 bg-primary rounded-full">
                <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-left">
                <DialogTitle>Help Assistant</DialogTitle>
                <DialogDescription>Powered by Quizzicallabs AI</DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
             <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                      {conversation.map((msg, index) => {
                        if (msg.type === 'thinking') {
                             return (
                               <div key={index} className="flex justify-start">
                                 <div className="max-w-[85%] p-3 rounded-2xl text-sm flex-initial whitespace-pre-wrap bg-muted text-muted-foreground rounded-bl-none">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 animate-pulse"/>
                                        <span>Thinking...</span>
                                    </div>
                                 </div>
                               </div>
                             );
                        }
                        return (
                          <div key={index} className={cn("flex w-full", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                              <div className={cn(
                              "max-w-[85%] p-3 rounded-2xl text-sm flex-initial whitespace-pre-wrap", 
                              msg.sender === 'user' ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"
                              )}>
                                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.text) }} />
                              </div>
                          </div>
                        );
                      })}

                      {!isLoading && conversation.length > 0 && conversation[conversation.length - 1].related && (
                          <div className="flex flex-col items-start gap-2 w-full pt-4">
                              {conversation[conversation.length - 1].related!.map((q, i) => (
                                  <Button key={i} variant="outline" size="sm" className="h-auto whitespace-normal py-1.5 w-full justify-start text-left" onClick={() => handleQuestionSelect(q)}>
                                      {q}
                                  </Button>
                              ))}
                          </div>
                      )}
              </div>
              </ScrollArea>
          </div>
          <form onSubmit={handleFormSubmit} className="p-4 border-t bg-muted/50">
              <div className="relative">
                  <Input name="help-input" placeholder="Ask a question..." className="pr-10"/>
                  <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" aria-label="Send message" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                  </Button>
              </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
